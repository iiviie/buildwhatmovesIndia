/* Hover and focus previews for the step rail. A locked step should be able to
   say what it will ask, what it needs, and roughly how long it takes, so a
   citizen can decide whether to start it now. Indexes match `copy.steps`. */

export type StepGuide = {
  /** One line: what this step is for. Shown first, in the panel's own voice. */
  summary: string;
  /** 2 to 4 short bullets: what the step actually asks you to do. No prose. */
  asks: string[];
  /** What you need in front of you, or "" when the step needs nothing. */
  needs: string;
  /** Rough duration, already phrased, e.g. "About a minute". */
  time: string;
};

const en: StepGuide[] = [
  {
    summary: "Where the return begins, and what it will need from you.",
    asks: [
      "See how long is left to file on time",
      "Read what you need, and what this demo does not do",
      "Start the return, or continue a saved draft",
    ],
    needs: "Nothing yet — your Form 16 is needed from step 2",
    time: "About a minute to read",
  },
  {
    summary: "The three answers the portal makes you guess, worked out for you.",
    asks: [
      "See your form, ITR-1, and why it applies",
      "See your employment type and filing reason",
      "Read the due date, and the late fee after it",
      "Confirm this describes you, and continue",
    ],
    needs: "Nothing — everything is already on screen",
    time: "Under a minute",
  },
  {
    summary: "Your Form 16 figures, each shown beside where it came from.",
    asks: [
      "Load or replace your Form 16 and your AIS",
      "Check gross salary, standard deduction and TDS",
      "Read why the exempt-allowance column is empty",
      "Tick that the figures match your Form 16",
    ],
    needs: "Your Form 16, as a PDF or a photo",
    time: "Two to three minutes",
  },
  {
    summary: "Every interest and dividend entry the department already holds.",
    asks: [
      "Say whether each pre-filled entry is yours",
      "See the payer, the amount and the tax deducted",
      "Report an entry you do not recognise",
      "Watch the running total and tax credit change",
    ],
    needs: "Your bank statement, if you want to check a line",
    time: "Two to three minutes",
  },
  {
    summary: "The one real choice in a salaried return, with both totals shown.",
    asks: [
      "Compare the new and old regime on your figures",
      "Read the slab working, band by band",
      "See which deductions each regime allows",
      "Choose the regime you will file under",
    ],
    needs: "A decision, once you have read both columns",
    time: "A minute or two",
  },
  {
    summary: "The four defect checks the portal only runs months later.",
    asks: [
      "See which of the four checks passed",
      "Read what a failed check would cost you",
      "Go back and fix anything still flagged",
    ],
    needs: "Nothing — the checks run on your answers",
    time: "Under a minute if the checks pass",
  },
  {
    summary: "The whole return on one screen, before anything is filed.",
    asks: [
      "Read your income, tax and credit in one table",
      "See whether you are owed a refund or owe tax",
      "Go back and change any answer",
      "Tick the declaration and file",
    ],
    needs: "Nothing — go back to any step to change an answer",
    time: "About a minute",
  },
  /* Reached rather than chosen, so this one describes what you are left with. */
  {
    summary: "What a filed return leaves you with, once it is done.",
    asks: [
      "Your acknowledgement and transaction number",
      "The income, tax and refund that were filed",
      "What the department would do next",
      "Print the receipt, or download it as text",
    ],
    needs: "",
    time: "Under a minute to save or print",
  },
];

const hi: StepGuide[] = [
  {
    summary: "रिटर्न यहाँ से शुरू होता है, और क्या-क्या चाहिए यह भी यहीं लिखा है।",
    asks: [
      "देखें कि समय पर भरने के लिए कितना समय बचा है",
      "पढ़ें कि क्या चाहिए, और यह डेमो क्या नहीं करता",
      "रिटर्न शुरू करें, या सहेजा हुआ ड्राफ़्ट आगे बढ़ाएँ",
    ],
    needs: "अभी कुछ नहीं — फ़ॉर्म 16 चरण 2 पर चाहिए",
    time: "पढ़ने में लगभग एक मिनट",
  },
  {
    summary: "पोर्टल जो तीन जवाब आप पर छोड़ देता है, वे यहाँ पहले से निकाले गए हैं।",
    asks: [
      "देखें कि आपका फ़ॉर्म ITR-1 है, और क्यों",
      "देखें रोज़गार का प्रकार और फाइल करने का कारण",
      "नियत तारीख़ और उसके बाद का विलंब शुल्क पढ़ें",
      "पुष्टि करें कि यह आप पर लागू है, और आगे बढ़ें",
    ],
    needs: "कुछ नहीं — सब कुछ स्क्रीन पर है",
    time: "एक मिनट से कम",
  },
  {
    summary: "फ़ॉर्म 16 के आँकड़े, हर एक के साथ यह भी कि वह कहाँ से आया।",
    asks: [
      "अपना फ़ॉर्म 16 और AIS लोड करें या बदलें",
      "सकल वेतन, मानक कटौती और TDS जाँचें",
      "पढ़ें कि छूट वाले भत्तों का कॉलम खाली क्यों है",
      "निशान लगाएँ कि आँकड़े फ़ॉर्म 16 से मेल खाते हैं",
    ],
    needs: "आपका फ़ॉर्म 16, PDF या तस्वीर के रूप में",
    time: "दो से तीन मिनट",
  },
  {
    summary: "ब्याज और लाभांश की वे प्रविष्टियाँ जो विभाग के पास पहले से हैं।",
    asks: [
      "बताएँ कि हर भरी हुई प्रविष्टि आपकी है या नहीं",
      "देखें किसने दिया, कितनी रकम है, कितना कर कटा",
      "जो प्रविष्टि आपकी नहीं है, उसे बताएँ",
      "चलता हुआ जोड़ और कर क्रेडिट बदलते देखें",
    ],
    needs: "बैंक का विवरण, अगर कोई पंक्ति मिलानी हो",
    time: "दो से तीन मिनट",
  },
  {
    summary: "वेतन रिटर्न का असली फ़ैसला, दोनों व्यवस्थाओं के जोड़ के साथ।",
    asks: [
      "अपने आँकड़ों पर नई और पुरानी व्यवस्था की तुलना करें",
      "स्लैब की गणना एक-एक करके पढ़ें",
      "देखें कौन-सी व्यवस्था कौन-सी कटौती देती है",
      "जिस व्यवस्था में फाइल करना है, वह चुनें",
    ],
    needs: "एक फ़ैसला, दोनों कॉलम पढ़ लेने के बाद",
    time: "एक-दो मिनट",
  },
  {
    summary: "वे चार जाँचें जो पोर्टल महीनों बाद, नोटिस के रूप में करता है।",
    asks: [
      "देखें चारों जाँचों में से कौन-सी पास हुई",
      "पढ़ें कि जाँच फेल होने पर क्या भुगतना पड़ता",
      "जो अब भी अटका है, पीछे जाकर ठीक करें",
    ],
    needs: "कुछ नहीं — जाँचें आपके जवाबों पर चलती हैं",
    time: "जाँचें पास हों तो एक मिनट से कम",
  },
  {
    summary: "पूरा रिटर्न एक स्क्रीन पर, कुछ भी फाइल होने से पहले।",
    asks: [
      "आय, कर और क्रेडिट एक ही तालिका में पढ़ें",
      "देखें कि रिफ़ंड मिलना है या कर देना बाकी है",
      "पीछे जाकर कोई भी जवाब बदलें",
      "घोषणा पर निशान लगाएँ और फाइल करें",
    ],
    needs: "कुछ नहीं — किसी भी चरण पर लौटकर जवाब बदला जा सकता है",
    time: "लगभग एक मिनट",
  },
  {
    summary: "फाइल हो जाने के बाद आपके हाथ में क्या रहता है।",
    asks: [
      "आपकी पावती संख्या और लेन-देन संख्या",
      "जो आय, कर और रिफ़ंड फाइल हुआ",
      "विभाग आगे क्या करता",
      "पावती प्रिंट करें, या टेक्स्ट में डाउनलोड करें",
    ],
    needs: "",
    time: "सहेजने या प्रिंट करने में एक मिनट से कम",
  },
];

export const stepGuides: { en: StepGuide[]; hi: StepGuide[] } = { en, hi };
