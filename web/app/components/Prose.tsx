"use client";

import { type ReactNode } from "react";
import { glossaryIds, type GlossaryId } from "../glossary";
import { Term } from "./Term";

/* Jargon is marked up in the copy files rather than placed by hand in JSX.

   `content.ts` holds plain strings in two languages, and a term that needs
   explaining can appear anywhere in one of them. Writing `<Term>` at the call
   site would mean breaking every such string into fragments and keeping the
   English and Hindi halves structurally identical for ever. Instead the copy
   carries a marker and this renders it:

     "Every rupee in [[form-26as]] is tax someone paid against your [[pan]]."
     "...the [[tds|tax your employer deducted]] shows up here."

   The second form is for when the sentence needs a different wording than the
   term's own name. An unknown id is left as written rather than throwing, so a
   typo degrades to plain text instead of a blank screen; the test in
   tests/glossary.test.tsx is what actually catches it. */

const MARKER = /\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g;

const known = new Set<string>(glossaryIds);

export function markUp(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;

  for (const match of text.matchAll(MARKER)) {
    const [whole, id, label] = match;
    const at = match.index;

    if (at > last) out.push(text.slice(last, at));

    if (known.has(id)) {
      out.push(
        <Term id={id as GlossaryId} key={`${id}-${at}`}>
          {label}
        </Term>,
      );
    } else {
      out.push(label ?? whole);
    }
    last = at + whole.length;
  }

  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Renders a copy string, turning `[[term-id]]` markers into hover panels. */
export function Prose({
  children,
  className,
  as: Tag = "p",
}: {
  children: string;
  className?: string;
  as?: "p" | "span" | "li" | "div";
}) {
  return <Tag className={className}>{markUp(children)}</Tag>;
}
