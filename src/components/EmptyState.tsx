import { FileText, Search } from "lucide-react";

type EmptyStateProps = {
  variant: "no-notes" | "no-results" | "no-selection";
  onCreate?: () => void;
};

export function EmptyState({ variant, onCreate }: EmptyStateProps) {
  if (variant === "no-results") {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <Search className="h-5 w-5 text-zinc-400" strokeWidth={1.5} />
        <p className="text-sm font-medium text-zinc-700">No matches</p>
        <p className="max-w-[220px] text-xs leading-relaxed text-zinc-500">
          Nothing fits that search. Try a different word or clear the filter.
        </p>
      </div>
    );
  }

  if (variant === "no-selection") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center animate-fade-in">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <FileText className="h-5 w-5 text-zinc-400" strokeWidth={1.5} />
        </div>
        <div className="space-y-1">
          <p className="note-title text-lg font-medium text-zinc-800">
            Select a note
          </p>
          <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
            Pick something from the list, or start a fresh one with{" "}
            <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-sans text-xs text-zinc-600">
              N
            </kbd>
            .
          </p>
        </div>
        {onCreate && (
          <button
            type="button"
            onClick={onCreate}
            className="mt-2 rounded-lg bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 focus-amber"
          >
            New note
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <FileText className="h-5 w-5 text-zinc-400" strokeWidth={1.5} />
      <p className="text-sm font-medium text-zinc-700">No notes yet</p>
      <p className="max-w-[220px] text-xs leading-relaxed text-zinc-500">
        A blank page is a good place to begin. Press{" "}
        <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1 py-0.5 font-sans text-[10px] text-zinc-600">
          N
        </kbd>{" "}
        for a new note.
      </p>
      {onCreate && (
        <button
          type="button"
          onClick={onCreate}
          className="mt-2 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-amber-700 focus-amber"
        >
          Write something
        </button>
      )}
    </div>
  );
}
