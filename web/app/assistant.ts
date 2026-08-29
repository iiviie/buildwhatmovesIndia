/* The filing assistant, browser side.

   Two jobs: describe the citizen's own session to the model in plain text, and
   carry one request to `/api/assistant`. The key lives in the worker; nothing
   here knows it.

   The context is built as readable prose on purpose. It is the same string the
   "What Sahayak can see" panel shows the citizen, so there is no gap between
   what they are told the assistant knows and what it is actually sent. */

import {
  buildComputation,
  checksNeedingAttention,
  demoCase,
  disputedEntries,
  incomeEntries,
  otherIncomeTotal,
  strandedTds,
  type DraftState,
  type Language,
} from "./case-data";
import type { Session } from "./auth";

export type ChatRole = "user" | "assistant";

export type ChatTurn = { role: ChatRole; content: string };

export type AssistantError = "network" | "key" | "rate" | "unknown";

const STEP_NAMES = [
  "the start screen",
  "What applies to you",
  "Your salary",
  "Your other income",
  "Your tax regime",
  "Before you file",
  "Review and file",
  "Acknowledgement",
];

const rupees = (value: number) => `Rs ${value.toLocaleString("en-IN")}`;

/* ------------------------------------------------------------ the snapshot */

export type ContextInput = {
  draft: DraftState;
  session: Session | null;
  /* Where the citizen is in the shell, when that is not a journey step. */
  screen: string;
  attachment: string | null;
};

export const buildContext = ({
  draft,
  session,
  screen,
  attachment,
}: ContextInput): string => {
  if (!session) {
    return [
      "Not signed in.",
      `Looking at: ${screen}.`,
      "Nothing is known about this person. Do not guess at their figures or their category.",
    ].join("\n");
  }

  const lines: string[] = [
    `Signed in as ${session.name} (synthetic account, user ID ${session.userId}).`,
    `Assessment year ${demoCase.assessmentYear}, financial year ${demoCase.financialYear}.`,
    `Form worked out for them: ${demoCase.form}. Employment: ${demoCase.employmentType}. Employer: ${demoCase.employer}.`,
    `Statutory due date ${demoCase.dueDateOriginal}; belated return accepted until ${demoCase.dueDateBelated}.`,
    "",
    screen === "journey"
      ? `Currently on step ${draft.step} of 7: ${STEP_NAMES[draft.step] ?? "unknown"}.`
      : `Currently looking at: ${screen}. Their return is at step ${draft.step} of 7 (${STEP_NAMES[draft.step] ?? "unknown"}).`,
    `Return status: ${draft.status}.`,
  ];

  const loaded = draft.documents.filter((document) => document.loaded);
  lines.push(
    loaded.length === 0
      ? "Documents loaded: none yet."
      : `Documents loaded: ${loaded.map((document) => document.kind).join(", ")}.`,
  );

  lines.push(
    `Form 16 figures (synthetic fixture): gross salary ${rupees(demoCase.grossSalary)}, TDS deducted by employer ${rupees(demoCase.salaryTds)}.`,
    `Confirmed the salary figures match Form 16: ${draft.salaryConfirmed ? "yes" : "not yet"}.`,
  );

  const answered = incomeEntries.filter(
    (entry) => draft.incomeAnswers[entry.id] != null,
  );
  const mine = incomeEntries.filter(
    (entry) => draft.incomeAnswers[entry.id] === "mine",
  );
  const disputed = disputedEntries(draft);

  lines.push(
    "",
    `Other income from the Annual Information Statement: ${answered.length} of ${incomeEntries.length} lines reviewed.`,
  );
  for (const entry of incomeEntries) {
    const answer = draft.incomeAnswers[entry.id];
    lines.push(
      `- ${entry.payer}: ${rupees(entry.amount)}${entry.tds ? `, TDS ${rupees(entry.tds)}` : ""} — ${
        answer === "mine"
          ? "confirmed as theirs"
          : answer === "not-mine"
            ? "marked NOT theirs, so it stays out of the return"
            : "not reviewed yet"
      }`,
    );
  }
  if (mine.length > 0) {
    lines.push(`Other income they have confirmed: ${rupees(otherIncomeTotal(draft))}.`);
  }
  if (disputed.length > 0) {
    lines.push(
      `TDS stranded on disputed lines, which cannot be claimed: ${rupees(strandedTds(draft))}.`,
    );
  }

  lines.push(
    "",
    draft.regime
      ? `Regime chosen: ${draft.regime === "new" ? "new" : "old"}.`
      : "Regime not chosen yet.",
  );

  if (draft.regime) {
    const computation = buildComputation(draft);
    lines.push(
      `Computed on the ${draft.regime} regime: total income ${rupees(computation.totalIncome)}, total tax ${rupees(computation.totalTax)}, TDS credited ${rupees(computation.tdsPaid)}, ${
        computation.refundDue > 0
          ? `refund due ${rupees(computation.refundDue)}`
          : `balance payable ${rupees(computation.balancePayable)}`
      }.`,
    );
  }

  const attention = checksNeedingAttention(draft);
  lines.push(
    attention.length === 0
      ? "Pre-filing defect checks: all passing."
      : `Pre-filing defect checks needing attention: ${attention.map((check) => check.id).join(", ")}.`,
  );

  lines.push(
    `Declaration ticked: ${draft.declaration ? "yes" : "no"}.`,
    draft.reference
      ? `Synthetic acknowledgement reference: ${draft.reference}.`
      : "Not filed yet.",
  );

  if (attachment) {
    lines.push(
      "",
      `They attached a file named "${attachment}" to this conversation. It stayed on their device and was not read. This prototype uses the synthetic Form 16 figures above. Say so plainly if they ask what you found in it.`,
    );
  }

  return lines.join("\n");
};

/* -------------------------------------------------------------- the call */

export type AskInput = {
  messages: ChatTurn[];
  context: string;
  language: Language;
  mode: "chat" | "check";
  signal?: AbortSignal;
};

export type AskResult =
  | { ok: true; reply: string }
  | { ok: false; error: AssistantError };

const errorFor = (status: number, code: unknown): AssistantError => {
  if (code === "missing-key") return "key";
  if (code === "rate" || status === 429) return "rate";
  if (status === 503) return "key";
  return "unknown";
};

export const ask = async ({
  messages,
  context,
  language,
  mode,
  signal,
}: AskInput): Promise<AskResult> => {
  let response: Response;
  try {
    response = await fetch("/api/assistant", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages, context, language, mode }),
      signal,
    });
  } catch {
    return { ok: false, error: "network" };
  }

  let data: { reply?: string; error?: string };
  try {
    data = (await response.json()) as { reply?: string; error?: string };
  } catch {
    return { ok: false, error: response.ok ? "unknown" : errorFor(response.status, null) };
  }

  if (!response.ok || !data.reply) {
    return { ok: false, error: errorFor(response.status, data.error) };
  }

  return { ok: true, reply: data.reply };
};
