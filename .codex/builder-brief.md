# Build What Moves India builder brief

Last reviewed: August 23, 2026

Official sources:

- [Builder brief](https://buildwhatmovesindia.com/brief)
- [Frequently asked questions](https://buildwhatmovesindia.com/faq)

The official website is the source of truth. It says important dates and rule changes will be published there. Recheck it before major product decisions and before submission.

## The challenge

Choose one real problem the team has faced on an Indian public-service website or digital service. Build a simpler, clearer, and more useful way for a citizen to solve it.

The service can concern travel, taxes, pensions, certificates, payments, grievances, or another public need. IRCTC, EPFO, and the Income Tax portal are examples, not a fixed list. The team may improve one specific problem or rethink an entire digital journey.

## Required product outcome

The prototype must:

- Solve one clearly defined user problem.
- Provide a complete primary citizen journey from start to finish.
- Be easier to understand or use than the current experience.
- Work as an interactive prototype. A Figma file or static design is not enough.
- Be designed for real Indian users, including people using mobile devices or slower connections and people with limited digital experience.
- Use mock or synthetic data when real personal information, payments, OTPs, accounts, backend access, or government systems would be required.

Reviewers will test the citizen experience, not an admin panel. Every feature included in the demo must work. Do not show a non-working feature and rely on a verbal explanation.

## Codex and technology rules

The FAQ states that Codex is mandatory for the submitted prototype. It must have a meaningful role in the build, and the submission must explain how it contributed. The brief also permits a prototype powered by an OpenAI model. OpenAI will provide support if the build reaches the 10 finalists.

Other development tools, libraries, normal starter templates, and open-source components are allowed when the team has the right to use them. Disclose them and follow their licences. The submission must be an independent build made for this hackathon, not an old project with minor changes.

If a public-service body later chooses to develop the idea, that later implementation has no hackathon technology restriction.

## What a strong build makes obvious

A reviewer should quickly understand:

- Who faces the problem.
- What makes the current experience difficult.
- What the prototype changes.
- Why the new version is better.
- What works now and what remains mocked.
- How the idea could operate safely at larger scale.

The complete citizen journey should work at submission time. Mocked data and dependencies are acceptable, but the interface and interactions cannot be merely static. Clearly identify every mock.

## Safety, privacy, and legal constraints

Do not:

- Access, test, connect to, interfere with, or build on a live government system unless organizers provide a specifically approved public sandbox.
- Reverse-engineer a private system or use an undocumented private API.
- Copy an existing government site's code or use its infrastructure. Studying the public experience to understand the problem is allowed.
- Scrape personal, sensitive, or restricted information.
- Use real Aadhaar numbers, PAN details, IDs, names tied to real records, passwords, OTPs, payment details, health information, or other sensitive data.
- Submit real credentials. Any login details supplied to reviewers must be fake consumer credentials created for the prototype.
- Present the prototype as an official government product or imply endorsement, approval, or partnership.
- Use a government logo in a way that makes the prototype look official. Clearly label it as an independent hackathon prototype.
- Include code, assets, components, or data without permission or a compatible licence.

Use fictional or synthetic data and simulated integrations. The builder retains full rights to the build and should submit only material the team owns or may legally use.

## Submission package

Deadline: August 28, 2026 at 8:00 PM IST. The form closes then, with no grace period.

Submit all of the following:

1. A live, public browser link that opens without an access request. Reviewers will not download a mobile app. If login is required, include mock consumer credentials.
2. One public video no longer than two minutes. Use the first minute to demonstrate the project as a citizen. Use the second minute to explain how it was built and why the team made those choices. Both teammates may present. Loom, OBS, or another public video link is acceptable.
3. A project summary under 250 words that explains what the product is and why it improves on the current solution.
4. A partner's registered email for a two-person team. Leave this blank for a solo submission. Both teammates must register separately and enter each other's registered email.

Test every submitted link in a signed-out browser session. Nothing may request access.

## Judging criteria

Judges assess:

- Problem: Is it a real and important user problem?
- Working build: Does the main journey work?
- Usability: Is it simpler, clearer, and more accessible?
- Product thinking: Are the choices thoughtful and well explained?
- End-to-end thinking: Does the proposal address backend, infrastructure, and operational processes as well as the interface?
- Honesty: Are limitations, mock data, and dependencies plainly disclosed?

Visual polish matters, but cannot compensate for a weak problem, broken core journey, or impractical solution.

## Eligibility and participation

- Participants may enter alone or in a team of two.
- Every participant must be at least 18 years old.
- Both members of a team must register separately with their own email addresses.
- Registration is an expression of interest, not confirmation of a place.
- Developers, designers, product thinkers, students, and independent builders may apply. Participants must be able to frame the problem and build the prototype themselves.
- Use the same email address throughout the process. Organizers track entries by email and cannot move an entry to another address.
- Updates are sent to the email address and WhatsApp number used at registration.

The event is an independent builder initiative presented by Varun Mayya in partnership with OpenAI. It is not an official government hackathon, and selection does not promise government adoption.

Registration and submission data is managed by Varun Mayya's team. The FAQ says the OpenAI team will not have access to that data. The final privacy notice should state who can access the data, why it is collected, and when it will be deleted.

## Selection timeline

1. August 28 to September 1, 2026: the organizers and OpenAI review submissions received by the deadline and choose a shortlist of 250. Every submitter receives the result by email.
2. The top 250 receive one week of mentorship through a WhatsApp group with five mentors from engineering, technology, and OpenAI.
3. September 7, 2026: shortlisted teams resubmit an improved build in the same format, using the same email addresses.
4. September 8 to 12, 2026: the 10 finalists are announced. The top 250 are listed on a public recognition page.
5. September 12, 2026: finalists present at a filmed, non-live-streamed finale in Bengaluru. Winners are announced the same day. Organizers will contact finalists about technical checks, rehearsal, travel, accommodation, and filming consent.

## Prizes

- Top 10: one year of Codex Pro and a Codex Micro.
- Top 3: a MacBook in addition to the top-10 prizes.
- Winner: a trip to San Francisco, subject to visa, in addition to the other prizes.

## Planning implications

These are working interpretations for our planning stage, not extra organizer rules:

- Start with a narrow, painful citizen problem whose current failure can be demonstrated clearly.
- Define one golden path before adding secondary features.
- Treat mobile usability, low-bandwidth performance, plain language, and accessible interaction as acceptance criteria.
- Decide the safe mock boundary early. Keep a visible inventory of simulated data, APIs, OTPs, payments, and government dependencies.
- Design the architecture story alongside the interface so the submission can explain backend, infrastructure, operations, safety, and scale.
- Keep a build log of meaningful Codex contributions and third-party tools. This will make the second minute of the video and the disclosure section factual.
- Scope the demo to features that can be implemented, deployed, and tested before the deadline.

## Pre-submission checklist

- [ ] The chosen problem is real, specific, and important to an Indian public-service user.
- [ ] The main citizen journey works from start to finish.
- [ ] Every feature shown in the demo works.
- [ ] Mobile, accessibility, slow-connection, and limited-digital-experience cases have been tested.
- [ ] All identities, credentials, IDs, OTPs, payments, and personal records are fictional or synthetic.
- [ ] No live government system or undocumented private API is used.
- [ ] The prototype is labelled as independent and does not imply government endorsement.
- [ ] Mocked behavior and dependencies are disclosed in the product and submission.
- [ ] Codex's contribution and all other tools, libraries, templates, assets, and data sources are documented.
- [ ] The public app opens in a signed-out browser without requesting access.
- [ ] Mock consumer login credentials work, if required.
- [ ] The public video is two minutes or less and follows the one-minute citizen demo plus one-minute build explanation format.
- [ ] The project summary is under 250 words.
- [ ] Team emails match the separately registered addresses and remain consistent across stages.
- [ ] Every submission link works.
- [ ] The official brief and FAQ have been rechecked for changes.
