import { useEffect, useRef, useState } from "react";
import { Check, Palette } from "lucide-react";
import { THEMES, type Theme, useThemeStore } from "~/store/theme";

type ThemePickerProps = {
  className?: string;
};

const SWATCH: Record<Theme, string> = {
  light: "theme-swatch-light",
  dark: "theme-swatch-dark",
  christmas: "theme-swatch-christmas",
  halloween: "theme-swatch-halloween",
};

export function ThemePicker({ className = "" }: ThemePickerProps) {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-2 transition focus-amber"
        style={{
          color: "var(--text-faint)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--surface-hover)";
          e.currentTarget.style.color = "var(--text-secondary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--text-faint)";
        }}
        title="Themes"
        aria-label="Choose theme"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Palette className="h-4 w-4" strokeWidth={1.75} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Themes"
          className="absolute right-0 z-50 mt-1 w-56 overflow-hidden rounded-xl border animate-fade-in"
          style={{
            background: "var(--surface-elevated)",
            borderColor: "var(--border-strong)",
            boxShadow: "var(--shadow-elevated)",
          }}
        >
          <div
            className="border-b px-3 py-2 text-[11px] font-medium uppercase tracking-wide"
            style={{ borderColor: "var(--border)", color: "var(--text-faint)" }}
          >
            Theme
          </div>
          <ul className="p-1.5">
            {THEMES.map((t) => {
              const selected = theme === t.id;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      setTheme(t.id);
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition"
                    style={{
                      background: selected
                        ? "var(--surface-selected)"
                        : "transparent",
                      color: "var(--text-primary)",
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
                    <span
                      className={`h-7 w-7 shrink-0 rounded-full border ${SWATCH[t.id]}`}
                      style={{ borderColor: "var(--border-strong)" }}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{t.label}</span>
                      <span
                        className="block text-[11px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {t.description}
                      </span>
                    </span>
                    {selected && (
                      <Check
                        className="h-4 w-4 shrink-0"
                        style={{ color: "var(--accent)" }}
                        strokeWidth={2}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/** @deprecated use ThemePicker */
export { ThemePicker as ThemeToggle };
