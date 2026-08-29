/* The portal's "Help me select ITR" wizard: six sections, eighteen questions,
   asked in the department's own words before you are allowed to start a return.
   We do not ask them again. The department already holds the answers, so we
   answer them here, show the record each answer came from, and let any row be
   changed. `decideForm` works on ids and values only, so English and Hindi
   drive exactly the same decision. */

export type SectionId =
  | "residential-status"
  | "general"
  | "business"
  | "income"
  | "other-sources"
  | "misc";

export type AnswerValue = string;

export type Question = {
  id: string;
  /** The portal's own wording, verbatim. */
  official: string;
  /** Our plainer restatement of what is actually being asked. */
  plain: string;
  /** Allowed answers, in the portal's order. */
  options: { value: AnswerValue; label: string }[];
  /** The answer we derive for the demonstration taxpayer. */
  answer: AnswerValue;
  /** Why that is the answer, from facts the department already holds. */
  why: string;
  /** Answers that make ITR-1 unavailable, and the form that applies instead. */
  disqualifying?: { value: AnswerValue; form: string; because: string }[];
};

export type Section = {
  id: SectionId;
  number: number;
  name: string;
  questions: Question[];
};

const yesNo = (yes: string, no: string) => [
  { value: "yes", label: yes },
  { value: "no", label: no },
];

const en: Section[] = [
  {
    id: "residential-status",
    number: 1,
    name: "Residential Status",
    questions: [
      {
        id: "residential-status",
        official:
          "Please provide your residential status in India during the Financial Year 2025-26?",
        plain: "Did you live in India through the year, or outside it?",
        options: [
          { value: "ror", label: "Resident and Ordinarily Resident (ROR)" },
          { value: "nor", label: "Resident but Not Ordinarily Resident (NOR)" },
          { value: "nr", label: "Non-Resident (NR)" },
          { value: "unknown", label: "Don't Know" },
        ],
        answer: "ror",
        why: "Your PAN record carries an Indian address, and your Form 16 covers all twelve months from 1 April 2025 to 31 March 2026 with tax deducted in India every month.",
        disqualifying: [
          {
            value: "nor",
            form: "ITR-2",
            because:
              "ITR-1 is written for a Resident and Ordinarily Resident. Anything else needs the residency schedule that only ITR-2 carries.",
          },
          {
            value: "nr",
            form: "ITR-2",
            because:
              "A non-resident return reports Indian income separately from the rest, and ITR-1 has no way to separate it.",
          },
          {
            value: "unknown",
            form: "ITR-2",
            because:
              "The portal follows this with a set of day-count questions the prototype does not model, so it cannot place you in ITR-1 from here.",
          },
        ],
      },
      {
        id: "ltcg-112a",
        official: "Do you have LTCG u/s 112A more than Rs 1,25,000",
        plain:
          "Did you make more than ₹1,25,000 profit on listed shares or equity mutual funds you sold?",
        options: yesNo("Yes", "No"),
        answer: "no",
        why: "Your AIS records no sale of listed shares or equity mutual funds this year, so there is no long term gain to measure against the limit.",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-2",
            because:
              "A gain above ₹1,25,000 has to be reported with its cost and holding period on the capital gains schedule, and ITR-1 does not have one.",
          },
        ],
      },
    ],
  },
  {
    id: "general",
    number: 2,
    name: "General Information",
    questions: [
      {
        id: "director",
        official:
          "Whether you were a Director in a company in India or outside India at any time during the period 01 April 2025 to 31 March 2026?",
        plain: "Were you a director of any company during the year?",
        options: yesNo("Yes", "No"),
        answer: "no",
        why: "No directorship is linked to your PAN in the company records the department receives, and the only employer reporting against it is Kalpavriksha Software Pvt Ltd.",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-2",
            because:
              "A director's return names the company, its PAN and your DIN, and ITR-1 has no space for them.",
          },
        ],
      },
      {
        id: "unlisted-shares",
        official:
          "Whether you held equity shares in a company which is not listed in India or outside India at any time during the period?",
        plain:
          "Did you hold shares in any company that is not traded on a stock exchange?",
        options: yesNo("Yes", "No"),
        answer: "no",
        why: "Your AIS shows no unlisted shareholding. The one shareholding in it is the dividend from Meghdoot Industries Ltd, reported by a listed company.",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-2",
            because:
              "Unlisted shares are declared company by company, with the opening and closing holding, and ITR-1 has no schedule for that.",
          },
        ],
      },
      {
        id: "portuguese-civil-code",
        official: "Are you governed by Portuguese Civil Code under Section 5A?",
        plain:
          "Are you married under the Portuguese Civil Code, which applies in Goa, Daman and Diu?",
        options: yesNo("Yes", "No"),
        answer: "no",
        why: "Section 5A reaches only marriages governed by the Portuguese Civil Code. Nothing in your PAN record places you under it.",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-2",
            because:
              "Income has to be split between you and your spouse on Schedule 5A, which ITR-1 does not carry. The prototype does not model the split itself.",
          },
        ],
      },
      {
        id: "tds-194n",
        official: "Tax deducted at source u/s 194N?",
        plain:
          "Did a bank deduct tax because you withdrew a very large amount of cash?",
        options: yesNo("Yes", "No"),
        answer: "no",
        why: "The only tax deducted against your PAN this year is on your salary, your fixed deposit interest and your dividend. None of it is under section 194N.",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-2",
            because:
              "The eligibility rules keep tax deducted on cash withdrawals out of ITR-1, so the credit cannot be claimed there.",
          },
        ],
      },
      {
        id: "esop-deferred",
        official: "Deferred tax on ESOPs received from eligible start-ups?",
        plain:
          "Do you owe tax on start-up shares your employer gave you, put off to a later year?",
        options: yesNo("Yes", "No"),
        answer: "no",
        why: "Your Form 16 records salary alone, with no ESOP perquisite, so there is no tax that has been deferred to a later year.",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-2",
            because:
              "Deferred ESOP tax is tracked year by year until it falls due, on a schedule ITR-1 does not carry.",
          },
        ],
      },
    ],
  },
  {
    id: "business",
    number: 3,
    name: "Business Details",
    questions: [
      {
        id: "partner-firm",
        official: "Partner in a partnership firm during the period?",
        plain: "Were you a partner in a firm during the year?",
        options: yesNo("Yes", "No"),
        answer: "no",
        why: "No firm has reported a share of profit, interest or remuneration against your PAN, and your AIS carries no entry from one.",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-3",
            because:
              "A partner reports the firm's share of profit, interest and remuneration, and those belong on ITR-3.",
          },
        ],
      },
      {
        id: "business-activity",
        official: "Did you undertake business activities during the period?",
        plain: "Did you run a business of your own during the year?",
        options: yesNo("Yes", "No"),
        answer: "no",
        why: "Everything reported against your PAN this year is salary from your employer, bank interest and one dividend. None of it is business receipts.",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-3",
            because:
              "Business income is reported with a profit and loss account and a balance sheet. ITR-4 applies instead if you declare it presumptively under section 44AD.",
          },
        ],
      },
      {
        id: "professional-income",
        official:
          "Did you have income from professional service during the period?",
        plain:
          "Were you paid as a professional, such as a consultant, doctor or lawyer?",
        options: yesNo("Yes", "No"),
        answer: "no",
        why: "No payer has deducted tax under section 194J against your PAN, and no professional receipts appear in your AIS.",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-3",
            because:
              "Professional receipts are business income for the return. ITR-4 applies instead if you declare them presumptively under section 44ADA.",
          },
        ],
      },
      {
        id: "goods-carriages",
        official:
          "Are you in the business of plying, hiring or leasing of goods carriages?",
        plain: "Do you run or hire out goods vehicles?",
        options: yesNo("Yes", "No"),
        answer: "no",
        why: "No goods vehicle is registered against your PAN and no transport receipts appear in your AIS.",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-4",
            because:
              "This income is declared per vehicle per month under the presumptive scheme in section 44AE, which sits on ITR-4.",
          },
        ],
      },
    ],
  },
  {
    id: "income",
    number: 4,
    name: "Income Details",
    questions: [
      {
        id: "sold-assets",
        official:
          "Have you sold or transferred any share or mutual fund or any other securities or land or building or any other property or asset?",
        plain:
          "Did you sell anything this year — shares, mutual funds, land or a building?",
        options: yesNo("Yes", "No"),
        answer: "no",
        why: "Your AIS records no sale of securities, and no registrar has reported a property transfer against your PAN this year.",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-2",
            because:
              "A sale is reported with its date, its cost and the gain that follows, and ITR-1 has no capital gains schedule.",
          },
        ],
      },
      {
        id: "house-properties",
        official: "How many house properties do you own?",
        plain: "How many homes do you own?",
        options: [
          { value: "none", label: "0" },
          { value: "upto-2", label: "Upto 2" },
          { value: "more-than-2", label: "More Than 2" },
        ],
        answer: "none",
        why: "No property is registered against your PAN in the department's records, and your Form 16 carries no home loan interest set off against salary.",
        disqualifying: [
          {
            value: "more-than-2",
            form: "ITR-2",
            because:
              "Every property beyond the second needs its own annual value and interest working, and ITR-1 stops at two.",
          },
        ],
      },
      {
        id: "agricultural-income",
        official: "Do you have agricultural income more than Rs 5,000?",
        plain: "Did you earn more than ₹5,000 from farming?",
        options: yesNo("Yes", "No"),
        answer: "no",
        why: "There is no agricultural income in your records at all, so the ₹5,000 limit does not come into it.",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-2",
            because:
              "Agricultural income above ₹5,000 is exempt but still sets the rate on the rest of your income, and ITR-1 cannot do that working.",
          },
        ],
      },
    ],
  },
  {
    id: "other-sources",
    number: 5,
    name: "Other Sources",
    questions: [
      {
        id: "special-rate-income",
        official:
          "Income taxable at special rate (lotteries, prizes, gambling winnings, owning and maintaining race horses, etc.)?",
        plain: "Did you win a lottery, a prize, or money from betting?",
        options: yesNo("Yes", "No"),
        answer: "no",
        why: "Besides your salary, the only entries in your AIS are savings interest, one fixed deposit and one dividend. None of them is a winning.",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-2",
            because:
              "Winnings are taxed at a flat rate of their own, on a line ITR-1 does not have.",
          },
        ],
      },
      {
        id: "clubbed-income",
        official:
          "Income from spouse, minor child or any other income clubbed in your income?",
        plain:
          "Does anyone else's income, such as a child's, get added to yours by law?",
        options: yesNo("Yes", "No"),
        answer: "no",
        why: "No minor's account and no spouse's income is linked to your PAN, so nothing is added to your income under the clubbing rules.",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-2",
            because:
              "Clubbed income has to name whose income it is and how it reached you, and ITR-1 has no schedule for that. The prototype does not model when clubbed income can stay in ITR-1.",
          },
        ],
      },
    ],
  },
  {
    id: "misc",
    number: 6,
    name: "Miscellaneous",
    questions: [
      {
        id: "foreign-income-assets",
        official:
          "Income from any source outside India or assets outside India, or want to claim relief for double taxation?",
        plain:
          "Do you have money, property or income outside India, or tax paid in another country?",
        options: yesNo("Yes", "No"),
        answer: "no",
        why: "Your AIS shows no foreign remittance and no foreign asset against your PAN, and every rupee of tax deducted against you this year was deducted in India.",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-2",
            because:
              "Foreign income and foreign assets are declared on Schedule FSI and Schedule FA, and neither is part of ITR-1.",
          },
        ],
      },
      {
        id: "carry-forward-loss",
        official: "Carry forward of business or trading loss?",
        plain:
          "Are you carrying a loss from an earlier year, or a trading loss from this one?",
        options: yesNo("Yes", "No"),
        answer: "no",
        why: "No loss was carried into this year from an earlier return, and nothing in your AIS is a trading loss.",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-2",
            because:
              "A loss carried forward needs the year it arose and the amount still unused, and ITR-1 can hold neither. A share or F&O loss is the common case.",
          },
        ],
      },
    ],
  },
];

const hi: Section[] = [
  {
    id: "residential-status",
    number: 1,
    name: "निवासीय स्थिति",
    questions: [
      {
        id: "residential-status",
        official:
          "वित्तीय वर्ष 2025-26 के दौरान भारत में आपकी निवासीय स्थिति क्या रही?",
        plain: "यह साल आपने भारत में बिताया या भारत के बाहर?",
        options: [
          { value: "ror", label: "निवासी और सामान्यतः निवासी (ROR)" },
          { value: "nor", label: "निवासी किंतु सामान्यतः निवासी नहीं (NOR)" },
          { value: "nr", label: "अनिवासी (NR)" },
          { value: "unknown", label: "पता नहीं" },
        ],
        answer: "ror",
        why: "आपके PAN रिकॉर्ड में भारत का पता दर्ज है, और आपका Form 16 1 अप्रैल 2025 से 31 मार्च 2026 तक के पूरे बारह महीनों का है, जिसमें हर महीने भारत में TDS कटा है।",
        disqualifying: [
          {
            value: "nor",
            form: "ITR-2",
            because:
              "ITR-1 सिर्फ़ “निवासी और सामान्यतः निवासी” के लिए बना है। इसके अलावा किसी भी स्थिति के लिए वह निवास-अनुसूची चाहिए जो केवल ITR-2 में है।",
          },
          {
            value: "nr",
            form: "ITR-2",
            because:
              "अनिवासी के रिटर्न में भारत की आय बाकी आय से अलग दिखानी होती है, और ITR-1 में उसे अलग करने का कोई तरीका नहीं है।",
          },
          {
            value: "unknown",
            form: "ITR-2",
            because:
              "पोर्टल इसके बाद दिनों की गिनती वाले कई सवाल पूछता है, जिन्हें यह प्रोटोटाइप नहीं दिखाता, इसलिए यहाँ से ITR-1 तय नहीं किया जा सकता।",
          },
        ],
      },
      {
        id: "ltcg-112a",
        official: "क्या धारा 112A के तहत आपका LTCG Rs 1,25,000 से अधिक है",
        plain:
          "सूचीबद्ध शेयर या इक्विटी म्यूचुअल फंड बेचकर क्या आपको ₹1,25,000 से ज़्यादा लाभ हुआ?",
        options: yesNo("हाँ", "नहीं"),
        answer: "no",
        why: "इस साल आपकी AIS में सूचीबद्ध शेयर या इक्विटी म्यूचुअल फंड की कोई बिक्री दर्ज नहीं है, इसलिए सीमा से तुलना करने लायक कोई दीर्घकालिक लाभ ही नहीं है।",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-2",
            because:
              "₹1,25,000 से ऊपर के लाभ को उसकी लागत और अवधि के साथ पूँजीगत लाभ अनुसूची में दिखाना होता है, और ITR-1 में वह अनुसूची नहीं है।",
          },
        ],
      },
    ],
  },
  {
    id: "general",
    number: 2,
    name: "सामान्य जानकारी",
    questions: [
      {
        id: "director",
        official:
          "क्या आप 01 अप्रैल 2025 से 31 मार्च 2026 की अवधि में किसी भी समय भारत में या भारत के बाहर किसी कंपनी में निदेशक रहे?",
        plain: "क्या इस साल किसी कंपनी में आपका निदेशक पद था?",
        options: yesNo("हाँ", "नहीं"),
        answer: "no",
        why: "विभाग को मिलने वाले कंपनी रिकॉर्ड में आपके PAN से कोई निदेशक पद जुड़ा नहीं है, और उस पर रिपोर्ट करने वाला एकमात्र नियोक्ता Kalpavriksha Software Pvt Ltd है।",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-2",
            because:
              "निदेशक के रिटर्न में कंपनी का नाम, उसका PAN और आपका DIN देना होता है, और ITR-1 में इनके लिए जगह नहीं है।",
          },
        ],
      },
      {
        id: "unlisted-shares",
        official:
          "क्या आपने इस अवधि में किसी भी समय ऐसी कंपनी के इक्विटी शेयर रखे जो भारत में या भारत के बाहर सूचीबद्ध नहीं है?",
        plain:
          "क्या आपके पास किसी ऐसी कंपनी के शेयर हैं जो शेयर बाज़ार में सूचीबद्ध नहीं है?",
        options: yesNo("हाँ", "नहीं"),
        answer: "no",
        why: "आपकी AIS में कोई गैर-सूचीबद्ध शेयरधारिता नहीं है। उसमें एक ही शेयरधारिता है, Meghdoot Industries Ltd का लाभांश, जिसे एक सूचीबद्ध कंपनी ने रिपोर्ट किया है।",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-2",
            because:
              "गैर-सूचीबद्ध शेयर हर कंपनी के लिए अलग से, साल के शुरू और अंत की स्थिति के साथ बताने होते हैं, और ITR-1 में उसकी अनुसूची नहीं है।",
          },
        ],
      },
      {
        id: "portuguese-civil-code",
        official: "क्या आप धारा 5A के तहत पुर्तगाली सिविल कोड से शासित हैं?",
        plain:
          "क्या आपका विवाह पुर्तगाली सिविल कोड के तहत है, जो गोवा, दमन और दीव में लागू होता है?",
        options: yesNo("हाँ", "नहीं"),
        answer: "no",
        why: "धारा 5A सिर्फ़ पुर्तगाली सिविल कोड से शासित विवाहों पर लागू होती है। आपके PAN रिकॉर्ड में ऐसा कुछ नहीं है।",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-2",
            because:
              "आय को आपके और आपके जीवनसाथी के बीच अनुसूची 5A में बाँटना होता है, जो ITR-1 में नहीं है। यह प्रोटोटाइप इस बँटवारे को आगे नहीं दिखाता।",
          },
        ],
      },
      {
        id: "tds-194n",
        official: "धारा 194N के तहत स्रोत पर कर कटौती?",
        plain: "क्या बहुत बड़ी नकद निकासी पर बैंक ने आपका कर काटा?",
        options: yesNo("हाँ", "नहीं"),
        answer: "no",
        why: "इस साल आपके PAN पर कर सिर्फ़ वेतन, सावधि जमा के ब्याज और लाभांश पर कटा है। इनमें से कुछ भी धारा 194N के तहत नहीं है।",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-2",
            because:
              "पात्रता नियम नकद निकासी पर कटे कर को ITR-1 से बाहर रखते हैं, इसलिए वहाँ उसका क्रेडिट नहीं लिया जा सकता।",
          },
        ],
      },
      {
        id: "esop-deferred",
        official: "पात्र स्टार्ट-अप से मिले ESOP पर आस्थगित कर?",
        plain:
          "नियोक्ता से मिले स्टार्ट-अप शेयरों का कर क्या आगे के साल पर टाला गया है?",
        options: yesNo("हाँ", "नहीं"),
        answer: "no",
        why: "आपके Form 16 में सिर्फ़ वेतन दर्ज है, कोई ESOP परिलाभ नहीं, इसलिए आगे के साल पर टाला हुआ कोई कर नहीं है।",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-2",
            because:
              "आस्थगित ESOP कर देय होने तक साल-दर-साल एक अनुसूची में दर्ज रहता है, जो ITR-1 में नहीं है।",
          },
        ],
      },
    ],
  },
  {
    id: "business",
    number: 3,
    name: "व्यवसाय का विवरण",
    questions: [
      {
        id: "partner-firm",
        official: "क्या इस अवधि में आप किसी साझेदारी फर्म में साझेदार रहे?",
        plain: "क्या इस साल किसी फर्म में आपकी साझेदारी थी?",
        options: yesNo("हाँ", "नहीं"),
        answer: "no",
        why: "किसी फर्म ने आपके PAN पर लाभ का हिस्सा, ब्याज या पारिश्रमिक रिपोर्ट नहीं किया है, और आपकी AIS में फर्म से कोई प्रविष्टि नहीं है।",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-3",
            because:
              "साझेदार को फर्म से मिला लाभ का हिस्सा, ब्याज और पारिश्रमिक दिखाना होता है, और ये ITR-3 में आते हैं।",
          },
        ],
      },
      {
        id: "business-activity",
        official: "क्या आपने इस अवधि में व्यापारिक गतिविधियाँ कीं?",
        plain: "क्या इस साल आपका अपना कोई व्यापार था?",
        options: yesNo("हाँ", "नहीं"),
        answer: "no",
        why: "इस साल आपके PAN पर जो कुछ रिपोर्ट हुआ है वह नियोक्ता से वेतन, बैंक ब्याज और एक लाभांश है। इनमें कोई व्यापारिक प्राप्ति नहीं है।",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-3",
            because:
              "व्यापार की आय लाभ-हानि खाते और तुलन-पत्र के साथ दिखानी होती है। धारा 44AD के तहत अनुमानित आधार पर दिखाने पर ITR-4 लागू होता है।",
          },
        ],
      },
      {
        id: "professional-income",
        official: "क्या इस अवधि में आपको पेशेवर सेवा से आय हुई?",
        plain: "क्या आपको सलाहकार, डॉक्टर या वकील जैसे पेशे से भुगतान मिला?",
        options: yesNo("हाँ", "नहीं"),
        answer: "no",
        why: "आपके PAN पर धारा 194J के तहत किसी ने कर नहीं काटा है, और आपकी AIS में पेशेवर सेवा की कोई प्राप्ति नहीं है।",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-3",
            because:
              "रिटर्न में पेशेवर प्राप्तियाँ व्यापार की आय मानी जाती हैं। धारा 44ADA के तहत अनुमानित आधार पर दिखाने पर ITR-4 लागू होता है।",
          },
        ],
      },
      {
        id: "goods-carriages",
        official:
          "क्या आप माल वाहनों को चलाने, किराए पर देने या पट्टे पर देने के व्यवसाय में हैं?",
        plain: "क्या आपका काम मालवाहक गाड़ियाँ चलाने या किराए पर देने का है?",
        options: yesNo("हाँ", "नहीं"),
        answer: "no",
        why: "आपके PAN पर कोई मालवाहक वाहन दर्ज नहीं है और आपकी AIS में परिवहन से कोई प्राप्ति नहीं है।",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-4",
            because:
              "यह आय धारा 44AE की अनुमानित योजना में हर वाहन के हर महीने के हिसाब से दिखाई जाती है, जो ITR-4 में है।",
          },
        ],
      },
    ],
  },
  {
    id: "income",
    number: 4,
    name: "आय का विवरण",
    questions: [
      {
        id: "sold-assets",
        official:
          "क्या आपने कोई शेयर या म्यूचुअल फंड या अन्य प्रतिभूतियाँ या ज़मीन या भवन या कोई अन्य संपत्ति बेची या हस्तांतरित की?",
        plain: "क्या इस साल आपने कुछ बेचा — शेयर, म्यूचुअल फंड, ज़मीन या मकान?",
        options: yesNo("हाँ", "नहीं"),
        answer: "no",
        why: "आपकी AIS में प्रतिभूतियों की कोई बिक्री दर्ज नहीं है, और इस साल आपके PAN पर किसी रजिस्ट्रार ने संपत्ति का हस्तांतरण रिपोर्ट नहीं किया है।",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-2",
            because:
              "बिक्री को उसकी तारीख़, लागत और उससे हुए लाभ के साथ दिखाना होता है, और ITR-1 में पूँजीगत लाभ की अनुसूची नहीं है।",
          },
        ],
      },
      {
        id: "house-properties",
        official: "आपके पास कितनी गृह संपत्तियाँ हैं?",
        plain: "आपके नाम कितने मकान हैं?",
        options: [
          { value: "none", label: "0" },
          { value: "upto-2", label: "2 तक" },
          { value: "more-than-2", label: "2 से अधिक" },
        ],
        answer: "none",
        why: "विभाग के रिकॉर्ड में आपके PAN पर कोई संपत्ति दर्ज नहीं है, और आपके Form 16 में वेतन से घटाया गया कोई गृह ऋण ब्याज नहीं है।",
        disqualifying: [
          {
            value: "more-than-2",
            form: "ITR-2",
            because:
              "दूसरी संपत्ति के बाद हर संपत्ति का अपना वार्षिक मूल्य और ब्याज का हिसाब चाहिए, और ITR-1 दो पर रुक जाता है।",
          },
        ],
      },
      {
        id: "agricultural-income",
        official: "क्या आपकी कृषि आय Rs 5,000 से अधिक है?",
        plain: "क्या खेती से आपको ₹5,000 से ज़्यादा आय हुई?",
        options: yesNo("हाँ", "नहीं"),
        answer: "no",
        why: "आपके रिकॉर्ड में कृषि से कोई आय है ही नहीं, इसलिए ₹5,000 की सीमा का सवाल नहीं उठता।",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-2",
            because:
              "₹5,000 से ऊपर की कृषि आय कर-मुक्त तो है, पर बाकी आय पर दर तय करती है, और ITR-1 यह हिसाब नहीं कर सकता।",
          },
        ],
      },
    ],
  },
  {
    id: "other-sources",
    number: 5,
    name: "अन्य स्रोत",
    questions: [
      {
        id: "special-rate-income",
        official:
          "विशेष दर पर कर योग्य आय (लॉटरी, इनाम, जुए की जीत, घुड़दौड़ के घोड़े रखना और उनका रखरखाव, आदि)?",
        plain: "क्या आपको लॉटरी, इनाम या सट्टे से पैसा मिला?",
        options: yesNo("हाँ", "नहीं"),
        answer: "no",
        why: "वेतन के अलावा आपकी AIS में सिर्फ़ बचत खाते का ब्याज, एक सावधि जमा और एक लाभांश है। इनमें कोई जीत नहीं है।",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-2",
            because:
              "जीत पर अपनी अलग एकसमान दर से कर लगता है, और उसकी पंक्ति ITR-1 में नहीं है।",
          },
        ],
      },
      {
        id: "clubbed-income",
        official:
          "पति या पत्नी, अवयस्क बच्चे से आय या कोई अन्य आय जो आपकी आय में जोड़ी जाती है?",
        plain:
          "क्या कानून के हिसाब से किसी और की आय, जैसे बच्चे की, आपकी आय में जुड़ती है?",
        options: yesNo("हाँ", "नहीं"),
        answer: "no",
        why: "आपके PAN से किसी अवयस्क का खाता या जीवनसाथी की आय जुड़ी नहीं है, इसलिए क्लबिंग नियमों से आपकी आय में कुछ नहीं जुड़ता।",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-2",
            because:
              "जोड़ी गई आय के साथ यह बताना होता है कि वह किसकी है और कैसे आपकी आय में आई, और ITR-1 में उसकी अनुसूची नहीं है। यह प्रोटोटाइप उन स्थितियों को आगे नहीं दिखाता जहाँ जोड़ी गई आय ITR-1 में रह सकती है।",
          },
        ],
      },
    ],
  },
  {
    id: "misc",
    number: 6,
    name: "विविध",
    questions: [
      {
        id: "foreign-income-assets",
        official:
          "भारत के बाहर किसी स्रोत से आय या भारत के बाहर संपत्ति, या दोहरे कराधान से राहत का दावा करना चाहते हैं?",
        plain: "क्या भारत के बाहर आपकी कोई आय, संपत्ति या चुकाया हुआ कर है?",
        options: yesNo("हाँ", "नहीं"),
        answer: "no",
        why: "आपकी AIS में आपके PAN पर विदेश से कोई धनप्रेषण या विदेश में कोई संपत्ति दर्ज नहीं है, और इस साल आपका जितना कर कटा है, सब भारत में कटा है।",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-2",
            because:
              "विदेश की आय और विदेश की संपत्ति अनुसूची FSI और अनुसूची FA में बतानी होती है, और ये दोनों ITR-1 में नहीं हैं।",
          },
        ],
      },
      {
        id: "carry-forward-loss",
        official: "व्यापार या ट्रेडिंग हानि का आगे ले जाना?",
        plain:
          "क्या पिछले साल की कोई हानि या इस साल की ट्रेडिंग हानि आगे ले जानी है?",
        options: yesNo("हाँ", "नहीं"),
        answer: "no",
        why: "पिछले किसी रिटर्न से इस साल में कोई हानि नहीं आई है, और आपकी AIS में कोई ट्रेडिंग हानि नहीं है।",
        disqualifying: [
          {
            value: "yes",
            form: "ITR-2",
            because:
              "आगे ले जाई गई हानि के साथ वह साल और बची हुई रकम बतानी होती है, और ITR-1 दोनों में से कुछ भी नहीं रख सकता। शेयर या F&O की हानि इसका आम उदाहरण है।",
          },
        ],
      },
    ],
  },
];

export const eligibility: { en: Section[]; hi: Section[] } = { en, hi };

/* English is the source of truth for ids and values; Hindi is the same
   structure translated, so the decision below holds in either language. */
const questions = en.flatMap((section) => section.questions);

export function decideForm(answers: Record<string, AnswerValue>): {
  form: string;
  eligible: boolean;
  blockers: string[];
} {
  const blockers: string[] = [];
  const forms = new Set<string>();

  for (const question of questions) {
    const value = answers[question.id];
    if (value === undefined) continue;
    const hit = question.disqualifying?.find((rule) => rule.value === value);
    if (!hit) continue;
    blockers.push(question.id);
    forms.add(hit.form);
  }

  if (blockers.length === 0) {
    return { form: "ITR-1", eligible: true, blockers: [] };
  }

  /* ITR-3 carries everything the other two do, so it is where business income
     lands, and also where a presumptive answer lands once something ITR-4
     cannot hold — foreign assets, a directorship, unlisted shares — is present
     alongside it. */
  const form = forms.has("ITR-3")
    ? "ITR-3"
    : forms.has("ITR-4")
      ? forms.has("ITR-2")
        ? "ITR-3"
        : "ITR-4"
      : "ITR-2";

  return { form, eligible: false, blockers };
}

export const demoAnswers: Record<string, AnswerValue> = Object.fromEntries(
  questions.map((question) => [question.id, question.answer]),
);
