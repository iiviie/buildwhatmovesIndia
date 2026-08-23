# e-Jagriti product plan

Status: confirmed product direction

Working product name: Nivaran

Last reviewed: 24 August 2026

Prototype deadline: 28 August 2026 at 8:00 PM IST

## Decision

We will build an independent, guided filing companion for one e-Jagriti journey:

> A self-represented consumer with a small e-commerce dispute needs to prepare a complete consumer complaint, but the current process expects them to understand court-style documents and local filing requirements.

The prototype will support a fictional low-value complaint about a missing, defective, or wrongly described product. It will guide the citizen from their account of the problem to a checked filing pack, a clearly simulated submission, and a synthetic reference number.

We are not redesigning the whole e-Jagriti portal. We are fixing the part where an ordinary complaint has to become a procedurally structured filing.

## Why this is worth building

The service already matters at national scale. A June 2026 [Press Information Bureau release](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2269994&lang=1&reg=3) reported 4,15,365 registered users, 2,29,174 cases filed, and 2,07,997 cases disposed through e-Jagriti. We do not need to invent demand.

The filing burden is visible in the official material. The March 2025 [Consumer Complaint filing guide](https://e-jagriti.gov.in/static/media/CC_Filing.34e0fc5dd03b1d864cab.pdf) takes a citizen through case details, parties, supporting documents, commission selection, preview, final submission, and a reference number. Its document step asks for an index, proforma, synopsis, memo of parties, notarised affidavit, annexures, and, when relevant, a vakalatnama or interlocutory application.

The [e-Jagriti FAQ](https://e-jagriti.gov.in/faq) says that citizens should contact the relevant Consumer Commission for exact and updated formats of mandatory documents such as the affidavit, memo of parties, and synopsis. That handoff creates a practical gap. A digital portal exists, but the citizen may still need procedural help before they can use it.

Forum reports in the [opportunity research](public-service-opportunity-research.md) are not a representative survey. They do, however, show the same failure pattern: uncertainty about document formats, notarisation, scrutiny, seller details, upload failures, and what happens after submission. We should validate these points with two recent users before treating them as common.

## The user and the supported case

### Primary user

An adult consumer filing without an advocate who:

- bought a product online;
- paid less than Rs 50,000 in the prototype scenario;
- has an invoice and at least one record of contacting the seller;
- wants a refund, replacement, or another simple monetary remedy;
- uses an entry-level Android phone or shared computer;
- may understand conversational Hindi better than legal English; and
- may lose connectivity or need to pause and return.

The amount limit is a product scope limit, not a statement of legal jurisdiction.

### Prototype scenario

Priya Sharma is a fictional consumer. She bought a fictional Rs 8,999 phone from AcmeCart. The phone arrived with a defective display. She has a synthetic invoice, a delivery message, two support-chat screenshots, and a photograph. The seller has not acted after two support requests. Priya wants a refund.

### Out of scope for this build

- services, real estate, insurance, medical negligence, banking, travel, or multi-party disputes;
- class actions, product liability analysis, appeals, execution applications, or interim applications;
- live jurisdiction advice;
- legal advice or a prediction that a Commission will admit or decide the complaint;
- advocate workflows;
- real OTP, payment, notarisation, signing, commission submission, hearing, or case tracking;
- live e-Jagriti access, undocumented APIs, or real personal data.

If the user's facts fall outside the supported case, the product must say so early. It should give a safe official next step instead of forcing the facts into a bad template.

## Product promise

Nivaran should let a citizen say what happened in ordinary language, attach evidence once, correct any uncertain extraction, and receive a reviewable complaint pack without learning the names of every legal document first.

The product succeeds when the citizen can answer these questions at every stage:

1. What am I doing now?
2. Why is this information needed?
3. What remains incomplete?
4. Where did this drafted fact come from?
5. What happens after I continue?

## The complete prototype journey

The main journey has eight stages. Each stage must work before secondary features are added.

| Stage | Citizen action | Product response | Completion evidence |
|---|---|---|---|
| 1. Check fit | Choose the purchase problem, purchase channel, amount, and date | Confirm that the prototype supports the case or explain why it does not | Supported-case card with scope and disclaimer |
| 2. Tell the story | Answer short questions about the order, defect, seller contact, and requested remedy | Save each answer and build a dated event list | Visible progress and saved-draft status |
| 3. Add evidence | Upload the synthetic invoice, screenshots, and photo | Show upload progress, readable previews, file labels, and retry controls | Evidence checklist with every file accounted for |
| 4. Verify facts | Review extracted seller, amount, order number, and dates beside their source | Ask the citizen to confirm or edit every uncertain fact | Confirmed facts marked separately from suggestions |
| 5. Fix gaps | Respond to missing seller address, unclear date, or unsupported claim warning | Explain the exact fix and why it matters | Readiness check with no unresolved blocking item |
| 6. Review the complaint | Read the timeline, parties, allegations, remedy, and annexure mapping | Let the citizen edit each section without losing progress | Citizen-approved complaint summary |
| 7. Prepare the pack | Generate the supported document set and explain signature or notarisation steps | Produce printable previews with template version and source links | Downloadable synthetic filing pack |
| 8. Mock submission | Choose one synthetic District Commission, accept the declaration, and submit | Clearly simulate submission and issue a fake reference | Receipt with reference, timestamp, mock label, and next step |

### Screen-level acceptance criteria

#### 1. Start and scope check

- State that Nivaran is an independent hackathon prototype before collecting data.
- Say what complaint is supported in one short paragraph.
- Show the expected time, required evidence, language availability, and mock boundary.
- Ask no more than one main question per screen on mobile.
- Stop unsupported cases before uploads begin.

#### 2. Story capture

- Use prompts such as "What did you buy?" and "What did the seller do after you complained?"
- Explain legal terms only where they are unavoidable.
- Offer tap, type, and optional voice input. Voice is a convenience, never the only input method.
- Show a plain event timeline as answers arrive.
- Save after every completed answer and show the last saved time.

#### 3. Evidence upload

- Accept the exact prototype file types and sizes shown before selection.
- Allow camera capture or file selection on mobile.
- Never fail silently. An interrupted upload shows retry, remove, and keep-for-later actions.
- Keep the original file unchanged. Any compressed preview is a separate derivative.
- Let the citizen rename "IMG_4821.jpg" to "Defective display photo" without renaming the stored original.
- Show a simple illustration of a usable invoice or screenshot. Provide equivalent text.

#### 4. Fact verification

- Put each extracted fact beside the source page or image crop that supports it.
- Mark low-confidence extraction in text, not only by colour.
- Require confirmation before a suggested fact enters the complaint.
- Never invent a seller address, date, amount, communication, or remedy.
- Provide an "I cannot find this" route that explains the consequence and available next step.

#### 5. Readiness check

- Separate blockers from recommendations.
- Link every issue to the exact field or upload that needs attention.
- Explain why the seller's legal identity and address matter without pretending to give legal advice.
- Re-run deterministic checks after an edit.
- Do not let an AI confidence score decide whether the pack is ready.

#### 6. Complaint review

- Use a short plain-language summary first, then the formal draft.
- Let the citizen edit parties, timeline, complaint grounds, and remedy independently.
- Show what changed after an edit.
- Display the evidence reference next to each major factual statement.
- Make print and mobile review usable without side-to-side scrolling.

#### 7. Pack preparation

The prototype pack will contain:

1. index;
2. filing proforma;
3. synopsis and list of dates;
4. memo of parties;
5. consumer complaint draft;
6. affidavit checklist and synthetic draft;
7. annexure list; and
8. synthetic annexures or placeholders.

Each generated file must show:

- "Independent prototype" and "Synthetic data";
- the supported Commission and template version;
- creation date;
- whether a signature, notarisation, or external action remains;
- source references for drafted facts; and
- a warning to check current requirements with the relevant Commission.

Do not generate a vakalatnama for a self-represented consumer. Do not imply that the synthetic affidavit has been sworn or notarised.

#### 8. Submission and receipt

- Name the destination "Mock District Consumer Commission".
- Label the final action "Submit simulated complaint".
- Require a final review acknowledgement.
- Simulate the network delay and one recoverable failure state.
- Prevent double submission.
- Issue a synthetic reference such as `DEMO-CC-2026-0042`.
- Explain that no complaint, payment, or government record was created.
- Show the next real-world steps in plain language.

## The hardest design decision

The product should not begin with "upload your index" or "choose a case category." Those are system concepts. It should begin with the consumer's problem.

The same facts then feed several outputs:

```text
Citizen story and evidence
        |
        v
Confirmed fact record
        |
        +--> event timeline
        +--> parties and addresses
        +--> remedy summary
        +--> annexure mapping
        +--> versioned filing documents
```

One fact record avoids repeated entry and makes corrections consistent across the pack.

## AI that can be trusted

AI has a useful but limited role here. It may:

- extract candidate facts from synthetic invoices and screenshots;
- turn confirmed events into a draft chronology;
- suggest a plain-language summary based only on confirmed facts;
- answer questions from a versioned official help collection; and
- translate interface guidance that a human reviewer has approved for release.

AI must not:

- decide jurisdiction, limitation, liability, admissibility, or likely outcome;
- invent missing facts;
- silently change the user's requested remedy;
- present generated text as legal advice;
- submit anything without a separate user review; or
- answer from general model memory when the official source is missing or stale.

Every generated fact needs four fields: value, source, confidence, and citizen confirmation. Deterministic rules decide whether required prototype fields are present. The model drafts; it does not approve.

### Contextual help panel

The user's Control K idea is worth keeping, with one adjustment. A hidden shortcut cannot be the main support system for citizens with limited digital experience.

Every screen should have a visible "Help with this step" control. `Ctrl+K` or `Cmd+K` opens the same panel for experienced users. The panel can:

- explain the current question;
- jump to a section of the draft;
- show examples of acceptable evidence;
- answer "Why do you need this?";
- search current help content; and
- start a support request when the answer is not enough.

Answers must cite the source, show its last review date, and distinguish official guidance from prototype guidance. If the knowledge base cannot support an answer, the panel says that plainly and offers the relevant Commission contact route.

## Language, literacy, and disability

### Language plan

The prototype's full main journey will use English and Hindi. All citizen-facing strings must live outside components so another language can be added without rewriting screens.

- A fluent reviewer must check both versions of every main screen, error, help item, and receipt.
- The chosen language persists across the journey.
- Legal document output remains English for this prototype and is disclosed before the user starts.
- Hindi text uses Unicode and the correct page language metadata.
- The interface must not mix untranslated English fragments into Hindi instructions without an explanation.
- If a translation is missing, show the English source and a clear fallback. Never show an empty screen.

Adding ten partly translated languages would be theatre. Two complete, reviewed journeys are more credible.

### Accessible interaction

- Meet GIGW 3.0's WCAG 2.1 AA baseline for the prototype.
- Use semantic HTML before ARIA.
- Support keyboard-only use and visible focus.
- Test with Android TalkBack and one desktop screen reader.
- Keep visible labels on every control.
- Associate errors and help text with the relevant field.
- Do not use colour, shape, location, sound, or animation as the only cue.
- Support 200 percent zoom and reflow at 320 CSS pixels without two-dimensional scrolling.
- Give touch controls at least 44 by 44 CSS pixels.
- Respect reduced-motion settings.
- Caption any video and provide a text alternative to every visual guide.
- Do not treat an accessibility widget as a substitute for accessible markup and testing.

### Assisted use

Government services are often completed with help from a relative, Common Service Centre, or support worker. A future production version should have a consent-based helper mode with a visible session boundary and audit trail. It must not encourage password or OTP sharing.

For the prototype, show the concept only in the production plan. Do not build a half-working delegated-access system.

## Low-bandwidth and rural access

The default experience should already be light. Network adaptation is a backup, not permission to ship a heavy default.

- Deliver meaningful HTML before optional scripts where the chosen framework permits it.
- Use system fonts, small icons, and no decorative hero video.
- Reserve layout space so late content does not jump.
- Load help illustrations only when opened.
- Use simple SVG or compressed raster images with text alternatives.
- Queue draft changes locally during a disconnect and make the sync state visible.
- Resume uploads in production. In the prototype, preserve the selected file and provide a reliable retry.
- Offer a visible "Use less data" setting. It removes previews, animation, voice loading, and nonessential images.
- Use browser connection hints only as a suggestion. They are not available everywhere and should never block a feature.
- Keep the final reference and checklist printable and easy to save as a small file.
- Test on an entry-level Android viewport with network throttling and one forced connection drop.

Do not describe rural users as one type of person. Test concrete constraints: intermittent data, older Android devices, shared phones, low literacy, travel distance, and reliance on assisted centres.

## Support that leads somewhere

A FAQ page alone is not support. Help should follow the user through the task.

| Support level | What the citizen sees | What must happen behind the interface |
|---|---|---|
| Contextual | Explanation, example, visual guide, and source on the current step | Help content has an owner, review date, language versions, and usage analytics |
| Guided recovery | A diagnosis for upload, OTP, draft, or document-readiness problems | Stable error codes map to tested recovery instructions |
| Support request | Short form prefilled with stage, error code, and safe diagnostic data | Ticket receives a reference, response target, owner, and status |
| Official handoff | Relevant Commission contact, hours, and what to ask | Contact directory is current and reviewed on a schedule |

The prototype must implement contextual help and one synthetic support-request journey. It should issue a fake support reference and show what information would be sent. It must not display a dead email address or fake a human conversation.

An open forum is not a prototype priority. Consumer disputes invite personal data, bad legal advice, spam, and moderation work. A production service could publish moderated, anonymised answers to recurring questions. It should add a community forum only after staffing moderation, escalation, privacy, and correction processes.

## Announcements without clutter

Announcements should appear only when they affect the current task. Each announcement needs an owner, publication time, effective date, expiry date, affected journey stage, language versions, and an archive URL.

Do not use a moving ticker, carousel, or site-wide modal for routine news. A filing-format change belongs beside the document step. A planned outage belongs on the start page and draft screen. The citizen should be able to dismiss noncritical notices.

## Agent-readable public guidance

Making guidance readable by software agents is useful, especially when public instructions change faster than general AI knowledge. It must not expose citizen records or create an unofficial route around authentication.

A production service should publish the same approved content in human-readable HTML and stable machine-readable forms:

- stable task URLs such as `/help/file-consumer-complaint`;
- descriptive page titles, headings, language metadata, canonical URLs, and last-reviewed dates;
- `sitemap.xml` and a clear crawling policy;
- structured data where an established vocabulary fits, such as `GovernmentService`, `FAQPage`, or `HowTo`;
- a versioned public service manifest with eligibility, required documents, fees, stages, support contacts, source URLs, and update timestamps;
- a public change log for forms, templates, fees, and service rules;
- downloadable schemas and documented public APIs only when the department authorises them; and
- a citation link and content version in every assistant answer.

The approved content management workflow remains the source of truth. HTML, PDF, help answers, and the service manifest should publish from the same versioned record so they do not drift apart.

## Transparent service metrics

A production service should publish metrics that map to parts of the citizen journey. A single "cases disposed" number does not reveal whether people can file successfully.

| Journey part | Public metric | Operational metric | Why it matters |
|---|---|---|---|
| Start | Supported-case rate and scope last updated | Unsupported reasons | Shows who the service can and cannot help |
| Form | Completion rate and median completion time | Abandonment by step and validation error | Reveals confusing questions |
| Upload | Successful upload rate | Retry rate, failure code, and file-size distribution | Reveals network and format problems |
| Readiness | Pack-ready rate | Missing requirement by type | Reveals where procedural guidance fails |
| Submission | Acknowledgement success rate | Duplicate, timeout, and integration errors | Shows whether filing finishes reliably |
| Support | Median first response and open-ticket age | Volume by journey stage and error code | Shows whether help works |
| Content | Last reviewed date and language parity | Overdue pages and translation drift | Shows whether instructions are current |
| Accessibility | Audit date and known open barriers | Automated and manual findings by severity | Makes access work accountable |

Every published number needs a definition, date range, update time, owner, data source, exclusions, and minimum sample rule. Do not publish a percentage that cannot be traced to a counted numerator and denominator. Do not expose personal or case-level data.

## Prototype data and mock inventory

The repository and interface must maintain this list as implementation changes.

| Item | Prototype treatment | Production dependency |
|---|---|---|
| Consumer identity | Fictional Priya Sharma | Approved identity and account system |
| Mobile, email, address | Synthetic | Protected citizen profile data |
| OTP and login | Simulated or omitted | Approved authentication provider |
| Seller and legal address | Fictional AcmeCart | Citizen-provided and verified records |
| Invoice, chats, photos | Synthetic fixture files | Secure upload, malware scanning, retention controls |
| Commission | Mock District Consumer Commission | Authoritative commission directory and routing rules |
| Templates | Versioned prototype templates | Commission-owned, approved template registry |
| Affidavit and notarisation | Synthetic draft and checklist | Citizen action and accepted legal process |
| Fee and payment | No real charge | Authoritative fee rules and approved payment service |
| Submission | Simulated | Documented, approved e-Jagriti integration |
| Reference and status | Synthetic | Case management system |
| Notifications | On-screen preview only | Approved SMS or email service and consent rules |
| Support ticket | Synthetic | Staffed help desk and service targets |

The prototype must show a persistent but quiet "Independent prototype using synthetic data" label. The final screen must repeat that no government transaction occurred.

## Production service outline

The hackathon build is a responsive public web application. We will choose and record the exact implementation stack before writing application code. Whatever stack we choose must support server-rendered or pre-rendered public guidance, accessible forms, resumable state, small initial downloads, and a public deployment without login friction for reviewers.

A government deployment would need these owned services:

```text
Responsive citizen web app
        |
        +--> approved authentication and consent
        +--> case rules and commission directory
        +--> versioned content and template registry
        +--> encrypted document store and malware scanning
        +--> extraction and drafting service
        +--> deterministic validation service
        +--> PDF and print renderer
        +--> approved e-Jagriti submission adapter
        +--> notification and support systems
        +--> audit, monitoring, analytics, and public metrics
```

Before government use, the owning department would need to confirm hosting, records retention, data classification, security controls, disaster recovery, support staffing, language review, template ownership, integration contracts, audit needs, and applicable legal requirements. GIGW 3.0 calls for lifecycle ownership and STQC conformity assessment. Its cybersecurity guidance also points organisations to current CERT-In guidance. Passing a UI review would not make this production-ready by itself.

## Quality-of-life features, ranked

### Build for the hackathon

These directly improve the main journey:

- save and resume;
- a visible saved or offline state;
- evidence labels and upload retry;
- source-linked fact extraction;
- one-click return from a readiness issue to the relevant answer;
- plain summary before the formal complaint;
- versioned generated documents;
- clear mock submission receipt;
- English and Hindi across the complete main journey;
- contextual help with a Control K shortcut; and
- one tested support-request path.

### Add only after the main journey is stable

- voice input for story capture;
- data-saver mode;
- a pictorial evidence guide;
- small downloadable receipt;
- print-friendly complaint review;
- service announcement targeted to one affected step;
- draft expiry warning; and
- a "What changed?" view after editing the generated complaint.

### Explain in the production plan, do not build now

- consent-based helper access;
- Common Service Centre handoff;
- more languages;
- live notifications;
- live Commission template publishing;
- real payment, notarisation, signing, or e-Jagriti submission;
- case tracking and virtual hearings;
- an open public forum; and
- support dashboards for staff.

This ordering is deliberate. Voice, chat, translation, and dashboards look impressive in a demo, but a generated complaint that loses a fact or cannot recover from an upload failure would sink the product.

## Failure states we must demonstrate or test

- unsupported complaint type;
- missing seller address;
- unreadable invoice or uncertain extraction;
- wrong file type or oversized file;
- upload interrupted and retried;
- user leaves and resumes the draft;
- temporary offline state while editing text;
- generated section edited after preview;
- simulated submission times out;
- repeated tap does not create a duplicate complaint; and
- help answer is unavailable or out of date.

At least the missing-address, uncertain-extraction, upload-retry, and submission-timeout states should be visible in the implemented product. The rest require automated or manual coverage before submission.

## What we will measure in testing

The hackathon prototype has no real service volume, so claims should come from task tests, not decorative analytics.

- Five people can explain what the product does after the first screen.
- At least four of five can finish the synthetic complaint without spoken help.
- Every tester can distinguish an extracted suggestion from a confirmed fact.
- Every tester can identify that submission is simulated.
- The complete journey works at 320 CSS pixels and common mobile widths.
- The complete journey works by keyboard and with a screen reader smoke test.
- Draft answers survive refresh and the defined connection-drop test.
- No main screen needs horizontal scrolling.
- Automated accessibility checks have no serious or critical issue on the main route.
- A signed-out browser can open and finish the public demo.

Record each test with device, browser, language, connection profile, result, and issue link.

## Five-day build order

### 23 August

- Freeze the problem, supported complaint, mock inventory, and acceptance criteria.
- Prepare synthetic case fixtures and draft the supported document templates.
- Interview or schedule two target users.

### 24 August

- Record the exact stack and deployment decision.
- Build the responsive shell, scope check, story capture, and draft state.
- Externalise all interface copy for English and Hindi.

### 25 August

- Build evidence upload, extraction review, event timeline, and readiness checks.
- Add offline and interrupted-upload recovery.

### 26 August

- Build complaint review, document previews, mocked declaration, submission, and receipt.
- Add contextual help and one support-request path.

### 27 August

- Complete the reviewed Hindi journey.
- Run mobile, keyboard, screen-reader, slow-network, failure-state, and public-link tests.
- Fix the main route before any optional feature.

### 28 August

- Recheck the official hackathon brief and e-Jagriti help documents.
- Freeze the build by 5:00 PM IST.
- Test every link signed out.
- Record the two-minute video and submit the summary, disclosure, public link, and video before the 8:00 PM deadline.

If the main journey is incomplete on 26 August, cut voice, data-saver controls, visual guides, targeted announcements, and the support ticket in that order. Do not cut honest mock labels, save and resume, readiness checks, or the final receipt.

## Demo story

The first minute should show one transformation:

1. Priya chooses "The product is defective."
2. She uploads a synthetic invoice and two chat screenshots.
3. Nivaran extracts the order, amount, dates, and seller, with every fact linked to a source.
4. The readiness check flags the missing legal address.
5. Priya fixes it and reviews the timeline and refund request.
6. Nivaran prepares the filing pack.
7. Priya submits to the mock Commission and receives `DEMO-CC-2026-0042`.
8. The receipt states that no real filing occurred and tells her what would happen next.

The second minute should explain the fixed template model, deterministic validation, narrow AI role, synthetic data, mobile and low-bandwidth tests, and how a production version would integrate through approved government systems.

## Risks and controls

| Risk | Control |
|---|---|
| Generated legal text is wrong | Restrict the case type, use versioned templates, cite facts, require review, and avoid legal conclusions |
| Commission formats differ | Support one synthetic Commission and show the template version; propose an owned registry for production |
| User thinks a complaint was filed | Label mock actions before and after submission and use an unmistakably fake reference |
| AI invents a fact | Draft only from confirmed records and reject unsupported text in validation |
| Uploaded data leaks | Use only fixtures in the prototype; define encryption, access, retention, and deletion before real use |
| The Hindi journey drifts | Keep strings versioned together and require bilingual review before release |
| Weak connection loses work | Save at each step, show sync state, and test interruption and retry |
| Help becomes stale | Give each item a source, owner, version, and review date |
| Features crowd out completion | Apply the feature gate in the [government-service checklist](government-service-quality-checklist.md) |

## Open questions to close before coding

- Which teammate has direct or interview-based experience with consumer complaint filing?
- Which one synthetic District Commission and template version will the prototype model?
- Which exact document fields can we support without making a legal judgment?
- What file types and size limits will the prototype accept?
- Who will review the Hindi journey?
- What local draft retention period will the prototype disclose?
- Which OpenAI model task is necessary, measurable, and safe enough for the demo?
- Which hosting target can meet the public, signed-out review requirement?

## Sources

- [Build What Moves India builder brief](https://buildwhatmovesindia.com/brief)
- [Build What Moves India FAQ](https://buildwhatmovesindia.com/faq)
- [e-Jagriti FAQ](https://e-jagriti.gov.in/faq)
- [e-Jagriti help documents](https://e-jagriti.gov.in/help-docs)
- [Consumer Complaint filing guide, March 2025](https://e-jagriti.gov.in/static/media/CC_Filing.34e0fc5dd03b1d864cab.pdf)
- [PIB e-Jagriti usage figures, 7 June 2026](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2269994&lang=1&reg=3)
- [GIGW 3.0](https://guidelines.india.gov.in/gigw3/)
- [UX4G application and submission pattern](https://www.ux4g.gov.in/patterns/application-submission)
- [UX4G accessibility foundation](https://www.ux4g.gov.in/foundations/accessibility)
- [UX4G feedback and communication pattern](https://www.ux4g.gov.in/patterns/feedback-communication)

Government requirements, portal behaviour, and accepted formats can change. Recheck the official e-Jagriti material before implementation, user testing, and submission.
