import { useEffect, useRef } from "react";

export const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
export const modKey = isMac ? "⌘" : "Ctrl";

export interface ShortcutHandlers {
  run?: () => void;
  reset?: () => void;
  next?: () => void;
  prev?: () => void;
}

/** Window-level workbench shortcuts: Mod+Enter run, Mod+Shift+R reset, Alt+→ / Alt+← navigate. */
export function useWorkbenchShortcuts(handlers: ShortcutHandlers) {
  const ref = useRef(handlers);
  useEffect(() => {
    ref.current = handlers;
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const mod = isMac ? event.metaKey : event.ctrlKey;
      const h = ref.current;
      if (mod && event.key === "Enter" && h.run) {
        event.preventDefault();
        h.run();
      } else if (mod && event.shiftKey && event.key.toLowerCase() === "r" && h.reset) {
        event.preventDefault();
        h.reset();
      } else if (event.altKey && !mod && event.key === "ArrowRight" && h.next) {
        event.preventDefault();
        h.next();
      } else if (event.altKey && !mod && event.key === "ArrowLeft" && h.prev) {
        event.preventDefault();
        h.prev();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
