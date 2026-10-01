import { RefObject, useEffect, useRef } from "react";

const NON_TEXT_INPUTS = new Set(["checkbox", "radio", "button", "submit", "reset", "range", "color", "file", "image"]);

const isTextEntry = (el: Element | null): boolean => {
  if (!(el instanceof HTMLElement)) return false;
  if (el.isContentEditable) return true;
  if (el instanceof HTMLInputElement) return !NON_TEXT_INPUTS.has(el.type);
  return el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement;
};

// `beforeFocus` runs first so a caller can reveal a hidden input; hidden inputs can't take focus.
export function useSlashToFocus(ref: RefObject<HTMLInputElement>, beforeFocus?: () => void) {
  const beforeFocusRef = useRef(beforeFocus);
  beforeFocusRef.current = beforeFocus;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Shift is not checked: several keyboard layouts need it to type "/".
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTextEntry(document.activeElement)) return;
      e.preventDefault();
      beforeFocusRef.current?.();
      ref.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [ref]);
}
