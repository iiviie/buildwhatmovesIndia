# Sahi Return build and release record

Created: 2026-08-25 00:34 IST (UTC+05:30)

Last updated: 2026-08-25 21:36 IST (UTC+05:30)

Status: superseded in part

The interface described below was rebuilt on 25 August 2026. Read [Sahi Return interface redesign](2026-08-25-sahi-return-interface-redesign.md) for the current interface, its check against the official portal flow, and its evidence. The working behavior, mock inventory, and outstanding human review in this record still apply.

## Build reviewed

Product: `Sahi Return`

Journey: synthetic Section 139(9) defective-return recovery for one Form 26AS bank-interest mismatch

Product plan: [Sahi Return product and implementation plan](2026-08-25-income-tax-defective-return-product-plan.md)

Quality control: [Government digital service scorecard](2026-08-24-government-service-quality-checklist.md)

## Working behavior

- The start page states the supported case, unsupported cases, required demo documents, expected time, fee, proof, privacy boundary, and prototype status before data entry.
- The notice screen explains the supported defect, deadline, consequence, and source in plain language.
- The document screen loads fixed synthetic fixtures or accepts PDF, JSON, and TXT files up to 5 MB. It rejects other types and oversized files with stable error codes.
- The comparison screen shows Form 26AS and filed-return values side by side and names the source record.
- The citizen confirms, disputes, or pauses on the bank-interest entry. The product never forces a disputed amount into the return.
- The supported route shows the exact correction, fixed calculation version, review declaration, mock boundary, and simulated submission.
- Offline submission remains queued on the device and exposes retry after reconnection.
- Repeated submission is blocked while the response is submitting and after completion.
- The final acknowledgement has an unmistakable synthetic reference, status, owner, next action, print control, and text download.
- English and Hindi cover the complete main route, errors, help, acknowledgement, and support request.
- Contextual help cites the official Section 139(9) FAQ and can create a trackable synthetic support reference.
- A low-data preference removes shadows and motion. Draft state survives refresh and can be cleared for a shared device.

## Automated evidence

| Check | Evidence | Result |
|---|---|---|
| Supported journey | Testing Library runs start through simulated acknowledgement | Pass |
| Missing documents | Journey test verifies the blocking error | Pass |
| Disputed record | Journey test verifies safe stop and no-submission receipt | Pass |
| Offline response | Journey test verifies queued state and retry | Pass |
| Hindi shell | Journey test verifies Hindi content and document language | Pass |
| Support request | Journey test creates `SUPPORT-DEMO-0264` and confirms nothing was sent | Pass |
| File validation | Unit tests reject unsupported and oversized files | Pass |
| Server-rendered start | Worker-render test verifies useful HTML, mock labels, privacy warning, and skip link | Pass |
| Branding boundary | Worker-render test verifies no government logo, external font, or live government request | Pass |
| Static analysis | ESLint with React, hooks, JSX accessibility, and Next rules | Pass |
| Production output | Sites vinext build | Pass |
| Runtime dependency audit | `npm audit --omit=dev` | Pass, zero known runtime vulnerabilities on 25 August 2026 |

The automated suite currently contains seven unit and interaction tests plus two server-render tests.

## Checklist evidence

### Task and form

- `PROB-01`, `PROB-04`, and `PROB-05`: the start page names the citizen, one mismatch, scope, journey finish, and completion proof.
- `FORM-08` and `FORM-09`: errors appear near the active task, state what remains saved, and give a recovery action.
- `FORM-10`, `FORM-11`, and `FORM-13`: back navigation preserves state, device-local drafts resume, and the response requires a final declaration.
- `FORM-14` and `FORM-15`: submission cannot duplicate and produces a printable, downloadable reference.

### Documents and AI safety

- `DOC-03`, `DOC-06`, `DOC-07`, and `DOC-09`: type and size appear before selection, replacement works, and extracted demo values retain named sources.
- `DOC-10`: the fixed fixture does not invent missing information.
- `AI-03` through `AI-08`: source facts, citizen confirmation, deterministic checks, safe dispute handling, and the model boundary are visible. No runtime model makes a tax decision.

### Access, language, and reliability

- `A11Y-01` through `A11Y-04`: semantic landmarks, native controls, focus movement, modal focus containment, skip navigation, and visible focus are implemented.
- `A11Y-06`, `A11Y-07`, and `A11Y-12`: the stylesheet targets 320-pixel reflow, 44-pixel controls, reduced motion, and print.
- `I18N-01` through `I18N-04`: the language control persists and the main journey has English and Hindi parity.
- `NET-03`, `NET-05`, `NET-06`, `NET-08`, `NET-11`, `NET-12`, and `NET-13`: the site uses system fonts, no decorative media, low-data mode, device-local recovery, a clear-data control, and a small receipt.
- `REL-03` through `REL-05`: file errors have stable codes and response state distinguishes draft, queued, submitting, submitted, and disputed.

### Trust and safety

- `TRUST-01` through `TRUST-05`: ownership, prototype status, synthetic data, scope, source, and external-link behavior are visible.
- `TRUST-13` and `TRUST-14`: the receipt distinguishes completed and stopped routes and names the next owner.
- `SAFE-02`, `SAFE-04`, `SAFE-08`, `SAFE-14`, and `SAFE-15`: the app collects no real identity, keeps the demo local, supports shared-device deletion, calls no government system, and labels every record synthetic.
- `HACK-02`, `HACK-03`, and `HACK-05` through `HACK-09`: the journey works end to end, every visible feature works, mock boundaries are repeated, and tools are disclosed.

## Human review still required before submission

These checks need people or the final deployed environment and cannot be honestly marked complete by the automated build:

- confirm one teammate's direct connection to tax filing or conduct two short interviews;
- have a qualified tax reviewer verify the synthetic calculation and Section 139(9) wording;
- have a fluent Hindi reviewer check every high-impact string;
- complete keyboard, TalkBack or NVDA, 200-percent zoom, and 320-pixel visual review;
- test the deployed public link on an entry-level Android device and a throttled connection;
- test the final public URL signed out;
- recheck the official builder brief, FAQ, and Income Tax guidance immediately before submission;
- record user-test evidence and any corrections;
- complete the two-minute video, public link, and under-250-word submission summary.

## Mock inventory

Ananya Rao, `DEMOA1234X`, Sampurna Bank, the notice, dates, Form 26AS, filed return, amounts, tax calculation, payment, e-verification, submission, status, acknowledgement, and support reference are synthetic. No government transaction occurs.

## Tool and asset record

- Codex researched, planned, implemented, tested, documented, and reviewed the build.
- The Sites vinext starter supplied the application and Cloudflare-compatible build structure.
- React, TypeScript, Vite, Vitest, Testing Library, ESLint, jsdom, and Cloudflare development packages are listed with exact versions in `web/package.json` and `web/package-lock.json`.
- OpenAI image generation created `web/public/og.png` from a project-specific prompt. The image is used only for social link previews.
- The application uses system fonts, CSS shapes, and no external photograph, icon pack, government logo, or copied portal asset.
