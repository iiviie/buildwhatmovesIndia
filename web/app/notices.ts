/* The department's notices, kept rather than shown once.

   The official portal publishes these on the home page as a short list of the
   most recent few, and that is the whole of it: last week's notice is not
   somewhere else, it is gone. But a notice is the only public record of when a
   date moved, when a utility was released, or when a facility opened — and the
   question a citizen actually has is almost always about one that has already
   scrolled off ("the due date changed at some point in July, what did it
   say?"). So they are held here as an archive, ordered by date and grouped by
   month, and the home page shows the newest four with a way through to the
   rest.

   Dates are ISO here and written out in the reader's own language at the point
   of display, so the ordering and the month grouping are the same in English
   and Hindi. `affectsYou` is the department's own distinction between a notice
   that changes what a salaried filer does and one that is for information;
   this prototype states it in words on every row, never by colour alone. */

import { formatMonth, type Language } from "./case-data";

export type Notice = {
  id: string;
  /** ISO date. Ordering and grouping are done on this, never on the label. */
  on: string;
  /** Whether it changes what a salaried filer has to do. */
  affectsYou: boolean;
  title: string;
};

const en: Notice[] = [
  {
    id: "forms-open",
    on: "2026-08-20",
    affectsYou: true,
    title:
      "ITR-1 to ITR-7 for AY 2026-27 are open for filing, online and through the offline utilities.",
  },
  {
    id: "itr3-due",
    on: "2026-08-18",
    affectsYou: true,
    title:
      "The due date for ITR-3 and ITR-4, for business or professional income not subject to audit, is 31 August 2026. Salaried filers using ITR-1 had a 31 July due date.",
  },
  {
    id: "phishing",
    on: "2026-08-13",
    affectsYou: true,
    title:
      "The department never asks for your PIN, password, OTP or bank details by email, SMS or phone. Forward anything that does to incident@cert-in.org.in.",
  },
  {
    id: "tds-corrections",
    on: "2026-08-12",
    affectsYou: false,
    title:
      "Filing of TDS and TCS correction statements for Tax Year 2026-27 will be enabled shortly.",
  },
  {
    id: "due-date-passed",
    on: "2026-07-31",
    affectsYou: true,
    title:
      "The due date for salaried returns for AY 2026-27 has passed. A belated return is accepted until 31 December 2026, with a fee under section 234F and interest under section 234A on any unpaid tax.",
  },
  {
    id: "ais-feedback",
    on: "2026-07-22",
    affectsYou: false,
    title:
      "Feedback raised on an Annual Information Statement now carries a status, so you can see whether the reporting entity has responded.",
  },
  {
    id: "form16-issued",
    on: "2026-07-10",
    affectsYou: true,
    title:
      "Employers have issued Form 16 for FY 2025-26. Check that the figures on it match Part A of your Form 26AS before you file.",
  },
  {
    id: "q4-tds",
    on: "2026-06-30",
    affectsYou: true,
    title:
      "TDS returns for the fourth quarter of FY 2025-26 have been processed. Form 26AS and the Annual Information Statement now reflect them.",
  },
  {
    id: "advance-tax",
    on: "2026-06-15",
    affectsYou: false,
    title:
      "The first instalment of advance tax for AY 2027-28 is due today. Salaried taxpayers whose tax is fully deducted at source have nothing to pay.",
  },
  {
    id: "maintenance",
    on: "2026-06-05",
    affectsYou: false,
    title:
      "The e-filing portal will be unavailable between 11 pm on 6 June and 3 am on 7 June for scheduled maintenance.",
  },
  {
    id: "sft-filed",
    on: "2026-05-31",
    affectsYou: false,
    title:
      "Banks, mutual funds and registrars have filed their Statements of Financial Transaction for FY 2025-26. Interest, dividend and high-value entries now appear in your AIS.",
  },
  {
    id: "prefill",
    on: "2026-05-20",
    affectsYou: true,
    title:
      "Prefilled data for AY 2026-27 is available in the return. Prefilled figures are the department's record, not a verified one — check each against your own documents.",
  },
  {
    id: "pan-aadhaar",
    on: "2026-05-08",
    affectsYou: true,
    title:
      "A PAN that is not linked to Aadhaar becomes inoperative. An inoperative PAN cannot be used to file a return and attracts a higher rate of tax deducted at source.",
  },
  {
    id: "utilities",
    on: "2026-04-15",
    affectsYou: false,
    title:
      "The offline utilities for AY 2026-27 have been released for Windows and macOS, along with the JSON schema for each form.",
  },
  {
    id: "new-year",
    on: "2026-04-01",
    affectsYou: true,
    title:
      "FY 2026-27 begins. The new regime applies by default; you may still choose the old regime when you file, and for salaried filers that choice can be made afresh each year.",
  },
];

const hi: Notice[] = [
  {
    id: "forms-open",
    on: "2026-08-20",
    affectsYou: true,
    title:
      "निर्धारण वर्ष 2026-27 के लिए ITR-1 से ITR-7 तक फाइलिंग खुली है, ऑनलाइन और ऑफ़लाइन दोनों तरीकों से।",
  },
  {
    id: "itr3-due",
    on: "2026-08-18",
    affectsYou: true,
    title:
      "व्यापार या पेशे की आय के लिए, जिसकी लेखा-परीक्षा ज़रूरी नहीं, ITR-3 और ITR-4 की नियत तारीख़ 31 अगस्त 2026 है। ITR-1 भरने वाले वेतनभोगियों की नियत तारीख़ 31 जुलाई थी।",
  },
  {
    id: "phishing",
    on: "2026-08-13",
    affectsYou: true,
    title:
      "विभाग आपका पिन, पासवर्ड, ओटीपी या बैंक विवरण ईमेल, एसएमएस या फ़ोन पर कभी नहीं माँगता। ऐसा कोई संदेश मिले तो उसे incident@cert-in.org.in पर भेज दें।",
  },
  {
    id: "tds-corrections",
    on: "2026-08-12",
    affectsYou: false,
    title:
      "कर वर्ष 2026-27 के लिए टीडीएस और टीसीएस सुधार विवरण भरने की सुविधा जल्द शुरू होगी।",
  },
  {
    id: "due-date-passed",
    on: "2026-07-31",
    affectsYou: true,
    title:
      "निर्धारण वर्ष 2026-27 के लिए वेतनभोगियों की नियत तारीख़ निकल चुकी है। विलंबित रिटर्न 31 दिसंबर 2026 तक स्वीकार है, धारा 234F के तहत शुल्क और बकाया कर पर धारा 234A के तहत ब्याज के साथ।",
  },
  {
    id: "ais-feedback",
    on: "2026-07-22",
    affectsYou: false,
    title:
      "वार्षिक सूचना विवरण पर दी गई प्रतिक्रिया की अब स्थिति दिखती है, जिससे आप देख सकती हैं कि सूचना देने वाली संस्था ने जवाब दिया या नहीं।",
  },
  {
    id: "form16-issued",
    on: "2026-07-10",
    affectsYou: true,
    title:
      "नियोक्ताओं ने वित्त वर्ष 2025-26 के लिए फ़ॉर्म 16 जारी कर दिया है। फाइल करने से पहले उसके आँकड़े अपने फ़ॉर्म 26AS के भाग A से मिलाकर देख लें।",
  },
  {
    id: "q4-tds",
    on: "2026-06-30",
    affectsYou: true,
    title:
      "वित्त वर्ष 2025-26 की चौथी तिमाही के टीडीएस विवरण संसाधित हो चुके हैं। फ़ॉर्म 26AS और वार्षिक सूचना विवरण में वे अब दिखते हैं।",
  },
  {
    id: "advance-tax",
    on: "2026-06-15",
    affectsYou: false,
    title:
      "निर्धारण वर्ष 2027-28 के लिए अग्रिम कर की पहली किस्त आज देय है। जिन वेतनभोगियों का पूरा कर स्रोत पर कट चुका है, उन्हें कुछ नहीं देना है।",
  },
  {
    id: "maintenance",
    on: "2026-06-05",
    affectsYou: false,
    title:
      "नियोजित रखरखाव के कारण ई-फाइलिंग पोर्टल 6 जून रात 11 बजे से 7 जून सुबह 3 बजे तक उपलब्ध नहीं रहेगा।",
  },
  {
    id: "sft-filed",
    on: "2026-05-31",
    affectsYou: false,
    title:
      "बैंकों, म्यूचुअल फंडों और रजिस्ट्रारों ने वित्त वर्ष 2025-26 के वित्तीय लेनदेन विवरण भर दिए हैं। ब्याज, लाभांश और बड़ी राशि की प्रविष्टियाँ अब आपके एआईएस में दिखती हैं।",
  },
  {
    id: "prefill",
    on: "2026-05-20",
    affectsYou: true,
    title:
      "निर्धारण वर्ष 2026-27 के लिए पहले से भरा डेटा रिटर्न में उपलब्ध है। यह विभाग का रिकॉर्ड है, जाँचा हुआ आँकड़ा नहीं — हर संख्या अपने दस्तावेज़ों से मिलाकर देखें।",
  },
  {
    id: "pan-aadhaar",
    on: "2026-05-08",
    affectsYou: true,
    title:
      "जो पैन आधार से नहीं जुड़ा, वह निष्क्रिय हो जाता है। निष्क्रिय पैन से रिटर्न नहीं भरा जा सकता और स्रोत पर कर की कटौती ऊँची दर से होती है।",
  },
  {
    id: "utilities",
    on: "2026-04-15",
    affectsYou: false,
    title:
      "निर्धारण वर्ष 2026-27 की ऑफ़लाइन यूटिलिटी विंडोज़ और मैकओएस के लिए जारी कर दी गई हैं, हर फ़ॉर्म की JSON स्कीमा के साथ।",
  },
  {
    id: "new-year",
    on: "2026-04-01",
    affectsYou: true,
    title:
      "वित्त वर्ष 2026-27 शुरू। नई कर व्यवस्था स्वतः लागू होती है; फाइल करते समय आप पुरानी व्यवस्था चुन सकती हैं, और वेतनभोगियों के लिए यह चुनाव हर साल नया किया जा सकता है।",
  },
];

export const notices: { en: Notice[]; hi: Notice[] } = { en, hi };

/** Newest first. The stored order is already this, but nothing should depend
    on an array's order being maintained by hand. */
export const newestFirst = (list: Notice[]): Notice[] =>
  [...list].sort((a, b) => b.on.localeCompare(a.on));

export type NoticeFilter = "all" | "affects" | "information";

export const matches = (notice: Notice, filter: NoticeFilter): boolean =>
  filter === "all" ||
  (filter === "affects" ? notice.affectsYou : !notice.affectsYou);

export type NoticeMonth = { key: string; label: string; notices: Notice[] };

/* Grouped by the month they were published in, because "some time in July" is
   how anybody looking for an old notice actually remembers it. */
export const byMonth = (list: Notice[], language: Language): NoticeMonth[] => {
  const months = new Map<string, NoticeMonth>();

  for (const notice of newestFirst(list)) {
    const key = notice.on.slice(0, 7);
    const found = months.get(key);
    if (found) {
      found.notices.push(notice);
      continue;
    }
    months.set(key, {
      key,
      label: formatMonth(new Date(`${notice.on}T00:00:00+05:30`), language),
      notices: [notice],
    });
  }

  return [...months.values()];
};
