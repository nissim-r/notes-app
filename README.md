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
- Warm zinc neutrals + restrained amber accent
- Source Serif 4 titles · DM Sans UI

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

No purple gradients. Product UI: divide-y list rows, muted selected state, full-height editor, subtle autosave indicator.
