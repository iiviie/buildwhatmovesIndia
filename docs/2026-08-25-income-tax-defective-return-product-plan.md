# Sahi Return product and implementation plan

Created: 2026-08-25 00:14 IST (UTC+05:30)

Last updated: 2026-08-25 00:14 IST (UTC+05:30)

Status: confirmed implementation direction

Prototype deadline: 2026-08-28 20:00 IST (UTC+05:30)

## Decision

Build `Sahi Return`, an independent hackathon prototype for one Income Tax e-Filing recovery journey:

> A first-time taxpayer receives a Section 139(9) defective-return notice because TDS appears in Form 26AS but the related income is missing from the filed return. They need to understand the mismatch, verify the source, correct the return, and receive proof of a simulated response before the notice deadline.

The prototype will not redesign all tax filing. The current Income Tax portal already provides an ITR-selection wizard, prefilled data, filing utilities, help, and assisted filing. Sahi Return starts after one supported defective-return notice and ends with a clearly simulated acknowledgement.

This direction supersedes the e-Jagriti product direction for implementation. The e-Jagriti documents remain useful research records for accessible forms, source-linked extraction, failure recovery, and transparent mock boundaries.

## Supported demonstration case

Ananya Rao is a fictional salaried taxpayer filing for Assessment Year 2026-27. Her synthetic Form 26AS includes Rs 48,000 of fixed-deposit interest and Rs 4,800 of TDS from `Sampurna Bank`. Her synthetic filed ITR claimed the TDS but omitted the related interest income.

The prototype supports only this mismatch:

- Section 139(9) defective-return response;
- one fictional ITR-1 return;
- TDS claimed while the corresponding interest income is omitted;
- one fixed assessment year and a versioned synthetic calculation;
- a simulated response, verification, and acknowledgement.

The prototype does not support other notice sections, business income, capital gains, foreign assets, crypto assets, real tax calculations, real PAN data, live accounts, payments, e-verification, or government submission.

## Citizen journey

1. Read the scope, required demo documents, expected time, privacy boundary, and mock warning.
2. Open the synthetic notice and see the response date in plain language.
3. Load or upload synthetic copies of the notice, Form 26AS, and filed return.
4. Compare the TDS entry with the filed income and inspect each source.
5. Confirm whether the bank-interest record belongs to the taxpayer.
6. Review the proposed Schedule OS correction and the versioned demo tax calculation.
7. Complete a final declaration and simulated response.
8. Receive a synthetic acknowledgement with status, timestamp, next action, print, and download controls.

An alternate route must explain what to do when the Form 26AS entry is not the taxpayer's. It must not force disputed information into the return.

## Product rules

- Show `Independent prototype` and `Synthetic data only` before data entry and on the receipt.
- Display each extracted value beside its source and require citizen confirmation.
- Use deterministic rules for completeness, amounts, allowed states, tax totals, and duplicate submission prevention.
- Treat explanatory model output as a suggestion. The prototype uses fixed source-bound copy and makes no legal decision.
- Save the demo draft on the device after every meaningful change.
- Show whether the draft is saved locally, offline, submitting, submitted, or failed.
- Preserve correct answers through refresh and back navigation.
- Support the full main route in English and Hindi.
- Keep every main action operable by keyboard and at 320 CSS pixels.
- Provide contextual help and one fully simulated support-request route.
- Provide a visible low-data preference, print-friendly receipt, and clear local-data deletion control.

## Failure and recovery states

- unsupported notice type;
- missing required document;
- wrong file type or file larger than 5 MB;
- uncertain or disputed Form 26AS entry;
- browser goes offline while the draft is open;
- simulated submission interrupted and safely retried;
- repeated submission blocked;
- draft cleared on a shared device;
- contextual help cannot answer the current question and creates a synthetic support reference.

## Mock and data inventory

| Item | Prototype treatment | Production dependency |
|---|---|---|
| Taxpayer, PAN, address, bank | Fictional and visibly labelled | Approved identity and taxpayer account systems |
| Notice and deadline | Synthetic Section 139(9) fixture | Authoritative e-Proceedings record |
| ITR and Form 26AS | Synthetic fixtures | Secure document access and taxpayer consent |
| Extraction | Fixed fixture plus source-linked review | Approved document extraction with evaluations |
| Tax calculation | Versioned, fixed demo calculation | Department-owned tax rules and official validation utility |
| E-verification | Simulated confirmation | Approved Aadhaar, bank, demat, or other verification route |
| Submission and status | Simulated | Documented Income Tax e-Filing integration |
| Acknowledgement and support reference | Synthetic | Official case and support systems |
| Draft storage | Device-local browser storage | Encrypted service storage with retention controls |

## Implementation stack

The application lives in `web/` so research and control documents remain separate from deployable code.

- Sites `vinext` starter with React 19 and TypeScript
- Vite-compatible Cloudflare Worker output
- semantic HTML and plain CSS using system fonts
- browser local storage for the explicitly device-local synthetic draft
- Vitest and Testing Library for deterministic logic and journey behavior
- npm with the committed lockfile
- Sites private deployment for review when available

No runtime OpenAI API or live government integration is required for the submitted prototype. Codex contributes product research, implementation, tests, accessibility work, failure-state design, documentation, and validation. This prevents a network model call from blocking the citizen journey and keeps the high-stakes tax calculation deterministic.

## Performance and support targets

- useful first screen without external fonts or media;
- no decorative video, image carousel, map, or chat bundle;
- target JavaScript below 250 KB compressed for the main route;
- no horizontal scrolling at 320 CSS pixels;
- touch targets at least 44 by 44 CSS pixels;
- draft recovery after refresh and offline editing;
- visible retry after a failed mock submission;
- print and text download for the final acknowledgement;
- recent Chrome, Firefox, Edge, and Safari, plus Android Chrome, as the prototype support baseline.

## Acceptance gate

The build is complete only when:

- the main synthetic journey finishes from the start page to acknowledgement;
- the disputed-entry branch gives a safe next step;
- all visible interactions work;
- English and Hindi cover the complete main route;
- keyboard, 320-pixel reflow, 200-percent zoom, low-data, offline, refresh, error, duplicate-submit, and print behavior have test evidence;
- every identity, document, amount, reference, response, and integration is visibly synthetic;
- the repository documents real setup, development, test, lint, and build commands;
- the public review link opens without authentication if a deployment is created;
- no code calls a live government service or undocumented API.

## Sources

- [Build What Moves India builder brief](https://buildwhatmovesindia.com/brief)
- [Build What Moves India FAQ](https://buildwhatmovesindia.com/faq)
- [Income Tax Department Section 139(9) FAQs](https://www.incometax.gov.in/iec/foportal/taxonomy/term/38)
- [Income Tax Department ITR identification guide](https://www.incometax.gov.in/iec/foportal/help/identification-and-generation-of-applicable-itr-individual)
- [Income Tax Department tax-credit mismatch guidance](https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/tax-credit-mismatch)
- [Government digital service scorecard](2026-08-24-government-service-quality-checklist.md)
- [Government digital service research guide](2026-08-24-government-digital-service-research-guide.md)

Tax rules and portal behavior change. Recheck the official sources before the demo and submission. This plan defines a fictional prototype case, not tax advice.
