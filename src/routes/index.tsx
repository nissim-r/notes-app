import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Drawer } from "vaul";
import { CommandPalette } from "~/components/CommandPalette";
import { NoteEditor } from "~/components/NoteEditor";
import { NoteList } from "~/components/NoteList";
import { useNotesStore } from "~/store/notes";

export const Route = createFileRoute("/")({
  component: NotesApp,
});

function NotesApp() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const createNote = useNotesStore((s) => s.createNote);

  // Global keyboard: N = new note (when not typing)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const typing =
        tag === "input" ||
        tag === "textarea" ||
        target?.isContentEditable;

      if (typing) return;

      if (e.key === "n" || e.key === "N") {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        e.preventDefault();
        createNote();
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [createNote]);

  return (
    <div className="flex h-dvh min-h-dvh w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Desktop sidebar */}
      <aside className="hidden w-[300px] shrink-0 border-r border-zinc-200 md:flex md:flex-col lg:w-[320px] dark:border-zinc-800">
        <NoteList onOpenSearch={() => setPaletteOpen(true)} />
      </aside>

      {/* Main editor */}
      <main className="min-w-0 flex-1">
        <NoteEditor onOpenList={() => setDrawerOpen(true)} />
      </main>

      {/* Mobile note list drawer (vaul) */}
      <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-40 bg-zinc-900/30 backdrop-blur-[1px] md:hidden dark:bg-black/50" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex h-[85dvh] flex-col rounded-t-2xl border border-zinc-200 bg-zinc-50 outline-none md:hidden dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <Drawer.Title className="sr-only">Your notes</Drawer.Title>
            <Drawer.Description className="sr-only">
              Browse and open notes
            </Drawer.Description>
            <div className="min-h-0 flex-1 overflow-hidden pt-1">
              <NoteList
                onOpenSearch={() => {
                  setDrawerOpen(false);
                  setPaletteOpen(true);
                }}
                onSelectNote={() => setDrawerOpen(false)}
              />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
