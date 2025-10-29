// src/hooks/useSearch.ts
import { useState, useCallback } from "react";

export function useSearch<T>(
  searchFn: (q: string) => Promise<T[]>,
  minLen = 1
) {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [highlight, setHighlight] = useState(0);

  const search = useCallback(
    (q: string) => {
      setInput(q);
      if (q.length >= minLen) {
        searchFn(q).then(setResults);
      } else {
        setResults([]);
      }
      setHighlight(0);
    },
    [searchFn, minLen]
  );

  function move(up: boolean) {
    setHighlight(old =>
      Math.max(0, Math.min(results.length - 1, old + (up ? -1 : 1)))
    );
  }

  function select() {
    return results[highlight];
  }

  function clear() {
    setResults([]);
    setHighlight(0);
  }

  return { input, search, results, highlight, move, select, clear, setHighlight };
}
