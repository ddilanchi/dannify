# Dannify

Spotify playlist builder — search tracks, create playlists, manage your library. Pure client-side, no server. Multi-user via Spotify PKCE OAuth. LLM-powered features coming soon.

## File Structure

```
Dannify/
├── index.html     # Everything — UI, auth, Spotify API calls
├── .gitignore
└── README.md
```

## Setup

1. Go to https://developer.spotify.com/dashboard and create an app
2. Set redirect URI to wherever you're serving `index.html` (e.g. `http://localhost:5500/` for Live Server, or `http://127.0.0.1:5500/index.html`)
3. Copy your Client ID into the `CLIENT_ID` variable at the top of the `<script>` in `index.html`
4. Open `index.html` in a browser (via Live Server or any static server)

## Spotify App Settings

- **Redirect URI:** Must match the URL you open `index.html` from
- **APIs used:** Web API

## TODO

- [ ] LLM-powered playlist generation (describe a vibe, get a playlist)
- [ ] Playlist editing (reorder, remove tracks)
- [ ] Recommendations based on listening history
- [ ] Share playlists between users
