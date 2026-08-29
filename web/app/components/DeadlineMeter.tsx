import type { FilingWindow, Language } from "../case-data";
import { formatDate, formatRupees } from "../case-data";
import type { copy } from "../content";
import { AlertIcon, ClockIcon } from "./icons";

type Common = (typeof copy)["en"];

/* Three genuinely different situations, and the interface has to say which one
   the citizen is in. Missing a due date is the failure this most needs to stop
   being a surprise, so the passed state is louder than the on-time state
   rather than quieter. */

export function DeadlineMargin({
  common,
  language,
  window: filing,
}: {
  common: Common;
  language: Language;
  window: FilingWindow;
}) {
  const onTime = filing.state === "on-time";

  if (filing.state === "closed") {
    return (
      <section className="margin-block deadline-block is-closed">
        <p className="label label-alert">
          <AlertIcon />
          {common.deadlineClosedLabel}
        </p>
        <p className="deadline-note">
          {common.deadlineClosed(formatDate(filing.belated, language))}
        </p>
      </section>
    );
  }

  return (
    <section
      className={
        onTime ? "margin-block deadline-block" : "margin-block deadline-block is-late"
      }
    >
      <p className={onTime ? "label" : "label label-alert"}>
        {onTime ? <ClockIcon /> : <AlertIcon />}
        {onTime ? common.deadlineLabel : common.deadlinePassedLabel}
      </p>

      {!onTime && (
        <p className="deadline-passed">
          {common.deadlinePassed(formatDate(filing.due, language))}
        </p>
      )}

      <p>
        <span className="deadline-num">{filing.daysLeft}</span>
        <span className="deadline-unit">
          {onTime
            ? filing.daysLeft === 1
              ? common.dayLeftOnTime
              : common.daysLeftOnTime
            : filing.daysLeft === 1
              ? common.dayLeftBelated
              : common.daysLeftBelated}
        </span>
      </p>

      <p className="deadline-dates">
        {onTime
          ? common.deadlineDue(formatDate(filing.due, language))
          : common.deadlineBelatedBy(formatDate(filing.belated, language))}
      </p>

      {!onTime && (
        <p className="deadline-cost">
          {common.deadlineFee(formatRupees(filing.lateFee, language))}
        </p>
      )}
    </section>
  );
}

export function DeadlineInline({
  common,
  window: filing,
}: {
  common: Common;
  window: FilingWindow;
}) {
  if (filing.state === "closed") {
    return (
      <span className="deadline-inline is-late">{common.deadlineClosedLabel}</span>
    );
  }

  const onTime = filing.state === "on-time";
  return (
    <span className={onTime ? "deadline-inline" : "deadline-inline is-late"}>
      {!onTime && <AlertIcon />}
      {filing.daysLeft}{" "}
      {onTime
        ? filing.daysLeft === 1
          ? common.dayLeftOnTime
          : common.daysLeftOnTime
        : filing.daysLeft === 1
          ? common.dayLeftBelated
          : common.daysLeftBelated}
    </span>
  );
}
