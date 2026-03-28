# Dannify Project Status

**Current Version:** 1.3.0

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
- **1.3.0** (2026-03-28) — Rebuilt Blindspots + Discover using only working Spotify endpoints. Removed all calls to deprecated /top-tracks, /recommendations, /related-artists. Genre search + album catalogs only. Dev mode compatible (limit=10).
- **1.2.2** (2026-03-25) — Rebuilt Blindspots and Discover Infinitely: Spotify deprecated `/recommendations` and `/related-artists` endpoints in 2024. Now uses genre-based search and catalog exploration instead.
- **1.2.1** (2026-03-24) — Fixed Discover Infinitely recommendations API
- **1.2.0** (2026-03-24) — Added Discover Infinitely tool (infinite recommendations), improved Blindspots algorithm
- **1.1.3** (2026-03-24) — Fixed blindspots to recommend related artists instead of top artists
- **1.1.2** (2026-03-24) — Fixed localStorage validation for model list updates
- **1.1.1** (2026-03-24) — Fixed Gemini 3.1 model ID format
- **1.1.0** (2026-03-24) — Added comprehensive AI model support, auto-fetch script
- **1.0.0** (2026-03-22) — Initial release, Spotify integration + basic LLM setup
