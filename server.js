require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;
const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

const identity = 'browser-user';

// Generate access token for Twilio Client
app.get('/token', (req, res) => {
  const accessToken = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    { identity }
  );

  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
    incomingAllow: true
  });

  accessToken.addGrant(voiceGrant);

  res.json({
    token: accessToken.toJwt(),
    identity
  });
});

// TwiML endpoint for outgoing calls
app.post('/voice', (req, res) => {
  const twiml = new VoiceResponse();
  const to = req.body.To;

  if (to) {
    // Call another client or phone number
    const dial = twiml.dial({ callerId: identity });
    if (to.startsWith('client:')) {
      dial.client(to.replace('client:', ''));
    } else {
      dial.number(to);
    }
  } else {
    // Echo test - speaks and records back
    twiml.say('Hello! Your browser phone is working. Say something after the beep.');
    twiml.record({ maxLength: 10, playBeep: true });
    twiml.say('Here is what you said:');
    twiml.play(req.body.RecordingUrl || '');
  }

  res.type('text/xml');
  res.send(twiml.toString());
});

// Endpoint to initiate call TO the browser client
app.post('/call-browser', (req, res) => {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  client.calls
    .create({
      twiml: '<Response><Say>Hello from Twilio! You are connected via WebRTC.</Say><Pause length="2"/><Say>Goodbye!</Say></Response>',
      to: `client:${identity}`,
      from: 'twilio-caller'
    })
    .then(call => res.json({ success: true, callSid: call.sid }))
    .catch(err => res.status(500).json({ error: err.message }));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
