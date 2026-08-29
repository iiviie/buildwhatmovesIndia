/* The jargon layer's content. Every term that gets a dotted underline anywhere
 * in the interface is defined here once, in both languages, so the same word
 * never gets two different explanations on two different screens.
 *
 * Each entry answers three questions in a fixed order: what it is, where a
 * citizen actually gets it, and why it matters to their return. The third one
 * is the reason this file exists — a definition that does not name the mistake
 * it protects you from is not worth interrupting someone to read.
 *
 * Figures follow the AY 2026-27 positions in `tax.ts` and `case-data.ts`.
 * This is a hackathon prototype, not tax advice. */

export type GlossaryEntry = {
  /** The term as it is displayed, e.g. "Form 26AS". */
  term: string;
  /** What it is, in one or two plain sentences. */
  what: string;
  /** Where a citizen actually gets it or finds it. Empty string if there is nowhere to go. */
  where: string;
  /** Why it matters to this citizen's return, concretely. */
  why: string;
};

export type GlossaryId =
  /* documents */
  | "form-16"
  | "form-26as"
  | "ais"
  | "tis"
  | "form-16a"
  | "traces"
  /* money in */
  | "gross-salary"
  | "perquisite"
  | "exempt-allowance"
  | "standard-deduction"
  | "net-salary"
  | "gross-total-income"
  | "total-income"
  | "income-from-other-sources"
  | "income-from-house-property"
  | "annual-value"
  | "ltcg-112a"
  | "exempt-income"
  /* tax taken */
  | "tds"
  | "tcs"
  | "tan"
  | "advance-tax"
  | "self-assessment-tax"
  | "challan"
  | "bsr-code"
  | "tax-credit"
  /* regimes and deductions */
  | "new-tax-regime"
  | "old-tax-regime"
  | "section-115bac"
  | "rebate-87a"
  | "cess"
  | "section-80ccd2"
  | "section-80cch"
  | "section-24b"
  | "slab"
  /* filing mechanics */
  | "assessment-year"
  | "financial-year"
  | "itr-1"
  | "itr-2"
  | "section-139-1"
  | "section-139-4"
  | "section-139-5"
  | "section-139-8a"
  | "section-139-9"
  | "seventh-proviso"
  | "section-234f"
  | "section-234a"
  | "pan"
  | "representative-assessee"
  | "residential-status"
  | "nature-of-employment"
  /* after filing */
  | "e-verify"
  | "evc"
  | "dsc"
  | "acknowledgement"
  | "prevalidated-account"
  | "dormant-account"
  | "refund"
  | "ais-feedback"
  | "defective-return";

const en: Record<GlossaryId, GlossaryEntry> = {
  "form-16": {
    term: "Form 16",
    what: "The certificate your employer gives you after the year ends. Part A lists the tax deducted from your pay each quarter, and Part B breaks down the salary itself.",
    where: "Your employer gives it to you, usually by mid-June.",
    why: "Almost every figure in a salaried return is copied from it, so a return that disagrees with your Form 16 is one you cannot explain later.",
  },
  "form-26as": {
    term: "Form 26AS",
    what: "Your tax credit statement. It lists every rupee of tax that anyone has deducted against your PAN and actually paid to the department.",
    where: "e-File → Income Tax Returns → View Form 26AS on the official portal. It opens the TRACES site.",
    why: "If your Form 16 says ₹85,000 of tax was deducted but Form 26AS does not show it, the department has not received that money and you cannot claim it.",
  },
  ais: {
    term: "AIS",
    what: "The Annual Information Statement. A list of what banks, employers, companies and registrars have reported about you for the year — interest, dividend, salary, large purchases.",
    where: "e-File → Income Tax Returns → View Annual Information Statement (AIS). It opens the Compliance Portal, which is a separate site.",
    why: "Income that sits here and not in your return is the most common reason a return is marked defective months after it was filed.",
  },
  tis: {
    term: "TIS",
    what: "The Taxpayer Information Summary. The same information as the AIS, but grouped into categories and totalled, with the figure the system worked out beside the figure you accepted.",
    where: "It sits as a second tile on the same AIS page on the Compliance Portal.",
    why: "Checking one total is quicker than reading every AIS line, and a gap between the two columns shows where your feedback has not been taken on board yet.",
  },
  "form-16a": {
    term: "Form 16A",
    what: "The TDS certificate for money that is not salary — bank interest, rent, professional fees. You get one from each payer who deducted tax.",
    where: "The bank or company that deducted the tax gives it to you, usually once a quarter.",
    why: "It is how you check that the tax your bank says it deducted is the same tax the department has recorded against your PAN.",
  },
  traces: {
    term: "TRACES",
    what: "A separate government site that holds the TDS records. Form 26AS is served from it rather than from the e-Filing portal.",
    where: "The portal opens it for you when you choose View Form 26AS; you do not sign in a second time.",
    why: "The site and its design change in the middle of the journey, which makes people think they have been sent somewhere unsafe. They have not.",
  },

  "gross-salary": {
    term: "Gross salary",
    what: "Everything your employer paid you before anything was taken off — basic pay, allowances, bonus, and the value of any perquisite.",
    where: "Part B of your Form 16. The portal shows it as B1 i. Gross Salary.",
    why: "It is the first figure in the return and every later figure is worked out from it, so an error here moves the whole calculation.",
  },
  perquisite: {
    term: "Perquisite",
    what: "A benefit from your employer that does not arrive as cash — a company car, rent-free accommodation, subsidised shares. It is given a rupee value and added to your salary.",
    where: "Part B of your Form 16 lists each one with the value your employer put on it.",
    why: "Tax is deducted on it even though no money reached your account, which is often why the tax deducted looks larger than your payslips suggest.",
  },
  "exempt-allowance": {
    term: "Exempt allowance",
    what: "A part of your salary that is not taxed at all, such as house rent allowance or leave travel allowance under section 10.",
    where: "Part B of your Form 16. The portal shows it as B1 ii, Allowances to the extent exempt u/s 10.",
    why: "Under the new regime house rent and most other allowances are no longer exempt, so a figure entered in that column there would understate your income.",
  },
  "standard-deduction": {
    term: "Standard deduction",
    what: "A flat amount taken off salary income for every salaried person, with nothing to prove and nothing to claim. Under the new regime it is ₹75,000.",
    where: "Nothing to fetch — it is applied for you and shown at B1 iii a, Standard Deduction u/s 16(ia).",
    why: "It cannot be lost or refused, so a salary figure that still has it in is too high by ₹75,000 and the tax worked out from it will be too.",
  },
  "net-salary": {
    term: "Net salary",
    what: "Gross salary minus the allowances that are exempt. It is a step in the arithmetic, not the amount that reaches your bank account.",
    where: "The portal shows it as B1 iii. Net Salary (i – ii) in the Gross Total Income section.",
    why: "People read it as take-home pay and conclude the return is wrong; it sits before the standard deduction and before any tax.",
  },
  "gross-total-income": {
    term: "Gross total income",
    what: "Your income from every head added together — salary, house property, other sources — before any deduction is taken off.",
    where: "The portal totals it for you at the foot of the Gross Total Income section.",
    why: "Deductions are measured downwards from this figure, so a source of income missing here is missing from the entire return.",
  },
  "total-income": {
    term: "Total income",
    what: "Gross total income minus the deductions you are allowed. This is the figure the tax is actually calculated on.",
    where: "Shown under Verify your tax liability details, below the list of deductions.",
    why: "It decides whether the section 87A rebate applies, whether ITR-1 can be used at all, and which section 234F fee applies if you file late.",
  },
  "income-from-other-sources": {
    term: "Income from other sources",
    what: "Income that is not salary, house property or capital gains. For most salaried people it means bank interest and dividend.",
    where: "The portal asks for it under B3. Income from Other Sources, with a Nature of Income dropdown.",
    why: "Your bank has already reported these amounts against your PAN, so leaving them out creates a disagreement the department can see straight away.",
  },
  "income-from-house-property": {
    term: "Income from house property",
    what: "Income from a property you own, whether or not it is let out. A home you live in is normally entered as nil.",
    where: "The portal asks for it under B2, with a form for the address, ownership share, rent received and municipal tax paid.",
    why: "A home loan can make this figure negative, and the portal notes that a loss set off against other income is capped at ₹2,00,000.",
  },
  "annual-value": {
    term: "Annual value",
    what: "What a property could reasonably earn in a year. For a let-out property it is the rent less the tax paid to the local authority; for a home you live in it is nil.",
    where: "The portal works it out at line 1e of the house property form, from the figures you enter above it.",
    why: "The rest of that section — the flat 30% allowance and the interest you set against it — is all calculated from this one number.",
  },
  "ltcg-112a": {
    term: "LTCG u/s 112A",
    what: "Long-term capital gain on listed shares or equity mutual funds held for more than a year. Gains up to ₹1,25,000 in a year are not taxed.",
    where: "Your broker's or fund house's capital gains statement for the year. The portal prefills it at C3(a).",
    why: "Below ₹1,25,000 it is only reported. Above that, ITR-1 no longer applies and the return has to be ITR-2.",
  },
  "exempt-income": {
    term: "Exempt income",
    what: "Income that carries no tax but still has to be reported, such as agricultural income or the maturity of a provident fund.",
    where: "The portal collects it under C3. Exempt Income, with a category and sub-category for each entry.",
    why: "Reporting it costs nothing, but agricultural income above ₹5,000 puts you outside ITR-1 altogether.",
  },

  tds: {
    term: "TDS",
    what: "Tax Deducted at Source. Whoever pays you — an employer, a bank, a tenant — holds back part of the payment as tax and pays it to the department against your PAN.",
    where: "Form 16 covers salary, Form 16A covers everything else, and Form 26AS is the department's own record of what arrived.",
    why: "This is tax you have already paid, but it only counts if Form 26AS shows it. A return claiming more than Form 26AS holds will not match.",
  },
  tcs: {
    term: "TCS",
    what: "Tax Collected at Source. On certain purchases — a foreign remittance, a high-value vehicle — the seller adds tax on top and pays it to the department in your name.",
    where: "Part VI of Form 26AS, and the Form 27D the seller gives you.",
    why: "Like TDS it comes off your final bill, but the portal does not prefill every case, so a collection left out is money you have paid and not claimed.",
  },
  tan: {
    term: "TAN",
    what: "Tax Deduction Account Number. A ten-character code that identifies whoever deducted tax from a payment to you. It is not the same thing as a PAN.",
    where: "Printed on Part A of your Form 16, and shown beside every entry in Form 26AS.",
    why: "The department matches the credit you claim to the deposit the deductor made using this code, so a wrong TAN leaves the credit unmatched.",
  },
  "advance-tax": {
    term: "Advance tax",
    what: "Tax paid during the year itself, in instalments, rather than after the year ends. It applies when the tax left after TDS is more than ₹10,000.",
    where: "e-File → e-Pay Tax on the official portal. Amounts already paid also appear in Form 26AS.",
    why: "The instalments fall due on 15 June, 15 September, 15 December and 15 March, and interest runs from the date missed rather than from the date you file.",
  },
  "self-assessment-tax": {
    term: "Self-assessment tax",
    what: "The balance you pay yourself before filing, when TDS and advance tax together did not cover the final bill.",
    where: "e-File → e-Pay Tax on the official portal; you pay first, then type the challan details into the return.",
    why: "Interest under section 234A keeps running on an unpaid balance, so the gap between finishing the return and paying it has a price.",
  },
  challan: {
    term: "Challan",
    what: "The receipt for a tax payment. It carries the BSR code of the bank branch, the date of deposit, a serial number and the amount.",
    where: "e-File → e-Pay Tax → Payment History, where it can be downloaded after you pay.",
    why: "The return asks you to type those four fields in by hand, and a payment the department cannot match to a challan is not treated as paid.",
  },
  "bsr-code": {
    term: "BSR code",
    what: "A seven-digit code identifying the bank branch that accepted your tax payment.",
    where: "Printed on the challan you download after paying.",
    why: "It is one of the four challan fields the return asks for, and it is what lets the department find your payment among everyone else's.",
  },
  "tax-credit": {
    term: "Tax credit",
    what: "Tax already paid in your name — through TDS, TCS, advance tax or self-assessment tax — that comes off the tax finally due.",
    where: "Form 26AS is the department's own list of what it has received against your PAN.",
    why: "A credit can only be claimed alongside the income it was deducted from. Claiming one without reporting that income is the exact mismatch that produces a defective-return notice.",
  },

  "new-tax-regime": {
    term: "New tax regime",
    what: "The default calculation. Wider slabs and a larger standard deduction of ₹75,000, in exchange for almost none of the old deductions.",
    where: "It applies unless you answer Yes to the section 115BAC(6) opt-out question in the Personal Information section.",
    why: "You are in it whether or not you notice the question, so someone with large 80C and home loan claims can end up paying more than the other regime would have cost.",
  },
  "old-tax-regime": {
    term: "Old tax regime",
    what: "The earlier calculation. Narrower slabs and a ₹50,000 standard deduction, but section 80C, section 80D, house rent and home loan interest still apply.",
    where: "Reached by answering Yes to the opt-out question under section 115BAC(6) in the Personal Information section.",
    why: "Which regime costs less depends entirely on what you actually claim, so the two only mean anything when they are worked out on your own figures.",
  },
  "section-115bac": {
    term: "Section 115BAC",
    what: "The section that sets out the new tax regime. Sub-section (6) is the right to opt out of it and go back to the old one.",
    where: "Personal Information asks: Do you wish to exercise the option u/s 115BAC(6) of opting out of the new tax regime? The default answer is No.",
    why: "The question is a double negative — No keeps you in the new regime — so it is easy to answer the opposite of what you meant and file under the wrong one.",
  },
  "rebate-87a": {
    term: "Section 87A rebate",
    what: "A reduction applied after the tax has been worked out. Under the new regime it cancels up to ₹60,000 of tax when total income is ₹12,00,000 or less.",
    where: "Applied automatically in the tax calculation. There is nothing to claim and no box to tick.",
    why: "It is the reason a total income up to ₹12,00,000 pays no tax at all, even though the slab table starts charging above ₹4,00,000.",
  },
  cess: {
    term: "Health and education cess",
    what: "A flat 4% added on top of the tax you owe, after the section 87A rebate has been applied.",
    where: "Shown as its own line under Verify your tax liability details.",
    why: "It is why the final figure sits a little above the slab arithmetic: on ₹1,00,000 of tax it adds ₹4,000.",
  },
  "section-80ccd2": {
    term: "Section 80CCD(2)",
    what: "A deduction for what your employer pays into your pension scheme account. Your own contribution falls under a different section.",
    where: "The Total Deductions section of the return. The amount comes from Part B of your Form 16.",
    why: "It is one of the very few deductions that survives in the new regime, so a deductions page showing ₹0 everywhere else may still carry a figure here.",
  },
  "section-80cch": {
    term: "Section 80CCH",
    what: "A deduction for contributions to the Agnipath Scheme, for those enrolled as Agniveers.",
    where: "The Total Deductions section, listed below 80CCD(2).",
    why: "The portal notes it is not allowed for any employment category other than Central Government, so for most salaried filers the line stays at ₹0.",
  },
  "section-24b": {
    term: "Section 24(b)",
    what: "The deduction for interest paid on money borrowed to buy, build or repair a house.",
    where: "Inside the house property form, in an accordion beside the interest line.",
    why: "It is what turns a home loan into less tax, and under the new regime it only applies to a property you let out, not to the one you live in.",
  },
  slab: {
    term: "Slab",
    what: "A band of income with its own tax rate. Only the part of your income that falls inside a band is taxed at that band's rate.",
    where: "",
    why: "It is why a raise never leaves you worse off: crossing into a higher band changes the rate on the new rupees only, not on everything you already earned.",
  },

  "assessment-year": {
    term: "Assessment year",
    what: "The year in which you file, for income earned in the year before it. Income earned from 1 April 2025 to 31 March 2026 is filed in assessment year 2026-27.",
    where: "The first dropdown when you start a return: e-File → Income Tax Returns → File Income Tax Return.",
    why: "Choosing the wrong year files a return for the wrong period, and nothing on screen catches it until the department's figures fail to match yours.",
  },
  "financial-year": {
    term: "Financial year",
    what: "The year the income was actually earned, running 1 April to 31 March. Financial year 2025-26 is assessed in assessment year 2026-27.",
    where: "Printed in the header of Form 26AS, next to the assessment year.",
    why: "Documents and screens switch between the two years without saying so, and a figure read off the wrong one will never reconcile.",
  },
  "itr-1": {
    term: "ITR-1",
    what: "Also called Sahaj. The shortest return form, for a resident individual whose income is salary, house property and other sources.",
    where: "Offered at Select ITR Form, or worked out for you by the Help me select ITR questions.",
    why: "It is limited to a total income of ₹50 lakh, up to two house properties and agricultural income of ₹5,000. Cross any one of those and the return has to be ITR-2.",
  },
  "itr-2": {
    term: "ITR-2",
    what: "The longer return form, for income that does not fit ITR-1 — capital gains above the small exempt limit, more than two house properties, foreign income, or a loss to carry forward.",
    where: "Chosen at the same Select ITR Form step as ITR-1.",
    why: "Filing ITR-1 where ITR-2 was required can have the return treated as defective, which costs far more time than the longer form would have.",
  },
  "section-139-1": {
    term: "Section 139(1)",
    what: "The ordinary case: a return filed on or before the due date.",
    where: "Personal Information → Filing Section → Filed u/s, where 139(1) is the first option.",
    why: "It is the option that records you as on time, so no section 234F fee and no section 234A interest attach to the return. For AY 2026-27 the salaried due date was 31 July 2026.",
  },
  "section-139-4": {
    term: "Section 139(4)",
    what: "A belated return — one filed after the due date has gone but before the belated window closes.",
    where: "The same Filed u/s list in Personal Information, as the second option.",
    why: "For AY 2026-27 that window runs to 31 December 2026, and a return filed under it carries the section 234F fee and section 234A interest on any unpaid tax.",
  },
  "section-139-5": {
    term: "Section 139(5)",
    what: "A revised return, replacing one you have already filed because you found a mistake in it.",
    where: "Filed u/s → 139(5) in Personal Information, where you also enter the acknowledgement number of the original return.",
    why: "For AY 2026-27 a return can be revised until 31 December 2026, so a mistake in a return filed on time is recoverable in a way that filing nothing is not.",
  },
  "section-139-8a": {
    term: "Section 139(8A)",
    what: "An updated return, filed after both the ordinary and the belated windows have closed.",
    where: "Filed u/s → 139(8A) in Personal Information.",
    why: "It is the only route left once 31 December 2026 has passed, and it carries extra tax on top of the tax that was owed in the first place.",
  },
  "section-139-9": {
    term: "Section 139(9)",
    what: "A defective return. The department has read what you filed, found it inconsistent with its own records, and issued a notice about it.",
    where: "Personal Information → Filed in response to notice u/s → 139(9) is how the corrected return goes back.",
    why: "The notice allows only a short window to respond, and a defect left uncorrected can make the original return count as never filed.",
  },
  "seventh-proviso": {
    term: "Seventh proviso to section 139(1)",
    what: "A rule that makes filing compulsory even when your income is below the taxable limit, triggered by certain large transactions such as big bank deposits, foreign travel spending or electricity bills.",
    where: "The filing-reason screen asks it, and the answer is read back later in Personal Information with an Edit Response link.",
    why: "If one of those transactions applies to you, a return is due even though there is no tax to pay, and skipping it counts as not having filed.",
  },
  "section-234f": {
    term: "Section 234F",
    what: "The flat fee for filing after the due date. It is ₹1,000 where total income is ₹5,00,000 or less, and ₹5,000 above that.",
    where: "It appears in the tax calculation once the due date has passed. Nothing has to be entered.",
    why: "It is charged on the return itself rather than on unpaid tax, so it applies even when you are owed a refund.",
  },
  "section-234a": {
    term: "Section 234A",
    what: "Interest on tax still unpaid after the due date. It runs month by month from the day after the due date until the tax is paid.",
    where: "Shown with the other interest lines in the tax calculation.",
    why: "Unlike the section 234F fee it grows the longer the balance sits, and it stops the moment the tax is paid rather than when the return is filed.",
  },
  pan: {
    term: "PAN",
    what: "Permanent Account Number. The ten-character code that identifies you to the Income Tax Department. Every payment reported in your name is recorded against it.",
    where: "On your PAN card. If you do not have one, it is applied for through the NSDL or UTIITSL site.",
    why: "Everything is matched by PAN, so income reported against a mistyped PAN never reaches your record and tax deducted against it cannot be claimed.",
  },
  "representative-assessee": {
    term: "Representative assessee",
    what: "Someone filing on behalf of a person who cannot file for themselves — a minor, a person of unsound mind, or someone who has died.",
    where: "Personal Information asks Yes or No. Someone filing their own return answers No.",
    why: "Yes changes whose return this is, so an accidental Yes files the return in the wrong capacity and the details stop matching the PAN.",
  },
  "residential-status": {
    term: "Residential status",
    what: "Whether you counted as resident in India for the year. It follows from how many days you were in the country, not from your citizenship.",
    where: "The first question in the Help me select ITR wizard, offering Resident and Ordinarily Resident, Resident but Not Ordinarily Resident, Non-Resident, and Don't Know.",
    why: "It decides which of your income India taxes at all, and only a resident can file ITR-1.",
  },
  "nature-of-employment": {
    term: "Nature of employment",
    what: "Which kind of employer you work for — central government, state government, public sector, private sector, pensioner, or other.",
    where: "A dropdown in the Personal Information section. A private-sector employee falls under Others.",
    why: "A few deductions are tied to a category — section 80CCH is limited to central government employment — so the answer changes what the deductions section will accept.",
  },

  "e-verify": {
    term: "e-Verify",
    what: "Confirming that the return just submitted really came from you. Until it is verified, a submitted return is not treated as filed.",
    where: "It follows submission, and can be returned to later at e-File → Income Tax Returns → e-Verify Return.",
    why: "There are 30 days to verify. Miss them and the return counts as never filed, with the late consequences dated back to the original due date.",
  },
  evc: {
    term: "EVC",
    what: "Electronic Verification Code. A short code sent to your registered mobile and email that verifies a return without a signature.",
    where: "Generated at the verification step through net banking, a prevalidated bank account, or a demat account.",
    why: "It is the route for anyone whose mobile number is not linked to Aadhaar, and it is the difference between a return that is filed and one that is only submitted.",
  },
  dsc: {
    term: "DSC",
    what: "Digital Signature Certificate. A physical token holding a cryptographic signature, issued against your PAN.",
    where: "Bought from a licensed certifying authority and registered on the portal before it can be used.",
    why: "It is the one verification route that does not depend on receiving an OTP, but it has to be registered in advance rather than on the day you file.",
  },
  acknowledgement: {
    term: "Acknowledgement",
    what: "The receipt for a filed return, carrying an acknowledgement number, the date, and the figures filed. Also called the ITR-V.",
    where: "e-File → Income Tax Returns → View Filed Returns, where it can be downloaded for any year.",
    why: "The acknowledgement number is what a revised return quotes, what a reply to a notice quotes, and what a loan or visa application asks for as proof of filing.",
  },
  "prevalidated-account": {
    term: "Prevalidated bank account",
    what: "A bank account confirmed on the portal, where the name, PAN and account number have been matched against the bank's own records.",
    where: "Profile → My Bank Account on the official portal, where a confirmed account carries a Validated badge.",
    why: "A refund is paid only into a prevalidated account that has been nominated for refund, so without one the money the return says you are owed has nowhere to go.",
  },
  "dormant-account": {
    term: "Dormant account",
    what: "A bank account with no customer transaction for a long stretch, which the bank has made inactive.",
    where: "Your bank tells you an account has gone dormant, and the portal will not validate one.",
    why: "The return asks for every bank account you held except dormant ones, so listing one adds an account that can never receive the refund.",
  },
  refund: {
    term: "Refund",
    what: "Money returned to you when the tax already paid in your name comes to more than the tax finally due.",
    where: "e-File → Income Tax Returns → View Filed Returns shows where each year's return and refund has got to.",
    why: "It is paid only after the return is verified and only into a nominated prevalidated account, so an unverified return with a refund due simply sits there.",
  },
  "ais-feedback": {
    term: "AIS feedback",
    what: "Telling the department that something in your Annual Information Statement is wrong — not yours, counted twice, or the wrong amount.",
    where: "On the AIS itself, on the Compliance Portal, where each line carries its own feedback option.",
    why: "It is the route for an entry you do not recognise, and it is handled separately, so the return does not wait for the outcome.",
  },
  "defective-return": {
    term: "Defective return",
    what: "A return the department has taken in but found inconsistent with its own records. It is not rejected — it is held until you correct it.",
    where: "The notice arrives by email and appears under Pending Actions → e-Proceedings on the portal.",
    why: "It usually turns up months after filing, when the refund is spent and the papers are put away. The commonest cause is a tax credit claimed without the matching income reported.",
  },
};

const hi: Record<GlossaryId, GlossaryEntry> = {
  "form-16": {
    term: "फ़ॉर्म 16",
    what: "साल खत्म होने पर नियोक्ता से मिलने वाला प्रमाणपत्र। भाग A में हर तिमाही काटा गया कर होता है, और भाग B में वेतन का पूरा ब्यौरा।",
    where: "यह आपका नियोक्ता देता है, आम तौर पर जून के मध्य तक।",
    why: "वेतन रिटर्न का लगभग हर आँकड़ा इसी से उतरता है, इसलिए जो रिटर्न आपके फ़ॉर्म 16 से नहीं मिलता, उसका जवाब बाद में देना मुश्किल हो जाता है।",
  },
  "form-26as": {
    term: "फ़ॉर्म 26AS",
    what: "आपका कर क्रेडिट विवरण। इसमें वह हर रुपया दर्ज होता है जो किसी ने आपके पैन पर काटकर विभाग को सचमुच जमा किया है।",
    where: "आधिकारिक पोर्टल पर e-File → Income Tax Returns → View Form 26AS। यह TRACES साइट खोल देता है।",
    why: "अगर फ़ॉर्म 16 कहता है कि ₹85,000 कर कटा पर फ़ॉर्म 26AS में वह नहीं दिखता, तो वह रकम विभाग तक पहुँची ही नहीं और आप उसका दावा नहीं कर सकते।",
  },
  ais: {
    term: "AIS",
    what: "वार्षिक सूचना विवरण। इसमें वह सब होता है जो बैंकों, नियोक्ताओं, कंपनियों और रजिस्ट्रारों ने साल भर में आपके बारे में बताया — ब्याज, लाभांश, वेतन, बड़ी खरीद।",
    where: "आधिकारिक पोर्टल पर e-File → Income Tax Returns → View Annual Information Statement (AIS)। यह अलग साइट, Compliance Portal, खोलता है।",
    why: "जो आय यहाँ है पर रिटर्न में नहीं, वही सबसे आम वजह है कि रिटर्न फाइल होने के महीनों बाद त्रुटिपूर्ण घोषित हो जाता है।",
  },
  tis: {
    term: "TIS",
    what: "करदाता सूचना सारांश। जानकारी वही है जो AIS में है, पर श्रेणियों में बँटी और जुड़ी हुई — सिस्टम का निकाला आँकड़ा और आपका स्वीकार किया आँकड़ा साथ-साथ।",
    where: "यह Compliance Portal पर उसी AIS पन्ने पर दूसरी टाइल के रूप में मिलता है।",
    why: "हर पंक्ति पढ़ने से एक कुल जोड़ मिलाना तेज़ है, और दोनों कॉलमों का अंतर बता देता है कि आपकी दी हुई सूचना अभी मानी नहीं गई है।",
  },
  "form-16a": {
    term: "फ़ॉर्म 16A",
    what: "वेतन के अलावा बाकी भुगतानों — बैंक ब्याज, किराया, पेशेवर फ़ीस — पर काटे गए कर का प्रमाणपत्र। हर काटने वाले से अलग-अलग मिलता है।",
    where: "जिस बैंक या कंपनी ने कर काटा, वही देती है, आम तौर पर हर तिमाही।",
    why: "इसी से जाँचा जाता है कि बैंक जितना कर काटने की बात कह रहा है, उतना ही विभाग ने आपके पैन पर दर्ज किया है या नहीं।",
  },
  traces: {
    term: "TRACES",
    what: "एक अलग सरकारी साइट, जिस पर TDS के रिकॉर्ड रहते हैं। फ़ॉर्म 26AS ई-फाइलिंग पोर्टल से नहीं, यहीं से आता है।",
    where: "View Form 26AS चुनने पर पोर्टल इसे खुद खोल देता है; दोबारा साइन इन नहीं करना पड़ता।",
    why: "बीच रास्ते साइट और उसकी बनावट बदल जाती है, जिससे लगता है कि आप किसी असुरक्षित जगह पहुँच गए हैं। ऐसा नहीं है।",
  },

  "gross-salary": {
    term: "सकल वेतन",
    what: "कुछ भी कटने से पहले नियोक्ता ने आपको जो कुछ दिया — मूल वेतन, भत्ते, बोनस, और किसी भी अनुलाभ का मूल्य।",
    where: "आपके फ़ॉर्म 16 का भाग B। पोर्टल पर यह B1 i. Gross Salary है।",
    why: "रिटर्न का यह पहला आँकड़ा है और बाकी सब इसी से निकलता है, इसलिए यहाँ की गलती पूरी गणना हिला देती है।",
  },
  perquisite: {
    term: "अनुलाभ",
    what: "नियोक्ता से मिला ऐसा लाभ जो नकद में नहीं आता — कंपनी की गाड़ी, बिना किराए का मकान, रियायती शेयर। इसका रुपयों में मूल्य लगाकर वेतन में जोड़ा जाता है।",
    where: "आपके फ़ॉर्म 16 का भाग B हर अनुलाभ को नियोक्ता के लगाए मूल्य के साथ दिखाता है।",
    why: "पैसा खाते में आए बिना भी इस पर कर कटता है, इसीलिए कई बार काटा गया कर पर्चियों से लगने वाले अंदाज़े से बड़ा दिखता है।",
  },
  "exempt-allowance": {
    term: "छूट वाला भत्ता",
    what: "वेतन का वह हिस्सा जिस पर कर लगता ही नहीं, जैसे धारा 10 के तहत मकान किराया भत्ता या यात्रा अवकाश भत्ता।",
    where: "आपके फ़ॉर्म 16 का भाग B। पोर्टल पर यह B1 ii, Allowances to the extent exempt u/s 10 है।",
    why: "नई व्यवस्था में मकान किराया और ज़्यादातर भत्ते छूट में नहीं आते, इसलिए वहाँ इस कॉलम में रकम डालने से आय कम दर्ज हो जाएगी।",
  },
  "standard-deduction": {
    term: "मानक कटौती",
    what: "हर वेतनभोगी की वेतन आय में से घटने वाली एक तय रकम, जिसके लिए न कुछ साबित करना है न माँगना। नई व्यवस्था में यह ₹75,000 है।",
    where: "कहीं से लाना नहीं पड़ता — यह खुद लग जाती है और B1 iii a, Standard Deduction u/s 16(ia) पर दिखती है।",
    why: "यह न छिन सकती है न मना की जा सकती है, इसलिए जिस वेतन आँकड़े में यह अब भी शामिल है वह ₹75,000 ज़्यादा है, और उस पर निकला कर भी ज़्यादा।",
  },
  "net-salary": {
    term: "शुद्ध वेतन",
    what: "सकल वेतन में से छूट वाले भत्ते घटाने पर बची रकम। यह गणना का एक पड़ाव है, वह रकम नहीं जो बैंक खाते में आती है।",
    where: "पोर्टल पर यह Gross Total Income खंड में B1 iii. Net Salary (i – ii) के रूप में दिखता है।",
    why: "लोग इसे हाथ में आने वाली तनख़्वाह समझकर रिटर्न को गलत मान लेते हैं; यह मानक कटौती और कर, दोनों से पहले का आँकड़ा है।",
  },
  "gross-total-income": {
    term: "सकल कुल आय",
    what: "हर मद की आय जोड़कर बनी रकम — वेतन, गृह संपत्ति, अन्य स्रोत — किसी भी कटौती से पहले।",
    where: "पोर्टल इसे Gross Total Income खंड के अंत में खुद जोड़कर दिखाता है।",
    why: "कटौतियाँ इसी आँकड़े में से घटती हैं, इसलिए जो आय यहाँ छूट गई वह पूरे रिटर्न से छूट गई।",
  },
  "total-income": {
    term: "कुल आय",
    what: "सकल कुल आय में से मिलने वाली कटौतियाँ घटाने पर बची रकम। कर इसी पर लगता है।",
    where: "यह Verify your tax liability details के नीचे, कटौतियों की सूची के बाद दिखती है।",
    why: "यही तय करती है कि धारा 87A की छूट मिलेगी या नहीं, ITR-1 चल सकता है या नहीं, और देर से भरने पर धारा 234F का कौन-सा शुल्क लगेगा।",
  },
  "income-from-other-sources": {
    term: "अन्य स्रोतों से आय",
    what: "वह आय जो वेतन, गृह संपत्ति या पूँजीगत लाभ नहीं है। ज़्यादातर वेतनभोगियों के लिए इसका मतलब बैंक ब्याज और लाभांश है।",
    where: "पोर्टल इसे B3. Income from Other Sources के नीचे, Nature of Income ड्रॉपडाउन के साथ पूछता है।",
    why: "आपका बैंक ये रकमें आपके पैन पर पहले ही बता चुका है, इसलिए इन्हें छोड़ने से ऐसा फ़र्क बनता है जो विभाग को तुरंत दिख जाता है।",
  },
  "income-from-house-property": {
    term: "गृह संपत्ति से आय",
    what: "आपकी अपनी संपत्ति से होने वाली आय, चाहे वह किराए पर हो या न हो। जिस मकान में आप खुद रहते हैं, उसे आम तौर पर शून्य दर्ज किया जाता है।",
    where: "पोर्टल इसे B2 के नीचे पूछता है, जहाँ पता, हिस्सेदारी, मिला किराया और स्थानीय कर भरने का फ़ॉर्म है।",
    why: "होम लोन इस आँकड़े को ऋणात्मक कर सकता है, और पोर्टल बताता है कि बाकी आय से जोड़ा जा सकने वाला नुकसान ₹2,00,000 तक ही है।",
  },
  "annual-value": {
    term: "वार्षिक मूल्य",
    what: "एक साल में संपत्ति से जितनी कमाई होना उचित मानी जाए। किराए पर दी संपत्ति में यह किराया घटा स्थानीय निकाय को दिया कर है; अपने रहने के मकान में यह शून्य है।",
    where: "पोर्टल इसे गृह संपत्ति फ़ॉर्म की पंक्ति 1e पर, ऊपर भरे आँकड़ों से खुद निकालता है।",
    why: "उस पूरे खंड की बाकी गणना — 30% की तय छूट और उसमें से घटने वाला ब्याज — इसी एक आँकड़े पर टिकी है।",
  },
  "ltcg-112a": {
    term: "धारा 112A का दीर्घकालिक पूँजीगत लाभ",
    what: "एक साल से ज़्यादा रखे गए सूचीबद्ध शेयरों या इक्विटी म्यूचुअल फ़ंड पर हुआ दीर्घकालिक लाभ। साल में ₹1,25,000 तक के लाभ पर कर नहीं लगता।",
    where: "साल भर का पूँजीगत लाभ विवरण आपके ब्रोकर या फ़ंड हाउस से मिलता है। पोर्टल इसे C3(a) पर पहले से भर देता है।",
    why: "₹1,25,000 तक इसे सिर्फ़ दर्ज करना होता है। इससे ऊपर ITR-1 लागू नहीं रहता और रिटर्न ITR-2 में भरना पड़ता है।",
  },
  "exempt-income": {
    term: "छूट वाली आय",
    what: "वह आय जिस पर कर तो नहीं लगता पर बतानी ज़रूरी है, जैसे कृषि आय या भविष्य निधि की परिपक्वता।",
    where: "पोर्टल इसे C3. Exempt Income के नीचे, हर प्रविष्टि के लिए श्रेणी और उप-श्रेणी के साथ लेता है।",
    why: "इसे बताने में कुछ नहीं जाता, पर ₹5,000 से ज़्यादा कृषि आय होते ही आप ITR-1 के दायरे से बाहर हो जाते हैं।",
  },

  tds: {
    term: "TDS",
    what: "स्रोत पर काटा गया कर। जो आपको भुगतान करता है — नियोक्ता, बैंक, किरायेदार — वह उसमें से कुछ हिस्सा कर के रूप में रोककर आपके पैन पर विभाग को जमा कर देता है।",
    where: "वेतन के लिए फ़ॉर्म 16, बाकी सबके लिए फ़ॉर्म 16A, और विभाग तक क्या पहुँचा यह फ़ॉर्म 26AS में।",
    why: "यह कर आप चुका चुके हैं, पर गिना तभी जाएगा जब फ़ॉर्म 26AS में दिखे। फ़ॉर्म 26AS से ज़्यादा दावा करने वाला रिटर्न मेल नहीं खाएगा।",
  },
  tcs: {
    term: "TCS",
    what: "स्रोत पर वसूला गया कर। कुछ खरीदों पर — विदेश भेजी रकम, महँगा वाहन — विक्रेता ऊपर से कर जोड़कर आपके नाम विभाग को जमा करता है।",
    where: "फ़ॉर्म 26AS का भाग VI, और विक्रेता से मिलने वाला फ़ॉर्म 27D।",
    why: "TDS की तरह यह भी आपके अंतिम बिल में से घटता है, पर पोर्टल हर मामला पहले से नहीं भरता, इसलिए छूट गई वसूली आपका चुकाया और बिना माँगा पैसा रह जाती है।",
  },
  tan: {
    term: "टैन",
    what: "कर कटौती खाता संख्या। दस अक्षरों का यह कोड बताता है कि आपके भुगतान से कर किसने काटा। यह पैन से अलग चीज़ है।",
    where: "आपके फ़ॉर्म 16 के भाग A पर छपा होता है, और फ़ॉर्म 26AS की हर प्रविष्टि के साथ दिखता है।",
    why: "विभाग इसी कोड से आपके दावे को काटने वाले की जमा रकम से मिलाता है, इसलिए गलत टैन पर क्रेडिट बेमेल पड़ा रह जाता है।",
  },
  "advance-tax": {
    term: "अग्रिम कर",
    what: "साल बीतने के बाद नहीं, बल्कि साल के दौरान ही किश्तों में चुकाया गया कर। यह तब लागू होता है जब TDS के बाद बचा कर ₹10,000 से ज़्यादा हो।",
    where: "आधिकारिक पोर्टल पर e-File → e-Pay Tax। चुकाई गई रकमें फ़ॉर्म 26AS में भी दिखती हैं।",
    why: "किश्तें 15 जून, 15 सितंबर, 15 दिसंबर और 15 मार्च को देय होती हैं, और ब्याज उसी छूटी तारीख़ से चलता है, फाइल करने की तारीख़ से नहीं।",
  },
  "self-assessment-tax": {
    term: "स्व-निर्धारण कर",
    what: "फाइल करने से पहले खुद चुकाई जाने वाली बची हुई रकम, जब TDS और अग्रिम कर मिलकर भी पूरा बिल नहीं भर पाए।",
    where: "आधिकारिक पोर्टल पर e-File → e-Pay Tax; पहले भुगतान होता है, फिर चालान का विवरण रिटर्न में भरा जाता है।",
    why: "बकाया रकम पर धारा 234A का ब्याज चलता रहता है, इसलिए रिटर्न पूरा करने और भुगतान करने के बीच के दिनों की कीमत लगती है।",
  },
  challan: {
    term: "चालान",
    what: "कर भुगतान की रसीद। इस पर बैंक शाखा का BSR कोड, जमा की तारीख़, क्रम संख्या और रकम होती है।",
    where: "आधिकारिक पोर्टल पर e-File → e-Pay Tax → Payment History, जहाँ भुगतान के बाद इसे डाउनलोड किया जा सकता है।",
    why: "रिटर्न में ये चारों जानकारियाँ हाथ से भरनी पड़ती हैं, और जिस भुगतान को विभाग चालान से मिला नहीं पाता वह चुकाया हुआ नहीं गिना जाता।",
  },
  "bsr-code": {
    term: "BSR कोड",
    what: "सात अंकों का कोड, जो बताता है कि आपका कर किस बैंक शाखा ने लिया।",
    where: "भुगतान के बाद डाउनलोड किए गए चालान पर छपा होता है।",
    why: "रिटर्न जो चार जानकारियाँ माँगता है यह उनमें से एक है, और इसी से विभाग बाकी सबके बीच आपका भुगतान ढूँढ़ पाता है।",
  },
  "tax-credit": {
    term: "कर क्रेडिट",
    what: "आपके नाम पर पहले चुकाया जा चुका कर — TDS, TCS, अग्रिम कर या स्व-निर्धारण कर — जो अंतिम कर में से घटता है।",
    where: "विभाग को आपके पैन पर क्या मिला, इसकी अपनी सूची फ़ॉर्म 26AS है।",
    why: "क्रेडिट सिर्फ़ उसी आय के साथ माँगा जा सकता है जिससे वह कटा है। आय दर्ज किए बिना क्रेडिट माँगना ठीक वही बेमेल है जिससे त्रुटिपूर्ण रिटर्न का नोटिस आता है।",
  },

  "new-tax-regime": {
    term: "नई कर व्यवस्था",
    what: "तयशुदा गणना। स्लैब चौड़े और मानक कटौती बड़ी, ₹75,000 की — बदले में पुरानी कटौतियाँ लगभग कोई नहीं।",
    where: "जब तक आप Personal Information में धारा 115BAC(6) वाले सवाल का जवाब Yes नहीं देते, यही लागू रहती है।",
    why: "आप इसमें तब भी हैं जब वह सवाल आपने देखा तक न हो, इसलिए बड़ी 80C और होम लोन कटौतियों वाला व्यक्ति दूसरी व्यवस्था से ज़्यादा कर चुका सकता है।",
  },
  "old-tax-regime": {
    term: "पुरानी कर व्यवस्था",
    what: "पहले वाली गणना। स्लैब सँकरे और मानक कटौती ₹50,000, पर धारा 80C, धारा 80D, मकान किराया और होम लोन ब्याज बने रहते हैं।",
    where: "Personal Information में धारा 115BAC(6) वाले सवाल का जवाब Yes देने पर यही व्यवस्था लागू होती है।",
    why: "कौन-सी व्यवस्था सस्ती पड़ेगी यह पूरी तरह आपकी असली कटौतियों पर टिका है, इसलिए दोनों का मतलब तभी है जब वे आपके अपने आँकड़ों पर निकाली जाएँ।",
  },
  "section-115bac": {
    term: "धारा 115BAC",
    what: "वह धारा जो नई कर व्यवस्था तय करती है। उपधारा (6) उससे बाहर निकलकर पुरानी व्यवस्था में जाने का अधिकार है।",
    where: "Personal Information पूछता है: Do you wish to exercise the option u/s 115BAC(6) of opting out of the new tax regime? तयशुदा जवाब No है।",
    why: "सवाल उल्टा बना है — No का मतलब नई व्यवस्था में बने रहना है — इसलिए मन में कुछ और सोचकर उलटा जवाब दे देना आसान है।",
  },
  "rebate-87a": {
    term: "धारा 87A छूट",
    what: "कर निकल जाने के बाद लगने वाली कमी। नई व्यवस्था में कुल आय ₹12,00,000 या उससे कम होने पर यह ₹60,000 तक का कर शून्य कर देती है।",
    where: "यह गणना में खुद लग जाती है। न कुछ माँगना है, न कोई खाना भरना है।",
    why: "इसी वजह से ₹12,00,000 तक की कुल आय पर कोई कर नहीं लगता, जबकि स्लैब तालिका ₹4,00,000 से ऊपर कर लगाना शुरू कर देती है।",
  },
  cess: {
    term: "स्वास्थ्य और शिक्षा उपकर",
    what: "धारा 87A की छूट लगने के बाद बचे कर पर ऊपर से जुड़ने वाला 4% का तय हिस्सा।",
    where: "यह Verify your tax liability details के नीचे अपनी अलग पंक्ति में दिखता है।",
    why: "इसीलिए अंतिम रकम स्लैब की गणना से थोड़ी ऊपर बैठती है: ₹1,00,000 कर पर यह ₹4,000 जोड़ देता है।",
  },
  "section-80ccd2": {
    term: "धारा 80CCD(2)",
    what: "आपके पेंशन खाते में नियोक्ता जो जमा करता है, उस पर मिलने वाली कटौती। आपका अपना योगदान अलग धारा में आता है।",
    where: "रिटर्न का Total Deductions खंड। रकम आपके फ़ॉर्म 16 के भाग B से आती है।",
    why: "नई व्यवस्था में बची हुई गिनी-चुनी कटौतियों में से यह एक है, इसलिए जिस पन्ने पर बाकी सब ₹0 है वहाँ भी इसमें रकम हो सकती है।",
  },
  "section-80cch": {
    term: "धारा 80CCH",
    what: "अग्निपथ योजना में अग्निवीर के योगदान पर मिलने वाली कटौती।",
    where: "Total Deductions खंड में, 80CCD(2) के नीचे।",
    why: "पोर्टल लिखता है कि केंद्र सरकार के अलावा किसी रोज़गार श्रेणी में यह नहीं मिलती, इसलिए ज़्यादातर वेतनभोगियों के लिए यह पंक्ति ₹0 पर रहती है।",
  },
  "section-24b": {
    term: "धारा 24(b)",
    what: "मकान खरीदने, बनवाने या मरम्मत के लिए लिए गए कर्ज़ के ब्याज पर मिलने वाली कटौती।",
    where: "गृह संपत्ति फ़ॉर्म के भीतर, ब्याज वाली पंक्ति के साथ खुलने वाले हिस्से में।",
    why: "यही होम लोन को कम कर में बदलती है, और नई व्यवस्था में यह सिर्फ़ किराए पर दी संपत्ति पर लगती है, अपने रहने के मकान पर नहीं।",
  },
  slab: {
    term: "स्लैब",
    what: "आय की एक पट्टी, जिसकी अपनी कर दर होती है। आय का जितना हिस्सा उस पट्टी में आता है, उतने पर ही उस दर से कर लगता है।",
    where: "",
    why: "इसीलिए तनख़्वाह बढ़ने से नुकसान कभी नहीं होता: ऊपर की पट्टी में जाने पर नई दर सिर्फ़ नए रुपयों पर लगती है, पहले की पूरी कमाई पर नहीं।",
  },

  "assessment-year": {
    term: "निर्धारण वर्ष",
    what: "वह वर्ष जिसमें आप पिछले वर्ष की कमाई का रिटर्न भरते हैं। 1 अप्रैल 2025 से 31 मार्च 2026 के बीच की आय निर्धारण वर्ष 2026-27 में भरी जाती है।",
    where: "रिटर्न शुरू करते ही पहला ड्रॉपडाउन: e-File → Income Tax Returns → File Income Tax Return।",
    why: "गलत वर्ष चुनने पर रिटर्न गलत अवधि का भर जाता है, और स्क्रीन पर कुछ नहीं पकड़ता — पता तब चलता है जब विभाग के आँकड़े आपसे नहीं मिलते।",
  },
  "financial-year": {
    term: "वित्तीय वर्ष",
    what: "वह वर्ष जिसमें आय सचमुच कमाई गई, 1 अप्रैल से 31 मार्च तक। वित्तीय वर्ष 2025-26 का निर्धारण वर्ष 2026-27 में होता है।",
    where: "फ़ॉर्म 26AS के शीर्ष में, निर्धारण वर्ष के साथ छपा रहता है।",
    why: "दस्तावेज़ और स्क्रीन बिना बताए इन दोनों वर्षों के बीच बदलते रहते हैं, और गलत वर्ष से उठाया आँकड़ा कभी मेल नहीं खाएगा।",
  },
  "itr-1": {
    term: "ITR-1",
    what: "जिसे सहज भी कहते हैं। सबसे छोटा रिटर्न फ़ॉर्म, उस निवासी व्यक्ति के लिए जिसकी आय वेतन, गृह संपत्ति और अन्य स्रोतों से है।",
    where: "यह Select ITR Form पर मिलता है, या Help me select ITR के सवालों से खुद निकल आता है।",
    why: "इसकी सीमा है: कुल आय ₹50 लाख तक, दो गृह संपत्ति तक और कृषि आय ₹5,000 तक। इनमें से एक भी पार हुई तो रिटर्न ITR-2 में जाएगा।",
  },
  "itr-2": {
    term: "ITR-2",
    what: "लंबा रिटर्न फ़ॉर्म, उस आय के लिए जो ITR-1 में नहीं समाती — छूट सीमा से ऊपर का पूँजीगत लाभ, दो से ज़्यादा गृह संपत्ति, विदेशी आय, या आगे ले जाने वाला नुकसान।",
    where: "यह भी उसी Select ITR Form चरण पर चुना जाता है जहाँ ITR-1 है।",
    why: "जहाँ ITR-2 चाहिए वहाँ ITR-1 भरने पर रिटर्न त्रुटिपूर्ण माना जा सकता है, जिसमें लंबा फ़ॉर्म भरने से कहीं ज़्यादा समय जाता है।",
  },
  "section-139-1": {
    term: "धारा 139(1)",
    what: "सामान्य स्थिति: नियत तारीख़ को या उससे पहले भरा गया रिटर्न।",
    where: "Personal Information → Filing Section → Filed u/s, जहाँ 139(1) पहला विकल्प है।",
    why: "यही विकल्प दर्ज करता है कि आप समय पर थे, इसलिए न धारा 234F का शुल्क लगता है न धारा 234A का ब्याज। निर्धारण वर्ष 2026-27 में वेतनभोगियों की नियत तारीख़ 31 जुलाई 2026 थी।",
  },
  "section-139-4": {
    term: "धारा 139(4)",
    what: "विलंबित रिटर्न — नियत तारीख़ निकलने के बाद, पर विलंबित अवधि बंद होने से पहले भरा गया।",
    where: "Personal Information की उसी Filed u/s सूची में, दूसरे विकल्प के रूप में।",
    why: "निर्धारण वर्ष 2026-27 में यह अवधि 31 दिसंबर 2026 तक चलती है, और इसमें भरे रिटर्न पर धारा 234F का शुल्क और बकाया कर पर धारा 234A का ब्याज लगता है।",
  },
  "section-139-5": {
    term: "धारा 139(5)",
    what: "संशोधित रिटर्न, जो पहले भरे गए रिटर्न की जगह लेता है क्योंकि उसमें गलती मिल गई।",
    where: "Personal Information में Filed u/s → 139(5), जहाँ पहले वाले रिटर्न की पावती संख्या भी भरनी होती है।",
    why: "निर्धारण वर्ष 2026-27 का रिटर्न 31 दिसंबर 2026 तक संशोधित हो सकता है, इसलिए समय पर भरे रिटर्न की गलती सुधर जाती है, जबकि कुछ न भरने की भरपाई नहीं होती।",
  },
  "section-139-8a": {
    term: "धारा 139(8A)",
    what: "अद्यतन रिटर्न, जो सामान्य और विलंबित, दोनों अवधियाँ बंद होने के बाद भरा जाता है।",
    where: "Personal Information में Filed u/s → 139(8A)।",
    why: "31 दिसंबर 2026 निकल जाने के बाद यही एक रास्ता बचता है, और इसमें जो कर बकाया था उस पर अतिरिक्त कर भी देना होता है।",
  },
  "section-139-9": {
    term: "धारा 139(9)",
    what: "त्रुटिपूर्ण रिटर्न। विभाग ने आपका भरा रिटर्न पढ़ा, उसे अपने रिकॉर्ड से अलग पाया, और उस पर नोटिस भेजा है।",
    where: "सुधरा हुआ रिटर्न Personal Information → Filed in response to notice u/s → 139(9) से वापस जाता है।",
    why: "नोटिस का जवाब देने के लिए थोड़ा ही समय मिलता है, और त्रुटि बिना सुधरे रह गई तो पहला रिटर्न ऐसा गिना जा सकता है जैसे भरा ही न गया हो।",
  },
  "seventh-proviso": {
    term: "धारा 139(1) का सातवाँ परंतुक",
    what: "एक नियम, जो आय कर योग्य सीमा से नीचे होने पर भी रिटर्न भरना ज़रूरी बना देता है — कुछ बड़े लेन-देन पर, जैसे बड़ी बैंक जमा, विदेश यात्रा का खर्च या बिजली का बिल।",
    where: "फाइलिंग का कारण पूछने वाली स्क्रीन यह पूछती है, और बाद में Personal Information में जवाब Edit Response के साथ दोहरा दिया जाता है।",
    why: "इनमें से कोई लेन-देन आप पर लागू हो तो कर शून्य होने पर भी रिटर्न देना बनता है, और न भरना रिटर्न न भरने में ही गिना जाता है।",
  },
  "section-234f": {
    term: "धारा 234F",
    what: "नियत तारीख़ के बाद भरने पर लगने वाला तय शुल्क। कुल आय ₹5,00,000 या उससे कम हो तो ₹1,000, उससे ऊपर ₹5,000।",
    where: "नियत तारीख़ निकलते ही यह गणना में अपने आप आ जाता है। कुछ भरना नहीं पड़ता।",
    why: "यह बकाया कर पर नहीं, रिटर्न पर लगता है, इसलिए रिफ़ंड मिलने की स्थिति में भी लग जाता है।",
  },
  "section-234a": {
    term: "धारा 234A",
    what: "नियत तारीख़ के बाद बचे हुए कर पर ब्याज। यह नियत तारीख़ के अगले दिन से कर चुकाने तक, महीने-दर-महीने चलता है।",
    where: "यह गणना में बाकी ब्याज पंक्तियों के साथ दिखता है।",
    why: "धारा 234F के तय शुल्क से अलग, यह जितनी देर रकम बकाया रहे उतना बढ़ता है, और रिटर्न भरने पर नहीं, कर चुकाने पर रुकता है।",
  },
  pan: {
    term: "पैन",
    what: "स्थायी खाता संख्या। दस अक्षरों का यह कोड आयकर विभाग के सामने आपकी पहचान है। आपके नाम पर बताया गया हर भुगतान इसी पर दर्ज होता है।",
    where: "आपके पैन कार्ड पर। न हो तो NSDL या UTIITSL की साइट से इसके लिए आवेदन किया जाता है।",
    why: "सब कुछ पैन से मिलाया जाता है, इसलिए गलत लिखे पैन पर बताई गई आय आपके रिकॉर्ड तक पहुँचती ही नहीं और उस पर कटे कर का दावा नहीं हो सकता।",
  },
  "representative-assessee": {
    term: "प्रतिनिधि निर्धारिती",
    what: "वह व्यक्ति जो किसी ऐसे के लिए रिटर्न भरता है जो खुद नहीं भर सकता — नाबालिग, अस्वस्थ मस्तिष्क का व्यक्ति, या जिसका निधन हो चुका है।",
    where: "Personal Information में Yes या No पूछा जाता है। अपना रिटर्न भरने वाला व्यक्ति No चुनता है।",
    why: "Yes से यह बदल जाता है कि रिटर्न किसका है, इसलिए गलती से Yes चुनने पर रिटर्न गलत हैसियत में भर जाता है और विवरण पैन से मेल खाना बंद कर देते हैं।",
  },
  "residential-status": {
    term: "आवासीय स्थिति",
    what: "उस वर्ष आप भारत में निवासी माने गए या नहीं। यह इस पर निर्भर है कि आप कितने दिन देश में रहे, नागरिकता पर नहीं।",
    where: "Help me select ITR के सवालों में सबसे पहला, जिसमें Resident and Ordinarily Resident, Resident but Not Ordinarily Resident, Non-Resident और Don't Know विकल्प हैं।",
    why: "यही तय करता है कि भारत आपकी कौन-सी आय पर कर लेगा, और ITR-1 सिर्फ़ निवासी ही भर सकता है।",
  },
  "nature-of-employment": {
    term: "रोज़गार का प्रकार",
    what: "आप किस तरह के नियोक्ता के यहाँ हैं — केंद्र सरकार, राज्य सरकार, सार्वजनिक क्षेत्र, निजी क्षेत्र, पेंशनभोगी, या अन्य।",
    where: "Personal Information खंड का एक ड्रॉपडाउन। निजी क्षेत्र का कर्मचारी Others में आता है।",
    why: "कुछ कटौतियाँ श्रेणी से बँधी हैं — धारा 80CCH सिर्फ़ केंद्र सरकार के रोज़गार तक सीमित है — इसलिए यह जवाब बदल देता है कि कटौती खंड क्या स्वीकार करेगा।",
  },

  "e-verify": {
    term: "ई-सत्यापन",
    what: "यह पुष्टि करना कि अभी जमा किया गया रिटर्न सचमुच आपका ही है। सत्यापन होने तक जमा किया गया रिटर्न भरा हुआ नहीं माना जाता।",
    where: "यह जमा करने के बाद आता है, और बाद में e-File → Income Tax Returns → e-Verify Return से भी किया जा सकता है।",
    why: "सत्यापन के लिए 30 दिन मिलते हैं। ये निकल गए तो रिटर्न भरा ही नहीं गिना जाता, और देरी के नतीजे मूल नियत तारीख़ से जोड़े जाते हैं।",
  },
  evc: {
    term: "EVC",
    what: "इलेक्ट्रॉनिक सत्यापन कोड। आपके दर्ज मोबाइल और ईमेल पर आने वाला छोटा कोड, जो बिना हस्ताक्षर के रिटर्न सत्यापित कर देता है।",
    where: "सत्यापन चरण पर नेट बैंकिंग, पहले से सत्यापित बैंक खाते या डीमैट खाते से बनाया जाता है।",
    why: "जिनका मोबाइल नंबर आधार से जुड़ा नहीं है उनके लिए यही रास्ता है, और यही तय करता है कि रिटर्न भरा हुआ है या सिर्फ़ जमा हुआ।",
  },
  dsc: {
    term: "DSC",
    what: "डिजिटल हस्ताक्षर प्रमाणपत्र। एक भौतिक टोकन, जिसमें आपके पैन पर जारी किया गया कूट हस्ताक्षर रहता है।",
    where: "यह किसी लाइसेंस प्राप्त प्रमाणन एजेंसी से लिया जाता है और इस्तेमाल से पहले पोर्टल पर दर्ज करना होता है।",
    why: "सत्यापन का यही एक तरीका है जो OTP आने पर टिका नहीं है, पर इसे फाइल करने वाले दिन नहीं, पहले से दर्ज कराना पड़ता है।",
  },
  acknowledgement: {
    term: "पावती",
    what: "भरे हुए रिटर्न की रसीद, जिस पर पावती संख्या, तारीख़ और भरे गए आँकड़े होते हैं। इसे ITR-V भी कहते हैं।",
    where: "e-File → Income Tax Returns → View Filed Returns, जहाँ किसी भी वर्ष की पावती डाउनलोड की जा सकती है।",
    why: "संशोधित रिटर्न में, नोटिस के जवाब में, और रिटर्न भरने का प्रमाण माँगने वाले कर्ज़ या वीज़ा आवेदन में यही पावती संख्या दी जाती है।",
  },
  "prevalidated-account": {
    term: "पहले से सत्यापित बैंक खाता",
    what: "पोर्टल पर पुष्टि किया गया बैंक खाता, जिसका नाम, पैन और खाता संख्या बैंक के अपने रिकॉर्ड से मिला ली गई है।",
    where: "आधिकारिक पोर्टल पर Profile → My Bank Account, जहाँ पुष्टि हो चुके खाते पर Validated का चिह्न दिखता है।",
    why: "रिफ़ंड सिर्फ़ ऐसे ही खाते में जाता है जो रिफ़ंड के लिए चुना गया हो, इसलिए इसके बिना रिटर्न में दिखे रिफ़ंड के जाने की कोई जगह नहीं रहती।",
  },
  "dormant-account": {
    term: "निष्क्रिय खाता",
    what: "ऐसा बैंक खाता जिसमें लंबे समय से ग्राहक की ओर से कोई लेन-देन नहीं हुआ और बैंक ने उसे निष्क्रिय कर दिया है।",
    where: "खाता निष्क्रिय हुआ है या नहीं, यह आपका बैंक बताता है, और पोर्टल ऐसे खाते को सत्यापित नहीं करता।",
    why: "रिटर्न निष्क्रिय खातों को छोड़कर बाकी सभी खाते माँगता है, इसलिए इसे जोड़ने से एक ऐसा खाता जुड़ जाता है जिसमें रिफ़ंड कभी नहीं आ सकता।",
  },
  refund: {
    term: "रिफ़ंड",
    what: "वापस मिलने वाली रकम, जब आपके नाम पर पहले चुकाया गया कर अंतिम देय कर से ज़्यादा निकलता है।",
    where: "e-File → Income Tax Returns → View Filed Returns बताता है कि हर वर्ष का रिटर्न और रिफ़ंड कहाँ तक पहुँचा।",
    why: "यह रिटर्न सत्यापित होने के बाद ही, और सिर्फ़ रिफ़ंड के लिए चुने गए पहले से सत्यापित खाते में आता है, इसलिए बिना सत्यापन वाला रिटर्न वहीं पड़ा रह जाता है।",
  },
  "ais-feedback": {
    term: "AIS फ़ीडबैक",
    what: "विभाग को यह बताना कि आपके वार्षिक सूचना विवरण में कुछ गलत है — वह आपका नहीं है, दो बार गिना गया है, या रकम गलत है।",
    where: "Compliance Portal पर AIS में ही, जहाँ हर पंक्ति के साथ फ़ीडबैक का विकल्प रहता है।",
    why: "जिस प्रविष्टि को आप नहीं पहचानते उसका रास्ता यही है, और यह अलग से चलता है, इसलिए रिटर्न उसके नतीजे का इंतज़ार नहीं करता।",
  },
  "defective-return": {
    term: "त्रुटिपूर्ण रिटर्न",
    what: "ऐसा रिटर्न जिसे विभाग ने ले तो लिया पर अपने रिकॉर्ड से अलग पाया। यह खारिज नहीं होता — सुधार होने तक रोक लिया जाता है।",
    where: "नोटिस ईमेल पर आता है और पोर्टल पर Pending Actions → e-Proceedings में दिखता है।",
    why: "यह आम तौर पर फाइल करने के महीनों बाद आता है, जब रिफ़ंड खर्च हो चुका होता है और काग़ज़ रख दिए जाते हैं। सबसे आम वजह है, बिना आय दर्ज किए माँगा गया कर क्रेडिट।",
  },
};

export const glossary: {
  en: Record<GlossaryId, GlossaryEntry>;
  hi: Record<GlossaryId, GlossaryEntry>;
} = { en, hi };

/** Every id, for tests and for the glossary index page. */
export const glossaryIds: GlossaryId[] = [
  "form-16",
  "form-26as",
  "ais",
  "tis",
  "form-16a",
  "traces",
  "gross-salary",
  "perquisite",
  "exempt-allowance",
  "standard-deduction",
  "net-salary",
  "gross-total-income",
  "total-income",
  "income-from-other-sources",
  "income-from-house-property",
  "annual-value",
  "ltcg-112a",
  "exempt-income",
  "tds",
  "tcs",
  "tan",
  "advance-tax",
  "self-assessment-tax",
  "challan",
  "bsr-code",
  "tax-credit",
  "new-tax-regime",
  "old-tax-regime",
  "section-115bac",
  "rebate-87a",
  "cess",
  "section-80ccd2",
  "section-80cch",
  "section-24b",
  "slab",
  "assessment-year",
  "financial-year",
  "itr-1",
  "itr-2",
  "section-139-1",
  "section-139-4",
  "section-139-5",
  "section-139-8a",
  "section-139-9",
  "seventh-proviso",
  "section-234f",
  "section-234a",
  "pan",
  "representative-assessee",
  "residential-status",
  "nature-of-employment",
  "e-verify",
  "evc",
  "dsc",
  "acknowledgement",
  "prevalidated-account",
  "dormant-account",
  "refund",
  "ais-feedback",
  "defective-return",
];
