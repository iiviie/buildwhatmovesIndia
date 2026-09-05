import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Hovercard } from "../app/components/Hovercard";
import { SearchTrigger } from "../app/components/SearchTrigger";

/* The delays are the feature, so they are what these tests are about. The
   numbers mirror the constants in Hovercard.tsx: 500ms cold, 150ms while the
   group is warm, 160ms to close, and the group stays warm for 900ms. */
const COLD = 500;
const WARM = 150;
const CLOSE = 160;
const FORGET_WARM = 1000;

const card = (name: string) => (
  <Hovercard key={name} label={`What is ${name}?`} panel={<p>{name} explained</p>}>
    {name}
  </Hovercard>
);

/* Wrapped in act because the open and close are both state changes made from
   a timer, and advancing the clock outside act leaves React's queue unflushed. */
const tick = (ms: number) => {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
};

beforeEach(() => {
  vi.useFakeTimers();
  /* Each test starts cold, whatever the previous one left behind in the
     module-level warm window. */
  tick(FORGET_WARM);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("hover delay", () => {
  it("does not open the moment the pointer arrives", () => {
    render(card("TDS"));
    fireEvent.mouseEnter(screen.getByRole("button"));

    tick(COLD - 50);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("opens once the pointer has rested on the term", () => {
    render(card("TDS"));
    fireEvent.mouseEnter(screen.getByRole("button"));

    tick(COLD);
    expect(screen.getByRole("tooltip")).toHaveTextContent("TDS explained");
  });

  it("stays shut when the pointer was only passing over", () => {
    render(card("TDS"));
    const trigger = screen.getByRole("button");

    fireEvent.mouseEnter(trigger);
    tick(COLD - 100);
    fireEvent.mouseLeave(trigger.parentElement as HTMLElement);
    tick(COLD);

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("waits before closing, so the pointer can reach the panel", () => {
    render(card("TDS"));
    const trigger = screen.getByRole("button");

    fireEvent.mouseEnter(trigger);
    tick(COLD);
    fireEvent.mouseLeave(trigger.parentElement as HTMLElement);

    tick(CLOSE - 60);
    expect(screen.queryByRole("tooltip")).toBeInTheDocument();

    tick(CLOSE);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("opens the next term faster while the reader is still reading", () => {
    render(
      <>
        {card("TDS")}
        {card("TCS")}
      </>,
    );
    const [first, second] = screen.getAllByRole("button");

    fireEvent.mouseEnter(first);
    tick(COLD);
    fireEvent.mouseLeave(first.parentElement as HTMLElement);
    tick(CLOSE);

    fireEvent.mouseEnter(second);
    tick(WARM);
    expect(screen.getByRole("tooltip")).toHaveTextContent("TCS explained");
  });
});

describe("keyboard and screen reader", () => {
  it("opens on focus without a delay, because that was deliberate", () => {
    render(card("TDS"));
    fireEvent.focus(screen.getByRole("button"));

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("closes on Escape", () => {
    render(card("TDS"));
    fireEvent.focus(screen.getByRole("button"));
    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("names the trigger as a question and describes it with the panel", () => {
    render(card("Form 26AS"));
    const trigger = screen.getByRole("button", { name: "What is Form 26AS?" });

    fireEvent.focus(trigger);
    expect(trigger).toHaveAttribute(
      "aria-describedby",
      screen.getByRole("tooltip").id,
    );
  });

  it("drops the description again once closed", () => {
    render(card("TDS"));
    const trigger = screen.getByRole("button");

    fireEvent.focus(trigger);
    fireEvent.blur(trigger);
    expect(trigger).not.toHaveAttribute("aria-describedby");
  });
});

describe("without a hover-capable pointer", () => {
  /* There is no media-query branch in the component any more. A first version
     asked `(hover: none)` and switched the pointer handling off when it
     matched — and headless Chrome answers `hover: none` with no fine pointer
     at all, which silently disabled the whole jargon layer in a real browser
     while every jsdom test still passed. Tapping now works everywhere. */
  it("opens on click, so a touch device can reach it at all", () => {
    render(card("TDS"));
    const trigger = screen.getByRole("button");

    fireEvent.click(trigger);
    expect(screen.getByRole("tooltip")).toHaveTextContent("TDS explained");
  });

  it("closes again on a second click", () => {
    render(card("TDS"));
    const trigger = screen.getByRole("button");

    fireEvent.click(trigger);
    fireEvent.click(trigger);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("reports its open state, since it behaves as a disclosure", () => {
    render(card("TDS"));
    const trigger = screen.getByRole("button");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});

describe("when the page moves", () => {
  /* Tabbing to a term below the fold makes the browser scroll it into view,
     and that scroll lands after the focus. Closing on any scroll meant the
     card opened and instantly shut itself, which only showed up in a real
     browser. It now follows the term instead. */
  it("stays open when a scroll brings its own term into view", () => {
    render(card("TDS"));
    fireEvent.focus(screen.getByRole("button"));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });
});

describe("one at a time", () => {
  it("closes the open card when another opens", () => {
    render(
      <>
        {card("TDS")}
        {card("TCS")}
      </>,
    );
    const [first, second] = screen.getAllByRole("button");

    fireEvent.focus(first);
    fireEvent.focus(second);

    const panels = screen.getAllByRole("tooltip");
    expect(panels).toHaveLength(1);
    expect(panels[0]).toHaveTextContent("TCS explained");
  });
});

describe("a trigger that is also a control", () => {
  it("runs its action on click and still previews on hover", () => {
    const onClick = vi.fn();
    render(
      <Hovercard label="Step 3" onClick={onClick} panel={<p>What step 3 asks</p>}>
        Your other income
      </Hovercard>,
    );
    const trigger = screen.getByRole("button");

    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalledOnce();

    fireEvent.mouseEnter(trigger);
    tick(COLD);
    expect(screen.getByRole("tooltip")).toHaveTextContent("What step 3 asks");

    fireEvent.click(trigger);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("can reserve rich previews for keyboard focus", () => {
    render(
      <Hovercard
        label="Step 2"
        onClick={() => undefined}
        openOnHover={false}
        panel={<p>What step 2 asks</p>}
      >
        Your salary
      </Hovercard>,
    );
    const trigger = screen.getByRole("button");

    fireEvent.mouseEnter(trigger);
    tick(COLD);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    fireEvent.focus(trigger);
    expect(screen.getByRole("tooltip")).toHaveTextContent("What step 2 asks");
  });

  it("does not cover the current step with its own preview", () => {
    render(
      <Hovercard current label="Current step" panel={<p>Current preview</p>}>
        Verify and finish
      </Hovercard>,
    );
    const trigger = screen.getByRole("button");

    fireEvent.focus(trigger);
    fireEvent.mouseEnter(trigger);
    tick(COLD);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("previews a step it will not let you open yet", () => {
    const onClick = vi.fn();
    render(
      <Hovercard
        label="Step 5"
        onClick={onClick}
        panel={<p>What step 5 asks</p>}
        unavailable
      >
        Before you file
      </Hovercard>,
    );
    const trigger = screen.getByRole("button");

    /* aria-disabled rather than disabled: a disabled button takes neither
       hover nor focus, and a step you cannot reach yet is exactly the one
       whose preview is worth reading. */
    expect(trigger).toHaveAttribute("aria-disabled", "true");
    expect(trigger).not.toBeDisabled();

    fireEvent.click(trigger);
    expect(onClick).not.toHaveBeenCalled();

    fireEvent.focus(trigger);
    expect(screen.getByRole("tooltip")).toHaveTextContent("What step 5 asks");
  });
});

/* The masthead search shares this file because it is the same discovery
   problem: something that only announced itself once you had already found it.
   The shortcut used to be written inside the hovercard on the magnifying
   glass, which is to say it was written where only people who did not need it
   would read it. */
describe("the masthead search", () => {
  const setPlatform = (value: string) => {
    Object.defineProperty(window.navigator, "platform", {
      configurable: true,
      value,
    });
  };

  const trigger = () => (
    <SearchTrigger
      label="Search or run a command"
      onOpen={() => undefined}
      placeholder="Search"
    />
  );

  afterEach(() => setPlatform(""));

  it("keeps its spoken name, which the narrow layout hides the words of", () => {
    render(trigger());

    expect(
      screen.getByRole("button", { name: "Search or run a command" }),
    ).toBeInTheDocument();
  });

  it("says Ctrl K away from Apple platforms", () => {
    setPlatform("Win32");
    render(trigger());

    expect(screen.getByRole("button")).toHaveTextContent("Ctrl K");
  });

  it("says ⌘K on a Mac, where that is the key people reach for", () => {
    setPlatform("MacIntel");
    render(trigger());

    expect(screen.getByRole("button")).toHaveTextContent("⌘K");
  });

  /* The server has no platform to ask about. If the first client render
     answered "Mac" while the server had said "Ctrl", hydration would tear. */
  it("renders the neutral hint on the server, whatever the client turns out to be", () => {
    setPlatform("MacIntel");

    expect(renderToStaticMarkup(trigger())).toContain("Ctrl K");
  });

  it("hides the keycap from a screen reader, which does not read keys", () => {
    setPlatform("Win32");
    render(trigger());

    const keys = screen.getByRole("button").querySelector(".search-trigger-keys");
    expect(keys).toHaveAttribute("aria-hidden", "true");
  });

  it("opens the palette", () => {
    const onOpen = vi.fn();
    render(
      <SearchTrigger
        label="Search or run a command"
        onOpen={onOpen}
        placeholder="Search"
      />,
    );

    fireEvent.click(screen.getByRole("button"));
    expect(onOpen).toHaveBeenCalledOnce();
  });
});
