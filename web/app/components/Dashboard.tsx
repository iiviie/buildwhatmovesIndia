"use client";

import { greetingFor, maskUserId, type Session } from "../auth";
import { demoCase, type DraftState, type Language } from "../case-data";
import type { copy } from "../content";
import { services, type ServiceId } from "../services";
import { ArrowIcon, CheckIcon, LockIcon } from "./icons";

type Common = (typeof copy)["en"];

/* What you land on after signing in.

   The official portal's dashboard is a grid of everything the department can
   do. This one answers one question first — what is still owed from you, and
   how far in are you — and puts the rest of the map underneath it. */
export function Dashboard({
  common,
  draft,
  language,
  now,
  onResume,
  onService,
  session,
  totalSteps,
}: {
  common: Common;
  draft: DraftState;
  language: Language;
  now: Date;
  onResume: () => void;
  onService: (id: ServiceId) => void;
  session: Session;
  totalSteps: number;
}) {
  const submitted = draft.status === "submitted" || draft.reference != null;
  const verified = Boolean(draft.verifiedAt);
  const started = draft.step > 0 && !submitted;
  const done = Math.max(0, Math.min(draft.step - 1, totalSteps));

  const statusLine = verified
    ? common.dashReturnFiled
    : submitted
      ? common.dashReturnNeedsVerification
    : started
      ? common.dashReturnInProgress(done, totalSteps)
      : common.dashReturnNotStarted;

  const action = verified
    ? common.dashViewReceipt
    : submitted
      ? common.dashVerifyReturn
    : started
      ? common.dashResume
      : common.dashStart;

  return (
    <>
      <div className="page-head">
        <p className="label">
          {common.signedInAs} {maskUserId(session.userId, session.kind)} ·{" "}
          {common.demoAccountNote}
        </p>
        {/* The greeting and the name are two lines, not one. Set as a single
            line at display size, "Good evening, Ananya Rao" ran the width of
            the column and made the salutation as loud as the person. */}
        <h1 tabIndex={-1}>
          <span className="dash-greeting">
            {greetingFor(language, now.getHours())},
          </span>
          {" "}
          <span className="dash-name">{session.name}</span>
        </h1>
        <p className="lede">{common.dashIntro}</p>
      </div>

      <section className="section">
        <h2>{common.dashPendingTitle}</h2>

        <div className="task">
          <div className="task-body">
            <h3>{common.dashReturnTitle(demoCase.assessmentYear)}</h3>
            <p className="task-status">
              {verified ? <CheckIcon /> : null}
              {statusLine}
            </p>
            <p className="task-note">{demoCase.form}</p>
          </div>
          <button className="btn" onClick={onResume} type="button">
            {action}
            <ArrowIcon />
          </button>
        </div>
      </section>

      <section className="section">
        <h2>{common.dashServicesTitle}</h2>
        <ul className="servicelist">
          {services
            .filter((service) => service.id !== "file-return")
            .slice(0, 7)
            .map((service) => (
              <li key={service.id}>
                {service.state === "live" ? (
                  <button
                    className="servicerow"
                    onClick={() => onService(service.id)}
                    type="button"
                  >
                    <span className="servicerow-name">
                      {common.serviceNames[service.id]}
                    </span>
                    <span className="servicerow-note">
                      {common.serviceNotes[service.id]}
                    </span>
                  </button>
                ) : (
                  <span className="servicerow is-off">
                    <span className="servicerow-name">
                      {common.serviceNames[service.id]}
                      <LockIcon />
                    </span>
                    <span className="servicerow-note">
                      {common.serviceNotes[service.id]}
                    </span>
                    <span className="servicerow-flag">{common.navPlanned}</span>
                  </span>
                )}
              </li>
            ))}
        </ul>
      </section>

      <section className="section">
        <h2>{common.dashHistoryTitle}</h2>
        <p className="prose">{common.dashHistoryNote}</p>
      </section>
    </>
  );
}
