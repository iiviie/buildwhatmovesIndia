import {
  CALCULATION_VERSION,
  compareRegimes,
  compute,
  type Computation,
  type Regime,
  type RegimeComparison,
} from "./tax";

export type Language = "en" | "hi";

export type Theme = "light" | "dark" | "paper" | "system";

export type TextScale = "base" | "large" | "larger";

/* One prefilled income line can be the taxpayer's, the taxpayer's but for a
   different figure, not the taxpayer's at all, or still unanswered.

   "Unsure" is deliberately absent: the reconciliation step must end in a
   decision, because an unanswered line is what produces a defective return
   later. "Amended" is not a hedge — it is the common real case. A statement
   routinely reports interest the bank credited on a date the citizen's own
   passbook disagrees with, and the two honest answers on offer until now were
   to accept a wrong figure or to deny an entry that is genuinely theirs. */
export type IncomeAnswer = "mine" | "amended" | "not-mine" | null;

export type DocumentKind = "form16" | "ais";

export type DemoDocument = {
  kind: DocumentKind;
  name: string;
  size: string;
  source: string;
  loaded: boolean;
};

export type DeductionAmounts = {
  s80C: number;
  s80D: number;
};

export type JourneyStatus =
  | "draft"
  | "queued"
  | "submitting"
  | "submitted";

export type DraftState = {
  step: number;
  /* The furthest step ever opened, which is not the same as the step you are
     standing on. Going back to check something against an earlier step must
     not lock the ones you had already reached, so what a step is allowed to be
     is measured against this and never against `step`. */
  reached: number;
  language: Language;
  lowData: boolean;
  documents: DemoDocument[];
  salaryConfirmed: boolean;
  incomeAnswers: Record<string, IncomeAnswer>;
  /* The citizen's own figure for an entry answered "amended". Keyed by entry
     id; absent means the statement's figure stands. */
  incomeAmounts: Record<string, number>;
  /* The eighteen "Help me select ITR" answers. Seeded from the department's
     own records and overridden only where the citizen disagrees, so an empty
     map means "nothing changed", not "nothing answered". */
  eligibilityAnswers: Record<string, string>;
  /* Which bank account the refund is nominated to. Empty means the fixture's
     own default, so a restored draft written before this existed still works. */
  nominatedAccount: string;
  /* The citizen's own corrections to the profile and contact details the
     department prefilled from their PAN record. Keyed by the portal's field
     id; a field absent here still holds what the department holds, so an empty
     map means "nothing corrected", not "nothing filled in". */
  personalDetails: Record<string, string>;
  /* The amounts found in the synthetic salary records for the two common
     deduction groups this prototype can calculate. They stay editable because
     a prefilled amount is evidence to review, not a fact the citizen must
     accept. Savings-interest relief is derived from the AIS separately. */
  deductions: DeductionAmounts;
  benefitsReviewed: boolean;
  regime: Regime | null;
  declaration: boolean;
  status: JourneyStatus;
  reference: string | null;
  submittedAt: string | null;
  /* The same moment as `submittedAt`, machine-readable, because the 30-day
     verification window has to be counted and a formatted display string
     cannot be. Null on a draft written before verification existed. */
  submittedIso: string | null;
  /* Verification, which is a separate act from filing and the one that makes
     the return valid. Null until it happens. */
  verifiedAt: string | null;
  verifiedIso: string | null;
  /** Which of the portal's routes was used. Only ever the simulated one. */
  verificationRoute: string | null;
  feedbackReference: string | null;
};

export type Prefs = {
  theme: Theme;
  textScale: TextScale;
};

export const DRAFT_KEY = "sahi-return-filing-draft-v1";

export const PREFS_KEY = "sahi-return-prefs-v1";

export const defaultPrefs: Prefs = { theme: "paper", textScale: "base" };

export const DEMO_ACKNOWLEDGEMENT = "DEMO-ACK-2026-4471028";

export const DEMO_TRANSACTION = "DEMO-TXN-88421055";

export const FEEDBACK_REFERENCE = "DEMO-AIS-FB-2026-0019";

export const SUPPORT_REFERENCE = "SUPPORT-DEMO-0264";

export const MAX_FILE_MB = 5;
export const MAX_FILES = 10;
export const MAX_TOTAL_MB = 50;

/* Published Income Tax Department e-Filing helpdesk numbers. The prototype
   only displays them; it operates no support line of its own. */
export const OFFICIAL_HELPLINES = ["1800 103 0025", "1800 419 0025"];

export const OFFICIAL_PORTAL = "https://www.incometax.gov.in/iec/foportal/";

export const OFFICIAL_FILING_HELP =
  "https://www.incometax.gov.in/iec/foportal/help/how-to-file-itr1-form-sahaj";

export const OFFICIAL_AIS_HELP =
  "https://www.incometax.gov.in/iec/foportal/help/annual-information-statement";

export const OFFICIAL_DEFECTIVE_FAQ =
  "https://www.incometax.gov.in/iec/foportal/faqs/response-defective-notice-1399";

export const OFFICIAL_ITR1_FAQ =
  "https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/ITR1-FAQ";

/* Where a citizen goes when the answers point at a form this prototype does
   not build. The department publishes a step-by-step page for ITR-1, ITR-2 and
   ITR-4 and none for ITR-3, so ITR-3 points at the index that carries the
   guidance for business and professional filers rather than at a deep link
   invented to look complete. */
export const OFFICIAL_FORM_GUIDES: Record<string, string> = {
  "ITR-1": OFFICIAL_FILING_HELP,
  "ITR-2": "https://www.incometax.gov.in/iec/foportal/help/how-to-file-itr2-form",
  "ITR-3":
    "https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/filing-your-return",
  "ITR-4":
    "https://www.incometax.gov.in/iec/foportal/help/how-to-file-itr4-form-sugam",
};

/* --------------------------------------------------------------- fixtures */

export const demoDocuments: DemoDocument[] = [
  {
    kind: "form16",
    name: "Demo-Form-16-AY-2026-27.pdf",
    size: "198 KB",
    source: "Synthetic Form 16 from the employer",
    loaded: true,
  },
  {
    kind: "ais",
    name: "Demo-AIS-26AS-AY-2026-27.pdf",
    size: "241 KB",
    source: "Synthetic Annual Information Statement",
    loaded: true,
  },
];

export const emptyDocuments: DemoDocument[] = demoDocuments.map((document) => ({
  ...document,
  loaded: false,
}));

export type IncomeEntry = {
  id: string;
  kind: "savings" | "fd" | "dividend";
  payer: string;
  payerTan: string;
  amount: number;
  tds: number;
  sourceRow: string;
  /* The fixture's own truth, used only to write the demo's guidance. The
     interface never reveals it before the citizen answers. */
  belongsToTaxpayer: boolean;
};

/* The Annual Information Statement lines the portal prefills and asks a citizen
   to "review and confirm". Every defect this product prevents starts here. */
export const incomeEntries: IncomeEntry[] = [
  {
    id: "savings-sampurna",
    kind: "savings",
    payer: "Sampurna Bank",
    payerTan: "DEMO12345A",
    amount: 12_400,
    tds: 0,
    sourceRow: "Demo AIS, Part B, row 02",
    belongsToTaxpayer: true,
  },
  {
    id: "fd-sampurna",
    kind: "fd",
    payer: "Sampurna Bank",
    payerTan: "DEMO12345A",
    amount: 48_000,
    tds: 4_800,
    sourceRow: "Demo AIS, Part B, row 03",
    belongsToTaxpayer: true,
  },
  {
    id: "dividend-meghdoot",
    kind: "dividend",
    payer: "Meghdoot Industries Ltd",
    payerTan: "DEMO67890B",
    amount: 6_200,
    tds: 620,
    sourceRow: "Demo AIS, Part B, row 07",
    belongsToTaxpayer: true,
  },
  {
    id: "fd-trilok",
    kind: "fd",
    payer: "Trilok Bank",
    payerTan: "DEMO54321C",
    amount: 31_500,
    tds: 3_150,
    sourceRow: "Demo AIS, Part B, row 09",
    belongsToTaxpayer: false,
  },
];

export const demoCase = {
  taxpayer: "Ananya Rao",
  maskedPan: "DEMOA1234X",
  assessmentYear: "2026-27",
  financialYear: "2025-26",
  employer: "Kalpavriksha Software Pvt Ltd",
  employerTan: "DEMO98765D",
  form: "ITR-1 (Sahaj)",
  employmentType: "Private sector salaried",
  grossSalary: 1_320_000,
  salaryTds: 85_000,
  /* Old-regime figures exist only so the comparison is real. The citizen never
     types these in; the demo Form 16 already carries them. */
  demo80C: 150_000,
  demo80D: 25_000,
  calculationVersion: CALCULATION_VERSION,
  fixtureVersion: "SYNTHETIC-FIXTURE-v2",
  reviewedOn: "2026-08-27",
  /* Statutory dates named in the interface as facts, separate from the rolling
     demo window used by the progress meter. */
  dueDateOriginal: "31 July 2026",
  dueDateBelated: "31 December 2026",
  lateFeeSection: "234F",
} as const;

export const defaultDraft: DraftState = {
  step: 0,
  reached: 0,
  language: "en",
  lowData: false,
  documents: emptyDocuments,
  salaryConfirmed: false,
  incomeAnswers: {},
  incomeAmounts: {},
  eligibilityAnswers: {},
  nominatedAccount: "",
  personalDetails: {},
  deductions: {
    s80C: demoCase.demo80C,
    s80D: demoCase.demo80D,
  },
  benefitsReviewed: false,
  regime: null,
  declaration: false,
  status: "draft",
  reference: null,
  submittedAt: null,
  submittedIso: null,
  verifiedAt: null,
  verifiedIso: null,
  verificationRoute: null,
  feedbackReference: null,
};

/* ------------------------------------------------------------ derivations */

export const answeredCount = (draft: DraftState) =>
  incomeEntries.filter((entry) => draft.incomeAnswers[entry.id]).length;

export const allIncomeAnswered = (draft: DraftState) =>
  answeredCount(draft) === incomeEntries.length;

/* Both "mine" and "amended" are the citizen's income and go into the return.
   They differ only in the figure. */
export const confirmedEntries = (draft: DraftState) =>
  incomeEntries.filter((entry) => {
    const answer = draft.incomeAnswers[entry.id];
    return answer === "mine" || answer === "amended";
  });

/* What actually goes into the return for an entry: the citizen's figure where
   they gave one, the statement's otherwise. */
export const reportedAmount = (draft: DraftState, entry: IncomeEntry) =>
  draft.incomeAnswers[entry.id] === "amended" &&
  typeof draft.incomeAmounts[entry.id] === "number"
    ? draft.incomeAmounts[entry.id]
    : entry.amount;

export const disputedEntries = (draft: DraftState) =>
  incomeEntries.filter((entry) => draft.incomeAnswers[entry.id] === "not-mine");

export const otherIncomeTotal = (draft: DraftState) =>
  confirmedEntries(draft).reduce(
    (sum, entry) => sum + reportedAmount(draft, entry),
    0,
  );

/* TDS is only claimable on income the citizen has accepted. Claiming TDS from a
   line whose income is not reported is exactly the mismatch that produces a
   Section 139(9) defective-return notice. */
export const claimableTds = (draft: DraftState) =>
  demoCase.salaryTds +
  confirmedEntries(draft).reduce((sum, entry) => sum + entry.tds, 0);

export const strandedTds = (draft: DraftState) =>
  disputedEntries(draft).reduce((sum, entry) => sum + entry.tds, 0);

export const buildComparison = (draft: DraftState): RegimeComparison =>
  compareRegimes({
    grossSalary: demoCase.grossSalary,
    otherIncome: otherIncomeTotal(draft),
    deductions: {
      s80C: draft.deductions.s80C,
      s80D: draft.deductions.s80D,
      s80TTA: confirmedEntries(draft)
        .filter((entry) => entry.kind === "savings")
        .reduce((sum, entry) => sum + reportedAmount(draft, entry), 0),
    },
    tdsPaid: claimableTds(draft),
  });

export const buildComputation = (draft: DraftState): Computation =>
  compute({
    regime: draft.regime ?? "new",
    grossSalary: demoCase.grossSalary,
    otherIncome: otherIncomeTotal(draft),
    deductions: {
      s80C: draft.deductions.s80C,
      s80D: draft.deductions.s80D,
      s80TTA: confirmedEntries(draft)
        .filter((entry) => entry.kind === "savings")
        .reduce((sum, entry) => sum + reportedAmount(draft, entry), 0),
    },
    tdsPaid: claimableTds(draft),
  });

/* ------------------------------------------------------- pre-submit checks */

export type CheckId =
  | "all-reviewed"
  | "tds-matches-income"
  | "disputed-tds-dropped"
  | "regime-chosen";

export type CheckState = "pass" | "attention" | "todo";

export type CheckResult = {
  id: CheckId;
  state: CheckState;
  /* Amount the citizen needs to see alongside the check, when there is one. */
  amount?: number;
};

/* The prevention engine. These are the same rules that decide whether a filed
   return is later marked defective under Section 139(9); running them before
   submission is the whole idea of the product. */
export const runChecks = (draft: DraftState): CheckResult[] => {
  const unanswered = incomeEntries.length - answeredCount(draft);
  const stranded = strandedTds(draft);

  return [
    {
      id: "all-reviewed",
      state: unanswered === 0 ? "pass" : "attention",
      amount: unanswered,
    },
    {
      /* Every confirmed line carries its own income into the return, so this
         holds as soon as nothing is left unanswered. */
      id: "tds-matches-income",
      state: unanswered === 0 ? "pass" : "todo",
    },
    {
      /* Dropping the credit on a disputed entry is the correct outcome, not a
         problem, so this passes either way. The amount is carried so the
         interface can show what was deliberately given up. */
      id: "disputed-tds-dropped",
      state: "pass",
      amount: stranded,
    },
    {
      id: "regime-chosen",
      state: draft.regime ? "pass" : "attention",
    },
  ];
};

export const checksNeedingAttention = (draft: DraftState) =>
  runChecks(draft).filter((check) => check.state === "attention");

export const readyToSubmit = (draft: DraftState) =>
  allIncomeAnswered(draft) &&
  draft.regime !== null &&
  draft.benefitsReviewed &&
  draft.salaryConfirmed &&
  draft.declaration;

/* ----------------------------------------------------------------- dates */

const DAY_MS = 86_400_000;

/* The prototype is an Indian tax service, so its calendar is the Indian one.
   Anchoring to IST rather than to the render machine's local day keeps a worker
   running in UTC and a browser in any timezone on exactly the same dates. */
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

const TIME_ZONE = "Asia/Kolkata";

/* Real statutory dates for AY 2026-27, not a rolling demo window. A citizen
   opening this after 31 July must be told plainly that the date has passed,
   what it now costs, and that filing is still possible — which is the single
   most expensive thing the current portal leaves people to find out late. */
export const DUE_DATE_ISO = "2026-07-31";
export const BELATED_DATE_ISO = "2026-12-31";

/* Section 234F: the fee is lower for a total income at or below ₹5 lakh. */
export const LATE_FEE_LOW = 1_000;
export const LATE_FEE_HIGH = 5_000;
export const LATE_FEE_INCOME_LIMIT = 500_000;

export type FilingState = "on-time" | "belated" | "closed";

export type FilingWindow = {
  due: Date;
  belated: Date;
  state: FilingState;
  /* Whole days remaining before the date that currently matters. Never
     negative: once a date passes, the next one becomes the live one. */
  daysLeft: number;
  daysToDue: number;
  lateFee: number;
  interestFrom: Date;
};

const istMidnight = (now: Date) =>
  Math.floor((now.getTime() + IST_OFFSET_MS) / DAY_MS) * DAY_MS - IST_OFFSET_MS;

const parseIst = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) - IST_OFFSET_MS);
};

export const buildFilingWindow = (
  now: Date = new Date(),
  totalIncome = 0,
): FilingWindow => {
  const today = istMidnight(now);
  const due = parseIst(DUE_DATE_ISO);
  const belated = parseIst(BELATED_DATE_ISO);
  const interestFrom = new Date(due.getTime() + DAY_MS);

  const daysToDue = Math.round((due.getTime() - today) / DAY_MS);
  const daysToBelated = Math.round((belated.getTime() - today) / DAY_MS);

  const state: FilingState =
    daysToDue >= 0 ? "on-time" : daysToBelated >= 0 ? "belated" : "closed";

  const lateFee =
    state === "on-time"
      ? 0
      : totalIncome > 0 && totalIncome <= LATE_FEE_INCOME_LIMIT
        ? LATE_FEE_LOW
        : LATE_FEE_HIGH;

  return {
    due,
    belated,
    state,
    daysLeft: state === "on-time" ? daysToDue : Math.max(0, daysToBelated),
    daysToDue,
    lateFee,
    interestFrom,
  };
};

const locale = (language: Language) => (language === "hi" ? "hi-IN" : "en-IN");

export const formatDate = (date: Date, language: Language) =>
  new Intl.DateTimeFormat(locale(language), {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(date);

/* A date written out in full, for a record rather than a summary: an archive
   entry gives its own date and has no column heading to lean on. */
export const formatLongDate = (date: Date, language: Language) =>
  new Intl.DateTimeFormat(locale(language), {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(date);

/* The heading over a month's worth of them. */
export const formatMonth = (date: Date, language: Language) =>
  new Intl.DateTimeFormat(locale(language), {
    month: "long",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(date);

export const formatDateTime = (date: Date, language: Language) =>
  new Intl.DateTimeFormat(locale(language), {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: TIME_ZONE,
  }).format(date);

export const formatRupees = (amount: number, language: Language) =>
  new Intl.NumberFormat(locale(language), {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatPercent = (rate: number, language: Language) =>
  new Intl.NumberFormat(locale(language), {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(rate);

export const hasAllDocuments = (documents: DemoDocument[]) =>
  demoDocuments.every((required) =>
    documents.some(
      (document) => document.kind === required.kind && document.loaded,
    ),
  );

export const validateFile = (file: File) => {
  const allowedTypes = ["application/pdf", "application/json", "text/plain"];

  if (!allowedTypes.includes(file.type)) {
    return "type" as const;
  }

  if (file.size > MAX_FILE_MB * 1024 * 1024) {
    return "size" as const;
  }

  return null;
};

/* Where to send a citizen who reopens a half-finished draft. */
export const nextIncompleteStep = (draft: DraftState) => {
  if (!hasAllDocuments(draft.documents)) return 2;
  if (!draft.salaryConfirmed) return 2;
  if (!allIncomeAnswered(draft)) return 3;
  if (!draft.regime) return 4;
  return draft.step;
};

export const createDownload = (
  draft: DraftState,
  language: Language,
  computation: Computation,
) => {
  const outcome =
    computation.refundDue > 0
      ? language === "hi"
        ? `रिफ़ंड: ${formatRupees(computation.refundDue, language)}`
        : `Refund due: ${formatRupees(computation.refundDue, language)}`
      : language === "hi"
        ? `देय कर: ${formatRupees(computation.balancePayable, language)}`
        : `Balance payable: ${formatRupees(computation.balancePayable, language)}`;

  const lines =
    language === "hi"
      ? [
          "सही रिटर्न — स्वतंत्र हैकाथॉन प्रोटोटाइप",
          "केवल काल्पनिक डेटा। कोई सरकारी लेन-देन नहीं हुआ।",
          "",
          `पावती संख्या: ${draft.reference ?? "बनाई नहीं गई"}`,
          `लेन-देन संख्या: ${draft.status === "submitted" ? DEMO_TRANSACTION : "लागू नहीं"}`,
          `स्थिति: ${draft.status === "submitted" ? "सिमुलेटेड फाइलिंग पूरी" : "जमा नहीं किया गया"}`,
          `सत्यापन: ${draft.verifiedAt ? `सत्यापित — ${draft.verifiedAt}` : "अभी नहीं। 30 दिनों के भीतर सत्यापित न हुआ रिटर्न ऐसे माना जाता है जैसे भरा ही न गया हो।"}`,
          `निर्धारण वर्ष: ${demoCase.assessmentYear}`,
          `फ़ॉर्म: ${demoCase.form}`,
          `कर व्यवस्था: ${draft.regime === "old" ? "पुरानी" : "नई"}`,
          `कुल आय: ${formatRupees(computation.totalIncome, language)}`,
          `कुल कर: ${formatRupees(computation.totalTax, language)}`,
          `जमा TDS: ${formatRupees(computation.tdsPaid, language)}`,
          outcome,
          `समय: ${draft.submittedAt ?? "लागू नहीं"}`,
          `गणना संस्करण: ${demoCase.calculationVersion}`,
          "",
          "अगला कदम: असली रिटर्न और गणना को आधिकारिक ई-फाइलिंग पोर्टल या योग्य कर विशेषज्ञ से जाँचें।",
        ]
      : [
          "Sahi Return — independent hackathon prototype",
          "Synthetic data only. No government transaction occurred.",
          "",
          `Acknowledgement number: ${draft.reference ?? "Not created"}`,
          `Transaction ID: ${draft.status === "submitted" ? DEMO_TRANSACTION : "Not applicable"}`,
          `Status: ${draft.status === "submitted" ? "Simulated filing complete" : "Not submitted"}`,
          `Verification: ${draft.verifiedAt ? `Verified — ${draft.verifiedAt}` : "Not yet. A return not verified within 30 days is treated as never filed."}`,
          `Assessment year: ${demoCase.assessmentYear}`,
          `Form: ${demoCase.form}`,
          `Regime: ${draft.regime === "old" ? "Old" : "New"}`,
          `Total income: ${formatRupees(computation.totalIncome, language)}`,
          `Total tax: ${formatRupees(computation.totalTax, language)}`,
          `TDS already paid: ${formatRupees(computation.tdsPaid, language)}`,
          outcome,
          `Time: ${draft.submittedAt ?? "Not applicable"}`,
          `Calculation version: ${demoCase.calculationVersion}`,
          "",
          "Next step: Check any real return and calculation on the official e-Filing portal or with a qualified tax professional.",
        ];

  return lines.join("\n");
};

export type { Computation, Regime, RegimeComparison };

/* ------------------------------------------------------- homepage content */

/* The official homepage carries roughly forty competing items: a rotating
   carousel, a ticker, "What's New", "Latest Updates", eighteen flat quick-link
   tiles, video tutorials, testimonials and three helplines on different hours.
   We keep the same *kinds* of information, because a citizen genuinely needs
   them, and change how they are ordered and grouped. */

export type Announcement = {
  id: string;
  date: string;
  title: string;
  /* Whether this changes what a salaried filer should do right now, or is
     background. The official site gives both the same weight. */
  affectsYou: boolean;
};

export type LinkKind = "in-demo" | "official";

export type QuickLinkId =
  | "which-form"
  | "calculator"
  | "documents"
  | "link-aadhaar"
  | "instant-pan"
  | "defect-check"
  | "e-verify"
  | "refund-status"
  | "view-filed"
  | "wrong-entry"
  | "notice"
  | "authenticate"
  | "grievance"
  | "pay-tax"
  | "payment-status";

export type QuickLink = {
  id: QuickLinkId;
  group: "before" | "after" | "problem" | "pay";
  kind: LinkKind;
  /* Where an in-demo link goes. Official links carry a href instead. */
  step?: number;
  href?: string;
};

/* Grouped by when in the journey a citizen needs them, rather than the flat
   alphabetical grid the portal uses. No group runs past five. */
export const quickLinks: QuickLink[] = [
  { id: "which-form", group: "before", kind: "in-demo", step: 1 },
  { id: "calculator", group: "before", kind: "in-demo", step: 4 },
  { id: "documents", group: "before", kind: "in-demo", step: 2 },
  { id: "link-aadhaar", group: "before", kind: "official", href: "https://www.incometax.gov.in/iec/foportal/help/how-to-link-aadhaar" },
  { id: "instant-pan", group: "before", kind: "official", href: "https://www.incometax.gov.in/iec/foportal/help/instant-e-pan" },

  { id: "defect-check", group: "after", kind: "in-demo", step: 5 },
  { id: "e-verify", group: "after", kind: "official", href: "https://www.incometax.gov.in/iec/foportal/help/how-to-e-verify" },
  { id: "refund-status", group: "after", kind: "official", href: "https://www.incometax.gov.in/iec/foportal/help/status-of-tax-refund" },
  { id: "view-filed", group: "after", kind: "official", href: "https://www.incometax.gov.in/iec/foportal/help/view-filed-returns" },

  { id: "wrong-entry", group: "problem", kind: "in-demo", step: 3 },
  { id: "notice", group: "problem", kind: "official", href: OFFICIAL_DEFECTIVE_FAQ },
  { id: "authenticate", group: "problem", kind: "official", href: "https://www.incometax.gov.in/iec/foportal/help/authenticate-notice-issued-by-itd" },
  { id: "grievance", group: "problem", kind: "official", href: "https://www.incometax.gov.in/iec/foportal/help/grievance" },

  { id: "pay-tax", group: "pay", kind: "official", href: "https://www.incometax.gov.in/iec/foportal/help/e-pay-tax" },
  { id: "payment-status", group: "pay", kind: "official", href: "https://www.incometax.gov.in/iec/foportal/help/know-payment-status" },
];

export type HelplineId = "efiling" | "ais" | "tin";

export type Helpline = {
  id: HelplineId;
  numbers: string[];
  /* Opening hours in IST, as published. Days are 0=Sunday. */
  openHour: number;
  closeHour: number;
  days: number[];
};

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
const WEEKDAYS = [1, 2, 3, 4, 5];

/* Three helplines on three different schedules is genuinely confusing, and the
   official page prints the hours without saying whether the line is open now.
   We compute that. */
export const helplines: Helpline[] = [
  {
    id: "efiling",
    numbers: ["1800 103 0025", "1800 419 0025"],
    openHour: 8,
    closeHour: 20,
    days: ALL_DAYS,
  },
  {
    id: "ais",
    numbers: ["1800 103 4215"],
    openHour: 9.5,
    closeHour: 18,
    days: WEEKDAYS,
  },
  {
    id: "tin",
    numbers: ["+91 20 27218080"],
    openHour: 7,
    closeHour: 23,
    days: ALL_DAYS,
  },
];

/* Reads the wall clock in India, not on the machine doing the rendering. */
export const istParts = (now: Date) => {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(now).map((part) => [part.type, part.value]),
  );
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    day: weekdays.indexOf(parts.weekday ?? "Sun"),
    hour: Number(parts.hour) + Number(parts.minute) / 60,
  };
};

export const isHelplineOpen = (line: Helpline, now: Date = new Date()) => {
  const { day, hour } = istParts(now);
  return line.days.includes(day) && hour >= line.openHour && hour < line.closeHour;
};

export const formatHour = (hour: number, language: Language) => {
  const whole = Math.floor(hour);
  const minutes = Math.round((hour - whole) * 60);
  const date = new Date(Date.UTC(2000, 0, 1, whole, minutes));
  return new Intl.DateTimeFormat(language === "hi" ? "hi-IN" : "en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(date);
};
