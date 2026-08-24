# Sahi Return

Sahi Return is an independent Build What Moves India prototype for one Income Tax e-Filing recovery journey. It helps a fictional taxpayer understand and correct a synthetic Section 139(9) mismatch where Form 26AS shows bank-interest TDS but the filed return omits the related income.

The prototype does not connect to the Income Tax Department, calculate tax for a real person, or create a government record. Do not enter real tax documents, PAN details, credentials, or personal information.

## Project structure

- `web/` contains the deployable citizen web application.
- `docs/2026-08-25-income-tax-defective-return-product-plan.md` defines the supported problem, journey, stack, mocks, and acceptance criteria.
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

## Validation

Run these commands from `web/`:

```bash
npm run lint
npm test
npm run build
```

`npm test` runs the deterministic journey and failure-state tests, creates a production build, then verifies the server-rendered public page. `npm run build` produces the Sites-compatible output in `web/dist/`.

## Implemented journey

1. Read the supported case and mock boundary.
2. Review a synthetic Section 139(9) notice.
3. Load or replace three synthetic documents.
4. Compare Form 26AS with the filed return.
5. Confirm or dispute the bank-interest entry.
6. Review a fixed, versioned demonstration correction.
7. Submit a simulated response or stop safely.
8. Print or download a synthetic acknowledgement.

The route works in English and Hindi. Drafts stay in browser storage and can be cleared from the footer. The site also includes low-data mode, offline submission recovery, contextual help, and a synthetic support request.

## Disclosures

- Codex was used for research synthesis, product planning, implementation, interface copy, tests, accessibility checks, failure-state design, and documentation.
- The application uses the Sites vinext starter, React, TypeScript, Vite, Vitest, Testing Library, ESLint, and Cloudflare development tooling. See `web/package.json` for exact versions.
- The social preview image was generated with OpenAI image generation for this project. It contains no government logo or protected personal data.
- All taxpayer identities, PAN data, documents, amounts, calculations, dates, references, submissions, support requests, and government responses in the prototype are synthetic.
- The interface links to public Income Tax Department guidance but never calls a live government API.

Tax law, forms, and portal behavior change. Recheck the official sources before the demo and submission. Nothing in this repository is tax advice.
