# Sahi Return web application

This directory contains the Sites-compatible Sahi Return prototype. Read the repository [README](../README.md) for setup, validation, disclosures, and the implemented citizen journey.

## Commands

```bash
npm ci
npm run dev
npm run lint
npm test
npm run build
```

The application stores only the synthetic demo draft and Tax Inbox state in browser local storage. The Tax Inbox simulates document classification but accepts no real document. The app has no runtime database, real login, payment, or government integration; its optional filing assistant is the only server-side API feature.
