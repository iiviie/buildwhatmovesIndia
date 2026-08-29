/* The filing assistant's server side.

   The browser never sees the API key. It posts the conversation and a snapshot
   of where the citizen has reached in their own return; this route builds the
   system prompt, calls the model, and returns one string.

   The assistant is an aid, not a dependency. Every step of the journey works
   with this route switched off, and the client says so when it fails. */

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

const DEFAULT_MODEL = "gpt-4.1-mini";

/* Enough for a careful paragraph and a short list. The system prompt asks for
   brevity; this is the hard stop behind it. */
const MAX_OUTPUT_TOKENS = 600;

const MAX_TURNS = 12;

const MAX_CHARS_PER_TURN = 4000;

export type AssistantEnv = {
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
};

type Turn = { role: "user" | "assistant"; content: string };

type Body = {
  mode?: "chat" | "check";
  language?: "en" | "hi";
  messages?: Turn[];
  /* A plain-text snapshot of the draft, built in the browser. Kept as text
     rather than JSON so that what the model is told is exactly what the
     "What Sahayak can see" panel shows the citizen. */
  context?: string;
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

const systemPrompt = (mode: "chat" | "check", language: "en" | "hi", context: string) => {
  const lines = [
    "You are Sahayak, the assistant inside Sahi Return — an independent hackathon prototype of the Indian Income Tax e-Filing journey for a salaried individual filing ITR-1.",
    "",
    "What is true about where you are running:",
    "- This is a prototype. It is not the Income Tax Department, it creates no government record, and it files nothing with anyone.",
    "- Every figure, PAN, document and reference in it is synthetic. The taxpayer is fictional.",
    "- The prototype builds one journey only: a salaried individual, ITR-1, assessment year 2026-27. Company returns, TDS statements, CA and ERI journeys are named in the navigation but not built.",
    "",
    "How to answer:",
    "- Be brief. Usually three or four sentences. Use a short list only when the answer really is a list.",
    "- Use plain words. Where a departmental term is unavoidable, name it and then say what it means in one clause.",
    "- Never invent a number. Every rupee figure, date or reference you state must come from the snapshot below or from the person's own message. If you do not have it, say what you do not have.",
    "- Do not give tax advice or tell anyone what to claim. Explain what a field means, what the rule is, and what the prototype has worked out and why.",
    "- Answer only about this prototype and the ITR-1 filing it covers: its screens and fields, the figures it has worked out, the tax rules behind them, and what to do next. Everything else — other software, general knowledge, writing tasks, chat — is out of scope.",
    "- When a question is out of scope, say so in one sentence and point to the official portal at incometax.gov.in. Do not answer it anyway, do not add a caveat-laden partial answer, and do not pretend a screen exists.",
    "- Do not restate the snapshot back at them, do not recap the conversation, and do not close with an offer of further help. Answer the question and stop.",
    "- Never ask for, and never repeat back, a real PAN, Aadhaar, password, OTP or bank detail. If someone offers one, tell them not to and carry on.",
    "- You cannot change the return. You can tell someone which step to go to and what to do there.",
    language === "hi"
      ? "- Reply in Hindi (Devanagari), in the same plain register as the interface."
      : "- Reply in English.",
  ];

  if (mode === "check") {
    lines.push(
      "",
      "This request is a step check, not a question. Look at the snapshot and answer in this shape:",
      "1. One sentence saying whether this step looks complete.",
      "2. Anything genuinely missing or inconsistent, as a short list. Compare figures against each other — TDS against salary, confirmed income against the statement, the chosen regime against the comparison.",
      "3. If nothing is wrong, say so in one line and do not manufacture a concern.",
      "Flag only what the snapshot actually supports. Do not speculate about documents you cannot see.",
    );
  }

  lines.push("", "Snapshot of this person's session:", context.trim() || "(not signed in; nothing known about them)");

  return lines.join("\n");
};

const clean = (turns: Turn[]): Turn[] =>
  turns
    .filter(
      (turn): turn is Turn =>
        !!turn &&
        (turn.role === "user" || turn.role === "assistant") &&
        typeof turn.content === "string" &&
        turn.content.trim().length > 0,
    )
    .slice(-MAX_TURNS)
    .map((turn) => ({ role: turn.role, content: turn.content.slice(0, MAX_CHARS_PER_TURN) }));

/* ------------------------------------------------------- the scope gate */

/* The assistant costs money per question, so a question it has no business
   answering should not reach the model at all. Two cheap tests run on the last
   thing the citizen typed, before the upstream call:

     - a greeting or a thank-you gets a fixed line back;
     - anything that reads as a request from another world entirely — write me
       code, a poem, who won the match — is turned away, unless it also carries
       a word from this journey, in which case it goes through.

   The regexes are deliberately narrow. A false refusal is worse than a wasted
   call, so anything ambiguous is sent on and the system prompt's own scope
   rule catches it. */

const GREETING =
  /^\s*(hi|hey|hello|yo|namaste|namaskar|thanks|thank you|thx|ta|ok|okay|cool|bye|goodbye|नमस्ते|नमस्कार|धन्यवाद|शुक्रिया|ठीक है|अलविदा)[\s!.,?]*$/iu;

/* A word from this journey anywhere in the message vetoes a refusal. */
const IN_SCOPE =
  /\b(tax|taxable|itr|return|refund|regime|salary|salaried|deduction|exempt|rebate|tds|form ?16|ais|26as|annual information|pan|aadhaar|assessment year|financial year|belated|due date|deadline|notice|defect|defective|e-?fil|income|interest income|hra|80c|80d|standard deduction|slab|verify|verification|acknowledg|file|filing|step|regime|employer|gross|payable|challan|department|portal)\b|आयकर|रिटर्न|वेतन|कर|टीडीएस|छूट|कटौती|रिफंड|फॉर्म|तारीख|नोटिस/iu;

/* Requests that plainly belong somewhere else. */
const OFF_TOPIC =
  /\b(write|generate|compose|draft) (me )?(a |an |some )?(poem|song|story|essay|joke|script|rap|haiku|novel|blog|tweet|email to)\b|\b(python|javascript|typescript|java|c\+\+|sql|html|css|react|regex|leetcode|algorithm|function|code snippet)\b|\b(recipe|cook|weather|horoscope|astrolog|cricket|football|ipl|match score|movie|film|song lyrics|game|stock tip|crypto|bitcoin|dating|medical|diagnos|prescri)\b|\btell me a joke\b|\b(who|what) (is|was|are|were) the (president|prime minister|capital|tallest|largest)\b|\bignore (all )?(previous|prior|above) instructions?\b|\b(system prompt|your prompt|your instructions|jailbreak)\b/iu;

const GREETING_REPLY = {
  en: "Hello. I can explain anything on this prototype's ITR-1 journey — a field, a figure it has worked out, or what to do on the step you are on. What would you like to know?",
  hi: "नमस्ते। मैं इस प्रोटोटाइप की ITR-1 यात्रा से जुड़ी कोई भी बात समझा सकता हूँ — कोई फ़ील्ड, कोई गणना, या आप जिस चरण पर हैं वहाँ क्या करना है। आप क्या जानना चाहेंगे?",
};

const OFF_TOPIC_REPLY = {
  en: "That is outside this prototype. I only cover the ITR-1 filing journey on this site — the fields, the figures it has worked out, and what to do on each step. For anything else about your real return, use the official portal at incometax.gov.in.",
  hi: "यह इस प्रोटोटाइप के दायरे से बाहर है। मैं केवल इस साइट की ITR-1 फाइलिंग यात्रा — इसके फ़ील्ड, गणनाएँ और हर चरण पर क्या करना है — के बारे में बता सकता हूँ। अपने असली रिटर्न से जुड़ी किसी और बात के लिए incometax.gov.in देखें।",
};

/* The canned reply for a message not worth a model call, or null to let it
   through. Step checks are never gated: they are the interface asking, not the
   citizen. */
export const gate = (
  mode: "chat" | "check",
  language: "en" | "hi",
  messages: Turn[],
): string | null => {
  if (mode !== "chat") return null;

  const last = messages[messages.length - 1];
  if (!last || last.role !== "user") return null;

  const text = last.content.trim();
  if (GREETING.test(text)) return GREETING_REPLY[language];
  if (OFF_TOPIC.test(text) && !IN_SCOPE.test(text)) return OFF_TOPIC_REPLY[language];
  return null;
};

export async function handleAssistant(
  request: Request,
  env: AssistantEnv,
): Promise<Response> {
  const key = env.OPENAI_API_KEY;
  if (!key) {
    /* Deployed without a key. The client turns the assistant off and says why,
       rather than showing a broken chat. */
    return json({ error: "missing-key" }, 503);
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return json({ error: "bad-request" }, 400);
  }

  const messages = clean(body.messages ?? []);
  if (messages.length === 0) return json({ error: "bad-request" }, 400);

  const mode = body.mode === "check" ? "check" : "chat";
  const language = body.language === "hi" ? "hi" : "en";
  const context = typeof body.context === "string" ? body.context.slice(0, 8000) : "";

  /* Answered here, for nothing, rather than at the price of a model call. */
  const canned = gate(mode, language, messages);
  if (canned) return json({ reply: canned });

  let upstream: Response;
  try {
    upstream = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL || DEFAULT_MODEL,
        temperature: 0.2,
        max_tokens: MAX_OUTPUT_TOKENS,
        messages: [
          { role: "system", content: systemPrompt(mode, language, context) },
          ...messages,
        ],
      }),
    });
  } catch {
    return json({ error: "upstream" }, 502);
  }

  if (upstream.status === 429) return json({ error: "rate" }, 429);
  if (upstream.status === 401 || upstream.status === 403) {
    return json({ error: "missing-key" }, 503);
  }
  if (!upstream.ok) return json({ error: "upstream" }, 502);

  let reply = "";
  try {
    const data = (await upstream.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    reply = data.choices?.[0]?.message?.content?.trim() ?? "";
  } catch {
    return json({ error: "upstream" }, 502);
  }

  if (!reply) return json({ error: "upstream" }, 502);

  return json({ reply });
}
