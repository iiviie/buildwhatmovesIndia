/* Loads the app in headless Chrome, records every console message and uncaught
   exception, then clicks a real control and reports whether anything happened.
   "The buttons do not work" is nearly always a hydration failure, and a
   hydration failure is nearly always one exception nobody saw. */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const BASE = process.env.BASE ?? "http://localhost:3000";
const PORT = 9410;

const CHROME =
  process.env.CHROME ??
  ["/usr/bin/google-chrome-stable", "/usr/bin/google-chrome", "/usr/bin/chromium"].find(
    (candidate) => existsSync(candidate),
  );
if (!CHROME) {
  console.error("No Chrome binary found.");
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
    `--user-data-dir=/tmp/cdp-console-${process.pid}`,
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
      /* not up yet */
    }
    await sleep(250);
  }
  throw new Error("CDP not reachable");
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
const logs = [];
const errors = [];

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(JSON.stringify(msg.error)));
    else resolve(msg.result);
    return;
  }
  if (msg.method === "Runtime.consoleAPICalled") {
    const text = (msg.params.args ?? [])
      .map((a) => a.value ?? a.description ?? a.type)
      .join(" ");
    logs.push(`[${msg.params.type}] ${text}`);
  }
  if (msg.method === "Runtime.exceptionThrown") {
    const d = msg.params.exceptionDetails;
    errors.push(
      `${d.text} ${d.exception?.description ?? ""}`.trim() +
        (d.url ? `\n    at ${d.url}:${d.lineNumber}:${d.columnNumber}` : ""),
    );
  }
  if (msg.method === "Log.entryAdded" && msg.params.entry.level === "error") {
    errors.push(`[log] ${msg.params.entry.text} ${msg.params.entry.url ?? ""}`);
  }
};

const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });

await send("Page.enable");
await send("Runtime.enable");
await send("Log.enable");

const evaluate = async (expression) => {
  const { result, exceptionDetails } = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (exceptionDetails) throw new Error(JSON.stringify(exceptionDetails));
  return result.value;
};

await send("Page.navigate", { url: BASE });
await sleep(3500);

console.log("=== console ===");
for (const line of logs) console.log(" ", line);
console.log("=== errors ===");
if (errors.length === 0) console.log("  none");
for (const line of errors) console.log(" ", line);

/* React attaches a root container property once it has hydrated. */
console.log("=== hydration ===");
console.log(
  await evaluate(`
    (() => {
      const root = document.querySelector("#main-content") || document.body;
      const keys = Object.keys(root).filter((k) => k.startsWith("__react"));
      const anyFiber = [...document.querySelectorAll("button")].some((b) =>
        Object.keys(b).some((k) => k.startsWith("__react")),
      );
      return JSON.stringify({
        buttons: document.querySelectorAll("button").length,
        rootKeys: keys,
        buttonsHaveReactProps: anyFiber,
      });
    })()
  `),
);

console.log("=== click 'Start the return' ===");
console.log(
  await evaluate(`
    (() => {
      const b = [...document.querySelectorAll("button")].find((n) =>
        /start the return/i.test(n.textContent || ""),
      );
      if (!b) return "button not found";
      const before = document.body.innerText.slice(0, 120);
      b.click();
      return JSON.stringify({ clicked: true, before: before.replace(/\\s+/g, " ") });
    })()
  `),
);
await sleep(1200);
console.log(
  await evaluate(
    `JSON.stringify({ headingNow: document.querySelector("h1")?.textContent })`,
  ),
);

ws.close();
chrome.kill();
