Twilio-Salesforce Middleware
Overview: Integrates Twilio IVR with Salesforce Case Management using Express.js. Handles inbound calls, creates/updates Salesforce cases (no duplicates via caller phone), and responds with a simple IVR. Flow: Call → Twilio Webhook → Middleware → Salesforce Query/Create/Update → IVR Response.
Prerequisites: Node.js (v18+): nodejs.org, Salesforce Developer Account: developer.salesforce.com/signup, Twilio Account: twilio.com/try-twilio, Ngrok: ngrok.com, Dependencies: express, twilio, axios, dotenv, body-parser.
Setup:

Clone Repo: git clone <your-repo-url>, cd twilio-salesforce-middleware
Install: npm install
Create .env: PORT=3000, BASE_URL=https://your-ngrok-url.ngrok.io, TWILIO_ACCOUNT_SID=your_twilio_sid, TWILIO_AUTH_TOKEN=your_twilio_auth_token, SALESFORCE_CLIENT_ID=your_consumer_key, SALESFORCE_CLIENT_SECRET=your_consumer_secret, SALESFORCE_USERNAME=your_salesforce_email, SALESFORCE_PASSWORD=your_password_plus_security_token, SALESFORCE_INSTANCE_URL=https://your-instance.salesforce.com
Salesforce Setup: Add Caller_Phone__c field to Case object (Setup > Object Manager > Case). Create Connected App (Setup > Apps > App Manager, Callback: http://localhost:3000/callback, Scopes: full, refresh_token, offline_access). Ensure "API Enabled" permission for user.
Twilio Setup: Buy voice-enabled number (Console > Phone Numbers > Buy a Number). Set Voice Webhook: https://your-ngrok-url.ngrok.io/twilio/webhook (POST).
Run Ngrok: ngrok http 3000, update .env (BASE_URL) and Twilio webhook with Ngrok URL.
Start Server: node server.js

Testing: Call Twilio number → Hear IVR → Check Salesforce Cases tab for new/updated case. Test health: GET http://localhost:3000/health.
Components: server.js: Express app with /twilio/webhook, /twilio/gather, /health endpoints. salesforce.js: Salesforce REST API (auth, query, create, update). twilio.js: TwiML for IVR. ivr-script.xml: Standalone IVR script.
Error Handling: Twilio webhook validation (403 on failure). Salesforce API errors logged, TwiML error response returned. Global error middleware (500 with details).
APIs: Salesforce REST (v58.0): OAuth2, Query, Create/Update Case. Twilio: Voice Webhooks, TwiML.
