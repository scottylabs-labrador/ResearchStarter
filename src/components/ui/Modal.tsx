import React, { useId } from "react";
import Surface from "./Surface";
import { cx } from "./cx";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  /** sm = confirm dialogs; lg = add/edit forms */
  size?: "sm" | "lg";
  className?: string;
}

const sizeClass = {
  sm: "max-w-sm",
  lg: "max-w-2xl",
} as const;

const Modal = ({ title, children, footer, size = "sm", className }: ModalProps) => {
  const titleId = useId();
  return (
    <div className="fixed inset-0 z-50 flex animate-fadeIn items-center justify-center bg-ink/40 p-4 backdrop-blur-sm motion-reduce:animate-none">
      <Surface
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cx("w-full animate-dropIn p-6 shadow-popover motion-reduce:animate-none", sizeClass[size], className)}
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
