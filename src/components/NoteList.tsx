import { Pin, Plus, Search } from "lucide-react";
import {
  formatRelativeTime,
  notePreview,
  useNotesStore,
} from "~/store/notes";
import { EmptyState } from "./EmptyState";
import { ThemePicker } from "./ThemePicker";

type NoteListProps = {
  onOpenSearch?: () => void;
  onSelectNote?: () => void;
  className?: string;
};

export function NoteList({
  onOpenSearch,
  onSelectNote,
  className = "",
}: NoteListProps) {
  const searchQuery = useNotesStore((s) => s.searchQuery);
  const setSearchQuery = useNotesStore((s) => s.setSearchQuery);
  const activeId = useNotesStore((s) => s.activeId);
  const setActiveId = useNotesStore((s) => s.setActiveId);
  const createNote = useNotesStore((s) => s.createNote);
  const notes = useNotesStore((s) => s.notes);
  const getSortedNotes = useNotesStore((s) => s.getSortedNotes);
  const sorted = getSortedNotes();

  return (
    <div
      className={`flex h-full flex-col ${className}`}
      style={{ background: "var(--surface-panel)" }}
    >
      <div
        className="shrink-0 border-b px-3 pb-3 pt-4"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="mb-3 flex items-center justify-between gap-2 px-1">
          <h1
            className="note-title text-lg font-semibold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Notes
          </h1>
          <div className="flex items-center gap-1">
            <ThemePicker />
            <button
              type="button"
              onClick={() => {
                createNote();
                onSelectNote?.();
              }}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium shadow-sm transition focus-amber"
              style={{
                background: "var(--accent)",
                color: "var(--accent-text)",
              }}
              title="New note (N)"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              New
            </button>
          </div>
        </div>

        <div className="relative">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
            style={{ color: "var(--text-faint)" }}
            strokeWidth={1.75}
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => onOpenSearch?.()}
            placeholder="Search notes…"
            className="w-full rounded-lg border py-2 pl-8 pr-3 text-sm shadow-sm transition focus:outline-none focus:ring-2"
            style={{
              borderColor: "var(--border-strong)",
              background: "var(--surface-elevated)",
              color: "var(--text-primary)",
              // @ts-expect-error CSS custom property for ring
              "--tw-ring-color": "color-mix(in srgb, var(--accent-ring) 25%, transparent)",
            }}
            aria-label="Filter notes"
          />
        </div>

        <p className="mt-2 px-1 text-[11px]" style={{ color: "var(--text-faint)" }}>
          {notes.length} note{notes.length === 1 ? "" : "s"}
          <span className="mx-1.5" style={{ color: "var(--border-strong)" }}>
            ·
          </span>
          <button
            type="button"
            onClick={() => onOpenSearch?.()}
            className="transition hover:opacity-80"
            style={{ color: "inherit" }}
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
          <ul
            className="divide-y"
            style={{ borderColor: "var(--border)" }}
          >
            {sorted.map((note) => {
              const selected = note.id === activeId;
              return (
                <li key={note.id} style={{ borderColor: "var(--border)" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveId(note.id);
                      onSelectNote?.();
                    }}
                    className="group w-full px-4 py-3 text-left transition"
                    style={{
                      background: selected
                        ? "var(--surface-selected)"
                        : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!selected)
                        e.currentTarget.style.background = "var(--surface-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = selected
                        ? "var(--surface-selected)"
                        : "transparent";
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className="truncate text-sm font-medium"
                        style={{
                          color: selected
                            ? "var(--text-primary)"
                            : "var(--text-secondary)",
                        }}
                      >
                        {note.title.trim() || "Untitled"}
                      </span>
                      <div className="flex shrink-0 items-center gap-1.5">
                        {note.pinned && (
                          <Pin
                            className="h-3 w-3"
                            style={{ color: "var(--pin)", fill: "var(--pin)" }}
                            strokeWidth={1.5}
                          />
                        )}
                        <span
                          className="text-[11px] tabular-nums"
                          style={{ color: "var(--text-faint)" }}
                        >
                          {formatRelativeTime(note.updatedAt)}
                        </span>
                      </div>
                    </div>
                    <p
                      className="mt-0.5 line-clamp-2 text-xs leading-relaxed"
                      style={{ color: "var(--text-muted)" }}
                    >
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
