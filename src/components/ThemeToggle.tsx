import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "~/store/theme";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 focus-amber dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 ${
        className
      }`}
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
    >
      {isLight ? (
        <Moon className="h-4 w-4" strokeWidth={1.75} />
      ) : (
        <Sun className="h-4 w-4" strokeWidth={1.75} />
      )}
    </button>
  );
}
