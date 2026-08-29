/* Opens a hovercard in a real browser and photographs it, so the jargon layer
   and the step previews get a visual pass rather than only a unit test.
   Shares the CDP plumbing style of reflow.mjs. */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = process.env.OUT ?? "./.hovercard-shots";
const PORT = 9334;
mkdirSync(OUT, { recursive: true });

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
    /* A fresh profile per run: a stale lock from a killed Chrome, or another
       Chrome sharing the directory, stops the debugging port coming up at all. */
    `--user-data-dir=/tmp/cdp-hovercard-${process.pid}`,
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
      /* Debugging port not up yet. */
    }
    await sleep(250);
  }
  throw new Error(`CDP not reachable at ${path}`);
};

const target = (await jsonGet("/json/list")).find(
  (t) => t.type === "page" && t.webSocketDebuggerUrl,
);
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
    if (msg.error) reject(new Error(JSON.stringify(msg.error)));
    else resolve(msg.result);
    return;
  }
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
/* A headless page is not the focused window, so .focus() dispatches nothing.
   Without this the whole run silently photographs closed cards. */
await send("Emulation.setFocusEmulationEnabled", { enabled: true });

const evaluate = async (expression) => {
  const { result, exceptionDetails } = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (exceptionDetails) throw new Error(JSON.stringify(exceptionDetails));
  return result.value;
};

const goto = async (url) => {
  const before = events.get("Page.loadEventFired") ?? 0;
  await send("Page.navigate", { url });
  for (let i = 0; i < 120; i++) {
    if ((events.get("Page.loadEventFired") ?? 0) > before) break;
    await sleep(100);
  }
  for (let i = 0; i < 120; i++) {
    try {
      if (await evaluate(`document.readyState === "complete"`)) break;
    } catch {
      /* Context being replaced. */
    }
    await sleep(150);
  }
};

const seed = (step, language) => `
  localStorage.setItem("sahi-return-prefs-v1", JSON.stringify({
    theme: ${JSON.stringify(process.env.THEME ?? "light")}, textScale: "base"
  }));
  localStorage.setItem("sahi-return-session-v1", JSON.stringify({
    userId: "DEMOA1234X", kind: "pan", name: "Ananya Rao",
    signedInAt: "2026-08-28T04:00:00.000Z"
  }));
  localStorage.setItem("sahi-return-screen-v1", ${step === 0 ? '"home"' : '"journey"'});
  localStorage.setItem("sahi-return-filing-draft-v1", JSON.stringify({
    step: ${step}, language: ${JSON.stringify(language)}, lowData: false,
    documents: [
      {kind:"form16",name:"Demo-Form-16-AY-2026-27.pdf",size:"198 KB",source:"Synthetic Form 16 from the employer",loaded:true},
      {kind:"ais",name:"Demo-AIS-26AS-AY-2026-27.pdf",size:"241 KB",source:"Synthetic Annual Information Statement",loaded:true}
    ],
    salaryConfirmed: true,
    incomeAnswers: {"savings-sampurna":"mine","fd-sampurna":"mine","dividend-meghdoot":"mine","fd-trilok":"not-mine"},
    regime: "new", declaration: true, status: "draft",
    reference: null, submittedAt: null, feedbackReference: null
  }));
`;

const shoot = async (name) => {
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(`${OUT}/${name}.png`, Buffer.from(data, "base64"));
};

/* Drive a real pointer rather than calling .focus(), so what gets photographed
   is the hover path a citizen actually uses, delay and all. */
const centreOf = (selector, index) => `
  (() => {
    const nodes = [...document.querySelectorAll(${JSON.stringify(selector)})];
    const node = nodes[${index}];
    if (!node) return JSON.stringify({ error: "not found", count: nodes.length });
    node.scrollIntoView({ block: "center" });
    const r = node.getBoundingClientRect();
    return JSON.stringify({
      x: Math.round(r.left + r.width / 2),
      y: Math.round(r.top + r.height / 2),
      label: node.getAttribute("aria-label") || node.textContent.trim().slice(0, 60)
    });
  })()
`;

const hover = async (selector, index = 0) => {
  const found = JSON.parse(await evaluate(centreOf(selector, index)));
  if (found.error) return found;
  /* Move in two hops: React's mouseenter needs the pointer to arrive from
     somewhere else, and a single jump from 0,0 can land mid-layout. */
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 2, y: 2 });
  await sleep(60);
  await send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: found.x,
    y: found.y,
  });
  /* Longer than the 500ms cold open delay. */
  await sleep(900);
  const panels = await evaluate(`document.querySelectorAll(".hc-panel").length`);
  return { ...found, panels };
};

console.log("media:", await evaluate(`JSON.stringify({
  hoverNone: matchMedia("(hover: none)").matches,
  hoverHover: matchMedia("(hover: hover)").matches,
  anyHoverHover: matchMedia("(any-hover: hover)").matches,
  pointerCoarse: matchMedia("(pointer: coarse)").matches,
  anyPointerFine: matchMedia("(any-pointer: fine)").matches
})`));

const cases = [
  { name: "term-in-prose", step: 3, lang: "en", sel: ".work .hc-trigger", i: 0 },
  { name: "term-hindi", step: 3, lang: "hi", sel: ".work .hc-trigger", i: 0 },
  { name: "step-preview-locked", step: 2, lang: "en", sel: ".toc .hc-trigger", i: 6 },
  { name: "step-preview-current", step: 4, lang: "en", sel: ".toc .hc-trigger", i: 3 },
  { name: "documents-panel", step: 0, lang: "en", sel: ".docs-more summary", i: 1 },
  { name: "eligibility", step: 1, lang: "en", sel: ".elig-section-toggle", i: 1 },
  {
    name: "eligibility-open",
    step: 1,
    lang: "en",
    sel: ".elig-legend",
    i: 0,
    before: `document.querySelectorAll(".elig-section-toggle")[1].click()`,
  },
  {
    name: "personal-section",
    step: 1,
    lang: "en",
    sel: ".pers-title",
    i: 0,
    before: `document.querySelector(".pers")?.scrollIntoView({ block: "start" })`,
  },
  {
    name: "bank-details",
    step: 1,
    lang: "en",
    sel: ".pers-legend",
    i: 0,
    before: `document.querySelector(".pers-accounts")?.scrollIntoView({ block: "start" })`,
  },
  {
    name: "login",
    step: 0,
    lang: "en",
    sel: ".login-actions button",
    i: 0,
    before: `(() => {
      localStorage.removeItem("sahi-return-session-v1");
      localStorage.setItem("sahi-return-screen-v1", "login");
      location.reload();
    })()`,
  },
  {
    name: "income-amend",
    step: 3,
    lang: "en",
    sel: ".finding input[value=\"amended\"], .finding input[type=radio]",
    i: 1,
    before: `(() => {
      const r = [...document.querySelectorAll('.finding input[type=radio]')];
      const amended = r.find((x) => x.id.endsWith("-amended"));
      if (amended) { amended.click(); amended.scrollIntoView({block:"center"}); }
    })()`,
  },
  {
    name: "eligibility-blocked",
    step: 1,
    lang: "en",
    sel: ".elig-outcome-form",
    i: 0,
    before: `(() => {
      document.querySelectorAll(".elig-section-toggle")[1].click();
      const radios = [...document.querySelectorAll('input[type="radio"]')];
      const yes = radios.find((r) => r.value === "yes");
      if (yes) yes.click();
    })()`,
  },
];

for (const { name, step, lang, sel, i, before } of cases) {
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await goto(BASE);
  await evaluate(seed(step, lang));
  await goto(BASE);
  await sleep(700);
  if (before) {
    await evaluate(before);
    await sleep(400);
  }
  const got = await hover(sel, i);
  await shoot(name);
  console.log(`${name.padEnd(24)} panels=${got.panels ?? 0}  ${got.label ?? got.error}`);
}

/* Principle 7: on a phone, is the thing the citizen came to do reachable
   without scrolling? */
for (const [w, h] of [[390, 844], [360, 740], [320, 720]]) {
  await send("Emulation.setDeviceMetricsOverride", {
    width: w, height: h, deviceScaleFactor: 1, mobile: true,
  });
  await goto(BASE);
  await evaluate(`
    localStorage.setItem("sahi-return-prefs-v1", JSON.stringify({theme:"light",textScale:"base"}));
    localStorage.removeItem("sahi-return-session-v1");
    localStorage.setItem("sahi-return-screen-v1", "home");
    localStorage.removeItem("sahi-return-filing-draft-v1");
  `);
  await goto(BASE);
  await sleep(700);
  const where = await evaluate(`
    (() => {
      const b = [...document.querySelectorAll("button")].find((n) =>
        /start the return/i.test(n.textContent || ""));
      if (!b) return "not found";
      const r = b.getBoundingClientRect();
      return JSON.stringify({
        top: Math.round(r.top), fold: window.innerHeight,
        visible: r.top < window.innerHeight,
      });
    })()
  `);
  console.log(`start-button ${w}x${h}`.padEnd(24), where);
  if (w === 360) {
    console.log("stack:", await evaluate(`
      (() => {
        const rows = [];
        const add = (sel) => {
          const n = document.querySelector(sel);
          if (n) rows.push([sel, Math.round(n.getBoundingClientRect().height)]);
        };
        [".trustbar", ".masthead", ".portalnav", ".stepstrip", ".savebar",
         ".alarm", ".hero-home", ".hero-home h1", ".hero-home .lede",
         ".start-card", ".start-facts", ".home-deadline",
         ".start-card .label"].forEach(add);
        return JSON.stringify(rows);
      })()
    `));
  }
  await shoot(`home-${w}`);
}

/* The narrow case matters most: a fixed-position panel is the easiest thing to
   let run off the side of a phone. */
await send("Emulation.setDeviceMetricsOverride", {
  width: 320,
  height: 720,
  deviceScaleFactor: 1,
  mobile: true,
});
await goto(BASE);
await evaluate(seed(3, "en"));
await goto(BASE);
await sleep(700);
const narrow = await hover(".work .hc-trigger", 0);
console.log("320-term".padEnd(24), `panels=${narrow.panels ?? 0}  ${narrow.label ?? narrow.error}`);
const bounds = await evaluate(`
  (() => {
    const p = document.querySelector(".hc-panel");
    if (!p) return "no panel";
    const r = p.getBoundingClientRect();
    return JSON.stringify({
      left: Math.round(r.left), right: Math.round(r.right),
      width: Math.round(r.width), viewport: window.innerWidth,
      offscreen: r.left < 0 || r.right > window.innerWidth,
      docOverflow: document.documentElement.scrollWidth - window.innerWidth
    });
  })()
`);
console.log("320 panel bounds:", bounds);
await shoot("320-term");

ws.close();
chrome.kill();
console.log(`\nShots in ${OUT}`);
