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
    const review = screen.getByRole("region", { name: "Complete this donation record" });
    expect(within(review).getByText("Form 10BE from the trust")).toBeInTheDocument();
    expect(within(review).getByText("₹5,500 · 50% of the donation · old regime only")).toBeInTheDocument();

    await user.click(within(review).getByRole("button", { name: "I’ll get it later" }));
    expect(screen.queryByRole("region", { name: "Complete this donation record" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Review missing proof" }));
    const reopenedReview = screen.getByRole("region", { name: "Complete this donation record" });

    await user.click(
      within(reopenedReview).getByRole("button", { name: "Add fictional Form 10BE" }),
    );
    expect(
      await screen.findByText(/Donation verified\. Its eligible amount is now included/),
    ).toBeInTheDocument();
    expect(screen.queryByText("Needs review")).not.toBeInTheDocument();
    expect(screen.getByText(/Form 16, AIS and the verified donation deduction/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Prepare my return" }));
    expect(
      screen.getByRole("heading", { name: "Add your salary documents" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Demo-Form-16-AY-2026-27\.pdf/)).toBeInTheDocument();
    expect(screen.getByText(/Demo-AIS-26AS-AY-2026-27\.pdf/)).toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: "Yes, these match my Form 16" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
    for (let entry = 0; entry < 3; entry += 1) {
      await user.click(screen.getByRole("radio", { name: "Yes, this is right" }));
      await user.click(screen.getByRole("button", { name: "Next income" }));
    }
    await user.click(screen.getByRole("radio", { name: "I do not recognise this" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByText("Verified eligible donation")).toBeInTheDocument();
    expect(screen.getByText("From Tax Inbox · Section 80G")).toBeInTheDocument();
    expect(screen.getAllByText("₹5,500").length).toBeGreaterThan(0);
    expect(screen.getByText("Saves ₹82,773")).toBeInTheDocument();
  }, 10_000);

  it("lets a citizen explicitly exclude an incomplete donation", async () => {
    const user = userEvent.setup();
    signInAt("dashboard");
    window.localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        ...defaultDraft,
        taxInboxDonationStatus: "needs-review",
      }),
    );
    render(<SahiReturnApp />);

    await screen.findByRole("heading", { name: "Your Tax Inbox" });
    await user.click(screen.getByRole("button", { name: "Open Tax Inbox" }));
    await user.click(screen.getByRole("button", { name: "Review missing proof" }));
    const review = screen.getByRole("region", { name: "Complete this donation record" });
    await user.click(
      within(review).getByRole("button", { name: "Do not claim this donation" }),
    );

    expect(screen.getByText("You chose not to claim this donation. It will not affect the return.")).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Complete this donation record" })).not.toBeInTheDocument();
    expect(screen.getByText(/donation will stay out because you chose not to claim it/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back to dashboard" }));
    expect(screen.getByText("Donation intentionally not claimed")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open Tax Inbox" }));

    await user.click(screen.getByRole("button", { name: "Review this donation again" }));
    expect(screen.getByRole("region", { name: "Complete this donation record" })).toBeInTheDocument();
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
