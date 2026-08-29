import type { Language } from "./case-data";

/* English is the source of truth for the copy shape. Hindi is typed against it,
   so a missing translation is a build error rather than an empty screen. */

const en = {
  brand: "Sahi Return",
  strapline: "File your salaried return yourself",
  prototype: "Independent hackathon prototype",
  synthetic: "Synthetic data only",
  notOfficial: "Not an Income Tax Department service",
  trustToggle: "How to check you are on the real one",
  trustHide: "Hide this",
  trustNotGovTitle: "This is not a government service",
  trustNotGov:
    "Sahi Return is an independent prototype built for a hackathon. It has no connection to the Income Tax Department, creates no government record, and carries no government endorsement.",
  trustRealTitle: "Where the real service lives",
  trustReal:
    "The Income Tax e-Filing portal is at incometax.gov.in. Read the address bar and check for the padlock before you sign in anywhere, and reach it by typing the address rather than following a link in a message.",
  trustNeverTitle: "What the department never asks for",
  trustNever:
    "Your PIN, password, OTP or bank account details. Never by email, never by SMS, never by phone call. Forward a suspicious message to CERT-In at incident@cert-in.org.in.",
  trustSource: "Source: Income Tax Department anti-phishing notice, 5 February 2016",
  skip: "Skip to main content",

  commandTrigger: "Search or run a command",
  /* What the masthead field says at rest. Short because it shares a row with
     five other controls; the full name above is what a screen reader hears. */
  searchPlaceholder: "Search",
  commandPlaceholder: "Type a step, a task, or a question",
  commandHint: "Everything here is also reachable without this panel.",
  commandNoResults:
    "Nothing matched. Try “salary”, “regime”, “Hindi”, or “help”.",
  commandNavigate: "Move",
  commandRun: "Open",
  commandClose: "Close",
  commandGroupStep: "On this step",
  commandGroupGo: "Go to a step",
  commandGroupPages: "Pages",
  commandGroupSettings: "Settings",
  commandGroupHelp: "Help and official sources",
  commandHere: "You are here",
  commandFilter: "Show",
  commandAll: "Everything",

  settings: "Settings",
  settingsLanguage: "Language",
  settingsAppearance: "Appearance",
  settingsLight: "Light",
  settingsDark: "Dark",
  settingsPaper: "Paper",
  settingsSystem: "Match device",
  settingsTextSize: "Text size",
  settingsTextNormal: "Normal text size",
  settingsTextLarge: "Large text size",
  settingsTextLargest: "Largest text size",
  settingsData: "Save mobile data",
  settingsDataHint:
    "Turns off animation, shadows and blur so pages weigh less on a slow connection. Every step works the same way.",

  english: "English",
  hindi: "हिन्दी",

  saved: "Saved on this device",
  offline: "Offline. Your answers are still saved on this device.",
  online: "Back online",
  resume: "You have a saved demo draft.",
  continueDraft: "Continue where you stopped",
  startAgain: "Start again",

  clearData: "Clear data on this device",
  clearConfirm: "Clear this synthetic draft?",
  clearExplanation:
    "This removes the demo answers and reference kept in this browser. Nothing else is stored anywhere.",
  cancel: "Cancel",
  confirmClear: "Clear synthetic draft",

  back: "Back",
  continue: "Continue",
  close: "Close",

  help: "Help with this step",
  helpTitle: "Help with this step",
  support: "Create a demo support request",
  supportTitle: "Demo support request",
  supportIntro:
    "This sends nothing. It shows the information a staffed support service would receive, including which step you were on.",
  supportStage: "Step recorded with this request",
  supportIssue: "What do you need help with?",
  supportOptions: [
    "Choosing the right form",
    "Reading my Form 16",
    "An entry I do not recognise",
    "Choosing a tax regime",
    "Filing and verification",
    "Reporting an accessibility problem",
  ],
  supportDetails: "Describe the problem",
  supportExample: "For example, tell us which message or step is unclear.",
  createSupport: "Create synthetic support reference",
  supportCreated: "Synthetic support request created",
  supportResponse:
    "No request was sent. A production service would show the owning team and a response target here.",
  supportOwner: "Owner in a production service",
  supportOwnerValue: "e-Filing helpdesk, first response target 2 working days",

  source: "Source",
  reviewed: "Reviewed 27 August 2026",
  reviewedLabel: "Reviewed",
  reviewedDate: "27 August 2026",
  nextReviewLabel: "Next review",
  nextReviewDate: "27 November 2026",
  officialSource: "Income Tax Department ITR-1 filing guide",
  officialManual: "Official Annual Information Statement guide",
  officialPortalLink: "Official Income Tax e-Filing portal",
  newWindow: ", opens in a new window",
  officialWarning:
    "This prototype does not calculate or file real tax. File any real return on the official Income Tax e-Filing portal.",

  helpline: "Official helpdesk",
  helplineNote:
    "Published by the Income Tax Department. This prototype does not operate a support line.",

  tpDeductionsTitle: "Deductions you can claim",
  tpDeductionsIntro:
    "The portal shows this section whichever regime you are in, with almost every line at zero, and does not say why. There are two different reasons a line can be zero, and they mean opposite things.",
  tpRegimeNew: "Read under the new regime",
  tpRegimeOld: "Read under the old regime",
  tpRegimeUnchosen: "You have not chosen a regime yet",
  tpHeadSection: "Section",
  tpHeadWhat: "What it is",
  tpHeadStatus: "Where it stands",
  tpHeadAmount: "Amount",
  tpStatusClaimed: "Claimed",
  tpStatusNone: "You have none",
  tpStatusNotInRegime: "Not in this regime",
  tpStatusAwaitingRegime: "Depends on your regime",
  tpAmountAwaitingRegime: "Not yet known",
  tpDeductionsTotal: "Total deductions claimed",
  tpWhyLabel: "Why",
  tpSchedulesTitle: "Tax already paid on your behalf",
  tpSchedulesIntro:
    "Five schedules, one for each way tax can already have reached the department in your name. Most of them are empty for a salaried filer, and an empty one still says what would put a line in it.",
  tpSchedulesSummary: (total: number, empty: number) =>
    `${total} schedules, ${empty} of them empty`,
  tpEntriesCount: (count: number) =>
    count === 1 ? "1 entry" : `${count} entries`,
  tpEntriesNone: "Nothing here",
  tpTaxPaidTotal: "Total tax already paid",
  tpOfficialSummary: "The portal's own wording",
  tpSourceLabel: "Taken from",

  persFilingTitle: "Which section you are filing under",
  persFilingIntro:
    "The portal opens this with a toggle and nine radio buttons, and expects you to know which one is yours. Only one is, and it follows from today's date.",
  persAppliesLabel: "The section that applies to you",
  persFilingReason: {
    onTime:
      "The due date has not passed, so this is an ordinary return filed on time. No late fee and no interest for lateness attach to it.",
    belated:
      "The due date has gone and the belated window is open, so this is the section a return filed today falls under.",
    belatedClosed:
      "The belated window has closed. An updated return under section 139(8A) is the remaining route.",
  },
  persOfficialLabel: "The portal's wording",
  persWhenLabel: "When it applies",
  persOtherOptionsLabel: (count: number) =>
    `The other ${count} in the same list`,
  persOtherOptionsNote:
    "These are here so you can see what the portal was offering. None of them applies to you today.",
  persNoticeStateLabel: "Does not apply to you",
  persNoticeNote:
    "These four only apply once the department has written to you. Nothing has.",
  persNoticeOptionsSummary: (count: number) => `Read all ${count}`,
  persRepresentativeTitle: "Who is filing",
  persPortalAsksLabel: "The portal asks",
  persAnswerLabel: "Your answer",
  persRefundLegend: "Where your refund goes",
  persAccountNumberLabel: "Account number",
  persIfscLabel: "IFSC",
  persAccountTypeLabel: "Type",
  persRulesLabel: "The portal's rules for this section",
  persAddAnotherNote:
    "The real portal lets you add an account here. This prototype uses fixed synthetic accounts.",
  persProfileTitle: "Who the department thinks you are",
  persProfileIntro:
    "None of this was typed by you. The portal fills it from your PAN record before you arrive, and a return goes out carrying it whether you have read it or not. So read it, and correct anything that has gone stale.",
  persContactTitle: "Where the department would write to you",
  persContactIntro:
    "The acknowledgement, the refund message, and any notice about this return all go to the number and the address in this block. A stale email address here is how a notice goes unanswered for months.",
  persPortalCallsLabel: "The portal calls this block",
  persSeparateFlowNote:
    "On the official portal this block is a page of its own: its Edit button leaves your half-finished return, and you come back to it afterwards. It is kept here, in place, because nothing in it should cost you your place in the return.",
  persMandatoryNote: "The portal marks its required boxes with an asterisk. So do we.",
  persEditLabel: "Change these details",
  persSaveLabel: "Save these details",
  persCancelLabel: "Cancel",
  persUndoLabel: "Put the department's version back",
  persChangedBadge: "Changed by you",
  persLockedBadge: "Cannot be changed here",
  persEmptyValue: "Not given",

  eligOutOfScope: (form: string) =>
    `Your answers point at ${form}. This prototype builds the ITR-1 route only, so the rest of this demo still shows the ITR-1 journey. Change the answer back to follow it.`,
  eligTitle: "The eighteen questions behind that form",
  eligIntro:
    "Before the official portal lets you begin, it runs a wizard called “Help me select ITR”: six sections, eighteen questions, in the department's own words. Almost all of them are answered by records the department already holds, so they are answered here. Change any one and the form recalculates.",
  eligSummary: (questions: number, sections: number) =>
    `${questions} questions in ${sections} sections, already answered`,
  eligOutcomeLabel: "The form that applies to you",
  eligOutcomeSettled: "Nothing in your answers takes you out of it.",
  eligOutcomeBlocked: (form: string) =>
    `Your answers take you out of ITR-1. On these answers you would file ${form}.`,
  eligCausesLabel: (count: number) =>
    count === 1 ? "The answer that decided this" : `The ${count} answers that decided this`,
  eligSectionCount: (count: number) =>
    count === 1 ? "1 question" : `${count} questions`,
  eligStateSettled: "Nothing to do",
  eligStateChanged: "You changed an answer",
  eligStateBlocking: "Decided your form",
  eligWhyLabel: "How we know",
  eligChangedLabel: "You changed this",
  eligChangedFrom: (recordAnswer: string) => `Our records say: ${recordAnswer}`,
  eligDecidedLabel: "Decided your form",
  eligOfficialSummary: "The portal's own wording",
  eligDisclaimer:
    "This works out which form applies from the answers on this screen. It is here to help you file, and it is not legal advice.",
  eligPrototypeNote:
    "An independent prototype using synthetic records. Nothing here is tax advice, and nothing is sent to the Income Tax Department.",
  eligClosingLabel: "Where this leaves you",
  eligClosingSettled: (form: string) =>
    `${form} is still the form that applies, and it is the one the rest of this journey fills in. There is nowhere else you need to go — carry on from here.`,
  eligClosingBlocked: (form: string) =>
    `On the answers as they now stand it is ${form} that applies, not ITR-1. This prototype builds the ITR-1 route only, so this is where it stops and the department's own portal takes over.`,
  eligClosingUnchanged:
    "Every answer above is still the one the department's own records give.",
  eligClosingChanged: (count: number) =>
    count === 1
      ? "One answer is no longer what the department's records say:"
      : `${count} answers are no longer what the department's records say:`,
  eligClosingNowLabel: "Your answer",
  eligClosingLink: (form: string) => `Official filing help for ${form}`,

  docsTitle: "Your documents",
  docsDetailSummary: "What it is, and how to get it",
  docsFrom: "Where it comes from",
  docsWhere: "How to get it",
  docsUsedFor: "Used here for",
  docsNeeded: "Needed here",
  docsExplained: "Explained only",
  docsCrossChecksTitle: "How these check each other",
  docsShouldMatch: "Should match",
  docsIfNot: "If it does not",

  steps: [
    "Start",
    "What applies to you",
    "Your salary",
    "Your other income",
    "Your tax regime",
    "Before you file",
    "Review and file",
    "Acknowledgement",
  ],
  stepOf: (current: number, total: number) => `Step ${current} of ${total}`,
  stepsDone: (done: number, total: number) => `${done} of ${total} steps done`,
  stepDone: "Done",
  stepCurrent: "You are here",
  stepOpen: "You have been here",
  stepLocked: "Not yet",

  journeyLabel: "Your return",
  railCase: "Your details",
  railDocs: "Documents",
  railActions: "Also available",
  railProgress: "Your answers so far",
  railNoAnswers: "Nothing answered yet.",

  deadlineLabel: "Time left to file on time",
  deadlinePassedLabel: "The due date has passed",
  deadlineClosedLabel: "Filing has closed for this year",
  daysLeftOnTime: "days left to file on time",
  dayLeftOnTime: "day left to file on time",
  daysLeftBelated: "days left to file a belated return",
  dayLeftBelated: "day left to file a belated return",
  deadlinePassed: (due: string) =>
    `The due date of ${due} has gone. You can still file, and you still should.`,
  deadlineCostLabel: "What filing late costs",
  deadlineDue: (due: string) => `Due by ${due}`,
  deadlineBelatedBy: (belated: string) => `Belated return accepted until ${belated}`,
  deadlineFee: (fee: string) =>
    `A late fee of ${fee} under section 234F now applies, and interest under section 234A runs on any unpaid tax. Filing late costs less than not filing.`,
  deadlineClosed: (belated: string) =>
    `The belated window closed on ${belated}. An updated return under section 139(8A) may still be possible. Check the official portal.`,

  extensionAction: "Report a wrong entry",
  extensionTitle: "Report a wrong entry (demo)",
  extensionIntro:
    "The portal calls this AIS feedback. When a statement shows income that is not yours, you tell the department rather than putting it into your return.",
  extensionNote:
    "This demo creates a reference only. No feedback reaches the Income Tax Department, and no record is corrected.",
  extensionCreate: "Create synthetic feedback reference",
  extensionCreated: "Synthetic feedback reference created",
  extensionReferenceLabel: "Demo feedback reference",
  extensionNext:
    "Keep filing. In the real service the department reviews the feedback separately, and you do not wait for it to file.",


  /* ---- homepage ---- */
  homeStartTitle: "Start here",
  homeAnnouncementsTitle: "Notices",
  homeAffectsYou: "Affects you",
  homeGeneral: "For information",
  noticesTitle: "Notices",
  noticesIntro:
    "Every notice the department has published, newest first. The portal shows the most recent few and drops the rest; a notice is often the only record of when a date moved, so they are all kept here.",
  noticesSeeAll: "See all notices",
  noticesBack: "Back to the home page",
  noticesFilterAll: "All",
  noticesFilterAffects: "Affects you",
  noticesFilterInformation: "For information",
  noticesCount: (shown: number, total: number) =>
    shown === total ? `${total} notices` : `${shown} of ${total} notices`,
  noticesEmpty: "No notices of this kind.",
  noticesDemoNote:
    "A synthetic archive for this prototype. The wording follows the kinds of notice the department publishes; none of it is a real notice.",
  homeLinksTitle: "Everything else you might need",
  homeLinksIntro:
    "The official portal puts eighteen of these in one flat grid. These are the same kinds of task, grouped by when you actually need them.",
  homeInDemo: "Works in this demo",
  homeOfficial: "Opens the official portal",
  homeGroups: {
    before: "Getting ready",
    after: "After you have filed",
    problem: "If something looks wrong",
    pay: "Paying tax",
  },
  homeLinkNames: {
    "which-form": "Find out which form applies to you",
    calculator: "Compare the two tax regimes",
    documents: "See which documents you need",
    "link-aadhaar": "Link Aadhaar with PAN, or check the status",
    "instant-pan": "Get an instant e-PAN",
    "defect-check": "Check a return for defects before filing",
    "e-verify": "e-Verify a filed return",
    "refund-status": "Know your refund status",
    "view-filed": "View your filed returns",
    "wrong-entry": "Report income that is not yours",
    notice: "Respond to a defective-return notice",
    authenticate: "Check whether a notice is genuine",
    grievance: "Raise a grievance",
    "pay-tax": "Pay tax online",
    "payment-status": "Know your tax payment status",
  },
  homeHelpTitle: "Which helpline do you need",
  homeHelpIntro:
    "Three lines, three sets of hours. The official page prints the hours; this one also tells you whether the line is open right now, in Indian time.",
  homeHelpNames: {
    efiling: "Filing, the portal, and your account",
    ais: "Your Annual Information Statement",
    tin: "PAN, TAN and payment queries",
  },
  homeOpenNow: "Open now",
  homeClosedNow: "Closed now",
  homeHours: (from: string, to: string) => `${from} to ${to}, Indian time`,
  homeDaysAll: "Every day",
  homeDaysWeek: "Monday to Friday",
  homeHelpNote:
    "Hours as published by the Income Tax Department. This prototype does not operate a support line, and does not call one.",

  downloadNotice: "Download the demo return summary (TXT)",
  viewNotice: "See what applies to you",

  /* ---- portal navigation ---- */
  navLabel: "Portal sections",
  navMenu: "Sections",
  navMenuClose: "Close sections",
  navSections: {
    home: "Home",
    individual: "Individual/HUF",
    company: "Company",
    "non-company": "Non-Company",
    professionals: "Tax Professionals & Others",
    downloads: "Downloads",
    help: "Help",
  },
  navPlanned: "Not built in this prototype",
  navPlannedTip:
    "Named so you can see where it sits. This prototype builds one journey only.",
  navLive: "Built here",
  navScopeNote:
    "One journey is built end to end: a salaried individual filing ITR-1. The rest of the map is shown, and marked, so nothing here pretends to work.",
  homeServicesTitle: "What do you want to do",

  serviceNames: {
    "file-return": "File your income tax return",
    "view-returns": "View your filed returns",
    "e-verify": "e-Verify a return",
    "refund-status": "Know your refund status",
    "link-aadhaar": "Link Aadhaar with PAN",
    "pay-tax": "Pay tax online",
    "respond-notice": "Respond to a notice",
    grievance: "Raise a grievance",
    "company-return": "File a company return",
    "tds-return": "File TDS and TCS statements",
    "ca-forms": "Chartered Accountant forms",
    "eri-services": "e-return Intermediary services",
    "form-utilities": "Offline filing utilities",
    "dsc-utility": "Digital signature utility",
    faq: "Questions and answers",
    helpdesk: "Contact the helpdesk",
  },
  serviceNotes: {
    "file-return": "Salaried ITR-1, worked out for you and checked before you file.",
    "view-returns": "Every return filed under your PAN, with its status.",
    "e-verify": "Confirm a filed return within 30 days, or it does not count.",
    "refund-status": "Where your refund is, and why it has not arrived.",
    "link-aadhaar": "Required before you can file at all.",
    "pay-tax": "Self-assessment tax, advance tax and demand payments.",
    "respond-notice": "Answer a defective-return or scrutiny notice.",
    grievance: "Raise and track a complaint against the department.",
    "company-return": "ITR-6 and the audit forms that go with it.",
    "tds-return": "For anyone who deducts tax before paying someone.",
    "ca-forms": "Audit reports and certificates filed by a CA.",
    "eri-services": "Filing on behalf of clients as a licensed intermediary.",
    "form-utilities": "Fill a return offline and upload the JSON.",
    "dsc-utility": "Sign a return with a digital signature certificate.",
    faq: "The department's own answers, by topic.",
    helpdesk: "Phone, email and the grievance route.",
  },

  /* ---- account and sign-in ---- */
  accountLabel: "Your account",
  signIn: "Login",
  signOut: "Logout",
  register: "Register",
  noAccount: "Do not have an account?",
  signedInAs: "Signed in as",
  dashboard: "Dashboard",
  demoAccountNote: "Synthetic account. No real PAN, no real record.",

  gateTitle: "Sign in to file your return",
  gateIntro:
    "The e-Filing portal will not let you start a return until you are signed in, and neither does this. Nothing you enter here is real or leaves this device.",
  gateSignIn: "Login and continue",
  gateRegister: "I do not have an account yet",

  loginTitle: "Login",
  loginIntro: "Enter the ID you registered with.",
  loginIdLabel: "Enter your User ID",
  loginIdPlaceholder: "PAN / Aadhaar / other user ID",
  loginWhichTitle: "Which one am I?",
  loginWhichIntro:
    "The official field accepts three different things and leaves you to work out which one you hold. You do not have to. Type what you have, and this field will tell you what it recognised.",
  loginWhichPan:
    "PAN — ten characters, five letters then four digits then a letter, printed on your PAN card. This is what most individual filers use.",
  loginWhichAadhaar:
    "Aadhaar — twelve digits. Works only if your Aadhaar is already linked to your PAN.",
  loginWhichOther:
    "Something else — a CA membership number starting ARCA, a TAN if you deduct tax, or an ERI code. If nobody has given you one of these, it is not you.",
  loginReadPan: "Recognised as a PAN.",
  loginReadAadhaar: "Recognised as an Aadhaar number.",
  loginReadOther: "Recognised as another kind of user ID.",
  loginReadUnknown:
    "Not recognised yet. A PAN is ten characters; an Aadhaar is twelve digits.",
  loginErrorEmpty: "Enter your User ID to continue.",
  loginErrorUnknown:
    "No synthetic account matches that ID. This demo knows one taxpayer. Use the shortcut below, or register.",
  loginOtpTitle: "Confirm it is you",
  loginOtpIntro: (target: string) =>
    `A six-digit code would go to the mobile ending ${target}. This demo prints it instead, because no message is sent.`,
  loginOtpLabel: "Enter the six-digit code",
  loginOtpDemoLabel: "Demo code",
  loginOtpErrorEmpty: "Enter the six-digit code.",
  loginOtpErrorWrong: "That code does not match. The demo code is shown above.",
  loginVerify: "Verify and sign in",
  loginResend: "Send the code again",
  loginResent: "A new synthetic code was issued. It is the same code.",
  loginShortcut: "Sign in as the demo taxpayer",
  loginShortcutNote: "Synthetic taxpayer. No typing needed.",
  loginOtherWays: "Other ways to access your account",
  loginNetBanking: "Net Banking",
  loginSuccess: (name: string) => `Signed in as ${name}.`,
  signOutDone: "Signed out. Your synthetic draft is still on this device.",

  /* ---- registration ---- */
  registerTitle: "Register",
  registerIntro: "Four steps. Nothing is sent, and no account is created.",
  registerStages: [
    "Get started",
    "Fill details",
    "Verify details",
    "Secure your account",
  ],
  registerStageOf: (current: number, total: number) =>
    `Stage ${current} of ${total}`,
  registerWhoTitle: "What describes you best?",
  registerWhoIntro:
    "The official form asks you to pick between “Taxpayer” and “Others”, and then hands you a list of departmental job titles. That only works if you already know the answer. Answer in your own terms instead, and the official category is filled in for you.",
  registerOfficialLabel: "The portal calls this",
  registerNeedsLabel: "You will need",
  registerNotSure: "Still not sure which one you are?",
  registerNotSureAction: "Ask the assistant",
  registerUnsupported:
    "This prototype does not build that journey. The category is correct, and on the official portal it is where you would go next.",
  registerRouteError: "Choose the line that describes you.",
  routeNames: {
    self: "I am filing my own tax, for myself",
    family: "I am filing for my family as a joint Hindu family estate",
    "chartered-accountant": "I am a Chartered Accountant and I audit or certify for clients",
    intermediary: "I file returns for other people as a licensed business",
    deductor: "I take tax out of what I pay people, and hand it to the department",
    "non-resident": "I live outside India and I do not hold a PAN",
    agency: "I represent a bank, government body or agency that exchanges data with the department",
  },
  routeNeeds: {
    self: "Your PAN, your Aadhaar-linked mobile, and an email address",
    family: "The HUF's own PAN and the karta's details",
    "chartered-accountant": "Your six-digit ICAI membership number",
    intermediary: "The ERI code issued to your organisation",
    deductor: "Your TAN, not your PAN",
    "non-resident": "Your passport and your country of residence",
    agency: "The authorisation letter issued to your organisation",
  },
  registerPan: "PAN",
  registerPanHint: "Ten characters, as printed on the card. Case does not matter.",
  registerPanError: "A PAN is five letters, four digits, then one letter.",
  registerName: "Full name, as printed on your PAN card",
  registerNameError: "Enter the name as it is printed on the card.",
  registerDob: "Date of birth",
  registerDobHint: "This must match the department's record for the PAN.",
  registerDobError: "Enter your date of birth.",
  registerMobile: "Mobile number",
  registerMobileHint: "Ten digits. The code would go here.",
  registerMobileError: "Enter a ten-digit mobile number.",
  registerEmail: "Email address",
  registerEmailError: "Enter an email address.",
  registerVerifyTitle: "Verify your details",
  registerVerifyIntro:
    "The portal sends one code to your mobile and one to your email. This demo prints a single code, because it sends nothing.",
  registerSecureTitle: "Secure your account",
  registerSecureIntro:
    "Set a password. It is kept in this browser only, and it is not checked against anything.",
  registerPassword: "Password",
  registerPasswordRules:
    "At least eight characters, with one digit. Stated here, before you type, rather than after a rejected attempt.",
  registerPasswordError: "Use at least eight characters, including one digit.",
  registerFinish: "Create the synthetic account",
  registerDoneTitle: "Synthetic account created",
  registerDoneIntro:
    "Nothing was registered with the Income Tax Department. You are now signed in to the demo and can file the synthetic return.",
  registerDoneAction: "Go to your dashboard",
  registerHaveAccount: "Already have an account?",

  /* ---- dashboard ---- */
  dashIntro: "Everything under your PAN, and what is still owed from you.",
  dashPendingTitle: "Needs you",
  dashNothingPending: "Nothing is waiting on you.",
  dashReturnTitle: (year: string) => `Income tax return, AY ${year}`,
  dashReturnNotStarted: "Not started",
  dashReturnInProgress: (done: number, total: number) =>
    `${done} of ${total} steps done`,
  dashReturnFiled: "Filed and acknowledged",
  dashStart: "Start the return",
  dashResume: "Continue the return",
  dashViewReceipt: "See the acknowledgement",
  dashHistoryTitle: "Earlier years",
  dashHistoryNote:
    "A real dashboard lists every year filed under the PAN. This prototype holds one synthetic year.",
  dashServicesTitle: "Other services",

  /* ---- assistant ---- */
  assistantName: "Sahayak",
  assistantOpen: "Ask Sahayak",
  assistantClose: "Close the assistant",
  assistantTitle: "Sahayak, the filing assistant",
  assistantIntroOut:
    "Ask anything about filing, the forms, or which category you belong to. Sign in and it can also see where you have reached in your own return.",
  assistantIntroIn:
    "It can see which step you are on and what you have answered, so you do not have to explain your own return back to it.",
  assistantPlaceholder: "Ask a question",
  assistantSend: "Send",
  assistantThinking: "Thinking",
  assistantStop: "Stop",
  assistantClear: "Clear this conversation",
  assistantYou: "You",
  assistantErrorTitle: "The assistant could not answer",
  assistantErrorNetwork:
    "The request did not reach the assistant. Check the connection and try again. Every step of this prototype works without it.",
  assistantErrorKey:
    "The assistant is not configured on this deployment. Everything else still works.",
  assistantErrorRate:
    "Too many questions too quickly. Wait a moment and ask again.",
  assistantOffline:
    "You are offline. The assistant needs a connection; the return does not.",
  assistantDisclosure:
    "Answers are generated by a language model and can be wrong. Nothing here is tax advice, and the assistant cannot change your return.",
  assistantContextTitle: "What Sahayak can see",
  assistantContextNone: "Nothing about you. You are not signed in.",
  assistantCheckStep: "Check this step for me",
  assistantCheckRunning: "Checking this step",
  assistantAttach: "Add your Form 16",
  assistantAttached: (name: string) => `Added ${name}`,
  assistantAttachNote:
    "The file stays on your device. This prototype reads the synthetic Form 16 fixture, not your document, and says so in its answer.",
  assistantSuggestionsOut: [
    "Which ITR form applies to a salaried person?",
    "I was told to register as an ERI. Is that me?",
    "What is the last date to file for AY 2026-27?",
  ],
  assistantSuggestionsIn: [
    "Have I missed anything on this step?",
    "Why did you choose ITR-1 for me?",
    "Which regime leaves me better off, and why?",
  ],
  assistantStepLabel: "Looking at",
};

type CommonCopy = typeof en;

const hi: CommonCopy = {
  brand: "सही रिटर्न",
  strapline: "अपना वेतन रिटर्न खुद भरें",
  prototype: "स्वतंत्र हैकाथॉन प्रोटोटाइप",
  synthetic: "केवल काल्पनिक डेटा",
  notOfficial: "यह आयकर विभाग की सेवा नहीं है",
  trustToggle: "असली सेवा कैसे पहचानें",
  trustHide: "छिपाएँ",
  trustNotGovTitle: "यह सरकारी सेवा नहीं है",
  trustNotGov:
    "सही रिटर्न एक हैकाथॉन के लिए बना स्वतंत्र प्रोटोटाइप है। इसका आयकर विभाग से कोई संबंध नहीं है, यह कोई सरकारी रिकॉर्ड नहीं बनाता और इसे कोई सरकारी मान्यता नहीं मिली है।",
  trustRealTitle: "असली सेवा कहाँ है",
  trustReal:
    "आयकर ई-फाइलिंग पोर्टल incometax.gov.in पर है। कहीं भी साइन इन करने से पहले पता-पट्टी और ताले का निशान जाँचें, और लिंक पर क्लिक करने के बजाय पता खुद टाइप करें।",
  trustNeverTitle: "विभाग ये कभी नहीं माँगता",
  trustNever:
    "आपका पिन, पासवर्ड, ओटीपी या बैंक खाते की जानकारी। न ईमेल से, न एसएमएस से, न फ़ोन पर। संदिग्ध संदेश CERT-In को incident@cert-in.org.in पर भेजें।",
  trustSource: "स्रोत: आयकर विभाग की एंटी-फ़िशिंग सूचना, 5 फ़रवरी 2016",
  skip: "मुख्य सामग्री पर जाएँ",

  commandTrigger: "खोजें या कोई काम चुनें",
  searchPlaceholder: "खोजें",
  commandPlaceholder: "कोई चरण, काम या सवाल लिखें",
  commandHint: "यहाँ का हर काम इस पैनल के बिना भी किया जा सकता है।",
  commandNoResults:
    "कुछ नहीं मिला। “वेतन”, “व्यवस्था”, “English” या “मदद” आज़माएँ।",
  commandNavigate: "चुनें",
  commandRun: "खोलें",
  commandClose: "बंद करें",
  commandGroupStep: "इस चरण पर",
  commandGroupGo: "किसी चरण पर जाएँ",
  commandGroupPages: "पृष्ठ",
  commandGroupSettings: "सेटिंग्स",
  commandGroupHelp: "मदद और आधिकारिक स्रोत",
  commandHere: "आप यहाँ हैं",
  commandFilter: "दिखाएँ",
  commandAll: "सब कुछ",

  settings: "सेटिंग्स",
  settingsLanguage: "भाषा",
  settingsAppearance: "रूप",
  settingsLight: "उजला",
  settingsDark: "गहरा",
  settingsPaper: "काग़ज़",
  settingsSystem: "डिवाइस जैसा",
  settingsTextSize: "अक्षर का आकार",
  settingsTextNormal: "सामान्य आकार",
  settingsTextLarge: "बड़ा आकार",
  settingsTextLargest: "सबसे बड़ा आकार",
  settingsData: "मोबाइल डेटा बचाएँ",
  settingsDataHint:
    "एनिमेशन, छाया और धुंधलापन बंद कर देता है ताकि धीमे नेटवर्क पर पेज हल्का रहे। हर चरण वैसे ही काम करता है।",

  english: "English",
  hindi: "हिन्दी",

  saved: "इस डिवाइस पर सहेजा गया",
  offline: "ऑफ़लाइन। आपके जवाब इस डिवाइस पर सुरक्षित हैं।",
  online: "फिर से ऑनलाइन",
  resume: "आपका सहेजा हुआ डेमो ड्राफ़्ट मौजूद है।",
  continueDraft: "जहाँ रुके थे वहीं से जारी रखें",
  startAgain: "फिर से शुरू करें",

  clearData: "इस डिवाइस का डेटा हटाएँ",
  clearConfirm: "क्या यह काल्पनिक ड्राफ़्ट हटाना है?",
  clearExplanation:
    "इससे इस ब्राउज़र में रखे डेमो जवाब और संदर्भ हट जाएँगे। और कहीं कुछ नहीं रखा गया है।",
  cancel: "रहने दें",
  confirmClear: "काल्पनिक ड्राफ़्ट हटाएँ",

  back: "पीछे",
  continue: "आगे बढ़ें",
  close: "बंद करें",

  help: "इस चरण में मदद",
  helpTitle: "इस चरण में मदद",
  support: "डेमो सहायता अनुरोध बनाएँ",
  supportTitle: "डेमो सहायता अनुरोध",
  supportIntro:
    "इससे कुछ भेजा नहीं जाता। यह दिखाता है कि एक असली सहायता सेवा को क्या जानकारी मिलती, यह भी कि आप किस चरण पर थे।",
  supportStage: "इस अनुरोध के साथ दर्ज चरण",
  supportIssue: "आपको किस बात में मदद चाहिए?",
  supportOptions: [
    "सही फ़ॉर्म चुनना",
    "अपना फ़ॉर्म 16 पढ़ना",
    "कोई ऐसी प्रविष्टि जो मेरी नहीं लगती",
    "कर व्यवस्था चुनना",
    "फाइलिंग और सत्यापन",
    "सुलभता की समस्या बताना",
  ],
  supportDetails: "समस्या बताएँ",
  supportExample: "जैसे यह बताएँ कि कौन-सा संदेश या चरण साफ़ नहीं है।",
  createSupport: "काल्पनिक सहायता संदर्भ बनाएँ",
  supportCreated: "काल्पनिक सहायता अनुरोध बन गया",
  supportResponse:
    "कोई अनुरोध नहीं भेजा गया। असली सेवा यहाँ ज़िम्मेदार टीम और जवाब का समय दिखाती।",
  supportOwner: "असली सेवा में ज़िम्मेदारी",
  supportOwnerValue: "ई-फाइलिंग हेल्पडेस्क, पहला जवाब 2 कार्यदिवस में",

  source: "स्रोत",
  reviewed: "27 अगस्त 2026 को जाँचा गया",
  reviewedLabel: "जाँचा गया",
  reviewedDate: "27 अगस्त 2026",
  nextReviewLabel: "अगली जाँच",
  nextReviewDate: "27 नवंबर 2026",
  officialSource: "आयकर विभाग की ITR-1 फाइलिंग गाइड",
  officialManual: "आधिकारिक वार्षिक सूचना विवरण (AIS) गाइड",
  officialPortalLink: "आधिकारिक आयकर ई-फाइलिंग पोर्टल",
  newWindow: ", नई विंडो में खुलेगा",
  officialWarning:
    "यह प्रोटोटाइप असली कर की गणना या फाइलिंग नहीं करता। असली रिटर्न आधिकारिक आयकर ई-फाइलिंग पोर्टल पर ही भरें।",

  helpline: "आधिकारिक हेल्पडेस्क",
  helplineNote:
    "ये नंबर आयकर विभाग ने प्रकाशित किए हैं। यह प्रोटोटाइप कोई सहायता लाइन नहीं चलाता।",

  tpDeductionsTitle: "कटौतियाँ जो आप ले सकते हैं",
  tpDeductionsIntro:
    "पोर्टल यह खंड हर कर व्यवस्था में दिखाता है, लगभग हर पंक्ति शून्य के साथ, और कारण नहीं बताता। किसी पंक्ति के शून्य होने की दो अलग वजहें होती हैं, और उनके मतलब उल्टे हैं।",
  tpRegimeNew: "नई कर व्यवस्था के अनुसार",
  tpRegimeOld: "पुरानी कर व्यवस्था के अनुसार",
  tpRegimeUnchosen: "आपने अभी कर व्यवस्था नहीं चुनी है",
  tpHeadSection: "धारा",
  tpHeadWhat: "यह क्या है",
  tpHeadStatus: "स्थिति",
  tpHeadAmount: "राशि",
  tpStatusClaimed: "ली गई",
  tpStatusNone: "आपके पास कोई नहीं",
  tpStatusNotInRegime: "इस व्यवस्था में नहीं",
  tpStatusAwaitingRegime: "आपकी कर व्यवस्था पर निर्भर",
  tpAmountAwaitingRegime: "अभी तय नहीं",
  tpDeductionsTotal: "कुल कटौती",
  tpWhyLabel: "क्यों",
  tpSchedulesTitle: "आपकी ओर से पहले ही चुकाया गया कर",
  tpSchedulesIntro:
    "पाँच अनुसूचियाँ, हर उस तरीक़े के लिए एक जिससे आपके नाम पर कर पहले ही विभाग तक पहुँच सकता है। वेतनभोगी के लिए इनमें से ज़्यादातर खाली रहती हैं, और खाली अनुसूची भी बताती है कि उसमें पंक्ति कब आती है।",
  tpSchedulesSummary: (total: number, empty: number) =>
    `${total} अनुसूचियाँ, इनमें से ${empty} खाली`,
  tpEntriesCount: (count: number) =>
    count === 1 ? "1 प्रविष्टि" : `${count} प्रविष्टियाँ`,
  tpEntriesNone: "यहाँ कुछ नहीं",
  tpTaxPaidTotal: "कुल चुकाया गया कर",
  tpOfficialSummary: "पोर्टल के अपने शब्द",
  tpSourceLabel: "स्रोत",

  persFilingTitle: "आप किस धारा के तहत फाइल कर रहे हैं",
  persFilingIntro:
    "पोर्टल इसे एक टॉगल और नौ रेडियो बटन के साथ खोलता है, और मान लेता है कि आपको पता है कौन-सा आपका है। सिर्फ़ एक आपका है, और वह आज की तारीख़ से तय होता है।",
  persAppliesLabel: "आप पर लागू धारा",
  persFilingReason: {
    onTime:
      "नियत तारीख़ अभी नहीं गुज़री, इसलिए यह समय पर भरा गया सामान्य रिटर्न है। इस पर न विलंब शुल्क लगता है, न देरी का ब्याज।",
    belated:
      "नियत तारीख़ गुज़र चुकी है और विलंबित अवधि खुली है, इसलिए आज भरा गया रिटर्न इसी धारा में आता है।",
    belatedClosed:
      "विलंबित अवधि बंद हो चुकी है। अब धारा 139(8A) के तहत अद्यतन रिटर्न ही बचा रास्ता है।",
  },
  persOfficialLabel: "पोर्टल के शब्द",
  persWhenLabel: "यह कब लागू होती है",
  persOtherOptionsLabel: (count: number) => `उसी सूची के बाकी ${count}`,
  persOtherOptionsNote:
    "ये इसलिए यहाँ हैं ताकि आप देख सकें कि पोर्टल क्या-क्या दे रहा था। इनमें से कोई भी आज आप पर लागू नहीं होती।",
  persNoticeStateLabel: "आप पर लागू नहीं",
  persNoticeNote:
    "ये चार तभी लागू होती हैं जब विभाग ने आपको लिखा हो। ऐसा कुछ नहीं हुआ है।",
  persNoticeOptionsSummary: (count: number) => `चारों पढ़ें (${count})`,
  persRepresentativeTitle: "फाइल कौन कर रहा है",
  persPortalAsksLabel: "पोर्टल पूछता है",
  persAnswerLabel: "आपका जवाब",
  persRefundLegend: "आपका रिफ़ंड कहाँ आएगा",
  persAccountNumberLabel: "खाता संख्या",
  persIfscLabel: "IFSC",
  persAccountTypeLabel: "प्रकार",
  persRulesLabel: "इस खंड के लिए पोर्टल के नियम",
  persAddAnotherNote:
    "असली पोर्टल पर यहाँ खाता जोड़ा जा सकता है। यह प्रोटोटाइप तय सिंथेटिक खाते इस्तेमाल करता है।",
  persProfileTitle: "विभाग के रिकॉर्ड में आप कौन हैं",
  persProfileIntro:
    "इसमें से कुछ भी आपने नहीं भरा। पोर्टल आपके आने से पहले ही इसे आपके पैन रिकॉर्ड से भर देता है, और रिटर्न यही लेकर जाता है — चाहे आपने पढ़ा हो या नहीं। इसलिए इसे पढ़िए, और जो पुराना पड़ गया हो उसे सुधार दीजिए।",
  persContactTitle: "विभाग आपको कहाँ लिखेगा",
  persContactIntro:
    "इस रिटर्न की पावती, रिफ़ंड का संदेश और कोई भी नोटिस इसी खंड के नंबर और पते पर जाता है। यहाँ पुराना ईमेल पता रह जाना ही वह वजह है जिससे नोटिस महीनों तक बिना जवाब पड़ा रहता है।",
  persPortalCallsLabel: "पोर्टल इस खंड को कहता है",
  persSeparateFlowNote:
    "आधिकारिक पोर्टल पर यह खंड अपने अलग पन्ने पर होता है: इसका Edit दबाते ही आपका आधा भरा रिटर्न पीछे छूट जाता है और बाद में लौटना पड़ता है। यहाँ इसे इसी जगह रखा गया है, क्योंकि इसमें कुछ भी ऐसा नहीं जिसके लिए रिटर्न में आपकी जगह छूटे।",
  persMandatoryNote:
    "पोर्टल अपने ज़रूरी खानों पर तारांकन लगाता है। यहाँ भी वही लगा है।",
  persEditLabel: "ये विवरण बदलें",
  persSaveLabel: "ये विवरण सहेजें",
  persCancelLabel: "रद्द करें",
  persUndoLabel: "विभाग वाला विवरण वापस लाएँ",
  persChangedBadge: "आपने बदला",
  persLockedBadge: "यहाँ नहीं बदला जा सकता",
  persEmptyValue: "दर्ज नहीं",

  eligOutOfScope: (form: string) =>
    `आपके जवाब ${form} की ओर इशारा करते हैं। यह प्रोटोटाइप केवल ITR-1 का रास्ता बनाता है, इसलिए बाकी डेमो अब भी ITR-1 की यात्रा दिखाता है। उसी पर चलने के लिए जवाब वापस बदल दें।`,
  eligTitle: "उस फ़ॉर्म के पीछे के अठारह सवाल",
  eligIntro:
    "आधिकारिक पोर्टल रिटर्न शुरू करने से पहले “Help me select ITR” नाम का एक विज़र्ड चलाता है: छह खंड, अठारह सवाल, विभाग की अपनी भाषा में। इनमें से लगभग हर जवाब उन रिकॉर्ड से निकलता है जो विभाग के पास पहले से हैं, इसलिए यहाँ वे पहले से भरे हैं। किसी एक को बदलिए, फ़ॉर्म फिर से तय हो जाएगा।",
  eligSummary: (questions: number, sections: number) =>
    `${sections} खंडों में ${questions} सवाल, पहले से भरे हुए`,
  eligOutcomeLabel: "आप पर लागू फ़ॉर्म",
  eligOutcomeSettled: "आपके किसी जवाब से यह फ़ॉर्म नहीं बदलता।",
  eligOutcomeBlocked: (form: string) =>
    `आपके जवाबों से ITR-1 लागू नहीं होता। इन जवाबों पर आपको ${form} भरना होगा।`,
  eligCausesLabel: (count: number) =>
    count === 1 ? "यह जवाब इसकी वजह है" : `ये ${count} जवाब इसकी वजह हैं`,
  eligSectionCount: (count: number) =>
    count === 1 ? "1 सवाल" : `${count} सवाल`,
  eligStateSettled: "कुछ करना बाकी नहीं",
  eligStateChanged: "आपने एक जवाब बदला है",
  eligStateBlocking: "इसने आपका फ़ॉर्म तय किया",
  eligWhyLabel: "यह हमें कैसे पता है",
  eligChangedLabel: "आपने इसे बदला",
  eligChangedFrom: (recordAnswer: string) => `हमारे रिकॉर्ड कहते हैं: ${recordAnswer}`,
  eligDecidedLabel: "इसने आपका फ़ॉर्म तय किया",
  eligOfficialSummary: "पोर्टल के अपने शब्द",
  eligDisclaimer:
    "यह इस स्क्रीन के जवाबों से तय करता है कि कौन-सा फ़ॉर्म लागू है। यह आपकी मदद के लिए है, कानूनी सलाह नहीं।",
  eligPrototypeNote:
    "सिंथेटिक रिकॉर्ड पर बना एक स्वतंत्र प्रोटोटाइप। यहाँ कुछ भी कर-सलाह नहीं है, और आयकर विभाग को कुछ नहीं भेजा जाता।",
  eligClosingLabel: "इससे आप कहाँ पहुँचे",
  eligClosingSettled: (form: string) =>
    `आप पर अब भी ${form} ही लागू है, और यही वह फ़ॉर्म है जिसे यह यात्रा आगे भरती है। कहीं और जाने की ज़रूरत नहीं — यहीं से आगे बढ़िए।`,
  eligClosingBlocked: (form: string) =>
    `अभी के जवाबों पर ITR-1 नहीं, ${form} लागू होता है। यह प्रोटोटाइप सिर्फ़ ITR-1 का रास्ता बनाता है, इसलिए यहाँ यह रुक जाता है और आगे का काम विभाग के अपने पोर्टल पर होता है।`,
  eligClosingUnchanged:
    "ऊपर का हर जवाब अब भी वही है जो विभाग के अपने रिकॉर्ड से निकला है।",
  eligClosingChanged: (count: number) =>
    count === 1
      ? "एक जवाब अब विभाग के रिकॉर्ड से अलग है:"
      : `${count} जवाब अब विभाग के रिकॉर्ड से अलग हैं:`,
  eligClosingNowLabel: "आपका जवाब",
  eligClosingLink: (form: string) => `${form} भरने की आधिकारिक जानकारी`,

  docsTitle: "आपके दस्तावेज़",
  docsDetailSummary: "यह क्या है, और कैसे मिलेगा",
  docsFrom: "यह कहाँ से आता है",
  docsWhere: "इसे कैसे लें",
  docsUsedFor: "यहाँ किस काम आता है",
  docsNeeded: "यहाँ ज़रूरी",
  docsExplained: "सिर्फ़ समझाया गया",
  docsCrossChecksTitle: "ये एक-दूसरे को कैसे जाँचते हैं",
  docsShouldMatch: "मिलना चाहिए",
  docsIfNot: "अगर नहीं मिलता",

  steps: [
    "शुरुआत",
    "आप पर क्या लागू है",
    "आपका वेतन",
    "आपकी अन्य आय",
    "आपकी कर व्यवस्था",
    "फाइल करने से पहले",
    "जाँचें और फाइल करें",
    "पावती",
  ],
  stepOf: (current: number, total: number) => `चरण ${current} / ${total}`,
  stepsDone: (done: number, total: number) => `${total} में से ${done} चरण पूरे`,
  stepDone: "पूरा",
  stepCurrent: "आप यहाँ हैं",
  stepOpen: "आप यहाँ आ चुकी हैं",
  stepLocked: "अभी नहीं",

  journeyLabel: "आपका रिटर्न",
  railCase: "आपका विवरण",
  railDocs: "दस्तावेज़",
  railActions: "यह भी उपलब्ध है",
  railProgress: "अब तक के जवाब",
  railNoAnswers: "अभी कुछ नहीं भरा गया।",

  deadlineLabel: "समय पर भरने के लिए बचा समय",
  deadlinePassedLabel: "नियत तारीख़ निकल चुकी है",
  deadlineClosedLabel: "इस साल की फाइलिंग बंद हो चुकी है",
  daysLeftOnTime: "दिन बाकी, समय पर भरने के लिए",
  dayLeftOnTime: "दिन बाकी, समय पर भरने के लिए",
  daysLeftBelated: "दिन बाकी, विलंबित रिटर्न भरने के लिए",
  dayLeftBelated: "दिन बाकी, विलंबित रिटर्न भरने के लिए",
  deadlinePassed: (due: string) =>
    `${due} की नियत तारीख़ निकल चुकी है। आप अब भी भर सकती हैं, और भरना चाहिए।`,
  deadlineCostLabel: "देर से भरने पर क्या लगता है",
  deadlineDue: (due: string) => `${due} तक भरना है`,
  deadlineBelatedBy: (belated: string) =>
    `विलंबित रिटर्न ${belated} तक स्वीकार`,
  deadlineFee: (fee: string) =>
    `अब धारा 234F के तहत ${fee} विलंब शुल्क लगता है, और बकाया कर पर धारा 234A का ब्याज चलता है। देर से भरना, न भरने से सस्ता है।`,
  deadlineClosed: (belated: string) =>
    `विलंबित अवधि ${belated} को बंद हो गई। धारा 139(8A) के तहत अद्यतन रिटर्न अब भी संभव हो सकता है। आधिकारिक पोर्टल पर जाँचें।`,

  extensionAction: "गलत प्रविष्टि बताएँ",
  extensionTitle: "गलत प्रविष्टि बताएँ (डेमो)",
  extensionIntro:
    "पोर्टल पर इसे AIS फ़ीडबैक कहते हैं। जब विवरण में ऐसी आय दिखे जो आपकी नहीं है, तो उसे रिटर्न में डालने के बजाय विभाग को बताया जाता है।",
  extensionNote:
    "यह डेमो सिर्फ़ एक संदर्भ बनाता है। कोई फ़ीडबैक आयकर विभाग तक नहीं जाता और कोई रिकॉर्ड नहीं सुधरता।",
  extensionCreate: "काल्पनिक फ़ीडबैक संदर्भ बनाएँ",
  extensionCreated: "काल्पनिक फ़ीडबैक संदर्भ बन गया",
  extensionReferenceLabel: "डेमो फ़ीडबैक संदर्भ",
  extensionNext:
    "फाइलिंग जारी रखें। असली सेवा में विभाग फ़ीडबैक अलग से देखता है, और उसके लिए रुकना नहीं पड़ता।",


  /* ---- homepage ---- */
  homeStartTitle: "यहाँ से शुरू करें",
  homeAnnouncementsTitle: "सूचनाएँ",
  homeAffectsYou: "आप पर लागू",
  homeGeneral: "जानकारी के लिए",
  noticesTitle: "सूचनाएँ",
  noticesIntro:
    "विभाग की सभी प्रकाशित सूचनाएँ, नई से पुरानी। पोर्टल केवल हाल की कुछ दिखाता है और बाकी हटा देता है; तारीख़ कब बदली, इसका अकेला रिकॉर्ड अक्सर सूचना ही होती है, इसलिए यहाँ सब रखी गई हैं।",
  noticesSeeAll: "सारी सूचनाएँ देखें",
  noticesBack: "मुख पृष्ठ पर लौटें",
  noticesFilterAll: "सभी",
  noticesFilterAffects: "आप पर लागू",
  noticesFilterInformation: "जानकारी के लिए",
  noticesCount: (shown: number, total: number) =>
    shown === total ? `${total} सूचनाएँ` : `${total} में से ${shown} सूचनाएँ`,
  noticesEmpty: "इस तरह की कोई सूचना नहीं।",
  noticesDemoNote:
    "इस प्रोटोटाइप के लिए बनाई गई सूचनाएँ। शब्दावली वैसी ही है जैसी विभाग प्रकाशित करता है, पर इनमें कोई असली सूचना नहीं है।",
  homeLinksTitle: "बाकी जो कुछ आपको चाहिए हो",
  homeLinksIntro:
    "आधिकारिक पोर्टल इनमें से अठारह को एक ही सपाट ग्रिड में रख देता है। ये उसी तरह के काम हैं, पर इस हिसाब से बाँटे गए हैं कि आपको इनकी ज़रूरत कब पड़ती है।",
  homeInDemo: "इस डेमो में काम करता है",
  homeOfficial: "आधिकारिक पोर्टल खोलता है",
  homeGroups: {
    before: "तैयारी",
    after: "फाइल करने के बाद",
    problem: "अगर कुछ गलत लगे",
    pay: "कर का भुगतान",
  },
  homeLinkNames: {
    "which-form": "जानें कौन-सा फ़ॉर्म आप पर लागू है",
    calculator: "दोनों कर व्यवस्थाओं की तुलना करें",
    documents: "देखें कौन-से दस्तावेज़ चाहिए",
    "link-aadhaar": "आधार को पैन से जोड़ें, या स्थिति देखें",
    "instant-pan": "तुरंत ई-पैन बनवाएँ",
    "defect-check": "फाइल करने से पहले रिटर्न की जाँच करें",
    "e-verify": "भरे हुए रिटर्न का ई-सत्यापन करें",
    "refund-status": "रिफ़ंड की स्थिति जानें",
    "view-filed": "अपने भरे हुए रिटर्न देखें",
    "wrong-entry": "ऐसी आय बताएँ जो आपकी नहीं है",
    notice: "त्रुटिपूर्ण रिटर्न के नोटिस का जवाब दें",
    authenticate: "जाँचें कि नोटिस असली है या नहीं",
    grievance: "शिकायत दर्ज करें",
    "pay-tax": "ऑनलाइन कर जमा करें",
    "payment-status": "कर भुगतान की स्थिति जानें",
  },
  homeHelpTitle: "आपको कौन-सी हेल्पलाइन चाहिए",
  homeHelpIntro:
    "तीन लाइनें, तीन अलग समय। आधिकारिक पेज सिर्फ़ समय छापता है; यह पेज यह भी बताता है कि लाइन अभी खुली है या नहीं, भारतीय समय के अनुसार।",
  homeHelpNames: {
    efiling: "फाइलिंग, पोर्टल और आपका खाता",
    ais: "आपका वार्षिक सूचना विवरण",
    tin: "पैन, टैन और भुगतान से जुड़े सवाल",
  },
  homeOpenNow: "अभी खुली है",
  homeClosedNow: "अभी बंद है",
  homeHours: (from: string, to: string) => `${from} से ${to}, भारतीय समय`,
  homeDaysAll: "रोज़",
  homeDaysWeek: "सोमवार से शुक्रवार",
  homeHelpNote:
    "समय वही जो आयकर विभाग ने प्रकाशित किया है। यह प्रोटोटाइप न कोई सहायता लाइन चलाता है, न किसी को कॉल करता है।",

  downloadNotice: "डेमो रिटर्न सारांश डाउनलोड करें (TXT)",
  viewNotice: "देखें आप पर क्या लागू है",

  /* ---- portal navigation ---- */
  navLabel: "पोर्टल के भाग",
  navMenu: "भाग",
  navMenuClose: "भाग बंद करें",
  navSections: {
    home: "मुख्य पृष्ठ",
    individual: "व्यक्ति/एचयूएफ",
    company: "कंपनी",
    "non-company": "गैर-कंपनी",
    professionals: "कर पेशेवर और अन्य",
    downloads: "डाउनलोड",
    help: "सहायता",
  },
  navPlanned: "इस प्रोटोटाइप में नहीं बना",
  navPlannedTip:
    "नाम इसलिए दिया है ताकि आप देख सकें कि यह कहाँ आता है। यह प्रोटोटाइप सिर्फ़ एक यात्रा बनाता है।",
  navLive: "यहाँ बना है",
  navScopeNote:
    "एक ही यात्रा पूरी बनी है: वेतनभोगी व्यक्ति का ITR-1। बाकी नक्शा दिखाया गया है और चिह्नित है, ताकि यहाँ कुछ भी काम करने का दिखावा न करे।",
  homeServicesTitle: "आप क्या करना चाहते हैं",

  serviceNames: {
    "file-return": "अपना आयकर रिटर्न भरें",
    "view-returns": "अपने भरे हुए रिटर्न देखें",
    "e-verify": "रिटर्न का ई-सत्यापन करें",
    "refund-status": "रिफ़ंड की स्थिति जानें",
    "link-aadhaar": "आधार को पैन से जोड़ें",
    "pay-tax": "ऑनलाइन कर जमा करें",
    "respond-notice": "नोटिस का जवाब दें",
    grievance: "शिकायत दर्ज करें",
    "company-return": "कंपनी का रिटर्न भरें",
    "tds-return": "टीडीएस और टीसीएस विवरण भरें",
    "ca-forms": "चार्टर्ड अकाउंटेंट के फ़ॉर्म",
    "eri-services": "ई-रिटर्न मध्यस्थ सेवाएँ",
    "form-utilities": "ऑफ़लाइन फाइलिंग यूटिलिटी",
    "dsc-utility": "डिजिटल हस्ताक्षर यूटिलिटी",
    faq: "सवाल और जवाब",
    helpdesk: "हेल्पडेस्क से संपर्क करें",
  },
  serviceNotes: {
    "file-return": "वेतनभोगी का ITR-1, आपके लिए तय किया गया और भरने से पहले जाँचा गया।",
    "view-returns": "आपके पैन पर भरा हर रिटर्न, उसकी स्थिति के साथ।",
    "e-verify": "भरे हुए रिटर्न की 30 दिन में पुष्टि करें, वरना वह गिना नहीं जाता।",
    "refund-status": "आपका रिफ़ंड कहाँ है, और अभी तक क्यों नहीं आया।",
    "link-aadhaar": "रिटर्न भरने से पहले यह ज़रूरी है।",
    "pay-tax": "स्व-निर्धारण कर, अग्रिम कर और माँग का भुगतान।",
    "respond-notice": "त्रुटिपूर्ण रिटर्न या जाँच के नोटिस का जवाब दें।",
    grievance: "विभाग के विरुद्ध शिकायत दर्ज करें और उसे देखते रहें।",
    "company-return": "ITR-6 और उसके साथ लगने वाले ऑडिट फ़ॉर्म।",
    "tds-return": "उनके लिए जो भुगतान से पहले कर काटते हैं।",
    "ca-forms": "सीए द्वारा भरी जाने वाली ऑडिट रिपोर्ट और प्रमाणपत्र।",
    "eri-services": "लाइसेंसधारी मध्यस्थ के रूप में ग्राहकों का रिटर्न भरना।",
    "form-utilities": "रिटर्न ऑफ़लाइन भरें और JSON अपलोड करें।",
    "dsc-utility": "डिजिटल हस्ताक्षर प्रमाणपत्र से रिटर्न पर हस्ताक्षर करें।",
    faq: "विभाग के अपने जवाब, विषय के अनुसार।",
    helpdesk: "फ़ोन, ईमेल और शिकायत का रास्ता।",
  },

  /* ---- account and sign-in ---- */
  accountLabel: "आपका खाता",
  signIn: "लॉगिन",
  signOut: "लॉगआउट",
  register: "रजिस्टर करें",
  noAccount: "खाता नहीं है?",
  signedInAs: "इस रूप में साइन इन",
  dashboard: "डैशबोर्ड",
  demoAccountNote: "काल्पनिक खाता। न असली पैन, न असली रिकॉर्ड।",

  gateTitle: "रिटर्न भरने के लिए साइन इन करें",
  gateIntro:
    "ई-फाइलिंग पोर्टल साइन इन किए बिना रिटर्न शुरू नहीं करने देता, और यह भी नहीं करता। यहाँ आप जो भी भरेंगे वह न असली है, न इस डिवाइस से बाहर जाता है।",
  gateSignIn: "लॉगिन करके आगे बढ़ें",
  gateRegister: "मेरा अभी खाता नहीं है",

  loginTitle: "लॉगिन",
  loginIntro: "वही आईडी भरें जिससे आपने रजिस्टर किया था।",
  loginIdLabel: "अपनी यूज़र आईडी भरें",
  loginIdPlaceholder: "पैन / आधार / अन्य यूज़र आईडी",
  loginWhichTitle: "मैं इनमें से कौन हूँ?",
  loginWhichIntro:
    "आधिकारिक खाना तीन अलग चीज़ें लेता है और यह आप पर छोड़ देता है कि आपके पास कौन-सी है। ऐसा करने की ज़रूरत नहीं। जो आपके पास है वह भरिए, यह खाना खुद बता देगा कि उसने क्या पहचाना।",
  loginWhichPan:
    "पैन — दस अक्षर, पहले पाँच अक्षर, फिर चार अंक, फिर एक अक्षर; आपके पैन कार्ड पर छपा हुआ। ज़्यादातर व्यक्तिगत करदाता यही इस्तेमाल करते हैं।",
  loginWhichAadhaar:
    "आधार — बारह अंक। तभी चलेगा जब आपका आधार पहले से पैन से जुड़ा हो।",
  loginWhichOther:
    "कुछ और — ARCA से शुरू होने वाला सीए सदस्यता नंबर, कर काटने वालों का टैन, या ईआरआई कोड। अगर किसी ने आपको इनमें से कुछ नहीं दिया, तो यह आप नहीं हैं।",
  loginReadPan: "इसे पैन के रूप में पहचाना गया।",
  loginReadAadhaar: "इसे आधार संख्या के रूप में पहचाना गया।",
  loginReadOther: "इसे किसी अन्य प्रकार की यूज़र आईडी के रूप में पहचाना गया।",
  loginReadUnknown:
    "अभी पहचाना नहीं गया। पैन दस अक्षर का होता है; आधार बारह अंकों का।",
  loginErrorEmpty: "आगे बढ़ने के लिए अपनी यूज़र आईडी भरें।",
  loginErrorUnknown:
    "इस आईडी से कोई काल्पनिक खाता नहीं मिला। इस डेमो में एक ही करदाता है। नीचे दिया शॉर्टकट लें, या रजिस्टर करें।",
  loginOtpTitle: "पुष्टि करें कि यह आप ही हैं",
  loginOtpIntro: (target: string) =>
    `छह अंकों का कोड ${target} पर खत्म होने वाले मोबाइल पर जाता। यह डेमो उसे भेजने के बजाय यहीं छाप देता है, क्योंकि कोई संदेश भेजा ही नहीं जाता।`,
  loginOtpLabel: "छह अंकों का कोड भरें",
  loginOtpDemoLabel: "डेमो कोड",
  loginOtpErrorEmpty: "छह अंकों का कोड भरें।",
  loginOtpErrorWrong: "यह कोड मेल नहीं खाता। डेमो कोड ऊपर दिखाया गया है।",
  loginVerify: "सत्यापित करके साइन इन करें",
  loginResend: "कोड दोबारा भेजें",
  loginResent: "नया काल्पनिक कोड जारी हुआ। कोड वही है।",
  loginShortcut: "डेमो करदाता के रूप में साइन इन करें",
  loginShortcutNote: "काल्पनिक करदाता। कुछ टाइप नहीं करना।",
  loginOtherWays: "खाते तक पहुँचने के अन्य रास्ते",
  loginNetBanking: "नेट बैंकिंग",
  loginSuccess: (name: string) => `${name} के रूप में साइन इन हुए।`,
  signOutDone: "साइन आउट हो गए। आपका काल्पनिक ड्राफ़्ट इसी डिवाइस पर सुरक्षित है।",

  /* ---- registration ---- */
  registerTitle: "रजिस्टर करें",
  registerIntro: "चार चरण। कुछ भी भेजा नहीं जाता, और कोई खाता नहीं बनता।",
  registerStages: [
    "शुरू करें",
    "विवरण भरें",
    "विवरण सत्यापित करें",
    "खाता सुरक्षित करें",
  ],
  registerStageOf: (current: number, total: number) =>
    `चरण ${current}, कुल ${total} में से`,
  registerWhoTitle: "आपके लिए इनमें से क्या सही है?",
  registerWhoIntro:
    "आधिकारिक फ़ॉर्म पहले “करदाता” और “अन्य” में से चुनने को कहता है, फिर विभागीय पदनामों की सूची थमा देता है। यह तभी काम करता है जब जवाब आपको पहले से पता हो। इसके बजाय अपनी भाषा में जवाब दीजिए, आधिकारिक श्रेणी अपने आप भर जाएगी।",
  registerOfficialLabel: "पोर्टल इसे यह कहता है",
  registerNeedsLabel: "आपको चाहिए होगा",
  registerNotSure: "अब भी तय नहीं कर पा रहे कि आप कौन हैं?",
  registerNotSureAction: "सहायक से पूछें",
  registerUnsupported:
    "यह प्रोटोटाइप वह यात्रा नहीं बनाता। श्रेणी सही है, और आधिकारिक पोर्टल पर आप आगे वहीं जाते।",
  registerRouteError: "वह पंक्ति चुनें जो आप पर लागू होती है।",
  routeNames: {
    self: "मैं अपना कर खुद, अपने लिए भर रहा/रही हूँ",
    family: "मैं अपने परिवार के लिए, संयुक्त हिंदू परिवार की संपत्ति के रूप में भर रहा/रही हूँ",
    "chartered-accountant": "मैं चार्टर्ड अकाउंटेंट हूँ और ग्राहकों के लिए ऑडिट या प्रमाणन करता/करती हूँ",
    intermediary: "मैं व्यवसाय के रूप में दूसरों के रिटर्न भरता/भरती हूँ",
    deductor: "मैं लोगों को भुगतान से पहले कर काटता/काटती हूँ और विभाग को जमा करता/करती हूँ",
    "non-resident": "मैं भारत से बाहर रहता/रहती हूँ और मेरे पास पैन नहीं है",
    agency: "मैं ऐसे बैंक, सरकारी निकाय या एजेंसी का प्रतिनिधि हूँ जो विभाग से डेटा साझा करती है",
  },
  routeNeeds: {
    self: "आपका पैन, आधार से जुड़ा मोबाइल, और एक ईमेल पता",
    family: "एचयूएफ का अपना पैन और कर्ता का विवरण",
    "chartered-accountant": "आपका छह अंकों का आईसीएआई सदस्यता नंबर",
    intermediary: "आपके संगठन को जारी ईआरआई कोड",
    deductor: "आपका टैन, पैन नहीं",
    "non-resident": "आपका पासपोर्ट और निवास का देश",
    agency: "आपके संगठन को जारी प्राधिकार पत्र",
  },
  registerPan: "पैन",
  registerPanHint: "दस अक्षर, जैसे कार्ड पर छपे हैं। छोटे-बड़े अक्षर से फ़र्क़ नहीं पड़ता।",
  registerPanError: "पैन में पाँच अक्षर, चार अंक, फिर एक अक्षर होता है।",
  registerName: "पूरा नाम, जैसा पैन कार्ड पर छपा है",
  registerNameError: "नाम वैसे ही भरें जैसे कार्ड पर छपा है।",
  registerDob: "जन्म तिथि",
  registerDobHint: "यह पैन पर दर्ज विभागीय रिकॉर्ड से मेल खानी चाहिए।",
  registerDobError: "अपनी जन्म तिथि भरें।",
  registerMobile: "मोबाइल नंबर",
  registerMobileHint: "दस अंक। कोड यहीं आता।",
  registerMobileError: "दस अंकों का मोबाइल नंबर भरें।",
  registerEmail: "ईमेल पता",
  registerEmailError: "ईमेल पता भरें।",
  registerVerifyTitle: "अपना विवरण सत्यापित करें",
  registerVerifyIntro:
    "पोर्टल एक कोड मोबाइल पर और एक ईमेल पर भेजता है। यह डेमो एक ही कोड छापता है, क्योंकि यह कुछ भेजता ही नहीं।",
  registerSecureTitle: "अपना खाता सुरक्षित करें",
  registerSecureIntro:
    "पासवर्ड बनाइए। यह सिर्फ़ इसी ब्राउज़र में रहता है और किसी से जाँचा नहीं जाता।",
  registerPassword: "पासवर्ड",
  registerPasswordRules:
    "कम से कम आठ अक्षर, जिनमें एक अंक हो। यह नियम टाइप करने से पहले बताया गया है, किसी कोशिश के अस्वीकार होने के बाद नहीं।",
  registerPasswordError: "कम से कम आठ अक्षर लें, जिनमें एक अंक हो।",
  registerFinish: "काल्पनिक खाता बनाएँ",
  registerDoneTitle: "काल्पनिक खाता बन गया",
  registerDoneIntro:
    "आयकर विभाग के पास कुछ भी रजिस्टर नहीं हुआ। अब आप डेमो में साइन इन हैं और काल्पनिक रिटर्न भर सकते हैं।",
  registerDoneAction: "अपने डैशबोर्ड पर जाएँ",
  registerHaveAccount: "पहले से खाता है?",

  /* ---- dashboard ---- */
  dashIntro: "आपके पैन के अंतर्गत सब कुछ, और आप पर अब भी क्या बाक़ी है।",
  dashPendingTitle: "आपका इंतज़ार",
  dashNothingPending: "आप पर कुछ भी बाक़ी नहीं है।",
  dashReturnTitle: (year: string) => `आयकर रिटर्न, निर्धारण वर्ष ${year}`,
  dashReturnNotStarted: "शुरू नहीं हुआ",
  dashReturnInProgress: (done: number, total: number) =>
    `${total} में से ${done} चरण पूरे`,
  dashReturnFiled: "भरा और स्वीकृत",
  dashStart: "रिटर्न शुरू करें",
  dashResume: "रिटर्न जारी रखें",
  dashViewReceipt: "पावती देखें",
  dashHistoryTitle: "पिछले वर्ष",
  dashHistoryNote:
    "असली डैशबोर्ड पैन पर भरा हर वर्ष दिखाता है। इस प्रोटोटाइप में एक काल्पनिक वर्ष है।",
  dashServicesTitle: "अन्य सेवाएँ",

  /* ---- assistant ---- */
  assistantName: "सहायक",
  assistantOpen: "सहायक से पूछें",
  assistantClose: "सहायक बंद करें",
  assistantTitle: "सहायक, फाइलिंग में मदद के लिए",
  assistantIntroOut:
    "फाइलिंग, फ़ॉर्म, या आप किस श्रेणी में आते हैं — कुछ भी पूछिए। साइन इन करने पर यह आपके अपने रिटर्न की स्थिति भी देख सकता है।",
  assistantIntroIn:
    "यह देख सकता है कि आप किस चरण पर हैं और आपने क्या भरा है, इसलिए आपको अपना ही रिटर्न इसे समझाना नहीं पड़ेगा।",
  assistantPlaceholder: "सवाल पूछें",
  assistantSend: "भेजें",
  assistantThinking: "सोच रहा है",
  assistantStop: "रोकें",
  assistantClear: "यह बातचीत मिटाएँ",
  assistantYou: "आप",
  assistantErrorTitle: "सहायक जवाब नहीं दे सका",
  assistantErrorNetwork:
    "अनुरोध सहायक तक नहीं पहुँचा। कनेक्शन जाँचकर दोबारा कोशिश करें। इस प्रोटोटाइप का हर चरण इसके बिना भी चलता है।",
  assistantErrorKey:
    "इस तैनाती पर सहायक सेट नहीं है। बाक़ी सब कुछ फिर भी काम करता है।",
  assistantErrorRate:
    "बहुत जल्दी-जल्दी बहुत सवाल। थोड़ा रुककर दोबारा पूछें।",
  assistantOffline:
    "आप ऑफ़लाइन हैं। सहायक को कनेक्शन चाहिए; रिटर्न को नहीं।",
  assistantDisclosure:
    "जवाब एक भाषा मॉडल से बनते हैं और ग़लत हो सकते हैं। यहाँ कुछ भी कर-सलाह नहीं है, और सहायक आपका रिटर्न बदल नहीं सकता।",
  assistantContextTitle: "सहायक क्या देख सकता है",
  assistantContextNone: "आपके बारे में कुछ नहीं। आप साइन इन नहीं हैं।",
  assistantCheckStep: "यह चरण मेरे लिए जाँचें",
  assistantCheckRunning: "यह चरण जाँचा जा रहा है",
  assistantAttach: "अपना फ़ॉर्म 16 जोड़ें",
  assistantAttached: (name: string) => `${name} जोड़ा गया`,
  assistantAttachNote:
    "फ़ाइल आपके डिवाइस पर ही रहती है। यह प्रोटोटाइप आपके दस्तावेज़ के बजाय काल्पनिक फ़ॉर्म 16 पढ़ता है, और अपने जवाब में यह बता देता है।",
  assistantSuggestionsOut: [
    "वेतनभोगी व्यक्ति पर कौन-सा ITR फ़ॉर्म लागू होता है?",
    "मुझसे कहा गया कि ईआरआई के रूप में रजिस्टर करूँ। क्या वह मैं हूँ?",
    "निर्धारण वर्ष 2026-27 के लिए भरने की आख़िरी तारीख़ क्या है?",
  ],
  assistantSuggestionsIn: [
    "क्या इस चरण पर मुझसे कुछ छूट गया है?",
    "आपने मेरे लिए ITR-1 क्यों चुना?",
    "कौन-सी व्यवस्था मेरे लिए बेहतर है, और क्यों?",
  ],
  assistantStepLabel: "अभी देख रहा है",
};

export const copy: Record<Language, CommonCopy> = { en, hi };

/* ---------------------------------------------------------------- journey */

const journeyEn = {
  home: {
    pending: "Your return for AY 2026-27",
    eyebrow: "Salaried filing · demo case",
    title: "File your own salaried return, without paying anyone.",
    intro:
      "Most salaried people in India could file their own return in about ten minutes.",
    introMore:
      "Almost nobody does, because the form asks questions only a tax professional can answer. This one answers them for you, and shows its working.",
    start: "Start the return",
    resumeTitle: "Saved draft",
    meansTitle: "Why people pay someone else",
    means:
      "The official form asks which ITR type you need, which regime to pick, what an [[exempt-allowance|exempt allowance]] is, and whether an entry in your [[ais|Annual Information Statement]] is yours. Each answer is knowable, but none of them is on the screen where the question is asked. So people pay a professional a few thousand rupees to answer them.",
    needTitle: "What you need",
    need: [
      "Your Form 16 from your employer, as a PDF or a photo",
      "About ten minutes",
      "Nothing else — the rest is already with the department",
    ],
    noSurpriseTitle: "Before you start, so nothing is a surprise",
    noSurprise: [
      "This service is free, and it will never ask you to pay anything.",
      "At step 6 you will be told, in rupees, whether you are owed a refund or still owe tax. You will see the arithmetic that produced it.",
      "You can stop at any point. Your answers stay on this device and you can pick up where you left off.",
      "You can go back and change any answer before you file.",
    ],
    scopeTitle: "What this demo covers",
    scope: [
      "One salaried taxpayer with income from salary, bank interest and dividend",
      "ITR-1 for assessment year 2026-27, with a versioned demonstration calculation",
      "A simulated filing and acknowledgement, with no government record",
    ],
    outOfScopeTitle: "What it does not cover",
    outOfScope:
      "Business or professional income, capital gains beyond the demo case, house property, foreign assets, real PAN data, real tax computation, payments, or submission to the Income Tax Department.",
    privacy:
      "The demo draft stays in this browser. Do not upload a real tax document or identifier.",
  },

  check: {
    eyebrow: "Step 1",
    title: "What applies to you",
    intro:
      "The portal opens by asking you to choose a form, a filing reason and an [[nature-of-employment|employment type]]. Those answers follow from facts the department already holds, so this prototype works them out and shows why.",
    decidedTitle: "Decided for you",
    decided: [
      {
        label: "Your form",
        value: "ITR-1 (Sahaj)",
        why: "Your income is salary, bank interest and dividend, and it is under ₹50 lakh. [[itr-1|ITR-1]] is the form for exactly that. You would need [[itr-2|ITR-2]] if you had capital gains beyond the small limit, or more than one house property.",
      },
      {
        label: "Nature of employment",
        value: "Private sector salaried",
        why: "Your Form 16 is issued by a private company, so the portal's “Others” option is the one that applies. Government employees pick a different option because one deduction is only available to them.",
      },
      {
        label: "Reason for filing",
        value: "Taxable income is above the basic exemption limit",
        why: "The portal offers this as an unlabelled dropdown. Your salary alone puts you above the limit, so this is the reason that applies to you.",
      },
    ],
    whyLabel: "Why",
    datesTitle: "The dates that matter",
    datesIntro:
      "These are the statutory dates for a salaried return. They are stated here as facts, separate from this demo's own window.",
    dateDue: "Due date for ITR-1",
    dateBelated: "Belated return still accepted until",
    dateFee: "Late fee if you file after the due date",
    dateFeeValue: "₹1,000 to ₹5,000 under section 234F",
    reviseNote:
      "A return filed on time can still be revised until 31 December 2026. Filing something correct and on time is better than filing nothing, and a mistake can be fixed afterwards.",
    continue: "This applies to me, continue",
  },

  salary: {
    eyebrow: "Step 2",
    title: "Your salary",
    intro:
      "Every figure below comes from your [[form-16|Form 16]]. Each one is shown beside the exact place it came from, so you can check it against the document rather than trusting the screen.",
    documentsTitle: "Documents in use",
    documentsIntro:
      "Both documents are synthetic fixtures. You can replace either one to see the checks run.",
    kinds: {
      form16: "Form 16 from your employer",
      ais: "Annual Information Statement",
    },
    loaded: "Loaded",
    notLoaded: "Not loaded",
    load: "Load the demo document",
    replace: "Replace",
    replaceHint: "PDF, JPG or PNG, up to 5 MB",
    ruleFormats: "PDF, JPG or PNG. Nothing else is accepted.",
    ruleSize: (limit: string) => `Up to ${limit} for each document.`,
    rulePhoto:
      "A photo is fine. If you pick a JPG or PNG, it is turned into a PDF and brought under the size limit here on your phone. Nothing is uploaded anywhere to do it.",
    preparing: "Preparing…",
    convertedNote: (name: string, from: string, to: string) =>
      `Turned into ${name} and reduced from ${from} to ${to}. Done on your device.`,
    compressedNote: (from: string, to: string) =>
      `Reduced from ${from} to ${to}. Done on your device.`,
    figuresTitle: "From your Form 16",
    portalLabel: "On the official portal this field is called",
    grossSalary: "Gross salary",
    grossSalarySource: "Demo Form 16, Part B, row 1(d)",
    grossSalaryPortal: "B1 i. Gross Salary (a + b + c)",
    standardDeduction: "Standard deduction",
    standardDeductionSource: "Fixed by law for salaried taxpayers",
    standardDeductionPortal: "B1 iii a. Standard Deduction u/s 16(ia)",
    standardDeductionWhy:
      "Every salaried person gets this. You do not claim it and you cannot lose it. The amount depends on the regime you choose, which is the next decision.",
    salaryTds: "Tax already deducted by your employer",
    salaryTdsSource: "Demo Form 16, Part A",
    salaryTdsPortal:
      "Schedule TDS1 — Details of Tax Deducted at Source from Salary",
    salaryTdsWhy:
      "Your employer has already paid this to the department on your behalf. It counts against your final bill, which is why many salaried people are owed a refund rather than more tax.",
    allowanceTitle: "Exempt allowances",
    allowanceNote:
      "The portal shows an empty column here and leaves you to work out whether anything belongs in it. Under the new regime, house rent and most other allowances are not exempt, so this column stays empty. If you choose the old regime, this is where they would go.",
    confirm: "These figures match my Form 16",
    confirmError: "Confirm the figures match your Form 16 before continuing.",
  },

  income: {
    eyebrow: "Step 3",
    title: "Your other income",
    intro:
      "The department already knows about interest and dividend paid to your [[pan|PAN]]. The portal prefills these and asks you to “review and confirm”. This is the single most important screen in the whole return, and the one the portal explains least.",
    whyTitle: "Why this screen decides everything",
    why: "If an entry is yours and you leave it out, your return disagrees with the department's own records and can be marked [[defective-return|defective]] months later. If an entry is not yours and you accept it, you pay tax on money you never received. Answer each line and the rest of the return follows.",
    entriesTitle: "Prefilled from your Annual Information Statement",
    portalLabel: "On the official portal this sits under",
    portalSection: "B3. Income from Other Sources",
    portalTds:
      "Schedule TDS2 — Details of Tax Deducted at Source from Income Other than Salary",
    kinds: {
      savings: "Savings account interest",
      fd: "Fixed deposit interest",
      dividend: "Dividend",
    },
    payer: "Paid by",
    tan: "Deductor TAN",
    amount: "Income reported",
    tds: "Tax deducted",
    noTds: "None",
    question: "Is this yours?",
    mine: "Yes, and the figure is right",
    amended: "Yes, but the figure is wrong",
    notMine: "No, I do not recognise this",
    answeredMine: "Included in your return",
    answeredAmended: "Included, at the figure you give",
    answeredNotMine: "Left out, and its tax credit dropped",
    amendReported: (reported: string) => `The statement says ${reported}`,
    amendNote:
      "Your figure is what goes into the return. The tax already deducted is unchanged, because that is what the bank actually paid the department. Report the difference as AIS feedback so their record catches up with yours.",
    amendError: "Give the figure that should be reported, as a number.",
    disputeTitle: "What happens to an entry you do not recognise",
    disputeNote:
      "It stays out of your return, and the tax deducted against it is not claimed. Claiming a credit without reporting the matching income is the exact mismatch that produces a defective-return notice. You report the entry separately as AIS feedback.",
    disputeAction: "Report this entry as not mine",
    progress: (answered: number, total: number) =>
      `${answered} of ${total} entries answered`,
    runningTotal: "Other income to be reported",
    runningTds: "Tax credit you can claim",
    error: "Answer every entry before continuing.",
  },

  regime: {
    eyebrow: "Step 4",
    title: "Your tax regime",
    intro:
      "This is the one genuine choice in a salaried return, and the portal presents it as a checkbox with no numbers attached. Both regimes are computed below from your actual figures.",
    portalLabel: "On the official portal this is asked as",
    portalQuestion:
      "Do you wish to exercise the option u/s 115BAC(6) of opting out of the new tax regime? (default is \u201cNo\u201d)",
    recommendTitle: "On your figures",
    recommendNew: "The new regime costs you less",
    recommendOld: "The old regime costs you less",
    saving: "You keep",
    savingNote: "compared with the other regime",
    newRegime: "New regime",
    oldRegime: "Old regime",
    recapTitle: "What you would pay under it",
    chooseNew: "File under the new regime",
    chooseOld: "File under the old regime",
    chosen: "Chosen",
    grossTotal: "Gross total income",
    deductionsLabel: "Deductions allowed",
    totalIncome: "Total income",
    taxBefore: "Tax on this income",
    rebate: "Section 87A rebate",
    cess: "Health and education cess",
    totalTax: "Total tax",
    workingTitle: "How the tax was worked out",
    workingIntro:
      "Income is taxed in bands. Only the part inside each band is taxed at that band's rate, which is why a raise never leaves you worse off.",
    bandRange: "Slab",
    bandRate: "Rate",
    bandTaxable: "Taxed in this band",
    bandTax: "Tax",
    deductionsTitle: "What you can and cannot claim",
    newDeductionsNote:
      "The new regime removes almost every deduction. Section 80C, 80D, house rent and home loan interest on a self-occupied property all stop applying. In exchange the slabs are wider and the standard deduction is larger. This is why the portal's long list of deduction fields is mostly irrelevant to you here.",
    oldDeductionsNote:
      "The old regime keeps the familiar deductions. The demo claims section 80C, section 80D and the savings-interest allowance under section 80TTA at the fixture amounts, capped at the statutory limits.",
    deduction80C: "Section 80C",
    deduction80D: "Section 80D",
    deduction80TTA: "Section 80TTA on savings interest",
    rebateNote: (limit: string) =>
      `A total income at or below ${limit} pays no tax under the new regime, because the section 87A rebate cancels it. Above that limit the rebate stops and the slabs apply in full.`,
    error: "Choose a regime before continuing.",
  },

  checks: {
    eyebrow: "Step 5",
    title: "Before you file",
    intro:
      "A return is marked defective under [[section-139-9|section 139(9)]] when it disagrees with the department's own records. That notice usually arrives months after filing, when the mistake is expensive to fix. These are the same checks, run now.",
    idea:
      "The official portal does not run these before you submit. This is the part of the prototype we would most want a real service to adopt.",
    passed: (passed: number, total: number) =>
      `${passed} of ${total} checks passed`,
    attentionTitle: "Needs your attention",
    allClearTitle: "Nothing is blocking your return",
    allClear:
      "Every entry has been answered, the tax credit you are claiming matches the income you are reporting, and a regime is chosen.",
    labels: {
      "all-reviewed": "Every prefilled entry has been answered",
      "tds-matches-income":
        "Every tax credit claimed has its matching income reported",
      "disputed-tds-dropped": "No credit claimed on a disputed entry",
      "regime-chosen": "A tax regime has been chosen",
    },
    detail: {
      "all-reviewed":
        "An unanswered prefilled entry is the most common cause of a defective-return notice.",
      "tds-matches-income":
        "Every tax credit you claim has to have its matching income reported in the same return.",
      "disputed-tds-dropped":
        "Tax deducted against an entry you did not accept is never claimed. Claiming a credit without reporting the matching income is the exact mismatch that produces a defective-return notice, so the credit is dropped with the income. Report any such entry as AIS feedback separately.",
      "regime-chosen":
        "A return has to say which regime it is filed under, because the whole calculation depends on it.",
    },
    fix: {
      "all-reviewed": "Go back to step 3 and answer the entries still left.",
      "tds-matches-income":
        "This is checked once every entry has been answered.",
      "disputed-tds-dropped": "",
      "regime-chosen": "Go back to step 4 and choose a regime.",
    },
    strandedLabel: "Credit deliberately not claimed",
    goToStep: "Fix this",
    continue: "Continue to review",
  },

  review: {
    eyebrow: "Step 6",
    title: "Review and file",
    intro:
      "This is everything that will go into the simulated return. Change anything you need to before you file.",
    incomeTitle: "Income",
    salaryLine: "Salary after standard deduction",
    otherLine: "Other income you confirmed",
    taxTitle: "Tax",
    creditTitle: "Tax already paid",
    refundTitle: "You are owed a refund",
    payableTitle: "You still owe tax",
    refundNote:
      "Your employer and your bank deducted more than your final bill.",
    refundAccountLabel: "It would be paid into",
    refundAccountLine: (bank: string, masked: string, kind: string) =>
      `${bank} · ${masked} · ${kind}`,
    refundAccountNote:
      "The one account you nominated for the refund, and the only one the department can pay into. Change it and the refund follows.",
    refundAccountEdit: "Change the account",
    refundNoAccountNote:
      "No validated account is nominated for the refund, so in a real filing there would be nowhere to pay it. Nominate one before you file.",
    payableNote:
      "In a real filing you would pay this before submitting, and the return would carry the challan details.",
    editLabel: "Change",
    declarationTitle: "Declaration",
    declaration:
      "I confirm the demo figures above are the ones I want to file, and I understand this prototype files nothing with the Income Tax Department.",
    declarationError: "Tick the declaration before filing.",
    submit: "File this demo return",
    submitting: "Filing…",
    offlineTitle: "You are offline",
    offlineNote:
      "Your answers are safe on this device. The demo filing will wait until you are back online.",
    retry: "Try filing again",
    stop: "Stop and keep the draft",
    verifyTitle: "Verification",
    verifyNote:
      "Filing this return is not the last act. A real return has to be verified separately, within 30 days, and until it is the department treats it as never filed. That step comes right after this one, and this demo simulates it without sending any OTP.",
  },

  receipt: {
    eyebrow: "Demo acknowledgement",
    title: "Your demo return has been filed.",
    intro:
      "Nothing was sent to the Income Tax Department. This is what a real acknowledgement would carry.",
    ackLabel: "Acknowledgement number",
    txnLabel: "Transaction ID",
    statusLabel: "Status",
    statusValue: "Simulated filing complete, verified",
    statusUnverified: "Simulated filing complete, not verified",
    timeLabel: "Time",
    formLabel: "Form",
    regimeLabel: "Regime",
    regimeNew: "New",
    regimeOld: "Old",
    totalIncomeLabel: "Total income",
    totalTaxLabel: "Total tax",
    refundLabel: "Refund due",
    payableLabel: "Balance payable",
    versionLabel: "Calculation version",
    nextTitle: "What would happen next",
    /* Title and body, not one long line. The sequence layout sets the title
       beside its explanation, and a list of bare titles left the right half of
       the page empty while the titles themselves wrapped in a column too
       narrow to read. */
    next: [
      {
        title: "You verify it, or none of the rest happens.",
        body: "Nothing below starts until the return is verified. An unverified return sits there looking filed and is treated as never filed.",
      },
      {
        title: "The department processes the return and confirms the refund.",
        body: "Usually a few weeks, counted from the day you verified rather than the day you filed.",
      },
      {
        title: "The AIS feedback you raised is reviewed separately.",
        body: "It runs on its own track and holds up neither the return nor the refund.",
      },
      {
        title: "The return can still be revised until 31 December 2026.",
        body: "A revised return replaces this one and quotes its acknowledgement number, so keep that number.",
      },
    ],
    print: "Print this acknowledgement",
    download: "Download as text",
    restart: "Start the demo again",
    warning:
      "Synthetic acknowledgement. No government record exists and no refund will be paid.",
  },
};

type JourneyCopy = typeof journeyEn;

const journeyHi: JourneyCopy = {
  home: {
    pending: "निर्धारण वर्ष 2026-27 का आपका रिटर्न",
    eyebrow: "वेतनभोगी फाइलिंग · डेमो केस",
    title: "अपना वेतन रिटर्न खुद भरें, किसी को पैसे दिए बिना।",
    intro:
      "भारत में ज़्यादातर वेतनभोगी लोग अपना रिटर्न लगभग दस मिनट में खुद भर सकते हैं।",
    introMore:
      "पर भरते बहुत कम हैं, क्योंकि फ़ॉर्म ऐसे सवाल पूछता है जिनका जवाब सिर्फ़ कर विशेषज्ञ जानता है। यह सेवा वे जवाब खुद निकालती है, और अपनी गणना भी दिखाती है।",
    start: "रिटर्न शुरू करें",
    resumeTitle: "सहेजा हुआ ड्राफ़्ट",
    meansTitle: "लोग किसी और को पैसे क्यों देते हैं",
    means:
      "आधिकारिक फ़ॉर्म पूछता है कि कौन-सा ITR चाहिए, कौन-सी कर व्यवस्था चुनें, [[exempt-allowance|छूट वाला भत्ता]] क्या है, और क्या आपके [[ais|वार्षिक सूचना विवरण]] की कोई प्रविष्टि आपकी है। हर जवाब जाना जा सकता है, पर कोई भी जवाब उसी स्क्रीन पर नहीं होता जहाँ सवाल पूछा जाता है। इसीलिए लोग कुछ हज़ार रुपये देकर किसी पेशेवर से यह करवाते हैं।",
    needTitle: "आपको क्या चाहिए",
    need: [
      "अपने नियोक्ता से मिला फ़ॉर्म 16, PDF या तस्वीर के रूप में",
      "लगभग दस मिनट",
      "और कुछ नहीं — बाकी जानकारी विभाग के पास पहले से है",
    ],
    noSurpriseTitle: "शुरू करने से पहले, ताकि कुछ अचानक सामने न आए",
    noSurprise: [
      "यह सेवा मुफ़्त है, और आपसे कभी कोई पैसा नहीं माँगेगी।",
      "चरण 6 पर आपको रुपयों में बता दिया जाएगा कि आपको रिफ़ंड मिलना है या कर देना बाकी है। साथ में पूरी गणना भी दिखेगी।",
      "आप कभी भी रुक सकती हैं। आपके जवाब इसी डिवाइस पर रहते हैं और आप वहीं से आगे बढ़ सकती हैं।",
      "फाइल करने से पहले आप कोई भी जवाब पीछे जाकर बदल सकती हैं।",
    ],
    scopeTitle: "यह डेमो क्या दिखाता है",
    scope: [
      "एक वेतनभोगी करदाता, जिसकी आय वेतन, बैंक ब्याज और लाभांश से है",
      "निर्धारण वर्ष 2026-27 का ITR-1, संस्करण-युक्त डेमो गणना के साथ",
      "सिमुलेटेड फाइलिंग और पावती, बिना किसी सरकारी रिकॉर्ड के",
    ],
    outOfScopeTitle: "यह क्या नहीं दिखाता",
    outOfScope:
      "व्यापार या पेशे की आय, डेमो केस से बाहर का पूँजीगत लाभ, गृह संपत्ति, विदेशी संपत्ति, असली पैन डेटा, असली कर गणना, भुगतान, या आयकर विभाग को जमा करना।",
    privacy:
      "डेमो ड्राफ़्ट इसी ब्राउज़र में रहता है। कोई असली कर दस्तावेज़ या पहचान संख्या अपलोड न करें।",
  },

  check: {
    eyebrow: "चरण 1",
    title: "आप पर क्या लागू है",
    intro:
      "पोर्टल सबसे पहले फ़ॉर्म, फाइलिंग का कारण और [[nature-of-employment|रोज़गार का प्रकार]] पूछता है। इनके जवाब उन तथ्यों से निकलते हैं जो विभाग के पास पहले से हैं, इसलिए यह प्रोटोटाइप उन्हें खुद निकालता है और कारण भी बताता है।",
    decidedTitle: "आपके लिए तय किया गया",
    decided: [
      {
        label: "आपका फ़ॉर्म",
        value: "ITR-1 (सहज)",
        why: "आपकी आय वेतन, बैंक ब्याज और लाभांश से है और ₹50 लाख से कम है। ठीक इसी के लिए [[itr-1|ITR-1]] बना है। पूँजीगत लाभ छोटी सीमा से ज़्यादा होता, या एक से अधिक गृह संपत्ति होती, तब [[itr-2|ITR-2]] चाहिए होता।",
      },
      {
        label: "रोज़गार का प्रकार",
        value: "निजी क्षेत्र, वेतनभोगी",
        why: "आपका फ़ॉर्म 16 एक निजी कंपनी ने दिया है, इसलिए पोर्टल का “अन्य” विकल्प लागू होता है। सरकारी कर्मचारी अलग विकल्प चुनते हैं क्योंकि एक कटौती सिर्फ़ उन्हीं को मिलती है।",
      },
      {
        label: "फाइल करने का कारण",
        value: "कर योग्य आय मूल छूट सीमा से ऊपर है",
        why: "पोर्टल इसे बिना समझाए एक ड्रॉपडाउन में रखता है। अकेला वेतन ही आपको सीमा से ऊपर ले जाता है, इसलिए यही कारण लागू होता है।",
      },
    ],
    whyLabel: "क्यों",
    datesTitle: "ज़रूरी तारीख़ें",
    datesIntro:
      "ये वेतन रिटर्न की वैधानिक तारीख़ें हैं। इन्हें यहाँ तथ्य के रूप में रखा गया है, इस डेमो की अपनी अवधि से अलग।",
    dateDue: "ITR-1 की नियत तारीख़",
    dateBelated: "विलंबित रिटर्न इस तारीख़ तक स्वीकार",
    dateFee: "नियत तारीख़ के बाद भरने पर विलंब शुल्क",
    dateFeeValue: "धारा 234F के तहत ₹1,000 से ₹5,000",
    reviseNote:
      "समय पर भरे गए रिटर्न को 31 दिसंबर 2026 तक संशोधित किया जा सकता है। कुछ न भरने से बेहतर है समय पर सही रिटर्न भरना, और गलती बाद में सुधारी जा सकती है।",
    continue: "यह मुझ पर लागू है, आगे बढ़ें",
  },

  salary: {
    eyebrow: "चरण 2",
    title: "आपका वेतन",
    intro:
      "नीचे का हर आँकड़ा आपके [[form-16|फ़ॉर्म 16]] से आया है। हर आँकड़े के साथ यह भी लिखा है कि वह दस्तावेज़ में कहाँ से आया, ताकि आप स्क्रीन पर भरोसा करने के बजाय दस्तावेज़ से मिला सकें।",
    documentsTitle: "उपयोग में दस्तावेज़",
    documentsIntro:
      "दोनों दस्तावेज़ काल्पनिक हैं। जाँच चलती देखने के लिए आप इनमें से कोई भी बदल सकते हैं।",
    kinds: {
      form16: "नियोक्ता से मिला फ़ॉर्म 16",
      ais: "वार्षिक सूचना विवरण (AIS)",
    },
    loaded: "लोड हुआ",
    notLoaded: "लोड नहीं हुआ",
    load: "डेमो दस्तावेज़ लोड करें",
    replace: "बदलें",
    replaceHint: "PDF, JPG या PNG, 5 MB तक",
    ruleFormats: "PDF, JPG या PNG। इनके अलावा कुछ स्वीकार नहीं।",
    ruleSize: (limit: string) => `हर दस्तावेज़ ${limit} तक।`,
    rulePhoto:
      "तस्वीर चलेगी। JPG या PNG चुनने पर उसे यहीं आपके फ़ोन पर PDF बनाकर आकार की सीमा के अंदर ले आया जाता है। इसके लिए कुछ भी कहीं अपलोड नहीं होता।",
    preparing: "तैयार हो रहा है…",
    convertedNote: (name: string, from: string, to: string) =>
      `${name} बना दिया गया और आकार ${from} से ${to} कर दिया गया। यह सब आपके डिवाइस पर हुआ।`,
    compressedNote: (from: string, to: string) =>
      `आकार ${from} से ${to} कर दिया गया। यह सब आपके डिवाइस पर हुआ।`,
    figuresTitle: "आपके फ़ॉर्म 16 से",
    portalLabel: "आधिकारिक पोर्टल पर इस खाने का नाम है",
    grossSalary: "सकल वेतन",
    grossSalarySource: "डेमो फ़ॉर्म 16, भाग B, पंक्ति 1(d)",
    grossSalaryPortal: "B1 i. Gross Salary (a + b + c)",
    standardDeduction: "मानक कटौती",
    standardDeductionSource: "वेतनभोगी करदाताओं के लिए कानून से तय",
    standardDeductionPortal: "B1 iii a. Standard Deduction u/s 16(ia)",
    standardDeductionWhy:
      "यह हर वेतनभोगी को मिलती है। न इसे माँगना पड़ता है, न यह छिन सकती है। रकम इस पर निर्भर है कि आप कौन-सी व्यवस्था चुनते हैं, जो अगला फ़ैसला है।",
    salaryTds: "नियोक्ता द्वारा पहले काटा गया कर",
    salaryTdsSource: "डेमो फ़ॉर्म 16, भाग A",
    salaryTdsPortal:
      "Schedule TDS1 — Details of Tax Deducted at Source from Salary",
    salaryTdsWhy:
      "यह रकम आपका नियोक्ता आपकी ओर से विभाग को पहले ही दे चुका है। यह आपके अंतिम बिल में घट जाती है, इसीलिए कई वेतनभोगी लोगों को और कर देने के बजाय रिफ़ंड मिलता है।",
    allowanceTitle: "छूट वाले भत्ते",
    allowanceNote:
      "पोर्टल यहाँ एक खाली कॉलम दिखा देता है और आप पर छोड़ देता है कि इसमें कुछ आता है या नहीं। नई व्यवस्था में मकान किराया और ज़्यादातर भत्ते छूट में नहीं आते, इसलिए यह कॉलम खाली रहता है। पुरानी व्यवस्था चुनने पर वे यहाँ आते।",
    confirm: "ये आँकड़े मेरे फ़ॉर्म 16 से मेल खाते हैं",
    confirmError: "आगे बढ़ने से पहले पुष्टि करें कि आँकड़े फ़ॉर्म 16 से मेल खाते हैं।",
  },

  income: {
    eyebrow: "चरण 3",
    title: "आपकी अन्य आय",
    intro:
      "आपके [[pan|पैन]] पर मिले ब्याज और लाभांश की जानकारी विभाग के पास पहले से है। पोर्टल इन्हें भरकर दिखाता है और कहता है “देखें और पुष्टि करें”। पूरे रिटर्न में यही सबसे अहम स्क्रीन है, और पोर्टल इसी को सबसे कम समझाता है।",
    whyTitle: "यह स्क्रीन सब कुछ क्यों तय करती है",
    why: "अगर कोई प्रविष्टि आपकी है और आप उसे छोड़ देते हैं, तो आपका रिटर्न विभाग के अपने रिकॉर्ड से नहीं मिलता और महीनों बाद उसे [[defective-return|त्रुटिपूर्ण]] घोषित किया जा सकता है। अगर कोई प्रविष्टि आपकी नहीं है और आप उसे मान लेते हैं, तो आप उस पैसे पर कर देते हैं जो आपको कभी मिला ही नहीं। हर पंक्ति का जवाब दे दें, बाकी रिटर्न अपने आप बन जाता है।",
    entriesTitle: "आपके वार्षिक सूचना विवरण से भरा गया",
    portalLabel: "आधिकारिक पोर्टल पर यह इसके नीचे आता है",
    portalSection: "B3. Income from Other Sources",
    portalTds:
      "Schedule TDS2 — Details of Tax Deducted at Source from Income Other than Salary",
    kinds: {
      savings: "बचत खाते का ब्याज",
      fd: "सावधि जमा (FD) का ब्याज",
      dividend: "लाभांश",
    },
    payer: "किसने दिया",
    tan: "कटौतीकर्ता TAN",
    amount: "दर्ज आय",
    tds: "काटा गया कर",
    noTds: "कुछ नहीं",
    question: "क्या यह आपकी है?",
    mine: "हाँ, यह मेरी है",
    notMine: "नहीं, मैं इसे नहीं पहचानती",
    amended: "हाँ, पर रकम ग़लत है",
    answeredMine: "आपके रिटर्न में शामिल",
    answeredAmended: "शामिल, आपकी बताई रकम पर",
    amendReported: (reported: string) => `विवरण में ${reported} लिखा है`,
    amendNote:
      "रिटर्न में आपकी बताई रकम जाती है। काटा गया कर वही रहता है, क्योंकि बैंक ने विभाग को उतना ही भेजा है। अंतर की सूचना AIS फ़ीडबैक में दें ताकि उनका रिकॉर्ड आपके रिकॉर्ड से मिल जाए।",
    amendError: "जो रकम दर्ज होनी चाहिए, वह अंक में लिखें।",
    answeredNotMine: "बाहर रखा गया, और इसका कर क्रेडिट भी छोड़ा गया",
    disputeTitle: "जिस प्रविष्टि को आप नहीं पहचानतीं, उसका क्या होता है",
    disputeNote:
      "वह आपके रिटर्न से बाहर रहती है, और उस पर काटा गया कर भी नहीं माँगा जाता। आय दर्ज किए बिना क्रेडिट माँगना ठीक वही बेमेल है जिससे त्रुटिपूर्ण रिटर्न का नोटिस आता है। उस प्रविष्टि की सूचना अलग से AIS फ़ीडबैक में दी जाती है।",
    disputeAction: "बताएँ कि यह प्रविष्टि मेरी नहीं है",
    progress: (answered: number, total: number) =>
      `${total} में से ${answered} प्रविष्टियों का जवाब दिया`,
    runningTotal: "दर्ज की जाने वाली अन्य आय",
    runningTds: "आप जितना कर क्रेडिट माँग सकती हैं",
    error: "आगे बढ़ने से पहले हर प्रविष्टि का जवाब दें।",
  },

  regime: {
    eyebrow: "चरण 4",
    title: "आपकी कर व्यवस्था",
    intro:
      "वेतन रिटर्न में असली फ़ैसला यही एक है, और पोर्टल इसे बिना किसी आँकड़े के सिर्फ़ एक चेकबॉक्स की तरह रखता है। नीचे दोनों व्यवस्थाएँ आपके असली आँकड़ों से जोड़कर दिखाई गई हैं।",
    portalLabel: "आधिकारिक पोर्टल पर यह ऐसे पूछा जाता है",
    portalQuestion:
      "Do you wish to exercise the option u/s 115BAC(6) of opting out of the new tax regime? (default is \u201cNo\u201d)",
    recommendTitle: "आपके आँकड़ों पर",
    recommendNew: "नई व्यवस्था में कम कर लगता है",
    recommendOld: "पुरानी व्यवस्था में कम कर लगता है",
    saving: "आपके पास बचते हैं",
    savingNote: "दूसरी व्यवस्था के मुकाबले",
    newRegime: "नई व्यवस्था",
    oldRegime: "पुरानी व्यवस्था",
    recapTitle: "इसमें आपको कितना देना होगा",
    chooseNew: "नई व्यवस्था में फाइल करें",
    chooseOld: "पुरानी व्यवस्था में फाइल करें",
    chosen: "चुना गया",
    grossTotal: "सकल कुल आय",
    deductionsLabel: "मान्य कटौतियाँ",
    totalIncome: "कुल आय",
    taxBefore: "इस आय पर कर",
    rebate: "धारा 87A छूट",
    cess: "स्वास्थ्य और शिक्षा उपकर",
    totalTax: "कुल कर",
    workingTitle: "कर कैसे निकला",
    workingIntro:
      "आय स्लैब में बँटकर कर लगती है। हर स्लैब में सिर्फ़ उसी हिस्से पर उस स्लैब की दर लगती है, इसीलिए तनख़्वाह बढ़ने से नुकसान कभी नहीं होता।",
    bandRange: "स्लैब",
    bandRate: "दर",
    bandTaxable: "इस स्लैब में कर योग्य",
    bandTax: "कर",
    deductionsTitle: "आप क्या माँग सकती हैं और क्या नहीं",
    newDeductionsNote:
      "नई व्यवस्था लगभग हर कटौती हटा देती है। धारा 80C, 80D, मकान किराया और स्वयं के मकान पर होम लोन ब्याज — सब लागू नहीं होते। बदले में स्लैब चौड़े हैं और मानक कटौती बड़ी है। इसीलिए पोर्टल की कटौतियों की लंबी सूची यहाँ आपके किसी काम की नहीं है।",
    oldDeductionsNote:
      "पुरानी व्यवस्था में जानी-पहचानी कटौतियाँ बनी रहती हैं। यह डेमो धारा 80C, धारा 80D और बचत ब्याज पर धारा 80TTA को काल्पनिक रकम पर, वैधानिक सीमा तक माँगता है।",
    deduction80C: "धारा 80C",
    deduction80D: "धारा 80D",
    deduction80TTA: "बचत ब्याज पर धारा 80TTA",
    rebateNote: (limit: string) =>
      `नई व्यवस्था में ${limit} तक की कुल आय पर कोई कर नहीं लगता, क्योंकि धारा 87A की छूट उसे शून्य कर देती है। इससे ऊपर छूट खत्म हो जाती है और पूरे स्लैब लागू होते हैं।`,
    error: "आगे बढ़ने से पहले कोई व्यवस्था चुनें।",
  },

  checks: {
    eyebrow: "चरण 5",
    title: "फाइल करने से पहले",
    intro:
      "जब रिटर्न विभाग के अपने रिकॉर्ड से नहीं मिलता, तो उसे [[section-139-9|धारा 139(9)]] के तहत त्रुटिपूर्ण घोषित किया जाता है। वह नोटिस आमतौर पर फाइलिंग के महीनों बाद आता है, जब गलती सुधारना महँगा पड़ता है। वही जाँचें यहाँ अभी चलाई गई हैं।",
    idea:
      "आधिकारिक पोर्टल जमा करने से पहले ये जाँचें नहीं चलाता। प्रोटोटाइप का यही हिस्सा हम सबसे ज़्यादा चाहेंगे कि असली सेवा अपनाए।",
    passed: (passed: number, total: number) =>
      `${total} में से ${passed} जाँचें पास`,
    attentionTitle: "आपके ध्यान की ज़रूरत",
    allClearTitle: "आपके रिटर्न में कुछ अटका नहीं है",
    allClear:
      "हर प्रविष्टि का जवाब दिया जा चुका है, आप जो कर क्रेडिट माँग रही हैं वह दर्ज की जा रही आय से मेल खाता है, और व्यवस्था चुनी जा चुकी है।",
    labels: {
      "all-reviewed": "हर पहले से भरी प्रविष्टि का जवाब दिया गया",
      "tds-matches-income":
        "माँगे गए हर कर क्रेडिट की मेल खाती आय दर्ज है",
      "disputed-tds-dropped": "विवादित प्रविष्टि पर कोई क्रेडिट नहीं माँगा गया",
      "regime-chosen": "कर व्यवस्था चुनी जा चुकी है",
    },
    detail: {
      "all-reviewed":
        "पहले से भरी हुई जिस प्रविष्टि का जवाब न दिया गया हो, वही त्रुटिपूर्ण रिटर्न के नोटिस की सबसे आम वजह है।",
      "tds-matches-income":
        "आप जो भी कर क्रेडिट माँगती हैं, उसकी मेल खाती आय उसी रिटर्न में दर्ज होनी चाहिए।",
      "disputed-tds-dropped":
        "जिस प्रविष्टि को आपने स्वीकार नहीं किया, उस पर काटा गया कर कभी नहीं माँगा जाता। आय दर्ज किए बिना क्रेडिट माँगना ठीक वही बेमेल है जिससे त्रुटिपूर्ण रिटर्न का नोटिस आता है, इसलिए आय के साथ क्रेडिट भी छोड़ दिया जाता है। ऐसी किसी प्रविष्टि की सूचना AIS फ़ीडबैक में अलग से दें।",
      "regime-chosen":
        "रिटर्न में यह बताना ज़रूरी है कि वह किस व्यवस्था में भरा गया है, क्योंकि पूरी गणना उसी पर टिकी है।",
    },
    fix: {
      "all-reviewed": "चरण 3 पर लौटकर बची हुई प्रविष्टियों का जवाब दें।",
      "tds-matches-income":
        "हर प्रविष्टि का जवाब आने के बाद यह जाँच चलती है।",
      "disputed-tds-dropped": "",
      "regime-chosen": "चरण 4 पर लौटकर कोई व्यवस्था चुनें।",
    },
    strandedLabel: "जानबूझकर न माँगा गया क्रेडिट",
    goToStep: "इसे ठीक करें",
    continue: "जाँच पर आगे बढ़ें",
  },

  review: {
    eyebrow: "चरण 6",
    title: "जाँचें और फाइल करें",
    intro:
      "सिमुलेटेड रिटर्न में यही सब जाएगा। फाइल करने से पहले जो बदलना हो बदल लें।",
    incomeTitle: "आय",
    salaryLine: "मानक कटौती के बाद वेतन",
    otherLine: "आपकी पुष्टि की गई अन्य आय",
    taxTitle: "कर",
    creditTitle: "पहले जमा किया गया कर",
    refundTitle: "आपको रिफ़ंड मिलना है",
    payableTitle: "आप पर अभी कर बाकी है",
    refundNote:
      "आपके नियोक्ता और बैंक ने आपके अंतिम बिल से ज़्यादा काट लिया।",
    refundAccountLabel: "यह किस खाते में आएगा",
    refundAccountLine: (bank: string, masked: string, kind: string) =>
      `${bank} · ${masked} · ${kind}`,
    refundAccountNote:
      "रिफ़ंड के लिए आपने यही एक खाता चुना है, और विभाग इसी में पैसा भेज सकता है। खाता बदलिए, रिफ़ंड उसी के पीछे चला जाएगा।",
    refundAccountEdit: "खाता बदलें",
    refundNoAccountNote:
      "रिफ़ंड के लिए कोई सत्यापित खाता चुना नहीं गया है, इसलिए असली फाइलिंग में पैसा भेजने की जगह ही नहीं होती। फाइल करने से पहले एक खाता चुन लीजिए।",
    payableNote:
      "असली फाइलिंग में यह रकम जमा करने से पहले चुकानी होती और रिटर्न में चालान का विवरण जाता।",
    editLabel: "बदलें",
    declarationTitle: "घोषणा",
    declaration:
      "मैं पुष्टि करती हूँ कि ऊपर के डेमो आँकड़े वही हैं जो मैं फाइल करना चाहती हूँ, और मैं समझती हूँ कि यह प्रोटोटाइप आयकर विभाग के पास कुछ भी फाइल नहीं करता।",
    declarationError: "फाइल करने से पहले घोषणा पर निशान लगाएँ।",
    submit: "यह डेमो रिटर्न फाइल करें",
    submitting: "फाइल हो रहा है…",
    offlineTitle: "आप ऑफ़लाइन हैं",
    offlineNote:
      "आपके जवाब इस डिवाइस पर सुरक्षित हैं। डेमो फाइलिंग आपके वापस ऑनलाइन आने तक रुकी रहेगी।",
    retry: "फिर से फाइल करने की कोशिश करें",
    stop: "रुकें और ड्राफ़्ट रखें",
    verifyTitle: "सत्यापन",
    verifyNote:
      "यह रिटर्न भर देना आख़िरी काम नहीं है। असली रिटर्न को अलग से, 30 दिनों के भीतर सत्यापित करना पड़ता है, और जब तक ऐसा न हो विभाग उसे भरा हुआ मानता ही नहीं। वह चरण इसके ठीक बाद आता है, और यह डेमो उसकी नकल बिना कोई OTP भेजे करता है।",
  },

  receipt: {
    eyebrow: "डेमो पावती",
    title: "आपका डेमो रिटर्न फाइल हो गया।",
    intro:
      "आयकर विभाग को कुछ नहीं भेजा गया। असली पावती में यही जानकारी होती।",
    ackLabel: "पावती संख्या",
    txnLabel: "लेन-देन संख्या",
    statusLabel: "स्थिति",
    statusValue: "सिमुलेटेड फाइलिंग पूरी, सत्यापित",
    statusUnverified: "सिमुलेटेड फाइलिंग पूरी, सत्यापित नहीं",
    timeLabel: "समय",
    formLabel: "फ़ॉर्म",
    regimeLabel: "कर व्यवस्था",
    regimeNew: "नई",
    regimeOld: "पुरानी",
    totalIncomeLabel: "कुल आय",
    totalTaxLabel: "कुल कर",
    refundLabel: "देय रिफ़ंड",
    payableLabel: "बाकी देय कर",
    versionLabel: "गणना संस्करण",
    nextTitle: "आगे क्या होता",
    next: [
      {
        title: "आप इसे सत्यापित करती हैं, वरना आगे कुछ नहीं होता।",
        body: "नीचे लिखा कुछ भी रिटर्न सत्यापित हुए बिना शुरू नहीं होता। बिना सत्यापन वाला रिटर्न भरा हुआ दिखता ज़रूर है, पर माना ऐसे जाता है जैसे भरा ही न गया हो।",
      },
      {
        title: "विभाग रिटर्न प्रोसेस करके रिफ़ंड की पुष्टि करता है।",
        body: "आम तौर पर कुछ हफ़्ते, और गिनती उस दिन से होती है जिस दिन आपने सत्यापित किया, न कि जिस दिन भरा।",
      },
      {
        title: "आपने जो AIS फ़ीडबैक दिया, वह अलग से देखा जाता है।",
        body: "वह अपनी अलग पटरी पर चलता है और न रिटर्न रोकता है, न रिफ़ंड।",
      },
      {
        title: "रिटर्न 31 दिसंबर 2026 तक संशोधित किया जा सकता है।",
        body: "संशोधित रिटर्न इसी की जगह लेता है और इसकी पावती संख्या का हवाला देता है, इसलिए वह संख्या सँभालकर रखिए।",
      },
    ],
    print: "यह पावती प्रिंट करें",
    download: "टेक्स्ट में डाउनलोड करें",
    restart: "डेमो फिर से शुरू करें",
    warning:
      "काल्पनिक पावती। कोई सरकारी रिकॉर्ड नहीं बना और कोई रिफ़ंड नहीं मिलेगा।",
  },
};

export const journeyCopy: Record<Language, JourneyCopy> = {
  en: journeyEn,
  hi: journeyHi,
};

/* Help text is indexed by step so the help panel always answers the question a
   citizen is actually looking at. */
export const helpByStep: Record<Language, string[]> = {
  en: [
    "This demo files one fictional salaried return from start to finish. Nothing you do here reaches the Income Tax Department, and no real tax is calculated.",
    "The portal makes you choose a form, a reason and an employment type. All three follow from facts already in your Form 16, so they are worked out here and the reasoning is shown.",
    "Every figure comes from the demo Form 16 and is shown beside the row it came from. If a figure looks wrong on a real return, the document is what you check against, not the screen.",
    "The department already holds these entries. Answering each one is what keeps your return in agreement with its records. An entry you do not recognise is left out, and its tax credit is left out with it.",
    "Both regimes are computed from your own figures, with the slab working shown. The new regime has wider slabs and a bigger standard deduction but almost no deductions; the old regime is the reverse.",
    "These are the section 139(9) checks that decide whether a filed return is later marked defective, run before you file instead of months afterwards.",
    "This is the whole return in one place. Anything here can still be changed before you file.",
    "A synthetic acknowledgement. A real one carries the same fields, and a real refund goes to a pre-validated bank account.",
  ],
  hi: [
    "यह डेमो एक काल्पनिक वेतन रिटर्न को शुरू से आखिर तक फाइल करता है। यहाँ किया गया कुछ भी आयकर विभाग तक नहीं जाता, और कोई असली कर गणना नहीं होती।",
    "पोर्टल आपसे फ़ॉर्म, कारण और रोज़गार का प्रकार चुनवाता है। तीनों उन तथ्यों से निकलते हैं जो आपके फ़ॉर्म 16 में पहले से हैं, इसलिए यहाँ वे खुद निकाले गए हैं और कारण भी दिखाया गया है।",
    "हर आँकड़ा डेमो फ़ॉर्म 16 से आया है और उसी पंक्ति के साथ दिखाया गया है जहाँ से आया। असली रिटर्न में कोई आँकड़ा गलत लगे तो दस्तावेज़ से मिलाएँ, स्क्रीन से नहीं।",
    "ये प्रविष्टियाँ विभाग के पास पहले से हैं। हर एक का जवाब देना ही आपके रिटर्न को उसके रिकॉर्ड से मिलाकर रखता है। जिसे आप नहीं पहचानतीं वह बाहर रहती है, और उसका कर क्रेडिट भी उसी के साथ बाहर रहता है।",
    "दोनों व्यवस्थाएँ आपके अपने आँकड़ों से जोड़कर, स्लैब की गणना सहित दिखाई गई हैं। नई व्यवस्था में स्लैब चौड़े और मानक कटौती बड़ी है पर कटौतियाँ लगभग नहीं; पुरानी व्यवस्था में उल्टा है।",
    "ये वही धारा 139(9) जाँचें हैं जो तय करती हैं कि फाइल किया गया रिटर्न बाद में त्रुटिपूर्ण घोषित होगा या नहीं — महीनों बाद के बजाय फाइल करने से पहले चलाई गईं।",
    "पूरा रिटर्न एक जगह। फाइल करने से पहले यहाँ सब कुछ बदला जा सकता है।",
    "काल्पनिक पावती। असली पावती में यही जानकारी होती है, और असली रिफ़ंड पहले से सत्यापित बैंक खाते में जाता है।",
  ],
};
