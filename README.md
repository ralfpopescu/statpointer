# Stat Pointer 🎯

A web app for creating and sharing visual "stat spreads" (similar to RPG or Pokémon-style stat charts) to communicate strengths and weaknesses.

## Features

- **Class Builder**: Create stat templates with customizable attributes
- **Stat Spreads**: Fill in your individual stats with point allocation
- **Party View**: Aggregate multiple stat spreads into a team overview
- **Shareable Links**: All data is base64 encoded in URLs - no server needed!

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Pages

- `/` - Home page with intro and navigation
- `/builder` - Create a new class (stat template)
- `/fill/[encoded]` - Fill out stats for a shared class
- `/view/[encoded]` - View a completed stat spread (read-only)
- `/party` - Collect and aggregate party stats
- `/party/[encoded]` - View aggregated party stats (read-only)

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Architecture

All state is stored in URLs via base64 encoding:

- Class templates encode: role name, attributes, total points
- Stat spreads encode: character name, role name, attributes, point allocations
- Party views encode: array of stat spreads

No database or authentication required - just share links!

## Design

The app features a dark theme with ember/coral accents, using:
- **Crimson Pro** for display text (serif)
- **Outfit** for body text (sans-serif)
- **JetBrains Mono** for numerical values (monospace)

Radar charts provide visual stat representations in the style of classic RPG games.

