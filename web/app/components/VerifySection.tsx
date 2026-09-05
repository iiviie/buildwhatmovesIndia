"use client";

import { useId } from "react";
import type { Language } from "../case-data";
import {
  daysToVerify,
  DEMO_VERIFY_ROUTE,
  verificationCopy,
  verifyDeadline,
  verifyRoutes,
} from "../verification";
import { ChevronIcon } from "./icons";
import { markUp, Prose } from "./Prose";

/* Verification, on the acknowledgement screen.

   This block exists because the screen it sits on used to lie by omission. It
   said the return had been filed, listed an acknowledgement number, and let a
   citizen leave believing they were done — when the department will treat an
   unverified return as never filed at all, thirty days later, without writing
   to say so.

   So the unverified state leads. The heading is the status, not the word
   "Verification": a heading that names a topic can be skimmed past, and a
   heading that says "this return is not verified yet" cannot. The deadline is
   a date and a count of days, because a date alone does not tell you how much
   rope you have. The consequence is stated before the routes, since it is what
   decides whether anyone bothers to read them.

   Only one route is simulated, and it says so. The other six are here to be
   read, in the same shape as the filing sections a step earlier: a citizen who
   cannot use Aadhaar OTP needs to know that net banking exists before they
   need it, not after the window has closed. */
export function VerifySection({
  language,
  filedAt,
  now,
  verifiedAt,
  reference,
  onVerify,
  dateFormat,
}: {
  language: Language;
  /** When the return was filed. Null on a draft that predates the field. */
  filedAt: Date | null;
  /** Today, so the days left are counted and not asserted. */
  now: Date;
  /** When it was verified, already formatted, or null while it has not been. */
  verifiedAt: string | null;
  /** The synthetic verification reference, once there is one. */
  reference: string | null;
  onVerify: () => void;
  /** The app's own date formatter, so this reads like every other date here. */
  dateFormat: (date: Date) => string;
}) {
  const uid = useId();
  const copy = verificationCopy[language];
  const routes = verifyRoutes[language];

  const demoRoute = routes.find((route) => route.id === DEMO_VERIFY_ROUTE);
  const others = routes.filter((route) => route.id !== DEMO_VERIFY_ROUTE);
  const verified = Boolean(verifiedAt);

  const deadline = filedAt ? verifyDeadline(filedAt) : null;
  const left = filedAt ? daysToVerify(filedAt, now) : null;
  const closed = left !== null && left < 0;

  return (
    <section
      aria-labelledby={`${uid}-head`}
      className={verified ? "verify is-done" : "verify is-pending"}
    >
      <p className="label">
        {verified ? copy.doneState : copy.pendingState}
      </p>
      <h2 className="verify-title" id={`${uid}-head`}>
        {verified ? copy.doneState : copy.title}
      </h2>

      {verified ? (
        <>
          <Prose className="prose">{copy.doneNote}</Prose>
          <dl className="rows verify-refs">
            <div>
              <dt>{copy.verifiedAtLabel}</dt>
              <dd>{verifiedAt}</dd>
            </div>
            <div>
              <dt>{copy.referenceLabel}</dt>
              <dd>{reference}</dd>
            </div>
            <div>
              <dt>{copy.routesLabel}</dt>
              <dd>{copy.demoRouteLabel}</dd>
            </div>
          </dl>
        </>
      ) : (
        <>
          {deadline && (
            <p className="verify-deadline">
              <span className="label">{copy.deadlineLabel}</span>
              <span className="verify-date">{dateFormat(deadline)}</span>
              {/* The count is the part that moves. A date on its own reads as
                  far away right up until it is not. */}
              <span className={closed ? "label label-alert" : "label"}>
                {closed ? copy.windowClosed : copy.daysLeft(left ?? 0)}
              </span>
            </p>
          )}

          {demoRoute && (
            <div className="verify-route">
              <p className="label">
                {language === "hi" ? "सबसे आसान तरीका" : "Easiest option"}
              </p>
              <p className="verify-route-name">{demoRoute.official}</p>
            </div>
          )}

          <div className="actions no-print">
            <button className="btn" onClick={onVerify} type="button">
              {copy.action}
            </button>
          </div>
          <p className="verify-note">{copy.actionNote}</p>

          <details className="pers-more verify-more">
            <summary>
              {language === "hi"
                ? "सत्यापन क्यों ज़रूरी है?"
                : "Why do I need to verify?"}
            </summary>
            <Prose className="prose verify-intro">{copy.intro}</Prose>
            <Prose className="verify-consequence">{copy.consequence}</Prose>
            {demoRoute && (
              <p className="verify-needs">
                <span className="label">{copy.needsLabel}</span>
                {markUp(demoRoute.needs)}
              </p>
            )}
          </details>
        </>
      )}

      {/* Kept on the verified screen too. The routes are worth knowing about
          for next year, and this is the one place a citizen has ever been told
          they exist. */}
      <details className="pers-more verify-more">
        <summary>{copy.routesSummary(others.length)}</summary>
        <p className="pers-note">{copy.paperNote}</p>
        <ul className="verify-routes">
          {others.map((route) => (
            <li className="verify-other" key={route.id}>
              <details className="pers-option">
                <summary className="pers-option-toggle">
                  <span className="pers-option-official">{route.official}</span>
                  <ChevronIcon className="pers-chevron" />
                </summary>
                <div className="pers-option-body">
                  <Prose className="pers-option-plain">{route.plain}</Prose>
                  <p className="pers-when">
                    <span className="label">{copy.needsLabel}</span>
                    {markUp(route.needs)}
                  </p>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
