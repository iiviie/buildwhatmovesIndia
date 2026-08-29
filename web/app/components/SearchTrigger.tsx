"use client";

import { useSyncExternalStore } from "react";
import { SearchIcon } from "./icons";

/* Which key opens the palette.

   The handler in SahiReturnApp accepts either modifier, so on a Mac both Ctrl K
   and ⌘K work. Only one of them can be printed on the control, and it has to be
   the one that reader would reach for. */
const applePlatform = () => {
  if (typeof navigator === "undefined") return false;
  const agent = navigator as Navigator & { userAgentData?: { platform?: string } };
  /* iPadOS reports itself as "MacIntel", which is right for this purpose: an
     iPad with a keyboard attached has a ⌘ key on it. The user agent is only
     read where the platform is missing, because a Windows user agent carries
     the string "AppleWebKit" and a loose test on it would print ⌘K there. */
  const platform = agent.userAgentData?.platform ?? agent.platform ?? "";
  return /mac|iphone|ipad|ipod/i.test(platform || agent.userAgent || "");
};

export function SearchTrigger({
  label,
  onOpen,
  placeholder,
}: {
  /** The control's spoken name, e.g. "Search or run a command". */
  label: string;
  onOpen: () => void;
  /** The word in the field, e.g. "Search". Kept short deliberately: the field
      shares the masthead with five other controls, and a placeholder cut off
      after two words would be worse than the icon it replaced. It is the first
      word of the name, so the two do not disagree for anyone matching what
      they see against what their screen reader says. */
  placeholder: string;
}) {
  /* The page is server-rendered, and the server has no platform to ask about.
     Rendering the Apple hint on the first client paint would therefore differ
     from the markup the server sent and hydration would tear. Both halves
     render Ctrl — the right answer for most readers of this service — and
     React swaps in the client's answer after hydrating. Nothing ever changes
     afterwards, so there is nothing to subscribe to. */
  const apple = useSyncExternalStore(
    () => () => undefined,
    applePlatform,
    () => false,
  );

  return (
    <button
      /* The placeholder disappears below the width where it fits, and with it
         the button's only text, so the name is spelled out here rather than
         left to the visible word. */
      aria-label={label}
      className="search-trigger"
      onClick={onOpen}
      type="button"
    >
      <SearchIcon />
      <span className="search-trigger-text">{placeholder}</span>
      {/* Repeating the name to a screen reader as "Ctrl K" would be noise, and
          the shortcut is announced nowhere else because a screen reader user
          reaches the same panel by tabbing to this button. */}
      <span aria-hidden="true" className="search-trigger-keys">
        {apple ? "⌘K" : "Ctrl K"}
      </span>
    </button>
  );
}
