"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { SlidersIcon } from "./icons";
import type { copy } from "../content";
import type { Language, TextScale, Theme } from "../case-data";

type Common = (typeof copy)["en"];

/* Long enough that crossing the masthead does not open it, short enough that
   arriving deliberately does not feel like waiting. */
const HOVER_OPEN_DELAY = 180;

/* Longer than opening: this one has to cover the gap between the icon and the
   menu below it. */
const HOVER_CLOSE_DELAY = 320;

export function SettingsMenu({
  common,
  language,
  lowData,
  onClose,
  onLanguage,
  onLowData,
  onTextScale,
  onTheme,
  onToggle,
  open,
  textScale,
  theme,
}: {
  common: Common;
  language: Language;
  lowData: boolean;
  onClose: () => void;
  onLanguage: (value: Language) => void;
  onLowData: (value: boolean) => void;
  onTextScale: (value: TextScale) => void;
  onTheme: (value: Theme) => void;
  onToggle: () => void;
  open: boolean;
  textScale: TextScale;
  theme: Theme;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const id = useId();

  /* Opening on hover and closing on leave, with two delays and one exception.

     A menu that opened the instant the pointer touched the icon would open
     every time somebody crossed the masthead on their way somewhere else, so
     the pointer has to settle. Leaving is given longer than arriving, because
     the trip from the icon down to the menu passes over the gap between them
     and must not be read as leaving.

     The exception is a menu opened by a click. Somebody who clicked has asked
     for it deliberately and expects it to stay until they dismiss it, so a
     click pins it and only an outside click, Escape, or a second click on the
     icon puts it away. A menu holding the keyboard focus is never taken away
     under the person using it either. */
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pinned = useRef(false);

  const stopTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const dismiss = useCallback(() => {
    stopTimer();
    pinned.current = false;
    onClose();
  }, [onClose]);

  const hoverIn = () => {
    stopTimer();
    if (open) return;
    timer.current = setTimeout(onToggle, HOVER_OPEN_DELAY);
  };

  const hoverOut = () => {
    stopTimer();
    if (!open || pinned.current) return;
    timer.current = setTimeout(() => {
      if (wrap.current?.contains(document.activeElement)) return;
      onClose();
    }, HOVER_CLOSE_DELAY);
  };

  useEffect(() => stopTimer, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!wrap.current?.contains(event.target as Node)) dismiss();
    };
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [dismiss, open]);

  /* Four now, so the control is two rows of two rather than one row of four
     with "Match device" squeezed into a quarter of a menu. */
  const themes: [Theme, string][] = [
    ["dark", common.settingsDark],
    ["light", common.settingsLight],
    ["paper", common.settingsPaper],
    ["system", common.settingsSystem],
  ];

  const sizes: [TextScale, string, string][] = [
    ["base", "A", common.settingsTextNormal],
    ["large", "A", common.settingsTextLarge],
    ["larger", "A", common.settingsTextLargest],
  ];

  const sizeName =
    sizes.find(([value]) => value === textScale)?.[2] ?? common.settingsTextNormal;

  return (
    <div
      className="menu-wrap"
      onMouseEnter={hoverIn}
      onMouseLeave={hoverOut}
      ref={wrap}
    >
      <button
        aria-label={common.settings}
        aria-controls={id}
        aria-expanded={open}
        className="tool-btn"
        onClick={() => {
          stopTimer();
          /* A click on an open menu closes it for good; a click on a shut one
             opens it and keeps it open. */
          pinned.current = !open;
          onToggle();
        }}
        type="button"
      >
        <SlidersIcon />
        <span className="tool-label">{common.settings}</span>
      </button>

      {open && (
        /* Anyone who has started changing settings means to stay. Without
           this, choosing a larger text size grew the menu out from under a
           pointer that had not moved, which counts as leaving and shut the
           menu on them mid-decision. */
        <div
          className="menu"
          id={id}
          onClickCapture={() => {
            stopTimer();
            pinned.current = true;
          }}
        >
          <div className="menu-group">
            <span className="label" id={`${id}-lang`}>
              {common.settingsLanguage}
            </span>
            <div aria-labelledby={`${id}-lang`} className="segmented segmented-lang" role="group">
              <button
                aria-pressed={language === "en"}
                lang="en"
                onClick={() => onLanguage("en")}
                type="button"
              >
                {common.english}
              </button>
              <button
                aria-pressed={language === "hi"}
                lang="hi"
                onClick={() => onLanguage("hi")}
                type="button"
              >
                {common.hindi}
              </button>
            </div>
          </div>

          <div className="menu-group">
            <span className="label" id={`${id}-theme`}>
              {common.settingsAppearance}
            </span>
            <div
              aria-labelledby={`${id}-theme`}
              className="segmented segmented-theme"
              role="group"
            >
              {themes.map(([value, label]) => (
                <button
                  aria-pressed={theme === value}
                  key={value}
                  onClick={() => onTheme(value)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="menu-group">
            <span className="label" id={`${id}-size`}>
              {common.settingsTextSize}
            </span>
            <div aria-labelledby={`${id}-size`} className="segmented segmented-size" role="group">
              {sizes.map(([value, glyph, name]) => (
                <button
                  aria-pressed={textScale === value}
                  key={value}
                  onClick={() => onTextScale(value)}
                  type="button"
                >
                  <span aria-hidden="true" data-size={value}>
                    {glyph}
                  </span>
                  <span className="sr-only">{name}</span>
                </button>
              ))}
            </div>
            {/* The glyphs show the sizes; this says which one is on. */}
            <p className="menu-hint">{sizeName}</p>
          </div>

          <div className="menu-group">
            <label className="switch-row" htmlFor={`${id}-data`}>
              <input
                aria-describedby={`${id}-data-hint`}
                checked={lowData}
                id={`${id}-data`}
                onChange={(event) => onLowData(event.target.checked)}
                type="checkbox"
              />
              <span className="switch-title">{common.settingsData}</span>
            </label>
            <p className="menu-hint switch-hint" id={`${id}-data-hint`}>
              {common.settingsDataHint}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
