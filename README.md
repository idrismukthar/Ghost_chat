# <p align="center">👻 GHOST_CHAT V2</p>

<p align="center">
<img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge&logo=statuspage" alt="Status">
<img src="https://img.shields.io/badge/Security-AES--256--CFB-red?style=for-the-badge&logo=go-guardian" alt="Security">
<img src="https://img.shields.io/badge/Network-P2P-orange?style=for-the-badge&logo=p2p" alt="P2P">
</p>

<p align="center">
<strong>The ultimate stealth communication tool. No servers. No logs. Just ghosts.</strong>
</p>

---

## 🛠 Built With

<p align="center">
<img src="https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Go">
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
<img src="https://img.shields.io/badge/Wails-FF4500?style=for-the-badge&logo=wails&logoColor=white" alt="Wails">
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
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
go install [github.com/wailsapp/wails/v2/cmd/wails@latest](https://github.com/wailsapp/wails/v2/cmd/wails@latest)

# Build the Production EXE
wails build

```

### 2️⃣ Start a Ghost Room

1. Run `GhostChat.exe`.
2. Generate a **32-Character Key**. Ensure it is shared securely.
3. Click **HOST**. (Note: Use Tailscale or Port Forwarding for remote access).

### 3️⃣ Join a Transmission

1. Enter the Host's IP (Local, Tailscale, or public IP).
2. Enter the secret 32-character key.
3. Click **JOIN**.

---

## 🛰 Connecting Across Borders (NGA  ↔ UK)

* **Tailscale (Recommended):** Install on both machines and use the Tailscale IP. No router config needed.
* **Port Forwarding:** Forward port `9999` on your router to your host PC.

---

## 🔒 Security Protocol

> [!WARNING]
> This application is intended for private use. Ensure your 32-character key is kept secret. If the key is compromised, your "Ghost" session is no longer secure.

---

<p align="center">
Developed with ❤️ for the Privacy Community.





<b>Stay Ghost. Stay Secure.</b>
</p>
