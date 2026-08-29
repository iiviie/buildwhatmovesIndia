import { act, fireEvent, render, screen } from "@testing-library/react";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { markUp, Prose } from "../app/components/Prose";
import { Term, TermLanguage } from "../app/components/Term";
import { glossary, glossaryIds, type GlossaryId } from "../app/glossary";

/* The hover timing lives in tests/hovercard.test.tsx. What is at stake here is
   the content: that both languages hold the same terms, that none of them is
   blank, and that every marker written into the copy resolves to one of them. */

const LANGUAGES = ["en", "hi"] as const;

/* A slab is not a document, so there is nowhere to go and get one. Every other
   term names a place, and this list is what keeps a future blank honest. */
const WHERE_MAY_BE_BLANK = new Set<GlossaryId>(["slab"]);

/* Every module under app/ is scanned, rather than a list someone has to
   remember to extend. A new copy file is exactly the place a bad marker will
   be typed, and a list that has to be maintained is a list that will be out of
   date on the day it matters. Components are included too: a marker written
   into JSX is as wrong as one written into copy. */
const APP = resolve(process.cwd(), "app");

const copyFiles = (): string[] => {
  const root = APP;
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return walk(path);
      return /\.tsx?$/.test(entry.name) ? [path] : [];
    });
  return walk(root);
};

const MARKER = /\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g;
/* Anything that looks like it was meant as a marker, including the malformed
   ones — `[[Form 16]]` never matches MARKER and would reach the screen as is. */
const LOOSE_MARKER = /\[\[[^\]]*\]\]/g;

const copy = () => {
  const files = copyFiles();
  /* The previous version resolved its paths through `import.meta.url`, which
     is not a file URL under this runner, and quietly filtered the whole list
     away — so the marker check passed by scanning nothing. A scan that finds
     no files is a broken scan, not a clean bill of health. */
  if (files.length === 0) throw new Error("no app modules found to scan");
  return files.map((path) => ({
    name: relative(APP, path),
    /* Comments are stripped first. Several files document the marker syntax
       itself — `[[term-id]]` in Prose.tsx is the canonical example — and those
       are prose about the feature, not uses of it. */
    text: readFileSync(path, "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, " ")
      .replace(/^\s*\/\/.*$/gm, " "),
  }));
};

/* Matches the wrapping in hovercard.test.tsx: opening is a state change made
   from a timer, and advancing the clock outside act leaves the queue unflushed. */
const tick = (ms: number) => {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
};

const openPanel = (name?: string | RegExp) => {
  fireEvent.focus(screen.getByRole("button", name ? { name } : undefined));
  return screen.getByRole("tooltip");
};

beforeEach(() => {
  vi.useFakeTimers();
  /* Clears the warm window a previous test may have left open. */
  tick(1000);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("the two languages hold the same glossary", () => {
  it("defines every English term in Hindi as well", () => {
    expect(Object.keys(glossary.hi).sort()).toEqual(
      Object.keys(glossary.en).sort(),
    );
  });

  it("lists each of those terms exactly once in glossaryIds", () => {
    expect([...glossaryIds].sort()).toEqual(Object.keys(glossary.en).sort());
    expect(new Set(glossaryIds).size).toBe(glossaryIds.length);
  });
});

describe("no term is left half written", () => {
  it("names each term, says what it is and why it matters, in both languages", () => {
    const blank: string[] = [];

    for (const language of LANGUAGES) {
      for (const id of glossaryIds) {
        const entry = glossary[language][id];
        for (const field of ["term", "what", "why"] as const) {
          if (!entry[field].trim()) blank.push(`${language}.${id}.${field}`);
        }
      }
    }

    expect(blank).toEqual([]);
  });

  it("says where to get every term there is somewhere to go for", () => {
    const blank: string[] = [];

    for (const language of LANGUAGES) {
      for (const id of glossaryIds) {
        if (WHERE_MAY_BE_BLANK.has(id)) continue;
        if (!glossary[language][id].where.trim()) {
          blank.push(`${language}.${id}.where`);
        }
      }
    }

    expect(blank).toEqual([]);
  });
});

describe("the markers in the copy", () => {
  it("all name a term the glossary can explain", () => {
    const known = new Set<string>(glossaryIds);
    const unknown: string[] = [];

    for (const file of copy()) {
      for (const match of file.text.matchAll(MARKER)) {
        if (!known.has(match[1])) unknown.push(`${file.name}: ${match[0]}`);
      }
    }

    expect(unknown).toEqual([]);
  });

  it("are all written in a form the renderer reads", () => {
    const malformed: string[] = [];

    for (const file of copy()) {
      for (const match of file.text.matchAll(LOOSE_MARKER)) {
        /* Reset because MARKER is a global regex reused across iterations. */
        MARKER.lastIndex = 0;
        if (!MARKER.test(match[0])) malformed.push(`${file.name}: ${match[0]}`);
      }
    }

    expect(malformed).toEqual([]);
  });
});

describe("the panel a term opens", () => {
  it("answers what it is, where to get it and why it matters", () => {
    const entry = glossary.en["form-26as"];
    render(
      <TermLanguage value="en">
        <Term id="form-26as" />
      </TermLanguage>,
    );

    const panel = openPanel();
    expect(panel).toHaveTextContent(entry.term);
    expect(panel).toHaveTextContent(entry.what);
    expect(panel).toHaveTextContent(entry.where);
    expect(panel).toHaveTextContent(entry.why);
  });

  it("is in Hindi for a Hindi reader", () => {
    render(
      <TermLanguage value="hi">
        <Term id="form-26as" />
      </TermLanguage>,
    );

    const panel = openPanel();
    expect(panel).toHaveTextContent(glossary.hi["form-26as"].what);
    expect(panel).not.toHaveTextContent(glossary.en["form-26as"].what);
  });

  it("still explains the whole term when the sentence uses other words", () => {
    render(
      <TermLanguage value="en">
        <Term id="tds">tax deducted</Term>
      </TermLanguage>,
    );

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveTextContent("tax deducted");
    expect(trigger).not.toHaveTextContent(glossary.en.tds.term);

    fireEvent.focus(trigger);
    expect(screen.getByRole("tooltip")).toHaveTextContent(glossary.en.tds.what);
  });

  it("is opened by a button whose name asks the question", () => {
    for (const language of LANGUAGES) {
      const view = render(
        <TermLanguage value={language}>
          <Term id="pan" />
        </TermLanguage>,
      );

      const trigger = screen.getByRole("button");
      expect(trigger).toBeEnabled();
      expect(trigger).toHaveAccessibleName(/\?$/);
      expect(trigger).toHaveAccessibleName(
        new RegExp(glossary[language].pan.term),
      );

      view.unmount();
    }
  });
});

describe("markUp", () => {
  it("leaves a sentence with no jargon alone", () => {
    expect(markUp("You have nothing left to do.")).toEqual([
      "You have nothing left to do.",
    ]);
  });

  it("turns a marker into a term the reader can open", () => {
    render(<Prose>{"Every rupee in [[form-26as]] was paid for you."}</Prose>);

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveTextContent(glossary.en["form-26as"].term);
    expect(screen.getByText(/Every rupee in/)).toHaveTextContent(
      "was paid for you.",
    );
  });

  it("uses the writer's words when the marker carries them", () => {
    render(<Prose>{"...the [[tds|tax your employer deducted]] is here."}</Prose>);

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveTextContent("tax your employer deducted");
    expect(openPanel()).toHaveTextContent(glossary.en.tds.what);
  });

  it("leaves an unknown id as plain text rather than breaking the page", () => {
    expect(() => render(<Prose>{"Check your [[frm-16]] first."}</Prose>)).not.toThrow();

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText(/Check your/)).toHaveTextContent(
      "Check your [[frm-16]] first.",
    );
  });

  it("falls back to the writer's words when an unknown id carries them", () => {
    render(<Prose>{"Check your [[frm-16|Form 16]] first."}</Prose>);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText(/Check your/)).toHaveTextContent(
      "Check your Form 16 first.",
    );
  });
});
