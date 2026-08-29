/* The Total Deductions and Tax Paid sections of ITR-1, in the shape the portal
 * actually prints them.
 *
 * Two things are being carried across. First, that Total Deductions is not
 * skipped just because every figure in it is ₹0 — under the new regime the
 * zeroes are the lesson, and each one is zero for a different reason. Second,
 * that Tax Paid is five schedules, not one number, and four of them stay empty
 * for a salaried filer without anyone ever saying what would fill them.
 *
 * Figures come from the synthetic fixture in `case-data.ts`. Amounts are
 * pre-formatted here in the same Indian style `formatRupees` produces, so the
 * table can be rendered without a currency pass.
 *
 * This is a hackathon prototype, not tax advice. */

export type DeductionRow = {
  /** Section as the portal prints it, e.g. "80CCD(2)". */
  section: string;
  /** The portal's own description. */
  official: string;
  /** What it is in plain words. */
  plain: string;
  /** Why it is zero for this taxpayer, or what would make it non-zero. */
  note: string;
  /** Whether the new regime allows it at all. */
  allowedUnderNewRegime: boolean;
  amount: number;
};

export type TaxPaidSchedule = {
  id: "tds1" | "tds2" | "tds3" | "tcs" | "advance";
  /** The portal's schedule name. */
  official: string;
  /** The bracketed source line, e.g. "As per Form 16 issued by Employer(s)". */
  source: string;
  /** Our plain one-line description. */
  plain: string;
  /** Column headings, in the portal's order. */
  columns: string[];
  /** Rows of already-formatted display strings, aligned to `columns`. */
  rows: string[][];
  /** Shown in place of rows when there are none. */
  emptyNote: string;
};

/* ------------------------------------------------------ total deductions */

const enDeductions: DeductionRow[] = [
  {
    section: "80CCD(2)",
    official:
      "80CCD(2) - Contribution to pension scheme of Central Government by employer. Rows: Amount Of Investment; Amount eligible for deduction under section 80CCD(2).",
    plain:
      "What your employer pays into your pension scheme account. Your own contribution belongs to a different section.",
    note: "The heading names the Central Government, but the deduction covers an employer's contribution generally, and it is one of the few that survives in the [[new-tax-regime]]. The demo Form 16 from Kalpavriksha Software Pvt Ltd carries no such contribution, so the line stands at ₹0.",
    allowedUnderNewRegime: true,
    amount: 0,
  },
  {
    section: "80CCH",
    official:
      "80CCH - Contribution to Agnipath Scheme. Note: 80CCH is not allowed for employment category other than 'Central Government'.",
    plain: "A deduction for what an Agniveer contributes to the Agnipath Scheme.",
    note: "Zero because of employment category, not because of the regime. The nature of employment in this return is private sector salaried, and the portal's own note closes the line for every category other than Central Government.",
    allowedUnderNewRegime: true,
    amount: 0,
  },
  {
    section: "Any other deduction",
    official:
      "Any other deduction. Rows: Amount of Investment; Amount eligible for Any other deduction.",
    plain:
      "The single row standing in for the rest of Chapter VI-A — section 80C, section 80D, section 80TTA and the others.",
    note: "Zero because of the regime. The demo Form 16 carries ₹1,50,000 under section 80C and ₹25,000 under section 80D; under the [[new-tax-regime]] both count as ₹0, and the ₹75,000 standard deduction stands in their place.",
    allowedUnderNewRegime: false,
    amount: 0,
  },
  {
    section: "C1",
    official: "C1. Total deductions. Row: Amount of Deductions claimed.",
    plain: "The three rows above, added up.",
    note: "₹0, which is the ordinary result under the new regime. Total income therefore equals gross total income, with nothing subtracted at this step.",
    allowedUnderNewRegime: true,
    amount: 0,
  },
];

const hiDeductions: DeductionRow[] = [
  {
    section: "80CCD(2)",
    official:
      "80CCD(2) - Contribution to pension scheme of Central Government by employer. Rows: Amount Of Investment; Amount eligible for deduction under section 80CCD(2).",
    plain:
      "आपके पेंशन खाते में नियोक्ता जो जमा करता है, वह। आपका अपना योगदान अलग धारा में आता है।",
    note: "शीर्षक में केंद्र सरकार लिखा है, पर कटौती आम तौर पर नियोक्ता के योगदान पर मिलती है, और [[new-tax-regime]] में बची गिनी-चुनी कटौतियों में से यह एक है। Kalpavriksha Software Pvt Ltd के डेमो Form 16 में ऐसा कोई योगदान नहीं है, इसलिए यह पंक्ति ₹0 पर रहती है।",
    allowedUnderNewRegime: true,
    amount: 0,
  },
  {
    section: "80CCH",
    official:
      "80CCH - Contribution to Agnipath Scheme. Note: 80CCH is not allowed for employment category other than 'Central Government'.",
    plain: "अग्निपथ योजना में अग्निवीर के योगदान पर मिलने वाली कटौती।",
    note: "यह शून्य कर व्यवस्था की वजह से नहीं, रोज़गार श्रेणी की वजह से है। इस रिटर्न में रोज़गार निजी क्षेत्र का वेतनभोगी है, और पोर्टल की अपनी टिप्पणी केंद्र सरकार के अलावा हर श्रेणी के लिए यह पंक्ति बंद कर देती है।",
    allowedUnderNewRegime: true,
    amount: 0,
  },
  {
    section: "Any other deduction",
    official:
      "Any other deduction. Rows: Amount of Investment; Amount eligible for Any other deduction.",
    plain:
      "बाकी पूरे अध्याय VI-A के लिए रखी गई एक ही पंक्ति — धारा 80C, धारा 80D, धारा 80TTA और बाकी सब।",
    note: "यह शून्य कर व्यवस्था की वजह से है। डेमो Form 16 में धारा 80C के ₹1,50,000 और धारा 80D के ₹25,000 दर्ज हैं; [[new-tax-regime]] में दोनों ₹0 गिने जाते हैं, और उनकी जगह ₹75,000 की मानक कटौती लेती है।",
    allowedUnderNewRegime: false,
    amount: 0,
  },
  {
    section: "C1",
    official: "C1. Total deductions. Row: Amount of Deductions claimed.",
    plain: "ऊपर की तीनों पंक्तियों का जोड़।",
    note: "₹0, जो नई कर व्यवस्था में सामान्य नतीजा है। इसलिए कुल आय वही रहती है जो सकल कुल आय है, इस चरण पर कुछ घटता नहीं।",
    allowedUnderNewRegime: true,
    amount: 0,
  },
];

/* ------------------------------------------------------------- tax paid */

/* Col 3 of TDS1 is income chargeable under "Salaries", not gross salary:
   ₹13,20,000 less the ₹75,000 standard deduction the new regime allows. */
const SALARY_CHARGEABLE = "₹12,45,000";

const enSchedules: TaxPaidSchedule[] = [
  {
    id: "tds1",
    official: "Schedule TDS1 - Details of Tax Deducted at Source from Salary",
    source: "As per Form 16 issued by Employer(s)",
    plain:
      "The [[tds|tax your employer deducted]] from your salary through the year and paid to the department against your PAN.",
    columns: [
      "Tax Deduction Account Number (TAN) of Deductor (Col 1)",
      "Name of Deductor [Col (2)]",
      "Income chargeable under Salaries (Col 3)",
      "Total tax deducted (Col 4)",
    ],
    rows: [
      [
        "DEMO98765D",
        "Kalpavriksha Software Pvt Ltd",
        SALARY_CHARGEABLE,
        "₹85,000",
      ],
    ],
    emptyNote:
      "Nothing appears here when no employer deducted tax from your salary during the year — a salary below the taxable limit, or no salary at all.",
  },
  {
    id: "tds2",
    official:
      "Schedule TDS2 - Details of Tax Deducted at Source from Income Other than Salary",
    source: "As per Form 16A issued by Deductor(s)",
    plain:
      "Tax deducted by someone other than your employer, each line backed by a [[form-16a]]. The Trilok Bank fixed deposit — ₹31,500 with ₹3,150 deducted — is absent because that entry was disputed as not yours: its income stays out of the return, and a credit is not claimed on income that was not reported.",
    columns: [
      "Tax Deduction Account Number (TAN) of Deductor (Col 1)",
      "Name of Deductor [Col (2)]",
      "Gross receipt which is subject to tax deduction (Col 3)",
      "Total tax deducted (Col 4)",
    ],
    rows: [
      ["DEMO12345A", "Sampurna Bank", "₹48,000", "₹4,800"],
      ["DEMO67890B", "Meghdoot Industries Ltd", "₹6,200", "₹620"],
    ],
    emptyNote:
      "Nothing appears here when no bank, company or other payer deducted tax from you. Savings interest often leaves no line at all: the ₹12,400 from Sampurna Bank had no tax deducted, so there is no Form 16A behind it and no credit to claim.",
  },
  {
    id: "tds3",
    official: "Sch TDS 3 Details of Tax Deducted at Source",
    source: "As per Form 16C furnished by Payer(s)",
    plain:
      "Tax a tenant deducted out of the rent paid to you, under section 194-IB.",
    columns: [
      "PAN of the Tenant [Col (1)]",
      "Name of the Tenant [Col (2)]",
      "Gross receipt which is subject to tax deduction (Col 3)",
      "Total tax deducted (Col 4)",
    ],
    rows: [],
    emptyNote:
      "Empty here because this return reports no rent. A line appears when you let out property and the tenant pays more than ₹50,000 a month: the tenant deducts tax under section 194-IB and hands you a Form 16C, and that certificate is what this schedule holds.",
  },
  {
    id: "tcs",
    official: "Sch TCS Details of Tax Collected at Source",
    source: "As per Form 27D issued by the Collector(s)",
    plain:
      "[[tcs|Tax collected]] on top of a price by a seller, rather than deducted out of a payment made to you.",
    columns: [
      "Tax Deduction and Tax Collection Account Number of the Collector (Col 1)",
      "Name of Collector [Col (2)]",
      "Gross payment which is subject to tax collection (Col 3)",
      "Total tax collected (Col 4)",
    ],
    rows: [],
    emptyNote:
      "Empty here because nothing in this year's records was collected at source. A line appears after money sent abroad, an overseas tour package, or a vehicle bought above ₹10,00,000 — the seller collects the tax and issues a Form 27D, and the collection counts as a credit like any other.",
  },
  {
    id: "advance",
    official: "Advance tax and Self-Assessment tax payments",
    source: "As per the challan for each payment",
    plain:
      "[[advance-tax|Advance tax]] and self-assessment tax — tax you paid yourself, rather than tax someone deducted before paying you.",
    columns: [
      "BSR Code (Col 1)",
      "Date of Deposit (Col 2)",
      "Serial Number of Challan (Col 3)",
      "Tax paid (Col 4)",
    ],
    rows: [],
    emptyNote:
      "Empty here because the whole bill was met by deduction at source: ₹90,420 was already deducted, which is more than the tax finally due, so the return ends in a refund rather than a payment. A salaried filer reaches this schedule when the tax left after TDS comes to more than ₹10,000, and that amount falls due by 31 March. Paying it means leaving the return for e-File → e-Pay Tax, downloading the [[challan]] as a PDF, and typing its BSR code, date of deposit and serial number back in by hand.",
  },
];

const hiSchedules: TaxPaidSchedule[] = [
  {
    id: "tds1",
    official: "Schedule TDS1 - Details of Tax Deducted at Source from Salary",
    source: "As per Form 16 issued by Employer(s)",
    plain:
      "साल भर आपके वेतन में से आपके नियोक्ता ने जो [[tds|कर काटा]] और आपके पैन पर विभाग को जमा किया।",
    columns: [
      "कटौतीकर्ता की कर कटौती खाता संख्या, TAN (Col 1)",
      "कटौतीकर्ता का नाम [Col (2)]",
      "वेतन के अंतर्गत कर योग्य आय (Col 3)",
      "कुल काटा गया कर (Col 4)",
    ],
    rows: [
      [
        "DEMO98765D",
        "Kalpavriksha Software Pvt Ltd",
        SALARY_CHARGEABLE,
        "₹85,000",
      ],
    ],
    emptyNote:
      "जब साल भर किसी नियोक्ता ने वेतन से कर नहीं काटा — वेतन कर योग्य सीमा से नीचे रहा, या वेतन रहा ही नहीं — तब यहाँ कुछ नहीं आता।",
  },
  {
    id: "tds2",
    official:
      "Schedule TDS2 - Details of Tax Deducted at Source from Income Other than Salary",
    source: "As per Form 16A issued by Deductor(s)",
    plain:
      "आपके नियोक्ता के अलावा किसी और ने जो कर काटा, हर पंक्ति के पीछे एक [[form-16a]]। Trilok Bank की सावधि जमा — ₹31,500, जिस पर ₹3,150 कटे — यहाँ नहीं है, क्योंकि वह प्रविष्टि आपकी नहीं मानी गई: उसकी आय रिटर्न से बाहर रहती है, और बिना दर्ज की गई आय पर क्रेडिट नहीं माँगा जाता।",
    columns: [
      "कटौतीकर्ता की कर कटौती खाता संख्या, TAN (Col 1)",
      "कटौतीकर्ता का नाम [Col (2)]",
      "जिस सकल प्राप्ति पर कर कटा (Col 3)",
      "कुल काटा गया कर (Col 4)",
    ],
    rows: [
      ["DEMO12345A", "Sampurna Bank", "₹48,000", "₹4,800"],
      ["DEMO67890B", "Meghdoot Industries Ltd", "₹6,200", "₹620"],
    ],
    emptyNote:
      "जब किसी बैंक, कंपनी या दूसरे भुगतानकर्ता ने आपसे कर नहीं काटा, तब यहाँ कुछ नहीं आता। बचत खाते के ब्याज पर अक्सर कोई पंक्ति बनती ही नहीं: Sampurna Bank के ₹12,400 पर कोई कर नहीं कटा, इसलिए न उसके पीछे Form 16A है, न माँगने को कोई क्रेडिट।",
  },
  {
    id: "tds3",
    official: "Sch TDS 3 Details of Tax Deducted at Source",
    source: "As per Form 16C furnished by Payer(s)",
    plain:
      "धारा 194-IB के तहत किरायेदार ने आपको दिए किराए में से जो कर काटा।",
    columns: [
      "किरायेदार का पैन [Col (1)]",
      "किरायेदार का नाम [Col (2)]",
      "जिस सकल प्राप्ति पर कर कटा (Col 3)",
      "कुल काटा गया कर (Col 4)",
    ],
    rows: [],
    emptyNote:
      "यहाँ खाली है क्योंकि इस रिटर्न में कोई किराया नहीं है। पंक्ति तब बनती है जब आप संपत्ति किराए पर देते हैं और किरायेदार महीने के ₹50,000 से ज़्यादा चुकाता है: तब वह धारा 194-IB के तहत कर काटकर आपको Form 16C देता है, और यही प्रमाणपत्र इस अनुसूची में आता है।",
  },
  {
    id: "tcs",
    official: "Sch TCS Details of Tax Collected at Source",
    source: "As per Form 27D issued by the Collector(s)",
    plain:
      "[[tcs|स्रोत पर वसूला गया कर]] — आपके भुगतान में से काटा गया नहीं, कीमत के ऊपर विक्रेता का जोड़ा हुआ।",
    columns: [
      "संग्रहकर्ता की कर कटौती एवं कर संग्रहण खाता संख्या (Col 1)",
      "संग्रहकर्ता का नाम [Col (2)]",
      "जिस सकल भुगतान पर कर वसूला गया (Col 3)",
      "कुल वसूला गया कर (Col 4)",
    ],
    rows: [],
    emptyNote:
      "यहाँ खाली है क्योंकि इस साल के रिकॉर्ड में स्रोत पर कुछ वसूला नहीं गया। पंक्ति तब बनती है जब विदेश पैसा भेजा जाए, विदेश यात्रा का पैकेज लिया जाए, या ₹10,00,000 से ऊपर का वाहन खरीदा जाए — विक्रेता कर वसूलकर Form 27D देता है, और वह वसूली भी बाकी क्रेडिट जैसी ही गिनी जाती है।",
  },
  {
    id: "advance",
    official: "Advance tax and Self-Assessment tax payments",
    source: "As per the challan for each payment",
    plain:
      "[[advance-tax|अग्रिम कर]] और स्व-निर्धारण कर — वह कर जो आपने खुद चुकाया, न कि जो किसी ने भुगतान से पहले काट लिया।",
    columns: [
      "BSR कोड (Col 1)",
      "जमा की तारीख़ (Col 2)",
      "चालान की क्रम संख्या (Col 3)",
      "चुकाया गया कर (Col 4)",
    ],
    rows: [],
    emptyNote:
      "यहाँ खाली है क्योंकि पूरा बिल स्रोत पर कटे कर से ही चुक गया: ₹90,420 पहले ही कट चुका है, जो अंतिम कर से ज़्यादा है, इसलिए रिटर्न भुगतान पर नहीं, रिफ़ंड पर खत्म होता है। वेतनभोगी इस अनुसूची तक तब पहुँचता है जब TDS के बाद बचा कर ₹10,000 से ज़्यादा हो, और वह रकम 31 मार्च तक देय होती है। चुकाने के लिए रिटर्न छोड़कर e-File → e-Pay Tax पर जाना पड़ता है, [[challan]] PDF में डाउनलोड करना पड़ता है, और उसका BSR कोड, जमा की तारीख़ और क्रम संख्या हाथ से वापस भरनी पड़ती है।",
  },
];

export const deductions: { en: DeductionRow[]; hi: DeductionRow[] } = {
  en: enDeductions,
  hi: hiDeductions,
};

export const taxPaidSchedules: {
  en: TaxPaidSchedule[];
  hi: TaxPaidSchedule[];
} = {
  en: enSchedules,
  hi: hiSchedules,
};
