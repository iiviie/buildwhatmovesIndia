"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  copy,
  helpByStep,
  journeyCopy,
} from "./content";
import {
  createDownload,
  defaultDraft,
  DEMO_REFERENCE,
  demoCase,
  demoDocuments,
  DRAFT_KEY,
  formatRupees,
  hasAllDocuments,
  type DraftState,
  type Language,
  validateFile,
} from "./case-data";

const OFFICIAL_FAQ =
  "https://www.incometax.gov.in/iec/foportal/taxonomy/term/38";
const OFFICIAL_PORTAL = "https://www.incometax.gov.in/iec/foportal/";
const TOTAL_STEPS = 7;

const parseDraft = (value: string | null): DraftState | null => {
  if (!value) return null;
  try {
    const draft = JSON.parse(value) as DraftState;
    if (
      typeof draft.step !== "number" ||
      !Array.isArray(draft.documents) ||
      !["en", "hi"].includes(draft.language)
    ) {
      return null;
    }
    return draft;
  } catch {
    return null;
  }
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="fact-field">
    <dt>{label}</dt>
    <dd>{value}</dd>
  </div>
);

export function SahiReturnApp() {
  const [draft, setDraft] = useState<DraftState>(defaultDraft);
  const [hydrated, setHydrated] = useState(false);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [notice, setNotice] = useState("");
  const [formError, setFormError] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [supportMode, setSupportMode] = useState(false);
  const [supportIssue, setSupportIssue] = useState("");
  const [supportDetails, setSupportDetails] = useState("");
  const [supportReference, setSupportReference] = useState("");
  const [clearOpen, setClearOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const helpCloseRef = useRef<HTMLButtonElement>(null);

  const language = draft.language;
  const common = copy[language];
  const page = journeyCopy[language];

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      const saved = parseDraft(window.localStorage.getItem(DRAFT_KEY));
      if (saved) {
        setDraft(saved);
        setHasSavedDraft(saved.step > 0 || saved.status !== "draft");
      }
      setIsOnline(window.navigator.onLine);
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    document.documentElement.lang = draft.language;
  }, [draft, hydrated]);

  useEffect(() => {
    const goOnline = () => {
      setIsOnline(true);
      setNotice(copy[draft.language].online);
    };
    const goOffline = () => {
      setIsOnline(false);
      setNotice(copy[draft.language].offline);
    };
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, [draft.language]);

  useEffect(() => {
    if (hydrated && draft.step > 0) {
      headingRef.current?.focus();
    }
  }, [draft.step, hydrated]);

  useEffect(() => {
    if (helpOpen) helpCloseRef.current?.focus();
  }, [helpOpen]);

  const updateDraft = (next: Partial<DraftState>) => {
    setDraft((current) => ({ ...current, ...next }));
    setFormError("");
  };

  const goTo = (step: number) => {
    updateDraft({ step: Math.max(0, Math.min(TOTAL_STEPS - 1, step)) });
  };

  const switchLanguage = (nextLanguage: Language) => {
    updateDraft({ language: nextLanguage });
  };

  const loadDemoDocuments = () => {
    updateDraft({ documents: demoDocuments });
    setNotice(
      language === "hi"
        ? "तीनों डेमो दस्तावेज़ लोड हो गए।"
        : "All three demo documents are loaded.",
    );
  };

  const replaceDocument = (
    event: ChangeEvent<HTMLInputElement>,
    kind: DraftState["documents"][number]["kind"],
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const validation = validateFile(file);
    if (validation === "type") {
      setFormError(page.documents.typeError);
      return;
    }
    if (validation === "size") {
      setFormError(page.documents.sizeError);
      return;
    }

    updateDraft({
      documents: draft.documents.map((document) =>
        document.kind === kind
          ? {
              ...document,
              name: file.name,
              size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
              source:
                language === "hi"
                  ? "इस ब्राउज़र में चुनी गई काल्पनिक फाइल"
                  : "Synthetic file selected in this browser",
              loaded: true,
            }
          : document,
      ),
    });
    event.target.value = "";
  };

  const continueFromDocuments = () => {
    if (!hasAllDocuments(draft.documents)) {
      setFormError(page.documents.incomplete);
      return;
    }
    goTo(3);
  };

  const continueFromConfirm = () => {
    if (!draft.ownership) {
      setFormError(page.confirm.required);
      return;
    }
    if (draft.ownership === "yes") {
      goTo(5);
    }
  };

  const finishDisputedRoute = () => {
    const time = new Intl.DateTimeFormat(
      language === "hi" ? "hi-IN" : "en-IN",
      { dateStyle: "medium", timeStyle: "short" },
    ).format(new Date());
    updateDraft({
      status: "disputed",
      reference: "DEMO-CHECK-2026-0019",
      submittedAt: time,
      step: 6,
    });
  };

  const submitResponse = async () => {
    if (!draft.declaration) {
      setFormError(page.review.declarationError);
      return;
    }
    if (draft.status === "submitting" || draft.status === "submitted") return;
    if (!window.navigator.onLine) {
      updateDraft({ status: "queued" });
      setIsOnline(false);
      return;
    }

    updateDraft({ status: "submitting" });
    await new Promise((resolve) => window.setTimeout(resolve, 900));

    if (!window.navigator.onLine) {
      updateDraft({ status: "queued" });
      setIsOnline(false);
      return;
    }

    const submittedAt = new Intl.DateTimeFormat(
      language === "hi" ? "hi-IN" : "en-IN",
      { dateStyle: "medium", timeStyle: "short" },
    ).format(new Date());
    updateDraft({
      status: "submitted",
      reference: DEMO_REFERENCE,
      submittedAt,
      step: 6,
    });
  };

  const downloadReceipt = () => {
    const blob = new Blob([createDownload(draft, language)], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${draft.reference ?? "sahi-return-demo"}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const clearDraft = () => {
    window.localStorage.removeItem(DRAFT_KEY);
    setDraft({ ...defaultDraft, language, lowData: draft.lowData });
    setHasSavedDraft(false);
    setClearOpen(false);
    setSupportReference("");
    setNotice(
      language === "hi"
        ? "काल्पनिक ड्राफ्ट मिटा दिया गया।"
        : "Synthetic draft cleared.",
    );
  };

  const resetDemo = () => {
    window.localStorage.removeItem(DRAFT_KEY);
    setDraft({ ...defaultDraft, language, lowData: draft.lowData });
    setHasSavedDraft(false);
    setFormError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const createSupportRequest = (event: FormEvent) => {
    event.preventDefault();
    if (!supportIssue || supportDetails.trim().length < 10) return;
    setSupportReference("SUPPORT-DEMO-0264");
  };

  const openHelp = () => {
    setSupportMode(false);
    setSupportReference("");
    setHelpOpen(true);
  };

  const renderStart = () => (
    <section className="start-layout" aria-labelledby="start-title">
      <div className="start-copy">
        <p className="eyebrow">{page.start.eyebrow}</p>
        <h1 id="start-title">{page.start.title}</h1>
        <p className="lede">{page.start.intro}</p>
        <div className="quick-facts" aria-label="Service details">
          <span>{page.start.time}</span>
          <span>{page.start.fee}</span>
          <span>{page.start.proof}</span>
        </div>
        {hasSavedDraft && draft.step > 0 ? (
          <div className="resume-card">
            <p>{common.resume}</p>
            <div className="button-row">
              <button className="button primary" onClick={() => goTo(draft.step)}>
                {common.continueDraft}
              </button>
              <button className="button secondary" onClick={resetDemo}>
                {common.startAgain}
              </button>
            </div>
          </div>
        ) : (
          <button className="button primary large" onClick={() => goTo(1)}>
            {page.start.action}
          </button>
        )}
      </div>

      <aside className="scope-card" aria-label={page.start.supportsTitle}>
        <div className="scope-section good">
          <p className="scope-kicker">{page.start.supportsTitle}</p>
          <p>{page.start.supports}</p>
        </div>
        <div className="scope-section">
          <p className="scope-kicker">{page.start.notSupportTitle}</p>
          <p>{page.start.notSupport}</p>
        </div>
        <div className="scope-section">
          <p className="scope-kicker">{page.start.needTitle}</p>
          <ul>
            {page.start.needs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <p className="privacy-note">{page.start.privacy}</p>
      </aside>
    </section>
  );

  const renderNotice = () => (
    <section className="journey-panel" aria-labelledby="step-title">
      <div className="content-column">
        <p className="eyebrow">{page.notice.eyebrow}</p>
        <h1 id="step-title" tabIndex={-1} ref={headingRef}>
          {page.notice.title}
        </h1>
        <p className="lede">{page.notice.plain}</p>

        <div className="notice-document">
          <div className="document-topline">
            <span>{common.synthetic}</span>
            <span>{language === "hi" ? "ई-कार्यवाही" : "e-Proceedings"}</span>
          </div>
          <dl className="fact-grid">
            <Field label={page.notice.taxpayer} value={demoCase.taxpayer} />
            <Field label={page.notice.pan} value={demoCase.maskedPan} />
            <Field
              label={page.notice.assessmentYear}
              value={demoCase.assessmentYear}
            />
            <Field label={page.notice.section} value={demoCase.noticeSection} />
            <Field label={page.notice.noticeDate} value={demoCase.noticeDate} />
            <Field label={page.notice.due} value={demoCase.responseDue} />
          </dl>
        </div>

        <div className="explain-card">
          <h2>{page.notice.whatMeans}</h2>
          <p>{page.notice.explanation}</p>
          <p className="warning-text">{page.notice.consequence}</p>
        </div>
      </div>
      <StepActions
        back={() => goTo(0)}
        next={() => goTo(2)}
        backLabel={common.back}
        nextLabel={page.notice.action}
      />
    </section>
  );

  const renderDocuments = () => (
    <section className="journey-panel" aria-labelledby="step-title">
      <div className="content-column">
        <p className="eyebrow">{page.documents.eyebrow}</p>
        <h1 id="step-title" tabIndex={-1} ref={headingRef}>
          {page.documents.title}
        </h1>
        <p className="lede">{page.documents.intro}</p>
        <p className="requirements">{page.documents.requirements}</p>

        <button className="button primary" onClick={loadDemoDocuments}>
          {page.documents.load}
        </button>

        <div className="document-list">
          {draft.documents.map((document) => (
            <article className="document-card" key={document.kind}>
              <div className="file-mark" aria-hidden="true">
                {document.kind === "return" ? "JSON" : "PDF"}
              </div>
              <div className="document-info">
                <h2>{document.name}</h2>
                <p>
                  {document.size} · {document.source}
                </p>
                <p className={document.loaded ? "file-ready" : "file-missing"}>
                  {document.loaded ? page.documents.loaded : page.documents.missing}
                </p>
              </div>
              <label className="file-button" htmlFor={`file-${document.kind}`}>
                {page.documents.choose}
                <input
                  id={`file-${document.kind}`}
                  type="file"
                  accept=".pdf,.json,.txt,application/pdf,application/json,text/plain"
                  onChange={(event) => replaceDocument(event, document.kind)}
                />
              </label>
            </article>
          ))}
        </div>

        <p className="warning-banner">{page.documents.realWarning}</p>
        {formError && <ErrorSummary message={formError} />}
      </div>
      <StepActions
        back={() => goTo(1)}
        next={continueFromDocuments}
        backLabel={common.back}
        nextLabel={page.documents.action}
      />
    </section>
  );

  const renderCompare = () => (
    <section className="journey-panel wide" aria-labelledby="step-title">
      <div className="content-column">
        <p className="eyebrow">{page.compare.eyebrow}</p>
        <h1 id="step-title" tabIndex={-1} ref={headingRef}>
          {page.compare.title}
        </h1>
        <p className="lede">{page.compare.intro}</p>

        <div className="comparison-table" role="table" aria-label={page.compare.title}>
          <div className="comparison-row header" role="row">
            <div role="columnheader">{page.compare.field}</div>
            <div role="columnheader">{page.compare.form26as}</div>
            <div role="columnheader">{page.compare.filedReturn}</div>
            <div role="columnheader">{page.compare.result}</div>
          </div>
          <div className="comparison-row" role="row">
            <div role="rowheader" data-label={page.compare.field}>
              {page.compare.interest}
            </div>
            <div role="cell" data-label={page.compare.form26as}>
              {formatRupees(demoCase.interestIncome, language)}
            </div>
            <div role="cell" data-label={page.compare.filedReturn}>
              {formatRupees(0, language)}
            </div>
            <div role="cell" data-label={page.compare.result}>
              <span className="status-pill issue">{page.compare.mismatch}</span>
            </div>
          </div>
          <div className="comparison-row" role="row">
            <div role="rowheader" data-label={page.compare.field}>
              {page.compare.tds}
            </div>
            <div role="cell" data-label={page.compare.form26as}>
              {formatRupees(demoCase.bankTds, language)}
            </div>
            <div role="cell" data-label={page.compare.filedReturn}>
              {formatRupees(demoCase.bankTds, language)}
            </div>
            <div role="cell" data-label={page.compare.result}>
              <span className="status-pill okay">{page.compare.match}</span>
            </div>
          </div>
        </div>

        <div className="source-card">
          <p>{page.compare.sourceNote}</p>
          <dl>
            <Field
              label={common.source}
              value="Demo Form 26AS, Part I, row 04"
            />
            <Field label={common.reviewed} value="SYNTHETIC-FIXTURE-v1" />
          </dl>
        </div>
      </div>
      <StepActions
        back={() => goTo(2)}
        next={() => goTo(4)}
        backLabel={common.back}
        nextLabel={page.compare.action}
      />
    </section>
  );

  const renderConfirm = () => (
    <section className="journey-panel" aria-labelledby="step-title">
      <div className="content-column">
        <p className="eyebrow">{page.confirm.eyebrow}</p>
        <h1 id="step-title" tabIndex={-1} ref={headingRef}>
          {page.confirm.title}
        </h1>
        <p className="lede">{page.confirm.intro}</p>

        <fieldset className="choice-group">
          <legend className="sr-only">{page.confirm.title}</legend>
          {(
            [
              ["yes", page.confirm.yes, page.confirm.yesHelp],
              ["no", page.confirm.no, page.confirm.noHelp],
              ["unsure", page.confirm.unsure, page.confirm.unsureHelp],
            ] as const
          ).map(([value, label, help]) => (
            <label
              aria-label={label}
              className="choice-card"
              htmlFor={`ownership-${value}`}
              key={value}
            >
              <input
                id={`ownership-${value}`}
                type="radio"
                name="ownership"
                value={value}
                checked={draft.ownership === value}
                onChange={() => updateDraft({ ownership: value })}
              />
              <span>
                <strong>{label}</strong>
                <small>{help}</small>
              </span>
            </label>
          ))}
        </fieldset>

        {draft.ownership && draft.ownership !== "yes" && (
          <div className="stop-card" role="status">
            <h2>{page.confirm.disputedTitle}</h2>
            <p>{page.confirm.disputedText}</p>
            <a href={OFFICIAL_PORTAL} target="_blank" rel="noreferrer">
              {language === "hi"
                ? "आधिकारिक ई-फाइलिंग पोर्टल खोलें"
                : "Open the official e-Filing portal"}
              <span className="sr-only">
                {language === "hi" ? ", नई विंडो" : ", opens in a new window"}
              </span>
            </a>
          </div>
        )}

        {formError && <ErrorSummary message={formError} />}
      </div>
      <div className="step-actions">
        <button className="button secondary" onClick={() => goTo(3)}>
          {common.back}
        </button>
        {draft.ownership && draft.ownership !== "yes" ? (
          <button className="button primary" onClick={finishDisputedRoute}>
            {page.confirm.disputedAction}
          </button>
        ) : (
          <button className="button primary" onClick={continueFromConfirm}>
            {page.confirm.action}
          </button>
        )}
      </div>
    </section>
  );

  const renderReview = () => (
    <section className="journey-panel" aria-labelledby="step-title">
      <div className="content-column">
        <p className="eyebrow">{page.review.eyebrow}</p>
        <h1 id="step-title" tabIndex={-1} ref={headingRef}>
          {page.review.title}
        </h1>

        <div className="change-card">
          <h2>{page.review.changeTitle}</h2>
          <p>{page.review.change}</p>
          <dl className="amount-grid">
            <Field
              label={page.review.before}
              value={formatRupees(demoCase.originalTotalIncome, language)}
            />
            <Field
              label={page.review.after}
              value={formatRupees(demoCase.correctedTotalIncome, language)}
            />
            <Field
              label={page.review.taxBefore}
              value={formatRupees(demoCase.originalTax, language)}
            />
            <Field
              label={page.review.taxAfter}
              value={formatRupees(demoCase.correctedTax, language)}
            />
            <Field
              label={page.review.tds}
              value={formatRupees(demoCase.totalTds, language)}
            />
            <Field
              label={page.review.balance}
              value={formatRupees(demoCase.balanceTax, language)}
            />
          </dl>
          <p className="calculation-note">{page.review.calculation}</p>
        </div>

        <label className="declaration">
          <input
            type="checkbox"
            checked={draft.declaration}
            onChange={(event) => updateDraft({ declaration: event.target.checked })}
          />
          <span>{page.review.declaration}</span>
        </label>

        {draft.status === "queued" && (
          <div className="queue-card" role="status">
            <h2>{page.review.queuedTitle}</h2>
            <p>{page.review.queued}</p>
          </div>
        )}
        {formError && <ErrorSummary message={formError} />}
      </div>
      <div className="step-actions">
        <button className="button secondary" onClick={() => goTo(4)}>
          {common.back}
        </button>
        <button
          className="button primary"
          onClick={submitResponse}
          disabled={draft.status === "submitting" || draft.status === "submitted"}
          aria-describedby="submission-disclosure"
        >
          {draft.status === "submitting"
            ? page.review.submitting
            : draft.status === "queued"
              ? page.review.retry
              : page.review.submit}
        </button>
      </div>
      <p id="submission-disclosure" className="submission-disclosure">
        {common.officialWarning}
      </p>
    </section>
  );

  const renderReceipt = () => {
    const disputed = draft.status === "disputed";
    return (
      <section className="journey-panel receipt-panel" aria-labelledby="step-title">
        <div className="content-column">
          <p className="eyebrow">{page.receipt.eyebrow}</p>
          <h1 id="step-title" tabIndex={-1} ref={headingRef}>
            {disputed ? page.receipt.disputedTitle : page.receipt.title}
          </h1>

          <div className="receipt-card">
            <div className="receipt-stamp">{common.synthetic}</div>
            <dl className="receipt-grid">
              <Field
                label={page.receipt.status}
                value={
                  disputed
                    ? page.receipt.disputedStatus
                    : page.receipt.statusValue
                }
              />
              <Field
                label={page.receipt.reference}
                value={draft.reference ?? DEMO_REFERENCE}
              />
              <Field
                label={page.receipt.time}
                value={draft.submittedAt ?? "Not recorded"}
              />
              <Field
                label={page.receipt.owner}
                value={page.receipt.ownerValue}
              />
            </dl>
            <div className="receipt-next">
              <h2>{page.receipt.next}</h2>
              <p>{page.receipt.nextText}</p>
            </div>
            <p className="no-transaction">{page.receipt.noTransaction}</p>
          </div>

          <div className="button-row no-print">
            <button className="button primary" onClick={() => window.print()}>
              {page.receipt.print}
            </button>
            <button className="button secondary" onClick={downloadReceipt}>
              {page.receipt.download}
            </button>
          </div>
          <button className="text-button no-print" onClick={resetDemo}>
            {page.receipt.restart}
          </button>
        </div>
      </section>
    );
  };

  const renderStep = () => {
    if (draft.step === 0) return renderStart();
    if (draft.step === 1) return renderNotice();
    if (draft.step === 2) return renderDocuments();
    if (draft.step === 3) return renderCompare();
    if (draft.step === 4) return renderConfirm();
    if (draft.step === 5) return renderReview();
    return renderReceipt();
  };

  return (
    <div className={draft.lowData ? "app-shell low-data" : "app-shell"}>
      <a className="skip-link" href="#main-content">
        {common.skip}
      </a>

      <div className="prototype-bar">
        <span>{common.prototype}</span>
        <span aria-hidden="true">·</span>
        <span>{common.synthetic}</span>
      </div>

      <header className="site-header">
        <a className="brand" href="#main-content" onClick={() => goTo(0)}>
          <span className="brand-mark" aria-hidden="true">
            SR
          </span>
          <span>
            <strong>{common.brand}</strong>
            <small>{common.strapline}</small>
          </span>
        </a>

        <div className="header-tools">
          <div className="language-switch" aria-label="Language">
            <button
              onClick={() => switchLanguage("en")}
              aria-pressed={language === "en"}
              lang="en"
            >
              {common.english}
            </button>
            <button
              onClick={() => switchLanguage("hi")}
              aria-pressed={language === "hi"}
              lang="hi"
            >
              {common.hindi}
            </button>
          </div>
          <label className="data-toggle">
            <input
              type="checkbox"
              checked={draft.lowData}
              onChange={(event) => updateDraft({ lowData: event.target.checked })}
            />
            <span>{common.lowData}</span>
          </label>
        </div>
      </header>

      {draft.step > 0 && (
        <nav className="progress-wrap" aria-label="Journey progress">
          <div className="progress-summary">
            <span>{common.stepOf(draft.step, TOTAL_STEPS - 1)}</span>
            <strong>{common.steps[draft.step]}</strong>
          </div>
          <ol className="progress-list">
            {common.steps.slice(1).map((step, index) => {
              const number = index + 1;
              const state =
                number < draft.step
                  ? "complete"
                  : number === draft.step
                    ? "current"
                    : "upcoming";
              return (
                <li className={state} key={step} aria-current={state === "current" ? "step" : undefined}>
                  <span>{number}</span>
                  <small>{step}</small>
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      <div className="network-status" aria-live="polite" aria-atomic="true">
        {notice || (isOnline ? common.saved : common.offline)}
      </div>

      <main id="main-content">{renderStep()}</main>

      <aside className="help-strip no-print">
        <div>
          <strong>{common.help}</strong>
          <span>{helpByStep[language][draft.step]}</span>
        </div>
        <button className="button secondary" onClick={openHelp}>
          {common.help}
        </button>
      </aside>

      <footer className="site-footer">
        <div>
          <strong>{common.footerTitle}</strong>
          <p>{common.footerText}</p>
        </div>
        <div className="footer-links no-print">
          <a href={OFFICIAL_FAQ} target="_blank" rel="noreferrer">
            {common.officialSource}
            <span className="sr-only">
              {language === "hi" ? ", नई विंडो" : ", opens in a new window"}
            </span>
          </a>
          <button className="text-button" onClick={() => setClearOpen(true)}>
            {common.clearData}
          </button>
        </div>
      </footer>

      {helpOpen && (
        <div className="dialog-backdrop" role="presentation">
          <section
            className="dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-title"
          >
            <button
              className="dialog-close"
              onClick={() => setHelpOpen(false)}
              ref={helpCloseRef}
              aria-label={common.close}
            >
              ×
            </button>
            {!supportMode ? (
              <>
                <p className="eyebrow">{common.steps[draft.step]}</p>
                <h2 id="help-title">{common.help}</h2>
                <p className="dialog-lede">{helpByStep[language][draft.step]}</p>
                <div className="help-source">
                  <strong>{common.source}</strong>
                  <a href={OFFICIAL_FAQ} target="_blank" rel="noreferrer">
                    {common.officialSource}
                  </a>
                  <span>{common.reviewed}</span>
                </div>
                <button
                  className="button secondary full"
                  onClick={() => setSupportMode(true)}
                >
                  {common.support}
                </button>
              </>
            ) : supportReference ? (
              <>
                <p className="eyebrow">{common.synthetic}</p>
                <h2 id="help-title">{common.supportCreated}</h2>
                <p className="support-reference">{supportReference}</p>
                <p>{common.supportResponse}</p>
                <button className="button primary full" onClick={() => setHelpOpen(false)}>
                  {common.close}
                </button>
              </>
            ) : (
              <form onSubmit={createSupportRequest}>
                <p className="eyebrow">{common.synthetic}</p>
                <h2 id="help-title">{common.supportTitle}</h2>
                <p>{common.supportIntro}</p>
                <label className="form-field">
                  <span>{common.supportIssue}</span>
                  <select
                    required
                    value={supportIssue}
                    onChange={(event) => setSupportIssue(event.target.value)}
                  >
                    <option value="">{language === "hi" ? "चुनें" : "Select one"}</option>
                    {common.supportOptions.map((option) => (
                      <option value={option} key={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="form-field">
                  <span>{common.supportDetails}</span>
                  <textarea
                    required
                    minLength={10}
                    rows={4}
                    value={supportDetails}
                    onChange={(event) => setSupportDetails(event.target.value)}
                    placeholder={common.supportExample}
                  />
                </label>
                <button className="button primary full" type="submit">
                  {common.createSupport}
                </button>
              </form>
            )}
          </section>
        </div>
      )}

      {clearOpen && (
        <div className="dialog-backdrop" role="presentation">
          <section
            className="dialog small"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="clear-title"
            aria-describedby="clear-description"
          >
            <h2 id="clear-title">{common.clearConfirm}</h2>
            <p id="clear-description">{common.clearExplanation}</p>
            <div className="button-row">
              <button className="button secondary" onClick={() => setClearOpen(false)}>
                {common.cancel}
              </button>
              <button className="button danger" onClick={clearDraft}>
                {common.confirmClear}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function StepActions({
  back,
  next,
  backLabel,
  nextLabel,
}: {
  back: () => void;
  next: () => void;
  backLabel: string;
  nextLabel: string;
}) {
  return (
    <div className="step-actions">
      <button className="button secondary" onClick={back}>
        {backLabel}
      </button>
      <button className="button primary" onClick={next}>
        {nextLabel}
      </button>
    </div>
  );
}

function ErrorSummary({ message }: { message: string }) {
  return (
    <div className="error-summary" role="alert" tabIndex={-1}>
      <strong>{message}</strong>
    </div>
  );
}
