import { useState, useEffect } from "react";

// Simulates token-by-token streaming for Claude-style responses
export function useChatStream(fullText: string, streaming: boolean) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!streaming) {
      setDisplayed(fullText);
      return;
    }
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + fullText[i]);
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 40); // adjust for speed
    return () => clearInterval(interval);
  }, [fullText, streaming]);

  return displayed;
}
