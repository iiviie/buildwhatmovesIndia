import type { Language } from "../case-data";
import { CheckIcon } from "./icons";

export function ImpactSummary({
  excludedIncome,
  incomeReviewed,
  language,
  lowerRegimeChosen,
  regimeDifference,
}: {
  excludedIncome: string;
  incomeReviewed: number;
  language: Language;
  lowerRegimeChosen: boolean;
  regimeDifference: string;
}) {
  const hi = language === "hi";
  return (
    <section aria-label={hi ? "आपको क्या फायदा हुआ" : "Your impact summary"} className="impact-summary">
      <div className="impact-summary-head">
        <p className="label">{hi ? "आपको क्या फायदा हुआ" : "What Sahi Return did for you"}</p>
        <h2>{hi ? "काग़ज़ों से तैयार रिटर्न तक—एक साफ़ रास्ता।" : "From scattered records to a return you can explain."}</h2>
      </div>

      <div className="impact-grid">
        <div>
          <strong>{incomeReviewed}</strong>
          <span>{hi ? "पहले से भरी आय की प्रविष्टियाँ आपने जाँचीं" : "prefilled income entries reviewed by you"}</span>
        </div>
        <div>
          <strong>{regimeDifference}</strong>
          <span>{lowerRegimeChosen
            ? hi ? "कम कर वाली व्यवस्था चुनकर बचाए" : "kept by choosing the lower-tax regime"
            : hi ? "दोनों व्यवस्थाओं का अंतर साफ़ दिखाया" : "difference made visible between both regimes"}</span>
        </div>
        <div>
          <strong>{excludedIncome}</strong>
          <span>{hi ? "आपकी नहीं बताई गई आय रिटर्न से बाहर रखी" : "income you rejected kept out of the return"}</span>
        </div>
      </div>

      <ul className="impact-checks">
        <li><CheckIcon />{hi ? "सही ITR चुना गया" : "Correct ITR selected"}</li>
        <li><CheckIcon />{hi ? "आय और कर क्रेडिट का मिलान हुआ" : "Income and tax credits reconciled"}</li>
        <li><CheckIcon />{hi ? "दोनों कर व्यवस्थाओं की तुलना हुई" : "Both tax regimes compared"}</li>
        <li><CheckIcon />{hi ? "फाइलिंग से पहले आम गलतियाँ जाँची गईं" : "Common filing mistakes checked before submission"}</li>
      </ul>

      <p className="impact-caveat">
        {hi
          ? "इस डेमो की रकम काल्पनिक है। यह प्रभाव सार बताता है कि प्रोटोटाइप ने क्या किया—यह कर सलाह या सरकारी पुष्टि नहीं है।"
          : "All figures are synthetic. This summary explains what the prototype did; it is not tax advice or government confirmation."}
      </p>
    </section>
  );
}
