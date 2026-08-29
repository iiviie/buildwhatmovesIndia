# Sahi Return interface redesign

Created: 2026-08-25 21:36 IST (UTC+05:30)

Last updated: 2026-08-26 03:20 IST (UTC+05:30)

Status: implemented in `web/`

Supersedes the interface described in [Sahi Return build and release record](2026-08-25-sahi-return-build-and-release-record.md). The product decision, supported case, and mock boundary in the [product and implementation plan](2026-08-25-income-tax-defective-return-product-plan.md) are unchanged.

## Why the interface was rebuilt

Review of the first build found interface problems that the passing test suite did not catch:

- headings broke mid-sentence because the display size was set against a narrow measure;
- typography mixed sizes and weights without a scale, so nothing established hierarchy;
- everything sat in one centred column, leaving most of a desktop screen unused;
- switching to Hindi changed the width of controls and rearranged the layout;
- there was no dark mode, no text-size control, and no contrast preference;
- `Use less data` was an unexplained checkbox in the header, using a term many citizens would not read as "your mobile balance";
- the journey gave a citizen less useful information than the official portal already gives them;
- there was no keyboard accelerator, although the [service scorecard](2026-08-24-government-service-quality-checklist.md) asks for a contextual command panel.

## Checking the flow against the official portal

The published Income Tax Department guidance was reread before the redesign, so that the prototype teaches the real sequence rather than an invented one.

The real route is: sign in, `Pending Actions`, `e-Proceedings`, `Self`, `View Notices`, open the defective notice, `Submit Response`, choose `Agree` or `Disagree`, and for `Agree` choose online mode (correct the ITR in the portal) or offline mode (upload the corrected JSON). A taxpayer may instead `Seek Adjournment` and ask for more time. The response window is 15 days from the notice, or the period written on it. A submitted response cannot be updated or withdrawn. Attachments are limited to 5 MB each, up to 10 files and 50 MB in total. A successful submission returns a transaction ID and an acknowledgement number and sends an email to the registered address.

Changes made so the prototype matches that reality:

| Real portal behaviour | Prototype before | Prototype now |
|---|---|---|
| Response window of 15 days from the notice | Two fixed dates in body copy | A 15-tick deadline meter with days remaining, issue date, and response date, held in the rail on every step |
| `Agree` and `Disagree` | Only a plain-language ownership question | The same plain-language question, with the portal's own word shown under each answer |
| Online and offline response modes | Not mentioned | Named on the `Agree` answer |
| `Seek Adjournment` | Not offered | An `Ask for more time` route that explains the real rule and produces a synthetic reference |
| Response cannot be withdrawn | Not stated | Stated immediately before the submit control |
| Transaction ID plus acknowledgement number | One reference | Both, on screen and in the text download |
| Attachment limits | "up to 5 MB each" | 5 MB per file, 10 files, 50 MB total, stated before the citizen chooses a file |
| Notice carries a document number and defect code | Not shown | Both shown on the notice sheet and in the case rail |
| Notice PDF can be downloaded | Not offered | A working text download of the synthetic notice |
| Departmental helpdesk numbers | Not shown | Shown, labelled as published by the department and not operated by this prototype |

Sources, rechecked on 25 August 2026:

- [Response to Defective Notice u/s 139(9) FAQs](https://www.incometax.gov.in/iec/foportal/faqs/response-defective-notice-1399)
- [e-Proceedings user manual](https://www.incometax.gov.in/iec/foportal/help/respond-to-e-proceedings)
- [e-Proceeding service page](https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/e-proceeding-0)

The prototype still reads no live government system and calls no government API. Only public guidance pages were read, and only to understand the citizen experience.

## Design direction

The direction is called `Notice, properly set`. A Section 139(9) notice arrives as a printed legal document and frightens the person who opens it. So the interface typesets that document rather than wrapping it in dashboard furniture. An earlier attempt at this redesign reached for cards, rounded chips and coloured badges; that reads as generated, and it buried the reading. Everything below replaces it.

- **No containers by default.** Sections are separated by hairline rules and space, not by boxes. Two elements keep a border because a border means something there: the notice, which is a sheet of paper on a desk, and the acknowledgement, which is a certificate. Both are square-cornered and unshadowed. There are no chips, pills, badges or tinted panels anywhere in the product.
- **Colour.** Warm document stock and ink carry the whole interface. Exactly two hues have meaning: crimson `#a31621` for what needs attention — the deadline, the missing amount, the stop route — and forest `#2e5540` for what is settled. Nothing else is coloured, so a citizen can read a result before reading a label.
- **Type.** Instrument Serif, self-hosted and subset to Latin, sets the display: headings, the deadline numeral, and the statement line. Everything else — prose, labels, controls, figures — is set in the system sans with tabular numerals. Dividing the two roles this way keeps money and reference numbers unambiguous while the page still reads as a document. There is one label style in the product: small, letterspaced, upright, no container.
- **Layout.** Three zones, not one centred column. The left carries the response as a table of contents; the middle carries the reading column; the right carries marginalia — the deadline, the case facts, the related actions, the departmental helpdesk — set as text under rules. The shell is `min(96vw, 2200px)` and both side columns widen with the viewport, so a large screen or a zoomed-out browser fills rather than leaving dead bands. Above 1700 pixels the type scale and the spacing steps grow too, because a wide viewport is not an invitation to stretch a line of prose.
- **The opening splits when the column can carry it.** Past 860 pixels of *reading column* — measured with a container query on the column itself, not on the viewport — the page opening becomes two columns: the headline holds the left, the summary and its actions hold the right. Below that it stacks. Keying this to the column means a wide window with a narrow reading column still reads correctly.
- **Signature.** One crimson serif italic line per screen carries the single fact that decides what the citizen does next: `₹48,000 income is missing` on the comparison, `The return claims tax on income it never declares` on the notice. It is the only place the italic appears.

Devanagari does not take the wide tracking, uppercasing or Latin display face the English setting relies on, and Instrument Serif has no Devanagari. Rather than let an arbitrary system serif stand in, Hindi display type is set in the reading face at a heavier weight, and Hindi labels drop the tracking and the uppercase. Each script is set the way it should be, and the grid is unchanged between them.

## Two defects found while rebuilding

- **The synthetic dates were not deterministic.** `buildCaseDates` derived the notice window from the render machine's local calendar day. The Cloudflare worker runs in UTC and the browser runs in the reader's zone, so between IST midnight and 05:30 the server and the client produced different dates and React discarded the server-rendered tree. The dates are now anchored to the Indian calendar day and every date is formatted in `Asia/Kolkata`, so both sides agree.
- **The appearance script tripped hydration.** The inline script that applies the saved theme and text size before first paint writes attributes on `<html>` that React did not render. `suppressHydrationWarning` on that element is the documented fix.

## Evidence

| Check | Method | Result |
|---|---|---|
| Journey, disputed route, offline retry, Hindi, support request, file validation | Vitest and Testing Library | Pass |
| Command panel opens by keyboard, runs a scoped command, and closes without changing the journey | Vitest and Testing Library | Pass |
| Appearance and text size persist to the document element | Vitest and Testing Library | Pass |
| Request for more time creates a synthetic reference | Vitest and Testing Library | Pass |
| Server-rendered start page, mock labels, no government logo or external font | Node test against the built worker | Pass |
| Horizontal reflow | Headless Chrome across 7 steps x 2 languages x {320 px, 320 px at 125% text, 360 px} | No horizontal scrolling in any combination. Both ledger tables become labelled blocks below 680 px while staying real tables |
| Hydration | Headless Chrome console capture on load | No React hydration warning or error |
| Wide viewports | Headless Chrome at 1440, 1920 and 2400 CSS pixels | Content fills the viewport; the opening splits into two columns only once the reading column can carry it |
| Transferred weight | `gzip` over the built client assets | 136 KB of script and stylesheet plus a 21 KB display font on first paint, against a 250 KB budget |
| Static analysis | ESLint with React, hooks, JSX accessibility, and Next rules | Pass |

## Fonts and licensing

The display face is [Instrument Serif](https://github.com/Instrument/instrument-serif), licensed under the SIL Open Font License 1.1. Two Latin subsets, roman and italic, are served from `web/public/fonts/` with the licence text beside them at `web/public/fonts/OFL.txt`. Self-hosting keeps the requirement in the service checklist that no external font host is called, and the page requests no font from a third party. Everything else is a system font stack.

## Principles this direction is now held to

Three principles were adopted after this direction was built, and the interface was changed to meet them: chunking anything longer than about seven choices, treating a large menu as a directory rather than a dropdown, and telling a citizen how to verify what they are looking at. They are recorded with their sources and their evidence in [Sahi Return interface principles](2026-08-26-interface-principles.md).

## Still requiring a person

Unchanged from the release record, and not satisfied by this redesign:

- a fluent Hindi reviewer for every high-impact string, including the new copy;
- a qualified tax reviewer for the synthetic calculation and the Section 139(9) wording;
- manual screen-reader passes with TalkBack and NVDA;
- a test on an entry-level Android device over a throttled connection;
- a signed-out test of the final public URL.
