# Sahi Return

Sahi Return is an independent Build What Moves India prototype for the ordinary salaried filing journey on the Income Tax e-Filing portal. It lets a fictional salaried taxpayer organise tax-relevant records throughout the year and file their own return without paying a professional: the form, the employment type and the filing reason are worked out for them, every figure is shown beside its source, both tax regimes are computed side by side with the slab working shown, and the return is checked for defects **before** it is filed rather than months afterwards by notice.

The prototype does not connect to the Income Tax Department, calculate tax for a real person, or create a government record. Do not enter real tax documents, PAN details, credentials, or personal information. Nothing here is tax advice.

## Project structure

- `web/` contains the deployable citizen web application.
- `docs/2026-08-27-salaried-itr-filing-product-plan.md` defines the supported problem, journey, mocks, verification, and limitations.
- `docs/2026-08-25-income-tax-defective-return-product-plan.md` is the superseded earlier direction, kept as the source for the Section 139(9) defect rules.
- `docs/2026-08-25-sahi-return-interface-redesign.md` records the interface direction and its check against the official portal flow.
- `docs/2026-08-26-interface-principles.md` records the first three principles the interface is built against.
- `docs/2026-08-28-citizen-ux-principles.md` records six further principles: task-list status, the missed-deadline alert, stating rules before controls, on-device file conversion, one divider level, and using the real form's own field names.
- `docs/2026-08-28-site-shell-auth-and-assistant.md` records the site shell, the seven portal sections, the sign-in gate, the repaired registration question, and the filing assistant.
- `docs/2026-09-05-guided-filing-redesign.md` records the mentor-led shift from explaining tax jargon up front to asking plain questions and revealing technical detail only when requested.
- `docs/2026-08-24-government-service-quality-checklist.md` is the release checklist.
- `.codex/builder-brief.md` records the hackathon rules and submission requirements.

## Requirements

- Node.js 22.13.0 or newer
- npm, using the committed `web/package-lock.json`

## Setup and development

```bash
cd web
npm ci
npm run dev
```

The development server prints the local review URL. The default is `http://localhost:3000` when that port is available.

### The assistant's API key

The filing assistant calls OpenAI from the Cloudflare Worker in
`web/worker/assistant.ts`, so the key never reaches the browser. For local
development, copy `web/.dev.vars.example` to `web/.dev.vars` and put the key in
it; that file is gitignored. For a deployed build, set it as a Worker secret:

```bash
cd web
cp .dev.vars.example .dev.vars   # then edit it, and restart `npm run dev`
npx wrangler secret put OPENAI_API_KEY
```

`OPENAI_MODEL` optionally overrides the default of `gpt-4.1-mini`.

Running without a key is a supported state, not a broken one: the assistant
reports itself unconfigured and every other part of the prototype works
unchanged. Never commit the key.

## Validation

Run these commands from `web/`:

```bash
npm run lint
npm test
npm run build
```

`npm test` runs the tax-engine, filing-window and PDF-writer unit tests, the deterministic journey and failure-state tests, creates a production build, then verifies the server-rendered public page. `npm run build` produces the Sites-compatible output in `web/dist/`.

Reflow is checked separately, with a local Chrome:

```bash
npm run dev          # in one terminal
npm run test:reflow  # in another
```

`scripts/reflow.mjs` drives headless Chrome over the DevTools Protocol across all eight steps and the sign-in, registration and dashboard screens, in both languages, at 320 and 360 CSS pixels. It reports any horizontal overflow and writes screenshots to `.reflow-shots/`. Set `CHROME=/path/to/chrome` if the binary is not in a standard location.

## The home screen

The official e-Filing homepage carries roughly forty competing items: a rotating carousel, a ticker, "What's New", "Latest Updates", eighteen flat quick-link tiles, video tutorials, five testimonials and three helplines on different schedules. None of them is *start your return*.

This one keeps the same kinds of information and reorders them:

- the headline and the **Start the return** button share the first screen, with what you need beside them;
- a missed due date appears above it as a compact warning, with the cost behind a disclosure;
- announcements are sorted by whether they change what a salaried filer should do, and labelled `Affects you` or `For information`;
- the eighteen tiles become four groups of five or fewer, named for when you need them, and every tile says whether it `Works in this demo` or `Opens the official portal`;
- the three helplines are labelled by what they are for, and each says whether it is open right now in Indian time;
- there is no carousel and there are no testimonials.

## The site around the journey

The e-Filing portal is a whole service: a home page, a registration, a sign-in, a
dashboard, and seven sections in the masthead. The return is one journey inside
it. This prototype builds that shape rather than the journey alone.

- The masthead carries the portal's seven sections. Home, Individual/HUF and Help
  work. Company, Non-Company, Tax Professionals & Others and Downloads are
  disabled controls that carry a padlock and say `Not built in this prototype` —
  named so a reviewer can see where every task sits, and marked so nothing
  pretends to work.
- Individual/HUF opens onto its eight services. One, `File your income tax
  return`, is built end to end. The other seven are named, described in a line,
  and marked. The same map appears on the home page under `What do you want to
  do`.
- Filing is behind a sign-in, as it is on the real portal. `Sign in as the demo
  taxpayer` gets a reviewer through in one click; a citizen stopped at the door
  keeps the step they were heading for and lands back on it.
- The journey's step list belongs to the journey. It no longer renders on the
  home page, where seven padlocked steps and `0 of 7 steps done` were a progress
  meter for work nobody had started.

Registration keeps the portal's four stages and replaces its first question. The
official screen offers `Taxpayer` or `Others` and then a dropdown of departmental
job titles, which only works if you already know the answer. This one asks what
you actually do, and prints the official category as the answer — `The portal
calls this: e-return Intermediary` — so nobody has to guess and nobody who
arrived knowing the jargon is left behind.

The account, the one-time code and the password are synthetic, stay in the
browser, and authenticate nothing.

## The filing assistant

`Sahayak` is a panel over the page, so it stays open while you work. Signed out,
it answers questions about filing and about which category you belong to. Signed
in, it is given a plain-text snapshot of your own return — the step you are on,
which Annual Information Statement entries you confirmed or disputed, the regime
you chose, the computed figures, which pre-filing checks are failing — so you do
not have to explain your own return back to it. `Check this step for me` asks it
to compare those figures against each other and flag anything that looks wrong.

That snapshot is written as readable prose because the citizen is shown it: what
*What Sahayak can see* displays is exactly the string the model is sent.

The model is called from the Cloudflare Worker, so the API key never reaches the
browser, and the system prompt is rebuilt server-side on every request so the
client cannot replace it. It is instructed never to state a rupee figure, date or
reference that is not in the snapshot, never to give tax advice, and never to ask
for or repeat a real PAN, Aadhaar, password, OTP or bank detail.

The assistant cannot change your return; it reads and explains, and you decide.
It is an aid and not a dependency: with no key, no network, or a rate limit, the
panel says which of those happened and every step still works.

A Form 16 can be attached to the conversation. The file stays on your device and
is **not** read — the prototype uses its synthetic Form 16 fixture — and the
assistant is told to say so rather than imply it parsed your document.

## Implemented journey

The signed-in dashboard includes a **Tax Inbox** for the fictional 2025–26 records. It demonstrates the year-round habit with Form 16, AIS/26AS, EPF and health-insurance evidence; distinguishes a normal supermarket receipt from tax-relevant proof; and lets a reviewer add a synthetic donation receipt. The receipt is classified immediately but held for review because Form 10BE is missing. A citizen can defer the decision, add a fictional matching Form 10BE, or explicitly exclude the claim—and can reverse that exclusion. Once matched, the eligible ₹5,500 section 80G amount is carried into the old-regime calculation, comparison and deductions ledger; unresolved or excluded claims stay out. This is an on-device interaction using synthetic metadata—not a production document store or an upload to a server.

Step 0 is the start screen and is not numbered.

1. **What applies to you.** ITR-1, the employment type and the filing reason are decided from the facts and shown with the reason for each, rather than asked as unlabelled dropdowns. The statutory dates and the section 234F late fee are stated as facts.
2. **Your salary.** Gross salary, standard deduction and employer TDS, each beside the Form 16 row it came from. Both synthetic documents can be replaced to see the file checks run.
3. **Your other income.** The four prefilled Annual Information Statement entries are confirmed or disputed one at a time. A disputed entry stays out of the return and its tax credit is dropped with it.
4. **Your tax regime.** Both regimes computed from the citizen's own figures, band by band, with a recommendation and the amount it saves.
5. **Before you file.** The Section 139(9) defect rules run as a pre-submission check, with a fix instruction on anything blocking.
6. **Review and file.** The whole return in one place, with a declaration and a simulated verification step.
7. **Acknowledgement and impact.** A synthetic acknowledgement number, transaction ID, calculation version, printable or downloadable receipt, and a plain-language summary of the income reviewed, regime difference and rejected income kept out of the return.

The route works in English and Hindi, and the layout does not move when the language changes. A citizen can raise synthetic AIS feedback on an entry they do not recognise at any point before filing.

The filing journey uses a seven-step vertical journey map on wider screens and a compact, expandable vertical map on phones. It always names the current step, the total number of steps, and how many are complete. Each screen asks for one decision, and calculation details, portal field names and uncommon corrections stay behind named disclosures. Income entries are reviewed one at a time.

The filing deadline is real, not a demo device. Before 31 July 2026 the interface counts down to the due date. After it, the start screen leads with an alert naming the section 234F late fee, the section 234A interest, and the days left to file a belated return before 31 December 2026. After that date it points to the updated-return route. The fee follows the income, and the state machine is tested at fixed dates on both sides of midnight IST.

Every figure carries the official portal's own field name beside our plain-language one, for example `B1 iii a. Standard Deduction u/s 16(ia)`, so a citizen can find the same box on the real site.

Settings hold language, appearance (light, dark, or match device), text size, and a `Save mobile data` preference. A command panel opens with `Ctrl`/`Cmd` + `K` or the visible search control; every action in it can also be reached without it. Drafts stay in browser storage and can be cleared from the footer or the command panel. The site also includes offline submission recovery, contextual help with a source and review date, and a synthetic support request that carries the current step.

If a citizen picks a JPG or PNG instead of a PDF, `web/app/file-tools.ts` re-encodes it, steps it down until it fits the size limit, and wraps it in a single-page A4 PDF with the JPEG embedded under `DCTDecode`. All of it runs on the device: no upload, no library, no third-party converter. The interface then reports what it did and by how much.

The demonstration tax engine lives in `web/app/tax.ts`. Every slab, the section 87A rebate, the cess and the deduction caps are written out in full and versioned as `DEMO-AY26-27-v2`, so a reviewer can check the arithmetic by hand.

The interface direction, its check against the official portal flow, and the evidence behind it are recorded in `docs/2026-08-25-sahi-return-interface-redesign.md`.

## Disclosures

- Codex was used for research synthesis, product planning, implementation, interface copy, tests, accessibility checks, failure-state design, and documentation.
- The filing assistant sends the conversation and a synthetic session snapshot to the OpenAI chat completions API from the Cloudflare Worker, and is clearly labelled in the interface as generated output that can be wrong. No real personal data is sent, because the prototype holds none. Running without an API key is supported and disables only the assistant.
- The application uses the Sites vinext starter, React, TypeScript, Vite, Vitest, Testing Library, ESLint, and Cloudflare development tooling. See `web/package.json` for exact versions.
- Display type is Instrument Serif, licensed under the SIL Open Font License 1.1 and self-hosted from `web/public/fonts/` with its licence text. Telugu uses the script-only Noto Sans Telugu files supplied by `@fontsource/noto-sans-telugu`, also under the SIL Open Font License 1.1. Both are bundled with the site, so the page requests no font from a third party; all other text uses system fonts.
- The social preview image was generated with OpenAI image generation for this project. It contains no government logo or protected personal data.
- All taxpayer identities, PAN data, documents, amounts, calculations, dates, references, submissions, support requests, and government responses in the prototype are synthetic.
- The tax calculation is a deterministic demonstration engine written for this prototype. It is not the Income Tax Department's computation and must not be relied on for a real return.
- The interface links to public Income Tax Department guidance but never calls a live government API. Public guidance pages were read only to understand the citizen experience.
- The two helpdesk numbers shown in the interface are published by the Income Tax Department. This prototype does not operate a support line.

Tax law, forms, and portal behavior change. Recheck the official sources before the demo and submission. Nothing in this repository is tax advice.
