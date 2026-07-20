import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "christmas" | "halloween";

export const THEMES: {
  id: Theme;
  label: string;
  description: string;
  themeColor: string;
}[] = [
  {
    id: "light",
    label: "Light",
    description: "Warm zinc & amber",
    themeColor: "#fafafa",
  },
  {
    id: "dark",
    label: "Dark",
    description: "Quiet night writing",
    themeColor: "#09090b",
  },
  {
    id: "christmas",
    label: "Christmas",
    description: "Pine, cream & crimson",
    themeColor: "#0f2e1c",
  },
  {
    id: "halloween",
    label: "Halloween",
    description: "Midnight & pumpkin",
    themeColor: "#140a1f",
  },
];

type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

function isTheme(value: unknown): value is Theme {
  return (
    value === "light" ||
    value === "dark" ||
    value === "christmas" ||
    value === "halloween"
  );
}

/**
 * Light is the default. Preference is persisted under `calm-notes-theme`.
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "calm-notes-theme",
      partialize: (s) => ({ theme: s.theme }),
      merge: (persisted, current) => {
        const p = persisted as { theme?: unknown } | undefined;
        const theme = isTheme(p?.theme) ? p.theme : current.theme;
        return { ...current, ...p, theme };
      },
    },
  ),
);

const THEME_CLASSES = ["dark", "theme-christmas", "theme-halloween"] as const;

/** Apply theme classes + data-theme on <html> (and meta theme-color). */
export function applyThemeClass(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  for (const c of THEME_CLASSES) root.classList.remove(c);
  root.setAttribute("data-theme", theme);

  if (theme === "dark") root.classList.add("dark");
  if (theme === "christmas") root.classList.add("theme-christmas");
  if (theme === "halloween") root.classList.add("theme-halloween");

  const meta = document.querySelector('meta[name="theme-color"]');
  const entry = THEMES.find((t) => t.id === theme);
  if (meta && entry) meta.setAttribute("content", entry.themeColor);
}

export function isDarkishTheme(theme: Theme): boolean {
  return theme === "dark" || theme === "christmas" || theme === "halloween";
}
