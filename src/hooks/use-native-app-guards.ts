import { useEffect } from "react";

const ZOOM_KEYS = new Set(["+", "-", "=", "0"]);
// r: reload, f/g: find, p: print, s: save page, u: view source
const BLOCKED_SHORTCUT_KEYS = new Set(["r", "f", "g", "p", "s", "u"]);

/**
 * Makes the webview behave like a native app instead of a browser tab:
 * no text/element selection outside inputs, no right-click context menu,
 * no accidental zoom/reload/find/print/save-page/view-source shortcuts.
 */
export function useNativeAppGuards() {
  useEffect(() => {
    function isEditableTarget(target: EventTarget | null) {
      return (
        target instanceof HTMLElement &&
        target.closest('input, textarea, [contenteditable="true"]') !== null
      );
    }

    function handleContextMenu(event: MouseEvent) {
      if (!isEditableTarget(event.target)) {
        event.preventDefault();
      }
    }

    function handleWheel(event: WheelEvent) {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "F5") {
        event.preventDefault();
        return;
      }

      if (!event.ctrlKey && !event.metaKey) return;

      if (
        ZOOM_KEYS.has(event.key) ||
        BLOCKED_SHORTCUT_KEYS.has(event.key.toLowerCase())
      ) {
        event.preventDefault();
      }
    }

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}
