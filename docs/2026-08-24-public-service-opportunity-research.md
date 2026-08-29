# Public-service opportunity research

Created: 2026-08-24 02:00 IST (UTC+05:30)

Last updated: 2026-08-24 02:00 IST (UTC+05:30)

Research date: 23 August 2026

The [official builder brief](https://buildwhatmovesindia.com/brief) and [FAQ](https://buildwhatmovesindia.com/faq) are the governing sources for this research. They favour one real problem, a complete citizen journey, mobile and low-bandwidth usability, clear mock boundaries, and end-to-end operational thinking.

## Recommendation

Build a guided consumer complaint filing flow for [e-Jagriti](https://e-jagriti.gov.in/).

Decision confirmed on 23 August 2026. The implementation scope and acceptance criteria are in the [e-Jagriti product plan](2026-08-24-e-jagriti-product-plan.md). The reusable release gates are in the [government digital service scorecard](2026-08-24-government-service-quality-checklist.md).

The narrow problem should be:

> A consumer with a small e-commerce dispute cannot afford a lawyer, but e-Jagriti expects them to prepare and upload several court-style documents before they can file their own case.

This is the best combination of real pain, a visible before-and-after, an end-to-end journey we can finish before the deadline, and a topic that is less obvious than railways, income tax, or EPFO.

SPARSH annual identification is an extremely close second. Pick it instead if one of us has direct access to a defence pensioner or family pensioner for two short interviews. That lived experience would make the submission much more credible.

The cybercrime reporting flow is third. It has the largest immediate stakes, but it is more likely to attract other teams and requires careful trauma-aware testing.

## One hard rule before choosing

The official brief asks teams to choose a problem they have faced. We should not select a vulnerable audience only because it scores well on paper. Before locking the idea, one teammate should be able to say one of the following truthfully:

- I tried this journey myself.
- I helped a parent, relative, student, veteran, or consumer complete it.
- I interviewed people who recently completed or abandoned it, then tested the prototype with them.

If none of these is true for the top idea, move down the list until it is.

## How the opportunities were judged

The scores are decision aids, not measured facts. Each candidate was assessed on:

- Human cost and reach, 20 points
- Evidence of repeated pain or dependence on help, 15 points
- A narrow journey with a clear finish, 15 points
- How much software can improve the problem, 15 points
- Whether a convincing build can be finished before 28 August, 15 points
- Mobile, low-bandwidth, language, age, and digital-literacy relevance, 10 points
- Demo distinction and likely competition, 10 points

Competition is an informed estimate. There is no public list of what other entrants are building.

## Ranked shortlist

| Rank | Website and target journey | Score | Why it belongs here | Main risk | Expected competition |
|---|---|---:|---|---|---|
| 1 | e-Jagriti: prepare and file a small consumer complaint without a lawyer | 92 | Structural complexity, a clean finish, visible generated artifacts, and a strong one-minute demo | Legal accuracy and different document formats across commissions | Low to medium |
| 2 | SPARSH: complete annual identification for a defence pensioner | 91 | Elderly users, pension continuity, assisted-service dependence, local-language value | Face authentication and final acceptance must be mocked | Low |
| 3 | Cybercrime.gov.in: report a financial cyber fraud without losing the draft or evidence | 89 | Time-sensitive, high financial stakes, very large use volume, strong offline-first case | A crisis flow needs careful wording and cannot imply that a mock report protects funds | Medium to high |
| 4 | National Scholarship Portal: prevent an avoidable application failure before submission | 82 | Students face identity, OTR, scheme eligibility, document, and verification dependencies | The current portal already has an eligibility checker, so the improvement must go beyond discovery | Medium |
| 5 | RTI Online: turn a non-response into a correct first appeal | 81 | Narrow legal journey, clear deadlines, low competition, useful plain-language guidance | Smaller audience and different state portals | Low |
| 6 | eCourts: find the next hearing and understand what changed | 79 | Litigants struggle with CNRs, status labels, hearing dates, and orders | Several private products already simplify case tracking and order summaries | Medium to high |
| 7 | EPFO: diagnose and recover from a rejected PF claim | 76 | Huge volume and frequent KYC or record mismatch complaints | Many failures come from backend records and employer approvals that a better interface cannot resolve | High |
| 8 | Sarathi Parivahan: complete a driving licence correction or renewal checklist | 73 | Common journey and clear evidence of agent use | State variation, physical RTO steps, and likely entrant crowding weaken the end-to-end story | High |

## 1. e-Jagriti guided consumer complaint filing

### Why this is the strongest pick

The portal is new and useful, but its citizen filing flow still assumes procedural knowledge. Its own March 2025 filing guide requires an index, proforma, synopsis with dates, memo of parties, complaint with notarised affidavit, annexures, and sometimes a vakalatnama. The [current e-Jagriti FAQ](https://e-jagriti.gov.in/faq) tells users to contact the relevant Consumer Commission for the exact and updated formats of these documents. That is a structural problem, not a colour-and-spacing problem.

The audience is real. The Department of Consumer Affairs reported [4,15,365 registered users and 2,29,174 filed cases by June 2026](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2269994&lang=1&reg=3). The service works well enough to matter, which is an advantage. We would be improving the citizen entry point to a real operating process, not inventing a service with no adoption.

Forum reports expose the gap between being online and being usable:

- One self-represented consumer listed the court-style documents they had to prepare, asked whether the affidavit required notarisation, and did not know what scrutiny would happen next. Other commenters said they had used AI to draft the files but were unsure whether the result would work. [Reddit discussion](https://www.reddit.com/r/LegalAdviceIndia/comments/1uv33nk/filed_my_consumer_complaint_on_edaakhil_against/)
- Another consumer described an OTP login loop, failed uploads, a bounced support email, and no way to attach evidence. [Reddit discussion](https://www.reddit.com/r/LegalAdviceIndia/comments/1va29hn/is_the_ejagriti_consumer_court_portal_broken/)
- A person with a Rs 41,000 non-delivery dispute said a lawyer could cost about Rs 30,000, but they could not understand the required index and filing procedure. [Reddit discussion](https://www.reddit.com/r/LegalAdviceIndia/comments/1grreka/what_after_nch/)

These posts are anecdotes, not a representative survey. They still reveal repeatable failure modes that match the official filing requirements.

### The exact product

Working name: `Nivaran`.

Do not redesign all of e-Jagriti. Build one guided path for a self-represented consumer filing a low-value e-commerce complaint about a missing, defective, or wrongly described product.

The user should be able to:

1. Choose the type of purchase problem in plain language.
2. Add the seller, amount, order date, attempts to resolve it, and desired remedy.
3. Upload synthetic invoices, emails, chats, and photos.
4. Review an automatically ordered event timeline and evidence list.
5. See missing information before submission.
6. Generate a preview filing pack that maps the same answers into the required index, proforma, synopsis, memo of parties, complaint, and annexure list.
7. Complete a clearly mocked affidavit and submission step.
8. Receive a synthetic filing number and a plain-language explanation of what happens next.

### One-minute demo

A citizen uploads a synthetic invoice and two support-chat screenshots for a defective Rs 8,999 phone. They answer six short questions by voice or tap. The product creates the chronology, flags that the seller's legal address is missing, then shows the completed filing pack. The citizen reviews the remedy, confirms the affidavit checklist, submits to a mock District Commission, and receives a fake case reference with the next expected step.

### What makes it more than an AI wrapper

- Use fixed, versioned templates for the supported complaint type.
- Use deterministic checks for required fields, file types, claim value, and evidence labels.
- If an OpenAI model extracts dates or drafts a summary, show the source beside each extracted fact and require user confirmation.
- Keep the original uploads unchanged and maintain an audit trail.
- State that the prototype prepares a filing pack and does not give legal advice or guarantee admission.
- Explain how a production system would let each Consumer Commission publish and version its accepted templates.

### Mock boundary

Use a fictional consumer, seller, invoice, messages, address, affidavit, OTP, payment, commission, filing number, and case status. Do not send anything to e-Jagriti or a real commission.

## 2. SPARSH annual identification

### Why it ranks second

SPARSH has reach and a sharply defined vulnerable user. The Ministry of Defence reported [31.69 lakh pensioners onboarded by November 2025](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2204165&lang=2&reg=3). It also reported 20.94 lakh digital life certificates for defence pensioners in the 2025 campaign. To support people who cannot use the system alone, the government mobilised 202 Defence Accounts offices, 4.63 lakh Common Service Centres, and thousands of bank branches.

That assisted network is evidence of a genuine last-mile problem. The Ministry itself says the centres help people who are not tech savvy. Veterans and family members report OTP failures, rejected life certificates after migration, difficulty finding pension slips, and dependence on younger relatives. See the [Reddit account from a veteran's family](https://www.reddit.com/r/IndianDefense/comments/16st7x7) and [Indian Express reporting on pensioners struggling with login, certificates, and corrections](https://indianexpress.com/article/cities/chandigarh/military-pensioners-say-sparsh-portal-fails-them-10153051/).

### The exact product

Working name: `Sparsh Saathi`.

Focus only on annual identification. The problem statement is:

> A defence pensioner does not know which annual identification route applies to them, what details to enter, or whether the certificate was accepted, so they depend on family or an agent and risk pension interruption.

The journey should:

1. Explain why identification is due in one sentence and the last safe date.
2. Ask whether the pensioner wants phone-based face authentication, an authorised service centre, or a manual certificate route.
3. Give one instruction at a time in the chosen language, with spoken prompts and large controls.
4. Check the synthetic pension authority and disbursing authority values before submission.
5. Simulate face authentication or a service-centre handoff.
6. Show a durable receipt, acceptance status, and a safe next step if it fails.

### Why it could beat e-Jagriti

The accessibility story is stronger. It is easy to show senior-friendly interaction, local language, poor-network recovery, delegated family assistance without sharing passwords, and an authorised offline fallback. The topic is also likely to have fewer competitors.

### Main weakness

Most of the hard transaction depends on Aadhaar Face RD, Jeevan Pramaan, and SPARSH. The prototype must clearly label these as simulated. The build needs a credible production integration and assisted-service story so it does not look like a reskinned form.

### Mock boundary

Use a fictional veteran, PPO, Aadhaar, bank, face scan, OTP, life certificate, SPARSH response, and receipt. Never process a real veteran's record.

## 3. Resilient cyber-fraud reporting

### Why it matters

The Ministry of Home Affairs reported that more than [53.87 lakh cyber-fraud complaints were submitted during financial years 2023-24 through 2025-26](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2287674&lang=1&reg=1). It also says immediate reporting through 1930 and the financial fraud system helped save more than Rs 11,158 crore across 32.80 lakh complaints by 30 June 2026.

The official [91-page citizen manual](https://cybercrime.gov.in/UploadMedia/MHA-CitizenManualReportOtherCyberCrime-v10.pdf) shows how much incident classification and evidence preparation may be required. A July 2026 user reported losing an hour of entered data, being logged out at final submission, and entering a login recovery loop. Other commenters described similar field validation and draft problems. [Reddit discussion](https://www.reddit.com/r/IndianCyberHub/comments/1uue3ro/tried_reporting_a_scam_on_cybercrimegovin_the/)

### The exact product

Working name: `1930 First`.

Do not build a generic cybersecurity app. Build a calm, offline-first reporting flow for a recent UPI or card fraud:

1. Put the immediate safety action first: call 1930 and contact the bank.
2. Start a local encrypted draft before login.
3. Ask for the transaction, suspect contact, event timeline, and available evidence in plain language.
4. Autosave after every answer and show upload progress that can resume.
5. Produce a review screen that distinguishes confirmed facts from guesses.
6. Simulate portal submission and generate a synthetic acknowledgement.
7. Give a next-action checklist for the bank, police, and complaint tracking.

### Main weakness

The real value is time-sensitive. A mock submission must never suggest that funds have been frozen or a police complaint has been filed. The safest demo keeps 1930 and bank contact ahead of every prototype action.

## 4. National Scholarship Portal application preflight

### Specific opportunity

Do not make another scholarship search engine. The current [NSP already has scheme eligibility, OTR, application, and payment tracking](https://scholarships.gov.in/Students).

Build a preflight check for one scholarship family. It should tell a student whether their OTR, Aadhaar name, face authentication, institute record, bank seeding, marksheet, income certificate, and application dates are ready before they start.

The problem is credible. Current NSP registration requires Aadhaar-based OTR and may require two Android apps for face authentication. Students report unexplained "no scheme found" results, APAAR mapping failures, tiny identity mismatches, delayed institute verification, and renewal deadlines arriving before results. Examples include [an NIT student's eligibility and identity mismatch](https://www.reddit.com/r/JEENEETards/comments/1npx6g4/im_a_firstyear_student_at_nit_mizoram_and_im/) and [a renewal blocked because the university had not released results](https://www.reddit.com/r/AskIndia/comments/1vddldl/need_help_with_nsp_renewal_1st_sem_results_not/).

This ranks below the first three because NSP has already improved its eligibility interface. The prototype must explain why an application is not ready and how to fix it, not merely list schemes.

## 5. RTI first-appeal navigator

### Specific opportunity

Help an Indian citizen who filed a Central Government RTI request and received no response or an unsatisfactory response. The user enters the original registration number and dates, chooses the problem in plain language, reviews the appeal ground, attaches the earlier reply, and submits a mocked first appeal.

The current [RTI Online portal](https://rtionline.gov.in/) supports requests, first appeals, status, and payment. The official guidance still expects the citizen to know whether the authority is central or state, which public authority to select, what appeal ground applies, and how the statutory timeline works. The portal limits text to 3,000 characters and restricts attachment size and format.

Forum users ask what a first-appeal hearing means, when response clocks begin after transfers, and what to do when a request is marked disposed without an answer. See [the hearing question](https://www.reddit.com/r/RTIIndiaGuide/comments/1uw2qxs/first_appeal_under_hearing/) and [the transfer and deadline question](https://www.reddit.com/r/RTIIndiaGuide/comments/1trry2m/need_help_regarding_rti_transfer_reply_timeline/).

This is a good dark-horse choice. It is narrow, cheap to mock, and likely uncrowded. Its audience and emotional impact are smaller than the top three.

## 6. eCourts hearing explainer

### Specific opportunity

Help a litigant answer three questions from a synthetic CNR:

- When and where is my next hearing?
- What happened last time?
- Which item should I ask my lawyer or the court registry about?

The official [eCourts case-status page](https://services.ecourts.gov.in/ecourtindia_v6/casestatus/) exposes many search paths, court hierarchy selections, case-type labels, and CAPTCHA steps. Forum users report conflicting hearing dates, unclear status labels, missing filings, and dependence on lawyers or court staff. Examples include [three conflicting dates for the same matter](https://www.reddit.com/r/LegalAdviceIndia/comments/1s2p507/confusion_regarding_hearing_date/) and [uncertainty about whether a filing exists](https://www.reddit.com/r/LegalAdviceIndia/comments/1vbz8bh/ecourts_still_shows_case_as_disposed_since_2022/).

The problem is real, but this field is already busy. Private products offer cleaner search, alerts, and order summaries, and at least one recent Reddit project targets the same citizen questions. A generic "AI explains your case" pitch will not stand out. Pick this only with a narrower angle, such as a verified hearing card that shows source timestamp and uncertainty without giving legal advice.

## 7. EPFO claim-rejection navigator

EPFO is unquestionably important. It settled [more than five crore claims in financial year 2024-25](https://www.epfindia.gov.in/site_docs/PDFs/EPFO_PRESS_RELEASES/06022025_EPFOAchievesSettlingOver_5CroreClaims_FY%20202425.pdf). Recent forum threads show people blocked by name mismatches, PAN appearing approved in one screen and unverified in another, old employers, duplicate UANs, missing records, and vague rejection remarks. One active thread collected issues across activation, KYC, transfers, nomination, and claims. [Reddit discussion](https://www.reddit.com/r/epfoindia/comments/1t94wzq/anyone_else_facing_pf_issues_lately_uan_claim_kyc/)

That breadth is exactly why EPFO is risky for this deadline. A useful fix often requires an employer, Aadhaar or PAN correction, a field office, or a backend data change. "Redesign EPFO" will sprawl and probably be common among entrants.

If chosen, restrict it to one rejection class and complete only the recovery journey: explain the rejection, collect the right synthetic proof, generate the correction or grievance request, and track the mock response.

## 8. Sarathi driving licence correction or renewal

The case for Sarathi is familiar: state selection, service selection, documents, payment, slot booking, and sometimes a physical RTO visit. Users report stuck applications and are frequently told that an agent is the practical shortcut. The official Parivahan guidance itself says some record problems require contacting the RTO, and a Sarathi guide notes that online submission does not complete issuance because the applicant may still need to visit the office.

This makes the experience painful but weakens the hackathon story. The hard part varies by state and often happens outside the website. It is also an obvious target. Pick it only if we have firsthand experience with one state and one exact transaction, such as address correction on an existing licence.

## Ideas to reject for this submission

### IRCTC or railway booking

High public use and easy recognition are not enough. Booking failures are entangled with quota supply, traffic spikes, payments, anti-bot controls, and backend capacity. It will attract many teams, and a cleaner search and checkout will look shallow.

### A full income-tax or EPFO redesign

Both are huge. Both invite feature sprawl and depend on rules, records, employers, intermediaries, and backend systems. A broad redesign will be difficult to finish and difficult to explain in one minute.

### AIIMS or ORS appointment booking

The visible pain is often "no appointments available." Interface work cannot create clinical capacity. A prototype that makes empty slots look nicer does not solve the user's problem.

### ABHA health-record aggregation

This depends on hospital adoption, health-data consent, privacy, and live ecosystem integration. It is difficult to prove end to end with safe synthetic data in five days.

### Passport application

It is well known and easy to demo, but the current journey is more guided than most candidates here. Appointment capacity and police verification sit outside the website. The opportunity is less distinctive.

### A generic grievance portal

CPGRAMS covers almost any government service. That breadth makes it hard to define one user, one problem, and one success state. If we use CPGRAMS at all, it should be the escalation step inside a narrower pension, EPFO, or service-delivery journey.

## Final decision test

Before implementation, score the top three using real evidence from two target users. Ask each person to screen-share or narrate their last attempt without entering real credentials or IDs.

Choose the idea for which we can answer all five questions with specifics:

1. What exact sentence does the user say when they get stuck?
2. What do they do today instead?
3. What does that workaround cost in time, money, privacy, or missed benefits?
4. What screen or artifact proves our journey is complete?
5. Can the full demo work on a low-end mobile browser with the network throttled?

If the answers are equally strong, choose e-Jagriti. It has the best buildable transformation: one ordinary story becomes a complete, reviewable filing pack and a mock submission in under a minute.

## Research caveats

- Forum posts reveal failure modes but do not measure how common each problem is.
- Government press releases measure adoption and official outcomes, but they naturally present the service in its best light.
- The gap between those two views is useful. We should validate it with short user interviews before coding.
- Rules, forms, portal behavior, and deadlines can change. Recheck the official builder brief and the chosen service's current help documents before implementation and submission.
