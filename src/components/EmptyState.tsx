import { FileText, Search } from "lucide-react";

type EmptyStateProps = {
  variant: "no-notes" | "no-results" | "no-selection";
  onCreate?: () => void;
};

export function EmptyState({ variant, onCreate }: EmptyStateProps) {
  if (variant === "no-results") {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <Search
          className="h-5 w-5"
          style={{ color: "var(--text-faint)" }}
          strokeWidth={1.5}
        />
        <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          No matches
        </p>
        <p
          className="max-w-[220px] text-xs leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          Nothing fits that search. Try a different word or clear the filter.
        </p>
      </div>
    );
  }

  if (variant === "no-selection") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center animate-fade-in">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm"
          style={{
            borderColor: "var(--border-strong)",
            background: "var(--surface-elevated)",
          }}
        >
          <FileText
            className="h-5 w-5"
            style={{ color: "var(--text-faint)" }}
            strokeWidth={1.5}
          />
        </div>
        <div className="space-y-1">
          <p
            className="note-title text-lg font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Select a note
          </p>
          <p
            className="max-w-xs text-sm leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Pick something from the list, or start a fresh one with{" "}
            <kbd
              className="rounded border px-1.5 py-0.5 font-sans text-xs"
              style={{
                borderColor: "var(--kbd-border)",
                background: "var(--kbd-bg)",
                color: "var(--kbd-text)",
              }}
            >
              N
            </kbd>
            .
          </p>
        </div>
        {onCreate && (
          <button
            type="button"
            onClick={onCreate}
            className="mt-2 rounded-lg px-3.5 py-2 text-sm font-medium transition focus-amber"
            style={{
              background: "var(--text-primary)",
              color: "var(--surface-editor)",
            }}
          >
            New note
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <FileText
        className="h-5 w-5"
        style={{ color: "var(--text-faint)" }}
        strokeWidth={1.5}
      />
      <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
        No notes yet
      </p>
      <p
        className="max-w-[220px] text-xs leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        A blank page is a good place to begin. Press{" "}
        <kbd
          className="rounded border px-1 py-0.5 font-sans text-[10px]"
          style={{
            borderColor: "var(--kbd-border)",
            background: "var(--kbd-bg)",
            color: "var(--kbd-text)",
          }}
        >
          N
        </kbd>{" "}
        for a new note.
      </p>
      {onCreate && (
        <button
          type="button"
          onClick={onCreate}
          className="mt-2 rounded-lg px-3 py-1.5 text-xs font-medium transition focus-amber"
          style={{
            background: "var(--accent)",
            color: "var(--accent-text)",
          }}
        >
          Write something
        </button>
      )}
    </div>
  );
}
