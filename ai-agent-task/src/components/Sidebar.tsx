"use client";
import React from "react";
import { Button } from "./ui/button";

export default function Sidebar({
  activeSessionId,
  onSwitch,
  sessions = ["1"],
}: {
  activeSessionId: string;
  onSwitch: (id: string) => void;
  sessions?: string[];
}) {
  return (
    <aside className="w-72 min-h-screen bg-[#16171f] text-white border-r border-[#20222a] shadow-2xl flex flex-col font-[Inter]">
      {/* Top row: header and New chat */}
      <div className="flex items-center justify-between pt-6 pb-2 px-6">
        <span className="font-bold text-2xl tracking-tight">Sessions</span>
        {/* New chat action */}
        <Button
          variant="ghost"
          className="px-3 py-1 border border-gray-800 bg-[#20222a] hover:bg-[#23252c] shadow text-lg font-semibold"
          onClick={() => {
            const newID = Date.now().toString();
            onSwitch(newID);
          }}
        >
          +
        </Button>
      </div>
      {/* Sessions list */}
      <div className="flex-1 px-4 py-2 overflow-y-auto">
        <ul className="flex flex-col gap-2">
          {sessions.map((id, idx) => (
            <li key={id}>
              <button
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors border text-base font-medium ${
                  activeSessionId === id
                    ? "bg-white text-black border-white shadow-md"
                    : "bg-[#191a23] text-[#a0a3b9] border-transparent hover:bg-[#1e212b] hover:text-white"
                }`}
                style={{
                  fontWeight: activeSessionId === id ? "bold" : 500,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                onClick={() => onSwitch(id)}
              >
                {idx === 0 ? "Chat 1" : `Chat ${idx + 1}`}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Footer: soft app version/info */}
      <div className="px-6 py-4 text-xs text-gray-500 border-t border-[#20222a] tracking-wide">
        Perplexity Clone <br /> v1.0
      </div>
    </aside>
  );
}
