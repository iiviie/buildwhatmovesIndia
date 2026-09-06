/* Verification: the step after filing that decides whether the filing counted.
 *
 * This prototype used to end at the acknowledgement, which is where the
 * official journey does not end. A return that is filed and never verified is
 * treated as never filed at all — the acknowledgement number exists, the
 * screen says the return went in, and thirty days later none of it stands.
 * That is the same shape of failure as a defective return, arriving later and
 * with less warning, so it belongs here for the same reason.
 *
 * The rule: the return has to be verified within 30 days of filing. Verify
 * inside the window and the date of filing is the date you filed. Verify after
 * it, and the date of verification becomes the date of filing — so a return
 * filed on time turns into a late one, with the section 234F fee and section
 * 234A interest that follow from that. (The window was 120 days until the
 * CBDT cut it to 30 for returns filed on or after 1 August 2022.)
 *
 * Route names are the portal's own, recorded from its e-Verify screen, and
 * stay in English in both halves like every other portal quotation here. */


/** Days from filing to verify. See the note above. */
export const VERIFY_WINDOW_DAYS = 30;

/** The route this prototype simulates, named so nothing else can be implied. */
export const DEMO_VERIFY_ROUTE = "aadhaar-otp";

/** A synthetic verification reference, in the shape the portal's own carries. */
export const DEMO_VERIFY_REFERENCE = "DEMO-EVC-2026-5510834";

export type VerifyRoute = {
  id: string;
  /** The portal's own wording for the option. */
  official: string;
  /** What it actually involves, in one or two sentences. */
  plain: string;
  /** What you need before it will work. */
  needs: string;
  /** Whether the return is verified the moment it succeeds. */
  instant: boolean;
};

const routesEn: VerifyRoute[] = [
  {
    id: "aadhaar-otp",
    official: "e-Verify using OTP on mobile number registered with Aadhaar",
    plain:
      "A one-time password goes to the mobile number your Aadhaar is registered against, and typing it back verifies the return. It is the shortest route and the one most salaried filers use.",
    needs:
      "Your [[pan|PAN]] linked to your Aadhaar, and a mobile number registered against that Aadhaar. If the number has changed, this route fails silently until you update it with the UIDAI.",
    instant: true,
  },
  {
    id: "net-banking",
    official: "Through Net Banking",
    plain:
      "You sign in to your own bank's net banking, find its income tax e-Filing link, and arrive back at the portal already identified. No OTP is involved.",
    needs:
      "Net banking on a bank that offers the e-Filing link, on an account held in the same PAN.",
    instant: true,
  },
  {
    id: "bank-evc",
    official: "Through Bank Account",
    plain:
      "The portal sends an [[evc|electronic verification code]] to the mobile number and email registered against a bank account you have prevalidated with it.",
    needs:
      "A [[prevalidated-account|prevalidated account]] with EVC enabled on it. This is the same prevalidation a refund needs, so it is often already done.",
    instant: true,
  },
  {
    id: "demat-evc",
    official: "Through Demat Account",
    plain:
      "The same electronic verification code, sent against a prevalidated demat account instead of a bank account.",
    needs: "A demat account prevalidated on the portal, with EVC enabled.",
    instant: true,
  },
  {
    id: "atm-evc",
    official: "Through Bank ATM (offline method)",
    plain:
      "You generate the verification code at your own bank's ATM with your debit card, then enter it on the portal.",
    needs:
      "A debit card on one of the banks that offers this, which is a short list.",
    instant: true,
  },
  {
    id: "dsc",
    official: "Using Digital Signature Certificate (DSC)",
    plain:
      "The return is signed with a [[dsc|digital signature certificate]] held on a USB token. Salaried filers rarely have one; it is mandatory in cases where accounts are audited.",
    needs:
      "A valid DSC registered on the portal, and the utility that reads the token installed on the computer you are filing from.",
    instant: true,
  },
  {
    id: "itr-v",
    official: "Send signed ITR-V to CPC, Bengaluru",
    plain:
      "The paper route. You print the [[acknowledgement|ITR-V]], sign it in blue ink, and post it to the Centralised Processing Centre in Bengaluru by ordinary or speed post. Nothing is verified until it arrives and is logged.",
    needs:
      "Post that reaches Bengaluru inside the same 30 days. The date the ITR-V is received is what counts, not the date you posted it, which is why this route runs out of time most often.",
    instant: false,
  },
];

const routesHi: VerifyRoute[] = [
  {
    id: "aadhaar-otp",
    official: "e-Verify using OTP on mobile number registered with Aadhaar",
    plain:
      "आपके आधार से जुड़े मोबाइल नंबर पर एक बार का पासवर्ड आता है, और उसे दर्ज करते ही रिटर्न सत्यापित हो जाता है। यह सबसे छोटा रास्ता है और ज़्यादातर वेतनभोगी यही चुनते हैं।",
    needs:
      "आपका [[pan|पैन]] आधार से जुड़ा हुआ, और उसी आधार से जुड़ा मोबाइल नंबर। नंबर बदल गया हो तो यह रास्ता चुपचाप विफल होता रहेगा, जब तक आप UIDAI में उसे अपडेट न करें।",
    instant: true,
  },
  {
    id: "net-banking",
    official: "Through Net Banking",
    plain:
      "आप अपने बैंक की नेट बैंकिंग में जाते हैं, वहाँ आयकर ई-फाइलिंग का लिंक खोलते हैं, और पोर्टल पर पहचाने हुए पहुँच जाते हैं। इसमें कोई OTP नहीं आता।",
    needs:
      "ऐसे बैंक की नेट बैंकिंग जो यह लिंक देता हो, और खाता उसी पैन पर हो।",
    instant: true,
  },
  {
    id: "bank-evc",
    official: "Through Bank Account",
    plain:
      "पोर्टल आपके उस बैंक खाते से जुड़े मोबाइल और ईमेल पर एक [[evc|इलेक्ट्रॉनिक सत्यापन कोड]] भेजता है जिसे आपने पहले से सत्यापित करा रखा है।",
    needs:
      "EVC चालू किया हुआ एक [[prevalidated-account|पहले से सत्यापित खाता]]। रिफ़ंड के लिए भी यही सत्यापन चाहिए होता है, इसलिए अक्सर यह पहले से हो चुका होता है।",
    instant: true,
  },
  {
    id: "demat-evc",
    official: "Through Demat Account",
    plain:
      "वही इलेक्ट्रॉनिक सत्यापन कोड, बैंक खाते की जगह पहले से सत्यापित डीमैट खाते पर।",
    needs: "पोर्टल पर सत्यापित डीमैट खाता, जिस पर EVC चालू हो।",
    instant: true,
  },
  {
    id: "atm-evc",
    official: "Through Bank ATM (offline method)",
    plain:
      "आप अपने बैंक के ATM पर डेबिट कार्ड से सत्यापन कोड बनवाते हैं, और फिर उसे पोर्टल पर दर्ज करते हैं।",
    needs: "उन गिने-चुने बैंकों में से किसी एक का डेबिट कार्ड जो यह सुविधा देते हैं।",
    instant: true,
  },
  {
    id: "dsc",
    official: "Using Digital Signature Certificate (DSC)",
    plain:
      "रिटर्न पर USB टोकन में रखे [[dsc|डिजिटल हस्ताक्षर प्रमाणपत्र]] से दस्तख़त होते हैं। वेतनभोगी लोगों के पास यह कम ही होता है; जिन मामलों में खातों का ऑडिट होता है, वहाँ यह अनिवार्य है।",
    needs:
      "पोर्टल पर दर्ज वैध DSC, और जिस कंप्यूटर से फाइल कर रहे हैं उस पर टोकन पढ़ने वाली उपयोगिता।",
    instant: true,
  },
  {
    id: "itr-v",
    official: "Send signed ITR-V to CPC, Bengaluru",
    plain:
      "काग़ज़ वाला रास्ता। आप [[acknowledgement|ITR-V]] छापते हैं, नीली स्याही से दस्तख़त करते हैं, और साधारण या स्पीड पोस्ट से बेंगलुरु के केंद्रीकृत प्रसंस्करण केंद्र भेजते हैं। जब तक वह पहुँचकर दर्ज न हो, कुछ भी सत्यापित नहीं होता।",
    needs:
      "ऐसी डाक जो उन्हीं 30 दिनों के भीतर बेंगलुरु पहुँच जाए। जो तारीख़ गिनी जाती है वह ITR-V के पहुँचने की है, आपके भेजने की नहीं — इसीलिए समय सबसे ज़्यादा इसी रास्ते में निकलता है।",
    instant: false,
  },
];

export const verifyRoutes: Record<"en" | "hi", VerifyRoute[]> = {
  en: routesEn,
  hi: routesHi,
};

export type VerificationCopy = {
  /** Heading over the block. */
  title: string;
  /** What filing did and did not do. */
  intro: string;
  /** Status label while nothing has been verified. */
  pendingState: string;
  /** Status label once it has. */
  doneState: string;
  /** Row label over the date the window closes. */
  deadlineLabel: string;
  /** How long is left, given a day count. */
  daysLeft: (days: number) => string;
  /** When the window has already closed. */
  windowClosed: string;
  /** What happens if the window closes unverified. */
  consequence: string;
  /** Lead-in over the list of routes. */
  routesLabel: string;
  /** Disclosure holding the routes not simulated here. */
  routesSummary: (count: number) => string;
  /** Lead-in over what a route needs. */
  needsLabel: string;
  /** The route this demo simulates. */
  demoRouteLabel: string;
  /** The button. */
  action: string;
  /** That no OTP is sent and nothing leaves the device. */
  actionNote: string;
  /** Announced when the demo verification completes. */
  doneNote: string;
  /** Row label over the synthetic verification reference. */
  referenceLabel: string;
  /** Row label over when it was verified. */
  verifiedAtLabel: string;
  /** The paper route's own warning. */
  paperNote: string;
};

export const verificationCopy: Record<"en" | "hi", VerificationCopy> = {
  en: {
    title: "This return is not verified yet",
    intro:
      "Filing and verifying are two separate acts, and only the second one finishes the job. Until this return is verified it is not a valid return: the acknowledgement number below exists, and the department still treats the return as never filed.",
    pendingState: "Filed, awaiting verification",
    doneState: "Filed and verified",
    deadlineLabel: "Verify on or before",
    daysLeft: (days: number) =>
      days === 1 ? "1 day left" : `${days} days left`,
    windowClosed:
      "The 30 days have run out. A return verified now is treated as filed today, not on the day it was filed.",
    consequence:
      "Miss the 30 days and the date you verify becomes the date you filed. A return that went in on time becomes a late one, and the [[section-234f|section 234F fee]] and [[section-234a|section 234A interest]] follow from the later date. Nothing warns you while the clock runs.",
    routesLabel: "The route this demo takes",
    routesSummary: (count: number) => `The other ${count} routes the portal offers`,
    needsLabel: "What it needs",
    demoRouteLabel: "Aadhaar OTP",
    action: "e-Verify this demo return",
    actionNote:
      "This simulates the Aadhaar OTP route. No OTP is sent, no number is contacted, and nothing leaves this device.",
    doneNote:
      "Verified in the demo. In a real filing this is the moment the return becomes valid, and the department begins processing it and the refund.",
    referenceLabel: "Verification reference",
    verifiedAtLabel: "Verified at",
    paperNote:
      "One of these is not electronic and does not finish today. Read what it needs before choosing it.",
  },
  hi: {
    title: "यह रिटर्न अभी सत्यापित नहीं हुआ है",
    intro:
      "फाइल करना और सत्यापित करना दो अलग काम हैं, और काम पूरा दूसरे से होता है। जब तक यह रिटर्न [[e-verify|सत्यापित]] नहीं होता, यह वैध रिटर्न नहीं है: नीचे दी गई पावती संख्या मौजूद रहती है, और विभाग रिटर्न को ऐसे मानता है जैसे भरा ही न गया हो।",
    pendingState: "भरा गया, सत्यापन बाकी",
    doneState: "भरा गया और सत्यापित",
    deadlineLabel: "इस तारीख़ तक सत्यापित करें",
    daysLeft: (days: number) => (days === 1 ? "1 दिन बाकी" : `${days} दिन बाकी`),
    windowClosed:
      "30 दिन पूरे हो चुके हैं। अब सत्यापित करने पर रिटर्न आज की तारीख़ में भरा हुआ माना जाएगा, उस दिन नहीं जब वह भरा गया था।",
    consequence:
      "30 दिन निकल गए तो जिस दिन आप सत्यापित करेंगे वही आपके रिटर्न भरने की तारीख़ मानी जाएगी। समय पर गया रिटर्न देर से गया रिटर्न बन जाता है, और [[section-234f|धारा 234F का शुल्क]] तथा [[section-234a|धारा 234A का ब्याज]] उसी बाद वाली तारीख़ से लगते हैं। घड़ी चलती रहती है और कोई चेतावनी नहीं आती।",
    routesLabel: "यह डेमो जो रास्ता लेता है",
    routesSummary: (count: number) => `पोर्टल के बाकी ${count} रास्ते`,
    needsLabel: "इसके लिए क्या चाहिए",
    demoRouteLabel: "आधार OTP",
    action: "इस डेमो रिटर्न को ई-सत्यापित करें",
    actionNote:
      "यह आधार OTP वाले रास्ते की नकल भर है। कोई OTP नहीं भेजा जाता, किसी नंबर से संपर्क नहीं होता, और कुछ भी इस डिवाइस से बाहर नहीं जाता।",
    doneNote:
      "डेमो में सत्यापित। असली फाइलिंग में यही वह क्षण होता है जब रिटर्न वैध बनता है, और विभाग उसे तथा रिफ़ंड को आगे बढ़ाना शुरू करता है।",
    referenceLabel: "सत्यापन संदर्भ",
    verifiedAtLabel: "सत्यापन का समय",
    paperNote:
      "इनमें से एक रास्ता इलेक्ट्रॉनिक नहीं है और आज पूरा नहीं होता। चुनने से पहले पढ़ लें कि उसमें क्या लगता है।",
  },
};

const DAY_MS = 86_400_000;

/** The last day the return can be verified on, from when it was filed. */
export const verifyDeadline = (filedAt: Date): Date =>
  new Date(filedAt.getTime() + VERIFY_WINDOW_DAYS * DAY_MS);

/**
 * Whole days left to verify, counting from `now`. Negative once the window has
 * closed, so a caller can tell "today is the last day" from "too late".
 */
export const daysToVerify = (filedAt: Date, now: Date): number =>
  /* Capped at the window itself. A clock read a moment before the filing it is
     counting from would otherwise report 31 days on a 30-day window. */
  Math.min(
    VERIFY_WINDOW_DAYS,
    Math.ceil((verifyDeadline(filedAt).getTime() - now.getTime()) / DAY_MS),
  );
