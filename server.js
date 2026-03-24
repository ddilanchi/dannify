require('dotenv').config();
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// --- Spotify OAuth ---

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API = 'https://api.spotify.com/v1';
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-modify-public',
  'playlist-modify-private',
  'playlist-read-private',
  'user-top-read',
  'user-library-read',
].join(' ');

app.get('/login', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  req.session.oauthState = state;
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: SCOPES,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    state,
  });
  res.redirect(`${SPOTIFY_AUTH_URL}?${params}`);
});

app.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  if (state !== req.session.oauthState) {
    return res.status(403).send('State mismatch');
  }

  try {
    const tokenRes = await axios.post(SPOTIFY_TOKEN_URL, new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    }), {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    req.session.tokens = {
      access_token: tokenRes.data.access_token,
      refresh_token: tokenRes.data.refresh_token,
      expires_at: Date.now() + tokenRes.data.expires_in * 1000,
    };

    res.redirect('/');
  } catch (err) {
    console.error('OAuth error:', err.response?.data || err.message);
    res.status(500).send('Authentication failed');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// --- Auth middleware ---

async function refreshIfNeeded(req) {
  const tokens = req.session.tokens;
  if (!tokens) return false;
  if (Date.now() < tokens.expires_at - 60000) return true;

  try {
    const tokenRes = await axios.post(SPOTIFY_TOKEN_URL, new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: tokens.refresh_token,
    }), {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    req.session.tokens.access_token = tokenRes.data.access_token;
    req.session.tokens.expires_at = Date.now() + tokenRes.data.expires_in * 1000;
    if (tokenRes.data.refresh_token) {
      req.session.tokens.refresh_token = tokenRes.data.refresh_token;
    }
    return true;
  } catch {
    return false;
  }
}

function requireAuth(req, res, next) {
  refreshIfNeeded(req).then(ok => {
    if (!ok) return res.status(401).json({ error: 'Not authenticated' });
    next();
  });
}

// --- API routes ---

app.get('/api/me', requireAuth, async (req, res) => {
  try {
    const { data } = await axios.get(`${SPOTIFY_API}/me`, {
      headers: { Authorization: `Bearer ${req.session.tokens.access_token}` },
    });
    res.json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

app.get('/api/playlists', requireAuth, async (req, res) => {
  try {
    const { data } = await axios.get(`${SPOTIFY_API}/me/playlists?limit=50`, {
      headers: { Authorization: `Bearer ${req.session.tokens.access_token}` },
    });
    res.json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

app.post('/api/playlists', requireAuth, async (req, res) => {
  try {
    const me = await axios.get(`${SPOTIFY_API}/me`, {
      headers: { Authorization: `Bearer ${req.session.tokens.access_token}` },
    });
    const { data } = await axios.post(
      `${SPOTIFY_API}/users/${me.data.id}/playlists`,
      { name: req.body.name, description: req.body.description || '', public: false },
      { headers: { Authorization: `Bearer ${req.session.tokens.access_token}` } },
    );
    res.json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

app.post('/api/playlists/:id/tracks', requireAuth, async (req, res) => {
  try {
    const { data } = await axios.post(
      `${SPOTIFY_API}/playlists/${req.params.id}/tracks`,
      { uris: req.body.uris },
      { headers: { Authorization: `Bearer ${req.session.tokens.access_token}` } },
    );
    res.json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

app.get('/api/search', requireAuth, async (req, res) => {
  try {
    const { data } = await axios.get(`${SPOTIFY_API}/search`, {
      params: { q: req.query.q, type: 'track', limit: 20 },
      headers: { Authorization: `Bearer ${req.session.tokens.access_token}` },
    });
    res.json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Dannify running at http://localhost:${PORT}`);
});
