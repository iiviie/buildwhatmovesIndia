import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SahiReturnApp } from "../app/SahiReturnApp";
import { helplines, isHelplineOpen, quickLinks } from "../app/case-data";
import { copy } from "../app/content";

const at = (iso: string) => new Date(`${iso}+05:30`);

describe("helpline opening hours", () => {
  const efiling = helplines.find((line) => line.id === "efiling")!;
  const ais = helplines.find((line) => line.id === "ais")!;

  it("reads the clock in India, not on the rendering machine", () => {
    /* 03:00 UTC is 08:30 in India, inside the e-Filing line's hours. */
    expect(isHelplineOpen(efiling, new Date("2026-08-28T03:00:00Z"))).toBe(true);
    /* 20:00 UTC is 01:30 the next day in India, outside them. */
    expect(isHelplineOpen(efiling, new Date("2026-08-28T20:00:00Z"))).toBe(false);
  });

  it("closes the line before it opens and after it shuts", () => {
    expect(isHelplineOpen(efiling, at("2026-08-28T07:59:00"))).toBe(false);
    expect(isHelplineOpen(efiling, at("2026-08-28T08:01:00"))).toBe(true);
    expect(isHelplineOpen(efiling, at("2026-08-28T19:59:00"))).toBe(true);
    expect(isHelplineOpen(efiling, at("2026-08-28T20:01:00"))).toBe(false);
  });

  it("honours a weekday-only line at the weekend", () => {
    /* 2026-08-28 is a Friday, 2026-08-29 a Saturday. */
    expect(isHelplineOpen(ais, at("2026-08-28T11:00:00"))).toBe(true);
    expect(isHelplineOpen(ais, at("2026-08-29T11:00:00"))).toBe(false);
  });

  it("honours a half-hour opening time", () => {
    expect(isHelplineOpen(ais, at("2026-08-28T09:29:00"))).toBe(false);
    expect(isHelplineOpen(ais, at("2026-08-28T09:31:00"))).toBe(true);
  });
});

describe("the homepage", () => {
  it("leads with the action, not with the announcements", () => {
    render(<SahiReturnApp />);

    const start = screen.getByRole("button", { name: "Start the guided demo" });
    const notices = screen.getByRole("heading", { name: "Notices" });

    /* The primary action appears before the notices in document order, which
       is also the reading and tab order. */
    expect(
      start.compareDocumentPosition(notices) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("says what you need before you commit to starting", () => {
    render(<SahiReturnApp />);
    expect(screen.getByText("Try a fictional salaried return")).toBeInTheDocument();
    expect(
      screen.getByText("No real data"),
    ).toBeInTheDocument();
  });

  it("puts the notices that change what you do first", () => {
    render(<SahiReturnApp />);
    const affects = screen.getAllByText("Affects you");
    const general = screen.getAllByText("For information");
    expect(affects).toHaveLength(3);
    expect(general).toHaveLength(1);
    expect(
      affects[0].compareDocumentPosition(general[0]) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("groups the tasks the portal lists flat, with no group over five", () => {
    render(<SahiReturnApp />);
    for (const group of [
      "Getting ready",
      "After you have filed",
      "If something looks wrong",
      "Paying tax",
    ]) {
      expect(screen.getByText(group)).toBeInTheDocument();
    }

    const counts = new Map<string, number>();
    for (const link of quickLinks) {
      counts.set(link.group, (counts.get(link.group) ?? 0) + 1);
    }
    for (const count of counts.values()) expect(count).toBeLessThanOrEqual(5);
  });

  it("marks every tile as working here or leaving for the official portal", () => {
    render(<SahiReturnApp />);
    const names = copy.en.homeLinkNames;

    for (const link of quickLinks) {
      const label = names[link.id];
      if (link.kind === "in-demo") {
        const tile = screen.getByRole("button", { name: new RegExp(label) });
        expect(within(tile).getByText("Works in this demo")).toBeInTheDocument();
      } else {
        const tile = screen.getByRole("link", { name: new RegExp(label) });
        expect(tile).toHaveAttribute("href", link.href);
        expect(tile).toHaveAttribute("target", "_blank");
        expect(tile).toHaveAttribute("rel", expect.stringContaining("noopener"));
        expect(
          within(tile).getByText("Opens the official portal"),
        ).toBeInTheDocument();
      }
    }
  });

  it("actually navigates when an in-demo tile is used", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);

    await user.click(
      screen.getByRole("button", {
        name: /Compare the two tax regimes/,
      }),
    );

    /* A tile that leads into the return goes through the sign-in wall, and the
       tile's own destination survives the detour. */
    await user.click(
      screen.getByRole("button", { name: "Sign in as the demo taxpayer" }),
    );
    expect(
      screen.getByRole("heading", { name: "Which option leaves you with less tax?" }),
    ).toBeInTheDocument();
  });

  it("keeps the late-deadline cost behind a disclosure rather than a wall", () => {
    render(<SahiReturnApp />);
    /* The warning itself is always visible; the arithmetic behind it is not. */
    expect(screen.getByText(/has gone/)).toBeInTheDocument();
    const disclosure = screen.getByText("What filing late costs");
    expect(disclosure.closest("details")).not.toHaveAttribute("open");
  });
});

describe("the notices archive", () => {
  const en = copy.en;

  it("keeps every notice, not just the ones the home page has room for", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);

    /* The home page carries a glance: the newest four, in the order they were
       published rather than sorted by whether they affect you. */
    const home = document.querySelector(".notice-list");
    if (!home) throw new Error("no notices on the home page");
    expect(within(home as HTMLElement).getAllByRole("listitem")).toHaveLength(4);
    expect(home.textContent).toContain("20 August 2026");

    await user.click(screen.getByRole("button", { name: en.noticesSeeAll }));

    await screen.findByRole("heading", { name: en.noticesTitle, level: 1 });

    /* The archive carries the run, under a heading for each month — which is
       how anybody looking for an old notice remembers when they saw it. */
    expect(screen.getByText("15 notices")).toBeInTheDocument();
    for (const month of ["August 2026", "July 2026", "June 2026", "May 2026", "April 2026"]) {
      expect(screen.getByRole("heading", { name: month })).toBeInTheDocument();
    }

    /* Something from months back is reachable, which is the whole point. */
    expect(
      screen.getByText(/A PAN that is not linked to Aadhaar/),
    ).toBeInTheDocument();
  });

  it("filters to the notices that change what a filer does", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);

    await user.click(screen.getByRole("button", { name: en.noticesSeeAll }));
    await screen.findByRole("heading", { name: en.noticesTitle, level: 1 });

    await user.click(screen.getByRole("button", { name: en.noticesFilterAffects }));

    expect(screen.getByText("9 of 15 notices")).toBeInTheDocument();
    /* Scoped to the pills: "For information" is also the name of the filter
       button that did the filtering, and that stays on the page. */
    const pills = [...document.querySelectorAll(".notice-list .pill")].map(
      (pill) => pill.textContent,
    );
    expect(pills).toHaveLength(9);
    expect(pills).not.toContain(en.homeGeneral);
    /* An information-only notice is gone; one that affects you is still here. */
    expect(
      screen.queryByText(/scheduled maintenance/),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/A PAN that is not linked to Aadhaar/),
    ).toBeInTheDocument();
  });

  it("goes back to the home page", async () => {
    const user = userEvent.setup();
    render(<SahiReturnApp />);

    await user.click(screen.getByRole("button", { name: en.noticesSeeAll }));
    await screen.findByRole("heading", { name: en.noticesTitle, level: 1 });

    await user.click(screen.getByRole("button", { name: en.noticesBack }));
    expect(
      await screen.findByRole("button", { name: "Start the guided demo" }),
    ).toBeInTheDocument();
  });
});
