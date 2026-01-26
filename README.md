# Twilio WebRTC Phone Demo

A browser-based phone application using Twilio's Voice SDK for WebRTC calling.

## Prerequisites

- Node.js (v14 or higher)
- npm
- A Twilio account with:
  - Account SID
  - Auth Token
  - API Key and Secret
  - TwiML App SID

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the `.env` file and update with your Twilio credentials:

```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_API_KEY=your_api_key
TWILIO_API_SECRET=your_api_secret
TWILIO_TWIML_APP_SID=your_twiml_app_sid
```

You can find these values at [Twilio Console](https://console.twilio.com/).

### 3. Configure TwiML App

1. Go to [Twilio Console > Voice > TwiML Apps](https://console.twilio.com/us1/develop/voice/manage/twiml-apps)
2. Click on your TwiML App (or create a new one)
3. Set the **Voice Request URL** to your server endpoint:
   ```
   https://app.aethermuse.ai/api/twilio/voice?voiceId=aurora&agentName=Shari&agentType=inbound-receptionist
   ```
4. Set the method to **POST**
5. Save and copy the TwiML App SID to your `.env` file

## Running Locally

### 1. Start the Server

```bash
npm start
```

### 2. Open the App

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Making a Test Call

1. Wait for the status to show "Ready as browser-user"
2. Click **📞 Test Call** to make an outbound call
3. The call will connect to the AI agent

### Receiving an Incoming Call

1. Click **📲 Trigger Incoming Call**
2. This initiates a call TO your browser
3. The call will auto-answer and play a message

### Hanging Up

Click **📴 Hang Up** to end any active call.

## Project Structure

```
twilio-call-simulation/
├── server.js          # Express server with Twilio endpoints
├── public/
│   └── index.html     # Browser phone interface
├── main.py            # Standalone Python example (optional)
├── .env               # Environment variables
└── README.md          # This file
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/token` | GET | Generate Twilio access token for browser |
| `/voice` | POST | TwiML webhook (called by Twilio) |
| `/call-browser` | POST | Trigger incoming call to browser |

## Troubleshooting

### "Failed to initialize" Error
- Check that the server is running
- Verify your `.env` credentials are correct

### Calls Not Connecting
- Check the browser console for errors
- Verify your TwiML App SID is correct
- Ensure the Voice Request URL is correctly set in your TwiML App

### "SDK not loading" Error
- Check your internet connection
- Try refreshing the page

## Notes

- The browser client identity is fixed as `browser-user` in `server.js`
- The TwiML App Voice URL points to the production AetherMuse API
- Query parameters in the Voice URL configure the AI agent (voiceId, agentName, agentType)
