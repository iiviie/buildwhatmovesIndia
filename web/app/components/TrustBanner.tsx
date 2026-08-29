"use client";

import { useId, useState } from "react";
import { ChevronIcon, ShieldIcon } from "./icons";
import { OFFICIAL_PORTAL } from "../case-data";
import type { copy } from "../content";

type Common = (typeof copy)["en"];

/* A standing authenticity disclosure, in the shape citizens now meet on
   vote.gov and other public services. Ours runs the other way: the point is
   that this is NOT the government service, and that a citizen should be able
   to tell the real one from a fake without trusting us. */
export function TrustBanner({ common }: { common: Common }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="trust no-print">
      <div className="shell trust-bar">
        <span aria-hidden="true" className="trust-mark">
          <ShieldIcon />
        </span>
        <p className="label trust-line">
          {common.prototype}
          <span aria-hidden="true" className="trust-sep">
            /
          </span>
          {common.synthetic}
          <span aria-hidden="true" className="trust-sep">
            /
          </span>
          {common.notOfficial}
        </p>
        <button
          aria-controls={id}
          aria-expanded={open}
          className="trust-toggle"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {/* On a phone the wording is clipped to the accessible name and only
              the chevron is drawn; three legal phrases and a sentence of link
              text will not share a row 320 pixels wide. */}
          <span className="trust-toggle-text">
            {open ? common.trustHide : common.trustToggle}
          </span>
          <span className={open ? "trust-chevron is-open" : "trust-chevron"}>
            <ChevronIcon />
          </span>
        </button>
      </div>

      {open && (
        <div className="trust-panel" id={id}>
          <div className="shell trust-grid">
            <section>
              <h2 className="label label-alert">{common.trustNotGovTitle}</h2>
              <p>{common.trustNotGov}</p>
            </section>
            <section>
              <h2 className="label">{common.trustRealTitle}</h2>
              <p>{common.trustReal}</p>
              <p>
                <a href={OFFICIAL_PORTAL} rel="noreferrer" target="_blank">
                  incometax.gov.in
                  <span className="sr-only">{common.newWindow}</span>
                </a>
              </p>
            </section>
            <section>
              <h2 className="label">{common.trustNeverTitle}</h2>
              <p>{common.trustNever}</p>
              <p className="trust-source">{common.trustSource}</p>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
