"use client";
import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import StickyHeader from "@/components/StickyHeader";
import ChatBubble from "@/components/ChatBubble";
import PromptBar from "@/components/PromptBar";
import { useChatStream } from "@/hooks/useChatStream";
import {
  saveSession,
  loadSession,
  getAllSessionIds,
  deleteSession,
} from "@/lib/storage";

// --- CommandMenu Component ---
function CommandMenu({
  actions,
}: {
  actions: { name: string; shortcut: string; onAction: () => void }[];
}) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape" && open) setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center">
      <div className="mt-32 w-full max-w-md bg-white rounded-2xl p-2 shadow-2xl">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a command…"
          className="w-full px-3 py-2 text-lg rounded-lg border mb-1 focus:outline-none"
        />
        <ul>
          {actions.map((action) => (
            <li key={action.name}>
              <button
                className="w-full flex justify-between items-center px-3 py-2 rounded hover:bg-[#e7effc] text-base font-medium"
                onClick={() => {
                  setOpen(false);
                  action.onAction();
                }}
              >
                <span>{action.name}</span>
                <kbd className="text-xs bg-[#e0e4ee] px-2 py-1 rounded">{action.shortcut}</kbd>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// --- ChatMessage Type ---
type ChatMessage = {
  sender: "user" | "ai";
  message?: string;
  question?: string;
  answer?: string;
  codeBlock?: string;
};

// --- Mock Data ---
const mockQA: ChatMessage[] = [
  {
    sender: "ai",
    question: "What is Transfer Learning?",
    answer: "Transfer learning is a technique in ML where a pretrained model is adapted for a new but related task...",
    codeBlock: "# Sample PyTorch Transfer Learning\nimport torchvision.models as models\nmodel = models.resnet50(pretrained=True)",
  },
  {
    sender: "ai",
    question: "Show me STL decomposition code in Python.",
    answer: "Here's how you do STL decomposition using statsmodels:",
    codeBlock: "from statsmodels.tsa.seasonal import STL\nres = STL(series).fit()\ntrend = res.trend",
  },
  {
    sender: "ai",
    question: "Claude vs Perplexity: compare UX details.",
    answer:
      "Both have sticky headers, streaming, artifacts (code/markdown). Perplexity keeps question pinned as you scroll long answers...",
    codeBlock:
      "| Feature         | Claude | Perplexity |\n|----------------|--------|------------|\n| Sticky header  | Yes    | Yes        |\n| Artifacts      | Yes    | Yes        |",
  },
];

// --- Main Page Component ---
export default function HomePage() {
  const [activeSession, setActiveSession] = useState(() => {
    const allSessions = typeof window !== "undefined" ? getAllSessionIds() : [];
    return allSessions.length ? allSessions[0] : "1";
  });
  const [sessionIds, setSessionIds] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [lastUserQuestion, setLastUserQuestion] = useState<string>("");
  const [input, setInput] = useState("");
  const [focusInput, setFocusInput] = useState(false);

  // --- Actions for CommandMenu ---
  const actions = [
    {
      name: "New Chat",
      shortcut: "Ctrl+N",
      onAction: () => {
        setMessages([]);
        setInput("");
      },
    },
    {
      name: "Clear History",
      shortcut: "Ctrl+Shift+C",
      onAction: () => {
        setMessages([]);
        sessionIds.forEach((sid) => deleteSession(sid));
        setSessionIds(["1"]);
        setActiveSession("1");
      },
    },
    {
      name: "Focus PromptBar",
      shortcut: "F",
      onAction: () => setFocusInput(true),
    },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSessionIds(getAllSessionIds().length ? getAllSessionIds() : ["1"]);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const history = loadSession(activeSession);
      setMessages(history && history.length ? history : mockQA);
    }
  }, [activeSession]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      saveSession(activeSession, messages);
      setSessionIds(getAllSessionIds().length ? getAllSessionIds() : [activeSession]);
    }
  }, [messages, activeSession]);

  const lastAI = messages.filter((m) => m.sender === "ai").slice(-1)[0];
  const lastAIAnswer = lastAI?.answer || "";
  const streamedAnswer = useChatStream(lastAIAnswer, streaming);

  function handleSend(input: string) {
    const userMsg = { sender: "user", message: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setLastUserQuestion(input);
    setStreaming(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        sender: "ai",
        question: input,
        answer: `This is a mock Claude/Perplexity-style streamed response for "${input}".\n\n(Implement streaming logic here)`,
        codeBlock: input.toLowerCase().includes("code")
          ? "# Mock code block\nprint('Hello, world!')"
          : undefined,
      };
      setMessages((msgs) => [...msgs, userMsg, aiMsg]);
      setStreaming(false);
    }, 2500); // Loader visible for 2.5s
  }

  function handleSwitchSession(newId: string) {
    setActiveSession(newId);
    const history = loadSession(newId);
    setMessages(history && history.length ? history : mockQA);
  }

  return (
    <main className="flex min-h-screen bg-[#16171f] text-[#e4e6eb]">
      {/* CommandMenu at the root of your page */}
      <CommandMenu actions={actions} />
      <Sidebar
        activeSessionId={activeSession}
        onSwitch={handleSwitchSession}
        sessions={sessionIds}
      />
      <section className="flex-1 flex flex-col px-8 py-8">
        <StickyHeader
          question={lastAI?.question || lastUserQuestion || "Welcome"}
        />
        <div className="flex flex-col gap-2 mt-6">
          {messages.map((msg, idx) =>
            msg.sender === "ai" ? (
              <ChatBubble
                key={idx}
                message={msg.answer ?? ""}
                sender="ai"
                streaming={false}
                codeBlock={msg.codeBlock}
                onCopy={() => navigator.clipboard.writeText(msg.answer ?? "")}
                onEditPrompt={() => {
                  setInput(msg.question ?? "");
                  setFocusInput(true);
                }}
                onRegenerate={() => handleSend(msg.question ?? "")}
              />
            ) : (
              <div className="flex flex-col flex-1 px-8 mt-6 gap-4 pb-8 overflow-y-auto">
                <ChatBubble key={idx} message={msg.message || ""} sender="user" streaming={false} />
              </div>
            )
          )}
          {/* Show loader bubble when streaming */}
          {streaming && (
            <ChatBubble key="loader" message="" sender="ai" streaming={true} />
          )}
        </div>
        <div className="mt-6 border-t pt-6">
          <PromptBar
            onSend={handleSend}
            streaming={streaming}
            input={input}
            setInput={setInput}
            focusInput={focusInput}
            setFocusInput={setFocusInput}
          />
        </div>
      </section>
    </main>
  );
}
