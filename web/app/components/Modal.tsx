"use client";

import {
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
} from "react";

const FOCUSABLE =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  children,
  onClose,
  labelledBy,
  describedBy,
  initialFocus,
  role = "dialog",
  className = "",
  backdropClassName = "",
}: {
  children: ReactNode;
  onClose: () => void;
  labelledBy: string;
  describedBy?: string;
  /* Where the caret should land when the dialog opens. Without it the first
     focusable element wins, and in DOM order that is usually the close button
     — so a dialog whose whole point is a field to type in opens with focus on
     the way out of it. */
  initialFocus?: RefObject<HTMLElement | null>;
  role?: "dialog" | "alertdialog";
  className?: string;
  backdropClassName?: string;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    opener.current = document.activeElement;
    const first =
      initialFocus?.current ?? panel.current?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel.current)?.focus();
    return () => {
      if (opener.current instanceof HTMLElement) opener.current.focus();
    };
    /* Deliberately once, on open: the ref is read at that moment and a later
       change to it must not steal focus back from wherever the reader has
       since moved it. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !panel.current) return;

    const focusable = Array.from(
      panel.current.querySelectorAll<HTMLElement>(FOCUSABLE),
    ).filter((node) => node.offsetParent !== null || node === document.activeElement);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className={`backdrop no-print ${backdropClassName}`}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-modal="true"
        className={className}
        onKeyDown={onKeyDown}
        ref={panel}
        role={role}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
}
