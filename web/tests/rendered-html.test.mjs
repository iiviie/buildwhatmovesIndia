import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the complete prototype start page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Defective return demo \| Sahi Return<\/title>/i);
  assert.match(html, /Independent hackathon prototype/);
  assert.match(html, /Start the synthetic case/);
  assert.match(html, /Synthetic data only/);
  assert.match(html, /Do not upload a real tax document or identifier/);
  assert.match(html, /Skip to main content/);
  assert.match(
    html,
    /property="og:image" content="http:\/\/localhost(?::3000)?\/og\.png"/i,
  );
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Starter Project/);
});

test("ships no government logo, external font, or live government request", async () => {
  const response = await render();
  const html = await response.text();

  assert.doesNotMatch(html, /national emblem|Income Tax Department logo/i);
  assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com/i);
  assert.doesNotMatch(html, /fetch\([^)]*incometax\.gov\.in/i);
});
