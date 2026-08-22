# Repository Guidelines

## Project purpose

This repository contains our submission for the 2026 Build What Moves India hackathon. Read [`.codex/builder-brief.md`](.codex/builder-brief.md) before product planning or implementation. Treat the official builder brief and FAQ linked there as the source of truth if rules change.

## Current structure

The repository is a minimal scaffold. Keep research and project documentation in `docs/`. Keep hackathon requirements and Codex context in `.codex/`. Do not choose an application structure or technology stack until the planning stage records that decision.

No package manager, build system, formatter, test runner, or deployment target is configured yet. Do not present example commands as working commands. Once the stack is chosen, document the real setup, development, test, lint, and production build commands in `README.md`.

## Hackathon guardrails

- Build one clearly defined solution to a real problem in an Indian public-service website or digital journey.
- Make the primary citizen journey work from start to finish. Reviewers will test the citizen experience, not an admin panel. A static design is insufficient.
- Design for mobile devices, slow connections, accessibility, and people with limited digital experience.
- Use Codex meaningfully and document its contribution. Disclose other tools, libraries, starter templates, assets, and data sources.
- Use only fictional or synthetic identities, credentials, payments, OTPs, and personal data. Clearly label every mocked dependency or integration.
- Never access or interfere with a live government system, use undocumented private APIs, scrape restricted data, or reverse-engineer government infrastructure.
- Present the product as an independent hackathon prototype. Do not imply government approval or use logos in a misleading way.
- Use only code, data, and assets that the team owns or has permission to use.

## Implementation and review

Prefer the smallest complete product over a broad feature list. Every feature shown in the demo must work. Test the main journey, failure states, responsive layout, low-bandwidth behavior, and public-link access before submission. Add tests with each behavior change once the stack is configured. Bug fixes should include a regression test.

Use short, imperative commit subjects, such as `feat: add grievance status flow`. Pull requests should explain the user problem, the change, and validation performed. Include screenshots for visible UI work. Never commit secrets, real credentials, local environment files, generated output, or dependency directories.
