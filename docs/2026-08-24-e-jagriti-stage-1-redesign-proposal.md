# e-Jagriti Stage 1 redesign proposal

Created: 2026-08-24 02:37 IST (UTC+05:30)

Last updated: 2026-08-24 02:58 IST (UTC+05:30)

Status: proposed build scope for the 28 August 2026 submission

Working product name: Nivaran

## Decision

Build an independent filing-preparation companion for one e-Jagriti journey:

> A self-represented consumer with a small e-commerce dispute can explain what happened in ordinary language, verify the facts extracted from their evidence, fix missing information, and receive a complete reviewable filing pack without first learning court-style document formats.

The prototype ends with a clearly simulated submission to a fictional District Consumer Commission and a synthetic receipt. It does not create an e-Jagriti account, verify an identity, take payment, transmit a complaint, or query a government record.

This proposal narrows and operationalises the existing [product plan](2026-08-24-e-jagriti-product-plan.md). Its evidence base is the [current-state journey map](2026-08-24-e-jagriti-current-state-journey-map.md).

## Why this is worth showing in a hackathon

The current portal's visible interface can be made cleaner, but cleaner forms alone will not solve the citizen's hardest problem. The person is expected to arrive with an index, proforma, synopsis and dates, memo of parties, complaint with notarised affidavit, annexures, and sometimes other legal documents. The official FAQ says the person should contact the relevant Commission for exact accepted formats.

Nivaran demonstrates a more valuable transformation:

```text
One ordinary account of a purchase problem
  + a small set of evidence
  + citizen-confirmed facts
  -> one consistent legal record
  -> one versioned filing pack
  -> one readiness decision the citizen can understand
  -> one honest simulated submission receipt
```

This is visually strong in a one-minute demo, technically credible, and tied to a real cost. It reduces repeated entry, inconsistent dates, missing seller details, unexplained document names, and uncertainty before submission.

### What the authenticated walkthrough changed

The signed-in review strengthens the selected scope rather than expanding it. It confirmed that the live citizen workspace branches into filing, payment, reply, rejoinder, subsequent filing, Vakalatnama, case-number lookup, and technical support. It also confirmed that the first Consumer Complaint screen presents eight required upload categories before the citizen enters the case form.

Nivaran should therefore demonstrate depth in preparation and handoff, not imitate the whole authenticated sidebar. The synthetic receipt will explain the real next states in plain language, while reply, rejoinder, payment, case lookup, Vakalatnama, and live ticketing remain outside the build.

## Primary user and supported case

The primary user is an adult consumer filing without an advocate who:

- bought a product online;
- paid less than Rs 50,000 in the prototype scenario;
- has an invoice and at least one record of contacting the seller;
- faces non-delivery, a defective item, or an item materially different from the description;
- wants a refund or replacement;
- uses an entry-level Android phone or shared computer; and
- may prefer conversational Hindi to legal English.

The prototype scenario uses only fictional data:

- citizen: Priya Sharma;
- seller: AcmeCart Private Limited;
- product: fictional smartphone;
- amount: Rs 8,999;
- issue: defective display;
- evidence: synthetic invoice, delivery message, support-chat screenshots, and product photo;
- destination: Mock District Consumer Commission; and
- reference: `DEMO-CC-2026-0042`.

The amount is a product boundary, not a legal jurisdiction claim.

## Explicitly unsupported cases

The product must stop early and explain the limitation when a case involves:

- services, real estate, insurance, medical negligence, banking, travel, or product-liability analysis;
- more than one consumer or more than one opposite party;
- an appeal, execution, review, revision, transfer, caveat, or interim application;
- a disputed limitation period;
- a request for jurisdiction advice;
- a claim that requires assessing liability or predicting outcome;
- a real identity, payment, OTP, Commission, filing, or case record; or
- a user who lacks the minimum evidence for the supported synthetic path.

An unsupported user receives an official-resource handoff. They are never pushed through a template that does not fit.

## Product principles

1. Start from the consumer's problem, not a case-type code.
2. Ask once and reuse confirmed facts everywhere.
3. Show where every drafted fact came from.
4. Separate blockers from useful suggestions.
5. Keep legal decisions outside the model.
6. Make the mock boundary visible before the user relies on a result.
7. Design the main path for a small phone and intermittent network first.
8. Give the citizen a useful pack even if simulated submission is unavailable.

## Proposed main journey

The build has eight stages. Every stage must work before optional features are added.

| Stage | Citizen action | Nivaran response | Proof that the stage is complete |
|---|---|---|---|
| 1. Check whether this path fits | Choose what was bought, what went wrong, amount, purchase channel, and approximate date | Confirms the supported path or stops with a clear limitation | Supported-case summary with source date and prototype label |
| 2. Tell the story | Answer short questions about order, delivery, defect, seller contact, and desired remedy | Saves answers and builds a plain event timeline | Saved draft and visible timeline |
| 3. Add evidence | Upload synthetic invoice, messages, and photo | Shows upload progress, previews, labels, and retry | Evidence checklist with every file accounted for |
| 4. Verify facts | Confirm or correct extracted seller, amount, order number, and dates beside their sources | Stores only confirmed values in the filing record | Every required fact is confirmed or marked missing |
| 5. Identify the seller | Review legal seller name and address taken from user-provided evidence | Explains why the party details matter and flags missing address | Seller record is confirmed or a blocking issue is shown |
| 6. Check readiness | Open a single list of blockers and recommendations | Links each issue to the exact answer or file that fixes it | No unresolved blocker for the synthetic case |
| 7. Review and prepare pack | Review plain summary, formal sections, and annexure mapping | Generates the versioned pack from one fact record | Citizen-approved previews for every supported document |
| 8. Submit simulation | Confirm the mock declaration and submit | Simulates one recoverable timeout, prevents duplication, and issues a fake receipt | Synthetic reference, timestamp, status, and next-step explanation |

## Proposed screen inventory

### 1. Task start page

Route: `/file-a-product-complaint`

The first screen says:

- what problem the prototype supports;
- what it does and does not do;
- expected time to complete;
- evidence to have ready;
- that English and Hindi are available;
- that all data and submission are synthetic; and
- that no government record will be created.

Primary action: `Check whether my complaint fits`

Secondary actions: `See what I need` and `Use the guided demo`

Do not require login before the user understands the value.

### 2. Fit check

Ask one main question per mobile screen:

1. What did you buy?
2. Where did you buy it?
3. What went wrong?
4. About how much did you pay?
5. When did the problem happen?
6. Do you have an invoice or order record?
7. Did you contact the seller at least once?

The supported result explains the boundary in plain language. An unsupported result names the exact reason and links to official e-Jagriti or Consumer Helpline guidance without claiming that either route guarantees relief.

### 3. Story builder

The story builder asks:

- What did you order?
- When did you order and receive it?
- What was wrong with it?
- When did you first tell the seller?
- What did the seller say or do?
- What do you want now?

Each answer creates or updates an event card. The timeline remains visible in a compact form so the citizen can spot a wrong date early.

The screen shows `Saved on this device at [time]`, `Waiting to sync`, or `Saved to demo` as distinct states. Refresh and Back must preserve completed answers.

### 4. Evidence inbox

Use three named slots rather than a generic upload wall:

- Purchase proof, such as invoice or order confirmation.
- Seller contact, such as email, support chat, or complaint reference.
- Problem proof, such as product photo or delivery evidence.

Before file selection, show accepted type, maximum size, and a short quality example. The prototype should accept its exact synthetic fixtures and reject a wrong type with a tested message.

Each uploaded file has:

- original filename;
- citizen-facing label;
- type and size;
- preview;
- upload or local state;
- Replace;
- Remove; and
- Retry when interrupted.

Original evidence remains unchanged. OCR text, thumbnails, and crops are derivatives with separate identifiers.

### 5. Verified fact ledger

This is the signature interaction in the demo.

Show each candidate fact beside the exact evidence region that supports it:

| Fact | Example | Source behavior |
|---|---|---|
| Seller name | AcmeCart Private Limited | Show invoice crop and require confirmation. |
| Order number | AC-48291 | Show invoice crop and require confirmation. |
| Amount paid | Rs 8,999 | Show invoice crop and require confirmation. |
| Order date | 12 August 2026 | Show invoice crop and require confirmation. |
| Delivery date | 15 August 2026 | Show message crop and require confirmation. |
| First seller contact | 16 August 2026 | Show chat crop and require confirmation. |
| Requested remedy | Refund | Source is the citizen's direct answer, not model inference. |

Each fact has value, source, confidence, confirmation state, and last edit. Low confidence is written in text. Color is never the only cue.

The model may suggest. The citizen decides.

### 6. Seller and party check

The current portal hides a difficult question inside a long party form. Nivaran gives it a focused step.

Show:

- consumer name and synthetic contact card;
- seller trading name;
- seller legal name;
- seller address;
- where each value was found; and
- why a serviceable opposite-party address matters.

If the legal name or address is missing, show a blocker:

> We could not find a seller address in the files you added. Check your invoice, order details, seller terms, or a notice you already received. We will not guess this address.

Offer `Add it myself`, `Show where to look`, and `I cannot find it`. The last route explains that the prototype cannot prepare a ready pack and gives an official contact step.

Do not scrape a marketplace, company registry, private API, or government system during the hackathon.

### 7. Filing readiness check

Use two groups:

#### Must fix before pack preparation

- missing seller legal name or address;
- missing purchase proof;
- unconfirmed amount or order date;
- missing requested remedy;
- inconsistent dates;
- unsupported case complexity; and
- failed or unreadable required upload.

#### Worth reviewing

- seller contact screenshot has no visible date;
- product photo is unclear;
- citizen has no record of the seller's response; and
- an optional event could make the chronology clearer.

Each item links directly to the answer or upload. Deterministic rules decide whether the prototype is ready. No model score can override a missing required field.

### 8. Complaint review

Start with a one-screen plain summary:

- what was purchased;
- what went wrong;
- timeline;
- consumer and seller;
- remedy requested; and
- evidence count.

The formal view then exposes editable sections:

- parties;
- facts and chronology;
- complaint grounds in the fixed prototype template;
- requested remedy; and
- annexure mapping.

Every major factual sentence has a source reference. Editing one confirmed date updates the synopsis, list of dates, complaint, and annexure references together. A `What changed?` view is optional and should be cut if the main journey is not stable.

### 9. Filing pack

Generate these supported outputs:

1. Index.
2. Filing proforma.
3. Synopsis and list of dates.
4. Memo of parties.
5. Consumer complaint draft.
6. Affidavit checklist and synthetic draft.
7. Annexure list.
8. Synthetic annexures or labelled placeholders.

Each output shows:

- `Independent prototype`;
- `Synthetic data`;
- Mock District Consumer Commission;
- template version;
- creation date;
- source references for drafted facts;
- actions still required, such as signature or notarisation; and
- a warning to verify current requirements with the relevant Commission.

Do not generate a Vakalatnama for a self-represented consumer. Do not say the affidavit is sworn, signed, or notarised.

### 10. Mock declaration and receipt

Primary action: `Submit simulated complaint`

Before the action, the citizen acknowledges:

- the information has been reviewed;
- the destination is fictional;
- no real complaint or payment will be created; and
- the output is not legal advice or a guarantee of acceptance.

The first attempt may demonstrate a recoverable connection timeout. The draft remains saved and the button becomes `Try simulated submission again`. A second tap while a request is pending must not create a duplicate.

The receipt contains:

- reference `DEMO-CC-2026-0042`;
- state `Simulated submission received`;
- date and time;
- mock Commission;
- pack version;
- what would happen next in a real process;
- what remains outside Nivaran; and
- a prominent statement that no government transaction occurred.

## Current flow versus proposed flow

| Current e-Jagriti behavior | Proposed Nivaran behavior | User value |
|---|---|---|
| Registration and identity completion appear before the filing value is visible | Explain scope and run the synthetic demo before any identity step | A person understands the task before sharing sensitive data. |
| User selects Consumer Complaint from legal case types | User selects the purchase problem in plain language | Reduces wrong-route anxiety. |
| Case details ask for paid consideration, claim amount, cause of action, category, and subcategory | Short story questions create the formal fields only from confirmed answers | Removes legal vocabulary from the main interaction. |
| Opposite-party details appear inside a large combined form | Seller legal name and address receive a dedicated readiness step | Makes a common blocker visible early. |
| Additional and proforma party stages appear in the standard flow | One consumer and one seller are the explicit limit | Keeps the product complete and honest. |
| User prepares and uploads separate legal documents | One confirmed fact record generates a consistent pack | Cuts duplication and document drift. |
| Exact formats require Commission contact | Prototype supports one named template version and shows its boundary | Makes the demo finishable without pretending to solve national variation. |
| Upload areas are generic and file rules vary | Named evidence slots show rules, progress, preview, and retry | Improves mobile and weak-network recovery. |
| Reversion happens after registry scrutiny | Readiness check catches the supported prototype's deterministic gaps before submission | Prevents avoidable failure. |
| Dashboard splits the lifecycle across draft, scrutiny, payment, conversion, and post-filing destinations | Receipt names the next likely state, its owner, and the citizen's next action | Makes filing feel like the start of a trackable process rather than the end of a form. |
| Signed-in tickets accept technical issues only | In-task help resolves content questions and labels the synthetic support handoff | Avoids presenting a technical helpdesk as legal or case support. |
| A filing reference proves submission | A synthetic receipt proves only a simulated submission and explains real next stages | Preserves the useful artifact without misleading judges. |

## Addressing the identity-proof problem

The current profile menu has 21 identity-proof types but no Aadhaar option, despite the March 2025 guide naming Aadhaar as an example. This is a real service-content problem, but it should not become Nivaran's primary feature.

Stage 1 treatment:

- use a fictional pre-completed profile in the demo;
- show a short production note that accepted identity proofs must be listed before registration;
- include an `I do not have one of these` assisted route in the production concept;
- never collect or display a real PAN, Aadhaar, passport, licence, voter card, or bank passbook; and
- record the stale-guide finding in the current-state research.

The hackathon value remains complaint preparation. A broad identity redesign would consume time without producing the filing pack that proves the main outcome.

## Information model

One confirmed record drives every screen and document.

```text
Draft
  profile: synthetic consumer and address
  purchase: item, channel, amount, order number, dates
  dispute: issue, seller contacts, response, requested remedy
  seller: trading name, legal name, service address
  events: ordered citizen-confirmed timeline
  evidence: originals, derivatives, labels, upload state
  facts: value, source, confidence, confirmation, last edit
  readiness: blockers, recommendations, rule version
  pack: template version, generated sections, citizen approval
  submission: simulated state, idempotency key, receipt
```

The same fact identifier is referenced by the timeline, complaint text, and annexure list. This makes an edit traceable and keeps outputs consistent.

## AI role and limits

### AI may

- extract candidate facts from synthetic invoices and screenshots;
- turn confirmed events into a draft chronology;
- suggest a plain summary using only confirmed facts;
- help label evidence;
- answer from a small, versioned collection of official guidance; and
- produce a draft Hindi rendering that a fluent reviewer approves before release.

### AI must not

- decide jurisdiction, limitation, liability, admissibility, or likely outcome;
- invent a seller, address, amount, date, contact, or remedy;
- turn an unconfirmed extraction into a filed fact;
- give broad legal advice;
- change the user's requested remedy silently;
- submit or transmit anything; or
- answer from model memory when a current official source is unavailable.

### Deterministic checks

Rules, not the model, verify:

- supported dispute type;
- amount within the prototype boundary;
- one consumer and one seller;
- required confirmed fields;
- date order consistency;
- accepted fixture file types and sizes;
- required evidence presence;
- seller-address presence;
- pack template version;
- mock declaration; and
- duplicate simulated submission prevention.

## Mobile, access, language, and weak-network behavior

### Mobile

- One main question or one coherent group per screen.
- No horizontal scroll at 320 CSS pixels.
- Touch targets at least 44 by 44 CSS pixels.
- Camera capture and file selection both available where supported.
- Sticky Continue only when it does not cover errors or help.

### Accessibility

- Semantic headings, labels, controls, progress, and landmarks.
- Full keyboard operation with visible focus.
- Errors beside the field and in an announced summary.
- Saved state, upload progress, and submission state announced without stealing focus.
- Screen-reader, 200 percent zoom, touch, and reduced-motion checks across the whole main route.
- Plain HTML summaries for every generated document, with accessible PDFs as an output goal.

### Language

- Complete English and Hindi routes, including errors, help, receipt, and mock warnings.
- English legal-document output disclosed before the journey begins.
- High-impact Hindi text reviewed by a fluent person.
- Names, addresses, dates, and amounts remain editable and are never silently transliterated.

### Weak networks and shared devices

- Save after each answer.
- Distinguish saved on device, queued, and saved to demo.
- Preserve text through refresh and a forced connection drop.
- Preserve the selected fixture and show Retry after interrupted upload.
- Keep the core task usable before optional assistant code loads.
- Provide `Clear this demo from this device` and explain what it removes.
- Produce a small printable receipt.

## Help that stays with the task

Every difficult step has a visible `Help with this step` action. `Ctrl+K` or `Cmd+K` may open the same help panel for experienced users, but it is never the only route.

Help can:

- explain the current question;
- show a valid synthetic example;
- answer why the information is needed;
- jump to a missing answer or evidence file;
- cite an official source and review date; and
- create a synthetic support request when content is insufficient.

The support simulation issues a fake reference and previews the safe diagnostic context it would send. It does not claim that a human helpdesk received anything.

## Mock inventory

| Item | Stage 1 treatment | Production dependency |
|---|---|---|
| Consumer identity and contact | Fictional | Approved identity and account system |
| OTP and login | Omitted or simulated | Approved authentication provider |
| Address and identity proof | Synthetic | Protected profile data and current identity policy |
| Seller and order | Fictional | Citizen-provided and verified records |
| Invoice, chats, and photo | Synthetic fixtures | Secure upload, scanning, retention, and deletion |
| Fact extraction | Model over fixtures only | Approved model service and data controls |
| Rules and templates | Fixed prototype version | Commission-owned template and rule registry |
| Affidavit and notarisation | Checklist and synthetic draft | Citizen action and accepted legal process |
| Commission | Mock District Consumer Commission | Authoritative directory and routing rules |
| Fee and payment | No fee or clearly simulated | Current fee rules and approved payment service |
| Submission | Simulated | Documented and approved e-Jagriti integration |
| Reference and status | Synthetic | Case-management system |
| Notifications | On-screen preview only | Approved SMS or email service and consent |
| Support request | Synthetic | Staffed helpdesk with service targets |

## Production service outline

The proposal should show how a real department-owned version could work without claiming that the hackathon build is ready for government use.

```text
Citizen web application
  -> approved authentication and consent
  -> encrypted draft and evidence store
  -> malware and file validation
  -> source-linked extraction service
  -> confirmed fact record
  -> deterministic readiness rules
  -> Commission-owned template registry
  -> accessible document renderer
  -> approved e-Jagriti submission adapter
  -> payment, notification, support, audit, and monitoring services
```

The department would need to own template publication, rule updates, language review, Commission contacts, accessibility conformance, support operations, data retention, security review, approved integrations, incident response, and public status metrics.

No production architecture should depend on scraping the portal or calling an undocumented private API.

## Build priority

### Must work in the public submission

1. Independent-prototype and synthetic-data labels.
2. Supported-case check and one unsupported branch.
3. Story capture with saved state.
4. Three synthetic evidence uploads with preview and retry.
5. Source-linked fact verification.
6. Missing seller address blocker and recovery.
7. Plain complaint review.
8. Versioned filing-pack previews.
9. Simulated final submission with duplicate prevention.
10. Synthetic receipt with real next-stage explanation.
11. Responsive main route.
12. English and Hindi main journey.

### Add only after the main route is stable

- Control K help shortcut;
- synthetic support ticket;
- data-saver setting;
- print-friendly review;
- `What changed?` after an edit;
- voice input; and
- a second upload failure example.

### Explain but do not build

- real registration and identity proof;
- live Commission template publishing;
- payment;
- notarisation or signing;
- submission or case tracking;
- respondent, reply, rejoinder, hearing, and order workflows;
- advocate and assisted-access roles;
- more languages;
- staff dashboard; and
- open community forum.

## Acceptance criteria

The Stage 1 prototype is done only when:

- a signed-out reviewer can open and finish it;
- the supported fictional complaint reaches a generated pack and receipt;
- every visible feature in the demo works;
- the first screen makes the prototype and mock boundary clear;
- an unsupported case stops before uploads;
- a missing seller address blocks readiness and links to a fix;
- a low-confidence extraction requires confirmation;
- a wrong file type and interrupted upload have tested recovery;
- refresh and Back preserve completed answers;
- one simulated timeout preserves the draft;
- repeated submission does not create a second reference;
- no screen needs horizontal scrolling at 320 CSS pixels;
- the route works by keyboard and passes a screen-reader smoke test;
- English and Hindi cover the same main path, errors, help, and receipt;
- no real credential, identity, OTP, document, payment, or government record is used;
- the receipt explains Draft, Scrutiny, Reverted, Payment Pending, and case-number allocation in plain language without promising a live status; and
- the receipt states that no government transaction occurred.

## Outcome measures for user testing

Test with at least five people using the synthetic scenario.

| Measure | Target for the prototype |
|---|---|
| Understands the product after the start page | 5 of 5 can explain it in their own words |
| Completes without spoken help | At least 4 of 5 |
| Distinguishes suggestion from confirmed fact | 5 of 5 |
| Finds and fixes the seller-address blocker | At least 4 of 5 |
| Understands what the pack contains | At least 4 of 5 |
| Understands that submission is simulated | 5 of 5 |
| Recovers from the defined upload failure | At least 4 of 5 |
| Identifies the next real-world step from the receipt | At least 4 of 5 |

Record device, browser, viewport, network profile, language, task time, errors, assistance, result, and issue. Do not collect unnecessary participant details.

## One-minute demo

1. Priya selects `The product is defective` and passes the fit check.
2. She adds a synthetic invoice and two support-chat screenshots.
3. Nivaran extracts the order number, seller, amount, and dates beside their sources.
4. Priya corrects one low-confidence date.
5. Readiness flags the missing seller address.
6. Priya finds and confirms the address from the synthetic invoice.
7. Nivaran shows the plain complaint summary and generated filing pack.
8. Priya selects `Submit simulated complaint`.
9. A recoverable timeout keeps the draft.
10. Retry produces `DEMO-CC-2026-0042` and states that no real filing occurred.

The second minute should explain the fixed template, confirmed fact record, deterministic checks, narrow AI role, synthetic data, accessibility and weak-network tests, and the approved-integration boundary for a production service.

## Main risks and controls

| Risk | Control |
|---|---|
| Generated legal text is wrong | Support one narrow case, use fixed templates, link every fact to a source, and require citizen review. |
| User thinks the complaint was filed | Label the mock before the action, name the destination Mock District Consumer Commission, and repeat the warning on the receipt. |
| AI invents a seller address or date | Store only citizen-confirmed values and fail readiness when a required fact is absent. |
| Commission formats differ | Support one synthetic Commission and one template version. Explain the production registry. |
| Identity-proof issue consumes the project | Use a fictional profile and keep identity redesign in the production note. |
| Upload failure ruins the demo | Use small fixture files, preserve state, and test retry. |
| Hindi drifts from English | Keep strings together and require fluent review of the whole main route. |
| Features crowd out completion | Cut voice, data-saver, change view, and support ticket before cutting the pack, readiness check, or receipt. |
| Product appears to give legal advice | Use plain process guidance, cite official sources, and refuse legal conclusions. |
| Live-system rules are breached | Use no live account, identity, payment, submission, scraping, or undocumented API in the prototype. |

## Immediate implementation decisions still needed

Before application code is started, record:

1. The exact technology stack and why it meets mobile, accessibility, public-link, and deadline needs.
2. The synthetic District Commission and template version used by the pack.
3. The final fixture file types and size limits.
4. The local draft retention period and clear-data behavior.
5. The exact OpenAI task and evaluation set.
6. The Hindi reviewer.
7. The hosting target and signed-out test procedure.
8. The smallest set of pack fields that can be supported without a legal judgment.

Do not add a framework, model, database, or deployment target to the README until that decision is made and recorded.

## Sources

- [Current-state e-Jagriti journey map](2026-08-24-e-jagriti-current-state-journey-map.md)
- [Confirmed e-Jagriti product plan](2026-08-24-e-jagriti-product-plan.md)
- [Government digital-service research guide](2026-08-24-government-digital-service-research-guide.md)
- [Government service quality checklist](2026-08-24-government-service-quality-checklist.md)
- [Build What Moves India builder brief](https://buildwhatmovesindia.com/brief)
- [Build What Moves India FAQ](https://buildwhatmovesindia.com/faq)
- [e-Jagriti FAQ](https://e-jagriti.gov.in/faq)
- [e-Jagriti help documents](https://e-jagriti.gov.in/help-docs)
- [Consumer Complaint filing guide, March 2025](https://e-jagriti.gov.in/static/media/CC_Filing.34e0fc5dd03b1d864cab.pdf)
- [Consumer Complaint flow diagram, April 2025](https://e-jagriti.gov.in/static/media/CC_Flow.ff32ae9d2008d2eb0fc2.pdf)

Portal behavior, accepted formats, fee rules, and Commission practices can change. Recheck official material before implementation decisions and submission.
