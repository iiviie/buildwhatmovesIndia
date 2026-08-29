"use client";

import { type FormEvent, useState } from "react";
import {
  DEMO_OTP,
  emptyRegistration,
  IDENTITY_ROUTES,
  REGISTER_STAGES,
  routeById,
  type RegisterState,
  type RouteId,
  type Session,
} from "../auth";
import type { copy } from "../content";
import { AlertIcon, CheckIcon } from "./icons";

type Common = (typeof copy)["en"];

const PAN_SHAPE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

/* Registration, in the portal's own four stages.

   The change is at stage one. The official screen asks you to choose between
   "Taxpayer" and "Others", and choosing "Others" opens a dropdown of
   departmental job titles — External Agency, TIN 2.0 Stakeholders, e-return
   Intermediary — with nothing to tell you which one you are. You have to
   already know the answer before you are allowed to ask the question.

   Here the question is about what you do, in your own words, and the official
   category is shown as the *answer*. Nobody who arrived knowing the jargon
   loses anything: the official name is printed on every line. */
export function RegisterScreen({
  common,
  onDone,
  onSignIn,
  onAskAssistant,
}: {
  common: Common;
  onDone: (session: Session) => void;
  onSignIn: () => void;
  onAskAssistant: (question: string) => void;
}) {
  const [state, setState] = useState<RegisterState>(emptyRegistration);
  const [error, setError] = useState<string | null>(null);

  const set = (patch: Partial<RegisterState>) =>
    setState((current) => ({ ...current, ...patch }));

  const chosen = state.route ? routeById(state.route) : null;

  const goBack = () => {
    setError(null);
    set({ stage: Math.max(1, state.stage - 1) });
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();

    if (state.stage === 1) {
      if (!state.route) {
        setError(common.registerRouteError);
        return;
      }
      if (!routeById(state.route).supported) return;
      setError(null);
      set({ stage: 2 });
      return;
    }

    if (state.stage === 2) {
      if (!PAN_SHAPE.test(state.pan.replace(/\s/g, "").toUpperCase())) {
        setError(common.registerPanError);
        return;
      }
      if (state.name.trim().length < 2) {
        setError(common.registerNameError);
        return;
      }
      if (state.dateOfBirth.trim().length === 0) {
        setError(common.registerDobError);
        return;
      }
      if (!/^\d{10}$/.test(state.mobile.replace(/\s/g, ""))) {
        setError(common.registerMobileError);
        return;
      }
      if (!state.email.includes("@")) {
        setError(common.registerEmailError);
        return;
      }
      setError(null);
      set({ stage: 3 });
      return;
    }

    if (state.stage === 3) {
      if (state.otp.trim() !== DEMO_OTP) {
        setError(common.loginOtpErrorWrong);
        return;
      }
      setError(null);
      set({ stage: 4 });
      return;
    }

    if (!/^(?=.*\d).{8,}$/.test(state.password)) {
      setError(common.registerPasswordError);
      return;
    }
    setError(null);
    set({ done: true });
  };

  if (state.done) {
    return (
      <div className="auth-done">
        <div className="page-head">
          <p className="label">{common.demoAccountNote}</p>
          <h1 tabIndex={-1}>{common.registerDoneTitle}</h1>
          <p className="lede">{common.registerDoneIntro}</p>
        </div>
        <dl className="rows">
          <div>
            <dt>{common.registerName}</dt>
            <dd>{state.name}</dd>
          </div>
          <div>
            <dt>{common.registerPan}</dt>
            <dd>{state.pan.toUpperCase()}</dd>
          </div>
          <div>
            <dt>{common.registerOfficialLabel}</dt>
            <dd>{chosen?.official}</dd>
          </div>
        </dl>
        <div className="actions">
          <button
            className="btn btn-lg"
            onClick={() =>
              onDone({
                userId: state.pan.toUpperCase(),
                kind: "pan",
                name: state.name.trim(),
                signedInAt: new Date().toISOString(),
              })
            }
            type="button"
          >
            {common.registerDoneAction}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-single">
      <div className="page-head">
        <p className="label">{common.demoAccountNote}</p>
        <h1 tabIndex={-1}>{common.registerTitle}</h1>
        <p className="lede">{common.registerIntro}</p>
      </div>

      {/* The portal's own four numbered stages, kept so the flow is recognisable
          to anyone who has seen the real one. */}
      <ol className="stages" aria-label={common.registerStageOf(state.stage, REGISTER_STAGES)}>
        {common.registerStages.map((label, index) => {
          const number = index + 1;
          const done = number < state.stage;
          const current = number === state.stage;
          return (
            <li
              aria-current={current ? "step" : undefined}
              className={done ? "is-done" : current ? "is-current" : "is-ahead"}
              key={label}
            >
              <span aria-hidden="true" className="stage-mark">
                {done ? <CheckIcon /> : number}
              </span>
              <span className="stage-label">{label}</span>
            </li>
          );
        })}
      </ol>

      {error && (
        <div className="alert" role="alert">
          <strong>{error}</strong>
        </div>
      )}

      <form className="auth-form" onSubmit={submit}>
        {state.stage === 1 && (
          <>
            <h2>{common.registerWhoTitle}</h2>
            <p className="prose">{common.registerWhoIntro}</p>

            <div className="choices" role="radiogroup" aria-label={common.registerWhoTitle}>
              {IDENTITY_ROUTES.map((route) => (
                <label className="choice" key={route.id}>
                  <input
                    aria-label={`${common.routeNames[route.id]}. ${common.registerOfficialLabel}: ${route.official}`}
                    checked={state.route === route.id}
                    name="route"
                    onChange={() => {
                      setError(null);
                      set({ route: route.id as RouteId });
                    }}
                    type="radio"
                    value={route.id}
                  />
                  <span>
                    <span className="choice-title">{common.routeNames[route.id]}</span>
                    <span className="choice-help">
                      {common.registerNeedsLabel}: {common.routeNeeds[route.id]}
                    </span>
                    <span className="choice-portal">
                      {common.registerOfficialLabel}: {route.official}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            {chosen && !chosen.supported && (
              <div className="alert" role="status">
                <strong>{chosen.official}</strong>
                <span className="alert-code">{common.registerUnsupported}</span>
              </div>
            )}

            <p className="auth-alt">
              {common.registerNotSure}{" "}
              <button
                className="link-btn"
                onClick={() => onAskAssistant(common.registerWhoTitle)}
                type="button"
              >
                {common.registerNotSureAction}
              </button>
            </p>

            <div className="actions">
              <button className="btn" disabled={chosen != null && !chosen.supported} type="submit">
                {common.continue}
              </button>
            </div>
          </>
        )}

        {state.stage === 2 && (
          <>
            <h2>{common.registerStages[1]}</h2>
            <p className="prose">
              {common.registerOfficialLabel}: <strong>{chosen?.official}</strong>
            </p>

            <label className="field">
              <span>{common.registerPan}</span>
              <input
                autoCapitalize="characters"
                maxLength={10}
                name="pan"
                onChange={(event) => set({ pan: event.target.value })}
                spellCheck={false}
                type="text"
                value={state.pan}
              />
            </label>
            <p className="field-hint">{common.registerPanHint}</p>

            <label className="field">
              <span>{common.registerName}</span>
              <input
                autoComplete="name"
                name="name"
                onChange={(event) => set({ name: event.target.value })}
                type="text"
                value={state.name}
              />
            </label>

            <label className="field">
              <span>{common.registerDob}</span>
              <input
                autoComplete="bday"
                name="dob"
                onChange={(event) => set({ dateOfBirth: event.target.value })}
                type="date"
                value={state.dateOfBirth}
              />
            </label>
            <p className="field-hint">{common.registerDobHint}</p>

            <label className="field">
              <span>{common.registerMobile}</span>
              <input
                autoComplete="tel-national"
                inputMode="numeric"
                maxLength={10}
                name="mobile"
                onChange={(event) => set({ mobile: event.target.value })}
                type="text"
                value={state.mobile}
              />
            </label>
            <p className="field-hint">{common.registerMobileHint}</p>

            <label className="field">
              <span>{common.registerEmail}</span>
              <input
                autoComplete="email"
                name="email"
                onChange={(event) => set({ email: event.target.value })}
                type="email"
                value={state.email}
              />
            </label>

            <div className="actions">
              <button className="btn" type="submit">
                {common.continue}
              </button>
              <button className="link-btn" onClick={goBack} type="button">
                {common.back}
              </button>
            </div>
          </>
        )}

        {state.stage === 3 && (
          <>
            <h2>{common.registerVerifyTitle}</h2>
            <p className="prose">{common.registerVerifyIntro}</p>

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
                onChange={(event) => set({ otp: event.target.value })}
                type="text"
                value={state.otp}
              />
            </label>

            <div className="actions">
              <button className="btn" type="submit">
                {common.continue}
              </button>
              <button className="link-btn" onClick={goBack} type="button">
                {common.back}
              </button>
            </div>
          </>
        )}

        {state.stage === 4 && (
          <>
            <h2>{common.registerSecureTitle}</h2>
            <p className="prose">{common.registerSecureIntro}</p>

            {/* The rule is stated before the control, not after a rejection. */}
            <p className="rules-note">
              <AlertIcon />
              {common.registerPasswordRules}
            </p>

            <label className="field">
              <span>{common.registerPassword}</span>
              <input
                autoComplete="new-password"
                name="password"
                onChange={(event) => set({ password: event.target.value })}
                type="password"
                value={state.password}
              />
            </label>

            <div className="actions">
              <button className="btn btn-lg" type="submit">
                {common.registerFinish}
              </button>
              <button className="link-btn" onClick={goBack} type="button">
                {common.back}
              </button>
            </div>
          </>
        )}
      </form>

      <p className="auth-alt">
        {common.registerHaveAccount}{" "}
        <button className="link-btn" onClick={onSignIn} type="button">
          {common.signIn}
        </button>
      </p>
    </div>
  );
}
