import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
};

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

const now = Date.now();

const SEED_NOTES: Note[] = [
  {
    id: "seed-welcome",
    title: "Welcome to Notes",
    content:
      "A calm place for thoughts.\n\n• Create a note with N\n• Search everything with ⌘K\n• Edits autosave as you type\n• Pin what matters most\n\nNothing here leaves your browser — notes live in local storage.",
    createdAt: now - 1000 * 60 * 60 * 24 * 2,
    updatedAt: now - 1000 * 60 * 60 * 3,
    pinned: true,
  },
  {
    id: "seed-ideas",
    title: "Ideas worth keeping",
    content:
      "Morning pages without the pressure.\n\nCapture half-formed thoughts, links, and lists. Sort later — or never. The list on the left is sorted by recency; pinned notes stay on top.\n\nTry writing something. Watch the subtle ‘Saved’ indicator in the toolbar.",
    createdAt: now - 1000 * 60 * 60 * 20,
    updatedAt: now - 1000 * 60 * 45,
  },
  {
    id: "seed-keyboard",
    title: "Keyboard shortcuts",
    content:
      "N — New note\n⌘/Ctrl + K — Search notes\nEsc — Close search\n\nOn smaller screens the note list opens as a drawer so the editor stays first.",
    createdAt: now - 1000 * 60 * 60 * 8,
    updatedAt: now - 1000 * 60 * 15,
  },
];

type NotesState = {
  notes: Note[];
  activeId: string | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  setActiveId: (id: string | null) => void;
  createNote: (partial?: Partial<Pick<Note, "title" | "content">>) => string;
  updateNote: (
    id: string,
    patch: Partial<Pick<Note, "title" | "content" | "pinned">>,
  ) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  getActiveNote: () => Note | undefined;
  getSortedNotes: () => Note[];
};

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: SEED_NOTES,
      activeId: SEED_NOTES[0]?.id ?? null,
      searchQuery: "",

      setSearchQuery: (searchQuery) => set({ searchQuery }),

      setActiveId: (activeId) => set({ activeId }),

      createNote: (partial) => {
        const id = uid();
        const timestamp = Date.now();
        const note: Note = {
          id,
          title: partial?.title ?? "",
          content: partial?.content ?? "",
          createdAt: timestamp,
          updatedAt: timestamp,
          pinned: false,
        };
        set((s) => ({
          notes: [note, ...s.notes],
          activeId: id,
          searchQuery: "",
        }));
        return id;
      },

      updateNote: (id, patch) => {
        set((s) => ({
          notes: s.notes.map((n) =>
            n.id === id
              ? { ...n, ...patch, updatedAt: Date.now() }
              : n,
          ),
        }));
      },

      deleteNote: (id) => {
        set((s) => {
          const remaining = s.notes.filter((n) => n.id !== id);
          const nextActive =
            s.activeId === id
              ? remaining[0]?.id ?? null
              : s.activeId;
          return { notes: remaining, activeId: nextActive };
        });
      },

      togglePin: (id) => {
        set((s) => ({
          notes: s.notes.map((n) =>
            n.id === id
              ? { ...n, pinned: !n.pinned, updatedAt: Date.now() }
              : n,
          ),
        }));
      },

      getActiveNote: () => {
        const { notes, activeId } = get();
        return notes.find((n) => n.id === activeId);
      },

      getSortedNotes: () => {
        const { notes, searchQuery } = get();
        const q = searchQuery.trim().toLowerCase();
        const filtered = q
          ? notes.filter(
              (n) =>
                n.title.toLowerCase().includes(q) ||
                n.content.toLowerCase().includes(q),
            )
          : notes;
        return [...filtered].sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return b.updatedAt - a.updatedAt;
        });
      },
    }),
    {
      name: "calm-notes-v1",
      partialize: (s) => ({
        notes: s.notes,
        activeId: s.activeId,
      }),
    },
  ),
);

export function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 45) return "Just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year:
      new Date(ts).getFullYear() === new Date().getFullYear()
        ? undefined
        : "numeric",
  });
}

export function notePreview(content: string, max = 80): string {
  const flat = content.replace(/\s+/g, " ").trim();
  if (!flat) return "Empty note";
  return flat.length > max ? `${flat.slice(0, max)}…` : flat;
}
