"use client";

import { useId, useMemo, useState } from "react";
import {
  addressLine,
  bankAccounts,
  bankRules,
  blockFields,
  fieldValue,
  filingGroups,
  filingSectionOn,
  formatDob,
  isChanged,
  personalBlocks,
  personalSection,
  prefilledCopy,
  SAME_ADDRESS_FIELD,
  secondaryAddressWanted,
  type FilingOption,
  type PersonalBlockId,
  type PersonalField,
} from "../personal-section";
import { ChevronIcon } from "./icons";
import { markUp, Prose } from "./Prose";

/** Short structural wording. Everything a citizen reads about their own case
    comes from `personal-section.ts`; only the scaffolding is passed in here. */
export type PersonalLabels = {
  /** Heading over the filing-section block. */
  filingTitle: string;
  /** A sentence or two under it. May carry `[[term]]` markers. */
  filingIntro: string;
  /** Lead-in over the section that applies, e.g. "The section you are filing under". */
  appliesLabel: string;
  /** Why that one, keyed to what `filingSectionOn` returns. */
  filingReason: Record<"onTime" | "belated" | "belatedClosed", string>;
  /** Lead-in over a quotation of the portal's own wording. */
  officialLabel: string;
  /** Lead-in over the sentence saying when an option is the right one. */
  whenLabel: string;

  /** Lead-in over the rest of the list, e.g. "The other four in this list". */
  otherOptionsLabel: (count: number) => string;
  /** A sentence saying they are here to be read, not chosen between. */
  otherOptionsNote: string;

  /** Word marking the notice group as not applying. Never colour alone. */
  noticeStateLabel: string;
  /** A sentence saying these only follow a notice from the department. */
  noticeNote: string;
  /** Summary on the disclosure holding them, given how many there are. */
  noticeOptionsSummary: (count: number) => string;

  /** Heading over the representative-assessee block. */
  representativeTitle: string;
  /** Lead-in over the portal's question, e.g. "The portal asks". */
  portalAsksLabel: string;
  /** Lead-in over the answer this case carries. */
  answerLabel: string;

  /** Legend over the radio group, e.g. "Where your refund goes". */
  refundLegend: string;
  /** Field names on an account's own rows. */
  accountNumberLabel: string;
  ifscLabel: string;
  accountTypeLabel: string;

  /** Headings and ledes over the two prefilled blocks. */
  profileTitle: string;
  profileIntro: string;
  contactTitle: string;
  contactIntro: string;
  /** Lead-in over the portal's own name for the block, e.g. "Profile". */
  portalCallsLabel: string;
  /** That the portal makes this a page of its own and we do not. */
  separateFlowNote: string;
  /** That an asterisk marks a box the portal requires. */
  mandatoryNote: string;
  /** The edit, save, cancel and undo controls on a prefilled block. */
  editLabel: string;
  saveLabel: string;
  cancelLabel: string;
  undoLabel: string;
  /** Marks a field moved off what the department holds. */
  changedBadge: string;
  /** Marks a field the return will not take a change to. */
  lockedBadge: string;
  /** Stands in for an optional box left empty. */
  emptyValue: string;

  /** Lead-in over the portal's numbered rules for this section. */
  rulesLabel: string;
  /** That the portal's Add Another control is not live here. */
  addAnotherNote: string;
};

/* Section number and the portal's description of it, which together are enough
   to tell what an option is without opening anything. */
const optionHead = (option: FilingOption) => (
  <>
    <span className="pers-option-no">{option.section}</span>
    <span className="pers-option-official">{option.official}</span>
  </>
);

function OptionBody({
  option,
  whenLabel,
}: {
  option: FilingOption;
  whenLabel: string;
}) {
  return (
    <div className="pers-option-body">
      <Prose className="pers-option-plain">{option.plain}</Prose>
      <p className="pers-when">
        <span className="label">{whenLabel}</span>
        {markUp(option.whenItApplies)}
      </p>
    </div>
  );
}


/* A block the department has already filled in.

   The portal shows these as read-only cards with an Edit button that leaves the
   return for a page of its own. Here the card is the same and the Edit stays
   put: the fields open in place, save and cancel are next to them, and the
   return is never lost. Only what the citizen has actually moved is marked, so
   the card still reads as the department's record rather than as a form they
   have to check line by line.

   A field the return will not take a change to is rendered as text, not as a
   disabled input. A disabled box still looks like somewhere to type. */
function PrefilledBlock({
  block,
  language,
  title,
  intro,
  details,
  onChange,
  labels,
}: {
  block: PersonalBlockId;
  language: "en" | "hi";
  title: string;
  intro: string;
  /** The citizen's own answers. A field absent here still holds the prefill. */
  details: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
  labels: PersonalLabels;
}) {
  const uid = useId();
  const copy = prefilledCopy[language][block];
  const groups = personalBlocks[block];

  const [editing, setEditing] = useState(false);
  const [buffer, setBuffer] = useState<Record<string, string>>({});
  /* Announced once after a save, and cleared the moment they edit again. */
  const [saved, setSaved] = useState(false);

  const fields = blockFields(block);
  const changed = fields.some((field) => isChanged(field, details));
  const sameAnswer = secondaryAddressWanted(details) ? "No" : "Yes";
  /* While the fields are open the radio governs them directly, so answering
     "No" reveals the second address there and then rather than after a save. */
  const showSecondary = editing
    ? (buffer[SAME_ADDRESS_FIELD] ?? sameAnswer) === "No"
    : sameAnswer === "No";

  /* Editing works on a copy, so Cancel is a real cancel and a half-typed
     mobile number never reaches the draft. */
  const open = () => {
    const seed: Record<string, string> = {};
    for (const field of fields) seed[field.id] = fieldValue(field, details);
    seed[SAME_ADDRESS_FIELD] = sameAnswer;
    setBuffer(seed);
    setSaved(false);
    setEditing(true);
  };

  const save = () => {
    const next = { ...details };
    for (const field of fields) {
      if (field.locked) continue;
      next[field.id] = buffer[field.id] ?? "";
    }
    if (copy.sameAddressQuestion) {
      next[SAME_ADDRESS_FIELD] = buffer[SAME_ADDRESS_FIELD] ?? "Yes";
    }
    onChange(next);
    setEditing(false);
    setSaved(true);
  };

  /* Undo drops the citizen's answers rather than writing the prefill back over
     them, so the block returns to saying "this is the department's record"
     rather than "you have retyped the department's record". */
  const undo = () => {
    const next = { ...details };
    for (const field of fields) delete next[field.id];
    delete next[SAME_ADDRESS_FIELD];
    onChange(next);
    setSaved(false);
  };

  const skipGroup = (groupId: string) =>
    groupId === "contact-address-2" && !showSecondary;

  const shown = (field: PersonalField) => {
    const value = fieldValue(field, details).trim();
    if (!value) return labels.emptyValue;
    return field.kind === "date" ? formatDob(value) : value;
  };

  return (
    <section aria-labelledby={`${uid}-head`} className="pers-block pers-pre">
      <h3 className="pers-title" id={`${uid}-head`}>
        {title}
      </h3>
      <Prose className="pers-lede">{intro}</Prose>

      <p className="pers-portal-name">
        <span className="label">{labels.portalCallsLabel}</span>
        <span className="pers-portal-word">{copy.portalName}</span>
      </p>
      <p className="pers-note">{labels.separateFlowNote}</p>

      {editing ? (
        <div className="pers-form">
          <p className="pers-note pers-mandatory">{labels.mandatoryNote}</p>

          {groups.map((group) =>
            skipGroup(group.id) ? null : (
              <fieldset className="pers-fields" key={group.id}>
                {group.heading && (
                  <legend className="pers-group-head">{group.heading}</legend>
                )}
                <div className="pers-grid">
                  {group.fields.map((field) => {
                    const id = `${uid}-${field.id}`;
                    return field.locked ? (
                      <div className="pers-field is-locked" key={field.id}>
                        <span className="label">{field.label}</span>
                        <p className="pers-field-fixed">
                          {shown(field)}
                          <span className="label pers-field-lock">
                            {labels.lockedBadge}
                          </span>
                        </p>
                      </div>
                    ) : (
                      <label className="field pers-field" htmlFor={id} key={field.id}>
                        <span>
                          {field.label}
                          {field.required && (
                            <span aria-hidden="true" className="pers-star">
                              {" *"}
                            </span>
                          )}
                        </span>
                        <input
                          autoComplete={field.autoComplete}
                          id={id}
                          inputMode={field.numeric ? "numeric" : undefined}
                          maxLength={field.maxLength}
                          name={field.id}
                          onChange={(event) =>
                            setBuffer((current) => ({
                              ...current,
                              [field.id]: field.numeric
                                ? event.target.value.replace(/\D/g, "")
                                : event.target.value,
                            }))
                          }
                          required={field.required}
                          type={field.kind}
                          value={buffer[field.id] ?? ""}
                        />
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ),
          )}

          {copy.sameAddressQuestion && (
            <fieldset className="pers-same">
              <legend className="pers-group-head">
                {copy.sameAddressQuestion}
                <span aria-hidden="true" className="pers-star">
                  {" *"}
                </span>
              </legend>
              {["Yes", "No"].map((answer) => (
                <label className="pers-same-pick" key={answer}>
                  <input
                    checked={(buffer[SAME_ADDRESS_FIELD] ?? "Yes") === answer}
                    name={`${uid}-same`}
                    onChange={() =>
                      setBuffer((current) => ({
                        ...current,
                        [SAME_ADDRESS_FIELD]: answer,
                      }))
                    }
                    type="radio"
                    value={answer}
                  />
                  <span>{answer}</span>
                </label>
              ))}
            </fieldset>
          )}

          <div className="actions">
            <button className="btn" onClick={save} type="button">
              {labels.saveLabel}
            </button>
            <button
              className="link-btn"
              onClick={() => setEditing(false)}
              type="button"
            >
              {labels.cancelLabel}
            </button>
          </div>
        </div>
      ) : (
        <>
          <dl className="rows pers-read">
            {groups.map((group) =>
              skipGroup(group.id) ? null : group.id.startsWith("contact-address") ? (
                /* The portal prints an address back as one line, and so does
                   this: eight rows of it would bury the two lines above that
                   a notice actually travels on. */
                <div key={group.id}>
                  <dt>{group.heading}</dt>
                  <dd>
                    {addressLine(
                      group.id === "contact-address" ? "" : "secondary-",
                      details,
                    ) || labels.emptyValue}
                  </dd>
                </div>
              ) : (
                group.fields.map((field) => (
                  <div key={field.id}>
                    <dt>
                      {group.heading ? `${group.heading} — ` : ""}
                      {field.label}
                    </dt>
                    <dd>
                      {shown(field)}
                      {isChanged(field, details) && (
                        <span className="label label-alert pers-changed">
                          {labels.changedBadge}
                        </span>
                      )}
                      {field.locked && (
                        <span className="label pers-field-lock">
                          {labels.lockedBadge}
                        </span>
                      )}
                    </dd>
                  </div>
                ))
              ),
            )}
            {copy.sameAddressQuestion && (
              <div>
                <dt>{copy.sameAddressQuestion}</dt>
                <dd>{sameAnswer}</dd>
              </div>
            )}
          </dl>

          {copy.lockedNote && (
            <Prose className="pers-note pers-locked-note">
              {copy.lockedNote}
            </Prose>
          )}

          {changed && <p className="pers-note pers-changed-note">{copy.changedNote}</p>}

          {/* Live so that a save is heard and not only seen, and so that the
              one thing a citizen most needs to know after changing an address
              — that nothing has been sent anywhere — is what gets announced. */}
          <p aria-live="polite" className="pers-saved">
            {saved ? copy.savedNote : ""}
          </p>

          <div className="actions">
            <button className="btn btn-secondary" onClick={open} type="button">
              {labels.editLabel}
            </button>
            {changed && (
              <button className="link-btn" onClick={undo} type="button">
                {labels.undoLabel}
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}

/* Personal Information: the filing section, the representative assessee
   question, and the bank account a refund is actually paid into.

   The portal prints nine filing sections as one flat list of radio buttons and
   leaves a citizen to work out which of them is theirs. Only one can be, and
   the date decides it, so the answer leads and the reasoning sits under it. The
   other four voluntary sections stay on the page as rows a reader can open,
   because a citizen who has heard of a belated return should be able to find
   out what it is here rather than by choosing it. The four that follow a notice
   are a different thing altogether — none of them applies until an envelope has
   arrived — so they are set apart and marked as not applying.

   The bank block is the one place here that takes an answer rather than showing
   one. Exactly one account can receive the refund, which is what makes it a
   radio group: independent switches would offer a state the department cannot
   honour. An account the portal has not matched against the bank's records
   cannot be paid into at all, so its control is genuinely off and says why. */
export function PersonalSection({
  language,
  today,
  nominatedId,
  onNominate,
  details,
  onDetails,
  labels,
}: {
  language: "en" | "hi";
  /** Today, so the applicable filing section is derived and not asserted. */
  today: Date;
  /** Which bank account the refund is set to go to. */
  nominatedId: string;
  onNominate: (accountId: string) => void;
  /** The citizen's own corrections to the prefilled profile and contact
      blocks. Empty means the department's record stands. */
  details: Record<string, string>;
  onDetails: (next: Record<string, string>) => void;
  labels: PersonalLabels;
}) {
  const uid = useId();
  const copy = personalSection[language];
  const groups = filingGroups[language];
  const rules = bankRules[language];

  const applied = useMemo(() => filingSectionOn(today), [today]);

  const voluntary = groups.find((group) => group.id === "voluntary");
  const notice = groups.find((group) => group.id === "notice");
  const current = voluntary?.options.find(
    (option) => option.section === applied.section,
  );
  const others =
    voluntary?.options.filter((option) => option.section !== applied.section) ??
    [];

  return (
    <div className="pers">
      {/* Who you are and where you can be reached come before why you are
          filing, because they are what the rest of the page is about a person
          the department has already identified. */}
      <PrefilledBlock
        block="profile"
        details={details}
        intro={labels.profileIntro}
        labels={labels}
        language={language}
        onChange={onDetails}
        title={labels.profileTitle}
      />

      <PrefilledBlock
        block="contact"
        details={details}
        intro={labels.contactIntro}
        labels={labels}
        language={language}
        onChange={onDetails}
        title={labels.contactTitle}
      />

      <section aria-labelledby={`${uid}-filing`} className="pers-block">
        <h3 className="pers-title" id={`${uid}-filing`}>
          {labels.filingTitle}
        </h3>
        <Prose className="pers-lede">{labels.filingIntro}</Prose>

        {voluntary && current && (
          <div
            className={
              applied.reason === "onTime"
                ? "pers-answer is-ontime"
                : "pers-answer is-late"
            }
          >
            <p className="label">{labels.appliesLabel}</p>
            <p className="pers-answer-no">
              <span className="pers-answer-us">{voluntary.label}</span>
              {current.section}
            </p>
            <p className="pers-answer-why">
              {labels.filingReason[applied.reason]}
            </p>
            <p className="pers-answer-official">
              <span className="label">{labels.officialLabel}</span>
              {current.official}
            </p>
            <Prose className="pers-answer-plain">{current.plain}</Prose>
            <p className="pers-when">
              <span className="label">{labels.whenLabel}</span>
              {markUp(current.whenItApplies)}
            </p>
          </div>
        )}

        {others.length > 0 && (
          <>
            <h4 className="pers-subhead">
              {labels.otherOptionsLabel(others.length)}
            </h4>
            <p className="pers-note">{labels.otherOptionsNote}</p>

            <ul className="pers-options">
              {others.map((option) => (
                <li key={option.section}>
                  {/* Shut, the row still names the section and quotes the
                      portal's description of it. Only the explanation is
                      folded away, so nothing here has to be opened to be
                      found. */}
                  <details className="pers-option">
                    <summary className="pers-option-toggle">
                      {optionHead(option)}
                      <ChevronIcon className="pers-chevron" />
                    </summary>
                    <OptionBody option={option} whenLabel={labels.whenLabel} />
                  </details>
                </li>
              ))}
            </ul>
          </>
        )}

        {notice && (
          <div className="pers-notice">
            {/* The state word comes before the group's own name, because the
                name is a sentence about the citizen — "you are filing because
                the department asked you to" — and read first it is a claim
                about them that is not true. */}
            <h4 className="pers-notice-head">
              <span className="label">{labels.noticeStateLabel}</span>
              <span className="pers-notice-name">{notice.plain}</span>
            </h4>
            <p className="pers-note">{labels.noticeNote}</p>

            <details className="pers-more">
              <summary>
                {labels.noticeOptionsSummary(notice.options.length)}
              </summary>
              <p className="label pers-notice-us">{notice.label}</p>
              <ul className="pers-notice-options">
                {notice.options.map((option) => (
                  <li className="pers-notice-option" key={option.section}>
                    <p className="pers-option-head">{optionHead(option)}</p>
                    <OptionBody option={option} whenLabel={labels.whenLabel} />
                  </li>
                ))}
              </ul>
            </details>
          </div>
        )}
      </section>

      <section aria-labelledby={`${uid}-rep`} className="pers-block">
        <h3 className="pers-title" id={`${uid}-rep`}>
          {labels.representativeTitle}
        </h3>

        <div className="pers-shown">
          <p className="label">{labels.portalAsksLabel}</p>
          <p className="pers-question">{copy.representativeQuestion}</p>
          <p className="label pers-answer-label">{labels.answerLabel}</p>
          <p className="pers-value">{copy.representativeAnswer}</p>
          <Prose className="pers-plain">{copy.representativePlain}</Prose>
        </div>
      </section>

      <section aria-labelledby={`${uid}-bank`} className="pers-block">
        <h3 className="pers-title" id={`${uid}-bank`}>
          {copy.bankHeading}
        </h3>
        <Prose className="pers-lede">{copy.bankIntro}</Prose>
        {/* The condition on being paid, said before the control it governs. */}
        <Prose className="pers-warning">{copy.bankWarning}</Prose>

        <fieldset className="pers-accounts">
          <legend className="label pers-legend">{labels.refundLegend}</legend>

          <ul className="pers-list">
            {bankAccounts.map((account) => {
              const chosen = account.validated && account.id === nominatedId;
              const noteId = `${uid}-${account.id}-note`;

              return (
                <li
                  className={chosen ? "pers-account is-chosen" : "pers-account"}
                  key={account.id}
                >
                  <label className="pers-account-pick">
                    {/* Genuinely disabled rather than aria-disabled, which is
                        the opposite of the choice made for the step rail. A
                        radio group is arrow-navigated, and arrowing onto a
                        member selects it — so a merely advisory disabled state
                        would nominate an account no refund can reach. */}
                    <input
                      aria-describedby={account.validated ? undefined : noteId}
                      checked={chosen}
                      disabled={!account.validated}
                      name={`${uid}-refund`}
                      onChange={() => onNominate(account.id)}
                      type="radio"
                      value={account.id}
                    />
                    <span className="pers-account-bank">{account.bank}</span>
                    <span
                      className={
                        account.validated
                          ? "label label-ok pers-account-state"
                          : "label label-alert pers-account-state"
                      }
                    >
                      {account.validated
                        ? copy.validatedBadge
                        : copy.notValidatedBadge}
                    </span>
                  </label>

                  <dl className="pers-account-facts">
                    <div className="pers-fact">
                      <dt className="label">{labels.accountNumberLabel}</dt>
                      <dd>{account.masked}</dd>
                    </div>
                    <div className="pers-fact">
                      <dt className="label">{labels.ifscLabel}</dt>
                      <dd>{account.ifsc}</dd>
                    </div>
                    <div className="pers-fact">
                      <dt className="label">{labels.accountTypeLabel}</dt>
                      <dd>{account.kind}</dd>
                    </div>
                  </dl>

                  {!account.validated && (
                    <p className="pers-account-note" id={noteId}>
                      {markUp(copy.notValidatedNote)}
                    </p>
                  )}

                  {chosen && (
                    <p className="label label-ok pers-nominated">
                      {copy.nominatedToggle}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </fieldset>

        <p className="label pers-rules-label">{labels.rulesLabel}</p>
        <ol className="pers-rules">
          {rules.map((rule) => (
            <li className="pers-rule" key={rule}>
              <Prose className="pers-rule-text">{rule}</Prose>
            </li>
          ))}
        </ol>

        {/* Not a button. The portal has a control here and this prototype has
            nowhere to put a second account, so it is shown as the name of a
            control that is not live rather than as one that swallows a tap. */}
        <p className="pers-inert">
          <span className="pers-inert-name">{copy.addAnother}</span>
          <span className="pers-inert-note">{labels.addAnotherNote}</span>
        </p>
      </section>
    </div>
  );
}
