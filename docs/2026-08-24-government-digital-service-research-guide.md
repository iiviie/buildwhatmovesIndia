# What makes a good government digital service

Created: 2026-08-24 02:00 IST (UTC+05:30)

Last updated: 2026-08-24 02:00 IST (UTC+05:30)

Status: planning reference

Research date: 24 August 2026

Applies to: citizen-facing public-service websites, transactional services, and the e-Jagriti prototype

Related control document: [Government digital service scorecard and checklist](2026-08-24-government-service-quality-checklist.md)

## Executive finding

A good government website is not primarily a good-looking website. It is a reliable part of a public service.

A person should be able to:

1. find the right service without knowing the department structure;
2. understand whether the service applies to them;
3. know the documents, cost, time, and consequences before starting;
4. finish the task on the device and connection available to them;
5. correct mistakes and recover from interruptions;
6. receive proof of what happened;
7. know the current status, next action, owner, and expected time; and
8. get effective help through another channel when digital self-service is not enough.

The page can meet a design checklist and still fail this test. It can also look old-fashioned and still serve a task well. Visual quality matters when it improves reading, hierarchy, predictability, touch use, accessibility, or trust. Fashion is not the outcome.

There is no single trustworthy worldwide ranking of individual government websites by overall usability. The available evidence measures different things:

- Indian conformance and certification;
- automated website quality;
- availability and maturity of online services;
- real-world page performance;
- country-level digital-government capacity; or
- the success of one citizen task.

These measures should not be collapsed into one league table. For this project, use a layered benchmark:

1. **Indian baseline:** GIGW 3.0, UX4G, and the applicable STQC process.
2. **Technical health:** accessibility, performance, security, mobile behaviour, and content checks.
3. **Journey outcome:** completion, time, errors, recovery, comprehension, and satisfaction.
4. **Inclusion:** repeat the journey under language, disability, device, bandwidth, confidence, and assisted-service conditions.
5. **Operations:** reliability, support, status communication, content ownership, and continuous improvement.

## What was researched

This review uses primary sources from the Government of India, W3C, and the governments of the United Kingdom, United States, Australia, Canada, New Zealand, Singapore, and the European Union. It also reviews the UN E-Government Survey, World Bank GovTech Maturity Index, OECD Digital Government Index, Silktide Index, Chrome UX Report, and HTTP Archive.

Official standards and documented service examples were preferred over opinion articles. A government describing its own portal as a best practice is recorded as official recognition, not independent proof that every user or journey succeeds.

The research separates:

- formal requirements from recommended practice;
- automated findings from human evaluation;
- a homepage from a complete transaction;
- the number of services online from their usability;
- a current measurement from an old snapshot; and
- a country-level system score from an individual website score.

No live government account, personal data, payment, OTP, private API, or restricted system was used.

## The unit of quality is the service, not the homepage

Three related objects need different tests.

| Object | Question | Useful evidence |
|---|---|---|
| Website | Can a person find, read, and operate the public interface? | accessibility audit, content review, mobile test, performance scan, search and navigation test |
| Digital journey | Can the person complete one task and recover from likely failures? | observed task completion, time on task, error rate, abandonment stage, receipt and status test |
| Public service | Does the whole organisation deliver the promised result across digital and assisted channels? | processing time, fulfilment rate, support resolution, appeal or escalation, service uptime, citizen outcome |

This distinction prevents three common mistakes:

- awarding a portal for a polished homepage while its transaction is broken;
- counting a linked PDF or departmental redirect as an online service; and
- assuming that putting a form online fixes policy delays, manual queues, staffing, or poor case handling.

For e-Jagriti, the unit of design is the consumer complaint journey from understanding the route to receiving a mock acknowledgement and knowing what happens next.

## The common standard across governments

The language differs by country, but the strongest public standards converge on the same ideas. The [UK Service Standard](https://www.gov.uk/service-manual/service-standard) asks teams to understand users, solve a whole problem, join channels, include everyone, protect privacy, publish performance, and operate reliably. [Australia's Digital Service Standard](https://www.digital.gov.au/policy/digital-experience/digital-service-standard) uses ten criteria including knowing the user, leaving no one behind, connecting services, building trust, doing no harm, monitoring, and keeping the service relevant. [Canada's Digital Standards](https://www.canada.ca/en/government/system/digital-government/government-canada-digital-standards.html) add open work, ethical services, data stewardship, and accessibility from the start. [New Zealand's standard](https://www.digital.govt.nz/standards-and-guidance/digital-service-design-standard) adds equitable delivery, full-lifetime operation, public accountability, and local constitutional and cultural context.

### 1. Start with an observed user need

Good practice:

- name the person, goal, obstacle, and harm;
- observe what people currently do, including workarounds and paid intermediaries;
- distinguish a content problem from a transaction, policy, or operations problem;
- test assumptions with people who do not know the department's vocabulary; and
- keep the first release to one complete high-value task.

Evidence should include direct research, support reports, search terms, complaint records, service analytics, or repeated errors. Traffic alone does not prove importance. A low-volume service can be critical to the people who need it.

### 2. Solve the whole task

A citizen's goal rarely matches one department or one screen. The service should cover discovery, eligibility, preparation, submission, proof, tracking, help, and resolution. If another office or channel owns a step, the handoff must state what to carry, what happens there, and whether completed information is preserved.

Do not call a journey complete because a form was submitted. The person needs a reference, a truthful state such as draft, queued, submitted, rejected, or completed, and the next action.

### 3. Organise around citizen tasks and life events

Navigation should use phrases people search or say, such as "file a consumer complaint" or "replace a rejected invoice", not internal directorate, act, scheme, or module names.

Good information architecture provides:

- a stable start page for each important task;
- more than one way to find it, including search and sensible categories;
- a short answer before a long legal explanation;
- related steps shown in their actual order; and
- a clear distinction between guidance, a form, a case, a notice, and a decision.

Life-event organisation can join services across agencies, but it should not create a large portal that merely adds another navigation layer.

### 4. Explain the service before asking for data

Before the start action, state:

- who can use the route and important exclusions;
- what the service will and will not do;
- the information and evidence needed;
- likely time to fill the form and likely processing time;
- any fee, refund, or payment condition;
- what proof the person receives;
- privacy consequences that change a decision; and
- available online, phone, in-person, and accessible alternatives.

The [GOV.UK register-to-vote start page](https://www.gov.uk/register-to-vote) is a useful reference because it states purpose, alternate cases, an estimated five minutes, the main identifier requested, paper and assisted routes, and what happens afterwards. Its policy and identity assumptions should not be copied into an Indian service.

### 5. Ask less and make forms forgiving

Every question should have a documented purpose. Ask in an order that makes sense to the citizen, not in database order. Preserve correct answers, allow review, and explain errors beside the field and in a summary.

For longer or document-heavy services:

- save drafts automatically;
- state where the draft is saved and when it expires;
- support back navigation and resumption;
- show upload rules before file selection;
- allow camera capture, preview, replacement, and retry;
- prevent duplicate submission; and
- provide a final review before a legal, financial, or irreversible action.

One main question or one coherent group per mobile screen often reduces error and makes recovery easier. It is a pattern, not a rigid rule.

### 6. Use plain, specific language

Plain language does not remove legal accuracy. It gives the short operational answer first and links to the full authority.

- Headings should describe the task.
- Buttons should name the result, such as "Review complaint" rather than "Proceed".
- Unavoidable legal terms should receive an immediate plain explanation.
- Dates, money, waiting periods, and eligibility should be unambiguous.
- Instructions should not depend on an icon, colour, position, picture, sound, or acronym alone.
- Each rule should identify its source, owner, and last review date.

Illustrations are useful for recognising a document, taking a valid photograph, or understanding a sequence. They are not a substitute for accessible text and should not add a large download to every page.

### 7. Build accessibility into the base service

[GIGW 3.0](https://guidelines.india.gov.in/gigw3/) uses WCAG 2.1 Level AA as its baseline. This project should use [WCAG 2.2 Level AA](https://www.w3.org/TR/WCAG22/) as its engineering target while retaining the GIGW 3.0 conformity requirements. W3C states that WCAG 2.2 extends 2.1 and that content conforming to 2.2 also conforms to 2.1.

The base interface should provide:

- correct document language, landmarks, headings, labels, and control semantics;
- keyboard operation and visible focus;
- screen-reader-readable errors, progress, saved state, and status changes;
- sufficient contrast without relying on a high-contrast widget;
- reflow at 320 CSS pixels and at zoom;
- usable touch targets;
- captions, transcripts, and text alternatives;
- predictable help and navigation;
- enough time, accessible authentication, and no forced dragging; and
- manual tests across the whole journey.

An accessibility toolbar can expose preferences, but it cannot repair incorrect HTML, an inaccessible document, keyboard traps, or an unusable process. Automated scans can find only part of WCAG. Disabled people must be included in research and testing when possible.

### 8. Treat language as service parity

India's language needs cannot be met by translating only the homepage or by offering an unreviewed machine translation of legal guidance.

For every supported language:

- the start page, questions, errors, help, receipt, status, and notices should all work;
- the language control should be prominent, consistent, and persistent;
- Unicode, page language, passage language, and text direction should be correct;
- high-impact text should be reviewed by a fluent person;
- updates should publish together or show an honest, time-bound fallback;
- names, addresses, dates, amounts, and uploaded evidence should not be corrupted by translation; and
- search should account for common spelling and transliteration variants where research supports them.

Language scope should follow the service's legal duties and actual audience. A national production service needs a deliberate coverage plan with accountable content owners. A hackathon prototype should deliver a smaller set completely. For this project, English and Hindi are the proposed complete demonstration languages; this is a prototype boundary, not a claim that two languages are sufficient for India.

Reading difficulty is separate from language choice. Test short instructions, unfamiliar legal concepts, numbers, and status messages with people who have limited formal education or digital confidence.

### 9. Design for mobile, low bandwidth, and interrupted use

A responsive layout is only the starting point. The service must remain useful on a small, lower-powered phone, under weak or intermittent connectivity, and with a limited data plan.

Good practice:

- deliver task text and controls before optional media or assistant code;
- use semantic HTML and progressive enhancement so core guidance survives a script failure;
- avoid decorative video, carousels, heavy fonts, maps, and chat bundles on the main path;
- compress and size images, and load below-the-fold media only when needed;
- preserve form state through refresh, back navigation, and a defined connection drop;
- retry or resume uploads without restarting the form;
- distinguish saved on device, saved to service, queued, submitted, and failed;
- offer a small receipt that can be saved, printed, or written down; and
- test the whole journey, not only the homepage.

The [UK performance guidance](https://www.gov.uk/service-manual/technology/how-to-test-frontend-performance) notes that slow pages cost data and battery and exclude people on older devices or poor connections. [Progressive enhancement guidance](https://www.gov.uk/service-manual/technology/using-progressive-enhancement) treats script and network failure as normal conditions to test.

Numeric budgets should be chosen after the technology stack is selected. They should cover transferred bytes, JavaScript, largest render, interaction delay, layout shift, API response, upload failure, and completion under the agreed Indian mobile profile. A "low-data mode" is useful only if the default is already light and the setting is visible.

### 10. Provide real support and assisted routes

Some people lack access, confidence, trust, literacy, privacy, or the evidence needed for digital self-service. Support is part of the service, not a footer link.

Good support provides:

- help at the difficult step, using the same terms as the form;
- contact channel, purpose, hours, expected response, and accessibility options;
- a reference and status for each support request;
- safe transfer of journey context so the citizen does not repeat everything;
- a named escalation route and response target;
- exact instructions for phone, office, or service-centre handoff; and
- a feedback loop from support issues into product and content changes.

Assisted service should not require a citizen to give their password or OTP to an intermediary. A production system would need a safe delegated or service-centre model with consent, limited authority, and audit records.

A help command panel or assistant can speed up navigation for experienced users. It must have a visible touch route, work by keyboard and screen reader, cite current approved sources, and never be the only way to find or complete a task.

### 11. Make status and announcements precise

A visible banner is not enough. A useful notice states:

- who is affected;
- what changed;
- what action, if any, is required;
- publication, effective, and expiry dates;
- which journey stages are affected; and
- where to get current status or help.

Place critical notices at the relevant step and on a service-status page. Do not depend on a moving ticker, carousel, colour, modal, social post, or scanned PDF. Archive expired notices and keep a change log for material service changes.

Status must distinguish draft, saved, queued, submitted, under review, action required, rejected, completed, and failed. Each state should say who owns the next action and the expected time.

### 12. Earn trust through restraint and evidence

A public service has coercive and high-stakes characteristics that a consumer product may not. Trust requires:

- clear ownership and an authentic domain in a real deployment;
- an unambiguous independent-prototype label in this hackathon;
- minimum data collection and clear purpose;
- no sensitive values in URLs, analytics, logs, or support messages;
- proportionate authentication rather than friction for its own sake;
- visible source, content date, service limitations, fee, and processing expectation;
- correction, appeal, complaint, and incident routes; and
- honest disclosure of mocks, queues, dependencies, and failures.

Security controls must protect people without silently excluding them. Privacy and security review, retention, access control, incident response, and safe shared-device behaviour are production requirements, not optional polish.

### 13. Operate the service after launch

Government content and transactions change because policy, fees, forms, staff, deadlines, and dependencies change. A quality interface cannot remain good without operations.

Each page, translation, form, contact, fee, rule, and notice needs an owner and review cycle. The service should monitor broken links, stale content, certificates, uptime, latency, errors, queues, integrations, failed notifications, and journey abandonment.

The [GIGW detailed guidelines](https://guidelines.india.gov.in/guidelines/) formalise web information management, content review, archival, help, contact, feedback, responsive behaviour, monitoring, security, and lifecycle responsibilities. The [STQC Website Quality Certification process](https://stqc.gov.in/en/website-quality-certification-0?themecolor=style) includes manual and tool-based evaluation plus review of organisational back-end processes. That is a useful reminder that a website badge is not only a front-end exercise.

### 14. Measure outcomes and publish definitions

The UK identifies four service measures: cost per transaction, user satisfaction, completion rate, and digital take-up. For this project, task outcome and inclusion matter more than take-up because the prototype is not operating a real public channel.

Measure at least:

- eligible starts;
- completions and completion rate;
- median completion time;
- field and upload errors;
- recovery after interruption;
- abandonment by journey stage;
- comprehension of outcome and next step;
- support use and successful handoff;
- satisfaction after the task;
- accessibility blockers;
- page and API performance under the test profile; and
- availability of the complete public journey.

Segment results by supported language, device class, connection profile, assistive technology, and digital-confidence group where the sample permits. Publish the definition, numerator, denominator, date range, exclusions, owner, and evidence date. Do not publish a context-free percentage.

## India-specific interpretation

India should not be represented as one generic "rural" user or one language problem. The practical design conditions overlap in different ways.

| Condition | Likely failure | Required response |
|---|---|---|
| Shared or borrowed phone | drafts, files, or notifications expose private information | clear sign-out and local-data behaviour, discreet messages, short reference, no unnecessary persistence |
| Intermittent connection | lost form, duplicate submission, repeated upload | local draft where safe, explicit sync state, idempotent submit, retry and resume |
| Limited data or older device | blank page, excessive battery or data use | light default, progressive enhancement, small assets, no blocking assistant or media |
| Limited digital confidence | hidden menu, unclear button, fear of irreversible action | visible task choices, concrete action labels, examples, review and confirmation, reliable back action |
| Limited literacy or unfamiliar legal language | guessed answers or paid intermediary | short operational copy, explained terms, visual example with text, contextual help |
| Different language or script | partial journey, corrupt names, untranslated errors | complete language route, Unicode, reviewed translation, editable original data |
| Disability, age, or temporary impairment | task cannot be perceived or operated | semantic base, keyboard and screen-reader tests, reflow, contrast, time and error support |
| Rural or remote location | digital journey ends in an unexplained city-office visit | realistic assisted route, service-centre details, documents list, reference carried across channels |
| Migrant, tenant, or non-standard household | address and evidence model rejects a valid case | flexible Indian names and addresses, alternate evidence, explicit supported and unsupported cases |
| High-stakes or emotional situation | a vague failure causes panic or abandonment | calm language, saved-state clarity, error code, human route, no dark pattern or false urgency |

### Rules for Indian names, addresses, dates, and documents

Do not assume every person has a first name and surname, a permanent address matching a current address, or a Latin-script spelling. Avoid destructive auto-formatting. Preserve the person's entered value and allow reviewed transliteration separately when a downstream system requires it.

Write month names where ambiguity matters. Show Indian currency with a plain fee explanation. List evidence before the journey, accept mobile camera capture, state file size and quality clearly, and never require a citizen to infer whether a document is valid from a code or circular alone.

### Rules for OTP, identity, and intermediaries

Do not make a one-time password the only route unless risk and policy require it. State where it will be sent and provide recovery when a phone number is lost or inaccessible. Do not imply that Aadhaar is required unless the current legal and service basis requires it.

For this hackathon, every identity, OTP, credential, payment, case, document, notification, and government response must be synthetic and visibly labelled. The prototype must not contact a live government system.

## What good public services elsewhere teach us

These are patterns to study, not templates to copy.

| Reference | What is useful | What not to infer |
|---|---|---|
| [GOV.UK register to vote](https://www.gov.uk/register-to-vote) | clear purpose, preparation, time estimate, alternate cases, paper and assisted routes, and what happens next | UK identity, language, law, and channel conditions do not transfer directly to India |
| [Singapore LifeSG birth registration](https://www.life.gov.sg/about-us/birth-registration) | organises related tasks around a life event; official figures report 15 minutes instead of 60 and 80% online choice among eligible parents by 2022 | a small, digitally connected city-state does not prove the same identity and access model will work nationally in India |
| [New Zealand SmartStart](https://smartstart.services.govt.nz/) | joins guidance and tasks around pregnancy and a new baby, with checklists and saved work | local cultural, population, identity, and language scope differ; the site has also used staged translation and should not be treated as proof of complete multilingual parity |
| [Australia Digital Service Standard](https://www.digital.gov.au/policy/digital-experience/digital-service-standard) | explicitly combines user need, inclusion, trust, connected services, harm prevention, monitoring, and service relevance | meeting a high-level standard still requires task testing and operating evidence |
| [Canada Digital Standards](https://www.canada.ca/en/government/system/digital-government/government-canada-digital-standards.html) | accessibility from the start, ethical services, data stewardship, open standards, and research with users | bilingual and institutional practices need an India-specific ownership and language model |
| [US federal website performance](https://www.performance.gov/cx/websiteperformance/) | shows how a government can publish website inventory and foundational quality measures | the page is a November 2024 snapshot and its scans do not prove end-to-end completion |
| Indian unified portals cited by [DARPG in April 2026](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2256516&lang=1&reg=20) | Seva Sindhu, Sewa Setu, and e-UNNAT are an official comparator pool for one-stop access; Bhubaneswar and Chandigarh were cited for municipal delivery | "best practice" and service saturation do not prove that each service is simple, accessible, fast, or successfully completed |

The strongest transferable pattern is not a colour system. It is organising around a person's goal, exposing preparation and status, measuring completion, and keeping a usable route when digital self-service fails.

## Rankings, scorecards, and public datasets

### Direct answer

No dataset found provides a current, complete, independently validated ranking of all individual government websites by usability and usefulness. The closest Indian sources are NeSDA for service-delivery maturity and AAKLAN for automated website quality. STQC provides a certified-site list. None can replace a task test.

### India-level sources

| Source | Unit and method | Public output | What it can tell us | Important limit |
|---|---|---|---|---|
| [GIGW 3.0](https://guidelines.india.gov.in/gigw3/) and [conformity matrix](https://guidelines.india.gov.in/annexure-ii-matrix-to-check-conformity/) | Indian government website and app requirements across quality, accessibility, security, and lifecycle | detailed guidelines and testable conformity matrix | the production baseline and governance responsibilities | conformance is not a rank and does not by itself prove task completion |
| [STQC Website Quality Certification](https://stqc.gov.in/en/website-quality-certification-0?themecolor=style) | tool-based and manual evaluation, back-end process review, and security evidence | public list of certified websites with certificate details | a pool of sites that passed a formal process at a stated time | certification is not a comparative UX score; check certificate date and validity |
| [GIGW WIM score table](https://guidelines.india.gov.in/wim-score-table/) | operational reporting by web information managers | public scoring questions | content freshness, bilingual sync, contacts, feedback, broken links, certificates, monitoring, search, and help | it is a scoring scheme, not a public cross-site leaderboard; many items are presence checks |
| NeSDA | periodic assessment of portals and service delivery from the citizen perspective | reports, scores, and comparative findings when an assessment is published | accessibility, content, ease, security and privacy, end delivery, integration, and tracking; NeSDA 2025 adds open data, participation, and emerging technology | editions are snapshots; framework data partly comes from participating governments; a high portal score may hide a weak individual journey |
| AAKLAN in NeSDA Way Forward reports | automated assessment of government websites, normalized to 100 | selected monthly report tables | repeatable comparison of nine technical and interface categories | automated checks cannot observe comprehension or task success; published coverage is incomplete in some editions |
| NeSDA Way Forward service counts | State and UT submissions on service availability and unified portals | monthly report tables | service availability, mandatory-service saturation, and unified-portal coverage | a listed or linked service is not evidence of completion, accessibility, or satisfaction |

The [NeSDA 2025 launch note](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2266244&lang=1&reg=3) says the assessment covers State, UT, city, and Central ministry portals and service portals. It lists ten assessment areas and 59 mandatory State or UT services plus 43 Central ministry services. As of this research date, the launch and assessment process were public, but a final NeSDA 2025 result set was not located. Do not describe it as a completed current ranking until DARPG publishes the results.

### How AAKLAN is weighted

The [March 2025 NeSDA Way Forward report](https://darpg.gov.in/sites/default/files/NeSDA_WF_March_2025_Report.pdf) introduced the AAKLAN method. The [September 2025 report](https://darpg.gov.in/sites/default/files/NeSDA_WF_September_2025_Report_0.pdf) published the following total parameter weights:

| AAKLAN parameter | Weight out of 100 |
|---|---:|
| Accessibility | 19.219 |
| Performance and technical | 19.219 |
| Security and privacy | 19.219 |
| Branding and visual identity | 11.311 |
| Content and information | 6.206 |
| Integration and services | 6.206 |
| Interactivity and engagement | 6.206 |
| Mobile responsiveness | 6.206 |
| Navigation | 6.206 |
| Total | 100.000 |

The method uses more than 100 automated questions, analytic hierarchy process weighting, and normalization to 100. The September report could assess only 7 of the 18 remaining State portals in that edition because 11 were not hosted on NICNET and were inaccessible to the tool's test environment. That is a material coverage bias. AAKLAN is useful for finding technical comparators and gaps, not for declaring the best citizen service.

### International and open sources

| Source | Coverage and access | Useful for | Cannot prove |
|---|---|---|---|
| [US Site Scanning Program](https://digital.gov/guides/site-scanning) and [API](https://open.gsa.gov/api/site-scanning-api/) | daily public CSV, JSON, and API data; the program reports over 1.5 million fields for about 26,000 federal `.gov` and `.mil` sites | an excellent open-data model for inventory, HTTPS, accessibility signals, design-system use, search, metadata, third parties, and technical health | Indian quality, complete-site coverage, human accessibility, or a successful citizen task |
| [US federal website performance page](https://www.performance.gov/cx/websiteperformance/) | public category snapshot, current there to November 2024 | how to explain accessibility, analytics, design consistency, feedback, mobile, search, and security in public | current performance or transaction outcomes across every site |
| [Silktide Index](https://index.silktide.com/) | automated WCAG 2.2 accessibility scoring for thousands of sites, updated monthly | finding websites with fewer automatically detectable accessibility problems and concrete issue examples | WCAG conformance, human usability, complete task access, or overall government-service quality; Silktide itself calls the score a starting point |
| [Chrome UX Report](https://developer.chrome.com/docs/crux/) | public real-user Web Vitals for eligible popular origins and pages | how actual Chrome users experience loading, interaction, and layout stability | low-traffic services, all browsers or users, accessibility, content quality, or completion |
| [HTTP Archive](https://httparchive.org/) | public BigQuery crawl data and reports, with CrUX joined for eligible origins | page weight, resource and technology patterns, and large-scale web comparison | a representative citizen journey or policy and support quality |
| [EU eGovernment Benchmark 2025](https://digital-strategy.ec.europa.eu/en/library/digital-decade-2025-egovernment-benchmark-2025) | about 100 services across nine life events, with reports, factsheets, results, and methodology | a strong model for evaluating complete services around real events rather than department homepages | direct ranking of Indian services; it covers the participating European region |
| [UN E-Government Survey 2024](https://publicadministration.desa.un.org/publications/un-e-government-survey-2024-0) | country-level EGDI and online-service assessment, plus local online service work | broad national digital-government and portal maturity comparison | which individual Indian site or journey is best |
| [World Bank GTMI 2025](https://www.worldbank.org/en/programs/govtech/gtmi-2025-update) | 197 economies, 48 indicators, public dashboard and reproducible research record | comparing systems, service delivery, engagement, and enabling institutions | website usability or a performance ranking; the World Bank explicitly says GTMI is not a ranking or readiness/performance evaluation |
| [OECD Digital Government Index 2023](https://www.oecd.org/en/publications/2023-oecd-digital-government-index_1a89ed5e-en.html) | country-level government-policy survey across six digital-government dimensions | institutional comparison and principles such as digital by design, data-driven government, openness, user-driven design, proactive services, and government as a platform | individual site quality; its country sample is not a complete worldwide set and is not an India site ranking |

### How to use these sources without misleading ourselves

Use each source only for the question it measures:

1. Use STQC and GIGW to identify formal Indian conformity evidence.
2. Use NeSDA to identify service-delivery comparator groups and system gaps.
3. Use AAKLAN and Silktide to find automated technical and accessibility signals.
4. Use CrUX or field telemetry for real loading and interaction conditions.
5. Use the EU life-event method to plan complete-journey comparisons.
6. Use the US scanner as a model for open, reproducible website-health data.
7. Use UN, World Bank, and OECD sources for country or institutional context only.
8. Open the actual service, define a task, and test that task with representative people before calling the service good.

Do not average a country index, certificate, automated accessibility score, service count, and satisfaction figure. Their units, samples, dates, and methods are incompatible.

## The benchmark we should use for this project

The existing [project scorecard](2026-08-24-government-service-quality-checklist.md) remains the release control. This research gives it an evidence model.

### Layer 1: release gates

The build cannot pass if the main journey is incomplete, a serious accessibility barrier blocks it, a failure loses work without recovery, sensitive data is exposed, or a mock can be mistaken for an official result.

### Layer 2: score the product

Use the scorecard's eight weighted areas:

| Project area | External basis | Evidence for this prototype |
|---|---|---|
| Task completion and clarity | NeSDA ease of use and end delivery; UK whole-problem and completion guidance | five observed complaint tasks, completion rate, time, mistakes, outcome comprehension |
| Accessibility and inclusive interaction | GIGW 3.0, UX4G, WCAG 2.2 AA, AAKLAN accessibility | automated scan plus keyboard, screen reader, zoom, touch, and reduced-motion tests |
| Mobile, performance, and reliability | GIGW responsive and connection testing; AAKLAN performance and mobile; CrUX method | full journey on agreed phone, width, throttled network, script failure, refresh, and upload retry |
| Language and comprehension | GIGW bilingual and synchronisation rules; WCAG language requirements | complete English and Hindi routes reviewed by fluent people, plus plain-language comprehension |
| Transparency and trust | GIGW ownership and lifecycle; UK publish-performance principle; NZ accountability | visible independent status, source dates, mock disclosures, stages, service limitations, and metric definitions |
| Help, support, and recovery | GIGW help, contact, and feedback; UX4G feedback patterns; UK assisted digital | contextual help, synthetic support handoff, error recovery, and trackable mock reference |
| Privacy and security | GIGW, STQC process, WCAG accessible authentication, national production review | synthetic-only data, threat review, safe logs and URLs, no live integration, clear retention boundary |
| Content and machine readability | GIGW metadata and web information management; open-government principles | public semantic HTML, stable task URLs, source and date metadata, sitemap later, approved structured service facts |

### Layer 3: test inclusion slices

Run the same complaint journey under these conditions rather than testing each feature in isolation:

| Test slice | Minimum scenario |
|---|---|
| Mobile | 320 CSS pixel reflow and the agreed entry-level Android profile |
| Weak network | throttled connection, offline interruption after a completed step, reconnect, and upload retry |
| Language | English and Hindi from start page through errors, receipt, status, and help |
| Disability | keyboard only, screen reader, 200 percent zoom, touch, and reduced motion |
| Digital confidence | participant unfamiliar with consumer-law and e-Jagriti terms |
| Evidence problem | unsupported or unclear file, failed upload, and replacement |
| Shared device | exit, resume, sign-out or clear-local-data behaviour, and discreet notification copy |
| Support | person cannot answer a legal-process question and uses the mock handoff without losing context |

Record the device, browser, network, language, assistive technology, build, task, result, time, errors, participant type, and follow-up issue. Do not publish personal participant details.

### Layer 4: publish a small evidence page

For the prototype, publish or prepare a public quality page containing:

- the main task and supported cases;
- what is mocked;
- scorecard date and build;
- completion tests and sample size;
- accessibility tests performed and known barriers;
- performance test profile and results;
- supported languages and review status;
- sources and content review date;
- known limitations and intended fixes; and
- responsible independent team contact.

This is more transparent than a single green badge. It also gives judges evidence for product thinking and honesty.

## Direct implications for the e-Jagriti prototype

### Keep

- Start with the person's consumer problem, not a legal filing category.
- Explain eligibility, evidence, remedy, expected effort, and mock boundary before starting.
- Offer one main question or coherent group per mobile step.
- Save progress and show whether it is saved locally or to the simulated service.
- Provide examples for invoices, order IDs, seller details, dates, and evidence quality.
- Generate a reviewable complaint from confirmed facts while preserving the person's own words.
- Cite the approved source beside legal-process guidance.
- Finish with a clear mock acknowledgement, reference, status, next owner, and next step.
- Make contextual help visible on every difficult step.
- Deliver the whole route in English and Hindi.
- Keep the core journey usable without the command panel or AI guidance.
- Include an accessible, stage-specific announcement pattern and service-status pattern.
- Make the default build light; defer optional assistant code until requested.

### Treat as later or conditional

- A Control K panel is an accelerator after visible navigation and help work.
- A low-data switch is useful after the default path meets a strict budget.
- Visual document guides are useful only for repeated evidence mistakes.
- FAQs should come from observed questions and error cases, not filler.
- Proactive reminders need consent, channel controls, and a real operational owner.
- External assistant or agent access needs versioned public service facts and must not expose or submit a private case.

### Exclude from the hackathon build unless the core is already proven

- an open forum, because moderation, privacy, legal accuracy, and empty-community risk are substantial;
- an admin dashboard, because reviewers test the citizen experience;
- broad legal advice from a model;
- automated eligibility or legal decisions;
- voice as the only route;
- a native mobile app;
- live e-Jagriti, payment, identity, OTP, or government integrations; and
- a feature that appears in the demo but cannot complete.

## Questions for each future technical decision

Technical planning should answer these questions with this guide as the constraint:

1. Can useful HTML arrive and the core journey operate if optional JavaScript or AI fails?
2. What is the numeric page and script budget on the chosen mobile test profile?
3. How are drafts, retries, idempotent submission, and connection state represented?
4. How will English and Hindi content share one reviewed source without drifting?
5. How will the full journey be tested with keyboard, screen reader, zoom, and touch?
6. What is stored on a shared device, for how long, and how can it be cleared?
7. How are source, version, owner, effective date, and expiry attached to guidance and announcements?
8. Which events prove completion, abandonment, recovery, and errors without collecting unnecessary personal data?
9. How are optional AI and help code kept off the critical path?
10. How does the deployment show mocks and independent status before a person relies on it?

No framework, component library, database, model, or hosting provider should be chosen only because it produces a polished demo quickly. The stack must support the complete, accessible, low-bandwidth journey and be testable before the deadline.

## Research gaps and cautions

- A public, complete, current AAKLAN raw dataset or API was not found. Results are distributed through selected NeSDA Way Forward report tables.
- A final NeSDA 2025 result set was not found as of 24 August 2026. The public launch note describes an assessment process in progress.
- Automated tools cannot test plain-language comprehension, policy accuracy, usable support, successful fulfilment, or most assistive-technology behaviour.
- STQC certification proves conformity at a stated assessment point, not that every current journey succeeds. Check validity and surveillance status.
- Official "best practice" or service-saturation claims should be treated as a shortlist for inspection, not an independent usability verdict.
- CrUX excludes sites and pages without enough eligible Chrome traffic, so absence of data is not evidence of poor performance.
- International service patterns require adaptation to Indian law, language ownership, access, devices, identity, institutions, and support channels.
- Before product decisions are final, conduct direct research with people who have attempted a consumer complaint, including at least one mobile-first person with limited legal or digital familiarity.

## Source index

### India

- [GIGW 3.0](https://guidelines.india.gov.in/gigw3/)
- [GIGW detailed guidelines](https://guidelines.india.gov.in/guidelines/)
- [GIGW conformity matrix](https://guidelines.india.gov.in/annexure-ii-matrix-to-check-conformity/)
- [GIGW WIM score table](https://guidelines.india.gov.in/wim-score-table/)
- [STQC Website Quality Certification](https://stqc.gov.in/en/website-quality-certification-0?themecolor=style)
- [UX4G Design System 3.0](https://www.ux4g.gov.in/)
- [UX4G accessibility foundation](https://www.ux4g.gov.in/foundations/accessibility)
- [UX4G application and submission pattern](https://www.ux4g.gov.in/patterns/application-submission)
- [UX4G feedback and communication pattern](https://www.ux4g.gov.in/patterns/feedback-communication)
- [NeSDA 2019 report](https://darpg.gov.in/sites/default/files/NeSDA_2019_Final_Report.pdf)
- [NeSDA 2021 report](https://darpg.gov.in/sites/default/files/NeSDA2021_Report.pdf)
- [NeSDA Way Forward, March 2025](https://darpg.gov.in/sites/default/files/NeSDA_WF_March_2025_Report.pdf)
- [NeSDA Way Forward, September 2025](https://darpg.gov.in/sites/default/files/NeSDA_WF_September_2025_Report_0.pdf)
- [NeSDA 2025 portal launch note](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2266244&lang=1&reg=3)
- [DARPG April 2026 e-service and best-practice note](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2256516&lang=1&reg=20)

### Accessibility and service standards

- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [UK Service Standard](https://www.gov.uk/service-manual/service-standard)
- [UK service performance guidance](https://www.gov.uk/service-manual/measuring-success/using-data-to-improve-your-service-an-introduction)
- [UK form structure guidance](https://www.gov.uk/service-manual/design/form-structure)
- [UK assisted digital guidance](https://www.gov.uk/service-manual/assisted-digital/)
- [UK user support guidance](https://www.gov.uk/service-manual/helping-people-to-use-your-service/set-up-and-manage-user-support)
- [UK front-end performance testing](https://www.gov.uk/service-manual/technology/how-to-test-frontend-performance)
- [UK progressive enhancement](https://www.gov.uk/service-manual/technology/using-progressive-enhancement)
- [Australia Digital Service Standard](https://www.digital.gov.au/policy/digital-experience/digital-service-standard)
- [Canada Digital Standards](https://www.canada.ca/en/government/system/digital-government/government-canada-digital-standards.html)
- [New Zealand Digital Service Design Standard](https://www.digital.govt.nz/standards-and-guidance/digital-service-design-standard)
- [New Zealand Web Standards](https://www.digital.govt.nz/standards-and-guidance/nz-government-web-standards)

### Comparators and measurement data

- [GOV.UK register to vote](https://www.gov.uk/register-to-vote)
- [Singapore LifeSG birth registration](https://www.life.gov.sg/about-us/birth-registration)
- [New Zealand SmartStart](https://smartstart.services.govt.nz/)
- [US Site Scanning Program](https://digital.gov/guides/site-scanning)
- [US Site Scanning API and bulk data](https://open.gsa.gov/api/site-scanning-api/)
- [US federal website performance](https://www.performance.gov/cx/websiteperformance/)
- [Silktide Index methodology](https://index.silktide.com/about)
- [Chrome UX Report](https://developer.chrome.com/docs/crux/)
- [HTTP Archive public dataset](https://httparchive.org/)
- [EU eGovernment Benchmark 2025](https://digital-strategy.ec.europa.eu/en/library/digital-decade-2025-egovernment-benchmark-2025)
- [UN E-Government Survey 2024](https://publicadministration.desa.un.org/publications/un-e-government-survey-2024-0)
- [World Bank GovTech Maturity Index 2025](https://www.worldbank.org/en/programs/govtech/gtmi-2025-update)
- [OECD Digital Government Index 2023](https://www.oecd.org/en/publications/2023-oecd-digital-government-index_1a89ed5e-en.html)

## Maintenance rule

Review this guide before finalising the technical plan and again before submission. When a cited standard, assessment, or dataset changes, record the new date and revise only the decisions the new evidence affects. Keep the scorecard operational and keep this document as the research basis for why those controls exist.
