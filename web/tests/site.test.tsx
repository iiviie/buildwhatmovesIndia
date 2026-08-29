import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SahiReturnApp } from "../app/SahiReturnApp";
import {
  DEMO_OTP,
  DEMO_USER_ID,
  maskUserId,
  readUserIdKind,
  SCREEN_KEY,
  SESSION_KEY,
} from "../app/auth";
import { buildContext } from "../app/assistant";
import {
  defaultDraft,
  defaultPrefs,
  demoCase,
  demoDocuments,
} from "../app/case-data";
import { copy } from "../app/content";
import { sections } from "../app/services";

const en = copy.en;

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
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("reading a user ID", () => {
  it("tells a PAN from an Aadhaar from anything else", () => {
    expect(readUserIdKind("DEMOA1234X")).toBe("pan");
    expect(readUserIdKind("demoa1234x")).toBe("pan");
    expect(readUserIdKind("9999 1234 5678")).toBe("aadhaar");
    expect(readUserIdKind("ARCA123456")).toBe("other");
    expect(readUserIdKind("DEM")).toBe("unknown");
    expect(readUserIdKind("")).toBe("unknown");
  });

  it("keeps the ends of an identifier and hides the middle", () => {
    expect(maskUserId("DEMOA1234X", "pan")).toBe("DEMXXXX34X");
    expect(maskUserId("999912345678", "aadhaar")).toBe("XXXX XXXX 5678");
  });
});

describe("the portal navigation", () => {
  it("names every section the real portal has", () => {
    render(<SahiReturnApp />);
    const nav = screen.getByRole("navigation", { name: en.navLabel });
    for (const section of sections) {
      expect(
        within(nav).getByText(en.navSections[section.id]),
      ).toBeInTheDocument();
    }
  });

  it("disables the sections this prototype does not build, and says why", () => {
    render(<SahiReturnApp />);
    const nav = screen.getByRole("navigation", { name: en.navLabel });

    for (const section of sections) {
      /* Matched by section rather than by label: "Company" is a substring of
         "Non-Company", and both are real sections. */
      const control = nav.querySelector<HTMLButtonElement>(
        `[data-section="${section.id}"]`,
      )!;
      expect(control).toBeInTheDocument();
      if (section.state === "live") {
        expect(control).toBeEnabled();
      } else {
        /* Disabled, and the reason is carried in the accessible name rather
           than in the colour of the text. */
        expect(control).toBeDisabled();
        expect(control).toHaveAccessibleName(
          new RegExp(en.navPlanned),
        );
      }
    }
  });

  it("opens the one section that has something behind it", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);

    const individual = document.querySelector<HTMLButtonElement>(
      '[data-section="individual"]',
    )!;
    expect(individual).toHaveAttribute("aria-expanded", "false");

    await user.click(individual);
    expect(individual).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getAllByText(en.serviceNames["file-return"]).length,
    ).toBeGreaterThan(0);
  });
});

describe("the home page", () => {
  it("does not show the journey's step list before the journey has begun", () => {
    render(<SahiReturnApp />);
    /* Seven locked steps and "0 of 7 done" beside work nobody has started is a
       progress bar for nothing. It belongs to the journey, not the home page. */
    expect(
      screen.queryByRole("navigation", { name: en.journeyLabel }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(en.stepsDone(0, 7))).not.toBeInTheDocument();
  });

  it("shows the whole service map, with the built one marked apart", () => {
    render(<SahiReturnApp />);

    const live = screen.getByRole("button", {
      name: new RegExp(en.serviceNames["file-return"]),
    });
    expect(within(live).getByText(en.navLive)).toBeInTheDocument();

    /* The unbuilt services are legible, present, and plainly out of service. */
    for (const id of ["e-verify", "refund-status", "link-aadhaar"] as const) {
      const name = screen.getAllByText(en.serviceNames[id])[0];
      expect(name).toBeInTheDocument();
      expect(
        within(name.closest("span")!.parentElement!).getAllByText(en.navPlanned)
          .length,
      ).toBeGreaterThan(0);
    }
  });

  it("brings the journey's step list back once the journey starts", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);

    await user.click(screen.getByRole("button", { name: "Start the return" }));
    await user.click(
      screen.getByRole("button", { name: en.loginShortcut }),
    );

    expect(
      screen.getByRole("navigation", { name: en.journeyLabel }),
    ).toBeInTheDocument();
  });
});

describe("signing in", () => {
  it("stops an anonymous visitor at the door and puts them back afterwards", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);

    await user.click(screen.getByRole("button", { name: "Start the return" }));
    expect(screen.getByRole("heading", { name: en.loginTitle })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "What applies to you" }),
    ).not.toBeInTheDocument();

    await user.type(screen.getByLabelText(en.loginIdLabel), DEMO_USER_ID);
    await user.click(screen.getByRole("button", { name: en.continue }));
    await user.type(screen.getByLabelText(en.loginOtpLabel), DEMO_OTP);
    await user.click(screen.getByRole("button", { name: en.loginVerify }));

    /* Back on the step they were heading for, not dropped at a dashboard. */
    expect(
      screen.getByRole("heading", { name: "What applies to you" }),
    ).toBeInTheDocument();
  });

  it("says what it recognised instead of leaving you to guess", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);
    await user.click(screen.getByRole("button", { name: en.signIn }));

    const field = screen.getByLabelText(en.loginIdLabel);

    await user.type(field, "DEMOA1234X");
    expect(screen.getByText(en.loginReadPan)).toBeInTheDocument();

    await user.clear(field);
    await user.type(field, "999912345678");
    expect(screen.getByText(en.loginReadAadhaar)).toBeInTheDocument();

    await user.clear(field);
    await user.type(field, "ARCA123456");
    expect(screen.getByText(en.loginReadOther)).toBeInTheDocument();

    await user.clear(field);
    await user.type(field, "DEM");
    expect(screen.getByText(en.loginReadUnknown)).toBeInTheDocument();
  });

  it("refuses an ID it has no synthetic account for", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);
    await user.click(screen.getByRole("button", { name: en.signIn }));

    await user.type(screen.getByLabelText(en.loginIdLabel), "ZZZZZ9999Z");
    await user.click(screen.getByRole("button", { name: en.continue }));

    expect(screen.getByRole("alert")).toHaveTextContent(en.loginErrorUnknown);
  });

  it("signs out to the home page and forgets the session", async () => {
    signedIn();
    window.localStorage.setItem(SCREEN_KEY, "dashboard");
    const user = userEvent.setup();
    render(<SahiReturnApp />);

    await user.click(await screen.findByRole("button", { name: en.signOut }));

    expect(screen.getByRole("button", { name: "Start the return" })).toBeInTheDocument();
    expect(window.localStorage.getItem(SESSION_KEY)).toBeNull();
  });
});

describe("registering", () => {
  it("asks what you do instead of which departmental category you are", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);
    await user.click(screen.getByRole("button", { name: en.register }));

    /* The official screen offers "Taxpayer" or "Others" and then a dropdown of
       job titles. Here the question is in the citizen's words and the official
       category is the answer, printed on every line. */
    expect(screen.getByText(en.routeNames.self)).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(en.routeNames["chartered-accountant"])),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(new RegExp(en.registerOfficialLabel)).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText(/e-return Intermediary/)).toBeInTheDocument();
  });

  it("names the right category for a journey it cannot build, and stops there", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);
    await user.click(screen.getByRole("button", { name: en.register }));

    await user.click(
      screen.getByRole("radio", {
        name: new RegExp(en.routeNames["chartered-accountant"]),
      }),
    );

    const told = screen.getByRole("status");
    expect(told).toHaveTextContent("Chartered Accountant");
    expect(told).toHaveTextContent(en.registerUnsupported);
    expect(screen.getByRole("button", { name: en.continue })).toBeDisabled();
  });

  it("creates a synthetic account and signs in with it", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);
    await user.click(screen.getByRole("button", { name: en.register }));

    await user.click(
      screen.getByRole("radio", { name: new RegExp(en.routeNames.self) }),
    );
    await user.click(screen.getByRole("button", { name: en.continue }));

    await user.type(screen.getByLabelText(en.registerPan), "ABCDE1234F");
    await user.type(screen.getByLabelText(en.registerName), "Ananya Rao");
    await user.type(screen.getByLabelText(en.registerDob), "1994-03-11");
    await user.type(screen.getByLabelText(en.registerMobile), "9876543210");
    await user.type(screen.getByLabelText(en.registerEmail), "demo@example.invalid");
    await user.click(screen.getByRole("button", { name: en.continue }));

    await user.type(screen.getByLabelText(en.loginOtpLabel), DEMO_OTP);
    await user.click(screen.getByRole("button", { name: en.continue }));

    await user.type(screen.getByLabelText(en.registerPassword), "demopass1");
    await user.click(screen.getByRole("button", { name: en.registerFinish }));

    expect(
      screen.getByRole("heading", { name: en.registerDoneTitle }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: en.registerDoneAction }));
    expect(screen.getByRole("heading", { name: en.dashPendingTitle })).toBeInTheDocument();
  });

  it("states the password rule before the field, not after a rejection", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);
    await user.click(screen.getByRole("button", { name: en.register }));

    await user.click(
      screen.getByRole("radio", { name: new RegExp(en.routeNames.self) }),
    );
    await user.click(screen.getByRole("button", { name: en.continue }));
    await user.type(screen.getByLabelText(en.registerPan), "ABCDE1234F");
    await user.type(screen.getByLabelText(en.registerName), "Ananya Rao");
    await user.type(screen.getByLabelText(en.registerDob), "1994-03-11");
    await user.type(screen.getByLabelText(en.registerMobile), "9876543210");
    await user.type(screen.getByLabelText(en.registerEmail), "demo@example.invalid");
    await user.click(screen.getByRole("button", { name: en.continue }));
    await user.type(screen.getByLabelText(en.loginOtpLabel), DEMO_OTP);
    await user.click(screen.getByRole("button", { name: en.continue }));

    const rule = screen.getByText(en.registerPasswordRules);
    const field = screen.getByLabelText(en.registerPassword);
    expect(
      rule.compareDocumentPosition(field) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});

describe("what the assistant is told", () => {
  it("says nothing about a visitor who has not signed in", () => {
    const context = buildContext({
      draft: defaultDraft,
      session: null,
      screen: "home",
      attachment: null,
    });
    expect(context).toContain("Not signed in");
    expect(context).not.toContain(demoCase.taxpayer);
  });

  it("carries the citizen's own answers, so they need not repeat them", () => {
    const context = buildContext({
      draft: {
        ...defaultDraft,
        step: 4,
        documents: demoDocuments,
        salaryConfirmed: true,
        incomeAnswers: { "fd-trilok": "not-mine" },
        regime: "new",
      },
      session: {
        userId: DEMO_USER_ID,
        kind: "pan",
        name: demoCase.taxpayer,
        signedInAt: "2026-08-28T04:00:00.000Z",
      },
      screen: "journey",
      attachment: null,
    });

    expect(context).toContain("Your tax regime");
    expect(context).toContain("Regime chosen: new");
    expect(context).toContain("marked NOT theirs");
    expect(context).toContain("Confirmed the salary figures match Form 16: yes");
  });

  it("is honest that an attached document was never read", () => {
    const context = buildContext({
      draft: defaultDraft,
      session: {
        userId: DEMO_USER_ID,
        kind: "pan",
        name: demoCase.taxpayer,
        signedInAt: "2026-08-28T04:00:00.000Z",
      },
      screen: "journey",
      attachment: "form16.pdf",
    });
    expect(context).toContain("form16.pdf");
    expect(context).toContain("was not read");
  });
});

describe("the assistant panel", () => {
  it("answers, and shows the answer under its own name", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify({ reply: "ITR-1 applies to you." }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      ),
    );

    const user = userEvent.setup();
    render(<SahiReturnApp />);

    await user.click(screen.getByRole("button", { name: en.assistantOpen }));
    await user.type(screen.getByLabelText(en.assistantPlaceholder), "Which form?");
    await user.click(screen.getByRole("button", { name: en.assistantSend }));

    expect(await screen.findByText("ITR-1 applies to you.")).toBeInTheDocument();
    expect(screen.getByText(en.assistantDisclosure)).toBeInTheDocument();
  });

  it("says the assistant is not configured rather than failing silently", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify({ error: "missing-key" }), {
          status: 503,
          headers: { "content-type": "application/json" },
        }),
      ),
    );

    const user = userEvent.setup();
    render(<SahiReturnApp />);

    await user.click(screen.getByRole("button", { name: en.assistantOpen }));
    await user.type(screen.getByLabelText(en.assistantPlaceholder), "Anything");
    await user.click(screen.getByRole("button", { name: en.assistantSend }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      en.assistantErrorKey,
    );

    /* The journey is untouched by the assistant being unavailable. */
    await user.click(screen.getByRole("button", { name: en.assistantClose }));
    expect(
      screen.getByRole("button", { name: "Start the return" }),
    ).toBeInTheDocument();
  });

  it("offers a step check only inside the journey", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);

    await user.click(screen.getByRole("button", { name: en.assistantOpen }));
    expect(
      screen.queryByRole("button", { name: en.assistantCheckStep }),
    ).not.toBeInTheDocument();
  });
});

describe("the appearance a reader gets before choosing one", () => {
  it("opens on paper", () => {
    expect(defaultPrefs.theme).toBe("paper");
  });

  /* The theme is applied by an inline script before first paint, which means
     the default is written down twice — once in the script and once in the
     prefs. They have to agree, or a reader who has chosen nothing sees one
     theme flash into another. */
  it("agrees with the script that runs before first paint", async () => {
    const { readFile } = await import("node:fs/promises");
    const layout = await readFile(
      new URL("./app/layout.tsx", `file://${process.cwd()}/`),
      "utf8",
    );
    expect(layout).toContain(`p.theme||"${defaultPrefs.theme}"`);
  });
});
