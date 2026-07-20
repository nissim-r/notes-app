import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import { applyThemeClass, useThemeStore } from "~/store/theme";
import appCss from "~/styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      { title: "Notes — Calm writing" },
      {
        name: "description",
        content:
          "A calm note-taking app. Create, search, and pin notes. Everything stays in your browser.",
      },
      { name: "theme-color", content: "#fafafa" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;0,8..60,700;1,8..60,400&display=swap",
      },
    ],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
});

function ThemeSync() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  // Re-apply after rehydration from localStorage
  useEffect(() => {
    const unsub = useThemeStore.persist.onFinishHydration((state) => {
      applyThemeClass(state.theme);
    });
    if (useThemeStore.persist.hasHydrated()) {
      applyThemeClass(useThemeStore.getState().theme);
    }
    return unsub;
  }, []);

  return null;
}

function RootComponent() {
  const theme = useThemeStore((s) => s.theme);

  return (
    <>
      <ThemeSync />
      <Outlet />
      <Toaster
        theme={theme}
        position="bottom-right"
        toastOptions={{
          className: "font-sans text-sm",
          style:
            theme === "dark"
              ? {
                  background: "#18181b",
                  color: "#fafafa",
                  border: "1px solid #27272a",
                  borderRadius: "10px",
                }
              : {
                  background: "#18181b",
                  color: "#fafafa",
                  border: "1px solid #27272a",
                  borderRadius: "10px",
                },
        }}
      />
    </>
  );
}

/** Inline script: apply saved theme before paint to avoid flash */
const THEME_BOOT_SCRIPT = `(function(){try{var raw=localStorage.getItem("calm-notes-theme");if(!raw)return;var parsed=JSON.parse(raw);var t=parsed&&parsed.state&&parsed.state.theme;if(t==="dark"){document.documentElement.classList.add("dark");var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content","#09090b");}}catch(e){}})();`;

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className="min-h-dvh isolate antialiased h-full">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
