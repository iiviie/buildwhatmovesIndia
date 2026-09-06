"use client";

import { useState } from "react";
import type { Language } from "../case-data";
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
    prepareBody:
      "Form 16 and AIS will be loaded into the guided return. The donation stays out until its missing proof is reviewed.",
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
    prepareBody:
      "फॉर्म 16 और AIS निर्देशित रिटर्न में लोड होंगे। गायब प्रमाण की जाँच होने तक दान बाहर रहेगा।",
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
  donationAdded,
  language,
  onAddDonation,
  onBack,
  onPrepare,
}: {
  donationAdded: boolean;
  language: Language;
  onAddDonation: () => void;
  onBack: () => void;
  onPrepare: () => void;
}) {
  const text = language === "hi" ? translations.hi : translations.en;
  const [reading, setReading] = useState(false);

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
    records.splice(4, 0, {
      id: "donation",
      title: text.donation,
      meta: text.donationMeta,
      detail: text.donationDetail,
      state: "review",
      tag: text.oldOnly,
    });
  }

  const addDonation = () => {
    if (reading || donationAdded) return;
    setReading(true);
    window.setTimeout(() => {
      onAddDonation();
      setReading(false);
    }, 850);
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
        <div><strong>4</strong><span>{text.recordsReady}</span></div>
        <div><strong>{donationAdded ? 1 : 0}</strong><span>{text.needsReview}</span></div>
        <div><strong>1</strong><span>{text.notTaxRelevant}</span></div>
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

      {donationAdded && <p className="tax-inbox-added" role="status"><CheckIcon />{text.added}</p>}

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
              </div>
              <span className="tax-record-tag">{record.tag}</span>
            </li>
          ))}
        </ul>
      </section>

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
          <p>{text.prepareBody}</p>
        </div>
        <button className="btn" onClick={onPrepare} type="button">
          {text.prepare}<ArrowIcon />
        </button>
      </section>

      <button className="link-btn tax-inbox-back" onClick={onBack} type="button">{text.back}</button>
    </div>
  );
}
