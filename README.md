# Dev-Finder-web

This is the React web client for DevFinder. It offers a smooth, minimal, and modern interface where developers can swipe to match, review incoming connection requests, view active developer matches, subscribe to premium membership, and chat in real-time.

## Technologies
- **Bundler & Tooling**: Vite + React
- **Styling**: TailwindCSS (v3) + daisyUI (for clean, responsive components)
- **State Management**: Redux Toolkit & React Redux
- **Routing**: React Router DOM (v7)
- **API Calls**: Axios (with credentials configuration for HTTP-only cookies)
- **WebSockets**: Socket.io-client

---

## Client Features

### 1. Global State Management (Redux Store Slices)
Global state is managed by `/src/utils/appStore.js` with the following modular slices:
- **`userSlice`**: Stores details of the currently logged-in user profile. If null, automatically redirects visitors back to the login screen.
- **`feedSlice`**: Stores the queue of developer cards currently available to browse on the user feed dashboard.
- **`connectionSlice`**: Keeps track of all developer contacts whom you have successfully connected with.
- **`requestsSlice`**: Synchronizes pending, incoming connection requests to enable instant accept/reject updates.

### 2. Authentication Flow & Cookie Setup
- All REST requests use Axios. The global Axios configuration enables `withCredentials: true`.
- This ensures that HTTP-only cookie tokens created by the Express API are automatically included in subsequent requests to identify the user session securely.

### 3. Real-Time Chat Interface
- Located in `/src/components/Chat.jsx`.
- Sets up a persistent socket instance using `/src/utils/socket.js`.
- On loading, emits `joinChat` passing the `targetUserId` to establish room connection.
- Displays paginated chat history with scroll mechanics.
- Listens to incoming `messageReceived` events and appends them dynamically to the chat log.
- **Cleanup**: Triggers socket disconnection as soon as the Chat component unmounts to free up socket resources.

### 4. Interactive Profile Customization & Premium Status
- Users can update their name, age, profile photo, and description in `/src/components/EditProfile.jsx`.
- `/src/components/Premium.jsx` offers Silver/Gold/Premium subscription upgrades. Directs users to Stripe checkout links and displays premium badges based on subscription verification endpoints.

### 5. Real-Time Notification Inbox
- Informs users immediately when they receive a new connection request, when their sent connection request is accepted, or when a new chat message arrives.
- Listens to socket events in the background and updates the header badge count dynamically.

---

## Project Structure
```text
src/
├── App.jsx             # Main Router and Redux Provider entrypoint
├── main.jsx            # DOM mounting script
├── index.css           # Global Tailwind directive file
├── components/         # UI Elements
│   ├── Body.jsx        # App layout shell (Navbar, Main Content, Footer)
│   ├── NavBar.jsx      # Navigation, profile dropdowns, and notification badges
│   ├── Landing.jsx     # Landing welcome page
│   ├── Login.jsx       # Login & Register forms
│   ├── Feed.jsx        # Matching cards container
│   ├── UserCard.jsx    # Individual candidate profile card
│   ├── Connections.jsx # Friend list view
│   ├── Requests.jsx    # Accept/reject request drawer
│   ├── Chat.jsx        # Live messaging screen
│   └── Premium.jsx     # Stripe payment activation UI
└── utils/              # Logic utilities
    ├── appStore.js     # Redux root store
    ├── userSlice.js    # Profile slice
    ├── feedSlice.js    # Swipe feed slice
    ├── socket.js       # WebSocket client helper
    └── constants.js    # API Endpoint base configurations
```

---

## Local Setup & Development

### 1. Configure the API Base URL
Before running, check the base server endpoint configured in `/src/utils/constants.js`.
- For local development: `http://localhost:7777`
- For production: `https://dev-finder.online/api`

### 2. Run the Development Server
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your web browser.

---

## Deployment & Hosting
To bundle static files for staging/production:

```bash
# Compile and optimize static assets
npm run build
```

This generates a optimized `dist` folder. In production (AWS EC2), these assets are hosted using **Nginx**:
```bash
# Copy distribution bundle to Nginx standard folder
sudo scp -r dist/* /var/www/html/

# Start & verify Nginx
sudo systemctl restart nginx
```
Cloudflare SSL settings are configured as "Flexible" to guarantee secure HTTPS connections directly to users browsing `https://dev-finder.online`.
