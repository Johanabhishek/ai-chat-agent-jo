"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import AILoader from "./AILoader";

type ChatBubbleProps = {
  message: string;
  sender: "user" | "ai";
  streaming?: boolean;
  codeBlock?: string;
  onCopy?: () => void;
  onEditPrompt?: () => void;
  onRegenerate?: () => void;
};

export default function ChatBubble({
  message,
  sender,
  streaming = false,
  codeBlock,
  onCopy,
  onEditPrompt,
  onRegenerate,
}: ChatBubbleProps) {
  const [expanded, setExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  

  return (
    <div
      className={cn(
        "my-4 flex",
        sender === "user" ? "justify-end" : "justify-start"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        className={cn(
          "max-w-2xl rounded-2xl p-5 whitespace-pre-line group relative",
          sender === "ai"
            ? "bg-[#22242b] text-white border border-[#1b1c23] shadow-xl"
            : "bg-white text-[#181921] border border-gray-200 shadow"
            
        )}
        style={{
          boxShadow:
            sender === "ai"
              ? "0 4px 18px rgba(26,32,44,.17)"
              : "0 2px 8px rgba(54,56,77,.10)",
        }}
      >
        {/* Actions for AI bubble */}
        {sender === "ai" && showActions && !streaming && (
          <div className="absolute flex gap-1 top-3 right-4 z-10">
            <Button
              variant="ghost"
              className="px-2 py-1 rounded text-xs hover:bg-[#282b35] hover:text-blue-400 transition"
              onClick={onCopy}
              tabIndex={-1}
            >📋</Button>
            <Button
              variant="ghost"
              className="px-2 py-1 rounded text-xs hover:bg-[#282b35] hover:text-green-400 transition"
              onClick={onEditPrompt}
              tabIndex={-1}
            >✏️</Button>
            <Button
              variant="ghost"
              className="px-2 py-1 rounded text-xs hover:bg-[#282b35] hover:text-purple-400 transition"
              onClick={onRegenerate}
              tabIndex={-1}
            >♻️</Button>
          </div>
        )}

        {/* Code block artifact */}
        {codeBlock ? (
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="font-mono text-xs text-gray-400">Artifact: code preview</span>
              <Button
                variant="ghost"
                className="px-2 py-1 text-xs"
                onClick={() => setExpanded((e) => !e)}
              >
                {expanded ? "Collapse" : "Expand"}
              </Button>
            </div>
            <pre
              className={cn(
                "overflow-x-auto rounded-lg bg-[#181a23] text-[#f3f3fa] text-xs p-3 transition-all",
                expanded ? "max-h-none" : "max-h-24"
              )}
            >
              {codeBlock}
            </pre>
          </div>
        ) : (
          <span className="block text-lg leading-relaxed font-[Inter] tracking-wide">
  {streaming ? <AILoader /> : message}
</span>

        )}
      </div>
    </div>
  );
}
