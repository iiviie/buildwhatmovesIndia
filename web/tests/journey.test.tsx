import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { SahiReturnApp } from "../app/SahiReturnApp";
import {
  defaultDraft,
  demoDocuments,
  DRAFT_KEY,
  validateFile,
} from "../app/case-data";

describe("Sahi Return citizen journey", () => {
  beforeEach(() => {
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true,
    });
  });

  it("completes the supported synthetic correction", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);

    await user.click(
      screen.getByRole("button", { name: "Start the synthetic case" }),
    );
    expect(
      screen.getByRole("heading", {
        name: "Your return has a mismatch that needs a response.",
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Check the demo documents" }),
    );
    await user.click(screen.getByRole("button", { name: "Compare the records" }));
    expect(
      screen.getByText("Load all three demo documents before continuing."),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Load all demo documents" }),
    );
    await user.click(screen.getByRole("button", { name: "Compare the records" }));
    expect(screen.getByText("₹48,000 income is missing")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Confirm the bank record" }),
    );
    await user.click(
      screen.getByRole("radio", {
        name: "Yes, the ₹48,000 interest is hers",
      }),
    );
    await user.click(screen.getByRole("button", { name: "Review the correction" }));

    expect(screen.getByText("₹2,688")).toBeInTheDocument();
    await user.click(
      screen.getByRole("checkbox", {
        name: /I checked the synthetic source values/,
      }),
    );
    await user.click(
      screen.getByRole("button", { name: "Submit simulated response" }),
    );

    expect(
      await screen.findByRole("heading", { name: "The demo response is complete." }),
    ).toBeInTheDocument();
    expect(screen.getByText("DEMO-1399-2026-0042")).toBeInTheDocument();
    expect(
      screen.getByText(
        "No tax return, payment, e-verification, support request, or government record was created.",
      ),
    ).toBeInTheDocument();
  });

  it("stops safely when the bank entry is disputed", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        ...defaultDraft,
        step: 4,
        documents: demoDocuments,
      }),
    );
    render(<SahiReturnApp />);

    await screen.findByRole("heading", {
      name: "Does this bank-interest record belong to Ananya?",
    });
    await user.click(
      screen.getByRole("radio", { name: "No, this record is not hers" }),
    );
    expect(screen.getByText("Do not submit the correction")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Create a synthetic next-step record",
      }),
    );
    expect(
      screen.getByRole("heading", {
        name: "The correction was stopped safely.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("No response submitted")).toBeInTheDocument();
  });

  it("queues a reviewed response when the browser is offline", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        ...defaultDraft,
        step: 5,
        documents: demoDocuments,
        ownership: "yes",
        declaration: true,
      }),
    );
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: false,
    });
    render(<SahiReturnApp />);

    await screen.findByRole("heading", {
      name: "Check the exact change before the simulated response.",
    });
    await user.click(
      screen.getByRole("button", { name: "Submit simulated response" }),
    );

    expect(screen.getByText("Submission paused safely")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Retry simulated response" }),
    ).toBeInTheDocument();
  });

  it("switches the complete journey shell to Hindi", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);

    await user.click(screen.getByRole("button", { name: "हिन्दी" }));
    expect(
      screen.getByRole("heading", {
        name: "बिना अनुमान लगाए दोषपूर्ण रिटर्न का नोटिस समझें और ठीक करें।",
      }),
    ).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("hi");
  });

  it("creates a trackable synthetic support request", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);

    await user.click(screen.getAllByRole("button", { name: "Help with this step" })[0]);
    await user.click(
      screen.getByRole("button", { name: "Create a demo support request" }),
    );
    await user.selectOptions(
      screen.getByLabelText("What do you need help with?"),
      "Understanding the notice",
    );
    await user.type(
      screen.getByLabelText("Describe the problem"),
      "The notice wording is unclear to me.",
    );
    await user.click(
      screen.getByRole("button", {
        name: "Create synthetic support reference",
      }),
    );

    expect(screen.getByText("SUPPORT-DEMO-0264")).toBeInTheDocument();
    expect(
      screen.getByText(/No request was sent/),
    ).toBeInTheDocument();
  });

  it("keeps contextual help keyboard dismissible", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);

    await user.click(screen.getAllByRole("button", { name: "Help with this step" })[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("synthetic file validation", () => {
  it("rejects unsupported and oversized files", () => {
    const image = new File(["demo"], "demo.png", { type: "image/png" });
    const oversized = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "demo.pdf", {
      type: "application/pdf",
    });

    expect(validateFile(image)).toBe("type");
    expect(validateFile(oversized)).toBe("size");
  });

  it("accepts supported synthetic files", () => {
    const pdf = new File(["synthetic"], "demo.pdf", {
      type: "application/pdf",
    });
    expect(validateFile(pdf)).toBeNull();
  });
});
