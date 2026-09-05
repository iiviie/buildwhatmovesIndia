"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

/* Why there is a delay at all.

   A pointer crosses a great many words on its way to a button. If a panel
   opened the moment the pointer touched a term, an ordinary scroll or reach
   would leave a trail of boxes across a form somebody is trying to fill in.
   So the pointer has to come to rest on the term before we take it as a
   question. */
const OPEN_DELAY = 500;

/* Once somebody has opened one card they are reading rather than travelling,
   and making them wait the full half-second for the next term in the same
   sentence would read as the interface being slow. The group stays warm for a
   moment after the last card closes. */
const WARM_OPEN_DELAY = 150;
const WARM_FOR = 900;

/* Long enough to cross the gap between the term and the panel, so a citizen
   can move onto the panel to read it without it vanishing under them. */
const CLOSE_DELAY = 160;

/* Distance between the term and the panel, and the margin kept from the
   viewport edge when the panel has to be nudged sideways to fit. */
const GAP = 10;
const EDGE = 12;

let warmUntil = 0;

/* Only one card is ever open. Opening a second closes the first rather than
   layering them, which also means Escape only ever has one thing to close. */
let closeOpenCard: (() => void) | null = null;

type Placement = {
  top: number;
  left: number;
  side: "above" | "below" | "right" | "left";
};

/* Beside the trigger rather than under it.

   A card belonging to a word in a paragraph opens under the word, where there
   is nothing but more paragraph. A card belonging to a row in a vertical list
   cannot: under the row is the next row, and the panel lands on top of the
   thing the reader was on their way to click. Worse, the panel keeps itself
   open while the pointer is over it, so travelling down the list traps the
   pointer inside a card about the row above. These open to the side, clear of
   the list entirely.

   Returns null when neither side has the room — a narrow window, where the
   caller falls back to stacking. */
const placeBeside = (trigger: DOMRect, panel: DOMRect): Placement | null => {
  const right = trigger.right + GAP;
  const left = trigger.left - panel.width - GAP;

  const side: Placement["side"] | null =
    right + panel.width + EDGE <= window.innerWidth
      ? "right"
      : left >= EDGE
        ? "left"
        : null;
  if (!side) return null;

  /* Aligned with the top of its row, and never past either edge. */
  const top = Math.max(
    EDGE,
    Math.min(trigger.top, window.innerHeight - panel.height - EDGE),
  );

  return { top, left: side === "right" ? right : left, side };
};

const place = (trigger: DOMRect, panel: DOMRect): Placement => {
  const room = window.innerHeight - trigger.bottom;
  const side: Placement["side"] =
    room < panel.height + GAP + EDGE && trigger.top > panel.height + GAP + EDGE
      ? "above"
      : "below";

  /* When neither side has room — a short viewport in landscape, or a long
     definition — "below" is the fallback, and without this clamp the card
     simply hangs off the bottom of the screen. The panel's own max-height lets
     it scroll instead. */
  const wanted =
    side === "below" ? trigger.bottom + GAP : trigger.top - panel.height - GAP;
  const top = Math.max(
    EDGE,
    Math.min(wanted, window.innerHeight - panel.height - EDGE),
  );

  /* Prefer left-aligned with the term, but never let the panel run off the
     side of a narrow screen. At 320px it simply spans the viewport. */
  const max = window.innerWidth - panel.width - EDGE;
  const left = Math.max(EDGE, Math.min(trigger.left, Math.max(EDGE, max)));

  return { top, left, side };
};

export function Hovercard({
  children,
  label,
  panel,
  className = "",
  panelClassName = "",
  placement = "stacked",
  triggerClassName = "",
  onClick,
  openOnHover = true,
  unavailable = false,
  current = false,
}: {
  /** The trigger's visible content. */
  children: ReactNode;
  /** Accessible name for the trigger, e.g. "What is Form 26AS?". */
  label: string;
  /** The panel's content. Should not contain focusable elements. */
  panel: ReactNode;
  className?: string;
  panelClassName?: string;
  /** Where the panel goes relative to its trigger. "stacked" puts it under the
      trigger, which is right for a word inside a paragraph. "beside" puts it
      alongside, which is the only workable place for a row in a vertical list:
      under it is the next row. */
  placement?: "stacked" | "beside";
  /** Set when the trigger is also a control, as the step rail's buttons are. */
  triggerClassName?: string;
  onClick?: () => void;
  /** A dense navigation rail can use its own hover treatment while keeping
      the richer preview for deliberate keyboard focus. */
  openOnHover?: boolean;
  /* Marked with aria-disabled rather than disabled, because a disabled button
     takes neither hover nor focus — and a step you cannot reach yet is exactly
     the one whose preview is worth reading. It stays reachable and says it
     cannot be used; the click is dropped below. */
  unavailable?: boolean;
  current?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [at, setAt] = useState<Placement | null>(null);

  /* True only for the card currently registered as the open one, so `close`
     does not have to refer to itself to deregister. */
  const holdsFloor = useRef(false);

  const trigger = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const close = useCallback(() => {
    stopTimer();
    setOpen(false);
    setAt(null);
    warmUntil = Date.now() + WARM_FOR;
    if (holdsFloor.current) {
      holdsFloor.current = false;
      closeOpenCard = null;
    }
  }, []);

  const show = useCallback(() => {
    stopTimer();
    /* The current step already has its name and status in view. Reopening its
       preview after navigation only covers the content someone just chose. */
    if (current) return;
    /* Closing the incumbent first also deregisters it, so there is never a
       moment with two panels on screen. */
    if (closeOpenCard) closeOpenCard();
    closeOpenCard = close;
    holdsFloor.current = true;
    setOpen(true);
  }, [close, current]);

  const openAfterDelay = () => {
    stopTimer();
    const delay = Date.now() < warmUntil ? WARM_OPEN_DELAY : OPEN_DELAY;
    timer.current = setTimeout(show, delay);
  };

  const closeAfterDelay = () => {
    stopTimer();
    timer.current = setTimeout(close, CLOSE_DELAY);
  };

  useEffect(() => stopTimer, []);

  /* Measure once the panel is in the DOM, then keep it with its term when the
     page moves.

     This used to close on any scroll, which was wrong in a way only a real
     browser showed: tabbing to a term below the fold makes the browser scroll
     it into view, and that scroll arrives after the focus — so the card opened
     and immediately shut itself. Following the term is also just better than
     vanishing. The card only gives up once its term has left the viewport. */
  useEffect(() => {
    if (!open) return;
    let frame = 0;

    const measure = () => {
      const a = trigger.current?.getBoundingClientRect();
      const b = panelRef.current?.getBoundingClientRect();
      if (!a || !b) return;
      if (a.bottom < 0 || a.top > window.innerHeight) {
        close();
        return;
      }
      setAt(
        (placement === "beside" ? placeBeside(a, b) : null) ?? place(a, b),
      );
    };

    /* Scroll fires far more often than the panel needs moving. */
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };

    measure();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, close, placement]);

  /* There is deliberately no "is this a touch device" branch here.

     The first version asked `(hover: none)` and turned the pointer handling
     off when it matched. Headless Chrome answers `hover: none` with no fine
     pointer at all, which is how this was caught — but the same is true of any
     environment that misreports, and the failure is silent: the jargon layer
     just stops working. So both paths are always live. A device that cannot
     hover simply never fires mouseenter, which costs nothing, and tapping the
     term works everywhere rather than only where a media query says so. */

  return (
    <span
      className={`hc ${className}`}
      onMouseEnter={openOnHover ? openAfterDelay : undefined}
      onMouseLeave={closeAfterDelay}
    >
      <button
        aria-current={current ? "step" : undefined}
        aria-describedby={open ? id : undefined}
        aria-disabled={unavailable || undefined}
        aria-expanded={onClick ? undefined : open}
        aria-label={label}
        className={`hc-trigger ${triggerClassName}`}
        /* A keyboard user who has tabbed to the term has asked deliberately,
           so there is nothing to wait for. */
        onBlur={close}
        onClick={() => {
          if (unavailable) return;
          if (onClick) {
            /* Navigation can reuse this same DOM node for the newly-current
               step. Close before changing screens so its old preview cannot
               remain over the new content. */
            close();
            onClick();
            return;
          }
          /* With no control behind it the trigger exists only to open the
             panel: tap to open on touch, click to dismiss with a mouse. */
          if (open) close();
          else show();
        }}
        onFocus={show}
        ref={trigger}
        type="button"
      >
        {children}
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={`hc-panel ${panelClassName} ${
              at ? `is-${at.side}` : "is-measuring"
            }`}
            id={id}
            onMouseEnter={stopTimer}
            onMouseLeave={closeAfterDelay}
            ref={panelRef}
            role="tooltip"
            style={at ? { top: at.top, left: at.left } : undefined}
          >
            {panel}
          </div>,
          document.body,
        )}
    </span>
  );
}
