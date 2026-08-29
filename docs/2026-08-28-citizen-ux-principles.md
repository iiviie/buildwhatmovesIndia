# Designing for a citizen who is not sure they got it right

Created: 2026-08-28 02:40 IST (UTC+05:30)

Last updated: 2026-08-28 21:40 IST (UTC+05:30)

Status: implemented in `web/`

Companion to the [salaried ITR filing product plan](2026-08-27-salaried-itr-filing-product-plan.md) and to the earlier [interface principles](2026-08-26-interface-principles.md), which still hold. This document records thirteen further principles, where each came from, and what changed in the product because of it.

The audience these are written for is not a hostile user or a careless one. It is someone filing a legal document once a year, under a deadline, who has been told that getting it wrong is expensive, and who has no way to check their own work. Most of what follows is about removing the reasons that person has to feel uncertain.

## Where the evidence comes from

- The [GOV.UK task list component](https://design-system.service.gov.uk/components/task-list/) and the [GOV.UK form-structure guidance](https://www.gov.uk/service-manual/design/form-structure): status shown as a word rather than only a colour, one thing per page, and telling people what a form needs before they start.
- Microsoft Research's work on [interfaces for novice and low-literacy users](https://www.microsoft.com/en-us/research/publication/designing-mobile-interfaces-for-novice-and-low-literacy-users/), and the [ACM review of UI guidelines inclusive of low-literate users](https://dl.acm.org/doi/10.1145/3449210): dense text alone is not usable for a first-time or low-literacy user; state has to be visible in a form other than prose.
- A frame-by-frame reading of a public ITR-1 walkthrough video, used to record what the official portal actually asks and in what words. That is the source of the field names quoted in the interface.
- Nielsen Norman Group on [auto-forwarding carousels](https://www.nngroup.com/articles/auto-forwarding/) and [carousel usability](https://www.nngroup.com/articles/designing-effective-carousels/): people scroll past rotating banners, and auto-advance removes content before a slower reader has finished it.
- The [GIGW 3.0 guidelines](https://guidelines.india.gov.in/guidelines/) for Indian government websites, which set the accessibility and responsiveness floor this has to clear.
- A reading of the official [e-Filing homepage](https://www.incometax.gov.in/iec/foportal/) itself, to inventory what a citizen currently meets there.

## 1. A step must say whether it is done

The complaint this answers is the ordinary one: *did I finish that step, or did I skip something?* An index that only highlights the current step cannot answer it.

The step list is now a task list. Every step carries three things: a mark, a name, and a status word.

| State | Mark | Word |
|---|---|---|
| Finished | Filled tick | `Done` |
| Current | Filled number | `You are here` |
| Not reached | Padlock | `Not yet` |

Above the list, a count: `3 of 7 steps done`. The status is never carried by colour alone, so it survives a screen reader, a monochrome display, and a reader who cannot separate red from green.

## 2. A missed deadline is the most expensive thing to learn late

The prototype previously showed a rolling demo window, which was honest about being a demo but taught nothing. It now models the real statutory position for AY 2026-27 and reacts to the actual date:

| Situation | What the citizen sees |
|---|---|
| On or before 31 July 2026 | Days left to file on time |
| 1 August to 31 December 2026 | A leading alert: the date has passed, the section 234F fee that now applies, that section 234A interest runs, the days left to file a belated return, and that filing late costs less than not filing |
| After 31 December 2026 | The belated window has closed, and a pointer to the updated-return route under section 139(8A) |

The alert leads the start screen rather than sitting in the margin, because it changes what the citizen should do next. The fee shown follows the income: ₹1,000 at or below ₹5 lakh, ₹5,000 above it.

The state machine is pinned by tests at fixed dates, including both sides of midnight IST, so a server running in UTC cannot show a different answer from the citizen's own calendar.

## 3. Say the rules before the control, not after the rejection

Ambiguity is its own barrier. Three things were being left for the citizen to discover by failing:

- **What it will cost.** The start screen now states that the service is free, that no payment will ever be requested, and that the refund-or-owed figure appears at step 6 with its arithmetic.
- **What is accepted.** Accepted formats and the size limit are stated above the file control rather than in an error message after a rejected upload.
- **Whether they can back out.** The start screen says answers are kept on the device, that the citizen can stop and resume, and that any answer can be changed before filing.

## 4. Do the file conversion for them

This is the smallest idea here and probably the most useful. A citizen photographs a document on a phone and gets a 4 MB JPEG. The upload field wants a PDF under 5 MB. The standard advice is to find a free online converter, which means handing a tax document to an unknown website.

`web/app/file-tools.ts` does it on the device:

- a JPG, PNG or WebP is drawn to a canvas, re-encoded, and stepped down in quality and then in pixel size until it fits;
- the result is wrapped in a single-page A4 PDF, with the JPEG embedded under `DCTDecode` so the picture is not re-compressed a second time;
- the wrapper costs under a kilobyte;
- the interface then says what it did, in the units the limit was written in: *turned into Form-16.pdf and reduced from 3.8 MB to 740 KB, done on your device*.

Nothing is uploaded to do any of this. There is no library and no network call, which also keeps it inside the prototype's own no-third-party rule.

The PDF writer is a pure function over bytes and dimensions, so it is unit tested: the envelope, the embedded bytes, the cross-reference offsets, the `startxref` pointer, and title escaping. A generated file was also checked with `pdfinfo` and rendered with `pdftoppm`.

## 5. One divider level, not four

The interface had a hairline between every section, every list item, every table row and every choice, all at the same weight. With no hierarchy among them, nothing read as a grouping and it became hard to see where one thing ended and the next began.

The rule now: **a line means tabular data. Everything else is grouped by space or by a surface.**

- Section boundaries: space and a heading. The one-off divider is opt-in as `.section-ruled`.
- Numbered sequences, documents and answers: no per-item lines.
- Prefilled income entries, regime columns, documents and the declaration: a quiet surface with a radius.
- A chosen answer: a heavier border and an inset edge, not a colour swap alone.
- Ledger tables: hairlines kept, because rows of figures genuinely need them.

## 6. Use the words the real form uses

A citizen who leaves this prototype and opens the real portal should be able to find the same box. Each figure now carries the official field name beside our plain-language one, taken from the actual portal screens:

| Ours | The portal's |
|---|---|
| Gross salary | `B1 i. Gross Salary (a + b + c)` |
| Standard deduction | `B1 iii a. Standard Deduction u/s 16(ia)` |
| Tax already deducted by your employer | `Schedule TDS1 — Details of Tax Deducted at Source from Salary` |
| Your other income | `B3. Income from Other Sources`, `Schedule TDS2` |
| Your tax regime | `Do you wish to exercise the option u/s 115BAC(6) of opting out of the new tax regime?` |

This also keeps us honest: it is a standing, checkable claim that the redesign is of a real form and not an invented one.

## 7. A homepage is a place to start, not a noticeboard

The official [e-Filing homepage](https://www.incometax.gov.in/iec/foportal/) was read in full to see what a citizen actually meets there. It carries, on one page:

| Block | Count |
|---|---|
| Auto-rotating carousel banners | 5 |
| Announcement ticker items | 4 |
| "What's New" | 2 |
| "Latest Updates" | 6 |
| Quick-link tiles, one flat grid | 18 |
| "Things to Know" video tutorials | 4 |
| Helplines, on three different schedules | 3 |
| Taxpayer testimonials | 5 |
| Audience navigation categories | 5 |

That is roughly forty items competing for the same attention, and none of them is *start your return*. The information is not the problem — a citizen genuinely needs most of it. The ordering is.

What changed here, and why:

**The action comes first.** The headline and the primary button share the first screen, with what you need beside them: your Form 16, about ten minutes, nothing else. Everything else on the page is below it.

**No carousel.** Nielsen Norman Group's work on [auto-forwarding carousels](https://www.nngroup.com/articles/auto-forwarding/) and [carousel usability](https://www.nngroup.com/articles/designing-effective-carousels/) is consistent: people scroll past them, banner blindness applies because they look like ads, and auto-advance takes the content away before a slower reader has finished. Anything worth putting in a carousel is worth putting in the page.

**Announcements are sorted by whether they change what you do.** Each notice carries a dated line and a `Affects you` or `For information` pill. The three that change a salaried filer's behaviour — filing is open, the ITR-3/ITR-4 date is different from yours, the department never asks for your OTP — sort above the one that does not.

**The eighteen tiles become four groups of five or fewer**, named for *when* you need them rather than listed alphabetically: getting ready, after you have filed, if something looks wrong, paying tax. That respects the chunking rule already recorded in the [earlier interface principles](2026-08-26-interface-principles.md).

**Every tile says where it goes.** `Works in this demo` or `Opens the official portal`. Nothing on the page looks clickable and turns out to be scenery, which is also what the hackathon brief demands of a demo.

**The helpline block answers the question actually being asked.** The official page prints three numbers with three sets of hours and leaves the reader to work out which one they want and whether anyone is there. Ours labels each line by what it is for, and computes `Open now` or `Closed now` from the Indian wall clock. The hours are the department's own, and the block says so.

**No testimonials.** A page someone reached in order to do a legal task under a deadline is not the place to be sold to.

The [GIGW 3.0 guidelines](https://guidelines.india.gov.in/guidelines/) for Indian government websites set the floor this has to clear: WCAG 2.1 AA, keyboard operation, contrast, and responsive layout. Those were already acceptance criteria here and remain so.

## 8. Explain the vocabulary where it is used, and only when asked

The walkthrough video opens by telling a salaried filer they need three documents: Form 16, the Annual Information Statement, and Form 26AS. It then says nothing about what any of them is. Neither does the portal. Neither, until now, did this prototype.

That is one instance of a general failure. A salaried return puts roughly forty terms in front of someone: AIS, TIS, TDS, TCS, BSR code, challan, 139(1), 139(8A), 115BAC(6), 80CCD(2), Section 24(b), 112A, EVC, DSC, prevalidated, dormant account, representative assessee, Seventh proviso, perquisite, assessment year against financial year. Each one is a wall, and a glossary on another page is not a bridge — by the time you have gone to find it you have lost the sentence you were reading.

**The rule: a term is explained where it is used, in place, and only when the reader asks.**

`web/app/glossary.ts` holds sixty terms in both languages. Every entry answers the same three questions in the same order:

| | |
|---|---|
| What it is | Two sentences at most |
| Where to get it | The real navigation path, or the honest *it arrives, you do not fetch it* |
| Why it matters to you | The specific mistake it protects you from |

The third line is the one that earns the interruption. *Form 26AS is your tax credit statement* is a definition. *If your Form 16 says ₹85,000 was deducted and Form 26AS does not show it, the department never received it and you cannot claim it* is a reason to read.

**Asking is a hover that lasts.** A pointer crosses a great many words on its way to a button. Opening on contact would leave a trail of boxes across a form somebody is trying to fill in, so the pointer has to come to rest:

| | |
|---|---|
| Open, cold | 500 ms |
| Open, warm | 150 ms |
| Warm window | 900 ms after the last card closes |
| Close | 160 ms, enough to move onto the panel |
| Focus | Immediate |

The warm window matters as much as the delay. Once someone has opened one card they are reading rather than travelling, and making them wait half a second for the next term in the same sentence reads as the interface being slow.

Focus opens with no delay because a keyboard user who tabbed to a term asked deliberately. The panel is `role="tooltip"` and wired with `aria-describedby`, so it is announced rather than being a visual-only affordance. One card is open at a time; `Escape` closes.

**There is no touch-device branch.** The first version asked `(hover: none)` and switched the pointer handling off when it matched. That is the obvious design and it is wrong: any environment that misreports silently loses the whole feature, and the failure is invisible because nothing errors. Hover and click are both always live. A device that cannot hover simply never fires `mouseenter`, which costs nothing.

**Terms are marked up in the copy, not placed in JSX.** A string in `content.ts` carries `[[form-26as]]`, or `[[tds|the tax your employer deducted]]` where the sentence needs different words. Writing `<Term>` at each call site would mean breaking every string into fragments and keeping the English and Hindi halves structurally identical for ever. It also makes coverage checkable: `tests/glossary.test.tsx` walks every module under `app/` and fails if a marker names a term that does not exist, so a typo is a red test rather than a literal `[[frm-16]]` on a citizen's screen.

## 9. A step should say what it will ask before you are in it

The task list from principle 1 answers *did I finish that?* It does not answer *what is that, and can I do it now?* A locked step that says only `Not yet` cannot tell you whether it will take thirty seconds or ten minutes, so it cannot help you decide whether to start before your bus arrives.

Hovering a step in the rail — same mechanism, same delays — shows what it will ask, what you need in front of you, and roughly how long it takes. Two to four short lines, no prose.

This forced a correction elsewhere. Locked steps were `disabled`, and a disabled button takes neither hover nor focus, so the preview would have been unavailable on exactly the steps it helps most. They are now marked `aria-disabled` and stay reachable; the click is refused instead. A step you cannot open yet is the one you most want to read about.

## 10. Two answers are not enough when the third one is the common case

A prefilled income line offered exactly two answers: *yes, this is mine* and *no, I do not recognise this*. A reviewer found the gap in a sentence: **yes it's mine, but the numbers don't match — I should be able to edit them.**

They are right, and it is not an edge case. A statement routinely reports bank interest on a date the passbook disagrees with, or a figure that includes something already counted. Under the old pair of answers the citizen had to either accept a number they knew was wrong or deny an entry that was genuinely theirs. Both are false statements on a legal document, and the second is worse, because it also throws away a tax credit.

There is now a third answer: **yes, but the figure is wrong**, with the correct amount editable beside it.

- The citizen's figure is what enters the return.
- The tax deducted is unchanged, because that is what the deductor actually paid the department. Only the income is in dispute.
- The difference is raised as AIS feedback, which is the department's own route for exactly this.
- Clearing the box falls back to the statement's figure. An empty field is not a declaration of zero income.

This is the same principle as the defect checks: the interface must let a citizen be accurate. An interface that only accepts *agree* or *deny* forces a lie whenever the truth is *nearly*.

## 11. One verdict, not a verdict per row

The eligibility wizard marked every changed answer with the form it pointed at. Change two answers and the screen carried `MOVES YOU TO ITR-3` on one row and `MOVES YOU TO ITR-2` on another, leaving the citizen to work out which actually applied. A reviewer's summary: *it should just tell you the final ITR you need to file.*

The rule now: **the outcome is stated once, in one place, and nothing else names a form.** A row that helped decide it says so — it has to stay findable — but with a fixed word rather than a competing answer. The reasons still explain themselves, under the single verdict, as one set.

The general form of the mistake is worth naming: when several inputs feed one conclusion, showing the conclusion beside each input turns one answer into many. The inputs should point at the answer, not restate it.

Where the verdict is a form this prototype does not build, the panel says so in plain words and the journey continues on ITR-1. Silently switching, or silently not switching, would both be worse than admitting the boundary.

## 12. An icon is only cheaper if its name is still there

A reviewer called the site *intimidating, because it's so text heavy*, and the masthead was a fair example: search, help, the account, dashboard, logout and settings, all spelled out, reading as a sentence above the page.

They are icons now, and the rule that made that safe is: **an icon replaces a word on screen, never in the accessible name.** Each control keeps its name for a screen reader, and shows it on a hovercard after the same delay the jargon layer uses. Nobody has to guess a glyph, and nobody who relies on the name loses it.

The same reasoning cut the step rail. Seven rows each carried a mark, a name and an uppercase status word; the marks — a tick, a number, a padlock — already carried the state, so the words were repeating a thing the eye had read. The word now shows on the current step only, and stays in the accessible name of the rest, where the shapes are not available.

**What this is not.** It is not licence to remove text generally. Text was removed in two places where a shape or a mark already said the same thing to a sighted reader. Everywhere else the answer to *too much text* was hierarchy — a lede that leads, secondary notes set as asides, headings bound to what they introduce — not deletion.

## 13. A warning must not stand between someone and the thing it is warning them about

Principle 2 put the missed-deadline alert at the top of the start screen, and principle 7 asks whether the thing the citizen came to do is visible without scrolling. Measured, the two were in direct conflict: on a 390-pixel phone `Start the return` sat at **y = 1169**, and a citizen had to scroll past a 274-pixel warning to reach the button the warning was telling them to press.

Both principles survive, because the alert's job splits in two. **What changed** is a single line: *125 days left to file a belated return*. **What it costs** — the section 234F fee, the interest, the closing date — is detail, and detail can follow the action rather than block it.

So the deadline still leads, as one line. The full alert now sits immediately below the start card. Nothing was removed and nothing moved into the margin.

Three other things were above the button and should not have been:

- **A "Saved on this device" line on a screen where nothing had been started.** The same false reassurance the step list used to give before it was moved inside the journey, and worth stating as a rule: *a status line about a thing that does not exist yet is not reassurance, it is noise.* It now appears only inside the journey, where there is a draft, or when there is an actual notice to give.
- **Two-thirds of the lede.** The headline's first sentence is the promise; the rest is the argument for it, and the argument already had a section of its own further down. It was moved there.
- **The assistant's launcher.** A floating pill at the bottom right was sitting directly on top of `Start the return` — the launcher was covering the one control the screen exists for. On a phone it is a circle now: same 48-pixel target, a third of the footprint, and its words survive as the accessible name.

The result, on the home screen:

| Width | Button before | Button after | Fold |
|---|---|---|---|
| 390 | 1169 | **758** | 844 ✓ |
| 360 | 1169 | 758 | 740 |
| 320 | 1326 | 866 | 720 |

390 clears it. 360 misses by 18 pixels and 320 by 146, and what remains above the button is the trust banner, the masthead, the section nav, the headline and the *what you need* list — each of which is there for a reason recorded in one of these principles. Going further means giving one of them up, which is a product decision rather than a layout one, so it is left stated rather than taken.

## Checking a new screen

Carry the three earlier questions, and add these:

1. Can a citizen tell, without reading prose, which parts they have finished?
2. If a date has passed, does the screen say so before it asks for anything?
3. Is every constraint stated before the control it constrains?
4. Does anything here ask the citizen to do a technical task we could do for them?
5. Is every line on this screen separating rows of data? If not, can space or a surface do the work instead?
6. On a landing screen: is the thing the citizen came to do visible without scrolling, on a 320-pixel phone as well as a desktop?
7. Does every link say whether it stays here or leaves?
8. Is there a word on this screen a first-time filer would have to look up, and if so is it explained in place?
9. Can a citizen tell what a step will ask before they are inside it?
10. If the honest answer to a question is "nearly", can they say so?
11. Does anything on this screen state a conclusion that is stated elsewhere too?
12. Has any icon here taken a name away from a screen reader as well as from the screen?
13. Is anything — a warning, a status line, a floating control — standing between the citizen and the action this screen exists for?

## What is still missing

- No spoken or icon-only route. The research is clear that text alone excludes the lowest-literacy users, and this prototype is still a reading interface in two languages. The jargon layer in principle 8 lowers the reading level required but does not remove it: a hover panel is still text.
- Only one flow, the salaried one. A pensioner, a business filer and a first-time filer with no Form 16 each need a different entry point, and the ambiguity work above would have to be repeated for each.
- The conversion helper handles still images. A multi-page document photographed as several pictures should become one PDF, and does not yet.
- The homepage announcements are a fixed synthetic set. A real service would need an editorial rule for what counts as `Affects you`, and for whom, which is a policy question rather than a design one.
