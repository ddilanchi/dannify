# Dannify

Spotify playlist builder — search tracks, create playlists, manage your library. Pure client-side, no server. Multi-user via Spotify PKCE OAuth. LLM-powered features coming soon.

## File Structure

```
Dannify/
├── index.html          # Everything — UI, auth, Spotify API calls, LLM integration
├── update-models.js    # Auto-fetch latest models from AI providers
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

## LLM Models

The app supports three major LLM providers:
- **Anthropic** (Claude 3/4 family)
- **OpenAI** (GPT-4/GPT-3.5 family)
- **Google Gemini** (Gemini 1.5/2.0/3.0 family)

### Updating Models

Models are listed in the `MODELS` object in `index.html`. To keep them current:

```bash
# Fetch latest models from each provider's API
# Requires API keys in environment:
export OPENAI_API_KEY=sk-...
export ANTHROPIC_API_KEY=sk-ant-...
export GOOGLE_API_KEY=AIza...

node update-models.js          # Update index.html with latest models
node update-models.js --dry-run # Preview changes without updating
```

Currently supported models include:
- **Claude 4.6**, 4.5, Opus 4.6, Sonnet 4.6, **Haiku 4.5**
- **GPT-4o**, GPT-4, **GPT-4o Mini**, GPT-3.5 Turbo, **o1 family**
- **Gemini 2.0/2.5/1.5** (flash/pro variants) — use `update-models.js` to check latest

## TODO

- [ ] LLM-powered playlist generation (describe a vibe, get a playlist)
- [ ] Playlist editing (reorder, remove tracks)
- [ ] Recommendations based on listening history
- [ ] Share playlists between users
