/* The portal names three documents on the way in — Form 16, Form 26AS and AIS,
   with TIS beside AIS — and says what none of them is. This file is the
   explainer panel: what each one is, where it comes from, what this return
   uses it for, and how they check each other. The cross-checks are the reason
   there is more than one document. */

export type DocumentGuide = {
  id: "form-16" | "form-26as" | "ais" | "tis";
  /** Display name, e.g. "Form 26AS". */
  name: string;
  /** The one-line version, for a heading. */
  oneLine: string;
  /** Who produces it and when it becomes available. */
  from: string;
  /** How to get it, with the real navigation path where there is one. */
  where: string;
  /** What this return uses it for. 1-3 short bullets. */
  usedFor: string[];
  /** Whether this prototype needs it from the citizen, or only explains it. */
  required: boolean;
};

/** Why there are three, and what disagreeing with each other means. */
export type CrossCheck = {
  /** e.g. "Form 16 against Form 26AS". */
  pair: string;
  /** What should match. */
  shouldMatch: string;
  /** What it means when it does not, and what follows. */
  ifItDoesNot: string;
};

const en: DocumentGuide[] = [
  {
    id: "form-16",
    name: "Form 16",
    oneLine: "Your employer's record of your salary and the tax it deducted.",
    from: "Your employer issues it once a year, usually by mid-June. Part A is the quarterly record of the tax deducted from your salary and paid to the department. Part B is the salary breakdown: gross salary, perquisites, exempt allowances, deductions, and the income chargeable under “Salaries”.",
    where: "Your employer gives it to you. This is the one document this prototype asks you for, as a PDF or a photo.",
    usedFor: [
      "Gross salary, and the parts of it that are exempt",
      "The tax your employer already deducted",
      "The income chargeable under “Salaries”",
    ],
    required: true,
  },
  {
    id: "form-26as",
    name: "Form 26AS",
    oneLine: "Your annual tax statement: every rupee deducted against your PAN.",
    from: "The Income Tax Department builds it from what deductors file against your PAN. Parts I to VI cover tax deducted at source, 15G and 15H declarations, deductions under sections 194B, 194R and 194S, property and rent deductions under 194IA, 194IB and 194M, 194S through Form 26QE, and tax collected at source. It carries a “Data updated till” date, so a recent deduction may not be on it yet.",
    where: "On the official portal, e-File → Income Tax Returns → View Form 26AS, which opens the TRACES site. This prototype does not fetch it. The figures used here come from a synthetic fixture.",
    usedFor: [
      "Checking the tax in your Form 16 reached the department",
      "Tax deducted by anyone other than your employer",
    ],
    required: false,
  },
  {
    id: "ais",
    name: "AIS (Annual Information Statement)",
    oneLine: "A wider record: income reported about you, not just tax deducted.",
    from: "The Income Tax Department, from what your employer, your banks and others report against your PAN. It covers salary, savings interest, dividends and securities transactions.",
    where: "The AIS item in the portal's own navigation, which opens the Compliance Portal — a separate site. You can give feedback there on an entry that is not yours. This prototype does not fetch your AIS; it uses a synthetic fixture.",
    usedFor: [
      "Interest, dividends and other income to declare",
      "Checking your salary against what was reported",
      "Raising feedback on an entry that is not yours",
    ],
    required: false,
  },
  {
    id: "tis",
    name: "TIS (Taxpayer Information Summary)",
    oneLine: "The same information as AIS, grouped by category.",
    from: "The Income Tax Department generates it alongside AIS, from the same information. Its columns are Information Category, Processed by System and Accepted by Taxpayer. Nothing on the portal says so, but AIS and TIS hold the same information and differ only in how it is presented.",
    where: "On the AIS page on the Compliance Portal, in a tile beside AIS. It downloads as a PDF.",
    usedFor: [
      "Reading your AIS totals category by category",
      "Seeing what was processed and what you accepted",
    ],
    required: false,
  },
];

const hi: DocumentGuide[] = [
  {
    id: "form-16",
    name: "फ़ॉर्म 16",
    oneLine: "आपके वेतन और उस पर कटे कर का, नियोक्ता का रिकॉर्ड।",
    from: "नियोक्ता इसे साल में एक बार जारी करता है, आमतौर पर जून के मध्य तक। भाग A में हर तिमाही आपके वेतन से कटा और विभाग को जमा किया गया कर होता है। भाग B में वेतन का ब्योरा होता है — सकल वेतन, अनुलाभ, छूट वाले भत्ते, कटौतियाँ, और “वेतन” शीर्ष के अंतर्गत कर योग्य आय।",
    where: "यह आपको आपका नियोक्ता देता है। यह प्रोटोटाइप आपसे यही एक दस्तावेज़ माँगता है, PDF या तस्वीर के रूप में।",
    usedFor: [
      "सकल वेतन, और उसमें से छूट वाले हिस्से",
      "वह कर जो नियोक्ता पहले ही काट चुका है",
      "“वेतन” शीर्ष के अंतर्गत कर योग्य आय",
    ],
    required: true,
  },
  {
    id: "form-26as",
    name: "फ़ॉर्म 26AS",
    oneLine: "आपका वार्षिक कर विवरण: PAN पर कटा हर रुपया।",
    from: "आयकर विभाग इसे उन विवरणियों से बनाता है जो कर काटने वाले आपके PAN के सामने दाख़िल करते हैं। भाग I से VI में स्रोत पर कटा कर, 15G और 15H घोषणाएँ, धारा 194B, 194R और 194S के तहत कटौती, संपत्ति और किराए पर धारा 194IA, 194IB और 194M की कटौती, Form 26QE के ज़रिए 194S, और स्रोत पर एकत्र कर आते हैं। इस पर “Data updated till” की तारीख़ लिखी रहती है, इसलिए हो सकता है कि हाल की कोई कटौती अभी उस पर न दिखे।",
    where: "आधिकारिक पोर्टल पर e-File → Income Tax Returns → View Form 26AS, जो TRACES साइट खोलता है। यह प्रोटोटाइप इसे कहीं से नहीं लाता। यहाँ इस्तेमाल हुए आँकड़े काल्पनिक हैं।",
    usedFor: [
      "जाँच कि फ़ॉर्म 16 का कर विभाग तक पहुँचा",
      "नियोक्ता के अलावा किसी और का काटा हुआ कर",
    ],
    required: false,
  },
  {
    id: "ais",
    name: "AIS (वार्षिक सूचना विवरण)",
    oneLine: "26AS से बड़ा रिकॉर्ड: सिर्फ़ कटा कर नहीं, बताई गई आय भी।",
    from: "आयकर विभाग, उस सूचना से जो आपका नियोक्ता, आपके बैंक और दूसरे लोग आपके PAN के सामने देते हैं। इसमें वेतन, बचत खाते का ब्याज, लाभांश और प्रतिभूतियों के लेन-देन आते हैं।",
    where: "पोर्टल की अपनी नेविगेशन में AIS, जो Compliance Portal खोलता है — यह एक अलग साइट है। जो प्रविष्टि आपकी नहीं है, उस पर वहीं फ़ीडबैक दिया जाता है। यह प्रोटोटाइप आपका AIS नहीं लाता, काल्पनिक AIS इस्तेमाल करता है।",
    usedFor: [
      "ब्याज, लाभांश और दूसरी आय जो रिटर्न में जाती है",
      "वेतन का उससे मिलान जो विभाग को बताया गया",
      "जो प्रविष्टि आपकी नहीं है, उस पर फ़ीडबैक",
    ],
    required: false,
  },
  {
    id: "tis",
    name: "TIS (करदाता सूचना सारांश)",
    oneLine: "वही जानकारी जो AIS में है, श्रेणी के हिसाब से।",
    from: "आयकर विभाग इसे AIS के साथ, उसी जानकारी से बनाता है। इसके कॉलम हैं Information Category, Processed by System और Accepted by Taxpayer। पोर्टल पर यह कहीं नहीं लिखा, पर AIS और TIS में जानकारी एक ही होती है, फ़र्क़ सिर्फ़ दिखाने के ढंग का है।",
    where: "Compliance Portal पर AIS वाले पन्ने पर, AIS के बग़ल वाले खाने में। यह PDF में डाउनलोड होता है।",
    usedFor: [
      "AIS के जोड़ श्रेणी के हिसाब से पढ़ना",
      "देखना कि क्या प्रोसेस हुआ, क्या आपने स्वीकारा",
    ],
    required: false,
  },
];

const enChecks: CrossCheck[] = [
  {
    pair: "Form 16 against Form 26AS",
    shouldMatch: "The tax your employer deducted is the same figure in both.",
    ifItDoesNot:
      "The department has not received it. Tax that Form 26AS does not show cannot be claimed in the return, whatever Form 16 says. The correction is filed by the deductor, not in your return.",
  },
  {
    pair: "Form 16 against AIS",
    shouldMatch: "Your salary is the same figure in both.",
    ifItDoesNot:
      "AIS also carries income your employer never knew about, such as bank interest, and that income still belongs in the return. If the salary figure itself differs, one of the two was reported wrongly.",
  },
  {
    pair: "AIS against your own records",
    shouldMatch: "Every entry in AIS is income that is actually yours.",
    ifItDoesNot:
      "An entry that is not yours does not go away by being left out quietly. It is disputed through AIS feedback. Claiming its tax credit while leaving its income out of the return is the exact mismatch that produces a defective-return notice under section 139(9).",
  },
  {
    pair: "Form 26AS against AIS",
    shouldMatch: "The tax deducted agrees; AIS holds the same deductions and more besides.",
    ifItDoesNot:
      "Both are built from the same filings, but at different times. A line in one and not the other usually means they were updated to different dates. Form 26AS prints the date it is updated till.",
  },
];

const hiChecks: CrossCheck[] = [
  {
    pair: "फ़ॉर्म 16 और फ़ॉर्म 26AS",
    shouldMatch: "नियोक्ता ने जो कर काटा, वह दोनों में एक ही रकम हो।",
    ifItDoesNot:
      "मतलब वह कर विभाग तक नहीं पहुँचा। जो कर फ़ॉर्म 26AS में नहीं दिखता, वह रिटर्न में नहीं माँगा जा सकता, चाहे फ़ॉर्म 16 कुछ भी कहे। सुधार की विवरणी कर काटने वाला दाख़िल करता है, यह रिटर्न में ठीक नहीं होता।",
  },
  {
    pair: "फ़ॉर्म 16 और AIS",
    shouldMatch: "वेतन दोनों में एक ही रकम हो।",
    ifItDoesNot:
      "AIS में ऐसी आय भी होती है जिसका नियोक्ता को पता ही नहीं था, जैसे बैंक का ब्याज, और वह आय भी रिटर्न में जाती है। अगर वेतन की रकम ही अलग है, तो दोनों में से एक जगह ग़लत सूचना दर्ज हुई है।",
  },
  {
    pair: "AIS और आपका अपना रिकॉर्ड",
    shouldMatch: "AIS की हर प्रविष्टि सचमुच आपकी आय हो।",
    ifItDoesNot:
      "जो प्रविष्टि आपकी नहीं है, वह चुपचाप छोड़ देने से हटती नहीं। उस पर AIS फ़ीडबैक में आपत्ति दर्ज होती है। उसका कर क्रेडिट माँगना और उसकी आय रिटर्न से बाहर रखना ठीक वही बेमेल है जिससे धारा 139(9) के तहत त्रुटिपूर्ण रिटर्न का नोटिस आता है।",
  },
  {
    pair: "फ़ॉर्म 26AS और AIS",
    shouldMatch: "कटा हुआ कर मेल खाए; AIS में वही कटौतियाँ होती हैं और उनसे ज़्यादा भी।",
    ifItDoesNot:
      "दोनों एक ही विवरणियों से बनते हैं, पर अलग-अलग समय पर। कोई पंक्ति एक में हो और दूसरे में नहीं, तो आमतौर पर दोनों अलग-अलग तारीख़ों तक अपडेट हुए हैं। फ़ॉर्म 26AS पर वह तारीख़ छपी रहती है।",
  },
];

export const documentGuides: { en: DocumentGuide[]; hi: DocumentGuide[] } = {
  en,
  hi,
};

export const crossChecks: { en: CrossCheck[]; hi: CrossCheck[] } = {
  en: enChecks,
  hi: hiChecks,
};
