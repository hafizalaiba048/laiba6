
"use client";

import { useState, useRef, useEffect } from "react";
import rules from "./rules.json";

type Rule = {
  intent: string;
  keywords: string[];
  reply: string;
};

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

const chatbotRules = rules as Rule[];

const greeting: Message = {
  id: 1,
  sender: "bot",
  text: "Assalam-o-Alaikum! Welcome to UOS Helpdesk Bot. 👋\n\nI can help you with university fees, admissions, class timings, library services, and hostel information.\n\nHow can I help you today?",
};

const fallbackReply =
  "Sorry, I could not understand your question. Please ask about fees, admission, class timings, library, or hostel. You can also contact the relevant University of Sargodha office for assistance.";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [input, setInput] = useState("");
  const [nextId, setNextId] = useState(2);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  function getBotReply(message: string): string {
    const normalizedMessage = message
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");

    for (const rule of chatbotRules) {
      const matched = rule.keywords.some((keyword) =>
        normalizedMessage.includes(keyword.toLowerCase())
      );

      if (matched) {
        return rule.reply;
      }
    }

    return fallbackReply;
  }

  function handleSend() {
    const text = input.trim();

    if (!text || isTyping) return;

    const userMessage: Message = {
      id: nextId,
      sender: "user",
      text,
    };

    const botMessage: Message = {
      id: nextId + 1,
      sender: "bot",
      text: getBotReply(text),
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");
    setIsTyping(true);
    setNextId((previous) => previous + 2);

    // Simulate a short bot response delay.
    setTimeout(() => {
      setMessages((previous) => [
        ...previous,
        botMessage,
      ]);
      setIsTyping(false);
    }, 350);
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6">
      <div className="mx-auto flex h-[85vh] min-h-[500px] max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <header className="flex items-center gap-3 bg-blue-700 px-5 py-4 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-2xl">
            🎓
          </div>

          <div>
            <h1 className="text-lg font-bold sm:text-xl">
              UOS Helpdesk Bot
            </h1>
            <p className="text-sm text-blue-100">
              University of Sargodha • Online Assistant
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Ready
          </div>
        </header>

        {/* Chat Messages */}
        <section
          className="flex-1 space-y-5 overflow-y-auto bg-slate-50 p-4 sm:p-6"
          aria-label="Chat messages"
          aria-live="polite"
        >
          {messages.map((message) => {
            const isUser = message.sender === "user";

            return (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm">
                    🎓
                  </div>
                )}

                <div
                  className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${
                    isUser
                      ? "rounded-br-sm bg-blue-700 text-white"
                      : "rounded-bl-sm border border-slate-200 bg-white text-slate-800 shadow-sm"
                  }`}
                >
                  {message.text}
                </div>

                {isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm">
                    👤
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div
              className="text-sm text-slate-500"
              role="status"
            >
              UOS Bot is preparing a reply...
            </div>
          )}

          <div ref={bottomRef} />
        </section>

        {/* Suggested Questions */}
        <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-white px-4 py-3">
          {[
            "Fee structure",
            "Admission",
            "Class timing",
            "Library",
            "Hostel",
          ].map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => setInput(question)}
              className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
            >
              {question}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          className="flex items-center gap-3 border-t border-slate-200 bg-white p-4"
          onSubmit={(event) => {
            event.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type your question here..."
            aria-label="Type your question"
            className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>

      <p className="mx-auto mt-4 max-w-3xl text-center text-xs text-slate-500">
        UOS Helpdesk Bot • Rule-based chatbot project
      </p>
    </main>
  );
}
