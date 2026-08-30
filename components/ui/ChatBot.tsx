"use client";

import { useEffect, useRef, useState } from "react";
import { FaPaperPlane, FaTimes, FaWhatsapp } from "react-icons/fa";

type Msg = { role: "user" | "bot"; content: string };

const QUICK = [
  "What services do you offer?",
  "Pricing",
  "How long does a project take?",
  "Talk to a human",
];

function ChatSparkIcon({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8h-1.2L7 20.5V17.2C5.2 15.9 4 14.1 4 12z"
        fill="currentColor"
        opacity="0.95"
      />
      <path
        d="M12 7.2l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7.7-1.9z"
        fill="#0B0E14"
      />
      <circle cx="16.2" cy="9.2" r="0.7" fill="#0B0E14" opacity="0.7" />
    </svg>
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      content:
        "Hi — I am the DoyinTech assistant (available 24/7). Ask about services, pricing in USD, timelines, or portfolio. Type human anytime to reach the team on WhatsApp.",
    },
  ]);
  const [showHandoff, setShowHandoff] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, showHandoff]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", content }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: [...messages, { role: "user", content }],
        }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          content: data.reply || "Sorry, something went wrong. Try WhatsApp.",
        },
      ]);
      if (data.suggestWhatsApp) setShowHandoff(true);
      if (content.toLowerCase().includes("human")) setShowHandoff(true);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          content: "Connection issue. Please use WhatsApp or the contact form.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function submitHandoff() {
    if (!name.trim() || !email.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "handoff",
          name: name.trim(),
          email: email.trim(),
          message:
            messages.filter((m) => m.role === "user").slice(-1)[0]?.content || "",
          history: messages,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMessages((m) => [...m, { role: "bot", content: data.reply }]);
      setShowHandoff(false);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          content: "Could not send details. Please continue on WhatsApp instead.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function whatsappHref() {
    const lastUser = messages.filter((m) => m.role === "user").slice(-3);
    const snippet = lastUser.map((m) => m.content).join(" | ");
    const text =
      `Hi DoyinTech, I was on the website chatbot.\n` +
      (name ? `Name: ${name}\n` : "") +
      (email ? `Email: ${email}\n` : "") +
      (snippet ? `Chat: ${snippet}` : "I need help with a project.");
    return `https://wa.me/2348085343926?text=${encodeURIComponent(text)}`;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open AI assistant"}
        className="group fixed bottom-24 right-6 z-[100] flex h-14 w-14 items-center justify-center"
      >
        {/* Soft pulse ring when closed */}
        {!open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/40 opacity-40" />
        )}
        <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 via-primary to-rose-600 text-white shadow-xl shadow-primary/40 ring-2 ring-white/10 transition duration-300 group-hover:scale-110 group-active:scale-95">
          {open ? <FaTimes size={18} /> : <ChatSparkIcon size={26} />}
          {!open && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-[9px] font-bold text-[#0B0E14] ring-2 ring-[#0B0E14]">
              AI
            </span>
          )}
        </span>
      </button>

      {open && (
        <div className="fixed bottom-40 right-4 z-[100] flex w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#121826] shadow-2xl shadow-black/50 sm:right-6">
          <div className="flex items-center justify-between border-b border-white/10 bg-[#0B0E14] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 via-primary to-rose-600 text-white">
                <ChatSparkIcon size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">DoyinTech AI</p>
                <p className="text-[11px] text-green-400">Online · Replies 24/7</p>
              </div>
            </div>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/15 px-3 py-1.5 text-[11px] font-semibold text-[#25D366] hover:bg-[#25D366]/25"
            >
              <FaWhatsapp /> WhatsApp
            </a>
          </div>

          <div className="flex max-h-[360px] flex-col gap-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-primary text-white"
                    : "bg-white/5 text-gray-200"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && <p className="text-xs text-gray-500">Typing…</p>}
            <div ref={bottomRef} />
          </div>

          {!showHandoff && (
            <div className="flex flex-wrap gap-1.5 border-t border-white/5 px-3 py-2">
              {QUICK.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-gray-400 hover:border-primary/50 hover:text-white"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {showHandoff && (
            <div className="space-y-2 border-t border-white/10 bg-black/30 p-3">
              <p className="text-[11px] text-gray-400">
                Leave your details — we will follow up. Or continue on WhatsApp now.
              </p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-primary/50"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-primary/50"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={submitHandoff}
                  disabled={loading}
                  className="flex-1 rounded-lg bg-primary py-2 text-xs font-semibold text-white disabled:opacity-60"
                >
                  Send to team
                </button>
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#25D366] py-2 text-xs font-semibold text-white"
                >
                  <FaWhatsapp /> Chat
                </a>
              </div>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 border-t border-white/10 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything…"
              className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-primary/50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white disabled:opacity-50"
              aria-label="Send"
            >
              <FaPaperPlane size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
