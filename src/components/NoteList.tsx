import { Pin, Plus, Search } from "lucide-react";
import {
  formatRelativeTime,
  notePreview,
  useNotesStore,
} from "~/store/notes";
import { EmptyState } from "./EmptyState";

type NoteListProps = {
  onOpenSearch?: () => void;
  onSelectNote?: () => void;
  className?: string;
};

export function NoteList({ onOpenSearch, onSelectNote, className = "" }: NoteListProps) {
  const searchQuery = useNotesStore((s) => s.searchQuery);
  const setSearchQuery = useNotesStore((s) => s.setSearchQuery);
  const activeId = useNotesStore((s) => s.activeId);
  const setActiveId = useNotesStore((s) => s.setActiveId);
  const createNote = useNotesStore((s) => s.createNote);
  const notes = useNotesStore((s) => s.notes);
  const getSortedNotes = useNotesStore((s) => s.getSortedNotes);
  const sorted = getSortedNotes();

  return (
    <div className={`flex h-full flex-col bg-zinc-50 ${className}`}>
      <div className="shrink-0 border-b border-zinc-200/80 px-3 pb-3 pt-4">
        <div className="mb-3 flex items-center justify-between gap-2 px-1">
          <h1 className="note-title text-lg font-semibold tracking-tight text-zinc-900">
            Notes
          </h1>
          <button
            type="button"
            onClick={() => {
              createNote();
              onSelectNote?.();
            }}
            className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-amber-700 focus-amber"
            title="New note (N)"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            New
          </button>
        </div>

        <div className="relative">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400"
            strokeWidth={1.75}
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => onOpenSearch?.()}
            placeholder="Search notes…"
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-8 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            aria-label="Filter notes"
          />
        </div>

        <p className="mt-2 px-1 text-[11px] text-zinc-400">
          {notes.length} note{notes.length === 1 ? "" : "s"}
          <span className="mx-1.5 text-zinc-300">·</span>
          <button
            type="button"
            onClick={() => onOpenSearch?.()}
            className="hover:text-zinc-600"
          >
            ⌘K
          </button>
        </p>
      </div>

      <div className="flex-1 overflow-y-auto quiet-scroll">
        {sorted.length === 0 ? (
          <EmptyState
            variant={searchQuery.trim() ? "no-results" : "no-notes"}
            onCreate={
              searchQuery.trim()
                ? undefined
                : () => {
                    createNote();
                    onSelectNote?.();
                  }
            }
          />
        ) : (
          <ul className="divide-y divide-zinc-200/70">
            {sorted.map((note) => {
              const selected = note.id === activeId;
              return (
                <li key={note.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveId(note.id);
                      onSelectNote?.();
                    }}
                    className={`group w-full px-4 py-3 text-left transition ${
                      selected
                        ? "bg-zinc-200/70"
                        : "hover:bg-zinc-100/80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`truncate text-sm font-medium ${
                          selected ? "text-zinc-900" : "text-zinc-800"
                        }`}
                      >
                        {note.title.trim() || "Untitled"}
                      </span>
                      <div className="flex shrink-0 items-center gap-1.5">
                        {note.pinned && (
                          <Pin
                            className="h-3 w-3 fill-amber-500 text-amber-500"
                            strokeWidth={1.5}
                          />
                        )}
                        <span className="text-[11px] tabular-nums text-zinc-400">
                          {formatRelativeTime(note.updatedAt)}
                        </span>
                      </div>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                      {notePreview(note.content, 100)}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
