package main

import (
	"bufio"
	"context"
	"crypto/aes"
	"crypto/cipher"
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"io"
	"net"
	"strings"
	"sync"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx        context.Context
	allClients map[net.Conn]string
	conn       net.Conn
	listener   net.Listener
	mutex      sync.Mutex
	maxClients int
	secretKey  string
}

func NewApp() *App {
	return &App{allClients: make(map[net.Conn]string)}
}

func (a *App) startup(ctx context.Context) { a.ctx = ctx }

func (a *App) encrypt(text string) string {
	block, err := aes.NewCipher([]byte(a.secretKey))
	if err != nil { return text }
	ciphertext := make([]byte, aes.BlockSize+len(text))
	iv := ciphertext[:aes.BlockSize]
	if _, err := io.ReadFull(rand.Reader, iv); err != nil { return text }
	stream := cipher.NewCFBEncrypter(block, iv)
	stream.XORKeyStream(ciphertext[aes.BlockSize:], []byte(text))
	// Append HMAC for integrity
	mac := hmac.New(sha256.New, []byte(a.secretKey))
	mac.Write(ciphertext)
	macSum := mac.Sum(nil)
	final := append(ciphertext, macSum...)
	return base64.URLEncoding.EncodeToString(final)
}

func (a *App) decrypt(cryptoText string) string {
	ciphertext, err := base64.URLEncoding.DecodeString(cryptoText)
	if err != nil { return cryptoText }
	// Verify HMAC
	if len(ciphertext) < sha256.Size+aes.BlockSize {
		return "SYSTEM: Message integrity failed"
	}
	macStart := len(ciphertext) - sha256.Size
	macSum := ciphertext[macStart:]
	cipherPart := ciphertext[:macStart]
	mac := hmac.New(sha256.New, []byte(a.secretKey))
	mac.Write(cipherPart)
	if !hmac.Equal(macSum, mac.Sum(nil)) {
		return "SYSTEM: Message integrity failed"
	}
	block, err := aes.NewCipher([]byte(a.secretKey))
	if err != nil { return cryptoText }
	if len(cipherPart) < aes.BlockSize { return cryptoText }
	iv := cipherPart[:aes.BlockSize]
	cipherPart = cipherPart[aes.BlockSize:]
	stream := cipher.NewCFBDecrypter(block, iv)
	stream.XORKeyStream(cipherPart, cipherPart)
	return string(cipherPart)
}

func (a *App) StartHost(name string, port string, limit int, key string) string {
	if len(key) != 32 { return "❌ Key must be 32 chars!" }
	a.secretKey = key
	a.maxClients = limit
	ln, err := net.Listen("tcp", ":"+port)
	if err != nil { return "❌ Port busy!" }
	a.listener = ln
	go func() {
		for {
			conn, err := ln.Accept()
			if err != nil {
				break
			}
			a.mutex.Lock()
			if len(a.allClients) >= a.maxClients {
				fmt.Fprintln(conn, a.encrypt("SYSTEM: Room Full"))
				conn.Close()
				a.mutex.Unlock()
				continue
			}
			a.allClients[conn] = "New Ghost"
			a.mutex.Unlock()
			go a.HandleConnection(conn, name, true)
		}
	}()
	return "✅ Room Live on Port " + port
}

func (a *App) JoinRoom(ip string, port string, name string, key string) string {
	if len(key) != 32 { return "❌ Key must be 32 chars!" }
	a.secretKey = key
	conn, err := net.Dial("tcp", ip+":"+port)
	if err != nil { return fmt.Sprintf("❌ Connection Failed: %v", err) }
	a.conn = conn
	fmt.Fprintf(conn, "/name %s\n", name)
	go a.HandleConnection(conn, name, false)
	return "✅ Connected to " + ip
}

func (a *App) SendMessage(msg string, myName string, isServer bool) {
	if isServer {
		// HOST: show locally, then send formatted encrypted message to peers
		formatted := fmt.Sprintf("[%s]: %s", myName, msg)
		runtime.EventsEmit(a.ctx, "new_message", formatted)
		a.BroadcastToPeersOnly(a.encrypt(formatted))
	} else if a.conn != nil {
		encrypted := a.encrypt(msg)
		fmt.Fprintln(a.conn, encrypted)
		// local echo so sender sees their message immediately
		formatted := fmt.Sprintf("[%s]: %s", myName, msg)
		runtime.EventsEmit(a.ctx, "new_message", formatted)
	}
}

func (a *App) BroadcastToPeersOnly(encryptedMsg string) {
	a.mutex.Lock()
	defer a.mutex.Unlock()
	for client := range a.allClients {
		fmt.Fprintln(client, encryptedMsg)
	}
}

func (a *App) HandleConnection(conn net.Conn, myName string, isServer bool) {
	// Ensure connection is cleaned up when handler exits
	defer func() {
		conn.Close()
		if isServer {
			a.mutex.Lock()
			delete(a.allClients, conn)
			a.mutex.Unlock()
		} else {
			if a.conn == conn {
				a.conn = nil
			}
		}
	}()

	reader := bufio.NewReader(conn)
	for {
		msg, err := reader.ReadString('\n')
		if err != nil { break }
		msg = strings.TrimSpace(msg)
		if isServer {
			if strings.HasPrefix(msg, "/name ") {
				a.mutex.Lock()
				a.allClients[conn] = strings.TrimPrefix(msg, "/name ")
				a.mutex.Unlock()
				continue
			}
			a.Broadcast(a.allClients[conn], msg, conn)
		} else {
			decrypted := a.decrypt(msg)
			// If integrity failed, ignore
			if strings.HasPrefix(decrypted, "SYSTEM: Message integrity failed") {
				continue
			}
			runtime.EventsEmit(a.ctx, "new_message", decrypted)
		}
	}
}

func (a *App) Broadcast(sender, encryptedMsg string, exclude net.Conn) {
	a.mutex.Lock()
	defer a.mutex.Unlock()
	decrypted := a.decrypt(encryptedMsg)
	// If integrity failed, ignore
	if strings.HasPrefix(decrypted, "SYSTEM: Message integrity failed") {
		return
	}
	formatted := fmt.Sprintf("[%s]: %s", sender, decrypted)
	runtime.EventsEmit(a.ctx, "new_message", formatted)
	// Send encrypted formatted message to peers (so clients see the name too)
	enc := a.encrypt(formatted)
	for client := range a.allClients {
		if client != exclude {
			fmt.Fprintln(client, enc)
		}
	}
}

func (a *App) KillGhost(isServer bool) {
	// Close listener if running
	if a.listener != nil {
		a.listener.Close()
		a.listener = nil
	}
	// Close client connections
	a.mutex.Lock()
	for client := range a.allClients {
		client.Close()
		delete(a.allClients, client)
	}
	a.mutex.Unlock()
	// Close outbound connection if present
	if a.conn != nil {
		a.conn.Close()
		a.conn = nil
	}
	runtime.Quit(a.ctx)
}