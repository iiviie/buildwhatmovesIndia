# Sahi Return: salaried ITR filing product plan

Created: 2026-08-27 23:30 IST (UTC+05:30)

Last updated: 2026-08-28 02:45 IST (UTC+05:30)

Status: confirmed implementation direction, implemented in `web/`

Supersedes [the defective-return product plan](2026-08-25-income-tax-defective-return-product-plan.md).

Prototype deadline: 2026-08-28 20:00 IST (UTC+05:30)

## Decision

Build `Sahi Return` as an independent hackathon prototype for the ordinary salaried filing journey on the Income Tax e-Filing portal:

> A salaried citizen with a Form 16 wants to file their own return for AY 2026-27 without paying a chartered accountant. The portal asks them a series of questions only a tax professional can answer, so most people pay someone instead. The prototype answers those questions from records the department already holds, shows its working, and checks the return for defects before it is filed.

This replaces the earlier direction, which started after a Section 139(9) defective-return notice had already arrived. That work is not discarded: the defect rules it produced are now run **forwards**, as a pre-submission check, which is the part of this prototype we would most want a real service to adopt.

## Why the scope changed

Two facts drove it.

1. **The Income Tax e-Filing portal is one of the ten platforms the organisers listed**, so the platform choice was already right. The problem inside it was not.
2. **Judges score the problem on whether it is real and important.** The organisers' instructions video is explicit that a reviewer who has not experienced a problem will not understand the solution as easily. Very few reviewers have received a Section 139(9) notice. Almost every salaried reviewer has either filed an ITR and found it hostile, or paid someone a few thousand rupees to do it.

A public walkthrough video for salaried filing was used as the reference for what the current journey actually asks. It is worth recording that the video's own business model is selling access to a tax professional, which is the clearest available evidence that the interface, not the tax law, is what people are paying to get around.

The same video reaches the prefilled other-income screen and says, in full: *the data will be prefilled, you just have to review and confirm*. That single unexplained step is where the defect the earlier plan was built around comes from. The narrow problem was the failure mode of the broad one.

## Supported demonstration case

Ananya Rao is a fictional private-sector salaried taxpayer filing for AY 2026-27.

| Fixture | Value |
|---|---|
| Gross salary (demo Form 16) | ₹13,20,000 |
| Tax deducted by employer | ₹85,000 |
| Savings interest, Sampurna Bank | ₹12,400, no TDS |
| Fixed deposit interest, Sampurna Bank | ₹48,000, TDS ₹4,800 |
| Dividend, Meghdoot Industries | ₹6,200, TDS ₹620 |
| Fixed deposit interest, Trilok Bank | ₹31,500, TDS ₹3,150 — **not hers** |

The Trilok Bank line is a synthetic PAN mix-up. It is the teaching moment: accepting it means paying tax on money never received, and claiming its credit while leaving its income out is exactly the mismatch that produces a defective return.

On the intended answers the demonstration calculation gives a total income of ₹13,11,600, total tax of ₹79,810 under the new regime against ₹1,64,299 under the old, and a refund of ₹10,610.

## Citizen journey

Step 0 is the start screen and is not numbered.

1. **What applies to you.** The form, the employment type and the filing reason are worked out and shown with the reason for each, instead of being asked as bare dropdowns. The statutory dates and the late fee are stated as facts.
2. **Your salary.** Every Form 16 figure appears beside the row it came from. The exempt-allowance column is explained rather than left blank and unlabelled.
3. **Your other income.** Each prefilled AIS entry is confirmed or disputed. A disputed entry stays out of the return and its tax credit is dropped with it.
4. **Your tax regime.** Both regimes are computed from the citizen's own figures, with the slab working shown band by band, and a recommendation with the amount attached.
5. **Before you file.** The Section 139(9) rules run as a pre-submission check.
6. **Review and file.** The whole return in one place, with a declaration.
7. **Acknowledgement.** A synthetic acknowledgement with a printable and downloadable receipt.

## The idea we would want adopted

The official portal does not run defect checks before submission. A citizen learns their return was defective months later, from a notice, when the fix is expensive. The four checks in step 5 are deterministic, cheap, and run on data the portal already has:

| Check | Rule |
|---|---|
| Every prefilled entry has been answered | No AIS line may be left unreviewed |
| Every credit claimed has its income reported | TDS is claimable only on accepted income |
| No credit claimed on a disputed entry | A disputed line loses its income and its credit together |
| A regime has been chosen | The calculation depends on it |

## Citizen-experience work

The six principles behind the task list, the missed-deadline alert, the stated-up-front constraints, the on-device file conversion, the reduced divider levels, and the use of the portal's own field names are recorded separately in [citizen UX principles](2026-08-28-citizen-ux-principles.md), with their sources.

The official field names quoted in the interface were taken from a frame-by-frame reading of a public ITR-1 walkthrough video. The narration alone was not enough: it named some fields and skipped others, so the screens were read directly.

## Product rules

- Show `Independent prototype` and `Synthetic data only` before data entry and on the receipt.
- Display each extracted value beside its named source and require citizen confirmation.
- Use deterministic, versioned rules for slabs, rebate, cess, deduction caps, credits and checks. The engine lives in `web/app/tax.ts` and every rule is written out in full.
- Never state a tax conclusion without showing the arithmetic that produced it.
- Save the demo draft on the device after every meaningful change, and show whether it is saved, offline, submitting or submitted.
- Support the full main route in English and Hindi.
- Keep every main action operable by keyboard and at 320 CSS pixels.
- Provide contextual help, one fully simulated support route, and a visible low-data preference.

## Failure and recovery states

- documents not loaded, wrong file type, or file larger than 5 MB;
- Form 16 figures not yet confirmed;
- one or more prefilled entries left unanswered;
- an entry the citizen does not recognise, with its credit withheld and AIS feedback offered;
- no regime chosen;
- declaration not ticked;
- browser goes offline while filing, with the submission queued and retried;
- draft cleared on a shared device.

## Mock and data inventory

| Item | Prototype treatment | Production dependency |
|---|---|---|
| Taxpayer, PAN, employer, banks | Fictional and visibly labelled | Approved identity and taxpayer account systems |
| Form 16 | Synthetic fixture | Employer TDS filings via TRACES |
| Annual Information Statement | Synthetic fixture | Secure document access and taxpayer consent |
| Tax calculation | Deterministic demo engine, version `DEMO-AY26-27-v2` | The department's own computation |
| Filing, verification, acknowledgement | Simulated, no network call | e-Filing submission and e-verification |
| Refund | Stated only, never paid | Refund banker and pre-validated bank account |
| AIS feedback | Synthetic reference only | AIS feedback intake and review |
| Support request | Synthetic reference only | Staffed e-Filing helpdesk |

## Verification performed

| Check | Method | Result |
|---|---|---|
| Demonstration tax engine | 10 unit tests over slabs, rebate boundary, caps, both regimes, and the comparison | Pass |
| Citizen journey and failure states | 19 tests with Testing Library, including the end-to-end filing, the disputed-entry route, task-list status and the stated upload rules | Pass |
| Server-rendered public page | Node test over the built worker output | Pass |
| Filing-window state machine | 7 tests at fixed dates, including both sides of midnight IST | Pass |
| On-device PDF writer | 8 tests over the envelope, embedded bytes, xref offsets and escaping; output checked with `pdfinfo` and rendered with `pdftoppm` | Pass |
| Reflow | Headless Chrome over 8 steps x 2 languages x {320 px, 360 px}, via `npm run test:reflow` | No horizontal overflow |
| Lint and types | `npm run lint`, `tsc --noEmit` | Clean |

## Out of scope

Business or professional income, ITR-2 through ITR-7, capital gains beyond the demo case, house property, foreign assets, real PAN data, real tax computation, payments, e-verification, and any submission to the Income Tax Department.

## Honest limitations

- The slabs, rebate and caps are written for AY 2026-27 as the prototype understands them and are not a substitute for the department's own computation. Nothing here is tax advice.
- One taxpayer, one form, one assessment year. The engine generalises; the fixtures do not.
- The demo window shown by the progress meter is the prototype's own device for keeping the meter truthful whenever a reviewer opens it. The real statutory dates are stated separately as fixed text.
