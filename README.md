# AI Chat Agent

A **Next.js 13/14 Chat App** inspired by Claude, Perplexity, and modern conversational AI UIs.
Built with React, TypeScript, and Tailwind CSS.

---

## Features

- 🔄 **Streaming AI chat** with question pinning (persistence while scrolling)
- 💬 **Sidebar chat history**, multi-session storage
- ⌨️ **Command menu** (keyboard shortcuts)
- 🧑‍💻 **Code artifact display** (copy, edit, regenerate questions)
- 🎨 Styled with Tailwind CSS and custom dark theme

---

## Demo

_Coming soon: [vercel app url/link goes here]_

---

## Getting Started

git clone https://github.com/Johanabhishek/ai-chat-agent-jo.git
cd ai-chat-agent-jo
npm install
npm run dev

App runs by default at [http://localhost:3000](http://localhost:3000) (or next available port).

---

## File Structure

/app
layout.tsx
page.tsx
/components
Sidebar.tsx
ChatBubble.tsx
PromptBar.tsx
...
/lib
storage.ts
/hooks
useChatStream.ts
/public
/styles
globals.css
...


---

## Configuration & Customization

- All environment variables (if needed) in `.env.local`
- Path aliases set in `tsconfig.json`
- Update `package.json` for custom scripts or metadata

---

## Credits & Inspiration

Based on the UX and interaction models from:
- [Perplexity AI](https://www.perplexity.ai/)
- [Anthropic Claude](https://claude.ai/)
- [OpenAI ChatGPT UI]

---

## License

[MIT](LICENSE)

---

*Built with ❤️ by Johanabhishek.*
