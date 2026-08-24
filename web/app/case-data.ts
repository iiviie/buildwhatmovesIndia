export type Language = "en" | "hi";

export type OwnershipAnswer = "yes" | "no" | "unsure" | null;

export type DocumentKind = "notice" | "form26as" | "return";

export type DemoDocument = {
  kind: DocumentKind;
  name: string;
  size: string;
  source: string;
  loaded: boolean;
};

export type JourneyStatus =
  | "draft"
  | "queued"
  | "submitting"
  | "submitted"
  | "disputed";

export type DraftState = {
  step: number;
  language: Language;
  lowData: boolean;
  documents: DemoDocument[];
  ownership: OwnershipAnswer;
  declaration: boolean;
  status: JourneyStatus;
  reference: string | null;
  submittedAt: string | null;
};

export const DRAFT_KEY = "sahi-return-demo-draft-v1";

export const DEMO_REFERENCE = "DEMO-1399-2026-0042";

export const demoDocuments: DemoDocument[] = [
  {
    kind: "notice",
    name: "Demo-defective-notice-1399.pdf",
    size: "184 KB",
    source: "Synthetic e-Proceedings notice",
    loaded: true,
  },
  {
    kind: "form26as",
    name: "Demo-Form-26AS-AY-2026-27.pdf",
    size: "226 KB",
    source: "Synthetic Form 26AS",
    loaded: true,
  },
  {
    kind: "return",
    name: "Demo-filed-ITR-1.json",
    size: "42 KB",
    source: "Synthetic filed return",
    loaded: true,
  },
];

export const emptyDocuments: DemoDocument[] = demoDocuments.map((document) => ({
  ...document,
  loaded: false,
}));

export const defaultDraft: DraftState = {
  step: 0,
  language: "en",
  lowData: false,
  documents: emptyDocuments,
  ownership: null,
  declaration: false,
  status: "draft",
  reference: null,
  submittedAt: null,
};

export const demoCase = {
  taxpayer: "Ananya Rao",
  maskedPan: "DEMOA1234X",
  assessmentYear: "2026-27",
  noticeSection: "139(9)",
  noticeDate: "14 August 2026",
  responseDue: "29 August 2026",
  deductor: "Sampurna Bank",
  interestIncome: 48_000,
  bankTds: 4_800,
  originalTotalIncome: 1_352_000,
  correctedTotalIncome: 1_400_000,
  originalTax: 86_112,
  correctedTax: 93_600,
  totalTds: 90_912,
  balanceTax: 2_688,
  calculationVersion: "DEMO-AY26-27-v1",
} as const;

export const formatRupees = (amount: number, language: Language) =>
  new Intl.NumberFormat(language === "hi" ? "hi-IN" : "en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export const hasAllDocuments = (documents: DemoDocument[]) =>
  demoDocuments.every((required) =>
    documents.some(
      (document) => document.kind === required.kind && document.loaded,
    ),
  );

export const validateFile = (file: File) => {
  const allowedTypes = [
    "application/pdf",
    "application/json",
    "text/plain",
  ];

  if (!allowedTypes.includes(file.type)) {
    return "type" as const;
  }

  if (file.size > 5 * 1024 * 1024) {
    return "size" as const;
  }

  return null;
};

export const nextIncompleteStep = (draft: DraftState) => {
  if (!hasAllDocuments(draft.documents)) return 2;
  if (!draft.ownership) return 4;
  if (draft.ownership === "yes" && !draft.declaration) return 5;
  return draft.step;
};

export const createDownload = (draft: DraftState, language: Language) => {
  const lines =
    language === "hi"
      ? [
          "सही रिटर्न स्वतंत्र हैकाथॉन प्रोटोटाइप",
          "केवल काल्पनिक डेटा। कोई सरकारी लेन-देन नहीं हुआ।",
          `डेमो संदर्भ: ${draft.reference ?? "बनाया नहीं गया"}`,
          `स्थिति: ${draft.status === "submitted" ? "सिमुलेटेड जवाब पूरा" : "जमा नहीं किया गया"}`,
          `निर्धारण वर्ष: ${demoCase.assessmentYear}`,
          `नोटिस: धारा ${demoCase.noticeSection}`,
          `समय: ${draft.submittedAt ?? "लागू नहीं"}`,
          "अगला कदम: असली नोटिस और गणना को आधिकारिक ई-फाइलिंग पोर्टल या योग्य कर विशेषज्ञ से जाँचें।",
        ]
      : [
          "Sahi Return independent hackathon prototype",
          "Synthetic data only. No government transaction occurred.",
          `Demo reference: ${draft.reference ?? "Not created"}`,
          `Status: ${draft.status === "submitted" ? "Simulated response complete" : "Not submitted"}`,
          `Assessment year: ${demoCase.assessmentYear}`,
          `Notice: Section ${demoCase.noticeSection}`,
          `Time: ${draft.submittedAt ?? "Not applicable"}`,
          "Next step: Check any real notice and calculation on the official e-Filing portal or with a qualified tax professional.",
        ];

  return lines.join("\n");
};
