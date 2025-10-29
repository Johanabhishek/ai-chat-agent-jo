// src/lib/mockApi.ts

// Basic mock for Q&A suggestions
export function searchSuggestions(query: string): Promise<string[]> {
  const corpus = [
    "What is transfer learning?",
    "Explain STL decomposition.",
    "Show ResNet50 TensorFlow code.",
    "Claude vs Perplexity: UX details.",
    "Best resources for data-centric AI?",
    "Tips for GATE CSE prep.",
    "How to use shadcn/ui in Next.js?",
  ];
  if (!query.trim()) return Promise.resolve([]);
  const q = query.toLowerCase();
  return Promise.resolve(
    corpus.filter(s => s.toLowerCase().includes(q)).slice(0, 5)
  );
}

// Mock for user mentions (big dataset simulated)
export function searchPeople(term: string): Promise<string[]> {
  const names = Array.from({ length: 1000 }, (_, i) => `User${i + 1}`);
  if (!term.trim()) return Promise.resolve([]);
  return Promise.resolve(
    names.filter(n => n.toLowerCase().includes(term.toLowerCase())).slice(0, 8)
  );
}
