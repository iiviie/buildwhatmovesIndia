import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

Object.defineProperty(window, "matchMedia", {
  configurable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  }),
});

Object.defineProperty(window, "scrollTo", {
  configurable: true,
  value: () => undefined,
});

Object.defineProperty(window, "print", {
  configurable: true,
  value: () => undefined,
});

/* jsdom implements no layout, so it has no scrollIntoView. Every real browser
   does, and the interface uses it to take a reader to the field they were
   stopped on, so it is stubbed here rather than guarded in the app. */
Object.defineProperty(Element.prototype, "scrollIntoView", {
  configurable: true,
  value: () => undefined,
});
