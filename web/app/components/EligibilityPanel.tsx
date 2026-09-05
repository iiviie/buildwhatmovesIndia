"use client";

import { useId, useMemo, useState } from "react";
import { OFFICIAL_FORM_GUIDES, OFFICIAL_PORTAL } from "../case-data";
import { copy } from "../content";
import { decideForm, eligibility, type Question } from "../eligibility";
import { ChevronIcon, ExternalIcon } from "./icons";
import { markUp, Prose } from "./Prose";

/** Short structural wording. Everything a citizen reads that is about their own
    case comes from `eligibility.ts`; only the scaffolding is passed in here. */
export type EligibilityLabels = {
  /** Heading over the panel. */
  title: string;
  /** A sentence or two under the heading. May carry `[[term]]` markers. */
  intro: string;
  /** Standing line above the list, e.g. "18 questions in 6 sections, already answered". */
  summary: (questions: number, sections: number) => string;

  /** Lead-in over the decided form, e.g. "The form that applies to you". */
  outcomeLabel: string;
  /** Shown when nothing disqualifies, e.g. "Nothing in your answers takes you out of it." */
  outcomeSettled: string;
  /** Shown when something does, given the form that applies instead. */
  outcomeBlocked: (form: string) => string;
  /** That the prototype builds the ITR-1 route whatever the verdict is. Optional
      so the panel still renders where that caveat does not apply. */
  outOfScope?: (form: string) => string;
  /** Lead-in over the list of answers that decided it, given how many there are. */
  causesLabel: (count: number) => string;

  /** Question count on a section's own line, e.g. "3 questions". */
  sectionCount: (count: number) => string;
  /** Section state words. Never carried by colour alone. */
  stateSettled: string;
  stateChanged: string;
  stateBlocking: string;

  /** Lead-in on the line naming the record an answer came from. */
  whyLabel: string;
  /** Word marking a row the citizen has answered differently. */
  changedLabel: string;
  /** What the department's own answer was, e.g. "Our records say: No". */
  changedFrom: (recordAnswer: string) => string;
  /** Word marking a row as one of the answers that decided the verdict. It must
      not name a form: the verdict is named in the two blocks that frame the
      questions, and nowhere in between. */
  decidedLabel: string;
  /** Summary on the disclosure holding the portal's own wording. */
  officialSummary: string;

  /** Our equivalent of the portal's "informative purposes only" line. */
  disclaimer: string;
  /** That this is a prototype and not tax advice. */
  prototypeNote: string;
};

/* "Help me select ITR", answered.

   The portal puts eighteen questions in six sections between a salaried filer
   and the start of their return, in wording you have to already understand to
   answer. Fifteen of them are No for an ordinary salaried filer, and the
   department is holding the records that say so. So we do not ask again: every
   question is shown already answered, with the record the answer came from,
   and any of them can be changed.

   A section stays shut while everything in it is settled, because six lines a
   citizen can open is a page and eighteen rows is a wall. A section holding a
   changed answer, or one that decided the form, opens itself — and can then be
   shut again like any other. An earlier version nailed the deciding section
   open on the grounds that it was the important one, which left the reader
   holding a section they had already read and could not put down.

   The form is named twice, in the blocks that open and close the panel, and
   nowhere in between. An earlier version also named a form on every row that
   had ruled ITR-1 out, so changing two answers put "moves you to ITR-3" next
   to "moves you to ITR-2" and left the citizen to work out which one they were
   actually meant to file. Rows now only say that they were part of the
   decision.

   The block at the top is for the reader who never scrolls. The one at the
   bottom is for the reader who did: they have just spent eighteen rows
   changing answers, and the question they are holding at the end of it is
   "so what do I file, and where do I go?". That is the only place the panel
   offers a way out of the prototype, and it offers one only when the answers
   have taken the citizen somewhere this prototype cannot follow. */
export function EligibilityPanel({
  answers,
  labels,
  language,
  onChange,
}: {
  language: "en" | "hi";
  answers: Record<string, string>;
  onChange: (questionId: string, value: string) => void;
  labels: EligibilityLabels;
}) {
  const uid = useId();
  const sections = eligibility[language];
  const [opened, setOpened] = useState<Record<string, boolean>>({});

  const decision = useMemo(() => decideForm(answers), [answers]);
  const blocked = useMemo(() => new Set(decision.blockers), [decision]);

  const byId = useMemo(
    () =>
      new Map<string, Question>(
        sections.flatMap((section) =>
          section.questions.map(
            (question) => [question.id, question] as [string, Question],
          ),
        ),
      ),
    [sections],
  );

  const valueOf = (question: Question) =>
    answers[question.id] ?? question.answer;

  const labelFor = (question: Question, value: string) =>
    question.options.find((option) => option.value === value)?.label ?? value;

  const ruleFor = (question: Question) =>
    question.disqualifying?.find((rule) => rule.value === valueOf(question));

  /* What the citizen changed on the way down, in the order the questions are
     on the page rather than the order they were clicked in — the closing block
     is read against the page above it, not against a history. */
  const changed = sections
    .flatMap((section) => section.questions)
    .filter((question) => valueOf(question) !== question.answer);

  /* The panel's scaffolding is handed in; the closing block's words are read
     straight from the copy for this language. They are chosen by the decision
     rather than by the screen, and the panel already picks its own language
     for the eighteen questions themselves. */
  const words = copy[language];

  /* Falls back to the portal's front door rather than guessing a path, in case
     an answer ever produces a form the map does not carry. */
  const guide = OFFICIAL_FORM_GUIDES[decision.form] ?? OFFICIAL_PORTAL;

  return (
    <div className="elig-panel">
      <h3 className="elig-title">{labels.title}</h3>
      <Prose className="elig-lede">{labels.intro}</Prose>
      <p className="label elig-count">
        {labels.summary(byId.size, sections.length)}
      </p>

      <div
        className={
          decision.eligible
            ? "elig-outcome is-settled"
            : "elig-outcome is-blocked"
        }
      >
        {/* Only the verdict is announced. The reasons under it are long, and a
            screen reader reading all of them out on every radio click would be
            worse than silence. */}
        <div aria-live="polite">
          <p className="label">{labels.outcomeLabel}</p>
          <p className="elig-outcome-form">{decision.form}</p>
          <p className="elig-outcome-line">
            {decision.eligible
              ? labels.outcomeSettled
              : labels.outcomeBlocked(decision.form)}
          </p>
        </div>

        {/* This slot is always the same height. Changing a radio used to insert
            the scope note and every reason above the question, moving the
            control away from the pointer that had just used it. The reasons
            now live behind one disclosure in a reserved row. */}
        <div className="elig-outcome-more-slot">
          {decision.blockers.length > 0 && (
            <details className="elig-outcome-more">
              <summary>{labels.causesLabel(decision.blockers.length)}</summary>
              {!decision.eligible && labels.outOfScope && (
                <Prose className="elig-outcome-scope">
                  {labels.outOfScope(decision.form)}
                </Prose>
              )}
            <ul className="elig-causes">
              {decision.blockers.map((id) => {
                const question = byId.get(id);
                const rule = question && ruleFor(question);
                if (!question || !rule) return null;

                return (
                  <li className="elig-cause" key={id}>
                    <p className="elig-cause-q">{markUp(question.plain)}</p>
                    <p className="elig-cause-why">{markUp(rule.because)}</p>
                  </li>
                );
              })}
            </ul>
            </details>
          )}
        </div>
      </div>

      <ol className="elig-sections">
        {sections.map((section) => {
          const blocking = section.questions.some((question) =>
            blocked.has(question.id),
          );
          const changed = section.questions.filter(
            (question) => valueOf(question) !== question.answer,
          );
          /* Keyed by which answers in the section have been changed rather than
             by the section, so a citizen who shut a settled section and then
             changed something in it gets it back open rather than hidden. */
          const key = `${section.id}|${changed.map((q) => q.id).join(",")}`;
          const open = opened[key] ?? (blocking || changed.length > 0);
          const panelId = `${uid}-${section.id}`;

          const state = blocking
            ? labels.stateBlocking
            : changed.length > 0
              ? labels.stateChanged
              : labels.stateSettled;

          const head = (
            <>
              <span className="elig-section-no">{section.number}</span>
              <span className="elig-section-name">{section.name}</span>
              <span className="elig-section-meta">
                <span className="elig-section-count">
                  {labels.sectionCount(section.questions.length)}
                </span>
                <span
                  className={
                    blocking
                      ? "label elig-section-state is-blocking"
                      : changed.length > 0
                        ? "label elig-section-state is-changed"
                        : "label elig-section-state is-settled"
                  }
                >
                  {state}
                </span>
              </span>
            </>
          );

          return (
            <li className="elig-section" key={section.id}>
              {/* Every section opens and closes, including the one that
                  decided the form. That one opens itself; what it does not do
                  is refuse to shut. */}
              <h4 className="elig-section-head">
                <button
                  aria-controls={panelId}
                  aria-expanded={open}
                  className="elig-section-toggle"
                  onClick={() =>
                    setOpened((prev) => ({ ...prev, [key]: !open }))
                  }
                  type="button"
                >
                  {head}
                  <ChevronIcon
                    className={open ? "elig-chevron is-open" : "elig-chevron"}
                  />
                </button>
              </h4>

              <div className="elig-section-body" hidden={!open} id={panelId}>
                <ul className="elig-questions">
                  {section.questions.map((question) => {
                    const value = valueOf(question);
                    const rule = ruleFor(question);
                    const isChanged = value !== question.answer;

                    return (
                      <li
                        className={
                          rule ? "elig-question is-blocking" : "elig-question"
                        }
                        key={question.id}
                      >
                        <fieldset className="elig-field">
                          <legend className="elig-legend">
                            {markUp(question.plain)}
                          </legend>

                          <div className="elig-options">
                            {question.options.map((option) => (
                              /* Option labels are rendered as written. A
                                 glossary marker here would put a button inside
                                 a label and steal the click from the radio. */
                              <label className="elig-opt" key={option.value}>
                                <input
                                  checked={value === option.value}
                                  name={`${uid}-${question.id}`}
                                  onChange={() =>
                                    onChange(question.id, option.value)
                                  }
                                  type="radio"
                                  value={option.value}
                                />
                                <span>{option.label}</span>
                              </label>
                            ))}
                          </div>

                          {rule && (
                            <p className="elig-flag">
                              <span className="label elig-flag-mark">
                                {labels.decidedLabel}
                              </span>
                            </p>
                          )}

                          {isChanged && (
                            <p className="elig-changed">
                              <span className="label">
                                {labels.changedLabel}
                              </span>
                              {labels.changedFrom(
                                labelFor(question, question.answer),
                              )}
                            </p>
                          )}

                          <p className="elig-why">
                            <span className="label">{labels.whyLabel}</span>
                            {markUp(question.why)}
                          </p>

                          {/* The portal's own wording, kept to hand so the row
                              can be checked against the real form, but not made
                              the thing you have to read first. */}
                          <details className="elig-official">
                            <summary>{labels.officialSummary}</summary>
                            <p className="elig-official-text">
                              {markUp(question.official)}
                            </p>
                          </details>
                        </fieldset>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Not a live region. The verdict at the top already announces itself on
          every change, and a second one saying the same thing would read the
          answer out twice on every radio click. */}
      <div
        className={
          decision.eligible ? "elig-close is-settled" : "elig-close is-blocked"
        }
      >
        <p className="label">{words.eligClosingLabel}</p>
        <p className="elig-close-form">{decision.form}</p>
        <Prose className="elig-close-line">
          {decision.eligible
            ? words.eligClosingSettled(decision.form)
            : words.eligClosingBlocked(decision.form)}
        </Prose>

        {changed.length === 0 ? (
          <p className="elig-close-note">{words.eligClosingUnchanged}</p>
        ) : (
          <>
            <p className="elig-close-note">
              {words.eligClosingChanged(changed.length)}
            </p>
            <ul className="elig-close-changes">
              {changed.map((question) => (
                <li className="elig-close-change" key={question.id}>
                  <p className="elig-close-change-q">{markUp(question.plain)}</p>
                  <p className="elig-close-change-a">
                    <span className="label">{words.eligClosingNowLabel}</span>
                    {labelFor(question, valueOf(question))}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Only when the answers have left ITR-1. A citizen still on ITR-1 is
            in the right place, and sending them to the department's site from
            here would be sending them away from the thing they came to do. */}
        {!decision.eligible && (
          <p className="elig-close-out no-print">
            <a href={guide} rel="noreferrer noopener" target="_blank">
              {words.eligClosingLink(decision.form)}
              <ExternalIcon />
              <span className="sr-only">{words.newWindow}</span>
            </a>
          </p>
        )}
      </div>

      <div className="elig-notes">
        <Prose className="elig-note">{labels.disclaimer}</Prose>
        <Prose className="elig-note">{labels.prototypeNote}</Prose>
      </div>
    </div>
  );
}
