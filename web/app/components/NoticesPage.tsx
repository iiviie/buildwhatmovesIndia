"use client";

import { useMemo, useState } from "react";
import { formatLongDate } from "../case-data";
import type { copy } from "../content";
import {
  byMonth,
  matches,
  newestFirst,
  notices,
  type NoticeFilter,
} from "../notices";
import { ArrowIcon } from "./icons";

type Common = (typeof copy)["en"];

/* The archive.

   The home page carries the four newest notices, which answers "what is going
   on this week". This page answers the other question, the one the official
   portal cannot answer at all: what did the notice in July say? So the whole
   run is here, newest first, under a heading for each month — because a month
   is how anybody remembers when they saw something — with a filter for the
   distinction the department itself draws between a notice that changes what
   you do and one that is for information. */
export function NoticesPage({
  common,
  language,
  onBack,
}: {
  common: Common;
  language: "en" | "hi";
  onBack: () => void;
}) {
  const [filter, setFilter] = useState<NoticeFilter>("all");

  const all = notices[language];
  const shown = useMemo(
    () => newestFirst(all).filter((notice) => matches(notice, filter)),
    [all, filter],
  );
  const months = useMemo(() => byMonth(shown, language), [shown, language]);

  const filters: [NoticeFilter, string][] = [
    ["all", common.noticesFilterAll],
    ["affects", common.noticesFilterAffects],
    ["information", common.noticesFilterInformation],
  ];

  return (
    <>
      <div className="page-head">
        {/* No eyebrow: on every other page it names the step or the section,
            and here it could only repeat the heading under it. */}
        <h1 tabIndex={-1}>{common.noticesTitle}</h1>
        <p className="lede">{common.noticesIntro}</p>
      </div>

      <div className="notices-controls no-print">
        <div
          aria-label={common.noticesTitle}
          className="segmented segmented-notices"
          role="group"
        >
          {filters.map(([value, label]) => (
            <button
              aria-pressed={filter === value}
              key={value}
              onClick={() => setFilter(value)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
        {/* Announced, because filtering changes what is on the page and a
            screen reader would otherwise be given no sign that it had. */}
        <p aria-live="polite" className="label notices-count">
          {common.noticesCount(shown.length, all.length)}
        </p>
      </div>

      {months.length === 0 && <p className="prose">{common.noticesEmpty}</p>}

      {months.map((month) => (
        <section className="section notices-month" key={month.key}>
          <h2>{month.label}</h2>
          <ul className="notice-list">
            {month.notices.map((notice) => (
              <li key={notice.id}>
                <p className="notice-meta">
                  <span
                    className={
                      notice.affectsYou ? "pill is-alert" : "pill is-quiet"
                    }
                  >
                    {notice.affectsYou
                      ? common.homeAffectsYou
                      : common.homeGeneral}
                  </span>
                  <span className="notice-date">
                    {formatLongDate(
                      new Date(`${notice.on}T00:00:00+05:30`),
                      language,
                    )}
                  </span>
                </p>
                <p>{notice.title}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="fine notices-note">{common.noticesDemoNote}</p>

      <div className="actions no-print">
        <button className="btn btn-secondary" onClick={onBack} type="button">
          <ArrowIcon />
          {common.noticesBack}
        </button>
      </div>
    </>
  );
}
