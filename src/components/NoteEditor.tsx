import { useEffect, useRef, useState } from "react";
import { Menu, Pin, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  formatRelativeTime,
  useNotesStore,
} from "~/store/notes";
import { EmptyState } from "./EmptyState";
import { ThemeToggle } from "./ThemeToggle";

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
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  // Sync local fields when active note changes
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

  // Focus title when creating a brand-new empty note
  useEffect(() => {
    if (note && !note.title && !note.content) {
      titleRef.current?.focus();
    }
  }, [note?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function scheduleSave(
    nextTitle: string,
    nextContent: string,
    id: string,
  ) {
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
      <div className="flex h-full flex-col bg-white dark:bg-zinc-900">
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-200 px-3 md:hidden dark:border-zinc-800">
          <button
            type="button"
            onClick={onOpenList}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 focus-amber dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <Menu className="h-4 w-4" strokeWidth={1.75} />
            Notes
          </button>
          <ThemeToggle />
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
    <div className="flex h-full flex-col bg-white dark:bg-zinc-900">
      {/* Toolbar */}
      <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-zinc-200 px-3 dark:border-zinc-800">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={onOpenList}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 focus-amber md:hidden dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <Menu className="h-4 w-4" strokeWidth={1.75} />
            Notes
          </button>
          <span className="hidden text-xs text-zinc-400 md:inline dark:text-zinc-500">
            Edited {formatRelativeTime(note.updatedAt)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <SaveIndicator state={saveState} />

          <ThemeToggle className="hidden md:inline-flex" />

          <button
            type="button"
            onClick={() => togglePin(note.id)}
            className={`rounded-lg p-2 transition focus-amber ${
              note.pinned
                ? "text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/40"
                : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            }`}
            title={note.pinned ? "Unpin" : "Pin"}
            aria-label={note.pinned ? "Unpin note" : "Pin note"}
          >
            <Pin
              className={`h-4 w-4 ${
                note.pinned ? "fill-amber-500" : ""
              }`}
              strokeWidth={1.75}
            />
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-red-50 hover:text-red-600 focus-amber dark:text-zinc-500 dark:hover:bg-red-950/40 dark:hover:text-red-400"
            title="Delete note"
            aria-label="Delete note"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Editor body */}
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
            className="note-title w-full border-0 bg-transparent text-2xl font-semibold tracking-tight text-zinc-900 placeholder:text-zinc-300 focus:outline-none sm:text-3xl dark:text-zinc-50 dark:placeholder:text-zinc-600"
          />
          <textarea
            value={content}
            onChange={(e) => {
              const next = e.target.value;
              setContent(next);
              scheduleSave(title, next, note.id);
            }}
            placeholder="Start writing…"
            className="note-body mt-4 min-h-[50vh] w-full flex-1 resize-none border-0 bg-transparent text-[15px] text-zinc-800 placeholder:text-zinc-300 focus:outline-none sm:text-base dark:text-zinc-200 dark:placeholder:text-zinc-600"
          />
          <p className="mt-4 pb-4 text-[11px] text-zinc-400 md:hidden dark:text-zinc-500">
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
      className="mr-1 flex w-16 items-center justify-end gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500"
      aria-live="polite"
    >
      {state === "saving" ? (
        <>
          <span className="saving-dot h-1.5 w-1.5 rounded-full bg-amber-500" />
          Saving
        </>
      ) : (
        <>
          <span className="h-1.5 w-1.5 rounded-full bg-olive-600" />
          Saved
        </>
      )}
    </span>
  );
}
