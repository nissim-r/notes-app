# Notes — calm writing

A polished note-taking app in the spirit of Linear and Things 3.

## Features

- Create, edit, delete notes (autosave)
- Search via sidebar filter or **⌘K / Ctrl+K** command palette
- **N** for a new note (when not typing)
- Pin notes to the top of the list
- Split list | editor layout on desktop
- Mobile: editor-first + drawer for the list (vaul)
- localStorage persistence via zustand
- **Themes** (palette menu): Light · Dark · Christmas · Halloween

## Themes

| Theme | Mood |
|-------|------|
| **Light** (default) | Warm zinc, white editor, amber accent |
| **Dark** | Quiet night writing |
| **Christmas** | Pine green, cream text, crimson & gold |
| **Halloween** | Midnight purple, pumpkin orange, violet saved-dot |

Open the **palette** icon in the notes list (or editor toolbar) to switch. Choice is saved in `localStorage`.

## Stack

React 19 · TypeScript · Vite · TanStack Start/Router · Tailwind v4 · zustand · cmdk · vaul · sonner · lucide

## Scripts

```bash
npm run dev        # 0.0.0.0:8080
npm run build
npm run typecheck
./startup.sh       # idempotent background start
```

## Design

No purple gradients on the default themes. Product UI: divide-y list rows, muted selected state, full-height editor, subtle autosave indicator. Seasonal themes use full semantic color tokens so every surface re-tints cleanly.
