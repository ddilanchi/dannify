# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

Single-page client-side app (`index.html`, ~1700 lines) — no build step. Optional Express backend in `server.js` exists but is unused; the app runs entirely in-browser via GitHub Pages.

**Auth**: Spotify PKCE OAuth (no backend secret needed). Tokens stored in localStorage.

**LLM Integration**: Direct browser-to-API calls to Anthropic, OpenAI, or Gemini. User provides their own API key (stored in localStorage). Anthropic calls require `anthropic-dangerous-direct-browser-access: true` header.

**Key function map in index.html**:
- `spotifyApi()` — all Spotify REST calls, handles 401 refresh + 429 rate-limit retry
- `callLLM()` — multi-provider LLM dispatcher (Claude/GPT/Gemini)
- `generatePlaylist()` — unified discovery: dispatches to `generateNewArtists()`, `generateNewTracks()`, or `generateFromPrompt()`
- `fetchTasteProfile()` — shared helper: fetches all liked songs + top artists/tracks, builds known-artist/track filter sets
- `init()` — PKCE callback handling, token restore, app bootstrap

## Development

```bash
# No build step. Open index.html directly or:
npm install && npm start   # Express on port 3000 (optional)
```

## Deployment

Deployed via GitHub Pages. Pushes to `master` auto-deploy via `.github/workflows/pages.yml`.

**IMPORTANT**: After editing `index.html`, you MUST commit and push to `master` for changes to go live. Bump the `VERSION` constant at the top of the script section when pushing changes.

## Key Constraints

- **Spotify API deprecations**: `/recommendations`, `/related-artists`, `/audio-features` (removed 2024), and `/playlists/{id}/tracks` (deprecated Feb 2026, returns 403 in dev mode). Use `/playlists/{id}/items` for all playlist track operations. Discovery features use LLM + `/search`. Do not reintroduce deprecated endpoints.
- **No server-side state**: Everything runs client-side. `server.js` has an alternate OAuth flow but is not used in production.
- **Rate limits**: `spotifyApi()` retries on 429 with `Retry-After` header. Discovery tools fire many sequential searches — be mindful of volume.
- **LLM response parsing**: LLM returns JSON arrays. Parser uses greedy regex `\[[\s\S]*\]` to extract. Non-greedy `*?` breaks on large arrays — do not change back.
- **max_tokens**: Set to 4096 for Anthropic calls. Lower values truncate large artist/track lists mid-JSON.

## Scripts

- `update-models.js` — fetches latest model IDs from OpenAI/Gemini APIs, updates the `MODELS` constant in `index.html`. Run with provider API keys as env vars.

## Version History
- **2.0.0** (2026-06-02) — Merged Blindspots + Discover into unified Generate Playlist with 3 modes (New Artists, New Tracks, From a Prompt). Added library editing: inline rename/description, search+add tracks, bulk select+remove, deduplicate, move up/down. Fixed Spotify `/tracks` → `/items` endpoint migration. Fixed PKCE auth, 401 loop, debug logging across all flows.
- **1.6.0** (2026-03-31) — Blindspots: tracks-only view, shuffle, 60 artists; Discover: rate-limit retry, fallback search, 1-per-artist dedup; debug log with copy button; max_tokens 2048→4096.
- **1.5.1** (2026-03-31) — Fixed Discover Infinitely count param, search encoding, JSON parse.
- **1.5.0** (2026-03-28) — LLM-powered Blindspots + Discover Infinitely.
- **1.4.0** (2026-03-28) — Full API audit: removed ALL deprecated Spotify endpoints.
- **1.3.0** (2026-03-28) — Rebuilt discovery tools using only working Spotify endpoints.
- **1.0.0** (2026-03-22) — Initial release.
