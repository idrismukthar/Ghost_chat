
# <p align="center">👻 GHOST_CHAT V2</p>

<p align="center">
<img src="[https://img.shields.io/badge/Status-Live-success?style=for-the-badge&logo=statuspage](https://www.google.com/search?q=https://img.shields.io/badge/Status-Live-success%3Fstyle%3Dfor-the-badge%26logo%3Dstatuspage)" alt="Status">
<img src="[https://img.shields.io/badge/Security-AES--256--CFB-red?style=for-the-badge&logo=go-guardian](https://www.google.com/search?q=https://img.shields.io/badge/Security-AES--256--CFB-red%3Fstyle%3Dfor-the-badge%26logo%3Dgo-guardian)" alt="Security">
<img src="[https://img.shields.io/badge/Network-P2P-orange?style=for-the-badge&logo=p2p](https://www.google.com/search?q=https://img.shields.io/badge/Network-P2P-orange%3Fstyle%3Dfor-the-badge%26logo%3Dp2p)" alt="P2P">
</p>

<p align="center">
<strong>The ultimate stealth communication tool. No servers. No logs. Just ghosts.</strong>
</p>

---

## 🛠 Built With

<p align="center">
<img src="[https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white](https://www.google.com/search?q=https://img.shields.io/badge/Go-00ADD8%3Fstyle%3Dfor-the-badge%26logo%3Dgo%26logoColor%3Dwhite)" alt="Go">
<img src="[https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB](https://www.google.com/search?q=https://img.shields.io/badge/React-20232A%3Fstyle%3Dfor-the-badge%26logo%3Dreact%26logoColor%3D61DAFB)" alt="React">
<img src="[https://img.shields.io/badge/Wails-FF4500?style=for-the-badge&logo=wails&logoColor=white](https://www.google.com/search?q=https://img.shields.io/badge/Wails-FF4500%3Fstyle%3Dfor-the-badge%26logo%3Dwails%26logoColor%3Dwhite)" alt="Wails">
<img src="[https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white](https://www.google.com/search?q=https://img.shields.io/badge/Vite-646CFF%3Fstyle%3Dfor-the-badge%26logo%3Dvite%26logoColor%3Dwhite)" alt="Vite">
<img src="[https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white](https://www.google.com/search?q=https://img.shields.io/badge/CSS3-1572B6%3Fstyle%3Dfor-the-badge%26logo%3Dcss3%26logoColor%3Dwhite)" alt="CSS3">
</p>

---

## 💎 Features

* 🔒 **End-to-End Encryption (AES-256 CFB):** Symmetric encryption for message confidentiality. Keys are manual and must be **exactly 32 characters**.
* 🛡️ **Message Integrity (HMAC-SHA256):** Each message includes an HMAC to detect tampering or replayed packets.
* 🔁 **Local Echo & Consistent Broadcasts:** Senders see their message immediately, and the server broadcasts formatted messages to prevent duplicates.
* 🖼 **Dynamic UI:** Upload custom wallpapers with real-time **Gaussian Blur** and **Opacity** control.
* 🔊 **Configurable Notifications:** Custom sound alerts play only for incoming messages (senders are muted for their own sends).
* ♻️ **Graceful Cleanup:** KILL closes listener and client connections to avoid stale sockets.


---

## 📂 Project Architecture

| Component | Responsibility |
| --- | --- |
| **Wails Backend** | Handles TCP Sockets, Encryption/Decryption, and Peer Discovery. |
| **React Frontend** | Manages State, Sound effects, and the Hacker UI Engine. |
| **AES-256 CFB** | Ensures that even if a packet is intercepted, it's unreadable garbage. |

---

## 🚀 Quick Start

### 1️⃣ Build from Source

```bash
# Install Wails CLI
go install github.com/wailsapp/wails/v2/cmd/wails@latest

# Build the Production EXE
wails build

```

### 2️⃣ Start a Ghost Room

1. Run `GhostChat.exe`.
2. Generate a **32-Character Key** (Share this with your partner via a secure channel). Ensure it is exactly 32 characters.
3. Click **HOST** (if hosting on a NATed network make sure port forwarding or a tunnel is configured if remote users need to connect).

### 3️⃣ Join a Transmission

1. Enter the Host's IP (Local, Tailscale, or public IP if port forwarded).
2. Enter the secret 32-character key.
3. Click **JOIN** and start transmitting.

Tip: If you see connection failures, verify firewall/router settings or use Tailscale/ngrok for quick tests.

---

## 🛰 Connecting Across Borders (NGA ↔ UK)

A remote client can connect by using the Host's reachable IP and port (e.g., `public-ip:9999`). Common options:

- **Tailscale (recommended for simplicity):** Install Tailscale on both machines and use the provided Tailscale IP — works without port forwarding.
- **Port Forwarding (router):** Forward the chosen port (default `9999`) from your router to the host machine and open firewall rules; remote users connect to your public IP.
- **Tunnels (ngrok/localtunnel):** Use a TCP tunnel to expose your local port temporarily without router config.
- **VPS or VPN:** Run the host on a public server or use a VPN for reliable connectivity.

Always secure the 32-character key out-of-band and avoid exposing your host on public networks without proper precautions.

---

## 🔒 Security Protocol

> [!WARNING]
> This application is intended for private use. Ensure your 32-character key is kept secret. If the key is compromised, your "Ghost" session is no longer secure.

---

<p align="center">
Developed with ❤️ for the Privacy Community.



<b>Stay Ghost. Stay Secure.</b>

</p>

---

