"use client";

import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "./Modal";
import { SearchIcon } from "./icons";
import type { copy } from "../content";

export type Command = {
  id: string;
  group: string;
  title: string;
  subtitle?: string;
  keywords?: string;
  run: () => void;
};

type Common = (typeof copy)["en"];

const normalise = (value: string) => value.toLowerCase().trim();

/* Swiss-directory shape: a wide panel, one column per part of the service,
   generous space, and a search with a filter over the same set. Each column is
   kept short on purpose — a citizen scanning a menu holds about seven things at
   once, so the grouping does the work that a long flat list cannot. */
export function CommandPalette({
  commands,
  common,
  currentStep,
  onClose,
}: {
  commands: Command[];
  common: Common;
  currentStep: string;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const groups = useMemo(() => {
    const order: string[] = [];
    for (const command of commands) {
      if (!order.includes(command.group)) order.push(command.group);
    }
    return order;
  }, [commands]);

  const results = useMemo(() => {
    const term = normalise(query);
    return commands.filter((command) => {
      if (filter && command.group !== filter) return false;
      if (!term) return true;
      return normalise(
        `${command.title} ${command.subtitle ?? ""} ${command.keywords ?? ""} ${command.group}`,
      ).includes(term);
    });
  }, [commands, filter, query]);

  const searching = query.trim().length > 0;

  const visibleGroups = useMemo(
    () => groups.filter((group) => results.some((r) => r.group === group)),
    [groups, results],
  );

  useEffect(() => {
    const option = listRef.current?.querySelector('[data-active="true"]');
    option?.scrollIntoView?.({ block: "nearest" });
  }, [active, results]);

  const move = (delta: number) => {
    if (results.length === 0) return;
    setActive((current) => (current + delta + results.length) % results.length);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      move(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActive(Math.max(0, results.length - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const chosen = results[active];
      if (chosen) {
        onClose();
        chosen.run();
      }
    }
  };

  const reset = (next: string) => {
    setFilter(next);
    setActive(0);
  };

  const renderOption = (command: Command) => {
    const index = results.indexOf(command);
    return (
      <button
        aria-selected={index === active}
        className="panel-item"
        data-active={index === active}
        id={`cmd-${command.id}`}
        key={command.id}
        onClick={() => {
          onClose();
          command.run();
        }}
        onMouseEnter={() => setActive(index)}
        role="option"
        tabIndex={-1}
        type="button"
      >
        <span className="panel-item-title">{command.title}</span>
        {command.subtitle && (
          <span className="panel-item-sub">{command.subtitle}</span>
        )}
      </button>
    );
  };

  return (
    <Modal
      backdropClassName="panel-backdrop"
      className="panel"
      initialFocus={searchRef}
      labelledBy="panel-label"
      onClose={onClose}
    >
      <div className="shell panel-inner">
        <div className="panel-head">
          <div>
            <p className="label">{common.commandHere}</p>
            <h2 className="panel-here" id="panel-label">
              {currentStep}
            </h2>
          </div>
          <button
            aria-label={common.close}
            className="modal-close"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="panel-search">
          <SearchIcon />
          <input
            aria-activedescendant={
              results[active] ? `cmd-${results[active].id}` : undefined
            }
            aria-autocomplete="list"
            aria-controls="panel-list"
            aria-expanded="true"
            aria-label={common.commandPlaceholder}
            autoComplete="off"
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder={common.commandPlaceholder}
            ref={searchRef}
            role="combobox"
            type="text"
            value={query}
          />
        </div>

        <div className="panel-filter" role="group" aria-label={common.commandFilter}>
          <span className="label">{common.commandFilter}</span>
          <button
            aria-pressed={filter === ""}
            className="filter-btn"
            onClick={() => reset("")}
            type="button"
          >
            {common.commandAll}
          </button>
          {groups.map((group) => (
            <button
              aria-pressed={filter === group}
              className="filter-btn"
              key={group}
              onClick={() => reset(group)}
              type="button"
            >
              {group}
            </button>
          ))}
        </div>

        <div className="panel-body" ref={listRef}>
          {results.length === 0 ? (
            <p className="panel-empty">{common.commandNoResults}</p>
          ) : searching ? (
            <div
              aria-label={common.commandTrigger}
              className="panel-results"
              id="panel-list"
              role="listbox"
            >
              {results.map(renderOption)}
            </div>
          ) : (
            <div
              aria-label={common.commandTrigger}
              className="panel-grid"
              id="panel-list"
              role="listbox"
            >
              {visibleGroups.map((group) => (
                <div aria-label={group} key={group} role="group">
                  <p className="label panel-group">{group}</p>
                  {results
                    .filter((command) => command.group === group)
                    .map(renderOption)}
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="panel-foot">
          <span>↑ ↓ {common.commandNavigate}</span>
          <span>↵ {common.commandRun}</span>
          <span>Esc {common.commandClose}</span>
          <span>{common.commandHint}</span>
        </p>
      </div>
    </Modal>
  );
}
