"use client";

import { type FormEvent, useState } from "react";
import {
  DEMO_OTP,
  DEMO_USER_ID,
  isKnownDemoUser,
  normaliseUserId,
  readUserIdKind,
  type Session,
  type UserIdKind,
} from "../auth";
import { demoCase } from "../case-data";
import type { copy } from "../content";
import { CheckIcon } from "./icons";
import "../styles/login.css";

type Common = (typeof copy)["en"];

/* Sign-in, in two moves: say who you are, then confirm it is you.

   The repair here is small and specific. The official field is labelled
   "PAN/ AADHAAR/ OTHER USER ID" and then leaves the citizen to work out which
   of the three they hold — the help panel beside it lists departmental roles
   they may never have heard of. A PAN and an Aadhaar have unmistakable shapes,
   so the field reads the shape and tells them what it recognised, and the help
   is written as "which one am I" rather than "know about your user ID". */
export function LoginScreen({
  common,
  onDone,
  onRegister,
  onAskAssistant,
}: {
  common: Common;
  onDone: (session: Session) => void;
  onRegister: () => void;
  onAskAssistant: (question: string) => void;
}) {
  const [stage, setStage] = useState<"id" | "otp">("id");
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const kind: UserIdKind = readUserIdKind(userId);

  const readback =
    userId.trim().length === 0
      ? null
      : kind === "pan"
        ? common.loginReadPan
        : kind === "aadhaar"
          ? common.loginReadAadhaar
          : kind === "other"
            ? common.loginReadOther
            : common.loginReadUnknown;

  const submitId = (event: FormEvent) => {
    event.preventDefault();
    setNotice(null);
    if (normaliseUserId(userId).length === 0) {
      setError(common.loginErrorEmpty);
      return;
    }
    if (!isKnownDemoUser(userId)) {
      setError(common.loginErrorUnknown);
      return;
    }
    setError(null);
    setStage("otp");
  };

  const submitOtp = (event: FormEvent) => {
    event.preventDefault();
    if (otp.trim().length === 0) {
      setError(common.loginOtpErrorEmpty);
      return;
    }
    if (otp.trim() !== DEMO_OTP) {
      setError(common.loginOtpErrorWrong);
      return;
    }
    setError(null);
    onDone({
      userId: normaliseUserId(userId),
      kind,
      name: demoCase.taxpayer,
      signedInAt: new Date().toISOString(),
    });
  };

  const straightIn = () => {
    onDone({
      userId: DEMO_USER_ID,
      kind: "pan",
      name: demoCase.taxpayer,
      signedInAt: new Date().toISOString(),
    });
  };

  return (
    <div className="auth guided-auth">
      <div className="auth-main">
        <div className="page-head">
          <h1 tabIndex={-1}>{common.loginTitle}</h1>
          <p className="lede">
            {stage === "id" ? common.loginIntro : common.loginOtpTitle}
          </p>
        </div>

        {stage === "id" && (
          <section className="guided-start-card login-shortcut-card">
            <div>
              <p className="label">{common.demoAccountNote}</p>
              <h2>{common.loginShortcut}</h2>
              <p className="consequence">{common.loginShortcutNote}</p>
            </div>
            <button className="btn btn-lg" onClick={straightIn} type="button">
              {common.loginShortcut}
            </button>
          </section>
        )}

        {error && (
          <div className="alert" role="alert">
            <strong>{error}</strong>
          </div>
        )}

        {stage === "id" ? (
          <form className="auth-form" onSubmit={submitId}>
            <p className="label">{common.loginIdLabel}</p>
            <label className="field">
              <span>{common.loginIdLabel}</span>
              <input
                autoCapitalize="characters"
                autoComplete="username"
                inputMode="text"
                name="userId"
                onChange={(event) => setUserId(event.target.value)}
                placeholder={common.loginIdPlaceholder}
                spellCheck={false}
                type="text"
                value={userId}
              />
            </label>

            {/* Said back immediately, so nobody has to guess whether the thing
                they typed was the thing the field wanted. */}
            <p
              aria-live="polite"
              className={
                kind === "unknown" && userId.trim().length > 0
                  ? "readback is-unsure"
                  : "readback"
              }
            >
              {readback && kind !== "unknown" && <CheckIcon />}
              {readback}
            </p>

            <div className="actions login-actions">
              <button className="btn" type="submit">
                {common.continue}
              </button>
            </div>

            <p className="auth-alt">
              {common.noAccount}{" "}
              <button className="link-btn" onClick={onRegister} type="button">
                {common.register}
              </button>
            </p>

          </form>
        ) : (
          <form className="auth-form" onSubmit={submitOtp}>
            <p className="prose">{common.loginOtpIntro("4417")}</p>

            <p className="big-ref">
              <span className="label">{common.loginOtpDemoLabel}</span>
              {DEMO_OTP}
            </p>

            <label className="field">
              <span>{common.loginOtpLabel}</span>
              <input
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
                name="otp"
                onChange={(event) => setOtp(event.target.value)}
                type="text"
                value={otp}
              />
            </label>

            {notice && (
              <p aria-live="polite" className="readback">
                <CheckIcon />
                {notice}
              </p>
            )}

            <div className="actions">
              <button className="btn" type="submit">
                {common.loginVerify}
              </button>
              <button
                className="link-btn"
                onClick={() => setNotice(common.loginResent)}
                type="button"
              >
                {common.loginResend}
              </button>
              <button
                className="link-btn"
                onClick={() => {
                  setStage("id");
                  setError(null);
                  setNotice(null);
                }}
                type="button"
              >
                {common.back}
              </button>
            </div>
          </form>
        )}
      </div>

      <details className="guided-details auth-aside">
        <summary>{common.loginWhichTitle}</summary>
        <div className="guided-details-body">
          <p className="prose">{common.loginWhichIntro}</p>
          <ul className="rules-list">
            <li><CheckIcon />{common.loginWhichPan}</li>
            <li><CheckIcon />{common.loginWhichAadhaar}</li>
            <li><CheckIcon />{common.loginWhichOther}</li>
          </ul>
          <button className="link-btn" onClick={() => onAskAssistant(common.loginWhichTitle)} type="button">{common.registerNotSureAction}</button>
        </div>
      </details>
    </div>
  );
}
