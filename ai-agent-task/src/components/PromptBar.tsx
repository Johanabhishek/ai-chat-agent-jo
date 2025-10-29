"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { searchSuggestions, searchPeople } from "@/lib/mockApi";
import { useSearch } from "@/hooks/useSearch";

export default function PromptBar({
  onSend,
  streaming,
  input,
  setInput,
  focusInput,
  setFocusInput,
}: {
  onSend: (input: string) => void;
  streaming?: boolean;
  input: string;
  setInput: (str: string) => void;
  focusInput?: boolean;
  setFocusInput?: (v: boolean) => void;
}) {
  const [showMention, setShowMention] = useState(false);
  const mentionStart = useRef<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusInput && inputRef.current) {
      inputRef.current.focus();
      setFocusInput && setFocusInput(false);
    }
  }, [focusInput, setFocusInput]);

  const suggest = useSearch(searchSuggestions, 1);
  const mention = useSearch(searchPeople, 1);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setInput(val);

    // @ mention logic and suggestions
    const at = val.lastIndexOf("@");
    if (at >= 0) {
      setShowMention(true);
      mention.search(val.slice(at + 1));
      mentionStart.current = at;
    } else {
      setShowMention(false);
      mention.clear();
    }
    suggest.search(val);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (showMention && mention.results.length) mention.move(e.key === "ArrowUp");
      else if (suggest.results.length) suggest.move(e.key === "ArrowUp");
    } else if (e.key === "Enter") {
      if (showMention && mention.results.length) {
        selectMention();
        return;
      }
      if (suggest.results.length) {
        setInput(suggest.select());
        suggest.clear();
      }
      if (input.trim() && !streaming) {
        onSend(input);
        setInput("");
        suggest.clear();
      }
    } else if (e.key === "Escape") {
      suggest.clear();
      mention.clear();
      setShowMention(false);
    }
  }

  function selectMention() {
    if (mention.results.length && mentionStart.current >= 0) {
      const chosen = mention.select();
      setInput(
        input.slice(0, mentionStart.current + 1) + chosen + " "
      );
      mention.clear();
      setShowMention(false);
    }
  }

  function boldMatch(item: string, query: string) {
    const idx = item.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return item;
    return (
      <>
        {item.slice(0, idx)}
        <b>{item.slice(idx, idx + query.length)}</b>
        {item.slice(idx + query.length)}
      </>
    );
  }

  // --- DESIGN BLOCK ---

  return (
    <div className="relative w-full">
      <form
        className="flex gap-3 items-center py-3 px-6 bg-[#16171f] rounded-2xl border border-[#22242a] shadow-lg"
        style={{ margin: "0 auto", maxWidth: "820px" }}
        onSubmit={e => {
          e.preventDefault();
          if (!input.trim() || streaming) return;
          onSend(input);
          setInput("");
          suggest.clear();
        }}
      >
        <input
          ref={inputRef}
          type="text"
          className="flex-1 px-4 py-2 rounded-xl border border-[#23242a] bg-[#191a23] text-white text-lg focus:ring-2 focus:ring-[#4f8cff] outline-none transition tracking-wide shadow"
          placeholder={
            streaming ? "Wait for response..." : "Type a question, code, or ask for ideas…"
          }
          value={input}
          disabled={streaming}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <Button
          type="submit"
          className={`rounded-xl px-5 py-2 font-bold shadow-md transition bg-[#3479fa] text-white text-base hover:bg-[#2465cb]`}
          disabled={!input.trim() || streaming}
        >
          {streaming ? (
            <span className="animate-pulse">…</span>
          ) : (
            "Send"
          )}
        </Button>
      </form>

      {/* Suggestion dropdown */}
      {suggest.results.length > 0 && (
        <ul className="absolute left-0 right-0 bottom-[120%] z-30 bg-[#16171f] border border-[#23242a] rounded-xl shadow-xl text-base py-2 max-h-64 overflow-y-auto">
          {suggest.results.map((res, idx) => (
            <li
              key={res}
              className={`px-4 py-2 cursor-pointer ${
                idx === suggest.highlight ? "bg-[#e6e9f7] text-[#23242a]" : ""
              }`}
              onClick={() => {
                setInput(res);
                suggest.clear();
              }}
              onMouseEnter={() => suggest.setHighlight(idx)}
            >
              {boldMatch(res, suggest.input)}
            </li>
          ))}
        </ul>
      )}

      {/* Mention dropdown */}
      {showMention && mention.results.length > 0 && (
        <ul className="absolute left-6 right-6 z-20 bg-background border border-[#23242a] rounded-xl mt-2 shadow text-base">
          {mention.results.map((res, idx) => (
            <li
              key={res}
              className={`px-4 py-2 cursor-pointer ${
                idx === mention.highlight ? "bg-[#e4f3e7] text-green-700" : ""
              }`}
              onClick={() => selectMention()}
              onMouseEnter={() => mention.setHighlight(idx)}
            >
              <b>@</b>
              {boldMatch(res, mention.input)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
