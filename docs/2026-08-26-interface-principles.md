# Sahi Return interface principles

Created: 2026-08-26 03:20 IST (UTC+05:30)

Last updated: 2026-08-26 03:20 IST (UTC+05:30)

Status: implemented in `web/`

Companion to the [Sahi Return interface redesign](2026-08-25-sahi-return-interface-redesign.md), which records the visual direction. This document records three principles the product is now built against, where each came from, and what changed because of it. They are meant to survive the current screens: a new screen should be checked against all three before it ships.

## 1. Chunk what a person has to hold at once

George Miller's 1956 paper [`The Magical Number Seven, Plus or Minus Two`](https://en.wikipedia.org/wiki/The_Magical_Number_Seven,_Plus_or_Minus_Two) put the span of immediate memory at roughly seven items, and showed that recoding information into a small number of meaningful chunks is what lets a person work past that limit. The number is not a law about interfaces and should not be treated as one. What carries over is the useful half: a long undifferentiated list is expensive to hold, and grouping is what makes it cheap.

This matters more here than on an ordinary site. The citizen is reading a legal notice, working to a deadline, and may be doing it for the first time. Whatever budget they have for holding things in mind should go to the tax question, not to the menu.

The rule for this product: **no single group of choices runs past about seven items, and anything longer is cut into named groups.**

Applied:

- The notice sheet listed eight facts in one run. It is now two named groups — `Who this concerns` with three, `The notice itself` with five.
- The command panel was one flat list of roughly twenty commands. It is now four named columns, each of five or fewer, and the step list only ever offers the steps already reached.
- Existing screens were checked and already sit inside the rule: six journey steps, three documents, three answers on the confirmation, two compared records, four ledger lines, five case facts in the margin, four related actions.

When a group genuinely cannot be cut, say so and give it a search, rather than pretending the list is short.

## 2. A large menu is a directory, not a dropdown

Prompted by [Pratik Sharma's note on the Swiss federal authorities menu](https://x.com/OCoolhead): large view with white spacing, a clean layout structure, a search and filter over the links, and better information architecture underneath. The Swiss menu opens to a full-width panel that says where you are, then lays the whole of government out in labelled columns with a search beside them.

Applied to the command panel, which is now the product's directory:

- it opens full width, not as a dropdown;
- it names the current step under `You are here` before it offers anything;
- it lays the service out in labelled columns — what is on this step, the steps themselves, settings, help and official sources;
- it carries both a search and a filter across the same set, so a citizen can either type or browse;
- the space between items is generous enough to scan rather than parse.

The accelerator rules from the [service scorecard](2026-08-24-government-service-quality-checklist.md) still hold: the panel opens from a visible control as well as from `Ctrl` or `Cmd` plus `K`, results are scoped to the current step first, commands are written in citizen words, and every action in it can be reached without it.

## 3. Tell a citizen how to know what they are looking at

Prompted by [Pratik Sharma's note on vote.gov](https://x.com/OCoolhead): with the amount of fraud around, a public service should educate the citizen on whether they are on the safe and secure site. The United States voter registration site carries a standing banner — `An official website of the United States government` with a `Here's how you know` disclosure explaining the `.gov` domain and HTTPS.

Tax is one of the most phished subjects in India, and refund and notice lures are common. Our version has to run the other way, because we are the thing a citizen should be suspicious of: this prototype is **not** the government service, and it should say so in a way that also teaches the check.

The standing disclosure now expands into three columns:

| Column | What it says |
|---|---|
| `This is not a government service` | Sahi Return is an independent hackathon prototype, with no connection to the Income Tax Department, no government record, and no endorsement. |
| `Where the real service lives` | The e-Filing portal is at `incometax.gov.in`. Read the address bar, check the padlock, and reach it by typing the address rather than following a link in a message. |
| `What the department never asks for` | PIN, password, OTP or bank account details — never by email, SMS or phone. Forward a suspicious message to CERT-In at `incident@cert-in.org.in`. |

Every claim in the third column comes from the department's own published anti-phishing notice, and the panel cites it. The disclosure is collapsed by default so it does not compete with the task, and the short form stays visible on every screen.

- [Income Tax Department anti-phishing press release, 5 February 2016](https://www.incometax.gov.in/iec/foportal/sites/default/files/2020-08/Press-Release-Anti-Phishing-email-05-02-2016.pdf)
- [Income Tax e-Filing portal](https://www.incometax.gov.in/iec/foportal/)

## Evidence

| Check | Method | Result |
|---|---|---|
| The disclosure opens, states the three facts, and closes | Vitest and Testing Library, asserting `aria-expanded` and the panel content | Pass |
| The command panel filter narrows the directory to one group | Vitest and Testing Library, asserting the named groups appear and disappear | Pass |
| The panel is still keyboard operable and still closable without changing the journey | Existing command panel tests | Pass |
| Reflow with the new banner and panel | Headless Chrome across 7 steps x 2 languages x {320 px, 320 px at 125% text, 360 px} | No horizontal scrolling |

## Checking a new screen

1. Count the choices in every group. Past about seven, name a grouping or add a search.
2. If it is a menu, does it say where the citizen is before it says where they can go?
3. Does anything on the screen invite trust? If so, does the screen also say how to verify it independently?
