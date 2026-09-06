/* Drives headless Chrome over the Chrome DevTools Protocol (no puppeteer) to
   check every step, in both languages, at narrow widths, for horizontal
   overflow — and to capture screenshots for a visual pass. */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = process.env.OUT ?? "./.reflow-shots";
/* Overridable because more than one of these can be in flight at once — two
   runs sharing a debug port and a profile directory fight over the same Chrome
   and both hang. PORT=… OUT=… keeps them apart. */
const PORT = Number(process.env.PORT ?? 9333);
const PROFILE = process.env.CHROME_PROFILE ?? "/tmp/cdp-reflow-profile";
mkdirSync(OUT, { recursive: true });

/* Override with CHROME=/path/to/binary if the default is not present. */
const CHROME =
  process.env.CHROME ??
  ["/usr/bin/google-chrome-stable", "/usr/bin/google-chrome", "/usr/bin/chromium"].find(
    (candidate) => existsSync(candidate),
  );

if (!CHROME) {
  console.error("No Chrome binary found. Set CHROME=/path/to/chrome.");
  process.exit(2);
}

const chrome = spawn(
  CHROME,
  [
    `--remote-debugging-port=${PORT}`,
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--hide-scrollbars",
    `--user-data-dir=${PROFILE}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);

const jsonGet = async (path) => {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}${path}`);
      if (r.ok) return await r.json();
    } catch {
      /* The debugging port is not up yet; keep polling. */
    }
    await sleep(250);
  }
  throw new Error(`CDP not reachable at ${path}`);
};

/* Attach to the page target Chrome already opened. Creating a second target
   with /json/new leaves two pages alive, and evaluations can land on the one
   that is not navigating. */
const findPage = async () => {
  for (let i = 0; i < 40; i++) {
    const list = await jsonGet("/json/list");
    const page = list.find(
      (t) => t.type === "page" && t.webSocketDebuggerUrl,
    );
    if (page) return page;
    await sleep(250);
  }
  throw new Error("no page target");
};

const target = await findPage();

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.onopen = res;
  ws.onerror = rej;
});

let nextId = 1;
const pending = new Map();
const events = new Map();
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) {
      reject(new Error(JSON.stringify(msg.error)));
    } else {
      resolve(msg.result);
    }
    return;
  }
  /* Bare events: remember the last one of each kind so a navigation can be
     awaited without racing the listener registration. */
  if (msg.method) events.set(msg.method, (events.get(msg.method) ?? 0) + 1);
};
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });

await send("Page.enable");
await send("Runtime.enable");

/* Poll until the app document is actually the active context; navigating a
   fresh headless target leaves about:blank live for a moment, and localStorage
   does not exist there. */
const waitReady = async () => {
  for (let i = 0; i < 120; i++) {
    try {
      const ok = await evaluate(
        `document.readyState === "complete" && location.origin === ${JSON.stringify(BASE)} && typeof localStorage !== "undefined"`,
      );
      if (ok) return;
    } catch {
      /* Evaluating against a context that is being replaced throws; retry. */
    }
    await sleep(200);
  }
  throw new Error("page never became ready");
};

/* Navigate and wait for the load event count to move, then for the document to
   settle. Polling alone races the swap between old and new contexts. */
const goto = async (url) => {
  const before = events.get("Page.loadEventFired") ?? 0;
  await send("Page.navigate", { url });
  for (let i = 0; i < 120; i++) {
    if ((events.get("Page.loadEventFired") ?? 0) > before) break;
    await sleep(100);
  }
  await waitReady();
};

const evaluate = async (expression) => {
  const { result, exceptionDetails } = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (exceptionDetails) throw new Error(JSON.stringify(exceptionDetails));
  return result.value;
};

/* Seed a draft that has reached a given step, matching the app's storage shape.
   Filing sits behind the sign-in wall, so a seeded journey step also needs a
   session and the screen it belongs on. Step 0 is the signed-out home page. */
const seedFor = (step, language) => `
  ${step === 0
    ? `localStorage.removeItem("sahi-return-session-v1");
       localStorage.setItem("sahi-return-screen-v1", "home");`
    : `localStorage.setItem("sahi-return-session-v1", JSON.stringify({
         userId: "DEMOA1234X",
         kind: "pan",
         name: "Ananya Rao",
         signedInAt: "2026-08-28T04:00:00.000Z"
       }));
       localStorage.setItem("sahi-return-screen-v1", "journey");`}
  localStorage.setItem("sahi-return-filing-draft-v1", JSON.stringify({
    step: ${step},
    language: ${JSON.stringify(language)},
    lowData: false,
    documents: [
      {kind:"form16",name:"Demo-Form-16-AY-2026-27.pdf",size:"198 KB",source:"Synthetic Form 16 from the employer",loaded:true},
      {kind:"ais",name:"Demo-AIS-26AS-AY-2026-27.pdf",size:"241 KB",source:"Synthetic Annual Information Statement",loaded:true}
    ],
    salaryConfirmed: true,
    incomeAnswers: {"savings-sampurna":"mine","fd-sampurna":"mine","dividend-meghdoot":"mine","fd-trilok":"not-mine"},
    regime: "new",
    declaration: true,
    status: ${step === 7 ? '"submitted"' : '"draft"'},
    reference: ${step === 7 ? '"DEMO-ACK-2026-4471028"' : "null"},
    submittedAt: ${step === 7 ? '"27 Aug 2026, 11:59 pm"' : "null"},
    /* The machine-readable twin, without which the acknowledgement's
       verification block cannot count the 30 days it is warning about. */
    submittedIso: ${step === 7 ? '"2026-08-27T18:29:00.000Z"' : "null"},
    verifiedAt: null,
    verifiedIso: null,
    verificationRoute: null,
    personalDetails: {},
    feedbackReference: null
  }));
`;

const widths = [
  { label: "320", width: 320, height: 900, scale: 1 },
  { label: "360", width: 360, height: 900, scale: 1 },
];

/* Seed one of the site's own screens, outside the journey. Sign-in and
   registration are reached signed out; the dashboard needs a session. */
const seedScreen = (name, language) => `
  ${name === "dashboard" || name === "tax-inbox"
    ? `localStorage.setItem("sahi-return-session-v1", JSON.stringify({
         userId: "DEMOA1234X",
         kind: "pan",
         name: "Ananya Rao",
         signedInAt: "2026-08-28T04:00:00.000Z"
       }));`
    : `localStorage.removeItem("sahi-return-session-v1");`}
  localStorage.setItem("sahi-return-screen-v1", ${JSON.stringify(name)});
  localStorage.setItem("sahi-return-filing-draft-v1", JSON.stringify({
    step: ${name === "dashboard" || name === "tax-inbox" ? 3 : 0},
    language: ${JSON.stringify(language)},
    lowData: false,
    documents: [],
    salaryConfirmed: false,
    incomeAnswers: {},
    regime: null,
    declaration: false,
    status: "draft",
    reference: null,
    submittedAt: null,
    feedbackReference: null
  }));
`;

const failures = [];
const steps = [0, 1, 2, 3, 4, 5, 6, 7];
/* The screens around the journey: the sign-in wall, registration, and the
   signed-in dashboard. */
const screens = ["login", "register", "dashboard", "tax-inbox"];

const readReport = () =>
  evaluate(`(() => {
    const de = document.documentElement;
    const overflow = de.scrollWidth - de.clientWidth;
    const wide = [...document.querySelectorAll("body *")]
      .filter(el => {
        const r = el.getBoundingClientRect();
        return r.width > de.clientWidth + 1 && r.height > 0;
      })
      .slice(0, 5)
      .map(el => el.tagName.toLowerCase() + "." + (el.className || "").toString().split(" ")[0]);
    const h1 = document.querySelector("h1");
    return {
      overflow,
      wide,
      heading: h1 ? h1.textContent.slice(0, 60) : null,
      lang: de.lang,
    };
  })()`);

for (const { label, width, height } of widths) {
  for (const language of ["en", "hi"]) {
    for (const target of [...steps, ...screens]) {
      const step = typeof target === "number" ? target : null;
      await send("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: true,
      });

      await goto(BASE);
      await evaluate(
        step === null ? seedScreen(target, language) : seedFor(step, language),
      );
      await goto(BASE);
      await sleep(500);

      let report = await readReport();
      const invalidPage = () =>
        report.lang !== language ||
        !report.heading ||
        report.heading.toLowerCase().includes("couldn");

      /* A hot development server can occasionally return its error boundary
         while it is replacing a module. Retry that state once, but never let
         an error page or a failed language switch count as a reflow pass. */
      if (invalidPage()) {
        await goto(BASE);
        await sleep(750);
        report = await readReport();
      }

      const tag = `${label}-${language}-${step === null ? target : `step${step}`}`;
      if (report.overflow > 0 || invalidPage()) {
        failures.push({ tag, ...report });
      }

      if (label === "320" && language === "en") {
        const shot = await send("Page.captureScreenshot", {
          format: "png",
          captureBeyondViewport: true,
        });
        writeFileSync(`${OUT}/${tag}.png`, Buffer.from(shot.data, "base64"));
      }
      console.log(
        `${tag.padEnd(22)} overflow=${report.overflow} lang=${report.lang} :: ${report.heading}`,
      );
    }
  }
}

console.log("\n=== RESULT ===");
if (failures.length === 0) {
  console.log("Every page loaded in the requested language with no horizontal overflow at 320 or 360 CSS pixels.");
} else {
  console.log("REFLOW OR PAGE-LOAD FAILURE:");
  for (const f of failures) console.log(" ", f.tag, f.overflow, f.wide.join(", "));
}

ws.close();
chrome.kill();
process.exit(failures.length === 0 ? 0 : 1);
