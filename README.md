<img width="2880" height="1800" alt="DevFinder" src="https://github.com/user-attachments/assets/ab77d36c-8002-4db6-96b6-d02eab91175c" />

Live app: https://dev-finder.online

Walkthrough video: https://drive.google.com/file/d/1qvWsZd2BNCEeFTG0J9zBoRXWW4U5UUlt/view?usp=sharing

# DevFinder Frontend

This is the React web client for DevFinder, a full-stack social networking platform for software developers. It provides a modern interface where developers can discover matches, review pending requests, upgrade their accounts, and chat in real-time.

## Tech Stack
- **Framework & Tooling**: Vite + React
- **Styling**: TailwindCSS (v3) + daisyUI
- **State Management**: Redux Toolkit & React Redux
- **Routing**: React Router DOM (v7)
- **HTTP Transport**: Axios
- **Real-Time Communication**: Socket.io-client

---

## Client Features

### 1. State Management
- **Redux Store Slices**: Manages global UI states, including user profiles, candidate feeds, connections, and request synchronization.

### 2. Session Integrity
- **Cookie Security**: Employs global Axios configurations to ensure secure session credentials are automatically attached to network queries.

### 3. Real-Time Chat & Inbox
- **Room Subscriptions**: Establishes secure WebSocket client helper connections.
- **Dynamic Notifications**: Listens to message notifications dynamically, updating badge counts and cleaning up resources on component unmounts.

### 4. Interactive Pages
- **Profile & Payments**: Features profile editing interfaces and options to upgrade account plans, verifying user premium status.

---

## Local Setup & Development

### 1. Base Endpoint Configuration
Before running, inspect your API base endpoint configuration in `/src/utils/constants.js` to ensure it targets your local server or production URL appropriately.

### 2. Run the Development Server
Install dependencies and run the server:
```bash
npm install
npm run dev
```

The frontend runs locally on Vite's default development port.

---

## Deployment & Hosting
Static assets are built locally or on the server, then hosted on an **AWS EC2 Instance** behind Nginx.

### Step 1: Connect to your EC2 Instance
Access your virtual machine via SSH:
```bash
ssh -i "your-key-file.pem" ubuntu@your-ec2-ip-address
```

### Step 2: Build Static Files
Bundle and optimize static assets:
```bash
npm run build
```

This generates a static `dist` distribution folder.

### Step 3: Deploy to Web Server
Copy the output distribution bundle to the Nginx standard hosting directory:
```bash
sudo cp -r dist/* /var/www/html/
```

### Step 4: Reload Nginx
Restart Nginx to apply changes:
```bash
sudo systemctl restart nginx
```

### Step 5: Domain & DNS Setup
- Domain name registration is managed via **NameCheap**.
- DNS mapping, routing, and SSL certificate termination are configured via **Cloudflare** to guarantee secure HTTPS connections.
