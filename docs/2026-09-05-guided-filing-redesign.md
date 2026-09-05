# Guided filing redesign

Created: 2026-09-05 01:21 IST (UTC+05:30)
Last updated: 2026-09-06 02:41 IST (UTC+05:30)

## Why this changed

Mentor review found that Sahi Return still made a citizen read too much before they could act. The earlier interface explained tax vocabulary carefully, but explanation was still the main interaction. A person should not need to learn the portal's language before filing.

## Product decision

The primary journey now follows four rules:

1. Ask about facts a citizen already knows, such as whether they recognise a payment.
2. Work out form names, filing reasons, deductions, and the cheaper tax regime in the product.
3. Put the answer and next action before the explanation.
4. Keep calculations, official field names, sources, and uncommon corrections behind clearly named disclosures.

The public home page now has one main action. The full service map, notices, and help remain available in an optional section. Inside the return, a seven-step vertical journey map names the whole route and shows the current, completed, available, and locked steps. On a phone it folds to one row and expands as a vertical list. Income is reviewed one entry at a time. The regime screen leads with the two payable amounts and marks the cheaper choice. The pre-filing screen leads with pass or fix, the review screen leads with refund or tax due, and the final step leads with the remaining verification action.

## Tax-saving check

Step 4 now checks the supported deductions before comparing tax regimes. This is where the official ITR-1 sequence puts Total Deductions: after Gross Total Income and before Total Tax Liability. The prototype translates the three supported groups into ordinary descriptions, shows the synthetic document each amount came from, lets the citizen correct the amount, and then applies it only where the chosen regime allows it.

The supported demonstration covers section 80C payments, section 80D health insurance, and section 80TTA savings-account interest. It does not claim to search every deduction in the Act. The official ITR-1 FAQ is linked beside the check because AY 2026-27 requires extra identifying information for several claims.

Sources checked on 2026-09-06:

- [Official ITR-1 online user manual](https://www.incometax.gov.in/iec/foportal/help/how-to-file-itr1-form-sahaj)
- [Official ITR-1 FAQ](https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/ITR1-FAQ)
- [Official new-versus-old regime FAQ](https://www.incometax.gov.in/iec/foportal/help/new-tax-vs-old-tax-regime-faqs)

## Interaction and layout follow-up

The full seven-step flow was checked again after the tax-saving change. Answer-dependent explanations now occupy a stable response area, so choosing a different answer does not move the question or its controls. Disclosures use a consistent bordered surface and visible chevron because they contain important review and correction paths, not footnotes.

Uploaded demo documents have an in-product preview. Income review keeps its previous and next controls together. The final review gives the result, refund account, key totals, declaration, and filing action a clear reading order. The acknowledgement no longer uses nested certificate borders: verification is one card, the receipt is a second card, and the full receipt remains a separate disclosure.

The desktop progress rail now separates adjacent interaction surfaces, gives available rows a visible hover edge, closes any preview before navigation, and keeps the current row from reopening a preview over its own content. Detailed step previews remain available on keyboard focus.

## Reference used

We reviewed the public interaction at [Wapsi](https://wapsi-amber.vercel.app/) on 2026-09-05. We borrowed the general pattern of short setup questions, large answer choices, and progressive disclosure. We did not copy its visual identity, wording, refund-led positioning, page structure, or code. Sahi Return keeps its own paper-and-ink design, salaried ITR-1 scope, deterministic tax engine, defect checks, Hindi route, and mock-data boundaries.

## What remains available

The redesign removes tax jargon from the default path, not from the product. A citizen can still inspect:

- all 18 form-eligibility answers;
- personal and refund-account records;
- source rows and official portal field names;
- both slab calculations and deduction schedules;
- every pre-filing defect check;
- official guidance and the synthetic-data disclosure.

## Acceptance checks

- The first home-screen action is visible without reading background material.
- The primary decision and its action appear before optional detail on every step.
- The journey names all seven steps and reports completed progress in words.
- Submission leaves verification as the seventh unfinished step. Only a verified return shows seven of seven complete.
- Every journey screen has one main question or decision.
- Technical detail is closed by default and named in plain language.
- The full fictional journey still reaches an acknowledgement.
- English and Hindi use the same interaction structure.
- The layout works at 390 CSS pixels without horizontal overflow.
- Changing an answer does not replace or move its question container.
- Every loaded demo document can be previewed without leaving the journey.
- The progress rail has distinct current, hover, completed, and locked states.
