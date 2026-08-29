# ITR-1 salaried flow: what the official portal asks, and what Sahi Return is missing

Created: 2026-08-28 17:50 IST (UTC+05:30)

Last updated: 2026-08-28 19:15 IST (UTC+05:30)

Status: analysis complete. Tiers 1 to 4 built; tiers 5 and 6 outstanding.

Companion to the [salaried ITR filing product plan](2026-08-27-salaried-itr-filing-product-plan.md) and [citizen UX principles](2026-08-28-citizen-ux-principles.md).

## Method

The reference is a public ITR-1 walkthrough for AY 2026-27, 12 minutes 5 seconds, 1920x960 at 25 fps, with English captions.

The narration alone was not enough — it names some controls and skips most. So the video was read as frames, not as speech:

1. Frames sampled at 3 fps (2,176 frames).
2. A per-pixel temporal-difference map over consecutive frames located the presenter's webcam overlay at x 1380-1830, y 225-735. That box was masked out of the change metric so the presenter's movement did not read as a screen change.
3. Frames were segmented into 241 static runs; a settled representative was taken from each, plus a sample every 1.67 s through scrolls and pans, then de-duplicated against the masked signature.
4. That produced 315 distinct screens. Dropping the sponsor read (1:02-2:03) and the outro (11:40-12:05) left **286 screens**, which were read individually at full resolution.

Every field name, option label, section number and note quoted below was read off a frame. Where the transcript adds a rule the screen does not state, it is marked as narration.

Working files are under `tmp/itr-video/` and are not committed.

## The portal's actual shape

The official journey is **not** the seven-step line our prototype models. It is four stages, and the third is a hub-and-spoke, not a sequence.

```
Stage 1  Gather        Form 26AS (TRACES)  ·  AIS  ·  TIS  ·  Form 16
Stage 2  Qualify       AY + mode → status → ITR form → 6-section eligibility
                       wizard → filing reason → pre-fill disclaimer
Stage 3  Fill          Return Summary hub, 5 sections, each confirmed
                       independently, in any order, returning to the hub
Stage 4  Submit        Preview + declaration → internal validation → PDF
                       preview → upload validation → e-verify → filed
```

Our prototype covers a thin slice of stage 3 and a compressed stage 4. Stages 1 and 2 are almost entirely absent, and stage 3 is missing four of its five sections' real content.

## Gap register

Legend: **Missing** — not present at all. **Thin** — present but far less than the portal asks. **Have** — comparable or better. **Built** — added since this analysis. **Explained** — we do not provide the thing, but a citizen now learns what it is and where to get it.

### Stage 1 — Gather your documents

| # | Portal thing | Ours | Notes |
|---|---|---|---|
| 1.1 | `e-File → Income Tax Returns → View Form 26AS` | **Explained** | Opens TRACES. Annual Tax Statement, Parts I-VI: TDS; 15G/15H; 194B/194R/194S; 194IA/194IB/194M/194S; 194S Form 26QE; TCS. Header carries PAN, Current Status of PAN, FY, AY, Name, Address, `Data updated till 30-Jun-2026`. We do not fetch it — the `Your documents` panel says what it is, gives the menu path, and says the prototype uses a synthetic fixture. |
| 1.2 | `View Annual Information Statement (AIS)` | **Explained** | The portal hands off to the **Compliance Portal** (Insight), a different site with its own nav: Home, AIS, e-Campaign, e-Verification, Reports, Activity History, Resources, Rate Us, Help. The panel now says where AIS comes from and what this return uses it for; the data is still a fixture, and says so. |
| 1.3 | TIS vs AIS, and the difference | **Built** | The AIS page shows two tiles. TIS columns: `Information Category` / `Processed by System` / `Accepted by Taxpayer`. Narration: *the information is same in both, only the presentation is different.* Nothing on the portal says so; our panel does, in as many words. |
| 1.4 | `Download Pre-Filled Data` | **Missing** | A separate menu item. |
| 1.5 | `View Form 168` (Income Tax Act 2025) | **Missing** | Present in the menu; out of scope for salaried, but its existence is part of the map. |
| 1.6 | Form 16 Part A vs Part B | **Built** | We name Form 16 rows. The video spends 34-62 s on the document itself: Part A quarterly TDS, Part B salary bifurcation, gross salary, perquisites, exemptions, standard deduction. |

**The user's point, confirmed — and now fixed.** The portal assumed you know what Form 26AS is, and so did we. Nothing on either screen said what it was, why there were three documents, or how they differed.

`Your documents` on the start screen now names all four — Form 16, Form 26AS, AIS, TIS — with what each is, who produces it, how to get it, what this return uses it for, and whether this prototype actually asks you for it. Under it, `How these check each other` states the four cross-checks, including the one nothing on the portal says: **AIS and TIS carry the same information and differ only in presentation.**

### Stage 2 — Working out which form you file

| # | Portal thing | Ours | Notes |
|---|---|---|---|
| 2.1 | Assessment Year select + **Mode: Online / Offline** | **Missing** | We never ask; we assume online. |
| 2.2 | **Resume Filing vs Start New Filing** | **Thin** | We resume a draft, but the portal makes this an explicit screen with a saved-draft table (`Assessment Year` / `Saved On` / `Action(s)`). |
| 2.3 | `Select Status`: Individual / HUF / Others | **Missing** | |
| 2.4 | `Select ITR Form`: know it / **help me decide** / pick from list | **Missing** | |
| 2.5 | **`Help me select ITR` — the 6-section wizard** | **Built** | Was the largest single gap. Detailed below. |
| 2.6 | Filing-reason screen with the Seventh-proviso checkboxes | **Thin** | We state one reason as decided. The portal asks, and the second option opens four checkboxes. |
| 2.7 | Pre-fill disclaimer modal | **Missing** | Modal, red text, single `OK`. |
| 2.8 | Result page for the chosen form | **Missing** | Full eligibility text, a 3-step map, `Let's Get Started`, `Documents list to help you file faster`, and an FAQ block. |
| 2.9 | Breadcrumb | **Missing** | `Dashboard > e-file > Income Tax Return > Select Status > Select ITR Form > Help me select ITR > ITR > Return Summary > <section>`. Nine levels deep by the end. |
| 2.10 | `Session Time 14:58` countdown | **Missing** | Counts down in the masthead on every screen. |

#### 2.5 in full — the eligibility wizard, 3:28 to 4:32

Six numbered sections in a stepper, ticked as completed. `Back` and **`Skip Questions`** on each. Standing note: *This facility is solely for informative purposes and has been offered with the objective to assist taxpayers to file the returns. It does not constitute legal advice in any manner whatsoever.*

**1 Residential Status**
- Please provide your residential status in India during the Financial Year 2025-26? — `Resident and Ordinarily Resident (ROR)` / `Resident but Not Ordinarily Resident (NOR)` / `Non-Resident (NR)` / `Don't Know`
- Derived statement: *Based on the responses, you are Resident and Ordinarily Resident in India during the period 1 April 2025 to 31 March 2026*
- Do you have LTCG u/s 112A more than Rs 1,25,000 — Yes / No

**2 General Information**
- Whether you were a Director in a company in India or outside India at any time during the period 01 April 2025 to 31 March 2026?
- Whether you held equity shares in a company which is not listed in India or outside India at any time during the period?
- Are you governed by Portuguese Civil Code under Section 5A?
- Tax deducted at source u/s 194N?
- Deferred tax on ESOPs received from eligible start-ups?

**3 Business Details**
- Partner in a partnership firm during the period?
- Did you undertake business activities during the period?
- Did you have income from professional service during the period?
- Are you in the business of plying, hiring or leasing of goods carriages?

**4 Income Details**
- Have you sold or transferred any share or mutual fund or any other securities or land or building or any other property or asset?
- How many house properties do you own? — `0` / `Upto 2` / `More Than 2`
- Do you have agricultural income more than Rs 5,000?

**5 Other Sources**
- Income taxable at special rate (lotteries, prizes, gambling winnings, owning and maintaining race horses, etc.)?
- Income from spouse, minor child or any other income clubbed in your income?

**6 Miscellaneous**
- Income from any source outside India or assets outside India, or want to claim relief for double taxation?
- Carry forward of business or trading loss? (Narration: a stock-market or F&O loss cannot be carried forward on ITR-1; that requires ITR-2.)

**Result.** `ITR 1 - (Income Tax Return 1)`, with the statutory eligibility paragraph verbatim, then a three-step map — `1 Validate your Returns breakup (Pre-filled)` → `2 Confirm your Return Summary` → `3 Verify & Submit your Return` — `Back` / `Let's Get Started`, and below it `Documents list to help you file faster` (Form 16, …) beside `Frequently Asked Questions (FAQ)`.

**Why this matters more than its size suggests.** Eighteen questions decide the form. Sixteen are plain yes/no and are answered `No` for an ordinary salaried filer; the other two are a residential-status pick and a count of house properties. Every one is phrased so that you must already understand it to answer it. This is the single clearest instance of the problem our product exists to solve, and we do not model it at all — we just assert `ITR-1 (Sahaj)` and give a one-paragraph reason.

### Stage 3 — The return itself

The portal's `Return Summary` is a **hub**: five cards, each with a running rupee total and its own state (`Provide your confirmation` → `✓ Confirmed` / `Modify if required`). `Proceed To Verification` stays disabled until all are confirmed. A widget in the corner changes as you go — a `00:00` timer at the start, a rocket and `It's good, keep going…` partway through.

| Card | Ours | Gap |
|---|---|---|
| `P Info` Personal Information (Mandatory) | **Thin** | See below. |
| `GTI` Gross Total Income (Mandatory) | **Thin** | Salary only; B2, C3, C3(a) missing. |
| `Tot` Total Deductions (Mandatory) | **Missing** | We never show a deductions section. |
| `TP` Tax Paid | **Thin** | One TDS figure; four schedules and the challan form missing. |
| `Tax Liab` Verify your tax liability details | **Thin** | We compute, but not in the portal's shape. |

#### P Info — Personal Information

| Block | Fields | Ours |
|---|---|---|
| Profile (read-only) | First Name, Middle Name, Last Name, PAN, Date of Birth, Aadhaar Number. `Edit` disabled. | **Missing** |
| Contact | Primary Mobile No. of the taxpayer, Secondary Mobile No., Primary Email ID of the taxpayer, Primary Address, *Is the secondary address same as primary address?*, Secondary Address. `Edit` / `Delete`. | **Missing** |
| Nature of Employment * | Dropdown, `Others` selected | **Thin** — we assert it |
| **Filing Section** | `Filed u/s` toggle → `139(1)` Return filed on or before due date / `139(4)` Belated / `139(5)` Revised / `119(2)(b)` After condonation of delay / `139(8A)` Updated Return. Second toggle `Filed in response to notice u/s` → `139(9)` to rectify the defect / `142(1)` / `148` assessment or reassessment / `153C`. | **Missing** |
| Regime | *Do you wish to exercise the option u/s 115BAC(6) of Opting out of new tax regime? (default is "No")* — Yes = OLD, No = NEW, each with its own explanatory line, plus an `Income Tax Calculator` link | **Thin** — we compare both regimes well, but do not use the portal's question, and our wording is not the portal's |
| Seventh proviso read-back | *Are you filing return of income under Seventh proviso to section 139(1) but otherwise not required to furnish return of income?* — answer shown as `No` with `Edit Response` | **Missing** |
| Representative assessee * | Yes / No | **Missing** |
| **Bank Details** | *Please declare details of all bank accounts held in India at any time during the previous year (excluding dormant accounts)*; warning *Kindly ensure that atleast one bank account is prevalidated for transfer of refund*; per-account card with `Validated` badge and a **`Nominated for Refund`** toggle; `Add Another`; three numbered rules (all accounts except dormant; refund credited to one validated account other than type "Others"; minimum one account selected). | **Missing entirely** — and we promise a refund without ever asking where it goes |

Note the `139(9)` option. Our earlier defective-return work lives in that radio button, and we can now point at exactly where it sits in the real form.

#### GTI — Gross Total Income

`Expand All` / `Collapse All` at the top.

**B1. Income From Salary** — banner *We have pre-filled this value from Form-16/ AIS (Annual Information Statement) wherever applicable*. `Edit` / `Delete`.
- `i. Gross Salary (ia + ib + ic)`
- `ii. Less : Allowances to the extent exempt u/s 10 (Ensure that it is included in salary income u/s 17(1)/17(2)/17(3))`
- `iii. Net Salary (i – ii)`
- `iv. Deductions u/s 16 (iva + ivb + ivc)`
- `v. Income chargeable under the Head 'Salaries' (iii – iv)`

We have these. This is our strongest section and it matches.

**B2. Income from House Property** — **missing entirely**, and currently declared out of scope. Amber banner: *…You are required to provide the breakup in order to consider this amount.* Accordion `Details of Income from House Property` opens a full form:
- Address of property: Address *, Town/City *, State *, Country * (`91-INDIA`), PIN Code, ZIP Code
- Owner of the Property *, *Is the property co-owned (if "YES" please enter following details)* *, Your percentage of share in the Property(%), Type of House property *
- `a.` Gross rent received/receivable/lettable value · `b.` The amount of rent which cannot be realized · `c.` Tax paid to local authorities · `d. Total (1b + 1c)` · `e. Annual Value (1a – 1d) (nil, if self-occupied etc. as per section 23(2) of the Act)` · `f. Annual value of the property owned (own percentage share x 1e)` · `g. 30% of Annual Value (30% *1f)` · `h. Interest payable on borrowed capital` + a `Section 24(b) - Interest on borrowed capital` accordion · `i. Total (1g+1h)` · `j. Arrears/Unrealized rent received during the year less 30%` · `k. Income from house property 1 (1f – 1i + 1j)`
- `B2. Income chargeable under the head 'House Property' (Σ1k) (If loss, put the figure in negative)`, *Note: Maximum loss from house property that can be set-off is INR 2,00,000. To avail the benefit of carry forward and set of loss, please use ITR-2.*
- Footnote: PAN/Aadhaar of tenant mandatory if TDS u/s 194-IB; TAN of tenant mandatory if u/s 194-I

**B3. Income from Other Sources** — its own page: `Nature of Income *` dropdown (`Interest from Saving Bank Account`) + `Amount *` + `Save`. **Ours is better** — we itemise AIS lines and let each be confirmed or disputed, which is the whole point of our product. But we should adopt the portal's `Nature of Income` vocabulary.

**Gross Total Income (B1+B2+B3+C3(a(iii))) (If loss, put the figure in negative)** with the ITR-2 note.

**C3. Exempt Income : For reporting purpose and Income on which no tax is payable** — **missing**. `Add Another` → `Category` / `Sub-Category` / `Amount`. Category example: `Agricultural & related incomes`. `Total Amount`. Narration: keep agricultural income under ₹5,000 or you cannot file ITR-1.

**C3(a). Long Term capital gains u/s 112A not chargeable to Income-tax** — **missing**. `i. Total sale consideration` · `ii. Total cost of acquisition` · `iii. Long term capital gains as per sec 112A`. Narration: exempt up to ₹1,25,000; usually pre-filled but check your broker's report.

#### Tot — Total Deductions

**Missing entirely.** Under the new regime the portal still shows the section, with almost everything at ₹0 — which is itself the teaching moment, and we skip it.
- `80CCD(2) - Contribution to pension scheme of Central Government by employer` — Amount Of Investment / Amount eligible for deduction under section 80CCD(2)
- `80CCH - Contribution to Agnipath Scheme` — with *Note: 80CCH is not allowed for employment category other than 'Central Government'*
- `Any other deduction` — Amount of Investment / Amount eligible
- `C1. Total deductions` — Amount of Deductions claimed

#### TP — Tax Paid

Five collapsible schedules, each with `Add Another`, then `Total Taxes Paid` and `Confirm`.
- `Schedule TDS1 - Details of Tax Deducted at Source from Salary` `[As per Form 16 issued by Employer(s)]` — table columns `Tax Deduction Account Number (TAN) of Deductor (Col 1)` / `Name of Deductor [Col (2)]` / `Income chargeable under Salaries (Col 3)` / `Total tax deducted (Col 4)`. **Thin** — we show one figure, not the table.
- `Schedule TDS2 - Details of Tax Deducted at Source from Income Other than Salary` `[As per Form 16A issued by Deductor(s)]` — **Thin**
- `Sch TDS 3 Details of Tax Deducted at Source` `[As per Form 16C furnished by Payer(s)]` — **Missing**
- `Sch TCS Details of Tax Collected at Source` `[As per Form 27D issued by the Collector(s)]` — **Missing**
- `Advance tax and Self-Assessment tax payments` — **Missing**. Own page: `BSR Code (Col 1) *`, `Date of Deposit (Col 2) *`, `Serial Number of Challan (Col 3) *`, `Tax paid (Col 4) *`, `Save`.

**The e-Pay Tax side-trip** (8:32-9:05) is a whole journey the citizen is sent on mid-return: `e-File → E-Pay Tax` → select `Income Tax Act, 1961` → `New Payment` (methods: Net Banking, Debit Card, Over the Counter, NEFT/RTGS, Payment Gateway) → `Payment History` → download the challan → come back via `Resume Filing` → type the four challan fields in by hand. **Missing.** The portal makes you transcribe a number off a PDF it generated itself, which is an obvious candidate for the same treatment we gave file conversion.

#### Tax Liab — Verify your tax liability details

`Calculation of Your Taxable Income`, then:
- `A. Gross Total Income` — Income Chargeable under the head 'Salaries' / 'House Property' / 'Other Sources' / Long term capital gains as per sec 112A / **Gross Total Income**
- `B. Total Deductions` — the full list printed line by line: 80C, 80CCC, 80CCD(1), 80CCD(1B), 80CCD(2), 80CCH, 80D, 80DD, … each at ₹0 under the new regime
- Interest and fee lines, including `₹ 1,378` for 234A/B/C
- `D6` total tax · `₹ 8,32,619` + `₹ 1,378` = `₹ 8,33,997`
- `Amount Payable/Refund` — `Total Tax Liability` / `Total Taxes Paid (D12(a+b+c+d))` / `Amount payable (D11 – D12) (if D11>D12)` — with `D12(a). Advance Tax` and `D12(b). Self Assessment Tax` above
- Buttons `Pay Later` / `Pay Now`

**Ours is better on the arithmetic** — we show the slab working band by band and compare both regimes, which the portal never does. **Ours is missing** the advance-tax and 234A/B/C interest concept entirely, and the ₹10 rounding rule the narration mentions (*the income tax portal operates on the order of ₹10*).

Narration also supplies the advance-tax schedule, which no screen shows: tax payable over ₹10,000 must be paid by 31 March; instalments 15 Jun 15%, 15 Sep 45%, 15 Dec 75%, 15 Mar 100%; miss them and interest runs from the back date.

### Stage 4 — Submitting

| # | Portal screen | Ours | Notes |
|---|---|---|---|
| 4.1 | `Preview and Submit Your Return` | **Thin** | Declaration: *I, [name], son/daughter of [name], solemnly declare that to the best of my knowledge and belief, the information given in the return is correct and complete and is in accordance with the provisions of the Income Tax Act, 1961.* Then `I further declare that I am making returns in my capacity as` **[Self ▾]**, PAN, `Place *`, `Date`, and a `Tax Return Preparer (TRP)` block. We have a declaration but not the capacity dropdown, the place field or the TRP block. |
| 4.2 | `Internal Validation` — ITR1 — `Validation successful! No errors were found` — `Download JSON` / `Preview` | **Missing** | |
| 4.3 | `Pdf Preview` — the rendered ITR-1 inline — `Download Preview` | **Thin** | We produce a PDF receipt after filing, not a preview before it. |
| 4.4 | `Upload Level Validation` — ITR1 — success — `Download JSON` / `Proceed To Verification` | **Missing** | Two validations, differently named, is itself confusing. |
| 4.5 | **e-Verify** | **Missing entirely** | *Note: Kindly select appropriate mode of verification as prescribed in rule 12(3) of IT Rules.* `How do you want to e-verify?` — OTP on mobile registered with Aadhaar / Digital Signature Certificate (DSC). `Generate electronic verification code (EVC)` — Through Net Banking / Through Bank Account / Through Demat Account. Plus `I already have an Electronic Verification Code (EVC)` and `I already have an OTP on Mobile number…`. Modal: *One time password (OTP) will be sent via text message(SMS) to the number registered with Aadhaar* + `I agree to validate my Aadhaar Details *` → `Generate Aadhaar OTP` / `Cancel`. |
| 4.6 | The 30-day rule | **Missing** | Narration: the return is not valid until verified; 30 days to verify; miss it and the penalty runs from the back date. This is a genuine trap and nothing on screen says it. |
| 4.7 | `View Filed Returns` | **Missing** | `e-File → Income Tax Returns → View Filed Returns`. Grouped by AY, dated timeline per return with green ticks (filed / verified / processed), download per row. |

## The two interface systems the user asked for

Neither exists today. `grep` over `web/app` finds no tooltip, no glossary, no `aria-describedby` outside a modal and a settings hint, and one `title=` attribute in the nav.

### A. A site-wide jargon layer

**The problem, stated exactly.** The portal assumes you know what Form 26AS is. So does ours. Beyond that: AIS, TIS, TDS, TCS, BSR code, challan, 139(1), 139(4), 139(8A), 115BAC(6), 80CCD(2), Section 24(b), 112A, EVC, DSC, prevalidated, dormant account, representative assessee, Seventh proviso, perquisite, standard deduction, assessment year vs financial year. Around forty terms, each of which is a wall.

**The design.**

- Any jargon term is wrapped once, by a shared component, and carries a quiet dotted underline. Not a colour, not an icon — the page must not turn into a field of asterisks.
- Hover **with an open delay of about 500 ms**, exactly as the user described: you are not shown a box because your pointer crossed a word on the way somewhere else. A short close delay (~150 ms) so you can move onto the panel itself.
- A shorter delay when moving between two terms in the same group, so reading several in a row does not feel slow.
- Focus opens it immediately — a keyboard user asked deliberately. `Escape` closes it.
- On touch there is no hover: the term is a button that opens the same content in place.
- Each entry answers three things, in this order: **what it is**, **where you get it**, **why it matters to you**. That third line is what makes it worth building.
- The panel is `role="tooltip"` and wired with `aria-describedby`, so it is read out rather than being a visual-only affordance.
- One glossary file, in both languages, so a term is defined once and every use of it stays consistent. That also makes the coverage checkable in a test.

Worked example:

> **Form 26AS** — Your tax credit statement. It lists every rupee of tax anyone has deducted and paid to the department against your PAN.
> **Where to get it:** e-File → Income Tax Returns → View Form 26AS. It opens the TRACES site.
> **Why it matters:** if your Form 16 says ₹85,000 was deducted and Form 26AS does not, the department has not received it and you cannot claim it.

### B. Step previews on hover

The left rail lists seven steps with a status word. A locked step tells you it is locked and nothing else.

Same mechanism, same delay, different content: hovering a step shows **what that step will ask, what you will need, and roughly how long it takes**. Two to four bullets, no prose. For a completed step it shows what you answered instead, so the rail becomes a way to check your work without navigating away.

This also fixes something the deadline work exposed: a citizen cannot currently tell whether step 5 is going to take thirty seconds or ten minutes, so they cannot decide whether to start.

## What was built, and what is left

Ranked by how much of the real problem each removes, not by size. Tiers 1 to 3 are done.

### Tier 1 — the two interface systems · **done**

**The jargon layer.** `app/glossary.ts` holds 60 terms in English and Hindi, each answering the same three questions in the same order: what it is, where you get it, why it matters to you. That third line is the reason the file exists — a definition that does not name the mistake it protects you from is not worth interrupting someone to read.

Terms are marked up in the copy rather than placed by hand in JSX. `content.ts` carries `[[form-26as]]`, or `[[tds|the tax your employer deducted]]` where the sentence needs different words, and `app/components/Prose.tsx` renders it. That keeps English and Hindi structurally independent, and makes coverage testable: `tests/glossary.test.tsx` scans every copy file and fails if a marker names a term that does not exist, so a typo is a red test rather than a literal `[[frm-16]]` on screen.

`app/components/Hovercard.tsx` is the mechanism, and the delays are the whole point:

| | |
|---|---|
| Open, cold | 500 ms — a pointer crosses many words on its way to a button |
| Open, warm | 150 ms — once you have opened one you are reading, not travelling |
| Warm window | 900 ms after the last card closes |
| Close | 160 ms — long enough to move onto the panel and read it |
| Focus | Immediate — a keyboard user asked deliberately |

One card is open at a time. `Escape` closes. The panel is `role="tooltip"`, wired with `aria-describedby`, portalled to the body so no ancestor's overflow can clip it, and it follows its term when the page scrolls.

**Step previews.** The rail's steps use the same mechanism with different contents: what the step will ask, what you need, and roughly how long it takes. Locked steps are now `aria-disabled` rather than `disabled`, because a disabled button takes neither hover nor focus — and a step you cannot reach yet is exactly the one whose preview is worth reading. The click is still refused.

### Tier 2 — the eligibility wizard · **done**

All eighteen questions, in the portal's own words, grouped into its six numbered sections. We do not ask them again: `app/eligibility.ts` answers each from a record the department already holds and shows which record, and `decideForm` turns the answers into a form. Sections start collapsed, so it is six lines rather than eighteen; any answer can be changed; and a section holding an answer that changed the outcome is forced open and says so.

`decideForm` works on ids and values only, so English and Hindi cannot reach different conclusions — pinned by a test.

The form name now has one source. Before this, the margin and the decided-for-you row printed a fixed `ITR-1 (Sahaj)` and would happily contradict a wizard answer the citizen had just changed.

### Tier 3 — the documents · **done**

`Your documents` on the start screen. Described above.

### Tier 4 — the sections the return was missing · **done**

The original plan here was to restructure our seven linear steps into the portal's five confirmable cards. That was dropped deliberately. The hub suits someone who already knows what a return contains and wants to fill it in any order; a first-time filer is better served by a line. So the portal's **coverage** was added inside our shape rather than the portal's shape being copied.

**Personal Information**, on step 1. `app/personal-section.ts` and `app/components/PersonalSection.tsx`.

- **Filing section.** The portal opens with a toggle and nine radio buttons and expects you to know which is yours. `filingSectionOn(today)` derives it: `139(1)` on or before 31 July 2026, `139(4)` through the belated window, `139(8A)` after it — importing the statutory dates and repeating the IST-midnight arithmetic the deadline meter already uses, so a server in UTC cannot disagree with the citizen's calendar. The other four are readable without being choices. The four notice sections sit in a recessed panel marked as not applying, with the state word placed *above* the group name, because that group's own description — *you are filing because the department asked you to* — is a false claim about this citizen if it is read first.
- **Representative assessee**, shown rather than asked.
- **Bank details.** Accounts with a `Validated` state carried by a word, and a radio group for where the refund goes. Until now this prototype told a citizen their refund and never asked where to send it.

**Total Deductions and Tax Paid**, on step 4, beside the regime choice — because the regime is what decides whether a deduction is worth anything, and the two together are the halves of the refund figure that arrives at step 6. `app/tax-paid.ts` and `app/components/TaxPaidSection.tsx`.

- **Deductions.** Every line comes out at ₹0 under the new regime, and the portal never says why. There are two reasons a line can be zero and they mean opposite things, so each row says which: *not in this regime* or *you have none*. With no regime chosen yet the figure defers rather than guessing.
- **The five schedules.** TDS1, TDS2, TDS3, TCS and Advance/Self-Assessment, with the portal's column names. An empty schedule says what would put a line in it rather than printing "None".

**The disputed credit.** The Trilok Bank line — ₹31,500 with ₹3,150 deducted — appears on no schedule, and TDS2 says why. Claiming a credit while leaving its income out is the exact mismatch that produces a defective return, so the schedules reconcile with what the engine will actually claim rather than with what the statement reported. `tests/tax-paid.test.ts` pins it: every rupee printed across TDS1 and TDS2 sums to `claimableTds()` exactly, and the stranded ₹3,150 appears nowhere.

Two accessibility decisions here went the opposite way to the step rail's, and both are right:

- **The unvalidated account's radio is genuinely `disabled`**, not `aria-disabled`. A radio group is arrow-navigated, and arrowing onto a member selects it, so an advisory state would silently nominate an account no refund can reach. The reason is given in words and wired with `aria-describedby`.
- **The stacked ledgers carry explicit `role="table"` and friends.** Restacking a four-column table for a 320-pixel screen means `display: block`, which removes a table's implicit roles from the accessibility tree. Putting them back is the documented mitigation. `jsx-a11y/no-redundant-roles` objects because on an unstyled table the role *is* redundant — it cannot see the stylesheet — so the disable is scoped to that one rule and says why. The `data-label` generated content is a visual affordance, not the accessibility story.

### Tier 5 — the submission chain · **outstanding**

Preview with capacity and place, internal and upload validation, PDF preview before filing rather than only after, e-verify with its five routes, and the 30-day warning. The 30-day rule is a genuine trap that nothing on the portal states on screen.

### Tier 6 — the rest · **outstanding**

House property, exempt income, LTCG 112A, advance tax and challan entry, e-Pay Tax, View Filed Returns.

## Two defects the browser caught that the unit tests did not

Both are recorded because they are the same class of mistake — a thing that passes in jsdom and fails in front of a person.

1. **The card closed itself on the way in.** Closing on any scroll seemed right. But tabbing to a term below the fold makes the browser scroll it into view, and that scroll lands *after* the focus, so the card opened and instantly shut. It now follows its term and only gives up when the term leaves the viewport.

2. **The jargon layer switched itself off.** A `(hover: none)` media query was used to decide whether to wire the pointer handling at all. Headless Chrome answers `hover: none` with no fine pointer, so nothing opened on hover anywhere — and the same is true of any environment that misreports. There is no device branch now: hover and click are both always live. A device that cannot hover simply never fires `mouseenter`, which costs nothing, and tapping a term works everywhere rather than only where a media query says so.

## Verification

| Check | Result |
|---|---|
| `npm test` — unit tests, production build, server-rendered page | 135 tests, pass |
| `npm run test:reflow` — 8 steps x 2 languages x {320, 360} plus 3 site screens | No horizontal overflow |
| `npx eslint app tests scripts` | Clean |
| `npx tsc --noEmit` | No new errors |
| `scripts/shoot-hovercard.mjs` — hovercards driven by real pointer events in Chrome | Panels open; at 320px the panel sits at 12-308 in a 320 viewport with zero document overflow |
