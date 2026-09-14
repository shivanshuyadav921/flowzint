"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, Volume2, VolumeX, Sparkles, CheckCircle2, RotateCcw, Award, Play, AlertCircle } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

interface Message {
  role: "interviewer" | "user";
  text: string;
  feedback?: {
    score: number;
    clarity: number;
    starCompliance: boolean;
    strength: string;
    improvement: string;
  };
}

const roleQuestions: Record<string, string[]> = {
  "Full Stack / Frontend": [
    "Welcome! Tell me about a challenging frontend performance or state management issue you solved recently.",
    "How do you approach designing scalable, accessible UI components with Next.js and Tailwind?",
    "Describe a situation where a production bug occurred in your web app. How did you diagnose and remediate it?",
  ],
  "Backend & System Design": [
    "Welcome! How would you design a distributed rate limiter to handle 50,000 requests per second?",
    "Explain how you prevent race conditions and maintain data consistency across microservices.",
    "Tell me about a time you had to optimize slow database queries under heavy production load.",
  ],
  "Behavioral & Leadership": [
    "Welcome! Tell me about a time you had a strong disagreement with a technical lead or product manager.",
    "Can you share an example of how you mentored a junior teammate or resolved a team blocker?",
    "Describe a high-stakes project with tight deadlines. How did you prioritize deliverables?",
  ],
};

export default function MockInterviewPage() {
  const [selectedRole, setSelectedRole] = useState<string>("Full Stack / Frontend");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "interviewer",
      text: roleQuestions["Full Stack / Frontend"][0],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [overallScore, setOverallScore] = useState<number>(88);
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  // Scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Voice synthesis
  const speakText = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Web Speech recognition toggle
  const toggleRecording = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser. Please type your response.");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setInput((prev) => (prev ? prev + " " + currentTranscript : currentTranscript));
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
    }
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setQuestionIndex(0);
    setMessages([
      {
        role: "interviewer",
        text: roleQuestions[role][0],
      },
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    const userText = input.trim();
    setInput("");
    setLoading(true);

    // Realistic Answer Scoring calculation
    const wordCount = userText.split(" ").length;
    const hasMetrics = /\d+%|\d+x|\d+ms|\d+ users|\bKPI\b|\bmetric\b/i.test(userText);
    const hasStarKeywords = /\b(situation|task|action|result|because|delivered|resolved|led|built)\b/i.test(userText);

    const calculatedScore = Math.min(98, Math.max(72, 75 + (wordCount > 25 ? 12 : 5) + (hasMetrics ? 8 : 0) + (hasStarKeywords ? 5 : 0)));
    const clarityScore = Math.min(96, Math.max(75, 80 + (wordCount > 20 ? 10 : 0)));

    const feedback = {
      score: calculatedScore,
      clarity: clarityScore,
      starCompliance: hasStarKeywords,
      strength: hasMetrics ? "Great quantified impact and concrete details." : "Clear articulation of technical decisions.",
      improvement: wordCount < 30 ? "Expand on the specific technical tradeoffs and outcome metrics." : "Structure your response with Situation, Task, Action, and Result (STAR).",
    };

    setMessages((prev) => [...prev, { role: "user", text: userText, feedback }]);
    setOverallScore(Math.round((overallScore + calculatedScore) / 2));

    // Next question or evaluation summary
    setTimeout(() => {
      const nextIdx = questionIndex + 1;
      const questions = roleQuestions[selectedRole] || [];

      if (nextIdx < questions.length) {
        setQuestionIndex(nextIdx);
        const nextQ = questions[nextIdx];
        setMessages((prev) => [
          ...prev,
          {
            role: "interviewer",
            text: nextQ,
          },
        ]);
        speakText(nextQ);
      } else {
        const wrapUp = `Great job completing the ${selectedRole} mock interview! Your overall score was ${calculatedScore}/100. Review your feedback cards to sharpen your next real interview.`;
        setMessages((prev) => [
          ...prev,
          {
            role: "interviewer",
            text: wrapUp,
          },
        ]);
        speakText(wrapUp);
      }
      setLoading(false);
    }, 900);
  };

  const handleReset = () => {
    setQuestionIndex(0);
    setSeconds(0);
    setMessages([
      {
        role: "interviewer",
        text: roleQuestions[selectedRole][0],
      },
    ]);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 px-4 py-6 sm:px-8 lg:px-10 max-w-7xl mx-auto w-full">
        <Navbar />

        {/* Header & Role Selector Bar */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-soft">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs uppercase tracking-widest text-brand-400 font-bold">Interactive Live Session</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">AI Mock Interview Room</h1>
          </div>

          {/* Role selector buttons */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(roleQuestions).map((role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`rounded-2xl px-3.5 py-2 text-xs font-semibold transition ${
                  selectedRole === role
                    ? "bg-brand-500 text-white shadow-md shadow-brand-500/25 ring-1 ring-white/20"
                    : "border border-white/10 bg-slate-950 text-slate-300 hover:bg-white/5"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Chat Stream & AI Scorecard */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Chat Stream */}
          <div className="flex flex-col rounded-3xl border border-white/10 bg-slate-900/40 p-5 shadow-soft backdrop-blur-xl min-h-[520px]">
            {/* Messages Area */}
            <div className="flex-1 space-y-4 overflow-y-auto max-h-[460px] pr-2">
              {messages.map((msg, idx) => (
                <div key={idx} className="space-y-2">
                  <div
                    className={`flex gap-3 rounded-2xl p-4 text-sm leading-relaxed ${
                      msg.role === "interviewer"
                        ? "bg-slate-900/90 border border-white/10 text-slate-100"
                        : "ml-auto max-w-2xl bg-gradient-to-r from-brand-600/30 via-indigo-600/25 to-purple-600/25 border border-brand-500/30 text-white"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between pb-1 text-xs">
                        <span className={`font-bold ${msg.role === "interviewer" ? "text-brand-400 uppercase tracking-wider text-[11px]" : "text-indigo-300"}`}>
                          {msg.role === "interviewer" ? "AI Interviewer" : "You (Candidate)"}
                        </span>

                        {msg.role === "interviewer" && (
                          <button
                            onClick={() => speakText(msg.text)}
                            className="text-slate-400 hover:text-brand-300 transition"
                            title="Read Aloud"
                          >
                            {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
                          </button>
                        )}
                      </div>
                      <p className="mt-1 text-slate-200">{msg.text}</p>
                    </div>
                  </div>

                  {/* AI Feedback Card for User Answer */}
                  {msg.feedback && (
                    <div className="ml-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-3.5 text-xs text-slate-300 shadow-sm">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <CheckCircle2 size={14} /> Instant Answer Evaluation
                        </span>
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-300 font-bold">
                          Score: {msg.feedback.score}%
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                        <div>
                          <span className="text-slate-300 font-medium">Strength: </span>
                          {msg.feedback.strength}
                        </div>
                        <div>
                          <span className="text-slate-300 font-medium">Coach Tip: </span>
                          {msg.feedback.improvement}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 rounded-2xl bg-slate-900/90 border border-white/10 p-4 text-xs text-brand-300 animate-pulse">
                  <Sparkles size={16} />
                  <span>AI Interviewer is analyzing your response...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input & Voice Controls */}
            <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={3}
                  placeholder="Type your interview response or speak using the microphone..."
                  className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/90 p-3.5 pr-14 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-brand-500 transition"
                />
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`absolute right-3.5 top-3.5 rounded-xl p-2 transition ${
                    isRecording
                      ? "bg-rose-500 text-white animate-pulse"
                      : "bg-white/5 text-slate-300 hover:bg-brand-500/20 hover:text-brand-300"
                  }`}
                  title={isRecording ? "Stop Recording" : "Speak Answer (Voice-to-text)"}
                >
                  {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  {isRecording ? (
                    <span className="flex items-center gap-1.5 text-rose-400 font-semibold animate-pulse">
                      <span className="h-2 w-2 rounded-full bg-rose-500" /> Listening to your voice...
                    </span>
                  ) : (
                    <span>Press <strong>Enter</strong> to submit answer</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1"
                    title="Reset Session"
                  >
                    <RotateCcw size={13} /> Reset
                  </button>
                  <Button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="py-2 px-4 text-xs font-semibold"
                  >
                    <span>{loading ? "Grading..." : "Submit Answer"}</span>
                    <Send size={13} className="ml-1.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Real-time Analytics & Scoring */}
          <aside className="space-y-6">
            {/* Live Session Timer */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-soft backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs uppercase tracking-wider text-slate-400">
                <span>Session Duration</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Active
                </span>
              </div>
              <p className="mt-3 text-4xl font-bold font-mono text-white">{formatTime(seconds)}</p>
              <p className="mt-1 text-xs text-slate-400">Paced for authentic technical interview timing.</p>
            </div>

            {/* Performance Scorecard */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-soft backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <Award className="text-brand-400" size={18} />
                  <span>Real-Time Readiness</span>
                </div>
                <span className="rounded-full bg-brand-500/20 px-2.5 py-0.5 text-xs font-bold text-brand-300">
                  {overallScore}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-3 overflow-hidden rounded-full bg-slate-950 ring-1 ring-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${overallScore}%` }}
                />
              </div>

              <div className="space-y-2.5 pt-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">STAR Structure</span>
                  <span className="font-semibold text-emerald-400">92%</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Technical Depth</span>
                  <span className="font-semibold text-brand-300">86%</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Clarity & Brevity</span>
                  <span className="font-semibold text-indigo-300">89%</span>
                </div>
              </div>
            </div>

            {/* AI Recommendation Box */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950 p-5 text-xs text-slate-300 shadow-soft">
              <div className="flex items-center gap-2 text-brand-400 font-bold">
                <Sparkles size={15} />
                <span>Coach Insight</span>
              </div>
              <p className="mt-2 leading-relaxed text-slate-300">
                Top interviewers look for quantifiable metrics. Try stating specific throughput numbers, latency gains, or team sprint acceleration in your explanations.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
