"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { copy } from "../content";
import {
  sections,
  serviceById,
  type SectionId,
  type ServiceId,
} from "../services";
import { ChevronIcon, LockIcon } from "./icons";

type Common = (typeof copy)["en"];

/* The portal's seven sections, kept in their published order.

   A judge, a citizen and a caseworker all need to see the same thing here: the
   shape of the whole service, and an honest mark against the one part of it
   this prototype actually builds. An unbuilt section is a disabled control that
   says why, not a link into an empty room. */
export function PortalNav({
  common,
  onHelp,
  onHome,
  onService,
  open,
  setOpen,
}: {
  common: Common;
  onHelp: () => void;
  onHome: () => void;
  onService: (id: ServiceId) => void;
  /* Which section's service list is showing, if any. */
  open: SectionId | null;
  setOpen: (id: SectionId | null) => void;
}) {
  const panelId = useId();
  const listId = useId();
  const wrap = useRef<HTMLDivElement>(null);
  /* Below the phone breakpoint the strip is a disclosure. The list is always in
     the document so the wide layout never depends on this flag, and so a test
     or a print stylesheet still sees every section. */
  const [listOpen, setListOpen] = useState(false);

  const closeAll = () => {
    setOpen(null);
    setListOpen(false);
  };

  useEffect(() => {
    if (!open && !listOpen) return;
    const onDown = (event: MouseEvent) => {
      if (!wrap.current?.contains(event.target as Node)) {
        setOpen(null);
        setListOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(null);
      setListOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [listOpen, open, setOpen]);

  const openSection = open ? sections.find((s) => s.id === open) : null;

  return (
    <div className="portalnav no-print" ref={wrap}>
      <nav aria-label={common.navLabel} className="shell portalnav-inner">
        <button
          aria-controls={listId}
          aria-expanded={listOpen}
          className="navmenu-toggle"
          onClick={() => setListOpen((value) => !value)}
          type="button"
        >
          {listOpen ? common.navMenuClose : common.navMenu}
          <ChevronIcon className={listOpen ? "nav-chevron is-open" : "nav-chevron"} />
        </button>
        <ul
          className={listOpen ? "portalnav-list" : "portalnav-list is-collapsed"}
          id={listId}
        >
          {sections.map((section) => {
            const label = common.navSections[section.id];

            if (section.id === "home") {
              return (
                <li key={section.id}>
                  <button
                    className="navlink"
                    data-section={section.id}
                    onClick={() => {
                      closeAll();
                      onHome();
                    }}
                    type="button"
                  >
                    {label}
                  </button>
                </li>
              );
            }

            if (section.id === "help") {
              return (
                <li key={section.id}>
                  <button
                    className="navlink"
                    data-section={section.id}
                    onClick={() => {
                      closeAll();
                      onHelp();
                    }}
                    type="button"
                  >
                    {label}
                  </button>
                </li>
              );
            }

            /* Individual/HUF is the only section with anything behind it, so it
               is the only one that opens. The rest are named and stopped. */
            if (section.state === "live") {
              const isOpen = open === section.id;
              return (
                <li key={section.id}>
                  <button
                    aria-controls={panelId}
                    aria-expanded={isOpen}
                    className="navlink"
                    data-section={section.id}
                    onClick={() => setOpen(isOpen ? null : section.id)}
                    type="button"
                  >
                    {label}
                    <ChevronIcon className={isOpen ? "nav-chevron is-open" : "nav-chevron"} />
                  </button>
                </li>
              );
            }

            return (
              <li key={section.id}>
                <button
                  aria-disabled="true"
                  aria-label={`${label}, ${common.navPlanned}`}
                  className="navlink is-off"
                  data-section={section.id}
                  disabled
                  title={common.navPlannedTip}
                  type="button"
                >
                  {label}
                  <LockIcon className="nav-lock" />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {openSection && (
        <div className="navpanel" id={panelId}>
          <div className="shell navpanel-inner">
            <ul className="navpanel-list">
              {openSection.services.map((id) => {
                const service = serviceById(id);
                const name = common.serviceNames[id];
                const note = common.serviceNotes[id];
                if (service?.state === "live") {
                  return (
                    <li key={id}>
                      <button
                        className="navservice"
                        onClick={() => {
                          closeAll();
                          onService(id);
                        }}
                        type="button"
                      >
                        <span className="navservice-name">{name}</span>
                        <span className="navservice-note">{note}</span>
                        <span className="navservice-flag is-live">{common.navLive}</span>
                      </button>
                    </li>
                  );
                }
                return (
                  <li key={id}>
                    <span className="navservice is-off">
                      <span className="navservice-name">{name}</span>
                      <span className="navservice-note">{note}</span>
                      <span className="navservice-flag">{common.navPlanned}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="navpanel-note">{common.navScopeNote}</p>
          </div>
        </div>
      )}
    </div>
  );
}
