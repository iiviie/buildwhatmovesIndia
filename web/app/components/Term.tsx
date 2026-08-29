"use client";

import { createContext, type ReactNode, useContext } from "react";
import { glossary, type GlossaryId } from "../glossary";
import { Hovercard } from "./Hovercard";

type Lang = "en" | "hi";

/* The language is set once at the root rather than threaded through every
   call site. A term appears in the middle of a sentence, often several to a
   paragraph, and `<Term id="tds" />` is the only spelling short enough that
   authors will actually use it. */
const LanguageContext = createContext<Lang>("en");

export const TermLanguage = LanguageContext.Provider;

const labels = {
  en: {
    ask: (term: string) => `What is ${term}?`,
    where: "Where to get it",
    why: "Why it matters to you",
  },
  hi: {
    ask: (term: string) => `${term} क्या है?`,
    where: "यह कहाँ से मिलेगा",
    why: "आपके लिए इसका क्या मतलब है",
  },
} as const;

export function Term({
  id,
  children,
}: {
  id: GlossaryId;
  /** Overrides the displayed text where a sentence needs a different form. */
  children?: ReactNode;
}) {
  const language = useContext(LanguageContext);
  const entry = glossary[language][id];
  const copy = labels[language];

  return (
    <Hovercard
      className="term"
      label={copy.ask(entry.term)}
      panel={
        <>
          <p className="hc-term">{entry.term}</p>
          <p className="hc-what">{entry.what}</p>
          {entry.where && (
            <p className="hc-line">
              <span className="label">{copy.where}</span>
              {entry.where}
            </p>
          )}
          <p className="hc-line">
            <span className="label">{copy.why}</span>
            {entry.why}
          </p>
        </>
      }
      panelClassName="hc-glossary"
    >
      {children ?? entry.term}
    </Hovercard>
  );
}
