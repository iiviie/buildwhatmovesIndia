import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { SahiReturnApp } from "../app/SahiReturnApp";
import {
  defaultDraft,
  demoCase,
  demoDocuments,
  DRAFT_KEY,
  incomeEntries,
  validateFile,
} from "../app/case-data";
import { DEMO_USER_ID, SCREEN_KEY, SESSION_KEY } from "../app/auth";
import { journeyCopy } from "../app/content";

/* The demo's own story: the first three entries are Ananya's, and the Trilok
   Bank line is a PAN mix-up that must stay out of the return. */
const demoAnswers = {
  "savings-sampurna": "mine",
  "fd-sampurna": "mine",
  "dividend-meghdoot": "mine",
  "fd-trilok": "not-mine",
} as const;

/* Filing is behind the sign-in wall, exactly as it is on the real portal, so a
   test that parks itself mid-journey has to arrive already signed in. */
const signedIn = () => {
  window.localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      userId: DEMO_USER_ID,
      kind: "pan",
      name: demoCase.taxpayer,
      signedInAt: "2026-08-28T04:00:00.000Z",
    }),
  );
  window.localStorage.setItem(SCREEN_KEY, "journey");
};

/* A draft parked at a given step, so a test can exercise one screen without
   replaying the whole journey. */
const draftAt = (step: number, extra: Record<string, unknown> = {}) =>
  JSON.stringify({
    ...defaultDraft,
    step,
    documents: demoDocuments,
    salaryConfirmed: true,
    incomeAnswers: demoAnswers,
    regime: "new",
    ...extra,
  });

describe("Sahi Return salaried filing journey", () => {
  beforeEach(() => {
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true,
    });
  });

  it("files the demo return from start to acknowledgement", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);

    await user.click(screen.getByRole("button", { name: "Start the return" }));

    /* The portal will not start a return for a stranger, and neither does this.
       Signing in resumes the step the citizen was actually heading for. */
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Sign in as the demo taxpayer" }),
    );

    expect(
      screen.getByRole("heading", { name: "What applies to you" }),
    ).toBeInTheDocument();
    /* The form is decided for the citizen rather than asked of them. */
    expect(screen.getAllByText(/ITR-1 \(Sahaj\)/).length).toBeGreaterThan(0);

    await user.click(
      screen.getByRole("button", { name: "This applies to me, continue" }),
    );

    /* Step 2 will not advance until the documents are loaded. */
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(
      screen.getByText("load both documents before continuing."),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Load the demo document" }),
    );
    expect(screen.getByText("₹13,20,000")).toBeInTheDocument();

    /* And not until the citizen confirms the figures match Form 16. */
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(
      screen.getByText("Confirm the figures match your Form 16 before continuing."),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("checkbox", {
        name: "These figures match my Form 16",
      }),
    );
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(
      screen.getByRole("heading", { name: "Your other income" }),
    ).toBeInTheDocument();
    expect(screen.getByText("0 of 4 entries answered")).toBeInTheDocument();

    /* Every prefilled entry has to be answered before the return can proceed. */
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(
      screen.getByText("Answer every entry before continuing."),
    ).toBeInTheDocument();

    const mine = screen.getAllByRole("radio", { name: journeyCopy.en.income.mine });
    const notMine = screen.getAllByRole("radio", {
      name: "No, I do not recognise this",
    });
    expect(mine).toHaveLength(4);

    await user.click(mine[0]);
    await user.click(mine[1]);
    await user.click(mine[2]);
    await user.click(notMine[3]);
    expect(screen.getByText("4 of 4 entries answered")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Continue" }));

    /* Both regimes are computed from the citizen's own figures. */
    expect(
      screen.getByRole("heading", { name: "Your tax regime" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("The new regime costs you less"),
    ).toBeInTheDocument();
    expect(screen.getByText("₹84,489")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByText("Choose a regime before continuing.")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "File under the new regime" }),
    );
    await user.click(screen.getByRole("button", { name: "Continue" }));

    /* The prevention engine runs the section 139(9) rules before filing. */
    expect(
      screen.getByRole("heading", { name: "Before you file" }),
    ).toBeInTheDocument();
    expect(screen.getByText("4 of 4 checks passed")).toBeInTheDocument();
    expect(
      screen.getByText("Nothing is blocking your return"),
    ).toBeInTheDocument();
    /* The credit on the disputed entry is given up on purpose. */
    expect(screen.getByText("Credit deliberately not claimed")).toBeInTheDocument();
    expect(screen.getByText("₹3,150")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Continue to review" }));

    expect(
      screen.getByRole("heading", { name: "Review and file" }),
    ).toBeInTheDocument();
    expect(screen.getByText("You are owed a refund")).toBeInTheDocument();
    /* The refund shows in the review body and again in the margin summary. */
    expect(screen.getAllByText("₹10,610").length).toBeGreaterThan(0);

    await user.click(
      screen.getByRole("button", { name: "File this demo return" }),
    );
    expect(screen.getByText("Tick the declaration before filing.")).toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: /I confirm the demo figures/ }));
    await user.click(
      screen.getByRole("button", { name: "File this demo return" }),
    );

    expect(
      await screen.findByRole("heading", {
        name: "Your demo return has been filed.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("DEMO-ACK-2026-4471028")).toBeInTheDocument();
    /* The calculation version is on the receipt and in the footer. */
    expect(screen.getAllByText("DEMO-AY26-27-v2").length).toBeGreaterThan(0);
    expect(
      screen.getByText(/No government record exists/),
    ).toBeInTheDocument();
  });

  it("drops the tax credit on an entry the citizen does not recognise", async () => {
    const user = userEvent.setup();
    signedIn();
    window.localStorage.setItem(
      DRAFT_KEY,
      draftAt(3, { incomeAnswers: {}, regime: null }),
    );
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "Your other income" });

    const mine = screen.getAllByRole("radio", { name: journeyCopy.en.income.mine });
    const notMine = screen.getAllByRole("radio", {
      name: "No, I do not recognise this",
    });

    /* The first three entries are the taxpayer's; the Trilok Bank line is not. */
    await user.click(mine[0]);
    await user.click(mine[1]);
    await user.click(mine[2]);
    await user.click(notMine[3]);

    expect(
      screen.getByText(/What happens to an entry you do not recognise/),
    ).toBeInTheDocument();

    /* ₹31,500 of income and its ₹3,150 credit are both excluded, so the
       claimable credit stays at salary TDS plus the two confirmed lines. */
    expect(screen.getByText("₹66,600")).toBeInTheDocument();
    expect(screen.getByText("₹90,420")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(
      screen.getByRole("button", { name: "File under the new regime" }),
    );
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByText("4 of 4 checks passed")).toBeInTheDocument();
    expect(screen.getByText("Credit deliberately not claimed")).toBeInTheDocument();
    expect(screen.getByText("₹3,150")).toBeInTheDocument();
  });

  it("flags an unanswered entry as blocking before filing", async () => {
    signedIn();
    window.localStorage.setItem(
      DRAFT_KEY,
      draftAt(5, {
        incomeAnswers: { [incomeEntries[0].id]: "mine" },
      }),
    );
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "Before you file" });
    expect(screen.getByText("2 of 4 checks passed")).toBeInTheDocument();
    expect(screen.getByText("Needs your attention")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fix this" })).toBeInTheDocument();
    /* A failing check says what to do; a passing one does not. */
    expect(
      screen.getByText("Go back to step 3 and answer the entries still left."),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Go back to step 4 and choose a regime."),
    ).not.toBeInTheDocument();
  });

  it("queues the filing when the browser is offline", async () => {
    const user = userEvent.setup();
    signedIn();
    window.localStorage.setItem(DRAFT_KEY, draftAt(6, { declaration: true }));
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: false,
    });
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "Review and file" });
    await user.click(
      screen.getByRole("button", { name: "File this demo return" }),
    );

    expect(screen.getByText("You are offline")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Try filing again" }),
    ).toBeInTheDocument();
  });

  it("switches the complete journey shell to Hindi", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);

    await user.click(screen.getByRole("button", { name: "Settings" }));
    await user.click(screen.getByRole("button", { name: "हिन्दी" }));

    expect(
      screen.getByRole("heading", {
        name: "अपना वेतन रिटर्न खुद भरें, किसी को पैसे दिए बिना।",
      }),
    ).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("hi");
    expect(
      screen.getByRole("button", { name: "रिटर्न शुरू करें" }),
    ).toBeInTheDocument();
  });

  it("keeps the regime comparison correct in Hindi", async () => {
    const user = userEvent.setup();
    signedIn();
    window.localStorage.setItem(DRAFT_KEY, draftAt(4, { language: "hi" }));
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "आपकी कर व्यवस्था" });
    expect(screen.getByText("नई व्यवस्था में कम कर लगता है")).toBeInTheDocument();
    /* The Hindi locale renders the same amount in the Indian numbering system. */
    expect(screen.getAllByText(/84,489/).length).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: "पीछे" }));
    expect(
      screen.getByRole("heading", { name: "आपकी अन्य आय" }),
    ).toBeInTheDocument();
  });

  it("creates a trackable synthetic support request", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);

    await user.click(
      screen.getAllByRole("button", { name: /Help with this step/ })[0],
    );
    const help = screen.getByRole("dialog");
    await user.click(
      within(help).getByRole("button", { name: "Create a demo support request" }),
    );
    await user.selectOptions(
      screen.getByLabelText("What do you need help with?"),
      "An entry I do not recognise",
    );
    await user.type(
      screen.getByLabelText("Describe the problem"),
      "I do not recognise the Trilok Bank entry.",
    );
    await user.click(
      screen.getByRole("button", { name: "Create synthetic support reference" }),
    );

    expect(screen.getByText("SUPPORT-DEMO-0264")).toBeInTheDocument();
    expect(screen.getByText(/No request was sent/)).toBeInTheDocument();
  });

  it("creates a synthetic AIS feedback reference for a disputed entry", async () => {
    const user = userEvent.setup();
    signedIn();
    window.localStorage.setItem(
      DRAFT_KEY,
      draftAt(3, { incomeAnswers: demoAnswers }),
    );
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "Your other income" });
    await user.click(
      screen.getByRole("button", { name: "Report this entry as not mine" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Create synthetic feedback reference" }),
    );

    expect(screen.getByText("DEMO-AIS-FB-2026-0019")).toBeInTheDocument();
  });

  it("opens the command panel with the keyboard and runs a scoped command", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);

    await user.keyboard("{Control>}k{/Control}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const search = screen.getByRole("combobox");
    await user.type(search, "Start the return");
    await user.keyboard("{Enter}");

    await user.click(
      await screen.findByRole("button", { name: "Sign in as the demo taxpayer" }),
    );

    expect(
      await screen.findByRole("heading", { name: "What applies to you" }),
    ).toBeInTheDocument();
  });

  it("closes the command panel without changing the journey", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);

    await user.keyboard("{Control>}k{/Control}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Start the return" }),
    ).toBeInTheDocument();
  });

  it("keeps appearance and text size on the document element", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);

    await user.click(screen.getByRole("button", { name: "Settings" }));
    await user.click(screen.getByRole("button", { name: "Dark" }));
    expect(document.documentElement.dataset.theme).toBe("dark");

    await user.click(screen.getByRole("button", { name: "Large text size" }));
    expect(document.documentElement.dataset.text).toBe("large");
  });

  it("explains how to tell this prototype from the real service", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);

    const toggle = screen.getByRole("button", {
      name: /How to check you are on the real one/,
    });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByText("This is not a government service"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("What the department never asks for"),
    ).toBeInTheDocument();
  });

  it("marks finished steps done, the current step, and the rest as locked", async () => {
    signedIn();
    window.localStorage.setItem(DRAFT_KEY, draftAt(4));
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "Your tax regime" });

    /* Status is a word, not just a colour, so it is assertable and readable. */
    expect(screen.getByText("3 of 7 steps done")).toBeInTheDocument();
    expect(screen.getAllByText("Done")).toHaveLength(3);
    expect(screen.getAllByText("You are here")).toHaveLength(1);
    expect(screen.getAllByText("Not yet")).toHaveLength(3);

    /* A step not yet reached cannot be jumped to. It is marked aria-disabled
       rather than disabled, because a disabled button takes neither hover nor
       focus and a locked step is exactly the one whose preview is worth
       reading. What matters is that clicking it does not move you. */
    const locked = screen.getByRole("button", { name: /Acknowledgement/ });
    expect(locked).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(locked);
    expect(
      screen.getByRole("heading", { name: "Your tax regime" }),
    ).toBeInTheDocument();

    const reached = screen.getByRole("button", { name: /Your salary/ });
    expect(reached).not.toHaveAttribute("aria-disabled");
    await userEvent.click(reached);
    expect(
      await screen.findByRole("heading", { name: "Your salary" }),
    ).toBeInTheDocument();
  });

  it("leaves a step you have already opened open when you step back from it", async () => {
    signedIn();
    window.localStorage.setItem(DRAFT_KEY, draftAt(5));
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "Before you file" });

    /* Back one, to check a figure against the step that produced it. */
    await userEvent.click(screen.getByRole("button", { name: /Your tax regime/ }));
    await screen.findByRole("heading", { name: "Your tax regime" });

    /* The step just left is not locked again. Locking it would mean a citizen
       who went back to look at something had to redo their way forward. */
    const stepBack = screen.getByRole("button", { name: /Before you file/ });
    expect(stepBack).not.toHaveAttribute("aria-disabled");
    expect(stepBack).toHaveTextContent("You have been here");

    /* Nor is the progress count wound back to where they are standing. */
    expect(screen.getByText("4 of 7 steps done")).toBeInTheDocument();

    await userEvent.click(stepBack);
    expect(
      await screen.findByRole("heading", { name: "Before you file" }),
    ).toBeInTheDocument();

    /* What was never opened is still shut. */
    expect(
      screen.getByRole("button", { name: /Acknowledgement/ }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("states the accepted formats and size limit before the file control", async () => {
    signedIn();
    window.localStorage.setItem(DRAFT_KEY, draftAt(2));
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "Your salary" });
    expect(
      screen.getByText("PDF, JPG or PNG. Nothing else is accepted."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Up to 5 MB for each document."),
    ).toBeInTheDocument();
    expect(screen.getByText(/A photo is fine/)).toBeInTheDocument();
  });

  it("names the official portal field beside our plain-language one", async () => {
    signedIn();
    window.localStorage.setItem(DRAFT_KEY, draftAt(2));
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "Your salary" });
    expect(screen.getByText("B1 i. Gross Salary (a + b + c)")).toBeInTheDocument();
    expect(
      screen.getByText("B1 iii a. Standard Deduction u/s 16(ia)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Schedule TDS1 — Details of Tax Deducted at Source from Salary",
      ),
    ).toBeInTheDocument();
  });

  it("says up front that nothing will be charged and when the amount appears", () => {
    render(<SahiReturnApp />);

    expect(
      screen.getByText(
        "This service is free, and it will never ask you to pay anything.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/whether you are owed a refund/)).toBeInTheDocument();
  });

  it("keeps contextual help keyboard dismissible", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);

    await user.click(
      screen.getAllByRole("button", { name: /Help with this step/ })[0],
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("synthetic file validation", () => {
  it("rejects unsupported and oversized files", () => {
    const wrongType = new File(["x"], "photo.png", { type: "image/png" });
    expect(validateFile(wrongType)).toBe("type");

    const tooBig = new File(["x"], "big.pdf", { type: "application/pdf" });
    Object.defineProperty(tooBig, "size", { value: 6 * 1024 * 1024 });
    expect(validateFile(tooBig)).toBe("size");
  });

  it("accepts supported synthetic files", () => {
    const pdf = new File(["x"], "form16.pdf", { type: "application/pdf" });
    Object.defineProperty(pdf, "size", { value: 1024 });
    expect(validateFile(pdf)).toBeNull();
  });

});

/* The portal's Personal Information section, which this prototype puts on the
   first step of the journey rather than on a page of its own. */
describe("the prefilled profile and contact details", () => {
/* ---------------------------------------- prefilled personal details */

it("shows the profile and contact the department already holds", async () => {
  signedIn();
  window.localStorage.setItem(DRAFT_KEY, draftAt(1));
  render(<SahiReturnApp />);

  await screen.findByRole("heading", { name: "What applies to you" });

  expect(
    screen.getByRole("heading", { name: "Who the department thinks you are" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Where the department would write to you" }),
  ).toBeInTheDocument();

  /* Nothing here was typed by the citizen, so all of it has to be on the
     screen before they touch anything. */
  expect(screen.getByText("Ananya")).toBeInTheDocument();
  expect(screen.getByText("Rao")).toBeInTheDocument();
  expect(screen.getByText("12/03/1994")).toBeInTheDocument();
  expect(screen.getByText("ananya.rao@demo.invalid")).toBeInTheDocument();
  /* The address is read back as one line, the way the portal prints it. */
  expect(
    screen.getByText(
      "Flat 4B, Ashoka Residency, Nehru Marg, Vidyadhar Nagar, Jaipur, Rajasthan, India, 302039",
    ),
  ).toBeInTheDocument();
});

it("takes a correction to a prefilled field and marks it as the citizen's", async () => {
  const user = userEvent.setup();
  signedIn();
  window.localStorage.setItem(DRAFT_KEY, draftAt(1));
  render(<SahiReturnApp />);

  await screen.findByRole("heading", { name: "What applies to you" });

  const contact = screen
    .getByRole("heading", { name: "Where the department would write to you" })
    .closest("section") as HTMLElement;

  await user.click(
    within(contact).getByRole("button", { name: "Change these details" }),
  );

  const email = within(contact).getByLabelText(
    /Primary Email ID of the taxpayer/,
  );
  await user.clear(email);
  await user.type(email, "ananya.new@demo.invalid");
  await user.click(
    within(contact).getByRole("button", { name: "Save these details" }),
  );

  expect(
    within(contact).getByText("ananya.new@demo.invalid"),
  ).toBeInTheDocument();
  /* A changed field is marked as changed, and the reason it matters is said
     once rather than on every row. */
  expect(within(contact).getAllByText("Changed by you").length).toBe(1);
  expect(
    within(contact).getByText(/Nothing was sent to the Income Tax Department/),
  ).toBeInTheDocument();

  /* And it survives the reload, like every other answer in the draft. */
  const saved = JSON.parse(
    window.localStorage.getItem(DRAFT_KEY) as string,
  ) as { personalDetails: Record<string, string> };
  expect(saved.personalDetails.email).toBe("ananya.new@demo.invalid");
});

it("cancels an edit without touching the draft", async () => {
  const user = userEvent.setup();
  signedIn();
  window.localStorage.setItem(DRAFT_KEY, draftAt(1));
  render(<SahiReturnApp />);

  await screen.findByRole("heading", { name: "What applies to you" });
  const profile = screen
    .getByRole("heading", { name: "Who the department thinks you are" })
    .closest("section") as HTMLElement;

  await user.click(
    within(profile).getByRole("button", { name: "Change these details" }),
  );
  const first = within(profile).getByLabelText(/First Name/);
  await user.clear(first);
  await user.type(first, "Someone Else");
  await user.click(within(profile).getByRole("button", { name: "Cancel" }));

  expect(within(profile).getByText("Ananya")).toBeInTheDocument();
  expect(within(profile).queryByText("Someone Else")).not.toBeInTheDocument();
});

/* PAN and Aadhaar are the record everything else was filled from, and this
   prototype will not put a box under either of them. */
it("shows PAN and Aadhaar without offering a box to retype them into", async () => {
  const user = userEvent.setup();
  signedIn();
  window.localStorage.setItem(DRAFT_KEY, draftAt(1));
  render(<SahiReturnApp />);

  await screen.findByRole("heading", { name: "What applies to you" });
  const profile = screen
    .getByRole("heading", { name: "Who the department thinks you are" })
    .closest("section") as HTMLElement;

  expect(within(profile).getAllByText("Cannot be changed here")).toHaveLength(2);

  await user.click(
    within(profile).getByRole("button", { name: "Change these details" }),
  );
  expect(within(profile).queryByLabelText(/^PAN/)).not.toBeInTheDocument();
  expect(
    within(profile).queryByLabelText(/Aadhaar Number/),
  ).not.toBeInTheDocument();
  expect(within(profile).getByLabelText(/First Name/)).toBeInTheDocument();
});

it("asks for a secondary address only once the two differ", async () => {
  const user = userEvent.setup();
  signedIn();
  window.localStorage.setItem(DRAFT_KEY, draftAt(1));
  render(<SahiReturnApp />);

  await screen.findByRole("heading", { name: "What applies to you" });
  const contact = screen
    .getByRole("heading", { name: "Where the department would write to you" })
    .closest("section") as HTMLElement;

  await user.click(
    within(contact).getByRole("button", { name: "Change these details" }),
  );
  expect(
    within(contact).queryByLabelText(/^Secondary Address/),
  ).not.toBeInTheDocument();

  const same = within(contact).getByRole("group", {
    name: /Is the secondary address same as primary address/,
  });
  await user.click(within(same).getByRole("radio", { name: "No" }));

  expect(
    within(contact).getByRole("group", { name: "Secondary Address" }),
  ).toBeInTheDocument();
});
});

describe("where the refund actually goes", () => {

it("names the account the refund would be paid into, beside the figure", async () => {
  signedIn();
  window.localStorage.setItem(DRAFT_KEY, draftAt(6));
  render(<SahiReturnApp />);

  await screen.findByRole("heading", { name: "Review and file" });

  expect(screen.getByText("You are owed a refund")).toBeInTheDocument();
  expect(screen.getByText("It would be paid into")).toBeInTheDocument();
  expect(
    screen.getByText("Sampurna Bank · DEMOXXXXXXXX4021 · Savings"),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Change the account" }),
  ).toBeInTheDocument();
});

it("says so plainly when no account can receive the refund", async () => {
  signedIn();
  window.localStorage.setItem(
    DRAFT_KEY,
    /* The unvalidated account, which the department cannot pay into. */
    draftAt(6, { nominatedAccount: "vasudha-current" }),
  );
  render(<SahiReturnApp />);

  await screen.findByRole("heading", { name: "Review and file" });
  expect(
    screen.getByText(/No validated account is nominated for the refund/),
  ).toBeInTheDocument();
});
});

describe("verification, the step after filing", () => {

it("does not let the acknowledgement claim the return is finished", async () => {
  const user = userEvent.setup();
  signedIn();
  window.localStorage.setItem(DRAFT_KEY, draftAt(6, { declaration: true }));
  render(<SahiReturnApp />);

  await screen.findByRole("heading", { name: "Review and file" });
  await user.click(
    screen.getByRole("button", { name: "File this demo return" }),
  );

  const heading = await screen.findByRole("heading", {
    name: "This return is not verified yet",
  });
  const verify = heading.closest("section") as HTMLElement;

  expect(within(verify).getByText("Filed, awaiting verification")).toBeInTheDocument();
  expect(within(verify).getByText("Verify on or before")).toBeInTheDocument();
  expect(within(verify).getByText("30 days left")).toBeInTheDocument();
  /* The status row in the receipt above must not disagree with it. */
  expect(
    screen.getByText("Simulated filing complete, not verified"),
  ).toBeInTheDocument();
});

it("verifies the demo return without pretending to send an OTP", async () => {
  const user = userEvent.setup();
  signedIn();
  window.localStorage.setItem(DRAFT_KEY, draftAt(6, { declaration: true }));
  render(<SahiReturnApp />);

  await screen.findByRole("heading", { name: "Review and file" });
  await user.click(
    screen.getByRole("button", { name: "File this demo return" }),
  );
  await screen.findByRole("heading", {
    name: "This return is not verified yet",
  });

  expect(screen.getByText(/No OTP is sent/)).toBeInTheDocument();
  await user.click(
    screen.getByRole("button", { name: "e-Verify this demo return" }),
  );

  const done = await screen.findByRole("heading", {
    name: "Filed and verified",
  });
  const verify = done.closest("section") as HTMLElement;
  expect(within(verify).getByText("DEMO-EVC-2026-5510834")).toBeInTheDocument();
  expect(
    screen.getByText("Simulated filing complete, verified"),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "e-Verify this demo return" }),
  ).not.toBeInTheDocument();
});

it("keeps the other six routes readable rather than hidden", async () => {
  signedIn();
  window.localStorage.setItem(
    DRAFT_KEY,
    draftAt(7, {
      status: "submitted",
      declaration: true,
      reference: "DEMO-ACK-2026-4471028",
      submittedAt: "29 Aug 2026, 10:00",
      submittedIso: "2026-08-29T04:30:00.000Z",
    }),
  );
  render(<SahiReturnApp />);

  await screen.findByRole("heading", {
    name: "This return is not verified yet",
  });
  expect(
    screen.getByText("The other 6 routes the portal offers"),
  ).toBeInTheDocument();
  expect(screen.getByText("Through Net Banking")).toBeInTheDocument();
  expect(
    screen.getByText("Send signed ITR-V to CPC, Bengaluru"),
  ).toBeInTheDocument();
});
});

/* Being told what is missing, and being taken to it, are two different things.
   The interface now does both, so both are tested. */
describe("stopping the reader at the field that is wrong", () => {
  it("puts focus on the Form 16 tick box instead of only naming it", async () => {
    const user = userEvent.setup();
    signedIn();
    window.localStorage.setItem(
      DRAFT_KEY,
      draftAt(2, { salaryConfirmed: false }),
    );
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "Your salary" });
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(
      screen.getByText("Confirm the figures match your Form 16 before continuing."),
    ).toBeInTheDocument();

    const box = screen
      .getByText("These figures match my Form 16")
      .closest("label")
      ?.querySelector("input") as HTMLInputElement;
    expect(box).toHaveFocus();
    expect(document.getElementById("salary-confirm")).toHaveClass("is-spotlit");
  });

  it("takes the reader to the regime cards when neither is chosen", async () => {
    const user = userEvent.setup();
    signedIn();
    window.localStorage.setItem(DRAFT_KEY, draftAt(4, { regime: null }));
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "Your tax regime" });
    await user.click(screen.getByRole("button", { name: "Continue" }));

    const cards = document.getElementById("regime-choice") as HTMLElement;
    expect(cards).toHaveClass("is-spotlit");
    /* Focus lands on the first thing in the block that can take it, which is
       the control that answers the question. */
    expect(
      within(cards).getByRole("button", { name: "File under the new regime" }),
    ).toHaveFocus();
  });

  it("points at the one entry left unanswered, not at the list", async () => {
    const user = userEvent.setup();
    signedIn();
    window.localStorage.setItem(
      DRAFT_KEY,
      draftAt(3, {
        incomeAnswers: { "savings-sampurna": "mine", "fd-sampurna": "mine" },
      }),
    );
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "Your other income" });
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(
      document.getElementById("entry-dividend-meghdoot"),
    ).toHaveClass("is-spotlit");
    expect(document.getElementById("entry-fd-sampurna")).not.toHaveClass(
      "is-spotlit",
    );
  });

  /* The ring for a refusal and the ring for a hand-off must not look alike. */
  it("marks a refusal differently from a hand-off", async () => {
    const user = userEvent.setup();
    signedIn();
    window.localStorage.setItem(DRAFT_KEY, draftAt(4, { regime: null }));
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "Your tax regime" });
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(document.getElementById("regime-choice")).toHaveClass(
      "is-spotlit-error",
    );
  });

  it("clears the mark as soon as the reader answers", async () => {
    const user = userEvent.setup();
    signedIn();
    window.localStorage.setItem(
      DRAFT_KEY,
      draftAt(2, { salaryConfirmed: false }),
    );
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "Your salary" });
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(document.getElementById("salary-confirm")).toHaveClass("is-spotlit");

    await user.click(screen.getByText("These figures match my Form 16"));
    expect(document.getElementById("salary-confirm")).not.toHaveClass(
      "is-spotlit",
    );
  });
});

describe("correcting a figure the statement got wrong", () => {
  it("puts the caret in the box the choice just opened", async () => {
    const user = userEvent.setup();
    signedIn();
    window.localStorage.setItem(DRAFT_KEY, draftAt(3, { incomeAnswers: {} }));
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "Your other income" });

    const entry = document.getElementById("entry-savings-sampurna") as HTMLElement;
    await user.click(
      within(entry).getByRole("radio", { name: /Yes, but the figure is wrong/ }),
    );

    /* The box appears several lines above the radio that opened it, so nothing
       about the click says where to type unless focus goes there. */
    const box = document.getElementById(
      "savings-sampurna-amount",
    ) as HTMLInputElement;
    expect(box).toHaveFocus();
    expect(box).toHaveClass("is-spotlit");
    expect(box).not.toHaveClass("is-spotlit-error");
  });
});

describe("the review step once the return is already filed", () => {
  /* The button used to sit there doing nothing, which reads as a broken page. */
  it("goes to the acknowledgement instead of refusing silently", async () => {
    const user = userEvent.setup();
    signedIn();
    window.localStorage.setItem(
      DRAFT_KEY,
      draftAt(6, {
        declaration: true,
        status: "submitted",
        reference: "DEMO-ACK-2026-4471028",
        submittedAt: "27 Aug 2026, 11:59 pm",
        submittedIso: "2026-08-27T18:29:00.000Z",
      }),
    );
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "Review and file" });
    await user.click(
      screen.getByRole("button", { name: "File this demo return" }),
    );

    expect(
      await screen.findByRole("heading", {
        name: "Your demo return has been filed.",
      }),
    ).toBeInTheDocument();
  });
});

describe("the journey progress", () => {
  /* Reaching the last step and finishing it are different things, and the one
     screen where nothing is left to do used to say six of seven. */
  it("counts every step once the return is filed", async () => {
    signedIn();
    window.localStorage.setItem(
      DRAFT_KEY,
      draftAt(7, {
        declaration: true,
        status: "submitted",
        reference: "DEMO-ACK-2026-4471028",
        submittedAt: "27 Aug 2026, 11:59 pm",
        submittedIso: "2026-08-27T18:29:00.000Z",
      }),
    );
    render(<SahiReturnApp />);

    await screen.findByRole("heading", {
      name: "Your demo return has been filed.",
    });
    expect(screen.getByText("7 of 7 steps done")).toBeInTheDocument();
  });

  it("counts how far the return has got, not where the reader stands", async () => {
    signedIn();
    window.localStorage.setItem(DRAFT_KEY, draftAt(3, { reached: 5 }));
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "Your other income" });
    /* Stepping back to check a figure does not undo the steps behind it. */
    expect(screen.getByText("4 of 7 steps done")).toBeInTheDocument();
  });
});

describe("the regime cards", () => {
  it("repeats the figures where the choice is actually made", async () => {
    signedIn();
    window.localStorage.setItem(DRAFT_KEY, draftAt(4, { regime: null }));
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "Your tax regime" });

    const recaps = document.querySelectorAll(".regime-recap");
    expect(recaps).toHaveLength(2);
    /* One per card, each sitting directly above its own choose button. */
    for (const recap of recaps) {
      expect(
        within(recap as HTMLElement).getByText("What you would pay under it"),
      ).toBeInTheDocument();
    }
  });
});
