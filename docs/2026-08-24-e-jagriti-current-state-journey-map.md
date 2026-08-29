# e-Jagriti current-state citizen journey map

Created: 2026-08-24 02:37 IST (UTC+05:30)

Last updated: 2026-08-24 02:58 IST (UTC+05:30)

Status: research baseline for the Stage 1 hackathon build

## Purpose

This document maps the part of e-Jagriti that matters to the confirmed hackathon direction: a self-represented consumer preparing and filing a consumer complaint. It covers discovery, account onboarding, complaint preparation, filing, payment, acknowledgement, and the immediate post-filing lifecycle.

It is not a complete map of every e-Jagriti role or case type. Advocate, company, Commission, judge, member, appeal, execution, transfer, caveat, and internal Commission operations are recorded only where they explain the consumer journey.

The companion [Stage 1 redesign proposal](2026-08-24-e-jagriti-stage-1-redesign-proposal.md) turns these findings into a buildable prototype scope.

## Research boundary and evidence

The map uses four evidence levels:

| Evidence | What was inspected | Confidence and limit |
|---|---|---|
| Current public portal | Homepage, sitemap, login, registration, password recovery, FAQs, help documents, help videos and transcripts, case details, case status and history, judgment search, contact directory, and onboarding statistics | High confidence for the visible interface on 24 August 2026. The portal can change without notice. |
| Current signed-in portal | The user's authenticated consumer dashboard, new-case prerequisites, empty case and payment lists, reply, rejoinder, subsequent filing, Vakalatnama, case-number lookup, technical-ticket notice, and profile settings | High confidence for the visible screens on 24 August 2026. No case workflow was advanced and no user data is reproduced here. |
| Official guides | March 2025 onboarding, consumer complaint filing, and payment PDFs; April 2025 consumer complaint flow; January 2025 approved case lifecycle | High confidence for the documented process at publication time. Some wording and screens are visibly stale. |
| User-supplied screenshots | Login, registration, role selection, three profile stages, and the identity-proof list | High confidence for the displayed session. Personal details visible in the screenshots are intentionally omitted here. |

No form was submitted, CAPTCHA solved, file uploaded, payment attempted, filing draft created, search run, ticket raised, or government record changed. The Consumer Complaint selector was changed only to reveal its prerequisites and fee table; `Next` was not selected because it could initialise a live draft. No personal identifier from the user's session is reproduced in this repository.

## Stage 1 boundary

Stage 1 should understand the complete citizen task but build only the narrow part that creates clear value.

### In the research map

- finding the portal and understanding what it does;
- registration, OTP, profile completion, and identity proof;
- password and OTP login paths;
- dashboard orientation;
- starting a consumer complaint;
- case details, parties, supporting documents, Commission selection, preview, and final submission;
- fee and payment flow;
- acknowledgement and reference number;
- scrutiny, reversion, acceptance, hearing allocation, and basic case tracking; and
- the help and support routes attached to those steps.

### Outside the Stage 1 build

- real registration, OTP, identity verification, or identity-document storage;
- live filing, payment, Commission routing, case lookup, or government integration;
- advocate, company, authorised representative, Commission, judge, or member workspaces;
- appeals, revisions, execution, transfer, caveat, and miscellaneous applications;
- respondent registration, replies, rejoinders, courtroom management, and order publication;
- legal advice, jurisdiction decisions, limitation decisions, or predictions about admission and outcome.

These excluded areas still appear later in this map when they clarify what happens after a complaint leaves the citizen's hands.

## Executive finding

The current portal digitises a large process, but it makes the citizen arrive with procedural knowledge and court-style documents already prepared.

The consumer must first finish identity-heavy onboarding. They then choose an internal case type, interpret fee and jurisdiction information, enter parties and addresses, and upload separate files named Index, Proforma, Synopsis, Memo of Parties, Consumer Complaint with Notarised Affidavit, Annexures, and sometimes an application or Vakalatnama. The FAQ tells the citizen to contact the relevant Consumer Commission for the exact and current formats of core documents.

This creates the best hackathon opportunity. The useful redesign is not a new homepage or a shorter registration form. It is a guided preparation journey that turns one verified account of a dispute into a complete, reviewable filing pack.

## Current public information architecture

### Primary public routes

| Route | Current purpose | Stage 1 relevance |
|---|---|---|
| [`/`](https://e-jagriti.gov.in/) | Homepage with public search links, onboarding summary, updates, fee tables, statistics, success stories, press items, and login | Research only. A redesigned start should be much more task-focused. |
| [`/complete-case-details`](https://e-jagriti.gov.in/complete-case-details) | Look up case details using a case number and CAPTCHA | Post-filing context only. |
| [`/case-history-case-status`](https://e-jagriti.gov.in/case-history-case-status) | Tabs for Case Status and Case History; accepts old Commission-based format or a new case, filing, or e-Daakhil reference; uses CAPTCHA | The prototype receipt should explain how a real reference would be used here. |
| [`/judgement`](https://e-jagriti.gov.in/judgement) | Search judgments by NCDRC, SCDRC, or DCDRC hierarchy | Outside the main build. Useful for explaining the larger service. |
| [`/display-board`](https://e-jagriti.gov.in/display-board) | Public hearing display board | Outside the main build. |
| [`/cause-list`](https://e-jagriti.gov.in/cause-list) | Public cause lists | Outside the main build. |
| [`/advance-case-search`](https://e-jagriti.gov.in/advance-case-search) | Advanced public case search | Outside the main build. |

### Authentication and onboarding routes

| Route | Current purpose | Important behavior |
|---|---|---|
| [`/login`](https://e-jagriti.gov.in/login) | Password login, OTP login, and entry to password recovery | The user first enters a mobile number or email. The next control is disabled until the field is valid. |
| [`/register`](https://e-jagriti.gov.in/register) | New account creation | Collects NRI status, mobile number, email, full name, password, role, and CAPTCHA. The visible roles include Consumer, Advocate, and Company. |
| [`/forgot-password`](https://e-jagriti.gov.in/forgot-password) | Password reset | Starts from registered mobile number or email, then OTP, CAPTCHA, new password, and save. |
| `/complete-profile` | Signed-in profile completion | Three stages: Personal Information, Address Information, and Upload Documents. The citizen cannot reach the normal dashboard until this gate is complete. |

### Current authenticated consumer routes

The live consumer workspace exposed the following routes after profile completion. These are recorded to understand the service boundary, not as Stage 1 build commitments.

| Route | Current purpose | Read-only walkthrough finding |
|---|---|---|
| `/consumer/dashboard` | Case and filing overview | Offers `New Look` and `Old Look` presentations of the same status groups. The current menu differs from the March 2025 guide. |
| `/consumer/case-filing` | Start a new filing | A case-type choice reveals prerequisites and fees before `Next`. The walkthrough stopped at that boundary. |
| `/consumer/payment-history` | Find and reconcile filing payments | Contains Pending Payments, Failed Transactions, Payment Receipts, and Payment Status views. |
| `/consumer/reply` | Locate a case and file a reply | Accepts old Commission-based details or a case, filing, or reply reference. |
| `/consumer/rejoinder` | Locate a case and file a rejoinder | Mirrors reply lookup but also accepts a rejoinder reference. |
| `/consumer/subsequent-filing` | Add a later filing to a case | Mirrors the lookup pattern and accepts a subsequent-filing reference. |
| `/consumer/add-vakalatnama` | Associate a Vakalatnama with a matter | Accepts old-format details or a new case, filing, or e-Daakhil reference. |
| `/consumer/know-your-case` | Resolve an old-style case number | Requires state, Commission, and a case number in a pattern such as `CC/3/2020`. |
| `/consumer/raise-ticket` | Report a portal problem | Explicitly limited to technical issues and asks for the affected module, evidence, and a case or reference number where applicable. |
| `/consumer/edit-profile` | Maintain account details | Shows profile, address, and identity-document sections plus controls for password, mobile or email, photo, and address changes. |

### Help and information routes

| Route | Current purpose | Finding |
|---|---|---|
| [`/help-docs`](https://e-jagriti.gov.in/help-docs) | Fourteen filing guides, fourteen flow diagrams, payment guidance, and the approved case lifecycle | Authoritative-looking but document-heavy. Most useful guidance lives in PDFs rather than in the transaction. |
| [`/help-videos`](https://e-jagriti.gov.in/help-videos) | Onboarding and filing videos with transcripts | The transcripts are much shorter than the real process. The onboarding transcript jumps from OTP to dashboard and omits profile completion. |
| [`/faq`](https://e-jagriti.gov.in/faq) | Fourteen common questions | Several answers redirect to help PDFs or Commission contact. The advocate question displayed no answer during inspection. |
| [`/contact-us`](https://e-jagriti.gov.in/contact-us) | NCDRC, SCDRC, and DCDRC contacts | The DCDRC tab renders a very long nationwide table rather than asking for state or district first. |
| [`/onboarding-users`](https://e-jagriti.gov.in/onboarding-users) | Public onboarding and complaint-state counts | Lists case states such as Draft, Pending for Scrutiny, Reverted in Consumer, Payment Pending, Pending for Courtroom, In Courtroom, Disposed Off, Document Compliance, and Diary to Main Case. |
| [`/about-ejagriti`](https://e-jagriti.gov.in/about-ejagriti) | Service information | Context only. |
| [`/lgd-ids`](https://e-jagriti.gov.in/lgd-ids) | Local Government Directory codes | Not needed in the Stage 1 citizen build. |
| Policy pages | Privacy, terms, grievance, cancellation, return, and refund policies | Required trust context, but not part of the demo's main interaction. |

## Current journey at a glance

```text
Discover portal
  -> Register
  -> Verify OTP
  -> Complete personal profile
  -> Complete address
  -> Select identity proof, enter its number, upload PDF
  -> Return to login
  -> Open dashboard
  -> File New Case
  -> Select Consumer Complaint
  -> Read required document list and fee table
  -> Enter case details
  -> Enter complainant and opposite-party details
  -> Add optional additional and proforma parties
  -> Upload separate legal documents and annexures
  -> Select Commission and accept declaration
  -> Preview and edit
  -> Final submit
  -> Receive filing reference
  -> Pay if required
  -> Registry scrutiny
  -> Accepted, reverted, or action required
  -> Case number and hearing allocation
  -> Notices, reply, rejoinder, hearing, and orders
```

The primary hackathon problem sits between "I have a consumer problem" and "I have the separate legal documents the portal expects."

## Detailed current journey

### 1. Discovery and orientation

The homepage's top navigation presents Case Details, Case History/Status, Judgment, Display Board, Cause List, and Login or Sign Up. It also shows success stories, Commission updates, fee tables, case statistics, news, partner links, and an onboarding summary.

An overlay states that eDaakhil, OCMS, CMS, and Confonet were subsumed into e-Jagriti from 1 January 2025 and offers a search route when a consumer, advocate, or Commission cannot trace a file.

The page proves that e-Jagriti is a broad justice platform, but it does not give a first-time consumer a short answer to the practical question: "What must I prepare before I can file my complaint?"

### 2. Registration

The citizen selects Register from the login page. The registration form asks for:

- NRI status;
- mobile number;
- email address;
- full name;
- password and confirmation;
- role; and
- visual or audio CAPTCHA.

The password guidance names upper and lower case letters, digits, and special characters. Terms and Privacy Policy links appear near the Continue action.

The official onboarding guide says a six-digit OTP goes to the registered mobile number and email. After verification, the account exists, but the current user experience still requires profile completion.

### 3. Mandatory profile completion

The profile flow has three stages.

#### Personal Information

The screen shows or collects name, mobile number, email, role, and an optional profile picture.

#### Address Information

The screen collects:

- NRI status;
- address type, such as Present;
- house, door, building, or flat;
- block, street, mohalla, or sector;
- locality or landmark;
- country;
- PIN code;
- state;
- district;
- post office; and
- police station.

The address screen also offers "add address," which suggests multiple addresses can be stored.

#### Upload Documents

The citizen must select an identity proof, enter the corresponding ID number, and upload a PDF no larger than 10 MB.

The current menu contains these 21 options:

1. Address card with photo issued by the Department of Posts, Government of India.
2. Arms licence.
3. Caste and domicile certificate with photo issued by a state government.
4. Certificate of address with photo issued on letterhead by an MP, MLA, or Group A gazetted officer.
5. Certificate of address with photo from a government-recognised educational institution, for students only.
6. Certificate of photo identity issued by a village panchayat head or equivalent authority, for rural areas.
7. CGHS or ECHS card.
8. Current post-office or scheduled-bank passbook with photo.
9. Driving licence.
10. Election Commission ID card.
11. Freedom-fighter card with photo.
12. Income Tax PAN card.
13. Kisan passbook with photo.
14. Passport.
15. Pensioner card with photo.
16. Photo credit card telephone bill for a fixed line, not older than three months.
17. Photo identity card issued by a government-recognised educational institution, for students only.
18. Photo identity card issued by a central or state government or PSU.
19. Ration card with photo, for the person whose photo is affixed.
20. Smart card issued by CSD, defence, or paramilitary.
21. Sri Lankan refugee identity card.

The current menu does not include Aadhaar. The March 2025 onboarding guide says the final step accepts identity proof "such as Aadhar, PAN, or Driving License." This is a direct content-to-interface inconsistency.

### 4. Login and recovery

The login page exposes three modes in one segmented control:

- Login with Password;
- Login with OTP; and
- Forgot Password.

Both login routes begin with mobile number or email. Password recovery also begins with mobile number or email, then uses OTP and CAPTCHA before accepting a new password.

The FAQ's recovery advice is generic: check network and contact details, wait, retry, clear cache, use an updated browser, or contact support. It does not give a ticket reference or show whether an OTP request was accepted, queued, rate-limited, or failed.

### 5. Dashboard

The current authenticated consumer sidebar shows:

- Dashboard;
- File New Case;
- Payment History;
- Reply;
- Rejoinder;
- Subsequent Filing;
- Add Vakalatnama;
- Know Your Case Number; and
- Raise a Ticket.

The March 2025 guide instead includes `Voice Enabled Case Filing` and omits the current Vakalatnama and ticket routes. This is direct evidence that help content has drifted from the transaction.

The dashboard groups case counts under:

- Cases in Commission: Filed, Disposed, Pending;
- Your Registered Cases: Draft, Pending for Scrutiny, Pending for Date of Hearing Allocation, Payment Pending, Reverted, and Converted From Diary Number; and
- Cases Against Me: Filed, Disposed, Pending.

The live dashboard offers `New Look` and `Old Look` toggles, but both expose the same information hierarchy. An empty Draft list still reveals the expected table fields: reference or diary number, parties, filer, case type, case stage, filing date, and action.

### 6. Start a new consumer complaint

The citizen chooses File New Case, opens a case-type selector, and selects Consumer Complaint.

The current selector contains twelve choices: Consumer Complaint, Revision Petition, Transfer Application, Execution Application, Review Application, Caveat Application, First Appeal, Miscellaneous Application, Interlocutory Application, Appeal Execution, Second Appeal, and CCPA Appeal. A first-time consumer must recognise that Consumer Complaint is the correct legal route before the form helps with their facts.

After Consumer Complaint is selected, the portal displays:

- the required document list; and
- the fee table for DCDRC, SCDRC, and NCDRC.

The portal's current public fee table says:

| Paid consideration | Commission | Fee |
|---|---|---:|
| Up to Rs 5 lakh | District | Nil |
| Above Rs 5 lakh to Rs 10 lakh | District | Rs 200 |
| Above Rs 10 lakh to Rs 20 lakh | District | Rs 400 |
| Above Rs 20 lakh to Rs 50 lakh | District | Rs 1,000 |
| Above Rs 50 lakh to Rs 1 crore | State | Rs 2,000 |
| Above Rs 1 crore to Rs 2 crore | State | Rs 2,500 |
| Above Rs 2 crore to Rs 4 crore | National | Rs 3,000 |
| Above Rs 4 crore to Rs 6 crore | National | Rs 4,000 |
| Above Rs 6 crore to Rs 8 crore | National | Rs 5,000 |
| Above Rs 8 crore to Rs 10 crore | National | Rs 6,000 |
| Above Rs 10 crore | National | Rs 7,500 |

Fee and jurisdiction rules can change. The prototype should not calculate or promise live jurisdiction. It should use one synthetic Commission and show the source version.

In the live authenticated screen, choosing Consumer Complaint revealed the same eight upload categories documented below and the full fee bands through `Above Rs 10 crore`, without advancing the filing. This makes the pre-filing burden visible before the first case form, but it still assumes the citizen understands every document name.

### 7. Complaint form stages

The official filing guide shows six progress stages:

1. Case Details.
2. Complainant / Opposite Party.
3. Additional Complainant.
4. Additional Opposite Party.
5. Document Upload.
6. Final Submission & Checkout.

#### Case Details

The citizen enters:

- paid consideration amount;
- claim consideration or claim amount;
- date of cause of action;
- place of cause of action, including state and district;
- case category; and
- case subcategory.

The April 2025 flow diagram adds a limitation branch. A complaint filed outside two years from the cause of action needs an application for condonation of delay. That is a high-stakes legal branch and must remain outside the model's decision-making authority in the prototype.

#### Complainant and opposite party

The citizen enters or confirms complainant details and the opposite party's details. The guide shows:

- name and contact details;
- present, permanent, or business address;
- address components and postal fields;
- flags for senior citizen, widow, differently abled, or serious ailments; and
- optional advocate selection.

For an e-commerce dispute, the legal identity and serviceable address of the seller may be harder to find than the order number. The current form asks for the address but does not show a guided route for finding or validating it.

#### Additional and proforma parties

Two separate stages allow:

- additional complainants;
- proforma complainants;
- additional opposite parties;
- proforma opposite parties; and
- advocate association with the relevant party.

These stages are necessary for complex cases but add cognitive load to a simple one-consumer, one-seller complaint. The Stage 1 prototype should hide them unless the case needs them and should reject unsupported multi-party cases early.

#### Document upload

The official guide expects separate uploads for:

| Upload | Current role in filing | Citizen burden |
|---|---|---|
| Index | Lists the documents in the pack | The citizen must know the final pack before uploading it. |
| Proforma for filing Consumer Complaint | Structured filing form | Exact accepted format is not supplied in the journey. |
| Synopsis with list of dates and events | Condensed chronology | Requires legal-style summarisation and consistent dates. |
| Memo of Parties | Names and addresses all parties | Depends on finding a usable seller identity and address. |
| Consumer Complaint with notarised affidavit | Main pleading and sworn statement | The FAQ says notarisation is mandatory. This needs an offline action. |
| Annexures or supporting documents | Invoice, messages, photos, notices, and other proof | Each file needs an appropriate title and consistent reference. |
| IA application | Optional application where needed | The citizen must know whether one applies. |
| Vakalatnama | Advocate authority document | It should not be needed for a self-represented consumer, but the guide lists it without a plain conditional explanation. |

The screenshot in the official guide shows PDF-only upload areas with a 25 MB limit. The current identity-proof screen shows PDF-only with a 10 MB limit. The service therefore has step-specific limits that must be stated before file selection.

The FAQ does not provide specimen formats for the affidavit, memo of parties, or synopsis. It tells the citizen to contact the relevant Consumer Commission for the exact and current formats accepted there.

### 8. Commission selection, preview, and submission

The citizen selects the Commission, ticks a declaration, and opens Preview. The preview groups the entered sections and offers Edit controls.

Final Submit opens a warning that the form cannot be edited after submission. Confirming creates a filing reference and submits the case to the selected Commission. A Print action produces an acknowledgement with reference number, filing date, category, opposite party, and Commission name.

This is the clearest proof-of-completion artifact in the current journey. The Stage 1 prototype should preserve that strength while making the mock boundary impossible to miss.

### 9. Payment

Payment happens from Payment History after filing when a fee is due.

The live page separates four views: Pending Payments, Failed Transactions, Payment Receipts, and Payment Status. Pending items are organised by filing reference or diary number, parties, case stage, filing date, and an action. This split supports recovery, but the citizen has to understand which payment state applies before seeing a next step.

The official payment flow is:

1. Open Payment History.
2. Find the filing reference and select Pay.
3. Review case details and choose Proceed to Pay.
4. Select BharatKosh, Razorpay, or PayGov.
5. Continue to the chosen provider.
6. Choose card, UPI, or internet banking where offered.
7. Enter payment details.
8. Complete provider OTP.
9. Return to a success page.
10. View or email the receipt.
11. Download a receipt containing transaction ID, case number, amount, and payment status.

The hackathon build should not reproduce a real payment form. A no-fee synthetic case is simpler and safer. If payment is shown for completeness, it should be a clearly simulated branch with fake data and no external provider.

### 10. Scrutiny and post-filing lifecycle

The April 2025 complaint flow shows this sequence:

```text
Filing reference
  -> Commission registry scrutiny
  -> Accepted or reverted
  -> Online payment when required
  -> Case number and hearing date
  -> Matter listed for admission within the documented timeline
  -> Notice when required
  -> Respondent registration and reply
  -> Reply scrutiny
  -> Courtroom hearing
  -> Complainant rejoinder when required
  -> Rejoinder scrutiny
  -> Evidence or subsequent filings
  -> Daily order or order publication
```

Reversion is a critical recovery state. The dashboard names a case "Reverted," but the citizen needs to know what failed, what remains accepted, what deadline applies, and which exact field or document to fix.

The same flow includes replies, rejoinders, evidence, written arguments or written statements, admission and denial, applications, hearings, daily orders, and published orders. These are not part of the Stage 1 build, but the receipt should explain that filing is the start of a process, not a favorable decision.

### 11. Public tracking and support

Case Status and Case History use nearly identical lookup forms. A user can either:

- choose Commission level, state Commission, district Commission, and old case number; or
- enter a new case number, filing reference, or e-Daakhil reference.

Both routes require CAPTCHA. Case Details uses a shorter case-number plus CAPTCHA form.

The FAQ gives central helpdesk phone numbers and an email address for status difficulties. The Contact Us page lists Commission contacts. The district tab loads a nationwide table, which is hard to scan on a phone and does not lead with the user's location or task.

The signed-in `Know Your Case Number` route is a separate lookup requiring state, Commission, and an old-style case number. Reply, Rejoinder, Subsequent Filing, and Add Vakalatnama each repeat another old-versus-new reference lookup pattern. The repetition reflects different legal tasks, but makes the citizen remember both the action and the identifier type before the system can orient them.

`Raise a Ticket` is not a general support channel. Its notice says non-technical, administrative, personal, and case-related matters will be closed without action. It asks users to name the module or screen, describe the technical fault, avoid duplicates, attach evidence, and include the case or reference and Commission where applicable. During this single walkthrough, activating `Create Ticket` produced no visible form or route change. Retest this before treating it as a reproducible defect.

## Current-state journey map

| Phase | Citizen goal | Current screens and artifacts | Likely question | Failure or harm | Stage 1 decision |
|---|---|---|---|---|---|
| Discover | Find the right way to act on a purchase problem | Homepage, success stories, fees, updates, login | "Do I file here, contact the seller again, or use Consumer Helpline first?" | The portal starts from system features rather than the user's problem. | Begin with a supported-problem check. |
| Create account | Obtain access | Register, CAPTCHA, OTP | "Why do you need both mobile and email, and what happens if OTP fails?" | Retry advice is weak and no durable ticket is shown. | Simulate or omit authentication in the prototype. |
| Complete identity | Unlock the dashboard | Personal information, address, identity proof, PDF upload | "Which proof can I use? Why is Aadhaar in the guide but not the list?" | A citizen can be blocked before learning whether their complaint is file-ready. | Show a preflight explanation, use synthetic identity, and never collect a real ID. |
| Choose route | Start the correct filing type | File New Case, case-type selector | "Is Consumer Complaint the right legal type?" | Legal labels appear before problem diagnosis. | Ask about the purchase problem first. |
| Prepare case | Supply amounts, dates, category, and place | Case Details | "What is paid consideration, claim amount, or cause of action?" | Guessing can affect route and filing quality. | Use plain prompts, examples, and source-linked guidance. |
| Identify parties | Name and locate consumer and seller | Complainant / Opposite Party | "What company name and address do I use for an online marketplace?" | Missing or wrong seller details can cause reversion. | Add a seller-detail readiness check without inventing data. |
| Handle complexity | Add parties and advocates | Additional and proforma stages | "Can I skip this?" | Simple cases are exposed to complex-case controls. | Support one consumer and one seller only. |
| Build filing pack | Upload legal documents and evidence | Index, proforma, synopsis, memo, complaint, affidavit, annexures | "Where do I get the formats, and how do I keep facts consistent?" | This is the main procedural gap. Citizens may pay an intermediary or submit inconsistent files. | Generate a versioned pack from one confirmed fact record. |
| Review | Check the legal record | Preview and section edits | "What changed across all the files if I fix one date?" | Manual files can drift apart. | Propagate one confirmed correction across every generated section. |
| Submit | Create a filing | Declaration, final warning, reference | "Was it filed, queued, or only saved?" | Ambiguous success can cause duplicate action. | Use a clear simulated receipt with state, timestamp, owner, and next step. |
| Pay | Satisfy filing fee | Payment History, gateway, OTP, receipt | "Is the payment linked to my filing?" | Redirects and OTP create additional failure points. | Use a no-fee synthetic scenario or a labelled simulation. |
| Recover | Fix registry objections | Reverted status and resubmission | "What exactly is wrong, and what remains saved?" | Generic reversion increases anxiety and support load. | Demonstrate a readiness blocker before mock submission. |
| Track | Know what happens next | Case Status, Case History, Case Details | "Who has the case, what happens next, and by when?" | Search forms expose internal numbering and repeated CAPTCHA. | Explain the real post-filing stages on the mock receipt. |

## Prioritised problems

### P0: the portal expects a filing pack before it helps create one

Evidence: the official consumer complaint guide requires several separate court-style documents, while the FAQ sends the citizen to the relevant Commission for accepted formats.

User harm: the person may pay a lawyer or agent, reuse an unverified internet template, submit inconsistent files, or abandon a valid low-value claim because preparation costs approach the value of the dispute.

Design implication: this is the primary hackathon problem. Nivaran should turn confirmed facts and evidence into one reviewable, versioned pack.

### P0: mandatory onboarding can block the citizen before value appears

Evidence: the dashboard is gated by personal details, a detailed address, identity-proof selection, identity number, and a PDF upload.

User harm: someone without an obvious accepted proof, scanner, or PDF conversion route cannot even inspect the actual filing workflow.

Design implication: the prototype should let reviewers experience the filing solution with a fictional profile. A production proposal should explain accepted alternatives before registration and provide a safe assisted route.

### P0: official guidance and the current interface disagree

Evidence: the March onboarding guide names Aadhaar, PAN, and driving licence as examples. The current identity menu includes PAN and driving licence but not Aadhaar. The onboarding video transcript omits all three profile-completion stages.

User harm: the person cannot tell whether the guide is wrong, the menu is incomplete, or a valid document is being rejected.

Design implication: every rule and document list needs an owner, content version, effective date, and one source used by both help content and the form.

### P0: the seller identity and address problem is hidden inside a generic party form

Evidence: opposite-party name and address are required, but current guidance does not show how an ordinary online buyer should identify the legal seller or service address.

User harm: a citizen may enter the marketplace brand, seller display name, or support email in the wrong place and discover the problem only at scrutiny.

Design implication: the readiness check should make seller identity a named blocker, show where a person may find it in their own invoice or terms, and never invent a missing address.

### P1: the system starts with legal and administrative vocabulary

Examples include Consumer Complaint, paid consideration, cause of action, proforma party, IA application, Vakalatnama, pecuniary jurisdiction, and condonation of delay.

User harm: the citizen must translate their story into the portal's data model before the portal can help them.

Design implication: begin with "What did you buy?", "What went wrong?", "When did it happen?", and "What have you asked the seller to do?" Translate only confirmed answers into the formal record.

### P1: simple cases share a flow with complex cases

Evidence: additional complainant, proforma complainant, additional opposite party, proforma opposite party, advocates, and applications are visible in the standard progression.

User harm: unnecessary choices create fear of missing a mandatory step.

Design implication: Stage 1 should explicitly support one consumer, one seller, and one low-value e-commerce purchase. Unsupported complexity should stop early with an official next step.

### P1: upload guidance is split and recovery is unclear

Evidence: file rules appear inside each upload area, identity and complaint uploads have different limits, and public reports already collected in the project research mention upload failure.

User harm: a failed upload can waste data and force repeated scanning or conversion on a phone.

Design implication: show type and size before selection, preserve the draft, label each file, provide retry, and distinguish original evidence from generated derivatives.

### P1: status names do not explain ownership and next action

Examples include Pending for Scrutiny, Reverted in Consumer, Document Compliance, Pending for Courtroom, and Diary to Main Case.

User harm: the person may not know whether they must act, the registry must act, or a deadline is running.

Design implication: every status should include plain meaning, current owner, required action, expected time, and a source timestamp.

### P2: public information is broad but poorly prioritised for a first-time filer

Evidence: the homepage mixes filings, press releases, success stories, statistics, Commission updates, fee tables, public searches, and partner links. The DCDRC contact page renders a nationwide table.

User harm: essential preparation guidance competes with institutional and reporting content.

Design implication: the prototype should have a stable task start page and stage-specific help. It does not need to recreate the public portal.

## The user's identity-proof blocker

The lack of passport or driving licence does not necessarily end the current onboarding flow. The visible menu also accepts PAN, Election Commission ID, a current photo passbook from a post office or scheduled bank, a photo ration card for the pictured person, and several government, educational, pension, rural, and service identity documents.

This observation is not a guarantee that a particular document will pass verification. The user should choose only a document they actually hold and that the current portal accepts, then upload it themselves. No real ID number or document should be placed in this repository or in the hackathon prototype.

If the user has none of the listed documents, the current screen offers no visible "I do not have one of these" route. The safest current action is to use the official e-Jagriti helpdesk or the relevant Commission contact, not upload a mismatched document.

## What should be copied, improved, or discarded

| Current pattern | Decision | Reason |
|---|---|---|
| Final preview with section-level Edit | Keep and improve | It gives the citizen a correction point before an irreversible action. |
| Printed acknowledgement with reference, date, category, party, and Commission | Keep and improve | It is concrete proof and a useful handoff artifact. |
| Separate case states such as Draft, Scrutiny, Reverted, Payment Pending, and Filed | Keep, rewrite in plain language | The distinctions matter, but each needs owner and next action. |
| Required-document list before the complaint form | Keep, move earlier, and explain | Preparation should be visible before account creation and expressed in citizen language. |
| PDF help guides detached from the task | Replace as the primary help route | PDFs remain useful downloads, but critical guidance should be HTML beside the relevant field. |
| Legal case-type selector as the starting question | Replace | The citizen should start from their problem. |
| Full additional-party stages in a simple complaint | Hide or reject for Stage 1 | They expand scope without helping the selected primary user. |
| Real identity, OTP, payment, and submission | Mock or omit | The hackathon rules require synthetic data and prohibit live government integration. |
| Homepage news, broad statistics, partner carousel, and institutional links | Do not recreate | They do not improve the selected task. |

## Evidence gaps and validation work

The walkthrough establishes the visible flow, not the frequency of each problem. Before claiming impact, complete these checks:

1. Interview two people who recently attempted a consumer complaint, ideally one who filed without an advocate.
2. Ask what document preparation cost in time or money and which format caused the most uncertainty.
3. Confirm whether a self-represented filing currently omits Vakalatnama in practice.
4. Confirm one Commission's accepted templates and version them for the synthetic prototype.
5. Observe one mobile-first user trying to identify the seller's legal name and address from a synthetic invoice.
6. Test whether users understand paid consideration, claim amount, cause of action, and reverted status after a plain-language rewrite.
7. Recheck the official portal and help documents before submission because the live screens and March 2025 guides already differ.

## Official sources inspected

- [e-Jagriti homepage](https://e-jagriti.gov.in/)
- [e-Jagriti sitemap](https://e-jagriti.gov.in/site-map)
- [Login](https://e-jagriti.gov.in/login)
- [Registration](https://e-jagriti.gov.in/register)
- [Frequently Asked Questions](https://e-jagriti.gov.in/faq)
- [Help documents and flow diagrams](https://e-jagriti.gov.in/help-docs)
- [Help videos and transcripts](https://e-jagriti.gov.in/help-videos)
- [Onboarding guide, March 2025](https://e-jagriti.gov.in/static/media/Onboarding_Tutorial.9e89535dbbd244dc2691.pdf)
- [Consumer Complaint filing guide, March 2025](https://e-jagriti.gov.in/static/media/CC_Filing.34e0fc5dd03b1d864cab.pdf)
- [Payment flow, March 2025](https://e-jagriti.gov.in/static/media/Payment_Flow.c102b9be21387e321633.pdf)
- [Consumer Complaint flow diagram, April 2025](https://e-jagriti.gov.in/static/media/CC_Flow.ff32ae9d2008d2eb0fc2.pdf)
- [Approved case lifecycle, January 2025](https://e-jagriti.gov.in/static/media/CaseLifecycle.a40dbae2524b6f99f248.pdf)
- [Case status and history](https://e-jagriti.gov.in/case-history-case-status)
- [Case details](https://e-jagriti.gov.in/complete-case-details)
- [Judgment search](https://e-jagriti.gov.in/judgement)
- [Commission contacts](https://e-jagriti.gov.in/contact-us)
- [Users onboarded and complaint filings](https://e-jagriti.gov.in/onboarding-users)

## Related project documents

- [Confirmed e-Jagriti product plan](2026-08-24-e-jagriti-product-plan.md)
- [Government digital-service research guide](2026-08-24-government-digital-service-research-guide.md)
- [Government service quality checklist](2026-08-24-government-service-quality-checklist.md)
- [Public-service opportunity research](2026-08-24-public-service-opportunity-research.md)
- [Stage 1 redesign proposal](2026-08-24-e-jagriti-stage-1-redesign-proposal.md)
