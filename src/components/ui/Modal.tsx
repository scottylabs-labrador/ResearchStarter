import React, { useId } from "react";
import Surface from "./Surface";
import { cx } from "./cx";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  className?: string;
}

const Modal = ({ title, children, footer, className }: ModalProps) => {
  const titleId = useId();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
      <Surface
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cx("w-full max-w-sm animate-dropIn p-6 shadow-popover", className)}
      >
        <h2 id={titleId} className="mb-3 text-heading text-ink">
          {title}
        </h2>
        <div className="text-body text-ink-secondary">{children}</div>
        <div className="mt-6 flex justify-end gap-2">{footer}</div>
      </Surface>
    </div>
  );
};

export default Modal;
