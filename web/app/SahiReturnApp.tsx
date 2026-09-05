"use client";

import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { copy, helpByStep, journeyCopy } from "./content";
import {
  allIncomeAnswered,
  answeredCount,
  buildFilingWindow,
  buildComparison,
  buildComputation,
  type CheckId,
  checksNeedingAttention,
  claimableTds,
  createDownload,
  defaultDraft,
  defaultPrefs,
  DEMO_ACKNOWLEDGEMENT,
  DEMO_TRANSACTION,
  demoCase,
  demoDocuments,
  disputedEntries,
  DRAFT_KEY,
  FEEDBACK_REFERENCE,
  formatDate,
  formatDateTime,
  formatLongDate,
  formatHour,
  formatPercent,
  formatRupees,
  hasAllDocuments,
  helplines,
  incomeEntries,
  isHelplineOpen,
  type IncomeAnswer,
  MAX_FILE_MB,
  OFFICIAL_AIS_HELP,
  OFFICIAL_DEFECTIVE_FAQ,
  OFFICIAL_FILING_HELP,
  OFFICIAL_HELPLINES,
  OFFICIAL_PORTAL,
  otherIncomeTotal,
  PREFS_KEY,
  type QuickLink,
  quickLinks,
  type Regime,
  runChecks,
  strandedTds,
  SUPPORT_REFERENCE,
  type DocumentKind,
  type DraftState,
  type Language,
  type Prefs,
  type TextScale,
  type Theme,
  validateFile,
} from "./case-data";
import { REBATE_NEW_LIMIT } from "./tax";
import {
  formatBytes,
  isImage,
  type PreparedFile,
  prepareDocument,
} from "./file-tools";
import {
  isScreen,
  maskUserId,
  parseSession,
  SCREEN_KEY,
  SESSION_KEY,
  type Screen,
  type Session,
} from "./auth";
import { decideForm, demoAnswers } from "./eligibility";
import { bankAccounts } from "./personal-section";
import { DEMO_VERIFY_REFERENCE, DEMO_VERIFY_ROUTE } from "./verification";
import { buildContext } from "./assistant";
import { serviceById, type ServiceId } from "./services";
import { Assistant } from "./components/Assistant";
import { Dashboard } from "./components/Dashboard";
import { EligibilityPanel } from "./components/EligibilityPanel";
import { PersonalSection } from "./components/PersonalSection";
import { VerifySection } from "./components/VerifySection";
import { TaxPaidSection } from "./components/TaxPaidSection";
import { LoginScreen } from "./components/LoginScreen";
import { RegisterScreen } from "./components/RegisterScreen";
import { newestFirst, notices } from "./notices";
import { NoticesPage } from "./components/NoticesPage";
import { StepRail } from "./components/StepRail";
import { SearchTrigger } from "./components/SearchTrigger";
import { TermLanguage } from "./components/Term";
import { Hovercard } from "./components/Hovercard";
import { CommandPalette, type Command } from "./components/CommandPalette";
import { DeadlineInline, DeadlineMargin } from "./components/DeadlineMeter";
import { Modal } from "./components/Modal";
import { SettingsMenu } from "./components/SettingsMenu";
import { TrustBanner } from "./components/TrustBanner";
import {
  AlertIcon,
  ArrowIcon,
  CheckIcon,
  ExternalIcon,
  GridIcon,
  HelpIcon,
  SignInIcon,
  SignOutIcon,
  UserPlusIcon,
} from "./components/icons";

/* The three appearances, in the order the command palette hands them out.
   "Match device" is deliberately not in the cycle: it is a standing preference
   a reader sets once in Settings, not a thing to land on halfway through
   pressing a shortcut repeatedly. */
const THEME_CYCLE: Theme[] = ["dark", "light", "paper"];

const nextTheme = (current: Theme): Theme =>
  THEME_CYCLE[(THEME_CYCLE.indexOf(current) + 1) % THEME_CYCLE.length];

/* The account the fixture nominates, used until the citizen picks another. */
const defaultNominatedAccount =
  bankAccounts.find((account) => account.nominated)?.id ?? bankAccounts[0].id;

/* Steps 0 through 7. Step 0 is the start screen and is not numbered in the
   citizen-facing step list, so the visible count is TOTAL_STEPS - 1. */
const TOTAL_STEPS = 8;

const RECEIPT_STEP = 7;

/* How many notices the home page carries before handing over to the archive.
   Four is a glance; the rest is a page. */
const HOME_NOTICES = 4;

const parseDraft = (value: string | null): DraftState | null => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<DraftState>;
    if (typeof parsed.step !== "number") return null;
    return {
      ...defaultDraft,
      ...parsed,
      step: Math.max(0, Math.min(TOTAL_STEPS - 1, parsed.step)),
      /* You cannot be standing further along than you have ever been, so the
         mark is never below the step. That also carries a draft written before
         the mark existed: where it was left is where it has been. */
      reached: Math.min(
        TOTAL_STEPS - 1,
        Math.max(
          0,
          parsed.step,
          typeof parsed.reached === "number" ? parsed.reached : 0,
        ),
      ),
      documents: Array.isArray(parsed.documents)
        ? parsed.documents
        : defaultDraft.documents,
      incomeAnswers:
        parsed.incomeAnswers && typeof parsed.incomeAnswers === "object"
          ? parsed.incomeAnswers
          : {},
      incomeAmounts:
        parsed.incomeAmounts && typeof parsed.incomeAmounts === "object"
          ? parsed.incomeAmounts
          : {},
      eligibilityAnswers:
        parsed.eligibilityAnswers && typeof parsed.eligibilityAnswers === "object"
          ? parsed.eligibilityAnswers
          : {},
      personalDetails:
        parsed.personalDetails && typeof parsed.personalDetails === "object"
          ? parsed.personalDetails
          : {},
    };
  } catch {
    return null;
  }
};

const parsePrefs = (value: string | null): Prefs | null => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<Prefs>;
    return { ...defaultPrefs, ...parsed };
  } catch {
    return null;
  }
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt>{label}</dt>
    <dd>{value}</dd>
  </div>
);

const OutLink = ({
  children,
  href,
  newWindow,
}: {
  children: ReactNode;
  href: string;
  newWindow: string;
}) => (
  <a href={href} rel="noreferrer noopener" target="_blank">
    {children}
    <ExternalIcon />
    <span className="sr-only">{newWindow}</span>
  </a>
);

export function SahiReturnApp() {
  const [draft, setDraft] = useState<DraftState>(defaultDraft);
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [hydrated, setHydrated] = useState(false);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [notice, setNotice] = useState("");
  const [formError, setFormError] = useState("");

  /* An error message that only names the problem leaves the reader to hunt for
     it, and on a long step the offending box is usually off screen. So every
     refusal to continue also points at the thing that is wrong: the page
     scrolls to it, focus lands on it, and it is ringed for a moment so that
     someone who did not watch the scroll happen can still see where they were
     taken. The same mechanism carries a second, friendlier job — sending focus
     into a field the reader has just asked to edit.

     `intent` separates the two. Being stopped is not the same as being helped
     along, and they must not look alike. */
  const [spotlight, setSpotlight] = useState<
    { id: string; intent: "error" | "edit" } | null
  >(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [supportMode, setSupportMode] = useState(false);
  const [supportIssue, setSupportIssue] = useState("");
  const [supportDetails, setSupportDetails] = useState("");
  const [supportReference, setSupportReference] = useState("");
  const [clearOpen, setClearOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [incomeCursor, setIncomeCursor] = useState(0);

  /* Site-level state: which screen, who is signed in, and the two panels that
     sit outside the journey. */
  const [screen, setScreen] = useState<Screen>("home");
  const [session, setSession] = useState<Session | null>(null);
  /* Where the citizen was heading when the sign-in wall stopped them. */
  const [intendedStep, setIntendedStep] = useState<number | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantQuestion, setAssistantQuestion] = useState<string | null>(null);
  /* Bumped on every hand-off so the same question asked twice still lands. */
  const [questionToken, setQuestionToken] = useState(0);
  const [preparing, setPreparing] = useState<DocumentKind | null>(null);
  const [preparedNote, setPreparedNote] = useState<{
    kind: DocumentKind;
    name: string;
    from: string;
    to: string;
    converted: boolean;
    compressed: boolean;
  } | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  /* Carries out whatever the spotlight asked for. Focus lands on the control
     itself where the target is one, and on the block otherwise — a block is
     given `tabIndex={-1}` at its call site so that focus can rest there
     without adding it to the tab order.

     `preventScroll` on the focus call and a separate `scrollIntoView` is
     deliberate: letting focus do the scrolling jumps the element to the edge
     of the viewport, and the reader needs to see what is around it. */
  useEffect(() => {
    if (!spotlight) return;

    const node = document.getElementById(spotlight.id);
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "center",
    });

    const control = node.matches("input, select, textarea, button, a[href]")
      ? node
      : node.querySelector<HTMLElement>("input, select, textarea, button, a[href]");
    const target = control ?? node;
    target.focus({ preventScroll: true });

    /* A figure they are about to replace is selected, so the first keystroke
       overwrites it rather than landing in the middle of the old number. */
    if (
      spotlight.intent === "edit" &&
      target instanceof HTMLInputElement &&
      target.type !== "checkbox" &&
      target.type !== "radio"
    ) {
      target.select();
    }
  }, [spotlight]);

  /* The ring is a class on the target, and it has to come off again or the
     page ends up with an old mark on it. */
  const spotlightClass = (id: string) =>
    spotlight?.id === id
      ? spotlight.intent === "error"
        ? " is-spotlit is-spotlit-error"
        : " is-spotlit"
      : "";

  /* Refuse to continue, and say where. */
  const stopAt = (id: string, message: string) => {
    setFormError(message);
    setSpotlight({ id, intent: "error" });
  };

  const language = draft.language;
  const common = copy[language];

  /* The wizard gives the verdict; the journey files ITR-1 either way, because
     that is the only route this prototype builds. So the form named on the
     return is always ITR-1, and where the wizard disagrees the interface says
     so in words rather than quietly showing two different answers. */
  const decision = decideForm({
    ...demoAnswers,
    ...draft.eligibilityAnswers,
  });
  const decidedForm = demoCase.form;
  const page = journeyCopy[language];
  const comparison = useMemo(() => buildComparison(draft), [draft]);
  const computation = useMemo(() => buildComputation(draft), [draft]);

  /* The account a refund would actually reach: the nominated one, and only if
     the portal has validated it. Nothing else can be paid into, so nothing
     else may be named beside the figure. */
  const refundAccount = useMemo(() => {
    const chosen = draft.nominatedAccount || defaultNominatedAccount;
    const account = bankAccounts.find((entry) => entry.id === chosen);
    return account?.validated ? account : null;
  }, [draft.nominatedAccount]);
  const checks = useMemo(() => runChecks(draft), [draft]);

  /* The late fee depends on total income, so the window is derived after the
     computation rather than alongside it. */
  const filing = useMemo(
    () => buildFilingWindow(new Date(), computation.totalIncome),
    [computation.totalIncome],
  );

  const now = useMemo(() => new Date(), []);

  const money = useCallback(
    (amount: number) => formatRupees(amount, language),
    [language],
  );

  /* ---------------------------------------------------------- lifecycle */

  useEffect(() => {
    /* Restore after paint so the server-rendered start screen is usable first. */
    const restore = window.setTimeout(() => {
      const saved = parseDraft(window.localStorage.getItem(DRAFT_KEY));
      if (saved) {
        setDraft(saved);
        setHasSavedDraft(saved.step > 0 || saved.status !== "draft");
      }
      const savedPrefs = parsePrefs(window.localStorage.getItem(PREFS_KEY));
      if (savedPrefs) setPrefs(savedPrefs);
      const savedSession = parseSession(window.localStorage.getItem(SESSION_KEY));
      if (savedSession) setSession(savedSession);
      const savedScreen = window.localStorage.getItem(SCREEN_KEY);
      /* A signed-out session cannot land back inside the journey or the
         dashboard, however the browser was left. */
      if (isScreen(savedScreen)) {
        setScreen(
          savedSession || (savedScreen !== "journey" && savedScreen !== "dashboard")
            ? savedScreen
            : "home",
        );
      }
      setIsOnline(window.navigator.onLine);
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [draft, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  }, [prefs, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(SCREEN_KEY, screen);
    if (session) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  }, [hydrated, screen, session]);

  useEffect(() => {
    document.documentElement.lang = draft.language;
  }, [draft.language]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.text = prefs.textScale;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      root.dataset.theme =
        prefs.theme === "system"
          ? media.matches
            ? "dark"
            : "light"
          : prefs.theme;
    };
    apply();
    media.addEventListener?.("change", apply);
    return () => media.removeEventListener?.("change", apply);
  }, [prefs.textScale, prefs.theme]);

  useEffect(() => {
    const goOnline = () => {
      setIsOnline(true);
      setNotice(copy[draft.language].online);
    };
    const goOffline = () => {
      setIsOnline(false);
      setNotice(copy[draft.language].offline);
    };
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, [draft.language]);

  useEffect(() => {
    if (!hydrated) return;

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (draft.step > 0) {
      headingRef.current?.focus({ preventScroll: true });
    }
  }, [draft.step, draft.verifiedAt, hydrated, screen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ------------------------------------------------------------ actions */

  const updateDraft = useCallback((next: Partial<DraftState>) => {
    setDraft((current) => ({ ...current, ...next }));
    setFormError("");
    setSpotlight(null);
  }, []);

  /* Moving onto a step, wherever the move came from: the rail, the login the
     rail sent you through, or submitting the return. The mark of how far you
     have been only ever rises. */
  const enterStep = useCallback((step: number) => {
    setDraft((current) => ({
      ...current,
      step,
      reached: Math.max(current.reached, step),
    }));
    setFormError("");
  }, []);

  /* The one door into the return.

     The e-Filing portal will not let anyone start a return without signing in,
     so neither does this. A citizen stopped at the door keeps the step they
     were heading for, and is put back on it the moment they are through, rather
     than being dropped at a dashboard to find their own way again. */
  const goTo = useCallback(
    (step: number) => {
      const safeStep = Math.max(0, Math.min(TOTAL_STEPS - 1, step));

      if (safeStep === 0) {
        setScreen("home");
        updateDraft({ step: 0 });
        return;
      }

      if (!session) {
        setIntendedStep(safeStep);
        setScreen("login");
        return;
      }

      setHasSavedDraft(true);
      setScreen("journey");
      enterStep(safeStep);
    },
    [enterStep, session, updateDraft],
  );

  const signIn = useCallback(
    (next: Session) => {
      setSession(next);
      setNotice(copy[language].loginSuccess(next.name));
      const target = intendedStep;
      setIntendedStep(null);
      if (target != null) {
        setHasSavedDraft(true);
        setScreen("journey");
        enterStep(target);
      } else {
        setScreen("dashboard");
      }
    },
    [enterStep, intendedStep, language],
  );

  const signOut = useCallback(() => {
    setSession(null);
    setIntendedStep(null);
    setScreen("home");
    setAssistantOpen(false);
    setNotice(copy[language].signOutDone);
    updateDraft({ step: 0, reached: 0 });
  }, [language, updateDraft]);

  /* A service tile anywhere in the site lands on the same place. Only the
     salaried return is built; everything else is marked and inert, so this
     only ever has one destination. */
  const openService = useCallback(
    (id: ServiceId) => {
      const service = serviceById(id);
      if (!service || service.state !== "live") return;
      goTo(service.step ?? 1);
    },
    [goTo],
  );

  const askAssistant = useCallback((question: string) => {
    setAssistantQuestion(question);
    setQuestionToken((token) => token + 1);
    setAssistantOpen(true);
  }, []);

  const switchLanguage = (nextLanguage: Language) => {
    /* Notices are short-lived feedback in the language that was active when
       the action happened. Keeping one after a language switch produces a
       mixed-language screen, so clear it rather than showing stale copy. */
    setNotice("");
    updateDraft({ language: nextLanguage });
  };

  const loadDemoDocuments = useCallback(() => {
    updateDraft({ documents: demoDocuments });
    setSpotlight({ id: "salary-confirm", intent: "edit" });
    setNotice(
      language === "hi"
        ? "दोनों डेमो दस्तावेज़ लोड हो गए।"
        : "Both demo documents are loaded.",
    );
  }, [language, updateDraft]);

  /* A phone photo is the normal case, not an error case. Anything that is
     already a document passes through; anything that is a picture is turned
     into a PDF and brought under the limit here, on the device, so nobody has
     to find a converter site and hand it a tax document. */
  const replaceDocument = async (
    event: ChangeEvent<HTMLInputElement>,
    kind: DocumentKind,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const limit = MAX_FILE_MB * 1024 * 1024;
    let prepared: PreparedFile | null = null;

    if (isImage(file)) {
      setPreparing(kind);
      try {
        prepared = await prepareDocument(file, limit);
      } catch {
        setFormError(
          language === "hi"
            ? "यह तस्वीर पढ़ी नहीं जा सकी: कोई और फ़ाइल चुनें।"
            : "This picture could not be read: choose another file.",
        );
        setPreparing(null);
        return;
      }
      setPreparing(null);
    } else {
      const validation = validateFile(file);
      if (validation === "type") {
        setFormError(
          language === "hi"
            ? `फाइल का प्रकार: PDF, JPG या PNG चुनें।`
            : `File type: choose a PDF, JPG or PNG.`,
        );
        return;
      }
      if (validation === "size") {
        setFormError(
          language === "hi"
            ? `फाइल का आकार: ${MAX_FILE_MB} MB से छोटी फाइल चुनें।`
            : `File size: choose a file smaller than ${MAX_FILE_MB} MB.`,
        );
        return;
      }
    }

    if (prepared && prepared.bytes > limit) {
      setFormError(
        language === "hi"
          ? `यह तस्वीर ${MAX_FILE_MB} MB से नीचे नहीं लाई जा सकी। कम रोशनी में ली गई बड़ी तस्वीर दोबारा खींचकर देखें।`
          : `This picture could not be brought under ${MAX_FILE_MB} MB. Try photographing the page again, closer and in better light.`,
      );
      return;
    }

    const finalName = prepared ? prepared.name : file.name;
    const finalBytes = prepared ? prepared.bytes : file.size;

    if (prepared) {
      setPreparedNote({
        kind,
        name: prepared.name,
        from: formatBytes(prepared.originalBytes),
        to: formatBytes(prepared.bytes),
        converted: prepared.converted,
        compressed: prepared.compressed,
      });
    } else {
      setPreparedNote(null);
    }

    updateDraft({
      documents: draft.documents.map((document) =>
        document.kind === kind
          ? {
              ...document,
              name: finalName,
              size: formatBytes(finalBytes),
              source:
                language === "hi"
                  ? "इस ब्राउज़र में चुनी गई काल्पनिक फाइल"
                  : "Synthetic file selected in this browser",
              loaded: true,
            }
          : document,
      ),
    });
  };

  const answerEntry = (id: string, answer: IncomeAnswer) => {
    updateDraft({ incomeAnswers: { ...draft.incomeAnswers, [id]: answer } });
    /* Choosing "yes, but the figure is wrong" turns the figure above into a
       box, several lines up from the radio that did it. Nothing about the
       radio says that happened, so the caret is put in the box and the old
       figure selected: the next thing they type replaces it. */
    if (answer === "amended") {
      setSpotlight({ id: `${id}-amount`, intent: "edit" });
    }
  };

  /* An empty box is not zero income — clearing the field falls back to the
     statement's own figure rather than silently wiping the entry. */
  const amendEntry = (id: string, raw: string) => {
    const next = { ...draft.incomeAmounts };
    const parsed = Number(raw);
    if (raw.trim() === "" || Number.isNaN(parsed) || parsed < 0) delete next[id];
    else next[id] = Math.round(parsed);
    updateDraft({ incomeAmounts: next });
  };

  const continueFromSalary = () => {
    if (!hasAllDocuments(draft.documents)) {
      stopAt(
        "documents-in-use",
        language === "hi"
          ? "दस्तावेज़: आगे बढ़ने से पहले दोनों दस्तावेज़ लोड करें।"
          : "Documents: load both documents before continuing.",
      );
      return;
    }
    if (!draft.salaryConfirmed) {
      stopAt("salary-confirm", page.salary.confirmError);
      return;
    }
    goTo(3);
  };

  const continueFromIncome = () => {
    if (!allIncomeAnswered(draft)) {
      /* Four entries, and usually only one of them is unanswered. Point at
         that one rather than at the list it is somewhere inside. */
      const first = incomeEntries.find(
        (entry) => !draft.incomeAnswers[entry.id],
      );
      const firstIndex = incomeEntries.findIndex(
        (entry) => !draft.incomeAnswers[entry.id],
      );
      if (firstIndex >= 0) setIncomeCursor(firstIndex);
      stopAt(first ? `entry-${first.id}` : "income-entries", page.income.error);
      return;
    }
    goTo(4);
  };

  const continueFromRegime = () => {
    if (!draft.regime) {
      stopAt("regime-choice", page.regime.error);
      return;
    }
    goTo(5);
  };

  const submitReturn = async () => {
    /* Already filed, and they have walked back to the review to look at
       something. The button used to sit here doing nothing at all, which reads
       as a broken page rather than as "there is nothing left to do": send them
       to the acknowledgement they already have instead of filing twice. */
    if (draft.status === "submitted") {
      goTo(RECEIPT_STEP);
      return;
    }
    if (draft.status === "submitting") return;
    if (!draft.declaration) {
      stopAt("review-declare", page.review.declarationError);
      return;
    }
    if (!window.navigator.onLine) {
      updateDraft({ status: "queued" });
      setIsOnline(false);
      return;
    }

    updateDraft({ status: "submitting" });
    await new Promise((resolve) => window.setTimeout(resolve, 900));

    if (!window.navigator.onLine) {
      updateDraft({ status: "queued" });
      setIsOnline(false);
      return;
    }

    const filedAt = new Date();
    updateDraft({
      status: "submitted",
      reference: DEMO_ACKNOWLEDGEMENT,
      submittedAt: formatDateTime(filedAt, language),
      submittedIso: filedAt.toISOString(),
      step: RECEIPT_STEP,
      reached: RECEIPT_STEP,
    });
  };

  /* Verification, simulated. One act, no OTP theatre: the prototype has said
     all along that it sends no OTP, and staging a fake one here would be the
     first place it stopped telling the truth. */
  const verifyReturn = () => {
    if (draft.verifiedAt) return;
    const at = new Date();
    updateDraft({
      verifiedAt: formatDateTime(at, language),
      verifiedIso: at.toISOString(),
      verificationRoute: DEMO_VERIFY_ROUTE,
    });
  };

  const saveTextFile = (name: string, body: string) => {
    const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = name;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const downloadReceipt = () =>
    saveTextFile(
      `${draft.reference ?? "sahi-return-demo"}.txt`,
      createDownload(draft, language, computation),
    );

  const downloadSummary = () =>
    saveTextFile(
      "demo-return-summary.txt",
      createDownload(draft, language, computation),
    );

  const clearDraft = () => {
    window.localStorage.removeItem(DRAFT_KEY);
    setDraft({ ...defaultDraft, language, lowData: draft.lowData });
    setHasSavedDraft(false);
    setClearOpen(false);
    setSupportReference("");
    setNotice(
      language === "hi"
        ? "काल्पनिक ड्राफ्ट मिटा दिया गया।"
        : "Synthetic draft cleared.",
    );
  };

  const resetDemo = () => {
    window.localStorage.removeItem(DRAFT_KEY);
    setDraft({ ...defaultDraft, language, lowData: draft.lowData });
    setHasSavedDraft(false);
    setFormError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const createSupportRequest = (event: FormEvent) => {
    event.preventDefault();
    if (!supportIssue || supportDetails.trim().length < 10) return;
    setSupportReference(SUPPORT_REFERENCE);
  };

  const openHelp = useCallback(() => {
    setSupportMode(false);
    setSupportReference("");
    setHelpOpen(true);
  }, []);

  const openSupport = useCallback(() => {
    setSupportReference("");
    setSupportMode(true);
    setHelpOpen(true);
  }, []);

  const raiseFeedback = () => {
    updateDraft({ feedbackReference: FEEDBACK_REFERENCE });
  };

  /* ----------------------------------------------------------- commands */

  const commands = useMemo<Command[]>(() => {
    const stepCommands: Command[] = [];
    const add = (
      id: string,
      title: string,
      subtitle: string,
      run: () => void,
      keywords = "",
    ) =>
      stepCommands.push({
        id,
        group: common.commandGroupStep,
        title,
        subtitle,
        keywords,
        run,
      });

    if (draft.step === 0) {
      add("start", page.home.start, common.steps[1], () => goTo(1), "begin shuru");
    }
    if (draft.step === 1) {
      add("to-salary", page.check.continue, common.steps[2], () => goTo(2), "salary form16");
    }
    if (draft.step === 2) {
      add("load", page.salary.load, common.steps[2], loadDemoDocuments, "upload file document");
      add("to-income", common.continue, common.steps[3], continueFromSalary, "income ais");
    }
    if (draft.step === 3) {
      add("to-regime", common.continue, common.steps[4], continueFromIncome, "regime tax");
    }
    if (draft.step === 4) {
      add("pick-new", page.regime.chooseNew, page.regime.newRegime, () => updateDraft({ regime: "new" }), "new regime");
      add("pick-old", page.regime.chooseOld, page.regime.oldRegime, () => updateDraft({ regime: "old" }), "old regime");
      add("to-checks", common.continue, common.steps[5], continueFromRegime, "checks");
    }
    if (draft.step === 5) {
      add("to-review", page.checks.continue, common.steps[6], () => goTo(6), "review");
    }
    if (draft.step === 6) {
      add("submit", page.review.submit, common.steps[7], submitReturn, "file send");
    }
    if (draft.step === RECEIPT_STEP) {
      add("print", page.receipt.print, common.steps[7], () => window.print(), "print");
      add("save", page.receipt.download, common.steps[7], downloadReceipt, "download");
      add("again", page.receipt.restart, common.steps[0], resetDemo, "restart");
    }
    if (draft.step > 0 && draft.step < RECEIPT_STEP) {
      add(
        "feedback",
        common.extensionAction,
        common.extensionTitle,
        () => setFeedbackOpen(true),
        "ais feedback wrong entry",
      );
    }

    /* Not a step action, so not in the step group: the archive is a place. */
    const pageCommands: Command[] = [
      {
        id: "notices",
        group: common.commandGroupPages,
        title: common.noticesTitle,
        subtitle: common.noticesSeeAll,
        keywords: "notices announcements suchna updates archive",
        run: () => setScreen("notices"),
      },
    ];

    const goCommands: Command[] = common.steps
      .slice(0, Math.max(1, draft.step + 1))
      .map((label, index) => ({
        id: `go-${index}`,
        group: common.commandGroupGo,
        title: label,
        subtitle: common.stepOf(index, TOTAL_STEPS - 1),
        run: () => goTo(index),
      }));

    const themeNames: Record<Theme, string> = {
      dark: common.settingsDark,
      light: common.settingsLight,
      paper: common.settingsPaper,
      system: common.settingsSystem,
    };

    const settingsCommands: Command[] = [
      {
        id: "lang",
        group: common.commandGroupSettings,
        title: language === "en" ? "हिन्दी में देखें" : "View in English",
        subtitle: common.settingsLanguage,
        keywords: "language bhasha hindi english",
        run: () => switchLanguage(language === "en" ? "hi" : "en"),
      },
      {
        id: "theme",
        group: common.commandGroupSettings,
        /* Three appearances cycle rather than toggle, and the command names
           the one it is about to give you rather than the one you are on. */
        title: themeNames[nextTheme(prefs.theme)],
        subtitle: common.settingsAppearance,
        keywords: "dark light paper theme night appearance",
        run: () =>
          setPrefs((current) => ({ ...current, theme: nextTheme(current.theme) })),
      },
      {
        id: "text",
        group: common.commandGroupSettings,
        title: common.settingsTextLarge,
        subtitle: common.settingsTextSize,
        keywords: "zoom bigger text size",
        run: () =>
          setPrefs((current) => ({
            ...current,
            textScale: current.textScale === "larger" ? "base" : "larger",
          })),
      },
      {
        id: "data",
        group: common.commandGroupSettings,
        title: common.settingsData,
        subtitle: common.settingsDataHint,
        keywords: "data lite slow network",
        run: () => updateDraft({ lowData: !draft.lowData }),
      },
      {
        id: "clear",
        group: common.commandGroupSettings,
        title: common.clearData,
        subtitle: common.clearExplanation,
        keywords: "delete clear shared device",
        run: () => setClearOpen(true),
      },
    ];

    const helpCommands: Command[] = [
      {
        id: "help",
        group: common.commandGroupHelp,
        title: common.help,
        subtitle: helpByStep[language][draft.step],
        keywords: "help madad",
        run: openHelp,
      },
      {
        id: "support",
        group: common.commandGroupHelp,
        title: common.support,
        subtitle: common.supportOwnerValue,
        keywords: "person human support ticket",
        run: openSupport,
      },
      {
        id: "guide",
        group: common.commandGroupHelp,
        title: common.officialSource,
        subtitle: common.reviewed,
        keywords: "official itr1 guide",
        run: () => window.open(OFFICIAL_FILING_HELP, "_blank", "noopener"),
      },
      {
        id: "ais",
        group: common.commandGroupHelp,
        title: common.officialManual,
        subtitle: common.reviewed,
        keywords: "ais annual information statement",
        run: () => window.open(OFFICIAL_AIS_HELP, "_blank", "noopener"),
      },
      {
        id: "portal",
        group: common.commandGroupHelp,
        title: common.officialPortalLink,
        subtitle: OFFICIAL_PORTAL,
        keywords: "portal incometax gov",
        run: () => window.open(OFFICIAL_PORTAL, "_blank", "noopener"),
      },
    ];

    return [
      ...stepCommands,
      ...goCommands,
      ...pageCommands,
      ...settingsCommands,
      ...helpCommands,
    ];
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [common, draft, language, page, prefs.theme]);

  /* ------------------------------------------------------------ renders */

  /* The one thing a citizen must not discover late. It leads the start screen
     whenever the date has actually passed, and disappears when it has not. */
  const renderDeadlineAlert = () => {
    if (filing.state === "on-time") return null;
    return (
      <div className="alarm" role="status">
        <p className="alarm-head">
          <AlertIcon />
          {filing.state === "closed"
            ? common.deadlineClosedLabel
            : common.deadlinePassedLabel}
        </p>
        {filing.state === "closed" ? (
          <p>{common.deadlineClosed(formatDate(filing.belated, language))}</p>
        ) : (
          <>
            <p className="alarm-lede">
              {common.deadlinePassed(formatDate(filing.due, language))}
            </p>
            <p className="alarm-count">
              <strong>{filing.daysLeft}</strong> {common.daysLeftBelated}
            </p>
            <details className="alarm-more">
              <summary>{common.deadlineCostLabel}</summary>
              <p>{common.deadlineFee(money(filing.lateFee))}</p>
              <p>
                {common.deadlineBelatedBy(
                  formatDate(filing.belated, language),
                )}
              </p>
            </details>
          </>
        )}
      </div>
    );
  };

  const renderQuickLinks = () => {
    const groups: Array<QuickLink["group"]> = [
      "before",
      "after",
      "problem",
      "pay",
    ];
    return (
      <section className="section">
        <h2>{common.homeLinksTitle}</h2>
        <p className="prose">{common.homeLinksIntro}</p>
        <div className="link-groups">
          {groups.map((group) => (
            <div key={group}>
              <p className="label">{common.homeGroups[group]}</p>
              <ul className="link-list">
                {quickLinks
                  .filter((link) => link.group === group)
                  .map((link) => (
                    <li key={link.id}>
                      {link.kind === "in-demo" ? (
                        <button
                          className="link-tile"
                          onClick={() => goTo(link.step ?? 1)}
                          type="button"
                        >
                          <span>{common.homeLinkNames[link.id]}</span>
                          <span className="tile-kind is-demo">
                            {common.homeInDemo}
                          </span>
                        </button>
                      ) : (
                        <a
                          className="link-tile"
                          href={link.href}
                          rel="noreferrer noopener"
                          target="_blank"
                        >
                          <span>
                            {common.homeLinkNames[link.id]}
                            <ExternalIcon />
                            <span className="sr-only">{common.newWindow}</span>
                          </span>
                          <span className="tile-kind">
                            {common.homeOfficial}
                          </span>
                        </a>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderHelplines = () => (
    <section className="section">
      <h2>{common.homeHelpTitle}</h2>
      <p className="prose">{common.homeHelpIntro}</p>
      <ul className="help-list">
        {helplines.map((line) => {
          const open = isHelplineOpen(line, now);
          return (
            <li key={line.id}>
              <p className="help-for">{common.homeHelpNames[line.id]}</p>
              {line.numbers.map((number) => (
                <a
                  className="helpline"
                  href={`tel:${number.replace(/[\s+]/g, "")}`}
                  key={number}
                >
                  {number}
                </a>
              ))}
              <p className="help-hours">
                <span className={open ? "pill is-open" : "pill"}>
                  {open ? common.homeOpenNow : common.homeClosedNow}
                </span>
                {common.homeHours(
                  formatHour(line.openHour, language),
                  formatHour(line.closeHour, language),
                )}
                {" · "}
                {line.days.length === 7 ? common.homeDaysAll : common.homeDaysWeek}
              </p>
            </li>
          );
        })}
      </ul>
      <p className="consequence">{common.homeHelpNote}</p>
    </section>
  );

  const renderHome = () => {
    const homeText =
      language === "hi"
        ? {
            eyebrow: "वेतनभोगी रिटर्न का निर्देशित डेमो",
            title: "सवालों के जवाब दें। रिटर्न हम तैयार करेंगे।",
            intro:
              "आपको फॉर्म, धारा या कर व्यवस्था जानने की जरूरत नहीं। हम सिर्फ़ वही पूछेंगे जो आप बता सकते हैं।",
            cardTitle: "काल्पनिक वेतनभोगी रिटर्न आज़माएँ",
            person: "अनन्या राव",
            time: "लगभग 5 मिनट",
            data: "कोई असली डेटा नहीं",
            start: "निर्देशित डेमो शुरू करें",
            flow: ["विवरण की पुष्टि", "आय पहचानें", "कम कर चुनें", "जाँचकर फाइल करें"],
            more: "अन्य कर सेवाएँ, नोटिस और मदद देखें",
          }
        : {
            eyebrow: "Guided salaried return demo",
            title: "Answer simple questions. We will build the return.",
            intro:
              "You do not need to know forms, sections, or tax regimes. We only ask what you can answer.",
            cardTitle: "Try a fictional salaried return",
            person: "Ananya Rao",
            time: "About 5 minutes",
            data: "No real data",
            start: "Start the guided demo",
            flow: ["Confirm details", "Recognise income", "Pick the lower tax", "Check and file"],
            more: "Other tax tasks, notices, and help",
          };

    return (
      <div className="guided-home">
        <div className="guided-hero">
          <p className="guided-kicker">{homeText.eyebrow}</p>
          <h1 ref={headingRef} tabIndex={-1}>{homeText.title}</h1>
          <p className="lede">{homeText.intro}</p>
        </div>

        <section className="guided-start-card" aria-labelledby="guided-start-title">
          <div>
            <p className="label">{common.homeStartTitle}</p>
            <h2 id="guided-start-title">{homeText.cardTitle}</h2>
          </div>
          <div className="guided-start-meta">
            <div><span className="label">{language === "hi" ? "डेमो व्यक्ति" : "Demo person"}</span><strong>{homeText.person}</strong></div>
            <div><span className="label">{language === "hi" ? "समय" : "Time"}</span><strong>{homeText.time}</strong></div>
            <div><span className="label">{language === "hi" ? "गोपनीयता" : "Privacy"}</span><strong>{homeText.data}</strong></div>
          </div>
          <div className="guided-card-actions no-print">
            <button className="btn btn-lg" onClick={() => goTo(1)} type="button">
              {homeText.start}
            </button>
            {hasSavedDraft && (
              <>
                <button className="btn btn-secondary" onClick={() => goTo(Math.max(1, draft.step))} type="button">
                  {common.continueDraft}
                </button>
                <button className="link-btn" onClick={resetDemo} type="button">{common.startAgain}</button>
              </>
            )}
          </div>
          {filing.state !== "on-time" && (
            <p className="home-deadline no-print"><DeadlineInline common={common} window={filing} /></p>
          )}
        </section>

        <ol className="guided-flow" aria-label={language === "hi" ? "डेमो के चार भाग" : "Four parts of the demo"}>
          {homeText.flow.map((item) => <li key={item}>{item}</li>)}
        </ol>

        <details className="guided-more">
          <summary>{homeText.more}</summary>
          <div className="guided-more-body">
            {renderDeadlineAlert()}
            {renderQuickLinks()}
            <section className="section">
              <h2>{common.homeAnnouncementsTitle}</h2>
              <ul className="notice-list">
                {newestFirst(notices[language]).slice(0, HOME_NOTICES).map((item) => (
                  <li key={item.id}>
                    <p className="notice-meta">
                      <span className={item.affectsYou ? "pill is-alert" : "pill is-quiet"}>
                        {item.affectsYou ? common.homeAffectsYou : common.homeGeneral}
                      </span>
                      <span className="notice-date">{formatLongDate(new Date(`${item.on}T00:00:00+05:30`), language)}</span>
                    </p>
                    <p>{item.title}</p>
                  </li>
                ))}
              </ul>
              <button className="link-btn" onClick={() => setScreen("notices")} type="button">
                {common.noticesSeeAll}<ArrowIcon />
              </button>
            </section>
            {renderHelplines()}
          </div>
        </details>
      </div>
    );
  };

  const renderCheck = () => (
    <>
      <div className="guided-head">
        <p className="guided-kicker">{page.check.eyebrow}</p>
        <h1 ref={headingRef} tabIndex={-1}>
          {language === "hi" ? "क्या ये बातें आप पर लागू होती हैं?" : "Does this sound like you?"}
        </h1>
        <p className="lede">
          {language === "hi"
            ? "हमने विभाग के काल्पनिक रिकॉर्ड से ये बातें पहले ही पता कर ली हैं।"
            : "We worked these out from the fictional records already on file."}
        </p>
      </div>

      <section className="guided-panel">
        <h2>{language === "hi" ? "आपकी स्थिति" : "Your situation"}</h2>
        <div className="guided-fact-grid">
          <div className="guided-fact"><span>{language === "hi" ? "काम" : "Work"}</span><strong>{language === "hi" ? "निजी नौकरी" : "Private salaried job"}</strong></div>
          <div className="guided-fact"><span>{language === "hi" ? "आय" : "Income"}</span><strong>{language === "hi" ? "₹50 लाख से कम" : "Under ₹50 lakh"}</strong></div>
          <div className="guided-fact"><span>{language === "hi" ? "अन्य आय" : "Other income"}</span><strong>{language === "hi" ? "बैंक ब्याज और लाभांश" : "Bank interest and dividends"}</strong></div>
          <div className="guided-fact"><span>{language === "hi" ? "शेयर या व्यापार" : "Shares or business"}</span><strong>{language === "hi" ? "कोई नहीं" : "None"}</strong></div>
        </div>
        <p className="guided-income-status">
          <span>{language === "hi" ? "हमने आपके लिए चुना" : "Chosen for you"}</span>
          <strong>{decidedForm}</strong>
        </p>
        {!decision.eligible && <p className="alert" role="alert">{common.eligOutOfScope(decision.form)}</p>}
      </section>

      {formError && <ErrorSummary message={formError} />}

      <StepActions
        back={() => goTo(0)}
        backLabel={common.back}
        next={() => goTo(2)}
        nextLabel={page.check.continue}
      />

      <details className="guided-details">
        <summary>{language === "hi" ? "कुछ गलत है? जवाब बदलें" : "Something is wrong? Change the answers"}</summary>
        <div className="guided-details-body">
          <EligibilityPanel
            answers={{ ...demoAnswers, ...draft.eligibilityAnswers }}
            labels={{ causesLabel: common.eligCausesLabel, changedFrom: common.eligChangedFrom, changedLabel: common.eligChangedLabel, disclaimer: common.eligDisclaimer, intro: common.eligIntro, decidedLabel: common.eligDecidedLabel, officialSummary: common.eligOfficialSummary, outOfScope: common.eligOutOfScope, outcomeBlocked: common.eligOutcomeBlocked, outcomeLabel: common.eligOutcomeLabel, outcomeSettled: common.eligOutcomeSettled, prototypeNote: common.eligPrototypeNote, sectionCount: common.eligSectionCount, stateBlocking: common.eligStateBlocking, stateChanged: common.eligStateChanged, stateSettled: common.eligStateSettled, summary: common.eligSummary, title: common.eligTitle, whyLabel: common.eligWhyLabel }}
            language={language}
            onChange={(questionId, value) => updateDraft({ eligibilityAnswers: { ...draft.eligibilityAnswers, [questionId]: value } })}
          />
        </div>
      </details>

      <details className="guided-details">
        <summary>{language === "hi" ? "नाम, संपर्क और रिफ़ंड खाता देखें" : "Review name, contact, and refund account"}</summary>
        <div className="guided-details-body">
          <PersonalSection
            labels={{ accountNumberLabel: common.persAccountNumberLabel, accountTypeLabel: common.persAccountTypeLabel, addAnotherNote: common.persAddAnotherNote, answerLabel: common.persAnswerLabel, appliesLabel: common.persAppliesLabel, filingIntro: common.persFilingIntro, filingReason: common.persFilingReason, filingTitle: common.persFilingTitle, ifscLabel: common.persIfscLabel, noticeNote: common.persNoticeNote, noticeOptionsSummary: common.persNoticeOptionsSummary, noticeStateLabel: common.persNoticeStateLabel, officialLabel: common.persOfficialLabel, otherOptionsLabel: common.persOtherOptionsLabel, otherOptionsNote: common.persOtherOptionsNote, portalAsksLabel: common.persPortalAsksLabel, profileTitle: common.persProfileTitle, profileIntro: common.persProfileIntro, contactTitle: common.persContactTitle, contactIntro: common.persContactIntro, portalCallsLabel: common.persPortalCallsLabel, separateFlowNote: common.persSeparateFlowNote, mandatoryNote: common.persMandatoryNote, editLabel: common.persEditLabel, saveLabel: common.persSaveLabel, cancelLabel: common.persCancelLabel, undoLabel: common.persUndoLabel, changedBadge: common.persChangedBadge, lockedBadge: common.persLockedBadge, emptyValue: common.persEmptyValue, refundLegend: common.persRefundLegend, representativeTitle: common.persRepresentativeTitle, rulesLabel: common.persRulesLabel, whenLabel: common.persWhenLabel }}
            details={draft.personalDetails}
            language={language}
            nominatedId={draft.nominatedAccount || defaultNominatedAccount}
            onDetails={(next) => updateDraft({ personalDetails: next })}
            onNominate={(accountId) => updateDraft({ nominatedAccount: accountId })}
            today={now}
          />
        </div>
      </details>

    </>
  );

  const renderSalary = () => (
    <>
      <div className="guided-head">
        <p className="guided-kicker">{page.salary.eyebrow}</p>
        <h1 ref={headingRef} tabIndex={-1}>
          {language === "hi" ? "अपने वेतन के कागज़ जोड़ें" : "Add your salary documents"}
        </h1>
        <p className="lede">
          {language === "hi"
            ? "डेमो कागज़ लोड करें। फिर काल्पनिक रकम की पुष्टि करें।"
            : "Load the demo documents, then confirm the fictional amounts."}
        </p>
      </div>

      <section
        className={`guided-panel${spotlightClass("documents-in-use")}`}
        id="documents-in-use"
        tabIndex={-1}
      >
        <h2>{language === "hi" ? "दो कागज़ चाहिए" : "Two documents"}</h2>
        <p className="consequence">
          {language === "hi" ? `PDF या फोटो, हर फ़ाइल ${MAX_FILE_MB} MB तक। इस डेमो में असली कागज़ न डालें।` : `PDF or photo, up to ${MAX_FILE_MB} MB each. Do not add real documents to this demo.`}
        </p>

        <ul className="files">
          {draft.documents.map((document) => (
            <li key={document.kind}>
              <div>
                <span className="file-name">
                  {page.salary.kinds[document.kind]}
                </span>
                <span className="file-meta">
                  {document.loaded
                    ? `${document.name} · ${document.size} · ${document.source}`
                    : document.source}
                  <span className="file-state">
                    {document.loaded ? (
                      <span className="label-ok">{page.salary.loaded}</span>
                    ) : (
                      <span className="label-alert">
                        {page.salary.notLoaded}
                      </span>
                    )}
                  </span>
                </span>
              </div>
              <label className="file-pick">
                {preparing === document.kind
                  ? page.salary.preparing
                  : page.salary.replace}
                <span className="sr-only">
                  {" "}
                  {page.salary.kinds[document.kind]}, {page.salary.replaceHint}
                </span>
                <input
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.json,.txt"
                  disabled={preparing !== null}
                  onChange={(event) => replaceDocument(event, document.kind)}
                  type="file"
                />
              </label>

              {preparedNote?.kind === document.kind && (
                <p className="file-done" role="status">
                  <CheckIcon />
                  <span>
                    {preparedNote.converted
                      ? page.salary.convertedNote(
                          preparedNote.name,
                          preparedNote.from,
                          preparedNote.to,
                        )
                      : page.salary.compressedNote(
                          preparedNote.from,
                          preparedNote.to,
                        )}
                  </span>
                </p>
              )}
            </li>
          ))}
        </ul>
        {!hasAllDocuments(draft.documents) && (
          <div className="load-row no-print">
            <button
              className="btn btn-secondary"
              onClick={loadDemoDocuments}
              type="button"
            >
              {language === "hi" ? "काल्पनिक कागज़ इस्तेमाल करें" : "Use fictional demo documents"}
            </button>
          </div>
        )}
      </section>

      {hasAllDocuments(draft.documents) && (
        <section className="guided-panel">
          <h2>{language === "hi" ? "हमें यह मिला" : "Here is what we found"}</h2>
          <div className="guided-money-grid">
            <div className="guided-money"><span>{language === "hi" ? "कुल वेतन" : "Salary"}</span><strong>{money(demoCase.grossSalary)}</strong></div>
            <div className="guided-money"><span>{language === "hi" ? "नियोक्ता ने पहले ही कर दिया" : "Tax already paid by employer"}</span><strong>{money(demoCase.salaryTds)}</strong></div>
          </div>
          <label className={`guided-answer${spotlightClass("salary-confirm")}`} id="salary-confirm">
            <input checked={draft.salaryConfirmed} onChange={(event) => updateDraft({ salaryConfirmed: event.target.checked })} type="checkbox" />
            <span>{page.salary.confirm}</span>
          </label>
        </section>
      )}

      {formError && <ErrorSummary message={formError} />}

      <StepActions
        back={() => goTo(1)}
        backLabel={common.back}
        next={continueFromSalary}
        nextLabel={common.continue}
      />

      {hasAllDocuments(draft.documents) && (
        <details className="guided-details">
          <summary>{language === "hi" ? "रकम कहाँ से आई और पोर्टल उसे क्या कहता है" : "Where these amounts came from"}</summary>
          <div className="guided-details-body">
            <table className="ledger-table">
              <tbody>
                <tr><th scope="row">{page.salary.grossSalary}<span className="source-line">{common.source}: {page.salary.grossSalarySource}</span><span className="portal-line">{page.salary.portalLabel} <code>{page.salary.grossSalaryPortal}</code></span></th><td className="col-num">{money(demoCase.grossSalary)}</td></tr>
                <tr><th scope="row">{page.salary.standardDeduction}<span className="source-line">{common.source}: {page.salary.standardDeductionSource}</span><span className="portal-line">{page.salary.portalLabel} <code>{page.salary.standardDeductionPortal}</code></span></th><td className="col-num">−{money(computation.standardDeduction)}</td></tr>
                <tr><th scope="row">{page.salary.salaryTds}<span className="source-line">{common.source}: {page.salary.salaryTdsSource}</span><span className="portal-line">{page.salary.portalLabel} <code>{page.salary.salaryTdsPortal}</code></span></th><td className="col-num">{money(demoCase.salaryTds)}</td></tr>
              </tbody>
            </table>
          </div>
        </details>
      )}

    </>
  );

  const renderIncome = () => {
    const answered = answeredCount(draft);
    return (
      <>
        <div className="guided-head">
          <p className="guided-kicker">{page.income.eyebrow}</p>
          <h1 ref={headingRef} tabIndex={-1}>
            {language === "hi" ? "क्या आप इन पैसों को पहचानते हैं?" : "Do you recognise this income?"}
          </h1>
          <p className="lede">
            {language === "hi" ? "हर लाइन पर बस हाँ, रकम गलत है, या नहीं चुनें।" : "For each payment, choose yes, wrong amount, or not mine."}
          </p>
        </div>

        <section id="income-entries">
          <p className="guided-income-status" aria-live="polite">
            <span>{language === "hi" ? `सवाल ${incomeCursor + 1}, कुल ${incomeEntries.length}` : `Question ${incomeCursor + 1} of ${incomeEntries.length}`}</span>
            <strong>{page.income.progress(answered, incomeEntries.length)}</strong>
          </p>
          <p className="portal-line">
            {page.income.portalLabel} <code>{page.income.portalSection}</code>,{" "}
            <code>{page.income.portalTds}</code>
          </p>

          {[incomeEntries[incomeCursor]].map((entry) => {
            const answer = draft.incomeAnswers[entry.id] ?? null;
            /* The block, which an error points at, and the label the radio
               group is named by. Two ids, because they are two elements. */
            const groupId = `entry-${entry.id}`;
            const choicesLabelId = `${groupId}-choices`;
            return (
              <fieldset
                className={`finding guided-income-card${spotlightClass(groupId)}`}
                id={groupId}
                key={entry.id}
              >
                <legend className="subhead">
                  {page.income.kinds[entry.kind]} — {entry.payer}
                </legend>

                {/* Three facts, one band. Stacked as table rows they cost two
                    hundred pixels an entry and made four entries a page you
                    had to scroll rather than compare; side by side the columns
                    line up down the whole step, so the figures can be read
                    against each other as well as against the statement.

                    Saying the figure is wrong makes the figure editable where
                    it is stated. It used to open a labelled field at the foot
                    of the entry, which asked the citizen to read a second
                    explanation of a number they were looking at, and to
                    correct it somewhere other than where it was wrong. */}
                <dl className="entry-facts">
                  <div
                    className={
                      answer === "amended"
                        ? "entry-fact is-lead is-amended"
                        : "entry-fact is-lead"
                    }
                  >
                    <dt className="label">
                      {answer === "amended" ? (
                        <label htmlFor={`${entry.id}-amount`}>
                          {page.income.amount}
                        </label>
                      ) : (
                        page.income.amount
                      )}
                    </dt>
                    <dd>
                      {answer === "amended" ? (
                        <span className="amend-cell">
                          <span aria-hidden="true" className="amend-unit">
                            ₹
                          </span>
                          <input
                            className={`amend-input${spotlightClass(`${entry.id}-amount`)}`}
                            id={`${entry.id}-amount`}
                            inputMode="numeric"
                            min={0}
                            onChange={(event) =>
                              amendEntry(entry.id, event.target.value)
                            }
                            step={1}
                            type="number"
                            value={draft.incomeAmounts[entry.id] ?? entry.amount}
                          />
                        </span>
                      ) : (
                        money(entry.amount)
                      )}
                    </dd>
                  </div>
                  <div className="entry-fact">
                    <dt className="label">{page.income.tds}</dt>
                    <dd>{entry.tds > 0 ? money(entry.tds) : page.income.noTds}</dd>
                  </div>
                  <div className="entry-fact">
                    <dt className="label">{page.income.tan}</dt>
                    <dd>{entry.payerTan}</dd>
                  </div>
                </dl>
                <p className="source-line">
                  {common.source}: {entry.sourceRow}
                  {answer === "amended" && (
                    <span className="amend-was">
                      {page.income.amendReported(money(entry.amount))}
                    </span>
                  )}
                </p>

                <div
                  className="choices guided-choice-grid"
                  role="group"
                  aria-labelledby={choicesLabelId}
                >
                  <p className="label" id={choicesLabelId}>
                    {page.income.question}
                  </p>
                  <label
                    aria-label={page.income.mine}
                    className="choice guided-choice"
                    htmlFor={`${entry.id}-mine`}
                  >
                    <input
                      checked={answer === "mine"}
                      id={`${entry.id}-mine`}
                      name={entry.id}
                      onChange={() => answerEntry(entry.id, "mine")}
                      type="radio"
                    />
                    <span>
                      <span className="choice-title">{page.income.mine}</span>
                      <span className="choice-help">
                        {page.income.answeredMine}
                      </span>
                    </span>
                  </label>
                  <label
                    aria-label={page.income.amended}
                    className="choice guided-choice"
                    htmlFor={`${entry.id}-amended`}
                  >
                    <input
                      checked={answer === "amended"}
                      id={`${entry.id}-amended`}
                      name={entry.id}
                      onChange={() => answerEntry(entry.id, "amended")}
                      type="radio"
                    />
                    <span>
                      <span className="choice-title">
                        {page.income.amended}
                      </span>
                      <span className="choice-help">
                        {page.income.answeredAmended}
                      </span>
                    </span>
                  </label>
                  <label
                    aria-label={page.income.notMine}
                    className="choice guided-choice"
                    htmlFor={`${entry.id}-not-mine`}
                  >
                    <input
                      checked={answer === "not-mine"}
                      id={`${entry.id}-not-mine`}
                      name={entry.id}
                      onChange={() => answerEntry(entry.id, "not-mine")}
                      type="radio"
                    />
                    <span>
                      <span className="choice-title">{page.income.notMine}</span>
                      <span className="choice-help">
                        {page.income.answeredNotMine}
                      </span>
                    </span>
                  </label>
                </div>

                {answer === "amended" && (
                  <div className="amend">
                    <p className="finding-note">{page.income.amendNote}</p>
                    <button
                      className="link-btn no-print"
                      onClick={() => setFeedbackOpen(true)}
                      type="button"
                    >
                      {page.income.disputeAction}
                    </button>
                  </div>
                )}

                {answer === "not-mine" && (
                  <div className="caution">
                    <p className="subhead">{page.income.disputeTitle}</p>
                    <p className="finding-note">{page.income.disputeNote}</p>
                    <button
                      className="link-btn no-print"
                      onClick={() => setFeedbackOpen(true)}
                      type="button"
                    >
                      {page.income.disputeAction}
                    </button>
                  </div>
                )}
              </fieldset>
            );
          })}
          <div className="guided-card-actions income-nav no-print">
            {incomeCursor > 0 && <button className="link-btn" onClick={() => setIncomeCursor((current) => current - 1)} type="button">{language === "hi" ? "पिछली आय" : "Previous income"}</button>}
            {incomeCursor < incomeEntries.length - 1 && <button className="btn btn-secondary" disabled={!draft.incomeAnswers[incomeEntries[incomeCursor].id]} onClick={() => setIncomeCursor((current) => current + 1)} type="button">{language === "hi" ? "अगली आय" : "Next income"}</button>}
          </div>
        </section>

        {formError && <ErrorSummary message={formError} />}

        <StepActions
          back={() => goTo(2)}
          backLabel={common.back}
          next={continueFromIncome}
          nextLabel={common.continue}
        />

        <section className="guided-panel">
          <dl className="rows">
            <Row
              label={page.income.runningTotal}
              value={money(otherIncomeTotal(draft))}
            />
            <Row
              label={page.income.runningTds}
              value={money(claimableTds(draft))}
            />
          </dl>
        </section>

      </>
    );
  };

  const renderRegimeColumn = (regime: Regime) => {
    const c = regime === "new" ? comparison.newRegime : comparison.oldRegime;
    const isChosen = draft.regime === regime;
    return (
      <div>
        <p className="label">
          {regime === "new" ? page.regime.newRegime : page.regime.oldRegime}
          {isChosen && <> · {page.regime.chosen}</>}
        </p>
        <p className="statement">
          <span className="num">{money(c.totalTax)}</span>
        </p>
        <table className="ledger-table">
          <tbody>
            <tr>
              <th scope="row">{page.regime.grossTotal}</th>
              <td className="col-num">{money(c.grossTotalIncome)}</td>
            </tr>
            <tr>
              <th scope="row">{page.regime.deductionsLabel}</th>
              <td className="col-num">
                {c.chapterViaDeductions > 0
                  ? `−${money(c.chapterViaDeductions)}`
                  : money(0)}
              </td>
            </tr>
            <tr>
              <th scope="row">{page.regime.totalIncome}</th>
              <td className="col-num">{money(c.totalIncome)}</td>
            </tr>
            <tr>
              <th scope="row">{page.regime.taxBefore}</th>
              <td className="col-num">{money(c.taxBeforeRebate)}</td>
            </tr>
            <tr>
              <th scope="row">{page.regime.rebate}</th>
              <td className="col-num">
                {c.rebate > 0 ? `−${money(c.rebate)}` : money(0)}
              </td>
            </tr>
            <tr>
              <th scope="row">{page.regime.cess}</th>
              <td className="col-num">{money(c.cess)}</td>
            </tr>
            <tr>
              <th scope="row">{page.regime.totalTax}</th>
              <td className="col-num">{money(c.totalTax)}</td>
            </tr>
          </tbody>
        </table>

        <table className="ledger-table">
          <caption>{page.regime.workingTitle}</caption>
          <thead>
            <tr>
              <th scope="col">{page.regime.bandRange}</th>
              <th scope="col">{page.regime.bandRate}</th>
              <th className="col-num" scope="col">
                {page.regime.bandTaxable}
              </th>
              <th className="col-num" scope="col">
                {page.regime.bandTax}
              </th>
            </tr>
          </thead>
          <tbody>
            {c.bands.map((band) => (
              <tr key={`${regime}-${band.from}`}>
                <th scope="row">
                  {money(band.from)} – {money(band.to)}
                </th>
                <td data-label={page.regime.bandRate}>
                  {formatPercent(band.rate, language)}
                </td>
                <td className="col-num" data-label={page.regime.bandTaxable}>
                  {money(band.taxable)}
                </td>
                <td className="col-num" data-label={page.regime.bandTax}>
                  {money(Math.round(band.tax))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="finding-note">
          {regime === "new"
            ? page.regime.newDeductionsNote
            : page.regime.oldDeductionsNote}
        </p>

        {/* The same three figures that head the card, repeated where the
            decision is actually taken. By the time a reader has worked down
            through two tables and a paragraph, the number they are choosing
            between is a screen and a half above the button that chooses it. */}
        <div className="regime-recap">
          <p className="label">{page.regime.recapTitle}</p>
          <p className="statement">
            <span className="num">{money(c.totalTax)}</span>
          </p>
          <dl className="rows">
            <Row
              label={page.regime.grossTotal}
              value={money(c.grossTotalIncome)}
            />
            <Row
              label={page.regime.deductionsLabel}
              value={
                c.chapterViaDeductions > 0
                  ? `−${money(c.chapterViaDeductions)}`
                  : money(0)
              }
            />
          </dl>
        </div>

        <div className="actions no-print">
          <button
            className={isChosen ? "btn" : "btn btn-secondary"}
            onClick={() => updateDraft({ regime })}
            type="button"
          >
            {regime === "new" ? page.regime.chooseNew : page.regime.chooseOld}
          </button>
        </div>
      </div>
    );
  };

  const renderRegime = () => (
    <>
      <div className="guided-head">
        <p className="guided-kicker">{page.regime.eyebrow}</p>
        <h1 ref={headingRef} tabIndex={-1}>
          {language === "hi" ? "कौन सा विकल्प आपका कर कम करता है?" : "Which option leaves you with less tax?"}
        </h1>
        <p className="lede">
          {language === "hi" ? "हमने दोनों की गणना कर दी है। आपको नियम समझने की जरूरत नहीं।" : "We calculated both. You do not need to decode the rules."}
        </p>
      </div>

      <div
        className={`guided-choice-grid regimes${spotlightClass("regime-choice")}`}
        id="regime-choice"
        tabIndex={-1}
      >
        <div className={comparison.better === "new" ? "guided-choice-card is-recommended" : "guided-choice-card"}>
          <span className="guided-saved">{comparison.better === "new" ? (language === "hi" ? `${money(comparison.saving)} बचते हैं` : `Saves ${money(comparison.saving)}`) : page.regime.newRegime}</span>
          <h2>{page.regime.newRegime}</h2>
          <p className="price">{money(comparison.newRegime.totalTax)}</p>
          <p className="consequence">{language === "hi" ? "इस साल का कुल कर" : "Total tax for this year"}</p>
          <button className={draft.regime === "new" ? "btn" : "btn btn-secondary"} onClick={() => updateDraft({ regime: "new" })} type="button">{draft.regime === "new" ? page.regime.chosen : page.regime.chooseNew}</button>
        </div>
        <div className={comparison.better === "old" ? "guided-choice-card is-recommended" : "guided-choice-card"}>
          <span className="guided-saved">{comparison.better === "old" ? (language === "hi" ? `${money(comparison.saving)} बचते हैं` : `Saves ${money(comparison.saving)}`) : (language === "hi" ? "तुलना" : "For comparison")}</span>
          <h2>{page.regime.oldRegime}</h2>
          <p className="price">{money(comparison.oldRegime.totalTax)}</p>
          <p className="consequence">{language === "hi" ? "इस साल का कुल कर" : "Total tax for this year"}</p>
          <button className={draft.regime === "old" ? "btn" : "btn btn-secondary"} onClick={() => updateDraft({ regime: "old" })} type="button">{draft.regime === "old" ? page.regime.chosen : page.regime.chooseOld}</button>
        </div>
      </div>

      {formError && <ErrorSummary message={formError} />}

      <StepActions
        back={() => goTo(3)}
        backLabel={common.back}
        next={continueFromRegime}
        nextLabel={common.continue}
      />

      <details className="guided-details">
        <summary>{language === "hi" ? "गणना और कटौतियाँ देखें" : "See the calculation and deductions"}</summary>
        <div className="guided-details-body">
          <p className="prose">{page.regime.workingIntro}</p>
          <p className="consequence">{page.regime.rebateNote(money(REBATE_NEW_LIMIT))}</p>
          <div className="swap">{renderRegimeColumn("new")}{renderRegimeColumn("old")}</div>
          <TaxPaidSection labels={{ amountAwaitingRegime: common.tpAmountAwaitingRegime, deductionsIntro: common.tpDeductionsIntro, deductionsTitle: common.tpDeductionsTitle, deductionsTotal: common.tpDeductionsTotal, entriesCount: common.tpEntriesCount, entriesNone: common.tpEntriesNone, headAmount: common.tpHeadAmount, headSection: common.tpHeadSection, headStatus: common.tpHeadStatus, headWhat: common.tpHeadWhat, officialSummary: common.tpOfficialSummary, regimeNew: common.tpRegimeNew, regimeOld: common.tpRegimeOld, regimeUnchosen: common.tpRegimeUnchosen, schedulesIntro: common.tpSchedulesIntro, schedulesSummary: common.tpSchedulesSummary, schedulesTitle: common.tpSchedulesTitle, sourceLabel: common.tpSourceLabel, statusAwaitingRegime: common.tpStatusAwaitingRegime, statusClaimed: common.tpStatusClaimed, statusNone: common.tpStatusNone, statusNotInRegime: common.tpStatusNotInRegime, taxPaidTotal: common.tpTaxPaidTotal, whyLabel: common.tpWhyLabel }} language={language} regime={draft.regime} />
        </div>
      </details>

    </>
  );

  const renderChecks = () => {
    const passed = checks.filter((check) => check.state === "pass").length;
    const attention = checksNeedingAttention(draft);
    const stranded = strandedTds(draft);

    return (
      <>
        <div className="guided-head">
          <p className="guided-kicker">{page.checks.eyebrow}</p>
          <h1 ref={headingRef} tabIndex={-1}>
            {attention.length === 0
              ? language === "hi" ? "आपका रिटर्न तैयार है" : "Your return is ready"
              : language === "hi" ? "एक बात ठीक करनी है" : "There is something to fix"}
          </h1>
          <p className="lede">
            {language === "hi" ? "फाइल करने से पहले हमने आम गलतियाँ जाँच ली हैं।" : "We checked the common mistakes before anything is filed."}
          </p>
        </div>

        <section className="guided-panel" style={{ textAlign: "center" }}>
          <div className="guided-check-mark"><CheckIcon /></div>
          <p className="statement" style={{ marginInline: "auto" }}>{page.checks.passed(passed, checks.length)}</p>
          {attention.length === 0 ? (
            <>
              <h2 className="verdict-ok">{page.checks.allClearTitle}</h2>
              {stranded > 0 && <p className="consequence" style={{ marginInline: "auto" }}>{page.checks.strandedLabel}: <strong>{money(stranded)}</strong></p>}
            </>
          ) : (
            <>
              <h2>{page.checks.attentionTitle}</h2>
              <button className="btn btn-secondary" onClick={() => goTo(3)} type="button">{page.checks.goToStep}</button>
            </>
          )}
        </section>

        {formError && <ErrorSummary message={formError} />}

        <StepActions
          back={() => goTo(4)}
          backLabel={common.back}
          next={() => goTo(6)}
          nextLabel={page.checks.continue}
        />

        <details className="guided-details">
          <summary>{language === "hi" ? "चारों जाँच देखें" : "See all four checks"}</summary>
          <div className="guided-details-body">
            <ul className="sequence">
              {checks.map((check) => {
                const id = check.id as CheckId;
                return <li key={check.id}><h3><span className={check.state === "pass" ? "verdict-ok" : "verdict-missing"}>{page.checks.labels[id]}</span></h3><p>{page.checks.detail[id]}</p>{check.state !== "pass" && page.checks.fix[id] && <p><span className="label-alert">{page.checks.fix[id]}</span></p>}</li>;
              })}
            </ul>
            <p className="no-print"><OutLink href={OFFICIAL_DEFECTIVE_FAQ} newWindow={common.newWindow}>{language === "hi" ? "धारा 139(9) पर आधिकारिक जानकारी" : "Official guidance on section 139(9)"}</OutLink></p>
          </div>
        </details>

      </>
    );
  };

  const renderReview = () => (
    <>
      <div className="guided-head">
        <p className="guided-kicker">{page.review.eyebrow}</p>
        <h1 ref={headingRef} tabIndex={-1}>
          {language === "hi" ? "एक आखिरी नज़र" : "One last look"}
        </h1>
        <p className="lede">{language === "hi" ? "नतीजा पहले। जरूरत हो तो पूरी रकम नीचे देख सकते हैं।" : "The result comes first. Open the totals only if you want to check them."}</p>
      </div>

      <section className="guided-outcome">
        <p className="label">{computation.refundDue > 0 ? page.review.refundTitle : page.review.payableTitle}</p>
        <strong className="amount">{money(computation.refundDue > 0 ? computation.refundDue : computation.balancePayable)}</strong>
        {computation.refundDue > 0 && refundAccount && <p className="consequence" style={{ marginInline: "auto" }}>{page.review.refundAccountLine(refundAccount.bank, refundAccount.masked, refundAccount.kind)}</p>}
        {computation.refundDue > 0 && !refundAccount && (
          <div className="caution">
            <p>{language === "hi" ? "रिफ़ंड के लिए कोई सत्यापित खाता तैयार नहीं है।" : "No verified account is ready for the refund."}</p>
            <button className="link-btn no-print" onClick={() => goTo(1)} type="button">
              {language === "hi" ? "खाता चुनें" : "Choose an account"}
            </button>
          </div>
        )}
      </section>

      <label
        className={`guided-answer${spotlightClass("review-declare")}`}
        id="review-declare"
      >
        <input
          checked={draft.declaration}
          onChange={(event) =>
            updateDraft({ declaration: event.target.checked })
          }
          type="checkbox"
        />
        <span>{page.review.declaration}</span>
      </label>

      {formError && <ErrorSummary message={formError} />}

      {draft.status === "queued" && (
        <div className="stop" role="status">
          <p className="subhead">{page.review.offlineTitle}</p>
          <p className="finding-note">{page.review.offlineNote}</p>
          <button className="btn btn-secondary" onClick={submitReturn} type="button">
            {page.review.retry}
          </button>
        </div>
      )}

      <div className="actions no-print">
        <button
          className="btn"
          disabled={draft.status === "submitting"}
          onClick={submitReturn}
          type="button"
        >
          {draft.status === "submitting"
            ? page.review.submitting
            : page.review.submit}
        </button>
        <button className="link-btn" onClick={() => goTo(5)} type="button">
          {common.back}
        </button>
      </div>

      <details className="guided-details">
        <summary>{language === "hi" ? "आय का हिसाब देखें" : "See the income total"}</summary>
        <div className="guided-details-body">
        <table className="ledger-table">
          <tbody>
            <tr>
              <th scope="row">{page.review.salaryLine}</th>
              <td className="col-num">{money(computation.salaryAfterStandard)}</td>
            </tr>
            <tr>
              <th scope="row">{page.review.otherLine}</th>
              <td className="col-num">{money(computation.otherIncome)}</td>
            </tr>
            <tr>
              <th scope="row">{page.regime.totalIncome}</th>
              <td className="col-num">{money(computation.totalIncome)}</td>
            </tr>
          </tbody>
        </table>
        <div className="actions no-print">
          <button className="link-btn" onClick={() => goTo(3)} type="button">
            {page.review.editLabel}
          </button>
        </div>
        </div>
      </details>

      <details className="guided-details">
        <summary>{language === "hi" ? "कर का हिसाब देखें" : "See the tax total"}</summary>
        <div className="guided-details-body">
        <table className="ledger-table">
          <tbody>
            <tr>
              <th scope="row">{page.regime.totalTax}</th>
              <td className="col-num">{money(computation.totalTax)}</td>
            </tr>
            <tr>
              <th scope="row">{page.review.creditTitle}</th>
              <td className="col-num">{money(computation.tdsPaid)}</td>
            </tr>
          </tbody>
        </table>
        <div className="actions no-print">
          <button className="link-btn" onClick={() => goTo(4)} type="button">
            {page.review.editLabel}
          </button>
        </div>
        </div>
      </details>

    </>
  );

  const renderReceipt = () => (
    <div className="receipt">
      <div className="guided-head receipt-head">
        <p className="guided-kicker">{page.receipt.eyebrow}</p>
        <h1 ref={headingRef} tabIndex={-1}>
          {draft.verifiedAt
            ? language === "hi" ? "रिटर्न फाइल और सत्यापित हो गया" : "Your return is filed and verified"
            : language === "hi" ? "रिटर्न जमा हुआ। अब सत्यापन करें" : "Return submitted. Verify it now"}
        </h1>
        <p className="lede">
          {draft.verifiedAt
            ? language === "hi" ? "सब हो गया। रसीद अपने रिकॉर्ड के लिए रख लें।" : "You are done. Keep the receipt for your records."
            : language === "hi" ? "इसे पूरा करने के लिए अब सत्यापन करें।" : "Verify it now to finish."}
        </p>
      </div>

      <VerifySection
        dateFormat={(date) => formatDate(date, language)}
        filedAt={draft.submittedIso ? new Date(draft.submittedIso) : null}
        language={language}
        now={now}
        onVerify={verifyReturn}
        reference={draft.verifiedAt ? DEMO_VERIFY_REFERENCE : null}
        verifiedAt={draft.verifiedAt}
      />

      <section className="guided-outcome receipt-summary">
        <div>
          <span className="label">{page.receipt.statusLabel}</span>
          <strong>{draft.verifiedAt ? page.receipt.statusValue : page.receipt.statusUnverified}</strong>
        </div>
        <div>
          <span className="label">{computation.refundDue > 0 ? page.receipt.refundLabel : page.receipt.payableLabel}</span>
          <strong className="amount">{money(computation.refundDue > 0 ? computation.refundDue : computation.balancePayable)}</strong>
        </div>
        <div>
          <span className="label">{page.receipt.ackLabel}</span>
          <strong>{draft.reference ?? DEMO_ACKNOWLEDGEMENT}</strong>
        </div>
      </section>

      <div className="actions no-print receipt-actions">
        <button className="btn" onClick={() => window.print()} type="button">
          {page.receipt.print}
        </button>
        <button
          className="btn btn-secondary"
          onClick={downloadReceipt}
          type="button"
        >
          {page.receipt.download}
        </button>
        <button className="link-btn" onClick={resetDemo} type="button">
          {page.receipt.restart}
        </button>
      </div>

      <details className="guided-details receipt-details">
        <summary>{language === "hi" ? "पूरी रसीद देखें" : "View full receipt"}</summary>
        <div className="guided-details-body receipt-body">
          <dl className="rows receipt-refs">
          <Row
            label={page.receipt.ackLabel}
            value={draft.reference ?? DEMO_ACKNOWLEDGEMENT}
          />
          <Row label={page.receipt.txnLabel} value={DEMO_TRANSACTION} />
          <Row
            label={page.receipt.statusLabel}
            value={
              draft.verifiedAt
                ? page.receipt.statusValue
                : page.receipt.statusUnverified
            }
          />
          <Row
            label={page.receipt.timeLabel}
            value={draft.submittedAt ?? formatDateTime(new Date(), language)}
          />
          <Row label={page.receipt.formLabel} value={demoCase.form} />
          <Row
            label={page.receipt.regimeLabel}
            value={
              draft.regime === "old"
                ? page.receipt.regimeOld
                : page.receipt.regimeNew
            }
          />
          <Row
            label={page.receipt.totalIncomeLabel}
            value={money(computation.totalIncome)}
          />
          <Row
            label={page.receipt.totalTaxLabel}
            value={money(computation.totalTax)}
          />
          {computation.refundDue > 0 ? (
            <Row
              label={page.receipt.refundLabel}
              value={money(computation.refundDue)}
            />
          ) : (
            <Row
              label={page.receipt.payableLabel}
              value={money(computation.balancePayable)}
            />
          )}
          <Row
            label={page.receipt.versionLabel}
            value={demoCase.calculationVersion}
          />
          </dl>
          <div className="receipt-next">
            <h2>{page.receipt.nextTitle}</h2>
            <ul className="sequence">
              {page.receipt.next.map((item) => (
                <li key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <p className="caution">{page.receipt.warning}</p>
        </div>
      </details>

    </div>
  );

  const renderScreen = () => {
    if (screen === "login") {
      return (
        <LoginScreen
          common={common}
          onAskAssistant={askAssistant}
          onDone={signIn}
          onRegister={() => setScreen("register")}
        />
      );
    }

    if (screen === "register") {
      return (
        <RegisterScreen
          common={common}
          onAskAssistant={askAssistant}
          onDone={signIn}
          onSignIn={() => setScreen("login")}
        />
      );
    }

    if (screen === "notices") {
      return (
        <NoticesPage
          common={common}
          language={language}
          onBack={() => setScreen("home")}
        />
      );
    }

    if (screen === "dashboard" && session) {
      return (
        <Dashboard
          common={common}
          draft={draft}
          language={language}
          now={now}
          onResume={() => goTo(Math.max(1, draft.step))}
          onService={openService}
          session={session}
          totalSteps={TOTAL_STEPS - 1}
        />
      );
    }

    /* A journey step only renders inside the journey, and only for somebody who
       is through the door. Anything else — a stale draft, a restored screen, a
       signed-out session — falls back to the home page rather than showing a
       step out of its shell. */
    if (screen === "journey" && session && draft.step > 0) return renderStep();

    return renderHome();
  };

  const renderStep = () => {
    if (draft.step === 0) return renderHome();
    if (draft.step === 1) return renderCheck();
    if (draft.step === 2) return renderSalary();
    if (draft.step === 3) return renderIncome();
    if (draft.step === 4) return renderRegime();
    if (draft.step === 5) return renderChecks();
    if (draft.step === 6) return renderReview();
    return renderReceipt();
  };

  /* ------------------------------------------------------------ margins */

  const renderMargin = () => (
    <>
      {draft.step > 0 && draft.step < RECEIPT_STEP && (
        <DeadlineMargin common={common} language={language} window={filing} />
      )}

      <section className="margin-block">
        <p className="label">{common.railCase}</p>
        <dl className="margin-list">
          <div>
            <dt>{page.check.decided[0].label}</dt>
            <dd>{decidedForm}</dd>
          </div>
          <div>
            <dt>PAN</dt>
            <dd>{demoCase.maskedPan}</dd>
          </div>
          {/* Figures appear once the citizen has actually supplied something.
              Showing a refund on the start screen would be a number they had
              no part in, and the amount changes as they answer. */}
          {draft.step >= 3 && (
            <>
              <div>
                <dt>{page.receipt.totalIncomeLabel}</dt>
                <dd>{money(computation.totalIncome)}</dd>
              </div>
              <div>
                <dt>{page.receipt.totalTaxLabel}</dt>
                <dd>{money(computation.totalTax)}</dd>
              </div>
              <div>
                <dt>
                  {computation.refundDue > 0
                    ? page.receipt.refundLabel
                    : page.receipt.payableLabel}
                </dt>
                <dd>
                  {money(
                    computation.refundDue > 0
                      ? computation.refundDue
                      : computation.balancePayable,
                  )}
                </dd>
              </div>
            </>
          )}
        </dl>
      </section>

      <section className="margin-block no-print">
        <p className="label">{common.railActions}</p>
        <ul className="margin-links">
          {draft.step !== 1 && (
            <li>
              <button className="link-btn" onClick={() => goTo(1)} type="button">
                {common.viewNotice}
              </button>
            </li>
          )}
          <li>
            <button className="link-btn" onClick={downloadSummary} type="button">
              {common.downloadNotice}
            </button>
          </li>
          {draft.step > 0 && draft.step < RECEIPT_STEP && (
            <li>
              <button
                className="link-btn"
                onClick={() => setFeedbackOpen(true)}
                type="button"
              >
                {common.extensionAction}
              </button>
            </li>
          )}
          <li>
            <OutLink href={OFFICIAL_PORTAL} newWindow={common.newWindow}>
              {common.officialPortalLink}
            </OutLink>
          </li>
        </ul>
      </section>

      <section className="margin-block no-print">
        <p className="label">{common.helpline}</p>
        {OFFICIAL_HELPLINES.map((number) => (
          <a
            className="helpline"
            href={`tel:${number.replace(/\s/g, "")}`}
            key={number}
          >
            {number}
          </a>
        ))}
        <p className="margin-note">{common.helplineNote}</p>
      </section>
    </>
  );

  /* -------------------------------------------------------------- shell */

  /* Three shapes, not one. The journey needs its steps on the left and the case
     details on the right; the dashboard needs the case details only; the home,
     sign-in and registration screens need the full measure to themselves. */
  const inJourney = screen === "journey" && session != null && draft.step > 0;
  const hasMargin = screen === "dashboard";
  const layoutShape = inJourney
    ? "is-guided"
    : hasMargin
      ? "is-two"
      : "is-plain";

  const stepLabel =
    inJourney && draft.step < TOTAL_STEPS ? common.steps[draft.step] : null;

  const snapshot = useCallback(
    (attachment: string | null) =>
      buildContext({
        draft,
        session,
        screen: inJourney ? "journey" : screen,
        attachment,
      }),
    [draft, inJourney, screen, session],
  );

  return (
    /* Set once here so a jargon term can be written as `<Term id="tds" />`
       anywhere below without every call site threading the language. */
    <TermLanguage value={language}>
    <div className={draft.lowData ? "app lite" : "app"}>
      <a className="skip-link" href="#main-content">
        {common.skip}
      </a>

      <TrustBanner common={common} />

      <header className="masthead no-print">
        <div className="shell masthead-inner">
          <button className="brand" onClick={() => goTo(0)} type="button">
            <span className="brand-name">{common.brand}</span>
            <span className="brand-sub">{common.strapline}</span>
          </button>

          {/* The masthead used to spell out six controls in words — search,
              help, the account, dashboard, logout, settings — and read as a
              sentence competing with the page. They are icons now, each with
              its name as the accessible name and on a hovercard, so nothing is
              lost to anyone who cannot guess a glyph. */}
          <div className="masthead-tools">
            {/* Was an icon with the shortcut hidden on a hovercard, which
                nobody found: a reader has to already suspect the panel exists
                before hovering to learn it does. The control now says what it
                is and what opens it, at rest. */}
            <SearchTrigger
              label={common.commandTrigger}
              onOpen={() => setPaletteOpen(true)}
              placeholder={common.searchPlaceholder}
            />

            <Hovercard
              className="tool"
              label={common.help}
              onClick={openHelp}
              panel={<p className="hc-tool">{common.help}</p>}
              panelClassName="hc-tip"
              triggerClassName="tool-btn"
            >
              <HelpIcon />
            </Hovercard>

            {session ? (
              <div className="account">
                <span className="account-name">
                  {session.name}
                  <span className="account-id">
                    {maskUserId(session.userId, session.kind)}
                  </span>
                </span>
                <Hovercard
                  className="tool"
                  label={common.dashboard}
                  onClick={() => setScreen("dashboard")}
                  panel={<p className="hc-tool">{common.dashboard}</p>}
                  panelClassName="hc-tip"
                  triggerClassName="tool-btn"
                >
                  <GridIcon />
                </Hovercard>
                <Hovercard
                  className="tool"
                  label={common.signOut}
                  onClick={signOut}
                  panel={<p className="hc-tool">{common.signOut}</p>}
                  panelClassName="hc-tip"
                  triggerClassName="tool-btn"
                >
                  <SignOutIcon />
                </Hovercard>
              </div>
            ) : (
              <div className="account">
                <Hovercard
                  className="tool"
                  label={common.signIn}
                  onClick={() => setScreen("login")}
                  panel={<p className="hc-tool">{common.signIn}</p>}
                  panelClassName="hc-tip"
                  triggerClassName="tool-btn"
                >
                  <SignInIcon />
                </Hovercard>
                <Hovercard
                  className="tool"
                  label={common.register}
                  onClick={() => setScreen("register")}
                  panel={<p className="hc-tool">{common.register}</p>}
                  panelClassName="hc-tip"
                  triggerClassName="tool-btn"
                >
                  <UserPlusIcon />
                </Hovercard>
              </div>
            )}
            <SettingsMenu
              common={common}
              language={language}
              lowData={draft.lowData}
              onClose={() => setSettingsOpen(false)}
              onLanguage={switchLanguage}
              onLowData={(value) => updateDraft({ lowData: value })}
              onTextScale={(textScale: TextScale) =>
                setPrefs((current) => ({ ...current, textScale }))
              }
              onTheme={(theme: Theme) =>
                setPrefs((current) => ({ ...current, theme }))
              }
              onToggle={() => setSettingsOpen((open) => !open)}
              open={settingsOpen}
              textScale={prefs.textScale}
              theme={prefs.theme}
            />
          </div>
        </div>
      </header>

      <main className={inJourney ? "main is-journey-main" : "main"} id="main-content">
        <div className={`shell layout ${layoutShape}`}>
          {inJourney && (
            <StepRail
              complete={Boolean(draft.verifiedAt)}
              current={draft.step}
              language={language}
              names={common.steps}
              onGo={goTo}
              reached={draft.reached}
              words={{
                count: common.stepsDone(
                  draft.verifiedAt
                    ? TOTAL_STEPS - 1
                    : Math.max(0, Math.max(draft.step, draft.reached) - 1),
                  TOTAL_STEPS - 1,
                ),
                done: common.stepDone,
                here: common.stepCurrent,
                label: common.journeyLabel,
                locked: common.stepLocked,
                open: common.stepOpen,
              }}
            />
          )}
          <div className="work">
            {/* "Saved on this device" is about a draft. On a screen where
                nothing has been started there is no draft to have saved, and
                the line was the same false reassurance the step list used to
                give before it was moved inside the journey. A notice — going
                offline, a file converted — still shows anywhere. */}
            {(inJourney || hasSavedDraft || notice) && (
              <p aria-atomic="true" aria-live="polite" className="savebar">
                <span
                  aria-hidden="true"
                  className={isOnline ? "savebar-dot" : "savebar-dot is-off"}
                />
                {notice || (isOnline ? common.saved : common.offline)}
              </p>
            )}
            {renderScreen()}
          </div>

          {hasMargin && (
            <aside aria-label={common.railCase} className="margin-col">
              {renderMargin()}
            </aside>
          )}
        </div>
      </main>

      {/* The assistant sits over the page rather than inside the column, so it
          can stay open while the citizen works through a step. */}
      <Assistant
        buildSnapshot={snapshot}
        canCheck={inJourney}
        common={common}
        language={language}
        onClose={() => setAssistantOpen(false)}
        open={assistantOpen}
        pendingQuestion={assistantQuestion}
        questionToken={questionToken}
        signedIn={session != null}
        stepLabel={stepLabel}
      />

      {!assistantOpen && (
        <button
          className="assistant-launch no-print"
          onClick={() => setAssistantOpen(true)}
          type="button"
        >
          <HelpIcon />
          <span>{common.assistantOpen}</span>
        </button>
      )}

      <footer className="site-footer no-print">
        <div className="shell footer-inner guided-footer">
          <div>
            <p className="footer-mark">{common.brand}</p>
            <p>{common.officialWarning}</p>
          </div>
          <div className="footer-col guided-card-actions">
            <OutLink href={OFFICIAL_FILING_HELP} newWindow={common.newWindow}>{common.officialSource}</OutLink>
            <button className="link-btn" onClick={openSupport} type="button">{common.support}</button>
            <button className="link-btn" onClick={() => setClearOpen(true)} type="button">{common.clearData}</button>
          </div>
        </div>
      </footer>

      {paletteOpen && (
        <CommandPalette
          commands={commands}
          common={common}
          currentStep={common.steps[draft.step]}
          onClose={() => setPaletteOpen(false)}
        />
      )}

      {helpOpen && (
        <Modal
          className="modal"
          labelledBy="help-title"
          onClose={() => setHelpOpen(false)}
        >
          <div className="modal-head">
            <div>
              <p className="label">{common.steps[draft.step]}</p>
              <h2 id="help-title">
                {supportMode
                  ? supportReference
                    ? common.supportCreated
                    : common.supportTitle
                  : common.helpTitle}
              </h2>
            </div>
            <button
              aria-label={common.close}
              className="modal-close"
              onClick={() => setHelpOpen(false)}
              type="button"
            >
              ×
            </button>
          </div>

          {!supportMode ? (
            <div className="stack">
              <p>{helpByStep[language][draft.step]}</p>
              <dl className="rows">
                <Row label={common.source} value={common.officialSource} />
                <Row label={common.reviewedLabel} value={common.reviewedDate} />
                <Row label={common.nextReviewLabel} value={common.nextReviewDate} />
                <Row label={common.supportOwner} value={common.supportOwnerValue} />
              </dl>
              <p>
                <OutLink href={OFFICIAL_FILING_HELP} newWindow={common.newWindow}>
                  {common.officialSource}
                </OutLink>
              </p>
              <button
                className="btn btn-secondary btn-block"
                onClick={() => setSupportMode(true)}
                type="button"
              >
                {common.support}
              </button>
            </div>
          ) : supportReference ? (
            <div className="stack">
              <p className="big-ref">{supportReference}</p>
              <p>{common.supportResponse}</p>
              <dl className="rows">
                <Row label={common.supportStage} value={common.steps[draft.step]} />
                <Row label={common.supportOwner} value={common.supportOwnerValue} />
              </dl>
              <button
                className="btn btn-block"
                onClick={() => setHelpOpen(false)}
                type="button"
              >
                {common.close}
              </button>
            </div>
          ) : (
            <form onSubmit={createSupportRequest}>
              <p className="fine">{common.supportIntro}</p>
              <label className="field">
                <span>{common.supportIssue}</span>
                <select
                  onChange={(event) => setSupportIssue(event.target.value)}
                  required
                  value={supportIssue}
                >
                  <option value="">
                    {language === "hi" ? "चुनें" : "Select one"}
                  </option>
                  {common.supportOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field" htmlFor="support-details">
                <span>{common.supportDetails}</span>
                <textarea
                  aria-describedby="support-stage"
                  id="support-details"
                  minLength={10}
                  onChange={(event) => setSupportDetails(event.target.value)}
                  placeholder={common.supportExample}
                  required
                  rows={4}
                  value={supportDetails}
                />
              </label>
              <p className="field-hint" id="support-stage">
                {common.supportStage}: {common.steps[draft.step]}
              </p>
              <div className="actions">
                <button className="btn btn-block" type="submit">
                  {common.createSupport}
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}

      {feedbackOpen && (
        <Modal
          className="modal modal-sm"
          labelledBy="feedback-title"
          onClose={() => setFeedbackOpen(false)}
        >
          <div className="modal-head">
            <div>
              <p className="label">{common.synthetic}</p>
              <h2 id="feedback-title">
                {draft.feedbackReference
                  ? common.extensionCreated
                  : common.extensionTitle}
              </h2>
            </div>
            <button
              aria-label={common.close}
              className="modal-close"
              onClick={() => setFeedbackOpen(false)}
              type="button"
            >
              ×
            </button>
          </div>

          {draft.feedbackReference ? (
            <div className="stack">
              <p className="big-ref">{draft.feedbackReference}</p>
              <p>{common.extensionNext}</p>
              <button
                className="btn btn-block"
                onClick={() => setFeedbackOpen(false)}
                type="button"
              >
                {common.close}
              </button>
            </div>
          ) : (
            <div className="stack">
              <p>{common.extensionIntro}</p>
              <p className="fine">{common.extensionNote}</p>
              {disputedEntries(draft).length > 0 && (
                <dl className="rows">
                  {disputedEntries(draft).map((entry) => (
                    <Row
                      key={entry.id}
                      label={`${page.income.kinds[entry.kind]} — ${entry.payer}`}
                      value={money(entry.amount)}
                    />
                  ))}
                </dl>
              )}
              <button
                className="btn btn-block"
                onClick={raiseFeedback}
                type="button"
              >
                {common.extensionCreate}
              </button>
            </div>
          )}
        </Modal>
      )}

      {clearOpen && (
        <Modal
          className="modal modal-sm"
          describedBy="clear-description"
          labelledBy="clear-title"
          onClose={() => setClearOpen(false)}
          role="alertdialog"
        >
          <h2 id="clear-title">{common.clearConfirm}</h2>
          <p className="fine" id="clear-description">
            {common.clearExplanation}
          </p>
          <div className="actions">
            <button className="btn btn-danger" onClick={clearDraft} type="button">
              {common.confirmClear}
            </button>
            <button
              className="link-btn"
              onClick={() => setClearOpen(false)}
              type="button"
            >
              {common.cancel}
            </button>
          </div>
        </Modal>
      )}
    </div>
    </TermLanguage>
  );
}

function StepActions({
  back,
  backLabel,
  next,
  nextLabel,
}: {
  back: () => void;
  backLabel: string;
  next: () => void;
  nextLabel: string;
}) {
  return (
    <div className="actions no-print">
      <button className="btn" onClick={next} type="button">
        {nextLabel}
      </button>
      <button className="link-btn" onClick={back} type="button">
        {backLabel}
      </button>
    </div>
  );
}

function ErrorSummary({ message }: { message: string }) {
  const [code, ...rest] = message.split(": ");
  const hasCode = rest.length > 0;
  return (
    <div className="alert" role="alert" tabIndex={-1}>
      <strong>{hasCode ? rest.join(": ") : message}</strong>
      {hasCode && <span className="alert-code">{code}</span>}
    </div>
  );
}
