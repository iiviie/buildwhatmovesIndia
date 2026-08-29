/* Registration, sign-in and the signed-in session.

   Everything here is synthetic. No credential is checked against anything, no
   account is created anywhere, and the one-time password is fixed and printed
   on screen. The point of the flow is the *shape* of the real journey — the
   e-Filing portal makes you register and sign in before you can file — and one
   specific repair to it, described in `IDENTITY_ROUTES` below. */

import type { Language } from "./case-data";

export const SESSION_KEY = "sahi-return-session-v1";

/* Where in the site you are, as distinct from where in the return you are.

   The e-Filing portal is a whole site with a home page, a sign-in, a
   registration and a dashboard, and the return is one journey inside it. The
   prototype kept only the journey, which made the whole product look like a
   single form. These are the site's own screens. */
export type Screen =
  | "home"
  | "login"
  | "register"
  | "dashboard"
  | "journey"
  | "notices";

export const SCREEN_KEY = "sahi-return-screen-v1";

export const isScreen = (value: unknown): value is Screen =>
  value === "home" ||
  value === "login" ||
  value === "register" ||
  value === "dashboard" ||
  value === "journey" ||
  value === "notices";

/* Printed on the OTP screen. A judge should never be locked out of the demo by
   an OTP they cannot receive. */
export const DEMO_OTP = "123456";

/* The synthetic taxpayer the whole prototype is built around. */
export const DEMO_USER_ID = "DEMOA1234X";

export const DEMO_AADHAAR = "999912345678";

export type UserIdKind = "pan" | "aadhaar" | "other" | "unknown";

export type Session = {
  userId: string;
  kind: UserIdKind;
  name: string;
  signedInAt: string;
};

/* ------------------------------------------------------------ user ID kind */

const PAN_SHAPE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

const AADHAAR_SHAPE = /^[0-9]{12}$/;

export const normaliseUserId = (value: string) =>
  value.replace(/[\s-]/g, "").toUpperCase();

/* The official login field is labelled "PAN/ AADHAAR/ OTHER USER ID" and then
   leaves you to work out which of the three you hold. The field can tell on its
   own, so it does, and says so back to you. */
export const readUserIdKind = (value: string): UserIdKind => {
  const id = normaliseUserId(value);
  if (id.length === 0) return "unknown";
  if (PAN_SHAPE.test(id)) return "pan";
  if (AADHAAR_SHAPE.test(id)) return "aadhaar";
  if (id.length >= 6) return "other";
  return "unknown";
};

export const isKnownDemoUser = (value: string) => {
  const id = normaliseUserId(value);
  return id === DEMO_USER_ID || id === DEMO_AADHAAR;
};

/* --------------------------------------------------------- who are you */

/* The registration screen's first question is "Register as: Taxpayer | Others",
   and choosing "Others" opens a dropdown reading "External Agency / TIN 2.0
   Stakeholders / Chartered Accountant / e-return Intermediary / Non-Residents
   not holding PAN / Tax Deductor and Collector". Every one of those is the
   department's own word for a role, not the citizen's word for themselves, so
   the citizen has to already know the answer to be allowed to ask the question.

   These routes ask instead what the person *does*, and then name the official
   category back to them. The official name is never hidden — it is shown as the
   consequence of the answer, so somebody who was told "register as an ERI" can
   still find their way. */

export type RouteId =
  | "self"
  | "family"
  | "chartered-accountant"
  | "intermediary"
  | "deductor"
  | "non-resident"
  | "agency";

export type IdentityRoute = {
  id: RouteId;
  /* The department's own category, shown as the answer, not as the question. */
  official: string;
  /* Which registration path the choice leads to on the real portal. */
  path: "taxpayer" | "others";
  /* What this prototype can actually do for them. */
  supported: boolean;
};

export const IDENTITY_ROUTES: IdentityRoute[] = [
  { id: "self", official: "Taxpayer — Individual", path: "taxpayer", supported: true },
  { id: "family", official: "Taxpayer — Hindu Undivided Family (HUF)", path: "taxpayer", supported: false },
  { id: "chartered-accountant", official: "Chartered Accountant", path: "others", supported: false },
  { id: "intermediary", official: "e-return Intermediary", path: "others", supported: false },
  { id: "deductor", official: "Tax Deductor and Collector", path: "others", supported: false },
  { id: "non-resident", official: "Non-Residents not holding PAN", path: "others", supported: false },
  { id: "agency", official: "External Agency / TIN 2.0 Stakeholder", path: "others", supported: false },
];

export const routeById = (id: RouteId) =>
  IDENTITY_ROUTES.find((route) => route.id === id) ?? IDENTITY_ROUTES[0];

/* ------------------------------------------------------------- registration */

export type RegisterState = {
  /* 1 Get started, 2 Fill details, 3 Verify, 4 Secure your account. */
  stage: number;
  route: RouteId | null;
  pan: string;
  name: string;
  dateOfBirth: string;
  mobile: string;
  email: string;
  otp: string;
  password: string;
  done: boolean;
};

export const emptyRegistration: RegisterState = {
  stage: 1,
  route: null,
  pan: "",
  name: "",
  dateOfBirth: "",
  mobile: "",
  email: "",
  otp: "",
  password: "",
  done: false,
};

export const REGISTER_STAGES = 4;

/* --------------------------------------------------------------- storage */

export const parseSession = (value: string | null): Session | null => {
  if (!value) return null;
  try {
    const raw = JSON.parse(value) as Partial<Session>;
    if (typeof raw.userId !== "string" || raw.userId.length === 0) return null;
    if (typeof raw.name !== "string" || raw.name.length === 0) return null;
    const kind: UserIdKind =
      raw.kind === "pan" || raw.kind === "aadhaar" || raw.kind === "other"
        ? raw.kind
        : "unknown";
    return {
      userId: raw.userId,
      kind,
      name: raw.name,
      signedInAt:
        typeof raw.signedInAt === "string" ? raw.signedInAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
};

/* Shown beside the account name once signed in. The real portal shows the whole
   PAN in the header; there is no reason to put it on a shared screen. */
export const maskUserId = (userId: string, kind: UserIdKind) => {
  const id = normaliseUserId(userId);
  if (kind === "aadhaar") return `XXXX XXXX ${id.slice(-4)}`;
  if (id.length <= 4) return id;
  return `${id.slice(0, 3)}${"X".repeat(Math.max(0, id.length - 6))}${id.slice(-3)}`;
};

export const greetingFor = (language: Language, hour: number) => {
  if (hour < 12) return language === "hi" ? "सुप्रभात" : "Good morning";
  if (hour < 17) return language === "hi" ? "नमस्कार" : "Good afternoon";
  return language === "hi" ? "शुभ संध्या" : "Good evening";
};
