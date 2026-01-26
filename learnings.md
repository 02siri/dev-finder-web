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
        