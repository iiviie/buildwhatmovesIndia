/* The portal's own top-level map.

   The e-Filing portal's masthead reads: Home, Individual/HUF, Company,
   Non-Company, Tax Professionals & Others, Downloads, Help. Those seven items
   are the whole department's shape, and a citizen who has been told "do it on
   the portal" needs to see that shape to know where their own task sits.

   This prototype builds exactly one journey underneath that map — a salaried
   individual filing ITR-1. Every other destination is listed by its real name
   and left visibly out of service, so nothing here pretends to work. An item
   that cannot be used says so in the nav, in a tooltip, and to a screen reader,
   rather than opening an empty page. */

export type SectionId =
  | "home"
  | "individual"
  | "company"
  | "non-company"
  | "professionals"
  | "downloads"
  | "help";

export type ServiceId =
  | "file-return"
  | "view-returns"
  | "e-verify"
  | "refund-status"
  | "link-aadhaar"
  | "pay-tax"
  | "respond-notice"
  | "grievance"
  | "company-return"
  | "tds-return"
  | "form-utilities"
  | "dsc-utility"
  | "ca-forms"
  | "eri-services"
  | "faq"
  | "helpdesk";

export type Service = {
  id: ServiceId;
  section: SectionId;
  /* "live" is built and reachable here. "planned" is named but out of scope. */
  state: "live" | "planned";
  /* Where a live service starts in the journey step machine. */
  step?: number;
};

export type Section = {
  id: SectionId;
  /* A section with no services is a plain link on the real portal too. */
  services: ServiceId[];
  state: "live" | "planned";
};

export const services: Service[] = [
  { id: "file-return", section: "individual", state: "live", step: 1 },
  { id: "view-returns", section: "individual", state: "planned" },
  { id: "e-verify", section: "individual", state: "planned" },
  { id: "refund-status", section: "individual", state: "planned" },
  { id: "link-aadhaar", section: "individual", state: "planned" },
  { id: "pay-tax", section: "individual", state: "planned" },
  { id: "respond-notice", section: "individual", state: "planned" },
  { id: "grievance", section: "individual", state: "planned" },

  { id: "company-return", section: "company", state: "planned" },
  { id: "tds-return", section: "non-company", state: "planned" },

  { id: "ca-forms", section: "professionals", state: "planned" },
  { id: "eri-services", section: "professionals", state: "planned" },

  { id: "form-utilities", section: "downloads", state: "planned" },
  { id: "dsc-utility", section: "downloads", state: "planned" },

  { id: "faq", section: "help", state: "planned" },
  { id: "helpdesk", section: "help", state: "planned" },
];

export const sections: Section[] = [
  { id: "home", services: [], state: "live" },
  { id: "individual", services: servicesIn("individual"), state: "live" },
  { id: "company", services: servicesIn("company"), state: "planned" },
  { id: "non-company", services: servicesIn("non-company"), state: "planned" },
  { id: "professionals", services: servicesIn("professionals"), state: "planned" },
  { id: "downloads", services: servicesIn("downloads"), state: "planned" },
  { id: "help", services: servicesIn("help"), state: "live" },
];

function servicesIn(section: SectionId): ServiceId[] {
  return services
    .filter((service) => service.section === section)
    .map((service) => service.id);
}

export const serviceById = (id: ServiceId) =>
  services.find((service) => service.id === id);

export const liveServices = services.filter((service) => service.state === "live");
