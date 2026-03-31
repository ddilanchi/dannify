# Dannify Project Status

**Current Version:** 1.5.1

## What We're Doing
Spotify playlist builder with LLM-powered features supporting Claude, GPT, and Gemini models.

## Current Progress
- Core Spotify integration (search, create, manage playlists)
- Multi-provider LLM support (Anthropic, OpenAI, Gemini)
- Auto-fetch script for keeping model lists current
- GitHub Pages deployment ready

## Completed Steps
- ✅ Basic playlist builder UI
- ✅ Spotify PKCE OAuth
- ✅ LLM model support (26 models across 3 providers)
- ✅ Gemini 3/3.1 preview models
- ✅ Auto-fetch script for API model discovery
- ✅ Fixed model ID format (dots vs dashes)

## Next Steps
- [ ] LLM-powered playlist generation ("describe a vibe, get a playlist")
- [ ] Playlist editing UI (reorder, remove tracks)
- [ ] Recommendations based on listening history
- [ ] Cross-user playlist sharing
- [ ] Deploy to GitHub Pages with version tracking

## Version History
- **1.5.1** (2026-03-31) — Fixed Discover Infinitely (count param was ignored, search query encoding broken, JSON parse fragile). Blindspots now requests 40 artists with 5 tracks each, filters against full library. Both tools send known-artist list to LLM to avoid familiar suggestions.
- **1.5.0** (2026-03-28) — LLM-powered Blindspots + Discover Infinitely. AI analyzes taste profile, suggests artists/tracks, then verifies on Spotify. No deprecated endpoints needed.
- **1.4.0** (2026-03-28) — Full API audit: removed ALL deprecated endpoints. Fixed /playlists tracks→items, /recommendations→search, /audio-features→stub, /users/{id}/playlists→/me/playlists. Zero deprecated calls remaining. Blindspots rewritten for adjacent genre discovery.
- **1.3.0** (2026-03-28) — Rebuilt Blindspots + Discover using only working Spotify endpoints.
- **1.2.2** (2026-03-25) — Rebuilt Blindspots and Discover Infinitely: Spotify deprecated `/recommendations` and `/related-artists` endpoints in 2024. Now uses genre-based search and catalog exploration instead.
- **1.2.1** (2026-03-24) — Fixed Discover Infinitely recommendations API
- **1.2.0** (2026-03-24) — Added Discover Infinitely tool (infinite recommendations), improved Blindspots algorithm
- **1.1.3** (2026-03-24) — Fixed blindspots to recommend related artists instead of top artists
- **1.1.2** (2026-03-24) — Fixed localStorage validation for model list updates
- **1.1.1** (2026-03-24) — Fixed Gemini 3.1 model ID format
- **1.1.0** (2026-03-24) — Added comprehensive AI model support, auto-fetch script
- **1.0.0** (2026-03-22) — Initial release, Spotify integration + basic LLM setup
