# Curated-platform reevaluation

Created: 2026-08-24 09:46 IST (UTC+05:30)

Last updated: 2026-08-24 09:46 IST (UTC+05:30)

Status: recommendation pending lived-experience confirmation

## Why the decision reopened

The official [builder brief](https://buildwhatmovesindia.com/brief) says IRCTC, EPFO, and the Income Tax portal are examples rather than a fixed list. The organizer video shown to the team gives a more practical signal: submissions based on ten named platforms may receive preference, and choosing another platform may reduce the chance of selection.

The ten platforms shown are IRCTC, Income Tax e-Filing, CPGRAMS, GST, EPFO, MCA, the National Cyber Crime Reporting Portal, UMANG, Parivahan Sewa, and RTI Online.

This does not make e-Jagriti ineligible. It does make it a needless selection risk when several curated platforms contain problems that are just as strong and can reuse much of the work already completed.

## Recommendation

Choose **CPGRAMS**, subject to one teammate confirming firsthand experience with a grievance or completing two short interviews with recent users.

Do not build a general complaint-writing assistant. The current CPGRAMS login page already promotes `Samadhan Didi`, a voice-based grievance utility supporting 22 Eighth Schedule languages. A similar assistant would duplicate a visible current feature.

Build this recovery journey instead:

> A citizen receives a CPGRAMS closure response that marks their grievance as disposed, but they cannot tell which requested action was completed, what remains unresolved, or how to file a clear appeal.

Working concept: **Nivaran: from disposed to resolved**.

Use one synthetic EPFO-related grievance in the demo so the story is concrete. The prototype remains a CPGRAMS appeal companion, not an EPFO redesign.

## Why this beats the alternatives

CPGRAMS has an existing appeal mechanism and enough volume to prove that the recovery journey matters. The official portal states that a citizen who gives a poor rating after closure can file and track an appeal. The Government's January to March 2026 CPGRAMS report records 96,334 appeal receipts, 95,447 disposals, and 21,296 pending appeals at the end of March. The average closing time was 19 days.

The product also has a strong operational story. A production version should require each department to respond to every requested action with a structured outcome, evidence, owner, and date. The citizen interface can then show what was done and route unresolved points into an appeal. That improves response quality rather than merely restyling the form.

## Proposed citizen journey

1. Open a synthetic grievance marked `Disposed`.
2. See the original requested outcomes and the department's closure response side by side.
3. Review a plain-language check that labels each point `answered`, `action promised`, `needs information`, or `unresolved`.
4. Confirm or correct the check. The prototype must not let a model make the final judgement.
5. Add evidence only for unresolved points and see any missing dates or documents.
6. Review a concise appeal that cites the original grievance and numbers each unresolved point.
7. Submit to a clearly simulated CPGRAMS integration.
8. Receive a synthetic appeal number, saved receipt, expected response window, and status tracker.

The one-minute demo should begin with the misleadingly reassuring `Disposed` status and end with a complete, reviewable appeal receipt.

## How the earlier e-Jagriti work carries over

Keep:

- the guided story-to-timeline interaction;
- evidence upload, labelling, and missing-information checks;
- citizen confirmation of model-extracted facts;
- the mock submission boundary and synthetic receipt;
- low-bandwidth draft recovery, accessible form patterns, English and Hindi parity, and plain-language status explanations;
- the government-service quality checklist and research guide.

Replace:

- consumer-law document templates;
- Commission selection, fee, affidavit, and filing-pack rules;
- e-commerce dispute language and e-Jagriti-specific lifecycle research.

No application code exists yet, so changing direction now costs research time but does not require a rewrite.

## Ranked comparison

These scores are decision aids, not measured facts. They combine problem evidence, ability to define a complete journey, one-minute demo strength, feasibility before 28 August, distinctiveness, curated-list fit, and reuse of the existing work. Every option still has to pass the firsthand-experience gate.

| Rank | Platform and narrow journey | Score | Main reason to choose it | Main risk |
|---:|---|---:|---|---|
| 1 | CPGRAMS: turn an unsatisfactory closure into an evidence-backed appeal | 94 | Large existing appeal journey, clear before-and-after, strong operations story, and high reuse | A generic complaint assistant would duplicate CPGRAMS's new voice tool |
| 2 | RTI Online: turn a non-response or transfer-only disposal into a correct first appeal | 90 | Very narrow, highly buildable, legally traceable, and likely less crowded | Smaller audience and a less dramatic one-minute demo |
| 3 | Cyber Crime: preserve and complete a recent financial-fraud report without losing evidence | 88 | Highest urgency and strongest citizen stakes | Likely crowded, trauma-sensitive, and easy to misrepresent a mock submission as protection |
| 4 | EPFO: recover from one specific PF claim rejection | 77 | Huge user need and familiar pain | Root causes often require employer or backend record changes; likely crowded |
| 5 | IRCTC: explain and recover a delayed cancellation refund | 75 | Broad recognition and an easy demo story | Very obvious choice, rule complexity, live inventory dependencies, and heavy competition |
| 6 | Parivahan Sewa: prepare for one state's licence correction or renewal | 72 | Common journey with strong mobile and assisted-service needs | State variation and mandatory RTO steps weaken the complete digital journey |
| 7 | Income Tax: understand and prepare a response to one notice or demand mismatch | 70 | High financial stakes and good document-explanation potential | Legal and tax accuracy risk, professional dependence, and likely competition |
| 8 | UMANG: recover a failed transaction across one integrated service | 66 | Good cross-service status and handoff opportunity | UMANG is an aggregator, so the real failure often belongs to another department |
| 9 | GST: diagnose and correct one return or registration failure | 65 | Clear workflow and strong operational depth | Business-facing, specialist terminology, high compliance risk, and difficult validation |
| 10 | MCA: recover one company-filing rejection | 63 | Could be narrow and less crowded | Weaker citizen framing and dependence on company-law knowledge |

## Fallback order

Use this decision rule:

1. Choose CPGRAMS if a teammate has used it, helped someone use it, or can interview two recent users before implementation starts.
2. Choose RTI Online if the team has stronger lived evidence for an unanswered or transferred RTI.
3. Choose Cyber Crime only if the team can speak credibly about the reporting experience and keep the immediate `1930` and bank-contact actions ahead of the prototype.
4. If none passes the lived-experience gate, interview users before locking a platform. Do not compensate for weak evidence with a broader feature list.

## Evidence and caveats

- The [official builder brief](https://buildwhatmovesindia.com/brief) remains the rule source and allows platforms outside the ten examples.
- The [CPGRAMS homepage](https://pgportal.gov.in/) documents grievance status tracking, poor-rating feedback, appeal filing, and appeal tracking.
- The [March 2026 CPGRAMS report](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/apr/doc2026416848901.pdf) provides appeal volume and closing-time data.
- The [National Cybercrime Response Mechanism release](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2287674&lang=1&reg=1) reports more than 53.87 lakh cyber-fraud complaints during financial years 2023-24 through 2025-26 and directs victims to the 1930 helpline.
- The [RTI Online guidelines](https://rtionline.gov.in/guidelines.php?appeal=&pageid=45c48cce2e2d7fbdea1afc51c7c6ad26) confirm online first appeals, status tracking, and the 3,000-character text limit.
- The organizer-video preference is based on the team's viewing and supplied screenshot. It is not stated on the current written brief or FAQ, so it should be treated as a selection signal rather than an eligibility rule.

## Decision still needed

Before replacing the confirmed e-Jagriti plan, record which of the top three journeys a teammate has personally faced or can validate with recent users. Once confirmed, mark the e-Jagriti plan and Stage 1 proposal as superseded and create the replacement product plan.
