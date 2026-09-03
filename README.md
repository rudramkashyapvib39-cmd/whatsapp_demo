# WhatsApp Chaos — Haunted Hell Edition

A pixel-accurate WhatsApp Web clone that starts normal… then forces you into a dark-red **hell theme** with full-screen glitches, tornado voids, ghost chases, gravity collapses, and a devil that shoots the screen until the glass shatters.

## What was added / changed

### Core haunted system (`src/lib/ChaosProvider.jsx`)
- Global `haunted` flag — when true the entire UI switches to dark-red palette.
- Cinematic sequences triggered from Send / Calls / Status / Settings / etc.:
  1. **Tornado** — UI is sucked into a swirling void. Two glitch buttons appear: **RUN** or **CONTINUE**.
  2. **RUN** → Ghost chasing a dog through hell (full-screen animation) → reality restores.
  3. **CONTINUE** → Every UI label free-falls under gravity → “ESCAPE?” button → Devil appears with pistol → shoots → glass-shatter shards → reality restores.
- Spite toasts, laggy cursor, composer lock, ambient taunts.

### ChatWindow
- Theme force-switches to red/black the moment you start chatting.
- Send button teleports aggressively.
- Messages reverse / garble / hell-correct / phantom-delete / double-send.
- Random full-screen glitch bursts, message pane invert, mirrored input.
- High chance that sending triggers the full Tornado sequence.

### Sidebar (all tabs)
- **Chats**: reverse search, wrong-chat roulette, list shuffle, ghost unread badges, falling search chips, stubborn rows, jump-on-hover, flee-on-click.
- **Calls**: attempting any call instantly “hacks” the page and often triggers the void.
- **Status**: names reverse, statuses fly off screen, chance to open the void.
- **Channels / Communities**: StubbornRow (must click 4 times while it dodges), Follow buttons cause gravity dump + possible tornado.
- **Settings / Profile**: Access Denied flashes, stubborn navigation, chance to open the void on any click.
- Icon rail, headers, filters, banners all recolor to the haunted palette.

### How to run
```bash
npm install
npm run dev