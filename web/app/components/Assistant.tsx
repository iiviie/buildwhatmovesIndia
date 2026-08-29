"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ask,
  type AssistantError,
  type ChatTurn,
} from "../assistant";
import { MAX_FILE_MB, validateFile, type Language } from "../case-data";
import type { copy } from "../content";
import {
  AlertIcon,
  CheckIcon,
  ClipIcon,
  CloseIcon,
  NewChatIcon,
  SendIcon,
  SparkIcon,
} from "./icons";

type Common = (typeof copy)["en"];

type NewEntry =
  | { kind: "turn"; turn: ChatTurn }
  | { kind: "error"; error: AssistantError };

type Entry = NewEntry & { id: number };

const INPUT_MAX = 148;

/* The assistant, as a panel rather than a page.

   It sits beside the journey instead of replacing it. Everything it can do,
   the interface can also do without it: it explains, it checks, it points at a
   step. It never writes into the return. When the model is unreachable — no
   key on the deployment, no network, rate limited — the panel says which of
   those happened and the journey carries on untouched.

   The panel is laid out the way a code editor lays out its agent pane: one
   thin bar of furniture at the top, the conversation taking every pixel it
   can, and a single composer at the bottom that holds the writing surface and
   its controls in one frame. The header carries a name and two icons; the
   introduction, which is only useful before the first question, lives in the
   empty state and leaves with it. */
export function Assistant({
  buildSnapshot,
  common,
  language,
  onClose,
  open,
  pendingQuestion,
  questionToken,
  signedIn,
  stepLabel,
  canCheck,
}: {
  buildSnapshot: (attachment: string | null) => string;
  common: Common;
  language: Language;
  onClose: () => void;
  open: boolean;
  /* A question handed over from elsewhere in the interface, so "ask the
     assistant" links arrive with the question already typed. */
  pendingQuestion: string | null;
  questionToken: number;
  signedIn: boolean;
  stepLabel: string | null;
  canCheck: boolean;
}) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [attachment, setAttachment] = useState<string | null>(null);
  const [attachError, setAttachError] = useState<string | null>(null);
  const nextId = useRef(0);
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const abort = useRef<AbortController | null>(null);
  const [handedOver, setHandedOver] = useState(0);

  /* A question handed over from elsewhere in the interface arrives already
     typed, so the citizen can edit it before sending rather than having it
     asked on their behalf. Applied during render, keyed on the token, so the
     same question offered twice still lands. */
  if (open && pendingQuestion && handedOver !== questionToken) {
    setHandedOver(questionToken);
    setDraft(pendingQuestion);
  }

  const push = (entry: NewEntry) =>
    setEntries((current) => [...current, { ...entry, id: nextId.current++ }]);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  useEffect(() => {
    const view = log.current;
    if (view) view.scrollTop = view.scrollHeight;
  }, [entries, busy]);

  /* The composer starts one line tall and grows with the question up to a
     ceiling, rather than reserving space for a paragraph nobody has written
     yet. jsdom reports no layout, so the guard keeps tests honest. */
  useEffect(() => {
    const field = input.current;
    if (!field) return;
    field.style.height = "auto";
    const wanted = field.scrollHeight;
    if (wanted > 0) field.style.height = `${Math.min(wanted, INPUT_MAX)}px`;
  }, [draft, open]);

  const run = useCallback(
    async (question: string, mode: "chat" | "check") => {
      if (busy) return;

      const history: ChatTurn[] = [
        ...entries.flatMap((entry) => (entry.kind === "turn" ? [entry.turn] : [])),
        { role: "user", content: question },
      ];

      push({ kind: "turn", turn: { role: "user", content: question } });
      setBusy(true);

      const controller = new AbortController();
      abort.current = controller;

      const result = await ask({
        messages: history,
        context: buildSnapshot(attachment),
        language,
        mode,
        signal: controller.signal,
      });

      abort.current = null;
      setBusy(false);

      if (result.ok) {
        push({ kind: "turn", turn: { role: "assistant", content: result.reply } });
      } else {
        push({ kind: "error", error: result.error });
      }
    },
    [attachment, buildSnapshot, busy, entries, language],
  );

  const send = (event: FormEvent) => {
    event.preventDefault();
    const question = draft.trim();
    if (question.length === 0) return;
    setDraft("");
    void run(question, "chat");
  };

  const attach = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const problem = validateFile(file);
    if (problem) {
      setAttachError(
        problem === "type"
          ? common.assistantAttachNote
          : `${file.name} — over ${MAX_FILE_MB} MB`,
      );
      return;
    }
    setAttachError(null);
    setAttachment(file.name);
  };

  if (!open) return null;

  const errorText = (error: AssistantError) =>
    error === "key"
      ? common.assistantErrorKey
      : error === "rate"
        ? common.assistantErrorRate
        : error === "network"
          ? common.assistantErrorNetwork
          : common.assistantErrorNetwork;

  const suggestions = signedIn
    ? common.assistantSuggestionsIn
    : common.assistantSuggestionsOut;

  const started = entries.length > 0;

  return (
    <aside aria-label={common.assistantTitle} className="assistant no-print">
      <header className="assistant-head">
        <SparkIcon className="assistant-mark" />
        <p className="assistant-name">{common.assistantName}</p>
        {stepLabel && (
          <p className="assistant-where">
            <span>{common.assistantStepLabel}</span>
            {stepLabel}
          </p>
        )}
        <div className="assistant-head-tools">
          {started && (
            <button
              aria-label={common.assistantClear}
              className="assistant-icon-btn"
              onClick={() => {
                abort.current?.abort();
                abort.current = null;
                setBusy(false);
                setEntries([]);
                input.current?.focus();
              }}
              title={common.assistantClear}
              type="button"
            >
              <NewChatIcon />
            </button>
          )}
          <button
            aria-label={common.assistantClose}
            className="assistant-icon-btn"
            onClick={onClose}
            title={common.assistantClose}
            type="button"
          >
            <CloseIcon />
          </button>
        </div>
      </header>

      <div className="assistant-log" ref={log} role="log" aria-live="polite">
        {!started && (
          <div className="assistant-empty">
            <p className="assistant-intro">
              {signedIn ? common.assistantIntroIn : common.assistantIntroOut}
            </p>
            <ul className="assistant-suggestions">
              {suggestions.map((question) => (
                <li key={question}>
                  <button
                    className="assistant-suggestion"
                    onClick={() => void run(question, "chat")}
                    type="button"
                  >
                    {question}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {entries.map((entry) =>
          entry.kind === "turn" ? (
            <div
              className={
                entry.turn.role === "user" ? "assistant-turn is-you" : "assistant-turn"
              }
              key={entry.id}
            >
              {entry.turn.role === "assistant" && (
                <p className="assistant-who">
                  <SparkIcon />
                  {common.assistantName}
                </p>
              )}
              <div className="assistant-said">
                {entry.turn.content.split("\n").map((line, index) =>
                  line.trim().length === 0 ? null : <p key={index}>{line}</p>,
                )}
              </div>
            </div>
          ) : (
            <div className="assistant-turn is-error" key={entry.id} role="alert">
              <p className="assistant-who is-alert">
                <AlertIcon />
                {common.assistantErrorTitle}
              </p>
              <div className="assistant-said">
                <p>{errorText(entry.error)}</p>
              </div>
            </div>
          ),
        )}

        {busy && (
          <div className="assistant-turn">
            <p className="assistant-who">
              <SparkIcon />
              {common.assistantName}
            </p>
            <p className="assistant-busy">
              <span aria-hidden="true" className="assistant-dots">
                <i />
                <i />
                <i />
              </span>
              {common.assistantThinking}
            </p>
          </div>
        )}
      </div>

      <form className="assistant-compose" onSubmit={send}>
        {(attachment || attachError) && (
          <p className={attachError ? "assistant-note is-alert" : "assistant-note"}>
            {attachError ?? common.assistantAttachNote}
          </p>
        )}

        <div className="assistant-field">
          <label className="sr-only" htmlFor="assistant-input">
            {common.assistantPlaceholder}
          </label>
          <textarea
            id="assistant-input"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send(event as unknown as FormEvent);
              }
            }}
            placeholder={common.assistantPlaceholder}
            ref={input}
            rows={1}
            value={draft}
          />

          <div className="assistant-actions">
            <label className="assistant-chip">
              <ClipIcon />
              <span>
                {attachment
                  ? common.assistantAttached(attachment)
                  : common.assistantAttach}
              </span>
              <input accept="application/pdf,image/*" onChange={attach} type="file" />
            </label>

            {canCheck && (
              <button
                className="assistant-chip"
                disabled={busy}
                onClick={() =>
                  void run(
                    language === "hi"
                      ? "मैं जिस चरण पर हूँ उसे जाँचिए और बताइए कि कुछ छूटा या ग़लत तो नहीं है।"
                      : "Check the step I am on. Tell me whether it is complete and whether anything looks missing or inconsistent.",
                    "check",
                  )
                }
                type="button"
              >
                <CheckIcon />
                <span>
                  {busy ? common.assistantCheckRunning : common.assistantCheckStep}
                </span>
              </button>
            )}

            <button
              aria-label={common.assistantSend}
              className="assistant-send"
              disabled={busy || draft.trim().length === 0}
              title={common.assistantSend}
              type="submit"
            >
              <SendIcon />
            </button>
          </div>
        </div>

        <p className="assistant-disclosure">{common.assistantDisclosure}</p>
      </form>
    </aside>
  );
}
