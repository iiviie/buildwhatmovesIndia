# Site shell, sign-in, and the filing assistant

Created: 2026-08-28 17:40 IST (UTC+05:30)
Last updated: 2026-08-28 17:40 IST (UTC+05:30)

## The problem this fixes

Until now the prototype was a journey with no site around it. Opening it put a
visitor straight into a single form, and four things followed from that:

1. **The journey's own furniture leaked onto the home page.** The step list —
   seven padlocked rows under `Your return`, with `0 of 7 steps done` — rendered
   beside a screen nobody had started. A progress meter for work not yet begun.
2. **The rest of the department was invisible.** The real portal's masthead
   carries seven sections: Home, Individual/HUF, Company, Non-Company, Tax
   Professionals & Others, Downloads, Help. None of them existed here, so the
   product read as though salaried ITR-1 filing were the whole of the income tax
   service rather than one journey inside it.
3. **There was no door.** The e-Filing portal will not let anyone begin a return
   without registering and signing in. Skipping that made the demo shorter and
   made it a demo of something the real service does not do.
4. **Nobody could ask a question.** Every screen answered the questions its
   designer anticipated. There was nowhere to put the ones they did not.

## What was built

### The site around the journey

A `Screen` now sits above the journey's `step`: `home`, `login`, `register`,
`dashboard`, `journey`. The layout takes one of three shapes — the journey keeps
its step list on the left and its case details on the right; the dashboard keeps
the case details only; home, sign-in and registration take the full measure.

The step list renders only inside the journey. A journey step renders only for a
signed-in citizen inside the journey; anything else — a stale draft, a restored
screen, a signed-out session — falls back to the home page rather than showing a
step out of its shell.

### The seven sections, honestly marked

`web/app/services.ts` holds the portal's own map: seven sections and sixteen
named services. Exactly one is built. The nav shows all seven; Home, Individual/
HUF and Help work, and the other four are disabled controls carrying a padlock,
a `Not built in this prototype` label in their accessible name, and a tooltip
saying why. Individual/HUF opens onto its eight services, of which `File your
income tax return` is live and the other seven are named, described, and marked.

The same map appears on the home page under `What do you want to do`. Nothing is
greyed into illegibility: a citizen has to be able to read a service to learn
that it exists.

### Registration, and the question it was asking wrong

The official registration screen asks you to choose between `Taxpayer` and
`Others`, and choosing `Others` opens a dropdown reading `External Agency`,
`TIN 2.0 Stakeholders`, `Chartered Accountant`, `e-return Intermediary`,
`Non-Residents not holding PAN`, `Tax Deductor and Collector`. Every one of those
is the department's word for a role, not a citizen's word for themselves. You
have to already know the answer to be allowed to ask the question.

The four stages are kept, so the flow stays recognisable. Stage one is replaced.
It asks what you actually do — *I am filing my own tax, for myself*, *I take tax
out of what I pay people and hand it to the department* — and prints the official
category as the **answer**, alongside what you will need to bring. Anyone who
arrived already knowing the jargon loses nothing: `The portal calls this:
e-return Intermediary` is on every line. Choosing a route this prototype does not
build names the correct category and stops there rather than opening an empty
screen.

### Sign-in

Two moves: the user ID, then a printed one-time code. The official field is
labelled `PAN/ AADHAAR/ OTHER USER ID` and leaves the citizen to work out which
of the three they hold; the help beside it lists departmental roles. A PAN and an
Aadhaar have unmistakable shapes, so the field reads the shape and says what it
recognised, and the help is written as *Which one am I?*.

Filing is gated behind this, as it is on the real portal. A citizen stopped at
the door keeps the step they were heading for and is put back on it once they are
through. `Sign in as the demo taxpayer` fills everything in, so a reviewer never
gets stuck at the door.

The account, the code and the password are synthetic and never leave the browser.

### The assistant

`Sahayak` is a panel over the page, not a page of its own, so it can stay open
while a citizen works through a step. Signed out, it answers questions about
filing and about which category someone belongs to. Signed in, it is given a
plain-text snapshot of the citizen's own return — the step they are on, which
Annual Information Statement lines they confirmed or disputed, the regime they
chose, the computed figures, which pre-filing defect checks are failing — so they
do not have to explain their own return back to it. `Check this step for me` asks
it to compare those figures against each other and flag what looks wrong.

The snapshot is built as readable prose on purpose: it is the same string the
*What Sahayak can see* panel shows the citizen, so there is no gap between what
they are told it knows and what it is actually sent.

**Where the model runs.** `worker/assistant.ts` calls OpenAI from the Cloudflare
Worker. The API key is a Worker secret and never reaches the browser. The system
prompt is built server-side on every request, so the client cannot replace it. It
carries the standing guardrails: this is a prototype and not the department;
never invent a rupee figure, date or reference not in the snapshot; do not give
tax advice; never ask for or repeat a real PAN, Aadhaar, password, OTP or bank
detail; say plainly when something is outside this prototype.

**What it is not.** It cannot change the return. It reads and explains; the
citizen decides and the interface writes. And it is an aid, not a dependency:
with no key on the deployment, no network, or a rate limit, the panel says which
of those happened and every step of the journey works untouched.

**The attached Form 16.** A citizen can attach their Form 16 to the conversation.
The file stays on the device and is not read — the prototype uses its synthetic
Form 16 fixture — and both the snapshot and the interface say so, rather than
implying a document was parsed.

## Verification

- `npm test` — 88 unit tests, a production build, and the server-rendered page
  check. `tests/site.test.tsx` covers the nav's disabled sections, the absent
  step list on the home page, the sign-in gate and its resumption, the user-ID
  readback, the plain-language registration, and the assistant's failure states.
  `tests/assistant-route.test.ts` covers the worker route directly: the missing
  key, the guardrails in the system prompt, history capping, and every upstream
  failure.
- `npm run test:reflow` — extended to the three new screens. No horizontal
  overflow at 320 or 360 CSS pixels, in English or Hindi, across eight journey
  steps plus sign-in, registration and the dashboard.

The nav's horizontal scroller caught a real defect during this work: visually
hidden labels inside it are absolutely positioned, and with the scroller left
`position: static` they were laid out against `.portalnav`, escaped the clip, and
dragged the whole document into a 456-pixel horizontal scroll at 320 pixels.

## Limitations

- One journey is built. The other fifteen services are named and marked only.
- The account is synthetic and local to the browser. There is no server-side
  identity, no session expiry, and no real authentication of any kind.
- The assistant's answers are generated and can be wrong. They are not tax
  advice, and the interface says so under every conversation.
