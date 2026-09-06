"use client";

import { useState } from "react";
import type { Language, TaxInboxDonationStatus } from "../case-data";
import { AlertIcon, ArrowIcon, CheckIcon, FileIcon } from "./icons";

const translations = {
  en: {
    eyebrow: "Tax Inbox · Financial year 2025–26",
    title: "Keep the proof. Forget the paperwork.",
    intro:
      "Save tax-relevant records when they happen. At filing time, we organise the evidence and ask you to verify only what needs attention.",
    safetyTitle: "A safe, fictional preview",
    safety:
      "Everything below is synthetic and stays on this device. Do not add real PAN, bank, salary or medical documents to this prototype.",
    ready: "Ready",
    review: "Needs review",
    unused: "Not used",
    recordsReady: "records ready",
    needsReview: "needs review",
    notTaxRelevant: "not tax-relevant",
    addTitle: "Try the year-round habit",
    addBody:
      "Ananya donated in January. Add the fictional receipt now and see what the inbox catches before filing season.",
    add: "Add fictional donation receipt",
    reading: "Reading the receipt…",
    added: "Receipt read. One missing proof was found.",
    reviewDonation: "Review missing proof",
    reviewTitle: "Complete this donation record",
    reviewIntro:
      "The receipt shows a payment, but it cannot establish an 80G claim by itself. Match Form 10BE before using it.",
    missing: "Missing",
    missingValue: "Form 10BE from the trust",
    foundAmount: "Donation found",
    eligibleAmount: "Eligible deduction after match",
    eligibilityValue: "₹5,500 · 50% of the donation · old regime only",
    addProof: "Add fictional Form 10BE",
    matching: "Matching certificate…",
    getLater: "I’ll get it later",
    exclude: "Do not claim this donation",
    matchedProof: "Matched to fictional Form 10BE · ₹5,500 eligible under old regime",
    resolved: "Donation verified. Its eligible amount is now included in the old-regime comparison.",
    excluded: "Donation excluded from this return.",
    excludedDetail: "You chose not to claim this donation. It will not affect the return.",
    reconsider: "Review this donation again",
    source: "Source",
    applicable: "Applicable",
    matched: "Matched",
    form16: "Form 16",
    form16Meta: "Kalpavriksha Software · 15 June 2026",
    form16Detail: "Salary, employer TDS and deductions extracted",
    ais: "AIS and Form 26AS",
    aisMeta: "Income Tax records · 18 June 2026",
    aisDetail: "Four income entries and tax credits ready to reconcile",
    health: "Health insurance premium",
    healthMeta: "Swasthya Shield · 12 March 2026",
    healthDetail: "₹25,000 · possible section 80D deduction",
    epf: "Employee provident fund",
    epfMeta: "Matched with Form 16 · 31 March 2026",
    epfDetail: "Already counted within the ₹1,50,000 section 80C total",
    shopping: "Supermarket receipt",
    shoppingMeta: "Apna Bazaar · 9 February 2026",
    shoppingDetail: "Ordinary purchases do not reduce salaried income tax",
    donation: "Donation to Udaan Education Trust",
    donationMeta: "Fictional receipt · 14 January 2026",
    donationDetail: "₹11,000 found · Form 10BE is still needed",
    oldOnly: "Old regime only",
    bothRecords: "Return evidence",
    prepareTitle: "Start with what is ready",
    prepareNotAddedBody:
      "Form 16 and AIS will be loaded into the guided return. You can return here later to add another fictional record.",
    prepareBody:
      "Form 16 and AIS will be loaded into the guided return. The donation stays out until its missing proof is reviewed.",
    prepareReadyBody:
      "Form 16, AIS and the verified donation deduction will be carried into the guided return for your review.",
    prepareExcludedBody:
      "Form 16 and AIS will be loaded into the guided return. The donation will stay out because you chose not to claim it.",
    prepare: "Prepare my return",
    back: "Back to dashboard",
  },
  hi: {
    eyebrow: "टैक्स इनबॉक्स · वित्त वर्ष 2025–26",
    title: "सबूत सँभालें। काग़ज़ी झंझट भूल जाएँ।",
    intro:
      "कर से जुड़े रिकॉर्ड साल भर जोड़ते रहें। फाइलिंग के समय हम उन्हें व्यवस्थित करके सिर्फ़ जरूरी बातों की पुष्टि पूछेंगे।",
    safetyTitle: "सुरक्षित, काल्पनिक झलक",
    safety:
      "नीचे का सारा डेटा काल्पनिक है और इसी डिवाइस पर रहता है। इस प्रोटोटाइप में असली PAN, बैंक, वेतन या मेडिकल काग़ज़ न डालें।",
    ready: "तैयार",
    review: "जाँच जरूरी",
    unused: "इस्तेमाल नहीं",
    recordsReady: "रिकॉर्ड तैयार",
    needsReview: "की जाँच बाकी",
    notTaxRelevant: "कर से संबंधित नहीं",
    addTitle: "साल भर की आसान आदत आज़माएँ",
    addBody:
      "अनन्या ने जनवरी में दान दिया था। काल्पनिक रसीद जोड़ें और देखें कि इनबॉक्स फाइलिंग से पहले क्या पकड़ता है।",
    add: "काल्पनिक दान रसीद जोड़ें",
    reading: "रसीद पढ़ी जा रही है…",
    added: "रसीद पढ़ी गई। एक गायब प्रमाण मिला।",
    reviewDonation: "गायब प्रमाण जाँचें",
    reviewTitle: "इस दान रिकॉर्ड को पूरा करें",
    reviewIntro:
      "रसीद भुगतान दिखाती है, लेकिन अकेले 80G दावा साबित नहीं करती। इस्तेमाल से पहले फॉर्म 10BE का मिलान करें।",
    missing: "गायब",
    missingValue: "ट्रस्ट का फॉर्म 10BE",
    foundAmount: "मिला हुआ दान",
    eligibleAmount: "मिलान के बाद योग्य कटौती",
    eligibilityValue: "₹5,500 · दान का 50% · सिर्फ़ पुरानी व्यवस्था",
    addProof: "काल्पनिक फॉर्म 10BE जोड़ें",
    matching: "प्रमाणपत्र का मिलान हो रहा है…",
    getLater: "मैं बाद में लाऊँगी",
    exclude: "इस दान का दावा न करें",
    matchedProof: "काल्पनिक फॉर्म 10BE से मिलान · पुरानी व्यवस्था में ₹5,500 योग्य",
    resolved: "दान सत्यापित हुआ। योग्य रकम अब पुरानी व्यवस्था की तुलना में शामिल है।",
    excluded: "दान को इस रिटर्न से बाहर रखा गया।",
    excludedDetail: "आपने इस दान का दावा न करने का विकल्प चुना। इसका रिटर्न पर असर नहीं होगा।",
    reconsider: "इस दान की फिर से जाँच करें",
    source: "स्रोत",
    applicable: "लागू",
    matched: "मिलान हुआ",
    form16: "फॉर्म 16",
    form16Meta: "कल्पवृक्ष सॉफ्टवेयर · 15 जून 2026",
    form16Detail: "वेतन, नियोक्ता TDS और कटौतियाँ निकाली गईं",
    ais: "AIS और फॉर्म 26AS",
    aisMeta: "आयकर रिकॉर्ड · 18 जून 2026",
    aisDetail: "चार आय प्रविष्टियाँ और कर क्रेडिट मिलान के लिए तैयार",
    health: "स्वास्थ्य बीमा प्रीमियम",
    healthMeta: "स्वास्थ्य शील्ड · 12 मार्च 2026",
    healthDetail: "₹25,000 · धारा 80D की संभावित कटौती",
    epf: "कर्मचारी भविष्य निधि",
    epfMeta: "फॉर्म 16 से मिलान · 31 मार्च 2026",
    epfDetail: "धारा 80C के ₹1,50,000 योग में पहले से शामिल",
    shopping: "सुपरमार्केट रसीद",
    shoppingMeta: "अपना बाज़ार · 9 फ़रवरी 2026",
    shoppingDetail: "सामान्य खरीदारी वेतनभोगी आयकर कम नहीं करती",
    donation: "उड़ान एजुकेशन ट्रस्ट को दान",
    donationMeta: "काल्पनिक रसीद · 14 जनवरी 2026",
    donationDetail: "₹11,000 मिला · फॉर्म 10BE अभी चाहिए",
    oldOnly: "सिर्फ़ पुरानी व्यवस्था",
    bothRecords: "रिटर्न का प्रमाण",
    prepareTitle: "जो तैयार है उससे शुरू करें",
    prepareNotAddedBody:
      "फॉर्म 16 और AIS निर्देशित रिटर्न में लोड होंगे। दूसरा काल्पनिक रिकॉर्ड जोड़ने के लिए आप बाद में यहाँ लौट सकती हैं।",
    prepareBody:
      "फॉर्म 16 और AIS निर्देशित रिटर्न में लोड होंगे। गायब प्रमाण की जाँच होने तक दान बाहर रहेगा।",
    prepareReadyBody:
      "फॉर्म 16, AIS और सत्यापित दान कटौती आपकी जाँच के लिए निर्देशित रिटर्न में शामिल होंगे।",
    prepareExcludedBody:
      "फॉर्म 16 और AIS निर्देशित रिटर्न में लोड होंगे। आपके विकल्प के अनुसार दान का दावा शामिल नहीं होगा।",
    prepare: "मेरा रिटर्न तैयार करें",
    back: "डैशबोर्ड पर वापस जाएँ",
  },
} as const;

type RecordItem = {
  id: string;
  title: string;
  meta: string;
  detail: string;
  state: "ready" | "review" | "unused";
  tag: string;
};

export function TaxInbox({
  donationStatus,
  language,
  onAddDonation,
  onBack,
  onExcludeDonation,
  onPrepare,
  onResolveDonation,
}: {
  donationStatus: TaxInboxDonationStatus;
  language: Language;
  onAddDonation: () => void;
  onBack: () => void;
  onExcludeDonation: () => void;
  onPrepare: () => void;
  onResolveDonation: () => void;
}) {
  const text = language === "hi" ? translations.hi : translations.en;
  const [reading, setReading] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [resolving, setResolving] = useState(false);
  const donationAdded = donationStatus !== "not-added";

  const records: RecordItem[] = [
    { id: "form16", title: text.form16, meta: text.form16Meta, detail: text.form16Detail, state: "ready", tag: text.bothRecords },
    { id: "ais", title: text.ais, meta: text.aisMeta, detail: text.aisDetail, state: "ready", tag: text.bothRecords },
    { id: "health", title: text.health, meta: text.healthMeta, detail: text.healthDetail, state: "ready", tag: text.oldOnly },
    { id: "epf", title: text.epf, meta: text.epfMeta, detail: text.epfDetail, state: "ready", tag: text.matched },
    { id: "shopping", title: text.shopping, meta: text.shoppingMeta, detail: text.shoppingDetail, state: "unused", tag: text.unused },
  ];

  const guide = language === "hi"
    ? [
        { title: "आय", body: "वेतन, बैंक ब्याज, लाभांश, किराया, पेंशन और निवेश बेचने के रिकॉर्ड।" },
        { title: "संभावित कर लाभ", body: "80C निवेश, स्वास्थ्य बीमा, NPS, शिक्षा ऋण, योग्य दान, किराया/HRA और होम लोन।" },
        { title: "कर और मिलान", body: "फॉर्म 16/16A, AIS, फॉर्म 26AS और एडवांस या सेल्फ-असेसमेंट टैक्स चालान।" },
        { title: "विशेष मामले", body: "व्यापार, जटिल पूँजीगत लाभ, क्रिप्टो या विदेशी संपत्ति के लिए अलग ITR और विशेषज्ञ जाँच लग सकती है।" },
      ]
    : [
        { title: "Income", body: "Salary, bank interest, dividends, rent, pension and records of investments sold." },
        { title: "Possible tax benefits", body: "80C investments, health insurance, NPS, education loans, eligible donations, rent/HRA and home loans." },
        { title: "Tax and matching", body: "Form 16/16A, AIS, Form 26AS, and advance or self-assessment tax challans." },
        { title: "Special cases", body: "Business, complex capital gains, crypto or foreign assets may need another ITR and specialist review." },
      ];

  if (donationAdded) {
    const ready = donationStatus === "ready";
    const excluded = donationStatus === "excluded";
    records.splice(4, 0, {
      id: "donation",
      title: text.donation,
      meta: text.donationMeta,
      detail: ready
        ? text.matchedProof
        : excluded
          ? text.excludedDetail
          : text.donationDetail,
      state: ready ? "ready" : excluded ? "unused" : "review",
      tag: text.oldOnly,
    });
  }

  const addDonation = () => {
    if (reading || donationAdded) return;
    setReading(true);
    window.setTimeout(() => {
      onAddDonation();
      setReading(false);
      setReviewOpen(true);
    }, 850);
  };

  const resolveDonation = () => {
    if (resolving) return;
    setResolving(true);
    window.setTimeout(() => {
      onResolveDonation();
      setResolving(false);
      setReviewOpen(false);
    }, 650);
  };

  return (
    <div className="tax-inbox">
      <div className="page-head tax-inbox-head">
        <p className="label">{text.eyebrow}</p>
        <h1>{text.title}</h1>
        <p className="lede">{text.intro}</p>
      </div>

      <div className="tax-inbox-safety" role="note">
        <AlertIcon />
        <p><strong>{text.safetyTitle}</strong> {text.safety}</p>
      </div>

      <section aria-label={text.eyebrow} className="tax-inbox-overview">
        <div><strong>{donationStatus === "ready" ? 5 : 4}</strong><span>{text.recordsReady}</span></div>
        <div><strong>{donationStatus === "needs-review" ? 1 : 0}</strong><span>{text.needsReview}</span></div>
        <div><strong>{donationStatus === "excluded" ? 2 : 1}</strong><span>{text.notTaxRelevant}</span></div>
      </section>

      {!donationAdded && (
        <section className="tax-inbox-add">
          <div>
            <p className="label">{text.addTitle}</p>
            <p>{text.addBody}</p>
          </div>
          <button className="btn" disabled={reading} onClick={addDonation} type="button">
            <FileIcon />
            {reading ? text.reading : text.add}
          </button>
        </section>
      )}

      {donationStatus === "needs-review" && <p className="tax-inbox-added" role="status"><AlertIcon />{text.added}</p>}
      {donationStatus === "ready" && <p className="tax-inbox-added" role="status"><CheckIcon />{text.resolved}</p>}
      {donationStatus === "excluded" && <p className="tax-inbox-added" role="status"><FileIcon />{text.excluded}</p>}

      <section className="tax-records">
        <div className="tax-records-head">
          <h2>{language === "hi" ? "आपके रिकॉर्ड" : "Your records"}</h2>
          <span>{records.length} {language === "hi" ? "रिकॉर्ड" : "records"}</span>
        </div>
        <ul>
          {records.map((record) => (
            <li className={`tax-record is-${record.state}`} key={record.id}>
              <span className="tax-record-mark" aria-hidden="true">
                {record.state === "review" ? <AlertIcon /> : record.state === "ready" ? <CheckIcon /> : <FileIcon />}
              </span>
              <div className="tax-record-body">
                <div className="tax-record-title">
                  <h3>{record.title}</h3>
                  <span className="tax-record-state">
                    {record.state === "ready" ? text.ready : record.state === "review" ? text.review : text.unused}
                  </span>
                </div>
                <p className="tax-record-meta">{record.meta}</p>
                <p>{record.detail}</p>
                {record.id === "donation" && donationStatus === "needs-review" && (
                  <button
                    aria-expanded={reviewOpen}
                    className="link-btn tax-record-review"
                    onClick={() => setReviewOpen((open) => !open)}
                    type="button"
                  >
                    {text.reviewDonation}
                  </button>
                )}
                {record.id === "donation" && donationStatus === "excluded" && (
                  <button
                    className="link-btn tax-record-review"
                    onClick={() => {
                      onAddDonation();
                      setReviewOpen(true);
                    }}
                    type="button"
                  >
                    {text.reconsider}
                  </button>
                )}
              </div>
              <span className="tax-record-tag">{record.tag}</span>
            </li>
          ))}
        </ul>
      </section>

      {donationStatus === "needs-review" && reviewOpen && (
        <section aria-label={text.reviewTitle} className="tax-review-panel">
          <div>
            <p className="label">{text.review}</p>
            <h2>{text.reviewTitle}</h2>
            <p>{text.reviewIntro}</p>
          </div>
          <dl>
            <div><dt>{text.foundAmount}</dt><dd>₹11,000</dd></div>
            <div><dt>{text.missing}</dt><dd>{text.missingValue}</dd></div>
            <div><dt>{text.eligibleAmount}</dt><dd>{text.eligibilityValue}</dd></div>
          </dl>
          <div className="actions tax-review-actions">
            <button className="btn" disabled={resolving} onClick={resolveDonation} type="button">
              {resolving ? text.matching : text.addProof}
            </button>
            <button className="btn btn-secondary" onClick={() => setReviewOpen(false)} type="button">{text.getLater}</button>
            <button
              className="link-btn"
              onClick={() => {
                onExcludeDonation();
                setReviewOpen(false);
              }}
              type="button"
            >
              {text.exclude}
            </button>
          </div>
        </section>
      )}

      <section className="tax-inbox-guide">
        <div className="tax-records-head">
          <h2>{language === "hi" ? "यहाँ क्या रखें" : "What belongs here"}</h2>
        </div>
        <p className="tax-inbox-guide-note">
          {language === "hi"
            ? "सामान्य खरीदारी नहीं—सिर्फ़ आय, कर और योग्य दावों से जुड़े रिकॉर्ड। पुरानी व्यवस्था की अधिकतर कटौतियाँ नई व्यवस्था में उपलब्ध नहीं हैं।"
            : "Not every receipt—only records tied to income, tax, or an eligible claim. Most familiar old-regime deductions are unavailable in the new regime."}
        </p>
        <ul>
          {guide.map((item) => <li key={item.title}><h3>{item.title}</h3><p>{item.body}</p></li>)}
        </ul>
      </section>

      <section className="tax-inbox-prepare">
        <div>
          <p className="label">{text.prepareTitle}</p>
          <p>
            {donationStatus === "ready"
              ? text.prepareReadyBody
              : donationStatus === "excluded"
                ? text.prepareExcludedBody
                : donationStatus === "needs-review"
                  ? text.prepareBody
                  : text.prepareNotAddedBody}
          </p>
        </div>
        <button className="btn" onClick={onPrepare} type="button">
          {text.prepare}<ArrowIcon />
        </button>
      </section>

      <button className="link-btn tax-inbox-back" onClick={onBack} type="button">{text.back}</button>
    </div>
  );
}
