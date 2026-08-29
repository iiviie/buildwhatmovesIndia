# Government digital service scorecard and checklist

Created: 2026-08-24 02:00 IST (UTC+05:30)

Last updated: 2026-08-24 02:00 IST (UTC+05:30)

Status: working outer checklist

Last reviewed: 24 August 2026

Applies to: citizen-facing websites, web applications, and service journeys

## Purpose

This document is the outer quality gate for the project. It asks whether the service works for a citizen, not whether the screens look modern.

Use it at five points:

1. before accepting a feature;
2. while reviewing each completed journey stage;
3. before merging a visible behaviour change;
4. before a public release; and
5. after release when service data or support reports reveal a problem.

The checklist draws on [GIGW 3.0](https://guidelines.india.gov.in/gigw3/) and [UX4G](https://www.ux4g.gov.in/). It does not replace a formal GIGW, STQC, accessibility, privacy, legal, or security review.

## The non-negotiable outcome

A person should be able to discover the right service, understand whether it applies to them, finish the task, recover from a failure, receive proof, and know what happens next.

A site fails this test if it has excellent colours and components but still sends the citizen to an agent, an unexplained PDF, a dead email address, or an office because the digital journey cannot finish.

## Rating method

Score the service out of 100. Each row needs evidence, an owner, and a review date. A confident opinion is not evidence.

| Area | Weight | What earns the points |
|---|---:|---|
| Task completion and clarity | 20 | The main citizen task works from start to proof, uses plain language, and has tested recovery paths |
| Accessibility and inclusive interaction | 15 | The journey meets the accessibility baseline and works with keyboard, screen reader, zoom, and touch |
| Mobile, performance, and reliability | 15 | The task works on small screens and entry-level devices, under weak or interrupted connectivity |
| Language and comprehension | 10 | The complete task works in the supported languages, with reviewed text and no hidden legal jargon |
| Transparency and trust | 10 | Ownership, source, dates, fees, stages, data use, limitations, and service metrics are clear |
| Help, support, and recovery | 10 | Help is contextual, failures are diagnosable, tickets are trackable, and human handoffs are real |
| Privacy and security | 10 | Data collection is limited, protected, retained deliberately, and handled through approved controls |
| Content and machine readability | 10 | Guidance is current, accessible, discoverable, versioned, and usable by people and authorised agents |
| Total | 100 | |

### Rating bands

- 85 to 100: release candidate, if no gate below fails.
- 70 to 84: needs work before a high-stakes public launch.
- Below 70: not ready.

### How to calculate a section score

Give each applicable check one of these values:

- Pass: 1 point.
- Partial: 0.5 points.
- Fail: 0 points.
- Not applicable: excluded, with a written reason.

For each area, divide the points earned by the applicable points, then multiply by the area's weight. Round only the final total. For example, 8 points earned across 10 applicable checks in a 15-point area contributes 12 points. The evidence record must retain the underlying results so two people can reproduce the score.

Do not improve the rating by marking a difficult check as not applicable. The service owner and reviewer must agree on every exclusion.

### Gates that a score cannot hide

The service cannot pass if any of these is true:

- the primary journey cannot finish;
- a citizen can mistake a prototype or failed transaction for an official success;
- a serious or critical accessibility barrier blocks the main journey;
- sensitive data is exposed or sent to an unapproved system;
- the service has no working failure recovery or acknowledgement;
- required help or contact information is knowingly stale;
- the public link does not work in a signed-out browser; or
- a feature shown in the demo is fake but not labelled as fake.

## Evidence record

Keep one row per scored item in the project issue tracker or release record.

| Field | Required entry |
|---|---|
| Check | Stable ID and wording from this document |
| Result | Pass, partial, fail, or not applicable |
| Score | Points earned and possible |
| Evidence | Test, screenshot, trace, metric query, content URL, or audit finding |
| Scope | Page, journey stage, language, device, and user group covered |
| Owner | Named person or team responsible |
| Tested | Date and build or content version |
| Follow-up | Issue link, due date, and retest result |

Publish the public-facing part of this record as a service quality page. Keep security-sensitive findings and personal data out of the public view.

## 1. Problem and scope

- [ ] `PROB-01` One sentence names the citizen, their goal, and the obstacle.
- [ ] `PROB-02` Evidence comes from current official instructions plus direct user experience or interviews.
- [ ] `PROB-03` The team can describe the current workaround and its cost in time, money, travel, privacy, or missed service.
- [ ] `PROB-04` The supported and unsupported cases are visible before data entry begins.
- [ ] `PROB-05` The journey has a clear start, finish, and proof of completion.
- [ ] `PROB-06` The interface does not promise to solve a capacity, policy, or backend problem that software cannot fix.
- [ ] `PROB-07` The service works for the primary citizen before an admin dashboard is built.
- [ ] `PROB-08` The team has named what will remain manual, assisted, or offline.

## 2. Main journey and forms

- [ ] `FORM-01` The journey asks only for information needed for the service.
- [ ] `FORM-02` Questions follow the citizen's mental model, not the database schema or office hierarchy.
- [ ] `FORM-03` One main question or one coherent group appears at a time on mobile.
- [ ] `FORM-04` Every input has a visible label, example where needed, and reason for collection.
- [ ] `FORM-05` Required and optional fields are distinguishable in text.
- [ ] `FORM-06` The interface uses the right mobile keyboard and browser autocomplete token where safe.
- [ ] `FORM-07` Validation waits until the citizen has had a fair chance to answer.
- [ ] `FORM-08` Errors appear in a summary and beside the relevant field.
- [ ] `FORM-09` Error text says what happened, what remains saved, and what to do next.
- [ ] `FORM-10` Back navigation does not erase correct answers.
- [ ] `FORM-11` The citizen can save, leave, resume, and understand draft expiry.
- [ ] `FORM-12` The final review groups information the way the resulting service record or document will use it.
- [ ] `FORM-13` A destructive or irreversible action has a clear review and confirmation step.
- [ ] `FORM-14` Repeated taps cannot create duplicate submissions or payments.
- [ ] `FORM-15` Completion produces a selectable, printable, and downloadable reference.

## 3. Documents and uploads

- [ ] `DOC-01` Required documents are listed before the citizen starts.
- [ ] `DOC-02` Each document has a plain description and a visual example with equivalent text where useful.
- [ ] `DOC-03` Accepted type, maximum size, page limit, and image-quality needs appear before file selection.
- [ ] `DOC-04` Camera capture and file selection both work on supported mobile devices.
- [ ] `DOC-05` Upload progress is visible and announced to assistive technology.
- [ ] `DOC-06` Failed uploads can retry without losing completed work.
- [ ] `DOC-07` The citizen can preview, replace, remove, and label each file.
- [ ] `DOC-08` The original upload remains unchanged when the system creates thumbnails, OCR text, or compressed copies.
- [ ] `DOC-09` Any extracted value is shown beside its source and requires confirmation when uncertain.
- [ ] `DOC-10` The system never invents a missing document or fact.
- [ ] `DOC-11` Generated documents show their template version, source, creation date, and remaining action.
- [ ] `DOC-12` HTML guidance exists for any PDF that a citizen must understand. The PDF itself is accessible and tagged when it is a required output.

## 4. Plain language and comprehension

- [ ] `LANG-01` Headings describe the task, not the department's internal module name.
- [ ] `LANG-02` Sentences are short enough to read once on a phone.
- [ ] `LANG-03` Legal or technical terms have an immediate plain explanation.
- [ ] `LANG-04` Buttons name the action and result. Avoid vague labels such as "Proceed" when "Review complaint" is clearer.
- [ ] `LANG-05` Dates use an unambiguous format with the month written as a word where space permits.
- [ ] `LANG-06` Amounts state the currency and fee basis.
- [ ] `LANG-07` Instructions do not rely on colour, position, shape, sound, or an illustration alone.
- [ ] `LANG-08` Content has been tested with people who have not learned the department's vocabulary.
- [ ] `LANG-09` A short summary appears before a long formal or legal document.
- [ ] `LANG-10` The citizen can tell the difference between a requirement, suggestion, warning, and status.

## 5. Multilingual service

- [ ] `I18N-01` A prominent language control appears in a consistent location.
- [ ] `I18N-02` The chosen language persists across pages, errors, help, receipts, and notifications.
- [ ] `I18N-03` Every supported language completes the same main journey.
- [ ] `I18N-04` Unicode, page `lang`, passage language, and text direction are correct.
- [ ] `I18N-05` A fluent human reviews high-impact copy before release.
- [ ] `I18N-06` Content owners update language versions together.
- [ ] `I18N-07` A missing translation has a clear fallback and does not create an empty or broken action.
- [ ] `I18N-08` Search accepts common spelling and transliteration variants where user research supports them.
- [ ] `I18N-09` Numbers, dates, names, and addresses remain editable after translation or transliteration.
- [ ] `I18N-10` Machine translation is labelled until a human approves it.

Do not advertise a language because the homepage has been translated. Rate the complete task in that language.

## 6. Disability access

GIGW 3.0 uses WCAG 2.1 Level AA as its accessibility baseline. The current [UX4G accessibility guidance](https://www.ux4g.gov.in/foundations/accessibility) also stresses semantic HTML, keyboard operation, clear form errors, and screen-reader testing.

- [ ] `A11Y-01` The page has correct landmarks, heading order, titles, and language metadata.
- [ ] `A11Y-02` Native links, buttons, inputs, lists, and tables are used before custom controls.
- [ ] `A11Y-03` Every action works by keyboard with a visible focus indicator.
- [ ] `A11Y-04` Focus moves predictably after navigation, validation, modal opening, and completion.
- [ ] `A11Y-05` Text and interactive controls meet contrast requirements in every state.
- [ ] `A11Y-06` Content reflows at 320 CSS pixels and 200 percent zoom without loss or two-dimensional scrolling, except where the content truly needs it.
- [ ] `A11Y-07` Touch targets are at least 44 by 44 CSS pixels.
- [ ] `A11Y-08` Images have useful alternative text or empty alternative text when decorative.
- [ ] `A11Y-09` Videos have captions and a text transcript. Audio-only guidance has a text equivalent.
- [ ] `A11Y-10` Status, upload progress, errors, and saved-state changes are announced without stealing focus.
- [ ] `A11Y-11` Time limits can be extended or disabled unless the task makes that impossible.
- [ ] `A11Y-12` Motion respects the reduced-motion setting, and nothing flashes dangerously.
- [ ] `A11Y-13` The main journey passes manual keyboard, screen-reader, zoom, and touch tests.
- [ ] `A11Y-14` Automated tools supplement manual testing. They do not replace it.
- [ ] `A11Y-15` Any accessibility preference panel supplements an accessible base interface.

Test with real disabled users when possible. A compliance badge is not proof that a person can finish the task.

## 7. Mobile, weak networks, and shared devices

- [ ] `NET-01` The team defines the oldest supported browser, smallest width, entry-level device profile, and test connection.
- [ ] `NET-02` The main page delivers useful content before optional media and assistant code.
- [ ] `NET-03` System fonts or a small, subsetted font avoid a large font download.
- [ ] `NET-04` Images have explicit dimensions, compression, responsive sizes, and lazy loading when below the fold.
- [ ] `NET-05` No decorative video, animation, map, or chat bundle blocks the main task.
- [ ] `NET-06` A visible low-data setting removes nonessential previews, motion, and media.
- [ ] `NET-07` The default stays usable when browser network hints are missing or wrong.
- [ ] `NET-08` Draft changes survive a defined connection drop and resynchronise visibly.
- [ ] `NET-09` Uploads can retry or resume without restarting the form.
- [ ] `NET-10` Long operations show progress, safe cancellation, and what remains saved.
- [ ] `NET-11` Refresh and back navigation recover the current task safely.
- [ ] `NET-12` A shared-device user can sign out, clear local data, and understand what remains on the device.
- [ ] `NET-13` The service offers a small receipt or reference that can be written down, printed, or saved.
- [ ] `NET-14` An assisted or offline route gives the office or centre, hours, required documents, and reference to carry.
- [ ] `NET-15` Performance tests cover the full task, not only the homepage.

Set numeric performance budgets when the implementation stack is chosen. Measure transferred bytes, JavaScript, largest render, interaction delay, layout shift, API latency, upload failures, and completion under the agreed mobile profile.

## 8. Help and support

The [GIGW guidance](https://guidelines.india.gov.in/guidelines/) calls for help linked consistently across pages, complete contact information, and a mechanism for timely responses to feedback. UX4G provides patterns for contextual status, help centres, complaints, support channels, service centres, and language switching.

- [ ] `HELP-01` Each difficult step has a visible "Help with this step" action.
- [ ] `HELP-02` Help explains why the information is needed and shows a valid example.
- [ ] `HELP-03` Help content has a source, owner, version, review date, and next review date.
- [ ] `HELP-04` Search uses citizen words and common error text, not only department terms.
- [ ] `HELP-05` Stable error codes connect interface errors, support articles, logs, and tickets.
- [ ] `HELP-06` Contact details include channel, purpose, hours, expected response, and accessibility options.
- [ ] `HELP-07` A submitted support request receives a reference and trackable status.
- [ ] `HELP-08` The support form carries the journey stage and safe diagnostics so the citizen does not repeat everything.
- [ ] `HELP-09` The interface explains when staff cannot solve the underlying policy or case decision.
- [ ] `HELP-10` Escalation rules name the next owner and response target.
- [ ] `HELP-11` A phone or in-person handoff says what documents and reference to carry.
- [ ] `HELP-12` Support analytics feed content and product fixes, with personal details removed.
- [ ] `HELP-13` A citizen can report an inaccessible page or document.
- [ ] `HELP-14` Dead inboxes, fake live chat, and untracked contact forms fail the release gate.

### Contextual command panel

A Control K panel can unify navigation and help for experienced users. It should remain an accelerator, not a hidden requirement.

- [ ] A visible help or search control opens the same panel.
- [ ] Results are scoped to the current task first.
- [ ] Commands use citizen language, such as "replace invoice" or "check what is missing."
- [ ] Keyboard, touch, voice, and screen-reader use reach the same actions.
- [ ] Answers cite an approved source and its review date.
- [ ] The panel can create a support handoff when content is insufficient.
- [ ] The citizen can close it and complete every task without it.

## 9. Visual guides, FAQs, forums, and announcements

### Visual guidance

- [ ] `VIS-01` Use a picture only when it explains a document, physical step, or sequence better than text.
- [ ] `VIS-02` Prefer light SVG, HTML diagrams, or compressed still images over video.
- [ ] `VIS-03` Every visual has equivalent text and works without colour.
- [ ] `VIS-04` Images show realistic Indian devices, documents, and contexts without stereotypes.
- [ ] `VIS-05` A user can zoom the guide without losing the surrounding instruction.

### Frequently asked questions

- [ ] `FAQ-01` Questions come from support logs, search terms, interviews, and observed mistakes.
- [ ] `FAQ-02` Each answer links back to the relevant task step.
- [ ] `FAQ-03` Answers show source and last review date.
- [ ] `FAQ-04` Old answers redirect or archive cleanly when a rule changes.
- [ ] `FAQ-05` Search engines and assistive technology can read the answer as HTML.

### Forums

- [ ] `FORUM-01` The service has a staffed moderation and correction policy before opening user posts.
- [ ] `FORUM-02` Personal identifiers and case documents cannot be posted accidentally.
- [ ] `FORUM-03` Legal, medical, financial, or eligibility claims receive clear boundaries and an official source.
- [ ] `FORUM-04` Abuse reporting, appeals, archival, and account controls have owners.
- [ ] `FORUM-05` A moderated knowledge base has been considered before an open forum.

Most small government-service teams should start with moderated, anonymised answers to repeated questions. An empty or unmoderated forum makes support worse.

### Announcements

- [ ] `NEWS-01` Each notice states who is affected, what changed, when, and what action to take.
- [ ] `NEWS-02` A notice appears at the relevant journey stage, not everywhere.
- [ ] `NEWS-03` Publication, effective, expiry, and archive dates are stored.
- [ ] `NEWS-04` Language versions publish together.
- [ ] `NEWS-05` Critical notices are accessible and cannot depend on a moving ticker, carousel, colour, or modal alone.
- [ ] `NEWS-06` Citizens can subscribe only with clear consent and channel controls.

## 10. Transparency and trust

- [ ] `TRUST-01` Every important page names the owning organisation or, for a prototype, the independent team.
- [ ] `TRUST-02` Prototype, pilot, beta, mock, and live states use unambiguous labels.
- [ ] `TRUST-03` The service lists steps, expected time, fees, dependencies, and completion proof before the citizen starts.
- [ ] `TRUST-04` Each rule, form, fee, and help answer has a source and last-reviewed date.
- [ ] `TRUST-05` External links say where they lead and whether the destination is outside government control.
- [ ] `TRUST-06` A public change log explains material updates.
- [ ] `TRUST-07` Service status shows incidents, planned maintenance, and recovery updates.
- [ ] `TRUST-08` A public metrics page defines every measure, date range, source, owner, and exclusions.
- [ ] `TRUST-09` Metrics map to journey stages so citizens and teams can locate the problem.
- [ ] `TRUST-10` The site never uses a vanity percentage without numerator, denominator, and time window.
- [ ] `TRUST-11` Known accessibility barriers and workarounds are published until fixed.
- [ ] `TRUST-12` Contact, privacy, terms, accessibility, content ownership, archival, and correction policies are findable.
- [ ] `TRUST-13` The interface distinguishes a successful request, queued request, rejected request, and failed request.
- [ ] `TRUST-14` A status label explains who owns the next action and by when.

### Public service metrics template

| Metric | Definition | Journey stage | Owner | Update frequency | Privacy threshold | Current value | Evidence link |
|---|---|---|---|---|---|---|---|
| Example: upload success | Completed uploads divided by upload attempts, excluding user cancellation | Evidence | Platform operations | Daily | Publish only above the agreed sample | To measure | Dashboard query |

The site score itself should be public when possible. Publish the section score, failed checks, evidence date, owner, remediation date, and prior scores. A green badge without the underlying matrix weakens transparency.

## 11. Privacy, security, and safety

- [ ] `SAFE-01` Each collected field has a documented purpose and owner.
- [ ] `SAFE-02` The service collects the minimum data needed for the task.
- [ ] `SAFE-03` Consent is specific, readable, recorded, and withdrawable where applicable.
- [ ] `SAFE-04` Sensitive values do not appear in URLs, analytics, logs, screenshots, or support tickets.
- [ ] `SAFE-05` Data is encrypted in transit and protected at rest under approved controls.
- [ ] `SAFE-06` Access follows least privilege and produces an audit record.
- [ ] `SAFE-07` Retention and deletion periods exist for drafts, uploads, records, logs, and backups.
- [ ] `SAFE-08` Shared-device and session-expiry behaviour is safe and understandable.
- [ ] `SAFE-09` Uploads use type checks, size limits, malware scanning, and isolated processing in production.
- [ ] `SAFE-10` Rate limits and abuse controls do not lock out legitimate low-bandwidth users without recovery.
- [ ] `SAFE-11` Dependencies, public APIs, and data-sharing agreements are approved and documented.
- [ ] `SAFE-12` The system has incident response, backup, recovery, and communication plans.
- [ ] `SAFE-13` Security testing uses an approved environment and scope.
- [ ] `SAFE-14` The project never accesses a live government system through an undocumented route.
- [ ] `SAFE-15` Synthetic data is unmistakable and cannot be confused with a real citizen record.

Security and privacy requirements change. A production team must verify current law, department policy, GIGW, and CERT-In guidance with the responsible officials and auditors.

## 12. Responsible AI and agent-readable guidance

### AI used inside the service

- [ ] `AI-01` A written reason explains why AI is better than a rule, search, or fixed template for this task.
- [ ] `AI-02` The model receives only the minimum approved data.
- [ ] `AI-03` The interface distinguishes user facts, extracted suggestions, generated text, and official records.
- [ ] `AI-04` Generated facts link to their source and uncertain values require confirmation.
- [ ] `AI-05` Deterministic rules check required fields, permissions, formats, totals, and allowed states.
- [ ] `AI-06` A person can edit, reject, or bypass the model output.
- [ ] `AI-07` High-stakes advice, eligibility, legal conclusions, and final decisions remain outside the model's authority.
- [ ] `AI-08` The product has a safe response when the source is missing, conflicting, or stale.
- [ ] `AI-09` Evaluations cover hallucination, source fidelity, language, disability, and adversarial input.
- [ ] `AI-10` The team logs model, prompt, content version, result, and user correction without retaining unnecessary personal data.
- [ ] `AI-11` Cost, latency, outage, and provider fallback are part of the service design.
- [ ] `AI-12` The citizen knows when AI was used and what remains their responsibility.

### Guidance for external assistants and search tools

- [ ] `AGENT-01` Important guidance is public HTML, not trapped only in scans, images, or client-only widgets.
- [ ] `AGENT-02` Every task has a stable URL, descriptive title, headings, language, owner, and update date.
- [ ] `AGENT-03` `sitemap.xml`, canonical URLs, redirects, and the crawling policy are maintained.
- [ ] `AGENT-04` Established structured data is used only when it matches visible page content.
- [ ] `AGENT-05` A versioned public service manifest exposes approved eligibility, document, fee, stage, contact, and source data.
- [ ] `AGENT-06` A machine-readable change log identifies changed fields and effective dates.
- [ ] `AGENT-07` Human pages, assistant answers, downloadable documents, and public data publish from the same approved source.
- [ ] `AGENT-08` Public assistant access cannot reveal private records, bypass login, or perform a transaction without explicit user action and approved authentication.
- [ ] `AGENT-09` Answers include source links, content version, and update date.
- [ ] `AGENT-10` The content owner can withdraw or correct a bad answer across every channel.

Do not add an AI chat box to compensate for poor navigation or missing documentation. Fix the content first. The assistant should make current guidance easier to use, not become the only place it exists.

## 13. Content operations

GIGW 3.0 assigns lifecycle responsibilities and calls for content review, archival, monitoring, contingency, security, privacy, and moderation policies.

- [ ] `OPS-01` A named web information or service owner is accountable for the site.
- [ ] `OPS-02` Each page, template, contact, fee, rule, and translation has an owner.
- [ ] `OPS-03` Content uses create, review, approve, publish, expire, archive, and correct states.
- [ ] `OPS-04` Time-sensitive content expires or archives automatically.
- [ ] `OPS-05` Language versions update together and drift creates an alert.
- [ ] `OPS-06` Broken links, missing pages, expired certificates, failed jobs, and stale content are monitored.
- [ ] `OPS-07` No "under construction" link appears in a released task.
- [ ] `OPS-08` Contact details and support routes are checked on a fixed schedule.
- [ ] `OPS-09` A correction policy tells citizens how to report inaccurate content.
- [ ] `OPS-10` Release notes name citizen-facing changes and any action required.
- [ ] `OPS-11` Staff can preview accessibility, language, mobile, and archive states before publishing.
- [ ] `OPS-12` The team has enough staff and service targets for every channel it advertises.

## 14. Monitoring, reliability, and recovery

- [ ] `REL-01` Uptime, latency, errors, queues, failed notifications, and integration health are monitored.
- [ ] `REL-02` Alerts map a technical failure to the affected citizen journey stage.
- [ ] `REL-03` Error messages use a stable code that support staff can search.
- [ ] `REL-04` Dependency failure has a queued, retry, save-for-later, or alternate route.
- [ ] `REL-05` The citizen can distinguish saved locally, saved to the service, queued, submitted, and failed.
- [ ] `REL-06` Status pages and incident notices use plain language and timestamps.
- [ ] `REL-07` Backups and restoration are tested, not merely configured.
- [ ] `REL-08` A contingency plan covers authentication, payment, upload, notification, and core system outages.
- [ ] `REL-09` Maintenance does not destroy an in-progress draft.
- [ ] `REL-10` Operational teams run a post-incident review and track citizen harm, not only server recovery.

## 15. Realistic government deployment

- [ ] `GOV-01` The owning organisation, service owner, content owner, security owner, support owner, and data owner are named.
- [ ] `GOV-02` The proposal maps every interface promise to a backend process and responsible team.
- [ ] `GOV-03` The system uses documented and approved government integrations only.
- [ ] `GOV-04` Hosting, domain, certificates, security audit, logging, backup, and disaster recovery decisions are approved.
- [ ] `GOV-05` GIGW 3.0 conformity and the applicable STQC process are planned from design, not added at launch.
- [ ] `GOV-06` Current CERT-In and department security requirements are verified.
- [ ] `GOV-07` Procurement and licence terms permit every library, model, font, icon, image, and service used.
- [ ] `GOV-08` The design system can be maintained without one vendor or a fragile custom widget.
- [ ] `GOV-09` Manual review queues have staffing, service targets, escalation, and audit tools.
- [ ] `GOV-10` A pilot has a limited audience, rollback criteria, support plan, and public limitations.
- [ ] `GOV-11` Accessibility and language testing recur after launch.
- [ ] `GOV-12` The department can export its content, templates, public metrics, and audit records in documented formats.

## 16. Anti-bloat feature gate

Before adding a feature, answer every question:

1. Which named citizen problem does it solve?
2. Which stage of the main journey becomes faster, clearer, safer, or more reliable?
3. Can a citizen complete it end to end in the deployed build?
4. What happens when the feature, model, network, or dependency fails?
5. Does the service remain usable without discovering this feature?
6. Does it work at 320 CSS pixels, by keyboard, with a screen reader, and under the test network?
7. What extra download, latency, support, moderation, privacy, and operational work does it add?
8. Who owns its content and production operation?
9. Is every mock or limitation visible before the citizen relies on it?
10. Can its value be proved in the two-minute demo or a user test?

If questions 1 through 5 do not have specific answers, cut the feature. If questions 6 through 9 reveal work that cannot be completed before release, move it to the production plan.

## 17. Release checks for this hackathon

- [ ] `HACK-01` The problem matches the official builder brief and one teammate can explain their direct connection to it.
- [ ] `HACK-02` One citizen journey works from start to finish.
- [ ] `HACK-03` Every visible demo feature works.
- [ ] `HACK-04` Mobile, weak-network, accessibility, and limited-digital-experience cases have test evidence.
- [ ] `HACK-05` All identities, files, credentials, OTPs, payments, references, and government responses are synthetic.
- [ ] `HACK-06` No live government system, private API, or restricted data is accessed.
- [ ] `HACK-07` The product is labelled as an independent prototype and does not imply endorsement.
- [ ] `HACK-08` Mock integrations and limitations appear in the product and submission.
- [ ] `HACK-09` Codex contributions and all other tools, assets, libraries, templates, models, and data sources are recorded.
- [ ] `HACK-10` The public link opens and completes in a signed-out browser.
- [ ] `HACK-11` The video is public, no longer than two minutes, and spends its first minute on the citizen journey.
- [ ] `HACK-12` The summary stays under 250 words.
- [ ] `HACK-13` The official brief, FAQ, and chosen service guidance have been rechecked for changes.
- [ ] `HACK-14` Every link and synthetic credential has been retested before submission.

## Definition of done for one journey

A journey is done only when:

- the supported citizen can start without private instructions;
- every required action works in the public build;
- answers and uploads survive the agreed interruption tests;
- errors state a tested recovery route;
- the citizen can review and correct their information;
- the final action cannot happen accidentally or twice;
- the result has a clear reference, status, owner, and next step;
- the result is honest about mocks and external dependencies;
- English and Hindi versions of the main route have been reviewed;
- mobile, keyboard, screen reader, zoom, and weak-network tests pass;
- security and privacy checks find no release-blocking issue; and
- the evidence record links to the test results.

## Sources and baseline references

- [GIGW 3.0](https://guidelines.india.gov.in/gigw3/)
- [GIGW detailed guidelines](https://guidelines.india.gov.in/guidelines/)
- [GIGW conformity matrix](https://guidelines.india.gov.in/annexure-ii-matrix-to-check-conformity/)
- [GIGW focus areas](https://guidelines.india.gov.in/focus-areas/)
- [UX4G Design System](https://www.ux4g.gov.in/)
- [UX4G accessibility foundation](https://www.ux4g.gov.in/foundations/accessibility)
- [UX4G application and submission pattern](https://www.ux4g.gov.in/patterns/application-submission)
- [UX4G feedback and communication pattern](https://www.ux4g.gov.in/patterns/feedback-communication)
- [Build What Moves India builder brief](https://buildwhatmovesindia.com/brief)
- [Build What Moves India FAQ](https://buildwhatmovesindia.com/faq)

Treat this as a living control document. When a real failure occurs, add the check that would have caught it, assign an owner, and use the same check in regression review.
