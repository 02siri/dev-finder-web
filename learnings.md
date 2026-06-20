# Dev-Finder UI

- Create Vite + React project 
- Install Taiwind postcss [CSS framework] [tailwind v3]
- Install DaisyUI [Design Component Library]
- Create Separate navbar component [/components/NavBar.jsx]
- Install react-router-dom
- Create <BrowserRouter>
    - Create <Routes> component
        - Create <Route = "/body"> 
            - Create Route Children > Create Outlet 
        - Created Footer
- Create login page
- Install Axios for making API call (can also use fetch)
- Install cors in backend => add middleware to app.js with configs (origin, credentials: true)
- Whenver making API call from frontend using Axios, pass {withCredentials:true} => to send token from backend to frontend, for authentication
- Install redux toolkit and react-redux packages : https://redux.js.org/tutorials/quick-start
    -> configureStore
        -> Provide store in App.js
    -> Create slice
    -> add reducer to Store

- Updating NavBar on Login (photo + Welcome msg)
- Refactor BASE_URL 

- In Body component, check if token is valid, when user logs in (by checking the profile/view API).
    - If not, redirect to the login page.
- API call to view profile should be made only once after logging in, because it should check from the redux store if user data is present 
- Logout feature 
- Get the feed and add the feed in the store 
- Build user card in the feed
- Edit profile feature 
- Show toast message on save of profile
- See all my connections
- See all my connection requests
- Accept/Reject connection requests
- Send/Ignore user card from feed
- Signup feature, redirecting to profile



# DEPLOYMENT
- Sign Up on AWS
- Launch Instance 
- Change scret Key permissions : chmod 400 <secret>.pem
- Connect to machine: ssh -i "<secret>.pem" ubuntu@ec2-3-27-65-46.ap-southeast-2.compute.amazonaws.com
- Install nvm : curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
- Install node version : nvm install 23.9

- Clone frontend project : git clone https://github.com/02siri/dev-finder-web.git
- Clone backend project: git clone https://github.com/02siri/Dev-Finder.git

Frontend:
    - Install dependencies : npm install
    - Build Project: npm run build
    - Update : sudo apt update
    [Used nginx because it gives an http server]
    - Using nginx to host our frontend project: sudo apt install nginx
    - Start nginx : sudo systemctl start nginx
    - Enable nginx : sudo systemctl enable nginx
    - Copy code from dist folder (build folder) to nginx http server - /var/www/html : sudo scp -r dist/* /var/www/html/
    - Enable port 80 on your instance

Backend: 
    - Allowed  EC2 instance public IP on Mongo server
    - Run backend server : npm start
    - Install pm2 (Process manager to keep your application running 24*7): npm install pm2 -g
    - Start using pm2: pm2 start npm -- start
    - Change name of process while starting: pm2 start <old name> --name "<new name>" -- start
    - To check pm2 logs: pm2 logs
    - pm2 list, pm2 flush <name>, pm2 stop <name>, pm2 delete <name>
    - Change name of process while starting: pm2 start <old name> --name "<new name>" -- start

    - nginx acts as a load balancer to the serer ; sits at the front to allow/disallow any request

    - open nginx config: /etc/nginx/sites-available/default
    - nginx config for proxy pass and server name: 
        server_name 3.27.65.46;

        location /api/ {
        proxy_pass http://localhost:7777/;
        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    - restart nginx : sudo systemctl restart nginx

    - modified BASE_URL path to /api/

# Adding a Custom Domain Name 
    - Purchased domain name from NameCheap
    - DNS setup from CloudFlare
    - Add cloudflare nameservers at NameCheap 
    - DNS A record: dev-finder.online -> map to IPv4 address (EC2)
    - Set SSL certificate as 'Flexible' in CloudFlare (Website runs on HTTPS but not fully)
        From browser -> Cloudflare: Secure
        Cloudflare -> Server: Normal

# Sending Emails Via Amazon SES
    - AWS IAM:  
        - Create a IAM user
        - Give access to AmazonSESFullAccess
    - Amazon SES:
        - Create Identity
        - Verify Domain name
        - Verify Email Address identity
        - Install AWS SES SDK (v3) 
        - Code Examples: https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/javascriptv3/example_code/ses#code-examples
        - Setup SES client
        - Access Credentials should be created in IAM under security credentials tab
        - Add creds to .env
        - Create code for SES Client
        - Code for sending email
        - Make email dynamic by passing more params to the run function
    
# Scheduling cron jobs in NodeJs
    - Installing node-cron
    - Learning about cron expressions syntax - crontab.guru
    - Schedule a job
    - date-fns
    - Find all the unique emailIds who've got friend requests in previous day
    - Send email
    - Explore queue mechanism to send bulk emails (or else it will cause performance bottleneck) or Amazon SES bulk emails sending
    - Make sendEmail function dynamic
    - Explore email body templates
    - bee-queue and bull npm packages for queueing 

# Stripe Payment Gateway Integration
    - Created a UI for premium page
    - Created an API for createOrder in backend
    - Added key & secret
    - Initialised Stripe in utils
    - creating product + price on Stripe
    - Created model & schema of Payment
    - Saved the order in payments collection
    - Make the API dynamic (can work for silver/gold/premium memberships)
    - Setup Stripe webhook on your live API

 # Real Time Chat using Websocket (Socket.io)
    - Build the UI for a chat windoe on /chat/:targetUserId
    -Set up Socket.io in backend:
        - 1. Installation: npm i socket.io
        - 2. Extract http from http 
             const http = require("http")
        - 3. Created server using http using existing app 
             const server = http.createServer(app);
        - 4. Import socket from socket package 
             const socket = require("socket.io");
        - 5. Create io, and pass the server with its config
             const io = socket(server, {
                //config
                cors : {
                    origin: "http://localhost:5173",
                },
            })
        - 6. Start listening to the connection 
             io.on("connection", (socket)=>{
                //handle events
            })
        - 7. Replace app.listen with server.listen
             server.listen(...)
    - Set up Socket.io in frontend:
        - 1. Installation : npm i socket.io-client
        - 2. Exporting io and creating connection: 
                import { io } from "socket.io-client";
                export const createSocketConnection = () => {
                //give it a URL where you want it to connect -> BE
                return io(BASE_URL);
                };
        - 3. in Chat.jsx, create the socket connection & Emit an event/Listen to Events
        - 4. As soon as the component unlaods, disconnect the socket
    - HW: 
        - Improve the UI
        - Fix security bug - Auth in web sockets. ✅
        - Fix bug - If I'm not a friend, I can't send/receive messages ✅
        - Ft: Show green symbol when online/ Last seen ...hrs ago
        - Own Ft: Notifications for conn Requests/msg
        - Limit Msgs when fetching from DB/Build pagination - show 10 msgs, then scroll then 10 msgs.
        - Project Ideas :
            - Tic Tac Toe game
            - Chess game
            - TypeRacer

# Auth in WebSockets
    1. BACKEND
    middlewares/auth.js
    - Created a cookie-parser to help parse raw Cookie header string into an object
    - Created a socket middleware to authenticate the cookie using the token, decoding the token, verifying the user and then authenticating it. 

    Because the authentication token is stored inside an httpOnly cookie (token), JavaScript running in the browser cannot read it directly. However, the browser will send it automatically in the headers during the WebSocket HTTP handshake.

    utils/server.js
    - Configured CORS settings for the Socket.io server to allow credentials by setting credentials: true.
    - Registered the authentication middleware: io.use(socketAuth).
    - Modified the event handlers (joinChat and sendMessage) to retrieve user details directly from the authenticated socket.user object (e.g. socket.user._id, socket.user.firstName) instead of accepting those parameters from the client request. This prevents any spoofing of user identities.

    2. FRONTEND
    utils/socket.js
    - We need to tell the Socket.io client to send cookies when connecting to the server.
    Added { withCredentials: true } configuration options to the client-side socket connection so that cookies are included.

    components/Chat.jsx
    - Imported useRef to store the active socket connection.
    - In useEffect, the connection is established once when mounting, saved in socketRef.current, and cleaned up (socket.disconnect()) when unmounting.
    - Modified sendMessage to emit the message using the existing active connection (socketRef.current), rather than creating a new connection.
    - Added a connect_error socket event listener to log any authentication or connection errors to the console.

# Chat Pagination
BE: routes/chat.js
- Get total number of messages in the conversation by selecting only the array IDs
- Calculate limits and slices

FE: Chat.jsx
- Pagination and hasMore state.
- Detect scroll-to-top event on the chat container (within 50px of the top).
- Fetch the next page and prepend the new messages to the message state.
- Retain the scroll height offset so the viewport doesn't jump abruptly when loading older messages.
- Implement ref-based scrolling:
    - Initial load / Page 1: Instantly scroll to the bottom of the chat container.
    - New message received/sent: Scroll to the bottom only if the user is already scrolled near the bottom. Otherwise, show a floating helper message or keep viewport stable.
    - Pagination loads: Do not scroll to the bottom; maintain scroll position.