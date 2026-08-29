/* Three blocks of the portal's Personal Information section that this
 * prototype did not model: the filing section, the representative assessee
 * question, and the bank details a refund is actually paid into.
 *
 * The last one is why the file exists. We tell a citizen at step 6 what they
 * are owed and never ask where it should go, which is the one thing without
 * which the money does not move.
 *
 * Field names, option labels and the numbered rules are the portal's own,
 * recorded from its screens. Our prose sits beside them rather than replacing
 * them, so a citizen who leaves here and opens the real form finds the same
 * box. Copy may carry `[[glossary-id]]` markers, rendered by `Prose`.
 *
 * The bank accounts are synthetic, like every other fixture here. */

import { BELATED_DATE_ISO, demoCase, DUE_DATE_ISO, type Language } from "./case-data";

/** One of the portal's filing-section options. */
export type FilingOption = {
  /** The section number as the portal prints it, e.g. "139(1)". */
  section: string;
  /** The portal's own description of it. */
  official: string;
  /** What it means in plain words. */
  plain: string;
  /** When this is the one that applies. */
  whenItApplies: string;
};

export type FilingGroup = {
  id: "voluntary" | "notice";
  /** The portal's toggle label, e.g. "Filed u/s". */
  label: string;
  /** Our plain heading for the group. */
  plain: string;
  options: FilingOption[];
};

export type BankAccount = {
  id: string;
  /** Fictional bank name. */
  bank: string;
  /** Masked account number, clearly synthetic. */
  masked: string;
  ifsc: string;
  /** Account type as the portal words it, e.g. "Savings". */
  kind: string;
  validated: boolean;
  /** Whether this is the account the refund is set to go to by default. */
  nominated: boolean;
};

/** The labels and read-backs around the two smaller blocks. */
export type PersonalSectionCopy = {
  /** The portal's question, in its own words. */
  representativeQuestion: string;
  /** The answer this case carries. */
  representativeAnswer: string;
  representativePlain: string;
  bankHeading: string;
  bankIntro: string;
  /** Restates the portal's prevalidation warning. */
  bankWarning: string;
  validatedBadge: string;
  notValidatedBadge: string;
  notValidatedNote: string;
  nominatedToggle: string;
  addAnother: string;
};

/* `official` and `label` stay in English in both halves: they are quotations of
   what is printed on the form, and the Hindi glossary keeps portal paths in
   Latin script for the same reason. Only our own prose is translated. */

const filingEn: FilingGroup[] = [
  {
    id: "voluntary",
    label: "Filed u/s",
    plain: "Why you are filing now",
    options: [
      {
        section: "139(1)",
        official: "Return filed on or before due date",
        plain:
          "The ordinary case. Your return reaches the department on or before the due date for the year.",
        whenItApplies:
          "This is the option while the due date has not passed. No late fee and no interest for lateness attach to a return filed under it.",
      },
      {
        section: "139(4)",
        official: "Belated- Return filed after due date",
        plain:
          "A belated return. The due date has gone and the return is still accepted, until the belated window closes.",
        whenItApplies:
          "It runs from the day after the due date to the close of the belated window. The [[section-234f|section 234F fee]] applies, and [[section-234a|section 234A interest]] runs on any tax still unpaid.",
      },
      {
        section: "139(5)",
        official: "Revised- Return revised after filing original return",
        plain:
          "A revised return. It replaces a return you have already filed, because something in it turned out to be wrong.",
        whenItApplies:
          "It applies when a return for the year already exists. Filing it needs the acknowledgement number of that original return.",
      },
      {
        section: "119(2)(b)",
        official: "After condonation of delay",
        plain:
          "A return filed after the department has excused the delay. The permission is applied for separately and granted before the return can go in.",
        whenItApplies:
          "It applies once the belated window has closed and an application for condonation of delay has been accepted, most often where a [[refund|refund]] is being claimed for an earlier year.",
      },
      {
        section: "139(8A)",
        official: "Updated Return",
        plain:
          "An updated return. It is the route left once both the ordinary and the belated windows have closed.",
        whenItApplies:
          "It applies after the belated window closes, and carries additional tax on top of the tax that was owed in the first place.",
      },
    ],
  },
  {
    id: "notice",
    label: "Filed in response to notice u/s",
    plain: "You are filing because the department asked you to",
    options: [
      {
        section: "139(9)",
        official: "Filed in response to notice u/s 139(9) to rectify the defect",
        plain:
          "The return you filed was read, found to disagree with the department's own records, and held as [[defective-return|defective]]. The corrected return goes back under this option.",
        whenItApplies:
          "Only after such a notice arrives, which is usually months after filing. Every check this prototype runs before you file exists so that you never reach this option.",
      },
      {
        section: "142(1)",
        official: "Filed in response to notice u/s 142(1)",
        plain:
          "The assessing officer has asked you for a return for a year, or for accounts and details to go with one.",
        whenItApplies:
          "It applies when a notice under 142(1) has been issued, whether or not you had already filed for that year.",
      },
      {
        section: "148",
        official:
          "Return filed against notice u/s 148 for assessment/reassessment",
        plain:
          "The department believes income for an earlier year escaped assessment, and has reopened that year.",
        whenItApplies:
          "It applies when a notice under 148 has been issued. The return that follows is for the year named in the notice, not for this one.",
      },
      {
        section: "153C",
        official: "Filed in response to notice u/s 153C",
        plain:
          "Something found during a search or requisition in someone else's case relates to you, so your years are being assessed as well.",
        whenItApplies:
          "It applies when the assessing officer has issued a 153C notice on the strength of that material.",
      },
    ],
  },
];

const filingHi: FilingGroup[] = [
  {
    id: "voluntary",
    label: "Filed u/s",
    plain: "आप अभी रिटर्न क्यों भर रही हैं",
    options: [
      {
        section: "139(1)",
        official: "Return filed on or before due date",
        plain:
          "सामान्य स्थिति। आपका रिटर्न उस वर्ष की नियत तारीख़ को या उससे पहले विभाग तक पहुँच जाता है।",
        whenItApplies:
          "जब तक नियत तारीख़ नहीं निकली, यही विकल्प रहता है। इसमें भरे रिटर्न पर न विलंब शुल्क लगता है, न देरी का ब्याज।",
      },
      {
        section: "139(4)",
        official: "Belated- Return filed after due date",
        plain:
          "विलंबित रिटर्न। नियत तारीख़ निकल चुकी है, फिर भी विलंबित अवधि बंद होने तक रिटर्न स्वीकार होता है।",
        whenItApplies:
          "यह नियत तारीख़ के अगले दिन से विलंबित अवधि बंद होने तक चलता है। इस पर [[section-234f|धारा 234F का शुल्क]] लगता है, और बकाया कर पर [[section-234a|धारा 234A का ब्याज]] चलता है।",
      },
      {
        section: "139(5)",
        official: "Revised- Return revised after filing original return",
        plain:
          "संशोधित रिटर्न। यह पहले भरे गए रिटर्न की जगह लेता है, क्योंकि उसमें कुछ गलत निकला।",
        whenItApplies:
          "यह तब लागू होता है जब उस वर्ष का रिटर्न पहले से भरा हो। इसे भरने के लिए पहले वाले रिटर्न की पावती संख्या चाहिए होती है।",
      },
      {
        section: "119(2)(b)",
        official: "After condonation of delay",
        plain:
          "देरी माफ़ होने के बाद भरा गया रिटर्न। इसकी अनुमति अलग से माँगी जाती है और रिटर्न जाने से पहले मिलती है।",
        whenItApplies:
          "यह विलंबित अवधि बंद होने के बाद, देरी की माफ़ी का आवेदन स्वीकार हो जाने पर लागू होता है, आम तौर पर तब जब किसी पुराने वर्ष का [[refund|रिफ़ंड]] माँगा जा रहा हो।",
      },
      {
        section: "139(8A)",
        official: "Updated Return",
        plain:
          "अद्यतन रिटर्न। सामान्य और विलंबित, दोनों अवधियाँ बंद हो जाने के बाद यही रास्ता बचता है।",
        whenItApplies:
          "यह विलंबित अवधि बंद होने के बाद लागू होता है, और इसमें जो कर पहले से बकाया था उस पर अतिरिक्त कर भी देना होता है।",
      },
    ],
  },
  {
    id: "notice",
    label: "Filed in response to notice u/s",
    plain: "आप इसलिए भर रही हैं क्योंकि विभाग ने कहा है",
    options: [
      {
        section: "139(9)",
        official: "Filed in response to notice u/s 139(9) to rectify the defect",
        plain:
          "आपका भरा रिटर्न पढ़ा गया, विभाग के अपने रिकॉर्ड से अलग पाया गया, और [[defective-return|त्रुटिपूर्ण]] मानकर रोक लिया गया। सुधरा हुआ रिटर्न इसी विकल्प से वापस जाता है।",
        whenItApplies:
          "यह तभी आता है जब ऐसा नोटिस आ चुका हो, जो आम तौर पर फाइल करने के महीनों बाद आता है। भरने से पहले यह प्रोटोटाइप जो जाँचें चलाता है, वे इसीलिए हैं कि आपको यह विकल्प कभी न चुनना पड़े।",
      },
      {
        section: "142(1)",
        official: "Filed in response to notice u/s 142(1)",
        plain:
          "निर्धारण अधिकारी ने आपसे किसी वर्ष का रिटर्न माँगा है, या उसके साथ खाते और विवरण माँगे हैं।",
        whenItApplies:
          "यह तब लागू होता है जब 142(1) के तहत नोटिस जारी हुआ हो, चाहे आपने उस वर्ष का रिटर्न भरा हो या नहीं।",
      },
      {
        section: "148",
        official:
          "Return filed against notice u/s 148 for assessment/reassessment",
        plain:
          "विभाग को लगता है कि किसी पुराने वर्ष की कोई आय निर्धारण से छूट गई, और उसने वह वर्ष दोबारा खोल दिया है।",
        whenItApplies:
          "यह तब लागू होता है जब 148 का नोटिस जारी हुआ हो। उसके बाद जो रिटर्न भरा जाता है वह नोटिस में लिखे वर्ष का होता है, इस वर्ष का नहीं।",
      },
      {
        section: "153C",
        official: "Filed in response to notice u/s 153C",
        plain:
          "किसी और के मामले में हुई तलाशी या अधियाचन में मिली कोई चीज़ आपसे जुड़ी है, इसलिए आपके वर्षों का भी निर्धारण हो रहा है।",
        whenItApplies:
          "यह तब लागू होता है जब उसी सामग्री के आधार पर निर्धारण अधिकारी ने 153C का नोटिस जारी किया हो।",
      },
    ],
  },
];

export const filingGroups: { en: FilingGroup[]; hi: FilingGroup[] } = {
  en: filingEn,
  hi: filingHi,
};

/* Synthetic, and meant to read that way: the same DEMO prefix the fixture PAN
   and TANs in case-data.ts use. One account is prevalidated and nominated, the
   other is not validated, so the interface has both states to explain. */
export const bankAccounts: BankAccount[] = [
  {
    id: "sampurna-savings",
    bank: "Sampurna Bank",
    masked: "DEMOXXXXXXXX4021",
    ifsc: "DEMO0004021",
    kind: "Savings",
    validated: true,
    nominated: true,
  },
  {
    id: "vasudha-current",
    bank: "Vasudha Bank",
    masked: "DEMOXXXXXXXX7783",
    ifsc: "DEMO0007783",
    kind: "Current",
    validated: false,
    nominated: false,
  },
];

/** The portal's three numbered bank rules, restated plainly. */
export const bankRules: { en: string[]; hi: string[] } = {
  en: [
    "Every bank account you held in India at any time during the year belongs here, apart from a [[dormant-account|dormant account]].",
    "Where more than one account is listed, the refund is credited to a single validated account, and an account of the type “Others” cannot be that account.",
    "At least one account has to be selected for the refund to be credited to.",
  ],
  hi: [
    "इस वर्ष के दौरान किसी भी समय भारत में रखा गया हर बैंक खाता यहाँ दर्ज होता है, [[dormant-account|निष्क्रिय खाते]] को छोड़कर।",
    "एक से ज़्यादा खाते दर्ज हों तो रिफ़ंड किसी एक सत्यापित खाते में आता है, और “Others” प्रकार का खाता वह खाता नहीं हो सकता।",
    "रिफ़ंड आने के लिए कम से कम एक खाता चुना हुआ होना ज़रूरी है।",
  ],
};

export const personalSection: {
  en: PersonalSectionCopy;
  hi: PersonalSectionCopy;
} = {
  en: {
    representativeQuestion:
      "Whether this return is being filed by a representative assessee?",
    representativeAnswer: "No",
    representativePlain:
      "This return is your own, so the answer is No. Yes belongs to a [[representative-assessee]] filing for someone who cannot file for themselves — a minor, a person of unsound mind, or someone who has died.",
    bankHeading: "Bank Details",
    bankIntro:
      "The accounts you held in India at any time during the year, and which of them your refund would reach.",
    bankWarning:
      "A refund is transferred only into a [[prevalidated-account|prevalidated account]] that has been nominated for it. An account the portal has matched against the bank's records carries the Validated mark.",
    validatedBadge: "Validated",
    notValidatedBadge: "Not validated",
    notValidatedNote:
      "The portal has not matched this account's name, PAN and number against the bank's own records, so a refund cannot be sent to it.",
    nominatedToggle: "Nominated for Refund",
    addAnother: "Add Another",
  },
  hi: {
    representativeQuestion:
      "Whether this return is being filed by a representative assessee?",
    representativeAnswer: "No",
    representativePlain:
      "यह रिटर्न आपका अपना है, इसलिए जवाब No है। Yes उस [[representative-assessee|प्रतिनिधि निर्धारिती]] के लिए है जो किसी ऐसे व्यक्ति के लिए भरता है जो खुद नहीं भर सकता — नाबालिग, अस्वस्थ मस्तिष्क का व्यक्ति, या जिसका निधन हो चुका है।",
    bankHeading: "Bank Details",
    bankIntro:
      "इस वर्ष के दौरान किसी भी समय भारत में रखे गए आपके खाते, और उनमें से वह खाता जिसमें आपका रिफ़ंड आएगा।",
    bankWarning:
      "रिफ़ंड सिर्फ़ उसी [[prevalidated-account|पहले से सत्यापित खाते]] में जाता है जिसे रिफ़ंड के लिए चुना गया हो। जिस खाते का मिलान पोर्टल बैंक के रिकॉर्ड से कर चुका है, उस पर Validated का चिह्न रहता है।",
    validatedBadge: "सत्यापित",
    notValidatedBadge: "सत्यापित नहीं",
    notValidatedNote:
      "इस खाते के नाम, पैन और संख्या का मिलान पोर्टल ने बैंक के अपने रिकॉर्ड से नहीं किया है, इसलिए इसमें रिफ़ंड नहीं भेजा जा सकता।",
    nominatedToggle: "रिफ़ंड के लिए चुना गया",
    addAnother: "एक और जोड़ें",
  },
};

/* --------------------------------------------------------- filing section */

const DAY_MS = 86_400_000;
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/* Same anchoring as buildFilingWindow in case-data.ts: the day is the Indian
   day, so a server in UTC and a browser anywhere land on the same section. */
const istMidnight = (now: Date) =>
  Math.floor((now.getTime() + IST_OFFSET_MS) / DAY_MS) * DAY_MS - IST_OFFSET_MS;

const parseIst = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d) - IST_OFFSET_MS;
};

/**
 * Which filing section applies on a given date, from the statutory dates the
 * prototype already uses. Pure and date-driven, not hard-coded.
 */
export function filingSectionOn(today: Date): {
  section: string;
  /** Why that one, in one sentence, keyed for the caller to translate. */
  reason: "onTime" | "belated" | "belatedClosed";
} {
  const day = istMidnight(today);

  if (day <= parseIst(DUE_DATE_ISO)) {
    return { section: "139(1)", reason: "onTime" };
  }

  if (day <= parseIst(BELATED_DATE_ISO)) {
    return { section: "139(4)", reason: "belated" };
  }

  return { section: "139(8A)", reason: "belatedClosed" };
}

/* ------------------------------------------ profile and contact details */

/* The two blocks the portal puts at the top of Personal Information, above
   everything already in this file: Profile — the name, PAN, date of birth and
   Aadhaar it holds against you — and Contact, the mobile number, email address
   and postal address it would write to.
 *
 * On the portal these are a page of their own: Profile's Edit leaves the return
 * for My Profile, Contact's Edit opens a separate Contact screen with its own
 * Back and Save. That is a different flow, and it is kept here rather than
 * dropped, because a citizen who has just been told a refund is coming has to
 * be able to see the address and the number it will be announced to without
 * losing the return they are in the middle of.
 *
 * Everything is prefilled. Nothing here was typed by the citizen: the
 * department already holds it, and the honest thing is to show what it holds
 * and let them correct it, rather than make them retype what is already known.
 *
 * Field names are the portal's own, recorded from its screens, and stay in
 * English in both halves for the same reason the filing sections do. */

export type PersonalFieldKind = "text" | "tel" | "email" | "date";

export type PersonalField = {
  id: string;
  /** The portal's own label for the box. */
  label: string;
  /** The portal marks these with an asterisk. */
  required: boolean;
  kind: PersonalFieldKind;
  /** What the department already holds, before the citizen touches anything. */
  prefill: string;
  /** Held from the PAN and Aadhaar record and not editable here. See
      `lockedNote` for why this prototype in particular will not take one. */
  locked?: boolean;
  autoComplete?: string;
  maxLength?: number;
  /** Digits only, for a number the portal will not take letters in. */
  numeric?: boolean;
};

export type PersonalFieldGroup = {
  id: string;
  /** The portal's heading over the group, where it prints one. */
  heading?: string;
  fields: PersonalField[];
};

/** Which of the citizen's blocks a field belongs to. */
export type PersonalBlockId = "profile" | "contact";

/* The synthetic person this prototype is built around. `.invalid` is a
   reserved domain that can never resolve, and the mobile number is outside the
   ranges Indian operators issue, so neither can reach anyone real. */

const profileGroups: PersonalFieldGroup[] = [
  {
    id: "profile-name",
    fields: [
      {
        id: "first-name",
        label: "First Name",
        required: true,
        kind: "text",
        prefill: "Ananya",
        autoComplete: "given-name",
        maxLength: 40,
      },
      {
        id: "middle-name",
        label: "Middle Name",
        required: false,
        kind: "text",
        prefill: "",
        autoComplete: "additional-name",
        maxLength: 40,
      },
      {
        id: "last-name",
        label: "Last Name",
        required: true,
        kind: "text",
        prefill: "Rao",
        autoComplete: "family-name",
        maxLength: 40,
      },
      {
        id: "pan",
        label: "PAN",
        required: true,
        kind: "text",
        prefill: demoCase.maskedPan,
        locked: true,
      },
      {
        id: "date-of-birth",
        label: "Date of Birth",
        required: true,
        kind: "date",
        prefill: "1994-03-12",
        autoComplete: "bday",
      },
      {
        id: "aadhaar",
        label: "Aadhaar Number",
        required: true,
        kind: "text",
        prefill: "XXXX XXXX 4417",
        locked: true,
      },
    ],
  },
];

/* The portal's own address boxes, in its own order. Used twice: once for the
   primary address and once, with `secondary-` in front of every id, for the
   address that is only asked for when the two differ. */
const addressFields = (prefix: string, prefill: string[]): PersonalField[] =>
  [
    { id: "flat", label: "Flat/ Door/ Block No.", required: true, autoComplete: "address-line1" },
    { id: "premises", label: "Name of Premises / Building / Village", required: false, autoComplete: "address-line2" },
    { id: "road", label: "Road/ Street/ Post Office", required: false, autoComplete: "address-line3" },
    { id: "locality", label: "Area/ Locality", required: true, autoComplete: "address-level3" },
    { id: "town", label: "Town/ City/ District", required: true, autoComplete: "address-level2" },
    { id: "state", label: "State", required: true, autoComplete: "address-level1" },
    { id: "country", label: "Country", required: true, autoComplete: "country-name" },
    { id: "pin", label: "Pin code", required: true, autoComplete: "postal-code", numeric: true, maxLength: 6 },
  ].map((field, index) => ({
    ...field,
    id: `${prefix}${field.id}`,
    kind: "text" as const,
    prefill: prefill[index] ?? "",
  }));

const PRIMARY_ADDRESS = [
  "Flat 4B",
  "Ashoka Residency",
  "Nehru Marg",
  "Vidyadhar Nagar",
  "Jaipur",
  "Rajasthan",
  "India",
  "302039",
];

/** The portal's Yes/No question between the two addresses. Yes in the fixture. */
export const SAME_ADDRESS_FIELD = "secondary-same-as-primary";

const contactGroups: PersonalFieldGroup[] = [
  {
    id: "contact-mobile",
    heading: "Primary Mobile No. of the taxpayer",
    fields: [
      {
        id: "mobile-country",
        label: "Country code",
        required: true,
        kind: "tel",
        prefill: "91",
        numeric: true,
        maxLength: 3,
      },
      {
        id: "mobile",
        label: "Mobile No",
        required: true,
        kind: "tel",
        prefill: "9000012345",
        autoComplete: "tel-national",
        numeric: true,
        maxLength: 10,
      },
    ],
  },
  {
    id: "contact-mobile-2",
    heading: "Secondary Mobile No.",
    fields: [
      {
        id: "mobile-2-country",
        label: "Country code",
        required: false,
        kind: "tel",
        prefill: "",
        numeric: true,
        maxLength: 3,
      },
      {
        id: "mobile-2",
        label: "Mobile No",
        required: false,
        kind: "tel",
        prefill: "",
        numeric: true,
        maxLength: 10,
      },
    ],
  },
  {
    id: "contact-email",
    fields: [
      {
        id: "email",
        label: "Primary Email ID of the taxpayer",
        required: true,
        kind: "email",
        prefill: "ananya.rao@demo.invalid",
        autoComplete: "email",
      },
      {
        id: "email-2",
        label: "Secondary Email ID",
        required: false,
        kind: "email",
        prefill: "",
      },
    ],
  },
  {
    id: "contact-address",
    heading: "Primary Address",
    fields: addressFields("", PRIMARY_ADDRESS),
  },
  {
    id: "contact-address-2",
    heading: "Secondary Address",
    fields: addressFields("secondary-", []),
  },
];

export const personalBlocks: Record<PersonalBlockId, PersonalFieldGroup[]> = {
  profile: profileGroups,
  contact: contactGroups,
};

/** Every field in a block, flattened, in the order the portal prints them. */
export const blockFields = (block: PersonalBlockId): PersonalField[] =>
  personalBlocks[block].flatMap((group) => group.fields);

/** What a field currently holds: the citizen's own answer, or the prefill. */
export const fieldValue = (
  field: PersonalField,
  details: Record<string, string>,
): string => (field.id in details ? details[field.id] : field.prefill);

/** Whether they have moved a field off what the department holds. */
export const isChanged = (
  field: PersonalField,
  details: Record<string, string>,
): boolean => field.id in details && details[field.id] !== field.prefill;

/** Whether the secondary address is being asked for at all. */
export const secondaryAddressWanted = (details: Record<string, string>) =>
  details[SAME_ADDRESS_FIELD] === "No";

/** The address as the portal prints it back on the read-only card: one line. */
export const addressLine = (
  prefix: string,
  details: Record<string, string>,
): string =>
  addressFields(prefix, prefix === "" ? PRIMARY_ADDRESS : [])
    .map((field) => fieldValue(field, details).trim())
    .filter(Boolean)
    .join(", ");

/* A date of birth is held as an ISO day so the input can be a real date
   control, and printed the way the portal prints it. */
export const formatDob = (iso: string): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  return match ? `${match[3]}/${match[2]}/${match[1]}` : iso;
};

/** Copy for the two prefilled blocks, in the citizen's language. */
export type PrefilledCopy = {
  /** The portal's own name for the block. */
  portalName: string;
  /** Why PAN and Aadhaar do not take a change here. */
  lockedNote?: string;
  /** The portal's question between the two addresses. */
  sameAddressQuestion?: string;
  /** What a saved change does and does not do. */
  savedNote: string;
  /** Sits under the block when the citizen has changed something. */
  changedNote: string;
};

export const prefilledCopy: Record<
  Language,
  Record<PersonalBlockId, PrefilledCopy>
> = {
  en: {
    profile: {
      portalName: "Profile",
      lockedNote:
        "Your PAN and your Aadhaar number are the record this whole page is filled from, so the return does not take a change to either. A wrong name or date of birth is corrected at the source too — through a PAN correction — and this block is where you would find out that it is wrong. This prototype also never asks anyone to type a real PAN or Aadhaar number, which is why both are shown and locked rather than left open.",
      savedNote:
        "Kept on this device for the demo. Nothing was sent to the Income Tax Department, and your real PAN record is untouched.",
      changedNote:
        "You have changed something the department holds. In a real filing the return would carry your version and the department's record would still say what it said.",
    },
    contact: {
      portalName: "Contact",
      sameAddressQuestion: "Is the secondary address same as primary address?",
      savedNote:
        "Kept on this device for the demo. Nothing was sent to the Income Tax Department.",
      changedNote:
        "You have changed something the department holds. In a real filing this is the number and address the acknowledgement, the refund message and any notice would go to.",
    },
  },
  hi: {
    profile: {
      portalName: "Profile",
      lockedNote:
        "आपका पैन और आधार नंबर ही वह रिकॉर्ड है जिससे यह पूरा पन्ना भरा गया है, इसलिए रिटर्न इनमें बदलाव नहीं लेता। नाम या जन्मतिथि गलत हो तो वह भी स्रोत पर ही सुधरती है — पैन सुधार के ज़रिए — और यह खंड वही जगह है जहाँ आपको पता चलेगा कि वह गलत है। यह प्रोटोटाइप किसी से असली पैन या आधार नंबर टाइप करने को कभी नहीं कहता, इसलिए दोनों दिखाए तो गए हैं पर खुले नहीं छोड़े गए।",
      savedNote:
        "डेमो के लिए इसी डिवाइस पर रखा गया। आयकर विभाग को कुछ नहीं भेजा गया, और आपका असली पैन रिकॉर्ड ज्यों का त्यों है।",
      changedNote:
        "आपने वह बदला है जो विभाग के पास दर्ज है। असली फाइलिंग में रिटर्न आपका बताया हुआ ले जाता, और विभाग का रिकॉर्ड वही रहता जो था।",
    },
    contact: {
      portalName: "Contact",
      sameAddressQuestion: "Is the secondary address same as primary address?",
      savedNote:
        "डेमो के लिए इसी डिवाइस पर रखा गया। आयकर विभाग को कुछ नहीं भेजा गया।",
      changedNote:
        "आपने वह बदला है जो विभाग के पास दर्ज है। असली फाइलिंग में पावती, रिफ़ंड का संदेश और कोई भी नोटिस इसी नंबर और पते पर जाता।",
    },
  },
};
