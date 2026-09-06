import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SahiReturnApp } from "../app/SahiReturnApp";
import { DEMO_USER_ID, SCREEN_KEY, SESSION_KEY } from "../app/auth";
import {
  defaultDraft,
  demoCase,
  demoDocuments,
  DRAFT_KEY,
} from "../app/case-data";

const signInAt = (screenName: "dashboard" | "journey") => {
  window.localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      userId: DEMO_USER_ID,
      kind: "pan",
      name: demoCase.taxpayer,
      signedInAt: "2026-09-06T08:00:00.000Z",
    }),
  );
  window.localStorage.setItem(SCREEN_KEY, screenName);
};

describe("the year-round Tax Inbox", () => {
  it("classifies a synthetic donation and carries the filing pack into the return", async () => {
    const user = userEvent.setup();
    signInAt("dashboard");
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "Your Tax Inbox" });
    await user.click(screen.getByRole("button", { name: "Open Tax Inbox" }));

    expect(
      screen.getByRole("heading", { name: "Keep the proof. Forget the paperwork." }),
    ).toBeInTheDocument();
    expect(screen.getByText("Supermarket receipt")).toBeInTheDocument();
    expect(
      screen.getByText("Ordinary purchases do not reduce salaried income tax"),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Add fictional donation receipt" }),
    );
    expect(
      await screen.findByText("₹11,000 found · Form 10BE is still needed"),
    ).toBeInTheDocument();
    expect(screen.getByText("Receipt read. One missing proof was found.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Prepare my return" }));
    expect(
      screen.getByRole("heading", { name: "Add your salary documents" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Demo-Form-16-AY-2026-27\.pdf/)).toBeInTheDocument();
    expect(screen.getByText(/Demo-AIS-26AS-AY-2026-27\.pdf/)).toBeInTheDocument();
  });
});

describe("the completion impact summary", () => {
  it("explains the concrete checks and corrections made during the journey", async () => {
    signInAt("journey");
    window.localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        ...defaultDraft,
        step: 7,
        reached: 7,
        documents: demoDocuments,
        salaryConfirmed: true,
        incomeAnswers: {
          "savings-sampurna": "mine",
          "fd-sampurna": "mine",
          "dividend-meghdoot": "mine",
          "fd-trilok": "not-mine",
        },
        benefitsReviewed: true,
        regime: "new",
        declaration: true,
        status: "submitted",
        reference: "DEMO-ACK-2026-4471028",
        submittedAt: "6 Sept 2026, 1:30 pm",
        submittedIso: "2026-09-06T08:00:00.000Z",
      }),
    );
    render(<SahiReturnApp />);

    const impact = await screen.findByRole("region", { name: "Your impact summary" });
    expect(within(impact).getByText("4")).toBeInTheDocument();
    expect(within(impact).getByText("₹84,489")).toBeInTheDocument();
    expect(within(impact).getByText("₹31,500")).toBeInTheDocument();
    expect(within(impact).getByText("Correct ITR selected")).toBeInTheDocument();
    expect(
      within(impact).getByText("Common filing mistakes checked before submission"),
    ).toBeInTheDocument();
  });
});
