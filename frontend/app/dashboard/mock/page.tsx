"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Mic, Send } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

const initialMessages = [
  { role: "assistant", text: "Welcome to your mock interview. Tell me about your latest project and I will follow up." },
];

export default function MockInterviewPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    const userText = input;
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", text: `Nice. Can you explain how you handled ambiguous technical requirements for ${userText}?` }]);
      setLoading(false);
    }, 700);
  };

  return (
    <div className="flex min-h-screen text-slate-100">
      <Sidebar />
      <div className="flex-1 px-6 py-8 lg:px-10">
        <Navbar />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-6 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-brand-400">Mock Interview</p>
                  <h2 className="mt-2 text-3xl font-semibold text-white">Conversational AI interviewer</h2>
                </div>
                <div className="rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-300">Category: Technical / Behavioral</div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/95 p-4 shadow-soft">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={message.role === "assistant" ? "rounded-3xl bg-slate-950/90 p-4 text-slate-200" : "ml-auto max-w-3xl rounded-3xl bg-brand-500/10 p-4 text-slate-100"}>
                    <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{message.role === "assistant" ? "Interviewer" : "You"}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-100">{message.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <button className="rounded-full bg-brand-500/15 p-3 text-brand-300 transition hover:bg-brand-500/25"><Mic size={18} /></button>
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  rows={4}
                  placeholder="Type your answer here..."
                  className="w-full resize-none rounded-3xl border border-white/10 bg-slate-900/90 p-4 text-slate-100 outline-none placeholder:text-slate-500"
                />
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-sm text-slate-400">Voice-to-text coming soon for full interview flow.</p>
                <Button onClick={handleSend} disabled={loading || !input.trim()}>
                  {loading ? "Thinking…" : "Send answer"} <Send className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-6 shadow-soft">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Session timer</p>
              <p className="mt-4 text-5xl font-semibold text-white">00:13:42</p>
              <p className="mt-2 text-sm text-slate-400">This session is paced for focused technical review.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-6 shadow-soft">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <p>Confidence</p>
                <p className="font-semibold text-white">High</p>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/5">
                <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-brand-500 to-violet-400" />
              </div>
              <p className="mt-3 text-sm text-slate-400">AI feedback updates as you answer.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
