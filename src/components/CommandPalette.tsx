import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { FileText, Pin, Plus, Search } from "lucide-react";
import {
  formatRelativeTime,
  notePreview,
  useNotesStore,
} from "~/store/notes";

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const notes = useNotesStore((s) => s.notes);
  const setActiveId = useNotesStore((s) => s.setActiveId);
  const createNote = useNotesStore((s) => s.createNote);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open) return null;

  const sorted = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0 bg-zinc-900/30 backdrop-blur-[2px]"
        onClick={() => onOpenChange(false)}
      />
      <Command
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/10 animate-fade-in"
        label="Search notes"
        shouldFilter
      >
        <div className="flex items-center gap-2 border-b border-zinc-100 px-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" strokeWidth={1.75} />
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Search notes…"
            className="h-12 w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
          <kbd className="hidden rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 sm:inline">
            Esc
          </kbd>
        </div>
        <Command.List className="max-h-72 overflow-y-auto quiet-scroll p-1.5">
          <Command.Empty className="px-3 py-8 text-center text-sm text-zinc-500">
            No notes match “{query}”
          </Command.Empty>

          <Command.Item
            value="__new-note__"
            onSelect={() => {
              createNote();
              onOpenChange(false);
            }}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-zinc-800 aria-selected:bg-amber-50 aria-selected:text-amber-900"
          >
            <Plus className="h-4 w-4 text-amber-600" strokeWidth={1.75} />
            <span className="font-medium">New note</span>
          </Command.Item>

          <Command.Group
            heading="Notes"
            className="[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-zinc-400"
          >
            {sorted.map((note) => (
              <Command.Item
                key={note.id}
                value={`${note.title} ${note.content}`}
                onSelect={() => {
                  setActiveId(note.id);
                  onOpenChange(false);
                }}
                className="flex cursor-pointer items-start gap-2.5 rounded-lg px-2.5 py-2 aria-selected:bg-zinc-100"
              >
                <FileText
                  className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400"
                  strokeWidth={1.5}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-medium text-zinc-900">
                      {note.title.trim() || "Untitled"}
                    </span>
                    {note.pinned && (
                      <Pin className="h-3 w-3 shrink-0 fill-amber-500 text-amber-500" />
                    )}
                  </div>
                  <p className="truncate text-xs text-zinc-500">
                    {notePreview(note.content, 60)}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] text-zinc-400">
                  {formatRelativeTime(note.updatedAt)}
                </span>
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
