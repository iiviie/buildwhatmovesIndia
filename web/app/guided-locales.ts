import type { Language } from "./case-data";

type GuidedLocaleCopy = {
  home: {
    eyebrow: string;
    title: string;
    intro: string;
    cardTitle: string;
    personLabel: string;
    person: string;
    timeLabel: string;
    time: string;
    privacyLabel: string;
    data: string;
    start: string;
    flow: [string, string, string, string];
    flowLabel: string;
    more: string;
  };
  check: {
    title: string;
    intro: string;
    situation: string;
    work: string;
    workValue: string;
    income: string;
    incomeValue: string;
    otherIncome: string;
    otherIncomeValue: string;
    shares: string;
    none: string;
    chosen: string;
    changeAnswers: string;
    reviewDetails: string;
  };
  salary: {
    title: string;
    intro: string;
    documents: string;
    safety: (limit: number) => string;
    view: string;
    useDemo: string;
    found: string;
    salary: string;
    taxPaid: string;
    sources: string;
  };
  income: {
    title: string;
    intro: string;
    question: (current: number, total: number) => string;
    previous: string;
    next: string;
  };
  regime: {
    title: string;
    intro: string;
    comparison: string;
    lowerTax: string;
    totals: string;
    saves: (amount: string) => string;
    totalTax: string;
    calculation: string;
  };
  checks: {
    ready: string;
    fix: string;
    intro: string;
    details: string;
    guidance: string;
  };
  review: {
    title: string;
    intro: string;
    refundAccount: string;
    chooseAccount: string;
    summary: string;
    taxPaid: string;
    ready: string;
    incomeDetails: string;
    taxDetails: string;
  };
  receipt: {
    verified: string;
    unverified: string;
    verifiedIntro: string;
    unverifiedIntro: string;
    summary: string;
    details: string;
  };
};

const en: GuidedLocaleCopy = {
  home: { eyebrow: "Guided salaried return demo", title: "Answer simple questions. We will build the return.", intro: "You do not need to know forms, sections, or tax regimes. We only ask what you can answer.", cardTitle: "Try a fictional salaried return", personLabel: "Demo person", person: "Ananya Rao", timeLabel: "Time", time: "About 5 minutes", privacyLabel: "Privacy", data: "No real data", start: "Start the guided demo", flow: ["Confirm details", "Recognise income", "Pick the lower tax", "Check and file"], flowLabel: "Four parts of the demo", more: "Other tax tasks, notices, and help" },
  check: { title: "Does this sound like you?", intro: "We worked these out from the fictional records already on file.", situation: "Your situation", work: "Work", workValue: "Private salaried job", income: "Income", incomeValue: "Under ₹50 lakh", otherIncome: "Other income", otherIncomeValue: "Bank interest and dividends", shares: "Shares or business", none: "None", chosen: "Chosen for you", changeAnswers: "Something is wrong? Change the answers", reviewDetails: "Review name, contact, and refund account" },
  salary: { title: "Add your salary documents", intro: "Use a Form 16 and AIS. We read the figures and show you what we found.", documents: "Two documents", safety: (limit) => `PDF or photo, up to ${limit} MB each. Do not add real documents to this demo.`, view: "View", useDemo: "Use fictional demo documents", found: "Here is what we found", salary: "Salary", taxPaid: "Tax already paid by employer", sources: "Where these amounts came from" },
  income: { title: "Do you recognise this income?", intro: "For each payment, choose yes, wrong amount, or not mine.", question: (current, total) => `Question ${current} of ${total}`, previous: "Previous income", next: "Next income" },
  regime: { title: "First, check your tax savings", intro: "We matched everyday payments to the right deductions. You do not need to know the section numbers.", comparison: "Your comparison", lowerTax: "Which option leaves you with less tax?", totals: "Both totals now include the amounts checked above.", saves: (amount) => `Saves ${amount}`, totalTax: "Total tax for this year", calculation: "See the calculation and deductions" },
  checks: { ready: "Your return is ready", fix: "There is something to fix", intro: "We checked the common mistakes before anything is filed.", details: "See all four checks", guidance: "Official guidance on section 139(9)" },
  review: { title: "One last look", intro: "The result comes first. Open the totals only if you want to check them.", refundAccount: "Refund goes to", chooseAccount: "Choose an account", summary: "Return summary", taxPaid: "Tax already paid", ready: "Ready to file", incomeDetails: "See the income total", taxDetails: "See the tax total" },
  receipt: { verified: "Your return is filed and verified", unverified: "Return submitted. Verify it now", verifiedIntro: "You are done. Keep the receipt for your records.", unverifiedIntro: "Verify it now to finish.", summary: "Filing receipt summary", details: "View full receipt" },
};

const hi: GuidedLocaleCopy = {
  home: { eyebrow: "वेतनभोगी रिटर्न का निर्देशित डेमो", title: "सवालों के जवाब दें। रिटर्न हम तैयार करेंगे।", intro: "आपको फॉर्म, धारा या कर व्यवस्था जानने की जरूरत नहीं। हम सिर्फ़ वही पूछेंगे जो आप बता सकते हैं।", cardTitle: "काल्पनिक वेतनभोगी रिटर्न आज़माएँ", personLabel: "डेमो व्यक्ति", person: "अनन्या राव", timeLabel: "समय", time: "लगभग 5 मिनट", privacyLabel: "गोपनीयता", data: "कोई असली डेटा नहीं", start: "निर्देशित डेमो शुरू करें", flow: ["विवरण की पुष्टि", "आय पहचानें", "कम कर चुनें", "जाँचकर फाइल करें"], flowLabel: "डेमो के चार भाग", more: "अन्य कर सेवाएँ, नोटिस और मदद देखें" },
  check: { title: "क्या ये बातें आप पर लागू होती हैं?", intro: "हमने विभाग के काल्पनिक रिकॉर्ड से ये बातें पहले ही पता कर ली हैं।", situation: "आपकी स्थिति", work: "काम", workValue: "निजी नौकरी", income: "आय", incomeValue: "₹50 लाख से कम", otherIncome: "अन्य आय", otherIncomeValue: "बैंक ब्याज और लाभांश", shares: "शेयर या व्यापार", none: "कोई नहीं", chosen: "हमने आपके लिए चुना", changeAnswers: "कुछ गलत है? जवाब बदलें", reviewDetails: "नाम, संपर्क और रिफ़ंड खाता देखें" },
  salary: { title: "अपने वेतन के कागज़ जोड़ें", intro: "फॉर्म 16 और AIS इस्तेमाल करें। हम रकम पढ़कर आपको दिखाएँगे।", documents: "दो कागज़ चाहिए", safety: (limit) => `PDF या फोटो, हर फ़ाइल ${limit} MB तक। इस डेमो में असली कागज़ न डालें।`, view: "देखें", useDemo: "काल्पनिक कागज़ इस्तेमाल करें", found: "हमें यह मिला", salary: "कुल वेतन", taxPaid: "नियोक्ता ने पहले ही कर दिया", sources: "रकम कहाँ से आई और पोर्टल उसे क्या कहता है" },
  income: { title: "क्या आप इन पैसों को पहचानते हैं?", intro: "हर लाइन पर बस हाँ, रकम गलत है, या नहीं चुनें।", question: (current, total) => `सवाल ${current}, कुल ${total}`, previous: "पिछली आय", next: "अगली आय" },
  regime: { title: "पहले आपकी कर बचत जाँच लेते हैं", intro: "हमने रोज़मर्रा के भुगतान को सही कर कटौती से मिलाया है। आपको धाराएँ याद रखने की ज़रूरत नहीं।", comparison: "आपकी तुलना", lowerTax: "कौन सा विकल्प आपका कर कम करता है?", totals: "हमने ऊपर की रकम समेत दोनों व्यवस्थाओं की गणना कर दी है।", saves: (amount) => `${amount} बचते हैं`, totalTax: "इस साल का कुल कर", calculation: "गणना और कटौतियाँ देखें" },
  checks: { ready: "आपका रिटर्न तैयार है", fix: "एक बात ठीक करनी है", intro: "फाइल करने से पहले हमने आम गलतियाँ जाँच ली हैं।", details: "चारों जाँच देखें", guidance: "धारा 139(9) पर आधिकारिक जानकारी" },
  review: { title: "एक आखिरी नज़र", intro: "नतीजा पहले। जरूरत हो तो पूरी रकम नीचे देख सकते हैं।", refundAccount: "रिफ़ंड इस खाते में आएगा", chooseAccount: "खाता चुनें", summary: "रिटर्न का सार", taxPaid: "पहले से जमा कर", ready: "फाइल करने के लिए तैयार", incomeDetails: "आय का हिसाब देखें", taxDetails: "कर का हिसाब देखें" },
  receipt: { verified: "रिटर्न फाइल और सत्यापित हो गया", unverified: "रिटर्न जमा हुआ। अब सत्यापन करें", verifiedIntro: "सब हो गया। रसीद अपने रिकॉर्ड के लिए रख लें।", unverifiedIntro: "इसे पूरा करने के लिए अब सत्यापन करें।", summary: "फाइलिंग रसीद का सार", details: "पूरी रसीद देखें" },
};

const bn: GuidedLocaleCopy = {
  home: { eyebrow: "বেতনভোগীদের রিটার্নের নির্দেশিত ডেমো", title: "সহজ প্রশ্নের উত্তর দিন। রিটার্ন আমরা তৈরি করব।", intro: "ফর্ম, ধারা বা কর ব্যবস্থা জানার দরকার নেই। আপনি যা বলতে পারেন, আমরা শুধু সেটাই জিজ্ঞেস করি।", cardTitle: "একটি কাল্পনিক বেতনভোগী রিটার্ন চেষ্টা করুন", personLabel: "ডেমো ব্যক্তি", person: "অনন্যা রাও", timeLabel: "সময়", time: "প্রায় ৫ মিনিট", privacyLabel: "গোপনীয়তা", data: "কোনো আসল তথ্য নয়", start: "নির্দেশিত ডেমো শুরু করুন", flow: ["তথ্য নিশ্চিত করুন", "আয় শনাক্ত করুন", "কম কর বাছুন", "যাচাই করে ফাইল করুন"], flowLabel: "ডেমোর চারটি অংশ", more: "অন্যান্য করের কাজ, নোটিস ও সহায়তা" },
  check: { title: "এই তথ্যগুলি কি আপনার ক্ষেত্রে ঠিক?", intro: "ফাইলে থাকা কাল্পনিক রেকর্ড থেকে আমরা এগুলি বের করেছি।", situation: "আপনার পরিস্থিতি", work: "কাজ", workValue: "বেসরকারি বেতনভোগী চাকরি", income: "আয়", incomeValue: "₹৫০ লক্ষের নিচে", otherIncome: "অন্যান্য আয়", otherIncomeValue: "ব্যাঙ্কের সুদ ও লভ্যাংশ", shares: "শেয়ার বা ব্যবসা", none: "কিছুই নেই", chosen: "আপনার জন্য বাছাই করা", changeAnswers: "কিছু ভুল? উত্তর বদলান", reviewDetails: "নাম, যোগাযোগ ও রিফান্ড অ্যাকাউন্ট দেখুন" },
  salary: { title: "আপনার বেতনের নথি যোগ করুন", intro: "ফর্ম ১৬ ও AIS ব্যবহার করুন। আমরা অঙ্ক পড়ে যা পেয়েছি তা দেখাব।", documents: "দুটি নথি", safety: (limit) => `PDF বা ছবি, প্রতিটি ${limit} MB পর্যন্ত। এই ডেমোতে আসল নথি দেবেন না।`, view: "দেখুন", useDemo: "কাল্পনিক ডেমো নথি ব্যবহার করুন", found: "আমরা যা পেয়েছি", salary: "বেতন", taxPaid: "নিয়োগকর্তার জমা দেওয়া কর", sources: "এই অঙ্কগুলি কোথা থেকে এসেছে" },
  income: { title: "আপনি কি এই আয় চিনতে পারছেন?", intro: "প্রতিটি পেমেন্টে হ্যাঁ, অঙ্ক ভুল, অথবা আমার নয় বাছুন।", question: (current, total) => `প্রশ্ন ${current}/${total}`, previous: "আগের আয়", next: "পরের আয়" },
  regime: { title: "আগে আপনার কর সাশ্রয় দেখুন", intro: "আমরা দৈনন্দিন পেমেন্ট সঠিক কর ছাড়ের সঙ্গে মিলিয়েছি। ধারার নম্বর মনে রাখার দরকার নেই।", comparison: "আপনার তুলনা", lowerTax: "কোন বিকল্পে আপনার কর কম?", totals: "উপরের অঙ্কসহ দুটি ব্যবস্থাই হিসাব করা হয়েছে।", saves: (amount) => `${amount} সাশ্রয়`, totalTax: "এই বছরের মোট কর", calculation: "হিসাব ও ছাড় দেখুন" },
  checks: { ready: "আপনার রিটার্ন প্রস্তুত", fix: "একটি বিষয় ঠিক করতে হবে", intro: "ফাইল করার আগে সাধারণ ভুলগুলি আমরা পরীক্ষা করেছি।", details: "চারটি পরীক্ষাই দেখুন", guidance: "ধারা ১৩৯(৯)-এর সরকারি নির্দেশিকা" },
  review: { title: "আর একবার দেখে নিন", intro: "ফলাফল আগে। চাইলে নিচে পুরো হিসাব খুলে দেখুন।", refundAccount: "রিফান্ড যাবে", chooseAccount: "অ্যাকাউন্ট বাছুন", summary: "রিটার্নের সারাংশ", taxPaid: "আগেই জমা কর", ready: "ফাইল করার জন্য প্রস্তুত", incomeDetails: "আয়ের মোট দেখুন", taxDetails: "করের মোট দেখুন" },
  receipt: { verified: "রিটার্ন ফাইল ও যাচাই হয়েছে", unverified: "রিটার্ন জমা হয়েছে। এখন যাচাই করুন", verifiedIntro: "কাজ শেষ। রসিদটি আপনার নথির জন্য রাখুন।", unverifiedIntro: "শেষ করতে এখনই যাচাই করুন।", summary: "ফাইলিং রসিদের সারাংশ", details: "সম্পূর্ণ রসিদ দেখুন" },
};

const ta: GuidedLocaleCopy = {
  home: { eyebrow: "சம்பள வருமான வரித் தாக்கலுக்கான வழிகாட்டி மாதிரி", title: "எளிய கேள்விகளுக்குப் பதிலளியுங்கள். வருமான வரிக் கணக்கை நாங்கள் உருவாக்குவோம்.", intro: "படிவங்கள், பிரிவுகள் அல்லது வரி முறைகளை நீங்கள் அறிந்திருக்க வேண்டியதில்லை.", cardTitle: "கற்பனையான சம்பள வருமான வரிக் கணக்கை முயற்சிக்கவும்", personLabel: "மாதிரி நபர்", person: "அனன்யா ராவ்", timeLabel: "நேரம்", time: "சுமார் 5 நிமிடங்கள்", privacyLabel: "தனியுரிமை", data: "உண்மையான தரவு இல்லை", start: "வழிகாட்டி மாதிரியைத் தொடங்கவும்", flow: ["விவரங்களை உறுதிசெய்யவும்", "வருமானத்தை அடையாளம் காணவும்", "குறைந்த வரியைத் தேர்ந்தெடுக்கவும்", "சரிபார்த்து தாக்கல் செய்யவும்"], flowLabel: "மாதிரியின் நான்கு பகுதிகள்", more: "பிற வரிப் பணிகள், அறிவிப்புகள் மற்றும் உதவி" },
  check: { title: "இந்த விவரங்கள் உங்களுக்குப் பொருந்துகிறதா?", intro: "கோப்பில் உள்ள கற்பனைப் பதிவுகளிலிருந்து இவற்றைக் கண்டறிந்தோம்.", situation: "உங்கள் நிலை", work: "வேலை", workValue: "தனியார் நிறுவன சம்பள வேலை", income: "வருமானம்", incomeValue: "₹50 லட்சத்திற்குக் கீழ்", otherIncome: "பிற வருமானம்", otherIncomeValue: "வங்கி வட்டி மற்றும் பங்காதாயம்", shares: "பங்குகள் அல்லது வணிகம்", none: "இல்லை", chosen: "உங்களுக்காகத் தேர்ந்தெடுக்கப்பட்டது", changeAnswers: "ஏதேனும் தவறா? பதில்களை மாற்றவும்", reviewDetails: "பெயர், தொடர்பு மற்றும் பணத்தைத் திரும்பப்பெறும் கணக்கைச் சரிபார்க்கவும்" },
  salary: { title: "உங்கள் சம்பள ஆவணங்களைச் சேர்க்கவும்", intro: "படிவம் 16 மற்றும் AIS-ஐப் பயன்படுத்துங்கள். தொகைகளைப் படித்து கண்டறிந்ததை நாங்கள் காட்டுவோம்.", documents: "இரண்டு ஆவணங்கள்", safety: (limit) => `PDF அல்லது படம், ஒவ்வொன்றும் ${limit} MB வரை. இந்த மாதிரியில் உண்மையான ஆவணங்களைச் சேர்க்க வேண்டாம்.`, view: "பார்க்கவும்", useDemo: "கற்பனை மாதிரி ஆவணங்களைப் பயன்படுத்தவும்", found: "நாங்கள் கண்டறிந்தது", salary: "சம்பளம்", taxPaid: "நிறுவனம் ஏற்கனவே செலுத்திய வரி", sources: "இந்தத் தொகைகள் எங்கிருந்து வந்தன" },
  income: { title: "இந்த வருமானத்தை நீங்கள் அடையாளம் காண்கிறீர்களா?", intro: "ஒவ்வொரு தொகைக்கும் ஆம், தொகை தவறு அல்லது என்னுடையது அல்ல என்பதைத் தேர்ந்தெடுக்கவும்.", question: (current, total) => `கேள்வி ${current}/${total}`, previous: "முந்தைய வருமானம்", next: "அடுத்த வருமானம்" },
  regime: { title: "முதலில் உங்கள் வரிச் சேமிப்பைப் பார்க்கலாம்", intro: "அன்றாடச் செலுத்துதல்களைச் சரியான வரிக் கழிவுகளுடன் பொருத்தியுள்ளோம். பிரிவு எண்களை நினைவில் வைத்திருக்க வேண்டியதில்லை.", comparison: "உங்கள் ஒப்பீடு", lowerTax: "எந்தத் தேர்வில் உங்கள் வரி குறையும்?", totals: "மேலே சரிபார்த்த தொகைகளுடன் இரண்டு முறைகளும் கணக்கிடப்பட்டுள்ளன.", saves: (amount) => `${amount} சேமிப்பு`, totalTax: "இந்த ஆண்டிற்கான மொத்த வரி", calculation: "கணக்கீடு மற்றும் கழிவுகளைப் பார்க்கவும்" },
  checks: { ready: "உங்கள் வருமான வரிக் கணக்கு தயாராக உள்ளது", fix: "ஒரு விஷயத்தைச் சரிசெய்ய வேண்டும்", intro: "தாக்கல் செய்வதற்கு முன் பொதுவான தவறுகளைச் சரிபார்த்தோம்.", details: "நான்கு சரிபார்ப்புகளையும் பார்க்கவும்", guidance: "பிரிவு 139(9) குறித்த அதிகாரப்பூர்வ வழிகாட்டுதல்" },
  review: { title: "கடைசியாக ஒரு முறை பாருங்கள்", intro: "முடிவு முதலில். விரும்பினால் முழுத் தொகைகளையும் கீழே பார்க்கலாம்.", refundAccount: "பணத்தைத் திரும்பப்பெறும் கணக்கு", chooseAccount: "ஒரு கணக்கைத் தேர்ந்தெடுக்கவும்", summary: "வருமான வரிக் கணக்கின் சுருக்கம்", taxPaid: "ஏற்கனவே செலுத்திய வரி", ready: "தாக்கல் செய்யத் தயார்", incomeDetails: "மொத்த வருமானத்தைப் பார்க்கவும்", taxDetails: "மொத்த வரியைப் பார்க்கவும்" },
  receipt: { verified: "வருமான வரிக் கணக்கு தாக்கல் செய்யப்பட்டு சரிபார்க்கப்பட்டது", unverified: "வருமான வரிக் கணக்கு சமர்ப்பிக்கப்பட்டது. இப்போது சரிபார்க்கவும்", verifiedIntro: "முடிந்தது. ரசீதை உங்கள் பதிவுகளுக்காக வைத்திருங்கள்.", unverifiedIntro: "முடிக்க இப்போது சரிபார்க்கவும்.", summary: "தாக்கல் ரசீதின் சுருக்கம்", details: "முழு ரசீதையும் பார்க்கவும்" },
};

const mr: GuidedLocaleCopy = {
  home: { eyebrow: "पगारदार रिटर्नचा मार्गदर्शित डेमो", title: "सोप्या प्रश्नांची उत्तरे द्या. रिटर्न आम्ही तयार करू.", intro: "तुम्हाला फॉर्म, कलमे किंवा कर पद्धती माहिती असण्याची गरज नाही.", cardTitle: "काल्पनिक पगारदार रिटर्न वापरून पाहा", personLabel: "डेमो व्यक्ती", person: "अनन्या राव", timeLabel: "वेळ", time: "सुमारे ५ मिनिटे", privacyLabel: "गोपनीयता", data: "खरा डेटा नाही", start: "मार्गदर्शित डेमो सुरू करा", flow: ["तपशीलांची खात्री करा", "उत्पन्न ओळखा", "कमी कर निवडा", "तपासून फाइल करा"], flowLabel: "डेमोचे चार भाग", more: "इतर कर कामे, नोटिसा आणि मदत" },
  check: { title: "ही माहिती तुम्हाला लागू होते का?", intro: "फाइलमध्ये आधीपासून असलेल्या काल्पनिक नोंदींमधून आम्ही हे ठरवले.", situation: "तुमची स्थिती", work: "काम", workValue: "खासगी पगारदार नोकरी", income: "उत्पन्न", incomeValue: "₹५० लाखांपेक्षा कमी", otherIncome: "इतर उत्पन्न", otherIncomeValue: "बँक व्याज आणि लाभांश", shares: "शेअर्स किंवा व्यवसाय", none: "काहीही नाही", chosen: "तुमच्यासाठी निवडले", changeAnswers: "काही चूक आहे? उत्तरे बदला", reviewDetails: "नाव, संपर्क आणि परतावा खाते तपासा" },
  salary: { title: "तुमच्या पगाराची कागदपत्रे जोडा", intro: "फॉर्म १६ आणि AIS वापरा. रकमा वाचून आम्हाला काय सापडले ते दाखवू.", documents: "दोन कागदपत्रे", safety: (limit) => `PDF किंवा फोटो, प्रत्येक ${limit} MB पर्यंत. या डेमोमध्ये खरी कागदपत्रे जोडू नका.`, view: "पाहा", useDemo: "काल्पनिक डेमो कागदपत्रे वापरा", found: "आम्हाला हे सापडले", salary: "पगार", taxPaid: "नियोक्त्याने आधीच भरलेला कर", sources: "या रकमा कुठून आल्या" },
  income: { title: "हे उत्पन्न तुम्ही ओळखता का?", intro: "प्रत्येक रकमेसाठी होय, रक्कम चुकीची किंवा माझी नाही हे निवडा.", question: (current, total) => `प्रश्न ${current}/${total}`, previous: "मागील उत्पन्न", next: "पुढील उत्पन्न" },
  regime: { title: "आधी तुमची कर बचत तपासूया", intro: "रोजच्या देयकांना योग्य कर वजावटीशी जुळवले आहे. कलम क्रमांक लक्षात ठेवण्याची गरज नाही.", comparison: "तुमची तुलना", lowerTax: "कोणत्या पर्यायात तुमचा कर कमी होतो?", totals: "वरील रकमा धरून दोन्ही पद्धती मोजल्या आहेत.", saves: (amount) => `${amount} बचत`, totalTax: "या वर्षाचा एकूण कर", calculation: "गणना आणि वजावटी पाहा" },
  checks: { ready: "तुमचा रिटर्न तयार आहे", fix: "एक गोष्ट दुरुस्त करायची आहे", intro: "फाइल करण्यापूर्वी सामान्य चुका तपासल्या आहेत.", details: "चारही तपासण्या पाहा", guidance: "कलम 139(9) वरील अधिकृत मार्गदर्शन" },
  review: { title: "शेवटची एक नजर", intro: "निकाल आधी. हवे असल्यास खाली संपूर्ण रकमा पाहा.", refundAccount: "परतावा या खात्यात", chooseAccount: "खाते निवडा", summary: "रिटर्नचा सारांश", taxPaid: "आधीच भरलेला कर", ready: "फाइल करण्यासाठी तयार", incomeDetails: "एकूण उत्पन्न पाहा", taxDetails: "एकूण कर पाहा" },
  receipt: { verified: "रिटर्न फाइल आणि सत्यापित झाला", unverified: "रिटर्न सादर झाला. आता सत्यापित करा", verifiedIntro: "काम पूर्ण झाले. पावती नोंदीसाठी ठेवा.", unverifiedIntro: "पूर्ण करण्यासाठी आता सत्यापित करा.", summary: "फाइलिंग पावतीचा सारांश", details: "संपूर्ण पावती पाहा" },
};

const te: GuidedLocaleCopy = {
  home: { eyebrow: "జీతభత్యాల రిటర్న్ మార్గదర్శక డెమో", title: "సులభమైన ప్రశ్నలకు సమాధానం ఇవ్వండి. రిటర్న్‌ను మేము సిద్ధం చేస్తాం.", intro: "ఫారమ్‌లు, సెక్షన్‌లు లేదా పన్ను విధానాలు మీకు తెలియాల్సిన అవసరం లేదు.", cardTitle: "కల్పిత జీతభత్యాల రిటర్న్‌ను ప్రయత్నించండి", personLabel: "డెమో వ్యక్తి", person: "అనన్య రావు", timeLabel: "సమయం", time: "సుమారు 5 నిమిషాలు", privacyLabel: "గోప్యత", data: "నిజమైన డేటా లేదు", start: "మార్గదర్శక డెమోను ప్రారంభించండి", flow: ["వివరాలను నిర్ధారించండి", "ఆదాయాన్ని గుర్తించండి", "తక్కువ పన్నును ఎంచుకోండి", "తనిఖీ చేసి ఫైల్ చేయండి"], flowLabel: "డెమోలోని నాలుగు భాగాలు", more: "ఇతర పన్ను పనులు, నోటీసులు మరియు సహాయం" },
  check: { title: "ఈ వివరాలు మీకు వర్తిస్తాయా?", intro: "ఫైల్‌లో ఉన్న కల్పిత రికార్డుల నుంచి వీటిని నిర్ణయించాం.", situation: "మీ పరిస్థితి", work: "ఉద్యోగం", workValue: "ప్రైవేట్ జీతభత్యాల ఉద్యోగం", income: "ఆదాయం", incomeValue: "₹50 లక్షల లోపు", otherIncome: "ఇతర ఆదాయం", otherIncomeValue: "బ్యాంకు వడ్డీ మరియు డివిడెండ్‌లు", shares: "షేర్లు లేదా వ్యాపారం", none: "ఏదీ లేదు", chosen: "మీ కోసం ఎంచుకున్నది", changeAnswers: "ఏదైనా తప్పుగా ఉందా? సమాధానాలను మార్చండి", reviewDetails: "పేరు, సంప్రదింపు మరియు రీఫండ్ ఖాతాను పరిశీలించండి" },
  salary: { title: "మీ జీతపు పత్రాలను జోడించండి", intro: "ఫారమ్ 16 మరియు AIS ఉపయోగించండి. మొత్తాలను చదివి మాకు దొరికినవి చూపిస్తాం.", documents: "రెండు పత్రాలు", safety: (limit) => `PDF లేదా ఫోటో, ఒక్కొక్కటి ${limit} MB వరకు. ఈ డెమోలో నిజమైన పత్రాలు జోడించవద్దు.`, view: "చూడండి", useDemo: "కల్పిత డెమో పత్రాలను ఉపయోగించండి", found: "మాకు దొరికినవి", salary: "జీతం", taxPaid: "యజమాని ఇప్పటికే చెల్లించిన పన్ను", sources: "ఈ మొత్తాలు ఎక్కడి నుంచి వచ్చాయి" },
  income: { title: "ఈ ఆదాయాన్ని మీరు గుర్తించారా?", intro: "ప్రతి చెల్లింపుకు అవును, మొత్తం తప్పు లేదా నాది కాదు అని ఎంచుకోండి.", question: (current, total) => `ప్రశ్న ${current}/${total}`, previous: "మునుపటి ఆదాయం", next: "తదుపరి ఆదాయం" },
  regime: { title: "ముందుగా మీ పన్ను ఆదాను పరిశీలిద్దాం", intro: "రోజువారీ చెల్లింపులను సరైన పన్ను మినహాయింపులతో సరిపోల్చాం. సెక్షన్ నంబర్లు గుర్తుంచుకోవాల్సిన అవసరం లేదు.", comparison: "మీ పోలిక", lowerTax: "ఏ ఎంపికలో మీ పన్ను తక్కువగా ఉంటుంది?", totals: "పైన తనిఖీ చేసిన మొత్తాలతో రెండు విధానాలనూ లెక్కించాం.", saves: (amount) => `${amount} ఆదా`, totalTax: "ఈ సంవత్సరపు మొత్తం పన్ను", calculation: "లెక్కింపు మరియు మినహాయింపులను చూడండి" },
  checks: { ready: "మీ రిటర్న్ సిద్ధంగా ఉంది", fix: "ఒక విషయం సరిచేయాలి", intro: "ఫైల్ చేసే ముందు సాధారణ తప్పులను తనిఖీ చేశాం.", details: "నాలుగు తనిఖీలను చూడండి", guidance: "సెక్షన్ 139(9)పై అధికారిక మార్గదర్శకం" },
  review: { title: "చివరిసారి ఒకసారి చూడండి", intro: "ఫలితం ముందుగా ఉంటుంది. కావాలంటే పూర్తి మొత్తాలను కింద చూడండి.", refundAccount: "రీఫండ్ వెళ్లే ఖాతా", chooseAccount: "ఖాతాను ఎంచుకోండి", summary: "రిటర్న్ సారాంశం", taxPaid: "ఇప్పటికే చెల్లించిన పన్ను", ready: "ఫైల్ చేయడానికి సిద్ధం", incomeDetails: "మొత్తం ఆదాయాన్ని చూడండి", taxDetails: "మొత్తం పన్నును చూడండి" },
  receipt: { verified: "రిటర్న్ ఫైల్ చేసి ధృవీకరించబడింది", unverified: "రిటర్న్ సమర్పించబడింది. ఇప్పుడు ధృవీకరించండి", verifiedIntro: "పూర్తయింది. రసీదును మీ రికార్డుల కోసం ఉంచుకోండి.", unverifiedIntro: "పూర్తి చేయడానికి ఇప్పుడు ధృవీకరించండి.", summary: "ఫైలింగ్ రసీదు సారాంశం", details: "పూర్తి రసీదును చూడండి" },
};

const ur: GuidedLocaleCopy = {
  home: { eyebrow: "تنخواہ دار ریٹرن کا رہنمائی شدہ ڈیمو", title: "آسان سوالوں کے جواب دیں۔ ریٹرن ہم تیار کریں گے۔", intro: "آپ کو فارم، دفعات یا ٹیکس نظام جاننے کی ضرورت نہیں۔ ہم صرف وہ پوچھتے ہیں جس کا آپ جواب دے سکتے ہیں۔", cardTitle: "ایک فرضی تنخواہ دار ریٹرن آزمائیں", personLabel: "ڈیمو شخص", person: "اننیا راؤ", timeLabel: "وقت", time: "تقریباً 5 منٹ", privacyLabel: "رازداری", data: "کوئی حقیقی ڈیٹا نہیں", start: "رہنمائی شدہ ڈیمو شروع کریں", flow: ["تفصیلات کی تصدیق", "آمدنی پہچانیں", "کم ٹیکس منتخب کریں", "جانچ کر فائل کریں"], flowLabel: "ڈیمو کے چار حصے", more: "دیگر ٹیکس کام، نوٹس اور مدد" },
  check: { title: "کیا یہ معلومات آپ پر لاگو ہوتی ہیں؟", intro: "ہم نے فائل میں موجود فرضی ریکارڈ سے یہ معلومات نکالی ہیں۔", situation: "آپ کی صورتحال", work: "کام", workValue: "نجی تنخواہ دار ملازمت", income: "آمدنی", incomeValue: "₹50 لاکھ سے کم", otherIncome: "دیگر آمدنی", otherIncomeValue: "بینک سود اور منافع", shares: "حصص یا کاروبار", none: "کوئی نہیں", chosen: "آپ کے لیے منتخب", changeAnswers: "کچھ غلط ہے؟ جواب بدلیں", reviewDetails: "نام، رابطہ اور ریفنڈ اکاؤنٹ دیکھیں" },
  salary: { title: "اپنی تنخواہ کے دستاویزات شامل کریں", intro: "فارم 16 اور AIS استعمال کریں۔ ہم رقمیں پڑھ کر حاصل شدہ معلومات دکھائیں گے۔", documents: "دو دستاویزات", safety: (limit) => `PDF یا تصویر، ہر ایک ${limit} MB تک۔ اس ڈیمو میں حقیقی دستاویزات شامل نہ کریں۔`, view: "دیکھیں", useDemo: "فرضی ڈیمو دستاویزات استعمال کریں", found: "ہمیں یہ ملا", salary: "تنخواہ", taxPaid: "آجر کا پہلے سے ادا کردہ ٹیکس", sources: "یہ رقمیں کہاں سے آئیں" },
  income: { title: "کیا آپ اس آمدنی کو پہچانتے ہیں؟", intro: "ہر ادائیگی کے لیے ہاں، رقم غلط ہے یا یہ میری نہیں منتخب کریں۔", question: (current, total) => `سوال ${current}/${total}`, previous: "پچھلی آمدنی", next: "اگلی آمدنی" },
  regime: { title: "پہلے اپنی ٹیکس بچت دیکھیں", intro: "ہم نے روزمرہ ادائیگیوں کو درست ٹیکس کٹوتیوں سے ملایا ہے۔ آپ کو دفعہ نمبرز یاد رکھنے کی ضرورت نہیں۔", comparison: "آپ کا موازنہ", lowerTax: "کس انتخاب میں آپ کا ٹیکس کم ہے؟", totals: "اوپر جانچی گئی رقموں سمیت دونوں نظاموں کا حساب کیا گیا ہے۔", saves: (amount) => `${amount} کی بچت`, totalTax: "اس سال کا کل ٹیکس", calculation: "حساب اور کٹوتیاں دیکھیں" },
  checks: { ready: "آپ کا ریٹرن تیار ہے", fix: "ایک چیز درست کرنی ہے", intro: "فائل کرنے سے پہلے ہم نے عام غلطیاں جانچ لی ہیں۔", details: "چاروں جانچیں دیکھیں", guidance: "دفعہ 139(9) پر سرکاری رہنمائی" },
  review: { title: "ایک آخری نظر", intro: "نتیجہ پہلے ہے۔ چاہیں تو نیچے مکمل رقمیں دیکھیں۔", refundAccount: "ریفنڈ اس اکاؤنٹ میں", chooseAccount: "اکاؤنٹ منتخب کریں", summary: "ریٹرن کا خلاصہ", taxPaid: "پہلے سے ادا ٹیکس", ready: "فائل کرنے کے لیے تیار", incomeDetails: "کل آمدنی دیکھیں", taxDetails: "کل ٹیکس دیکھیں" },
  receipt: { verified: "ریٹرن فائل اور تصدیق ہو گیا", unverified: "ریٹرن جمع ہو گیا۔ اب تصدیق کریں", verifiedIntro: "کام مکمل ہے۔ رسید اپنے ریکارڈ کے لیے رکھیں۔", unverifiedIntro: "مکمل کرنے کے لیے اب تصدیق کریں۔", summary: "فائلنگ رسید کا خلاصہ", details: "مکمل رسید دیکھیں" },
};

export const guidedLocaleCopy: Record<Language, GuidedLocaleCopy> = {
  en,
  hi,
  bn,
  ta,
  mr,
  te,
  ur,
};
