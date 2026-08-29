"use client";

import { crossChecks, documentGuides } from "../documents-guide";
import { markUp, Prose } from "./Prose";

/* Form 16, 26AS, AIS, TIS.

   The portal names them on the way in and defines none of them, so a salaried
   filer meets four acronyms and has to guess which one is being asked for.
   This says what each is, which single one we actually want from them, and —
   the part nothing on the portal says out loud — why there is more than one:
   they are meant to disagree, and the disagreement is the finding.

   Only the one-liners are open. The full description of each document runs to
   a paragraph, and four paragraphs stacked is the wall of text this panel
   exists to replace. */
export function DocumentsPanel({
  crossChecksTitle,
  detailSummary,
  explainedLabel,
  fromLabel,
  ifItDoesNotLabel,
  language,
  neededLabel,
  shouldMatchLabel,
  title,
  usedForLabel,
  whereLabel,
}: {
  /** Heading over the cross-check block. */
  crossChecksTitle: string;
  /** Summary on each document's disclosure, e.g. "What it is, and how to get it". */
  detailSummary: string;
  /** Status word for a document this prototype only explains. */
  explainedLabel: string;
  fromLabel: string;
  ifItDoesNotLabel: string;
  language: "en" | "hi";
  /** Status word for the one document this prototype asks for. */
  neededLabel: string;
  shouldMatchLabel: string;
  /** Heading over the document list. */
  title: string;
  usedForLabel: string;
  whereLabel: string;
}) {
  const guides = documentGuides[language];
  const checks = crossChecks[language];

  return (
    <div className="docs-panel">
      <h3 className="docs-title">{title}</h3>

      <ul className="docs-list">
        {guides.map((doc) => (
          <li className="docs-item" key={doc.id}>
            <div className="docs-head">
              <h4 className="docs-name">{markUp(doc.name)}</h4>
              <p
                className={
                  doc.required ? "label docs-flag is-needed" : "label docs-flag"
                }
              >
                {doc.required ? neededLabel : explainedLabel}
              </p>
            </div>

            <Prose className="docs-line">{doc.oneLine}</Prose>

            <details className="docs-more">
              <summary>{detailSummary}</summary>
              <dl className="docs-detail">
                <div className="docs-row">
                  <dt className="label">{fromLabel}</dt>
                  <dd>
                    <Prose>{doc.from}</Prose>
                  </dd>
                </div>
                <div className="docs-row">
                  <dt className="label">{whereLabel}</dt>
                  <dd>
                    <Prose>{doc.where}</Prose>
                  </dd>
                </div>
                <div className="docs-row">
                  <dt className="label">{usedForLabel}</dt>
                  <dd>
                    <ul className="docs-uses">
                      {doc.usedFor.map((use) => (
                        <Prose as="li" key={use}>
                          {use}
                        </Prose>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </details>
          </li>
        ))}
      </ul>

      <h3 className="docs-title docs-title-checks">{crossChecksTitle}</h3>

      <ul className="docs-checks">
        {checks.map((check) => (
          <li className="docs-check" key={check.pair}>
            <h4 className="docs-pair">{markUp(check.pair)}</h4>
            <p className="docs-check-line">
              <span className="label">{shouldMatchLabel}</span>
              {markUp(check.shouldMatch)}
            </p>
            <p className="docs-check-line docs-check-else">
              <span className="label label-alert">{ifItDoesNotLabel}</span>
              {markUp(check.ifItDoesNot)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
