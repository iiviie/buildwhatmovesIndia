"use client";

import { useId } from "react";
import { formatRupees, type Language } from "../case-data";
import {
  deductions,
  taxPaidSchedules,
  type DeductionRow,
  type TaxPaidSchedule,
} from "../tax-paid";
import { markUp, Prose } from "./Prose";

/** Short structural wording. Everything a citizen reads about their own case
    comes from `tax-paid.ts`; only the scaffolding is passed in here. */
export type TaxPaidLabels = {
  /* ---------- Block 1: total deductions ---------- */

  /** Heading over the deductions ledger. */
  deductionsTitle: string;
  /** A sentence or two under that heading. May carry `[[term]]` markers. */
  deductionsIntro: string;

  /** Table caption naming the regime these figures are read under. */
  regimeNew: string;
  regimeOld: string;
  /** Caption when no regime has been chosen yet. */
  regimeUnchosen: string;

  /* Column headings. Keep them short: on a narrow screen the table stacks and
     each heading is repeated against its own value. */
  headSection: string;
  headWhat: string;
  headStatus: string;
  headAmount: string;

  /** Status words. Each says, in a word, what the figure beside it means.
      Never carried by colour alone. */
  statusClaimed: string;
  /** Allowed, but there is none of it to claim. */
  statusNone: string;
  /** Allowed under the old regime only, and the new regime is in force. */
  statusNotInRegime: string;
  /** Allowed under one regime and not the other, with neither chosen yet. */
  statusAwaitingRegime: string;
  /** Stands in for a figure that cannot be known until a regime is chosen. */
  amountAwaitingRegime: string;

  /** Row label on the deductions total. */
  deductionsTotal: string;
  /** Lead-in on the sentence saying why a row stands where it does. */
  whyLabel: string;

  /* ---------- Block 2: the tax paid schedules ---------- */

  /** Heading over the five schedules. */
  schedulesTitle: string;
  /** A sentence or two under that heading. May carry `[[term]]` markers. */
  schedulesIntro: string;
  /** Standing line above them, e.g. "5 schedules, 3 of them empty". */
  schedulesSummary: (total: number, empty: number) => string;

  /** How many entries a schedule holds, e.g. "2 entries". */
  entriesCount: (count: number) => string;
  /** Word marking a schedule with no entries at all. */
  entriesNone: string;

  /** Row label on the total of every schedule above. */
  taxPaidTotal: string;

  /* ---------- Shared ---------- */

  /** Summary on the disclosure holding the portal's own wording. */
  officialSummary: string;
  /** Lead-in before the bracketed source line inside that disclosure. */
  sourceLabel: string;
};

type Regime = "new" | "old" | null;

/** Why a deduction row stands where it does — the distinction the new regime
    makes hard to see: a line the regime closes and a line you simply have
    nothing for both print as ₹0. */
type RowStatus = "claimed" | "none" | "not-in-regime" | "awaiting-regime";

const statusOf = (row: DeductionRow, regime: Regime): RowStatus => {
  if (!row.allowedUnderNewRegime) {
    if (regime === null) return "awaiting-regime";
    if (regime === "new") return "not-in-regime";
  }
  return row.amount > 0 ? "claimed" : "none";
};

/* Amounts in the schedules arrive already set in Indian digit grouping, so the
   total is read back out of the same strings the citizen is looking at rather
   than from a second figure that could drift away from them. */
const figureOf = (text: string) => {
  const digits = text.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
};

/* A column is a money column when every cell in it is one. The schedules are
   not uniform — column 3 is a rupee figure in the TDS schedules and a challan
   serial number in the advance tax one — so it is read off the rows. */
const moneyColumns = (schedule: TaxPaidSchedule): boolean[] =>
  schedule.columns.map(
    (_column, index) =>
      schedule.rows.length > 0 &&
      schedule.rows.every((row) => row[index]?.startsWith("₹")),
  );

/* The portal prints C1, the total, as the last row of the deductions block.
   Its figure is shown as the sum of the rows above rather than as the stored
   number, so the arithmetic on screen is arithmetic the citizen can check. */
/* Why the explicit table roles below.

   Both ledgers stack below the width four columns need, and stacking is done
   with `display: block`. That is the ordinary responsive-table technique and
   it has one well-known cost: changing a table's display box removes its
   implicit roles from the accessibility tree, so a screen reader stops
   announcing rows and column headers. The documented mitigation is to put the
   roles back explicitly, which is what these are.

   `jsx-a11y/no-redundant-roles` objects, because on an unstyled `<table>` the
   role *is* redundant. It is not redundant here, and the rule cannot see the
   stylesheet. The disable is scoped to that one rule.

   The `data-label` text is a visual affordance, not the accessibility story —
   generated content is announced inconsistently and is not something to rely
   on for the column association. */
/* eslint-disable jsx-a11y/no-redundant-roles, jsx-a11y/no-interactive-element-to-noninteractive-role */

export function TaxPaidSection({
  language,
  regime,
  labels,
}: {
  language: Language;
  regime: Regime;
  labels: TaxPaidLabels;
}) {
  const uid = useId();
  const rows = deductions[language];
  const schedules = taxPaidSchedules[language];

  const totalRow = rows[rows.length - 1];
  const claimRows = rows.slice(0, -1);
  const statuses = claimRows.map((row) => statusOf(row, regime));

  const awaitingRegime = statuses.includes("awaiting-regime");
  const deductionsSum = claimRows.reduce(
    (sum, row, index) =>
      statuses[index] === "not-in-regime" ? sum : sum + row.amount,
    0,
  );

  const paidSum = schedules.reduce(
    (sum, schedule) =>
      sum +
      schedule.rows.reduce(
        (rowSum, row) => rowSum + figureOf(row[row.length - 1] ?? ""),
        0,
      ),
    0,
  );

  const emptyCount = schedules.filter(
    (schedule) => schedule.rows.length === 0,
  ).length;

  const statusWord: Record<RowStatus, string> = {
    claimed: labels.statusClaimed,
    none: labels.statusNone,
    "not-in-regime": labels.statusNotInRegime,
    "awaiting-regime": labels.statusAwaitingRegime,
  };

  const caption =
    regime === "new"
      ? labels.regimeNew
      : regime === "old"
        ? labels.regimeOld
        : labels.regimeUnchosen;

  const official = (heading: string, source?: string) => (
    <details className="tp-official">
      <summary>{labels.officialSummary}</summary>
      <p className="tp-official-text">{markUp(heading)}</p>
      {source && (
        <p className="tp-official-text">
          <span className="label">{labels.sourceLabel}</span>
          {markUp(source)}
        </p>
      )}
    </details>
  );

  return (
    <div className="tp">
      <section className="tp-block">
        <h3 className="tp-title" id={`${uid}-ded`}>
          {labels.deductionsTitle}
        </h3>
        <Prose className="tp-lede">{labels.deductionsIntro}</Prose>

        {/* Both ledgers stack below the width four columns need. The markup
            stays a real table, and each value carries its own column heading
            in `data-label`, so nothing becomes an unnamed figure. */}
        <table
          aria-labelledby={`${uid}-ded`}
          className="tp-table tp-table-ded"
          role="table"
        >
          <caption className="tp-caption">{caption}</caption>
          <thead role="rowgroup">
            <tr role="row">
              <th className="tp-col-section" role="columnheader" scope="col">
                {labels.headSection}
              </th>
              <th className="tp-col-what" role="columnheader" scope="col">
                {labels.headWhat}
              </th>
              <th className="tp-col-status" role="columnheader" scope="col">
                {labels.headStatus}
              </th>
              <th className="tp-col-amount tp-num" role="columnheader" scope="col">
                {labels.headAmount}
              </th>
            </tr>
          </thead>

          <tbody role="rowgroup">
            {claimRows.map((row, index) => {
              const status = statuses[index];
              return (
                <tr role="row" key={row.section}>
                  <th
                    role="rowheader"
                    className="tp-col-section tp-cell-line"
                    data-label={labels.headSection}
                    scope="row"
                  >
                    <span>{row.section}</span>
                  </th>

                  <td
                    role="cell"
                    className="tp-col-what tp-cell-block"
                    data-label={labels.headWhat}
                  >
                    <span className="tp-plain">{markUp(row.plain)}</span>
                    <span className="tp-why">
                      <span className="label">{labels.whyLabel}</span>
                      {markUp(row.note)}
                    </span>
                    {official(row.official)}
                  </td>

                  <td
                    role="cell"
                    className="tp-col-status tp-cell-line"
                    data-label={labels.headStatus}
                  >
                    <span
                      className={
                        status === "claimed"
                          ? "tp-status is-claimed"
                          : "tp-status"
                      }
                    >
                      {statusWord[status]}
                    </span>
                  </td>

                  <td
                    role="cell"
                    className="tp-col-amount tp-cell-line tp-num"
                    data-label={labels.headAmount}
                  >
                    <span>
                      {status === "awaiting-regime"
                        ? labels.amountAwaitingRegime
                        : formatRupees(
                            status === "not-in-regime" ? 0 : row.amount,
                            language,
                          )}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>

          <tfoot role="rowgroup">
            <tr role="row">
              <th className="tp-total-head" colSpan={3} scope="row">
                <span className="tp-total-section">{totalRow.section}</span>
                <span className="tp-total-name">{labels.deductionsTotal}</span>
              </th>
              <td
                role="cell"
                className="tp-col-amount tp-cell-line tp-num tp-total-figure"
                data-label={labels.headAmount}
              >
                <span>
                  {awaitingRegime
                    ? labels.amountAwaitingRegime
                    : formatRupees(deductionsSum, language)}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="tp-total-note">
          <Prose className="tp-plain">{totalRow.plain}</Prose>
          <p className="tp-why">
            <span className="label">{labels.whyLabel}</span>
            {markUp(totalRow.note)}
          </p>
          {official(totalRow.official)}
        </div>
      </section>

      <section className="tp-block">
        <h3 className="tp-title">{labels.schedulesTitle}</h3>
        <Prose className="tp-lede">{labels.schedulesIntro}</Prose>
        <p className="label tp-count">
          {labels.schedulesSummary(schedules.length, emptyCount)}
        </p>

        <ul className="tp-schedules">
          {schedules.map((schedule) => {
            const money = moneyColumns(schedule);
            const filled = schedule.rows.length > 0;

            return (
              <li className="tp-schedule" key={schedule.id}>
                {/* The portal's own schedule name is the heading, and our
                    plain sentence is what reads as primary underneath it.
                    Putting the sentence in the heading made TDS2's entry three
                    sentences long, which is useless to anyone navigating by
                    headings — and the official name here is what lets a citizen
                    find the same box on the real portal. */}
                <h4 className="tp-schedule-name" id={`${uid}-${schedule.id}`}>
                  {markUp(schedule.official)}
                </h4>
                <Prose className="tp-schedule-plain">{schedule.plain}</Prose>
                <p className="label tp-schedule-state">
                  {filled
                    ? labels.entriesCount(schedule.rows.length)
                    : labels.entriesNone}
                </p>

                {filled ? (
                  <table
                    aria-labelledby={`${uid}-${schedule.id}`}
                    className="tp-table tp-table-sch"
                    role="table"
                  >
                    <thead role="rowgroup">
                      <tr role="row">
                        {schedule.columns.map((column, index) => (
                          <th
                            className={money[index] ? "tp-num" : undefined}
                            key={column}
                            role="columnheader"
                            scope="col"
                          >
                            {markUp(column)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody role="rowgroup">
                      {schedule.rows.map((row) => (
                        <tr role="row" key={row.join("|")}>
                          {row.map((cell, index) => {
                            const label = schedule.columns[index] ?? "";
                            const className = [
                              "tp-cell-line",
                              money[index] ? "tp-num" : "",
                            ]
                              .filter(Boolean)
                              .join(" ");

                            return index === 0 ? (
                              <th
                                role="rowheader"
                                className={className}
                                data-label={label}
                                key={label}
                                scope="row"
                              >
                                <span>{cell}</span>
                              </th>
                            ) : (
                              <td
                                role="cell"
                                className={className}
                                data-label={label}
                                key={label}
                              >
                                <span>{cell}</span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <Prose className="tp-empty">{schedule.emptyNote}</Prose>
                )}

                {official(schedule.official, schedule.source)}
              </li>
            );
          })}
        </ul>

        <p className="tp-grand">
          <span className="tp-grand-name">{labels.taxPaidTotal}</span>
          <span className="tp-grand-figure">
            {formatRupees(paidSum, language)}
          </span>
        </p>
      </section>
    </div>
  );
}
