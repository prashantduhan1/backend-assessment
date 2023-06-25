const express = require('express');
const axios = require('axios');

const router = express.Router();

// Step 1: Google Calendar Init View
router.get('/init', (req, res) => {
  // Redirect the user to the Google OAuth consent screen
  const authUrl = getAuthorizationUrl();
  res.redirect(authUrl);
});

// Step 2: Google Calendar Redirect View
router.get('/redirect', async (req, res) => {
  const code = req.query.code;

  // Exchange the authorization code for an access token
  const { access_token, refresh_token } = await getTokens(code);

  // Use the access_token to retrieve events from the user's calendar
  const events = await getEvents(access_token);

  // Handle events or store access_token for future use

  res.json(events);
});

// Helper function to construct the Google OAuth consent screen URL
function getAuthorizationUrl() {
  const clientId = `46279565326-dfao9qrk3vfpisme8hpq90j85sk2l5qn.apps.googleusercontent.com`
  //'YOUR_CLIENT_ID';
  const redirectUri = 'http://localhost:3000/redirect';
  const scope = 'https://www.googleapis.com/auth/calendar.readonly';

  const params = new URLSearchParams({
    client_id: `46279565326-dfao9qrk3vfpisme8hpq90j85sk2l5qn.apps.googleusercontent.com`,
    //clientId,
    redirect_uri: redirectUri,
    scope,
    response_type: 'code',
    access_type: 'offline',
  });

  return `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;
}

// Helper function to exchange authorization code for access token
async function getTokens(code) {
  const clientId = `46279565326-dfao9qrk3vfpisme8hpq90j85sk2l5qn.apps.googleusercontent.com`;
  const clientSecret = `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`;
  const redirectUri = 'http://localhost:3000/redirect';

  const params = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  const response = await axios.post('https://oauth2.googleapis.com/token', params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
}

// Helper function to get events from the user's calendar
async function getEvents(accessToken) {
  const response = await axios.get('https://www.googleapis.com/calendar/v3/events', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
}

module.exports = router;
