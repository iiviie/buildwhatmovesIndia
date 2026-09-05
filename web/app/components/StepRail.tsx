"use client";

import { useState } from "react";
import { stepGuides } from "../step-guide";
import { CheckIcon, LockIcon } from "./icons";
import { Hovercard } from "./Hovercard";

type Lang = "en" | "hi";

const previewLabels = {
  en: {
    ask: (name: string) => `${name}, what this step involves`,
    hide: "Hide all steps",
    needs: "You need",
    show: "Show all steps",
    stepOf: (current: number, total: number) => `Step ${current} of ${total}`,
  },
  hi: {
    ask: (name: string) => `${name}, इस चरण में क्या है`,
    hide: "सभी चरण छिपाएँ",
    needs: "आपको चाहिए",
    show: "सभी चरण देखें",
    stepOf: (current: number, total: number) => `चरण ${current} / ${total}`,
  },
} as const;

export function StepRail({
  current,
  language,
  names,
  complete,
  onGo,
  reached,
  words,
}: {
  /** Index of the step the citizen is on. */
  current: number;
  language: Lang;
  /** `copy.steps`, including the unnumbered start screen at index 0. */
  names: string[];
  onGo: (step: number) => void;
  /** The furthest step ever opened. What a step is allowed to be is measured
      against this, never against `current`: going back to step 4 to check a
      figure must not re-lock the step 5 you have already been through. */
  reached: number;
  /** The return has been verified. Reaching the last step is not the same as
      finishing it — the verification screen is a step you stand on, and only
      verification makes it done — so the last node and the meter wait for
      this rather than for `reached`. */
  complete: boolean;
  words: {
    label: string;
    count: string;
    done: string;
    here: string;
    open: string;
    locked: string;
  };
}) {
  const guides = stepGuides[language];
  const preview = previewLabels[language];
  const [expanded, setExpanded] = useState(false);

  const total = names.length - 1;
  /* How far the return has got, which is not the same as where the citizen is
     standing: going back to step 4 to check a figure does not undo step 5.
     `words.count` is built from the same two numbers upstream, so the drawn
     progress and the written progress can never disagree. */
  const frontier = Math.max(current, reached);
  const walked = complete
    ? total
    : Math.min(Math.max(frontier - 1, 0), total);

  return (
    <nav aria-label={words.label} className="toc no-print">
      <button
        aria-expanded={expanded}
        className="toc-toggle"
        onClick={() => setExpanded((open) => !open)}
        type="button"
      >
        <span>
          <span className="label">{preview.stepOf(current, total)}</span>
          <strong>{names[current]}</strong>
        </span>
        <span className="toc-toggle-action">
          {expanded ? preview.hide : preview.show}
        </span>
      </button>

      <div className="toc-summary">
        <p className="label">{words.label}</p>
        <p className="toc-count">{words.count}</p>
        {/* The same count, drawn. Hidden from a screen reader because the line
            above has already said it in words. */}
        <div aria-hidden="true" className="toc-meter">
          <span
            className="toc-meter-fill"
            style={{ width: `${total > 0 ? (walked / total) * 100 : 0}%` }}
          />
        </div>
      </div>
      <ol className={expanded ? "is-expanded" : undefined}>
        {names.slice(1).map((name, index) => {
          const number = index + 1;
          const here = number === current;
          /* Four states, not three. A step below the furthest you have been is
             behind you; the furthest one itself is open but not finished; and
             only what you have never opened is locked. */
          /* Once the return is verified every step is behind you, including
             the one you are standing on. Until then, the final step remains
             current because submission still needs verification. */
          const done = complete || (!here && number < reached);
          const open = !here && !done && number <= reached;
          const locked = number > reached;
          const guide = guides[number];

          /* Status is carried by an icon and a word, never by colour alone, so
             it survives a screen reader and a monochrome display. */
          const status = done
            ? words.done
            : here
              ? words.here
              : open
                ? words.open
                : words.locked;

          const state = here
            ? `is-current${done ? " is-complete" : ""}`
            : done
              ? "is-done"
              : open
                ? "is-open"
                : "is-locked";

          /* The connector is drawn in two halves per row, above the mark and
             below it, so a step name that wraps onto a second line cannot pull
             the track out of line. A half is inked when the whole of it lies
             behind the frontier; the frontier itself falls on the mark, which
             is where the walked length is meant to stop. */
          const trail = [
            (complete || number <= frontier) && "has-trail-in",
            (complete || number < frontier) && "has-trail-out",
          ].filter(Boolean);

          return (
            <li className={[state, ...trail].join(" ")} key={name}>
              <Hovercard
                current={here}
                label={`${preview.ask(name)}. ${status}.`}
                onClick={() => onGo(number)}
                /* Hover itself now marks the whole row clearly. The detailed
                   preview remains available on keyboard focus without
                   covering the form whenever a pointer crosses the rail. */
                openOnHover={false}
                panel={
                  <>
                    <p className="hc-term">{name}</p>
                    <p className="hc-step-summary">{guide.summary}</p>
                    <ul>
                      {guide.asks.map((ask) => (
                        <li key={ask}>{ask}</li>
                      ))}
                    </ul>
                    <p className="hc-meta">
                      {guide.needs && (
                        <span>
                          {preview.needs}: {guide.needs}
                        </span>
                      )}
                      <span>{guide.time}</span>
                    </p>
                  </>
                }
                panelClassName="hc-step"
                /* Beside the rail, not under the row: under the row is the
                   next step, and the preview was landing on the step the
                   reader was reaching for. */
                placement="beside"
                unavailable={locked}
              >
                {/* The mark and the two lengths of track that meet at it. The
                    wrapper exists to give those lengths something the height of
                    the whole row to hang from. */}
                <span aria-hidden="true" className="toc-node">
                  <span className="toc-mark">
                    {done ? <CheckIcon /> : (here || open) ? number : locked ? <LockIcon /> : null}
                  </span>
                </span>
                <span className="toc-label">
                  {name}
                  {/* The mark already says which state a row is in — a tick, a
                      number, a padlock — and printing the word under all seven
                      turned the rail into a column of shouting. The word stays
                      for a screen reader on every row, and stays visible on the
                      one row where it is news: the step you are on. */}
                  {here ? (
                    <span className="toc-status">{status}</span>
                  ) : (
                    <span className="sr-only">{status}</span>
                  )}
                </span>
              </Hovercard>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
