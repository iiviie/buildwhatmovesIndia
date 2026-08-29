import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SahiReturnApp } from "../app/SahiReturnApp";
import {
  DRAFT_KEY,
  OFFICIAL_FORM_GUIDES,
  defaultDraft,
} from "../app/case-data";
import { decideForm, demoAnswers, eligibility } from "../app/eligibility";
import { SCREEN_KEY, SESSION_KEY } from "../app/auth";

/* The portal's "Help me select ITR" wizard asks eighteen questions in the
   department's own language before it will let anyone begin. We answer them
   from records the department already holds and show the working. What has to
   keep working is the honesty of that: change an answer, and the form the
   citizen is told to file has to change with it. */

const signedIn = () => {
  window.localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      userId: "DEMOA1234X",
      kind: "pan",
      name: "Ananya Rao",
      signedInAt: "2026-08-28T04:00:00.000Z",
    }),
  );
  window.localStorage.setItem(SCREEN_KEY, "journey");
};

/* The wizard's verdict, as opposed to the several other places the form name
   legitimately appears on the same screen. */
const decidedForm = () => {
  const node = document.querySelector(".elig-outcome-form");
  if (!node) throw new Error("no decided form on screen");
  return node;
};

/* The block a reader lands on after working down the eighteen rows, as opposed
   to the one at the top they may never have scrolled past. */
const closing = () => {
  const node = document.querySelector(".elig-close");
  if (!node) throw new Error("no closing verdict on screen");
  return node as HTMLElement;
};

const atStepOne = () => {
  signedIn();
  window.localStorage.setItem(
    DRAFT_KEY,
    JSON.stringify({ ...defaultDraft, step: 1 }),
  );
};

describe("the decision itself", () => {
  it("puts the demonstration taxpayer on ITR-1 with nothing blocking", () => {
    expect(decideForm(demoAnswers)).toEqual({
      form: "ITR-1",
      eligible: true,
      blockers: [],
    });
  });

  it("covers every question the portal asks, in both languages", () => {
    const ids = (language: "en" | "hi") =>
      eligibility[language].flatMap((section) =>
        section.questions.map((question) => question.id),
      );

    expect(ids("en")).toHaveLength(18);
    expect(eligibility.en).toHaveLength(6);
    /* The same ids in the same order, so the language cannot change the
       outcome — `decideForm` reads ids and values only. */
    expect(ids("hi")).toEqual(ids("en"));
  });

  it("names a different form when an answer rules ITR-1 out", () => {
    const asDirector = { ...demoAnswers, director: "yes" };
    const decision = decideForm(asDirector);

    expect(decision.eligible).toBe(false);
    expect(decision.form).not.toBe("ITR-1");
    expect(decision.blockers).toContain("director");
  });

  it("treats an unanswered question as not disqualifying", () => {
    expect(decideForm({}).eligible).toBe(true);
  });
});

describe("on the screen", () => {
  it("shows the decided form and the count of questions behind it", async () => {
    atStepOne();
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "What applies to you" });

    expect(
      screen.getByText("18 questions in 6 sections, already answered"),
    ).toBeInTheDocument();
    /* Scoped to the outcome line: "ITR-1" also appears in the margin summary
       and in the decided-for-you list, and this is about the wizard's verdict. */
    expect(decidedForm()).toHaveTextContent("ITR-1");
    expect(
      screen.getByText("Nothing in your answers takes you out of it."),
    ).toBeInTheDocument();
  });

  it("keeps the eighteen rows collapsed until one is opened", async () => {
    atStepOne();
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "What applies to you" });

    /* Six lines, not eighteen. A section only opens when it has something to
       say, which is what stops this reading as a wall. Scoped to the wizard —
       the bank-account nomination on the same step is also a radio group. */
    const wizard = () => {
      const node = document.querySelector(".elig-sections");
      if (!node) throw new Error("no eligibility sections on screen");
      return within(node as HTMLElement);
    };
    expect(wizard().queryAllByRole("radio")).toHaveLength(0);

    await userEvent.click(
      screen.getByRole("button", { name: /General Information/ }),
    );
    expect(wizard().getAllByRole("radio").length).toBeGreaterThan(0);
  });

  it("changes the form, and says what caused it, when an answer is changed", async () => {
    atStepOne();
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "What applies to you" });
    await userEvent.click(
      screen.getByRole("button", { name: /General Information/ }),
    );

    const question = eligibility.en[1].questions.find(
      (candidate) => candidate.id === "director",
    );
    if (!question) throw new Error("the director question has moved");

    const group = screen.getByRole("group", { name: question.plain });
    const yes = question.options.find((option) => option.value === "yes");
    if (!yes) throw new Error("the director question has no yes option");

    await userEvent.click(within(group).getByRole("radio", { name: yes.label }));

    expect(decidedForm()).not.toHaveTextContent("ITR-1");
    expect(screen.getByText(/take you out of ITR-1/i)).toBeInTheDocument();
    /* The reason is named, not just the outcome. */
    expect(screen.getByText(question.plain, { selector: ".elig-cause-q" }))
      .toBeInTheDocument();
  });

  it("remembers a changed answer across a reload", async () => {
    atStepOne();
    const first = render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "What applies to you" });
    await userEvent.click(
      screen.getByRole("button", { name: /Income Details/ }),
    );
    await userEvent.click(
      screen.getByRole("radio", { name: "More Than 2" }),
    );
    expect(decidedForm()).not.toHaveTextContent("ITR-1");

    first.unmount();
    render(<SahiReturnApp />);
    await screen.findByRole("heading", { name: "What applies to you" });

    expect(decidedForm()).not.toHaveTextContent("ITR-1");
    expect(screen.getByText(/take you out of ITR-1/i)).toBeInTheDocument();
  });
});

/* The end of the wizard is where someone who actually answered the eighteen
   questions arrives, and it is the only place the panel is allowed to send
   them out of the prototype. So: it has to restate the verdict rather than
   assume the reader remembers the top of the page, it has to say what they
   changed, and the way out has to appear only when there is somewhere to go. */
describe("the closing verdict", () => {
  const openSection = (name: RegExp) =>
    userEvent.click(screen.getByRole("button", { name }));

  const answer = (sectionIndex: number, questionId: string, value: string) => {
    const question = eligibility.en[sectionIndex].questions.find(
      (candidate) => candidate.id === questionId,
    );
    if (!question) throw new Error(`the ${questionId} question has moved`);
    const option = question.options.find((each) => each.value === value);
    if (!option) throw new Error(`${questionId} has no ${value} option`);
    return { question, option };
  };

  it("closes the panel with the form that applies, and keeps ITR-1 here", async () => {
    atStepOne();
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "What applies to you" });

    const end = within(closing());
    expect(end.getByText("Where this leaves you")).toBeInTheDocument();
    expect(closing().querySelector(".elig-close-form")).toHaveTextContent(
      "ITR-1",
    );
    /* Still on the prototype's own route, so it says so and offers no way
       off it. */
    expect(end.getByText(/carry on from here/i)).toBeInTheDocument();
    expect(
      end.getByText("Every answer above is still the one the department's own records give."),
    ).toBeInTheDocument();
    expect(end.queryByRole("link")).toBeNull();
  });

  it("names the form the changed answer points at, and what was changed", async () => {
    atStepOne();
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "What applies to you" });
    await openSection(/General Information/);

    const { question, option } = answer(1, "director", "yes");
    const group = screen.getByRole("group", { name: question.plain });
    await userEvent.click(within(group).getByRole("radio", { name: option.label }));

    const end = within(closing());
    expect(closing().querySelector(".elig-close-form")).toHaveTextContent(
      "ITR-2",
    );
    expect(end.getByText(/it is ITR-2 that applies, not ITR-1/i)).toBeInTheDocument();
    /* What changed, in the citizen's own words rather than the portal's. */
    expect(
      end.getByText("One answer is no longer what the department's records say:"),
    ).toBeInTheDocument();
    expect(
      end.getByText(question.plain, { selector: ".elig-close-change-q" }),
    ).toBeInTheDocument();
  });

  it("offers the department's own page for a form this prototype does not build", async () => {
    atStepOne();
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "What applies to you" });
    await openSection(/General Information/);

    const { question, option } = answer(1, "director", "yes");
    const group = screen.getByRole("group", { name: question.plain });
    await userEvent.click(within(group).getByRole("radio", { name: option.label }));

    const link = within(closing()).getByRole("link", {
      name: /Official filing help for ITR-2/,
    });
    expect(link).toHaveAttribute("href", OFFICIAL_FORM_GUIDES["ITR-2"]);
    /* It leaves the prototype for a government site, so it goes out the way
       every other outbound link here does. */
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer noopener");
    expect(link).toHaveTextContent("opens in a new window");
  });

  it("sends an ITR-3 filer to the index, there being no ITR-3 page to send them to", async () => {
    atStepOne();
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "What applies to you" });
    await openSection(/Business Details/);

    const { question, option } = answer(2, "partner-firm", "yes");
    const group = screen.getByRole("group", { name: question.plain });
    await userEvent.click(within(group).getByRole("radio", { name: option.label }));

    expect(closing().querySelector(".elig-close-form")).toHaveTextContent(
      "ITR-3",
    );
    expect(
      within(closing()).getByRole("link", {
        name: /Official filing help for ITR-3/,
      }),
    ).toHaveAttribute("href", OFFICIAL_FORM_GUIDES["ITR-3"]);
  });
});

describe("the three documents", () => {
  it("explains what they are on the way in, rather than naming them", async () => {
    render(<SahiReturnApp />);

    await screen.findByRole("heading", {
      name: "File your own salaried return, without paying anyone.",
    });

    expect(
      screen.getByRole("heading", { name: "Your documents" }),
    ).toBeInTheDocument();
    /* The complaint this answers: the portal tells you to fetch Form 26AS and
       never says what it is. It is named twice on the panel on purpose — once
       as a document, once in a cross-check pair. */
    expect(
      screen.getAllByRole("heading", { name: /Form 26AS/ }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", { name: "How these check each other" }),
    ).toBeInTheDocument();
  });
});
