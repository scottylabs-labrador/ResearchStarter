import React, { useEffect, useId, useRef } from "react";
import Surface from "./Surface";
import { cx } from "./cx";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  /** Called on Escape; the caller unmounts the Modal to close it. */
  onClose: () => void;
  /** sm = confirm dialogs; lg = add/edit forms */
  size?: "sm" | "lg";
  className?: string;
}

const sizeClass = {
  sm: "max-w-sm",
  lg: "max-w-2xl",
} as const;

const Modal = ({ title, children, footer, onClose, size = "sm", className }: ModalProps) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);

  // showModal() moves focus inside and makes the rest of the page inert; closing hands focus back to the opener.
  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog?.showModal();
    return () => {
      dialog?.close();
      opener?.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      role="dialog"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className={cx(
        "m-auto w-[calc(100%-32px)] bg-transparent p-0 text-ink backdrop:animate-fadeIn backdrop:bg-ink/40 backdrop:backdrop-blur-sm motion-reduce:backdrop:animate-none",
        sizeClass[size]
      )}
    >
      <Surface className={cx("w-full animate-dropIn p-6 shadow-popover motion-reduce:animate-none", className)}>
        <h2 id={titleId} className="mb-3 text-heading text-ink">
          {title}
        </h2>
        <div className="text-body text-ink-secondary">{children}</div>
        <div className="mt-6 flex justify-end gap-2">{footer}</div>
      </Surface>
    </dialog>
  );
};

export default Modal;
