import { useEffect, useRef, useState } from "react";
import { Menu, Pin, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatRelativeTime, useNotesStore } from "~/store/notes";
import { EmptyState } from "./EmptyState";
import { ThemePicker } from "./ThemePicker";

type NoteEditorProps = {
  onOpenList?: () => void;
};

export function NoteEditor({ onOpenList }: NoteEditorProps) {
  const activeId = useNotesStore((s) => s.activeId);
  const notes = useNotesStore((s) => s.notes);
  const updateNote = useNotesStore((s) => s.updateNote);
  const deleteNote = useNotesStore((s) => s.deleteNote);
  const togglePin = useNotesStore((s) => s.togglePin);
  const createNote = useNotesStore((s) => s.createNote);

  const note = notes.find((n) => n.id === activeId);

  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!note) {
      setTitle("");
      setContent("");
      return;
    }
    setTitle(note.title);
    setContent(note.content);
    setSaveState("idle");
  }, [note?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (note && !note.title && !note.content) {
      titleRef.current?.focus();
    }
  }, [note?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function scheduleSave(nextTitle: string, nextContent: string, id: string) {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    setSaveState("saving");
    saveTimer.current = setTimeout(() => {
      updateNote(id, { title: nextTitle, content: nextContent });
      setSaveState("saved");
      savedTimer.current = setTimeout(() => setSaveState("idle"), 1600);
    }, 350);
  }

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, []);

  if (!note) {
    return (
      <div
        className="flex h-full flex-col"
        style={{ background: "var(--surface-editor)" }}
      >
        <div
          className="flex h-12 shrink-0 items-center justify-between border-b px-3 md:hidden"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            type="button"
            onClick={onOpenList}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm focus-amber"
            style={{ color: "var(--text-muted)" }}
          >
            <Menu className="h-4 w-4" strokeWidth={1.75} />
            Notes
          </button>
          <ThemePicker />
        </div>
        <EmptyState variant="no-selection" onCreate={() => createNote()} />
      </div>
    );
  }

  function handleDelete() {
    if (!note) return;
    const label = note.title.trim() || "Untitled";
    deleteNote(note.id);
    toast(`Deleted “${label}”`);
  }

  return (
    <div
      className="flex h-full flex-col"
      style={{ background: "var(--surface-editor)" }}
    >
      <div
        className="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-3"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={onOpenList}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm focus-amber md:hidden"
            style={{ color: "var(--text-muted)" }}
          >
            <Menu className="h-4 w-4" strokeWidth={1.75} />
            Notes
          </button>
          <span
            className="hidden text-xs md:inline"
            style={{ color: "var(--text-faint)" }}
          >
            Edited {formatRelativeTime(note.updatedAt)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <SaveIndicator state={saveState} />

          <ThemePicker className="hidden md:block" />

          <button
            type="button"
            onClick={() => togglePin(note.id)}
            className="rounded-lg p-2 transition focus-amber"
            style={{
              color: note.pinned ? "var(--pin)" : "var(--text-faint)",
            }}
            title={note.pinned ? "Unpin" : "Pin"}
            aria-label={note.pinned ? "Unpin note" : "Pin note"}
          >
            <Pin
              className="h-4 w-4"
              style={note.pinned ? { fill: "var(--pin)" } : undefined}
              strokeWidth={1.75}
            />
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg p-2 transition focus-amber"
            style={{ color: "var(--text-faint)" }}
            title="Delete note"
            aria-label="Delete note"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto quiet-scroll">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 py-6 sm:px-8 sm:py-8">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => {
              const next = e.target.value;
              setTitle(next);
              scheduleSave(next, content, note.id);
            }}
            placeholder="Title"
            className="note-title w-full border-0 bg-transparent text-2xl font-semibold tracking-tight focus:outline-none sm:text-3xl"
            style={{ color: "var(--text-primary)" }}
          />
          <textarea
            value={content}
            onChange={(e) => {
              const next = e.target.value;
              setContent(next);
              scheduleSave(title, next, note.id);
            }}
            placeholder="Start writing…"
            className="note-body mt-4 min-h-[50vh] w-full flex-1 resize-none border-0 bg-transparent text-[15px] focus:outline-none sm:text-base"
            style={{ color: "var(--text-secondary)" }}
          />
          <p
            className="mt-4 pb-4 text-[11px] md:hidden"
            style={{ color: "var(--text-faint)" }}
          >
            Edited {formatRelativeTime(note.updatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

function SaveIndicator({ state }: { state: "idle" | "saving" | "saved" }) {
  if (state === "idle") {
    return <span className="w-16" aria-hidden />;
  }
  return (
    <span
      className="mr-1 flex w-16 items-center justify-end gap-1.5 text-[11px]"
      style={{ color: "var(--text-faint)" }}
      aria-live="polite"
    >
      {state === "saving" ? (
        <>
          <span
            className="saving-dot h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--accent-ring)" }}
          />
          Saving
        </>
      ) : (
        <>
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--saved-dot)" }}
          />
          Saved
        </>
      )}
    </span>
  );
}
