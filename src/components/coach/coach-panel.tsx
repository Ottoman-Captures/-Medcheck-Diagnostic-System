"use client";

import { Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Disclaimer } from "@/components/ui/disclaimer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Message = {
  role: "user" | "assistant";
  content: string;
  attachment?: {
    filename: string;
    fileType: string;
    fileData: string;
  };
};

const starter: Message[] = [
  {
    role: "assistant",
    content:
      "I’m ready to help you plan habits, meals, hydration, sleep, and movement with your profile in mind."
  }
];

export function CoachPanel() {
  const [messages, setMessages] = useState<Message[]>(starter);
  const [message, setMessage] = useState("Build a realistic evening routine that improves sleep and hydration.");
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState<{
    filename: string;
    fileType: string;
    fileData: string;
  } | null>(null);

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      toast.error("File size exceeds the 4MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachment({
        filename: file.name,
        fileType: file.type,
        fileData: reader.result as string
      });
      toast.success(`Attached ${file.name}`);
    };
    reader.readAsDataURL(file);
    // Clear input value to allow uploading the same file again if needed
    event.target.value = "";
  }

  async function downloadPdf(content: string) {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // 1. Branding Header
      doc.setFillColor(11, 15, 25); // Dark Slate background
      doc.rect(0, 0, 210, 40, "F");

      doc.setTextColor(52, 211, 153); // Emerald brand color
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(22);
      doc.text("MEDCHECK DIAGNOSTIC SYSTEM", 15, 18);

      doc.setTextColor(255, 255, 255);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.text("AI diagnostic and wellness companion · Report Analysis", 15, 27);

      const dateStr = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
      doc.text(`Generated: ${dateStr}`, 145, 18);

      // 2. Report Content Styling
      doc.setTextColor(30, 41, 59); // Slate 800 body text
      doc.setFontSize(11);

      // Simple Markdown character stripping for clean PDF text
      const cleanContent = content
        .replace(/\*\*/g, "") // Remove bold markdown symbols
        .replace(/###/g, "")
        .replace(/##/g, "")
        .replace(/#/g, "")
        .replace(/-\s/g, "• "); // Replace markdown list dashes with round bullets

      const lines = doc.splitTextToSize(cleanContent, 180);

      let y = 52;
      const pageHeight = doc.internal.pageSize.getHeight();

      for (let i = 0; i < lines.length; i++) {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20; // reset y margin for the next page
        }
        doc.text(lines[i], 15, y);
        y += 6.5; // spacing between lines
      }

      doc.save(`medcheck-diagnostic-system-analysis-${Date.now()}.pdf`);
      toast.success("PDF analysis report downloaded successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate PDF report.");
    }
  }

  async function sendMessage() {
    if (!message.trim() && !attachment) return;

    const userMessage: Message = {
      role: "user",
      content: message,
      attachment: attachment ? { ...attachment } : undefined
    };
    setMessages((items) => [...items, userMessage]);
    setMessage("");
    setAttachment(null);
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          attachment: userMessage.attachment,
          context: {
            goals: ["hydration", "better sleep"],
            restrictions: ["no shellfish"],
            latestMetrics: { steps: 8240, waterMl: 1900, sleepHours: 7.2 }
          }
        })
      });

      const payload = (await response.json()) as { data?: { content: string }; error?: { message: string } };
      if (!response.ok || !payload.data) {
        throw new Error(payload.error?.message ?? "AI coach is unavailable.");
      }

      setMessages((items) => [...items, { role: "assistant", content: payload.data!.content }]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "AI coach failed.");
      setMessages((items) => [
        ...items,
        {
          role: "assistant",
          content:
            "AI-generated information is for educational purposes only and is not medical advice.\n\nTry a simple reset: drink water now, take a short walk, and set a consistent screen-off cue tonight."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <section className="glass-surface rounded-2xl p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-400/15 text-indigo-100">
            <Sparkles className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Medcheck Diagnostic Coach</h1>
            <p className="text-sm text-muted">Personalized wellness guidance and report analysis.</p>
          </div>
        </div>

        <div className="grid max-h-[520px] gap-3 overflow-y-auto pr-1">
          {messages.map((item, index) => (
            <div
              key={`${item.role}-${index}`}
              className={
                item.role === "user"
                  ? "ml-auto max-w-[85%] rounded-2xl bg-indigo-500 px-4 py-3 text-sm leading-6 text-white"
                  : "max-w-[88%] whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm leading-6 text-slate-100"
              }
            >
              <div>{item.content}</div>
              {item.attachment && (
                <div className="mt-2 border-t border-white/10 pt-2 text-xs">
                  {item.attachment.fileType.startsWith("image/") ? (
                    <div className="grid gap-1">
                      <div className="text-slate-300 font-medium">📎 {item.attachment.filename}</div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.attachment.fileData}
                        alt="attachment"
                        className="max-h-48 max-w-full rounded-lg border border-white/10 object-contain bg-slate-900"
                      />
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-white">
                      <span>📄</span>
                      <span className="font-medium truncate max-w-[180px]">{item.attachment.filename}</span>
                    </div>
                  )}
                </div>
              )}
              {item.role === "assistant" && index > 0 && (
                <div className="mt-3">
                  <button
                    onClick={() => void downloadPdf(item.content)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 active:scale-95 px-3 py-1.5 text-xs font-bold text-slate-950 transition-all select-none cursor-pointer"
                  >
                    📥 Download Report PDF
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-3">
          <Textarea
            aria-label="Message to AI health coach"
            placeholder="Ask a question or request analysis of your uploaded report..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />

          {attachment && (
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white">
              <span className="flex items-center gap-2 truncate">
                {attachment.fileType.startsWith("image/") ? "📷" : "📄"}
                <span className="font-semibold truncate text-emerald-300">{attachment.filename}</span>
              </span>
              <button
                onClick={() => setAttachment(null)}
                className="text-rose-400 hover:text-rose-300 font-bold ml-2 px-1"
                title="Remove attachment"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div>
              <input
                type="file"
                id="coach-file-upload"
                className="hidden"
                accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.xlsx,.xls,.pptx,.ppt"
                onChange={handleFileUpload}
              />
              <label
                htmlFor="coach-file-upload"
                className="flex items-center gap-1.5 cursor-pointer rounded-lg border border-white/10 bg-white/[0.045] hover:bg-white/[0.08] hover:border-white/20 px-3 py-2 text-xs font-semibold text-slate-200 transition-all select-none"
              >
                📎 Attach report/scan
              </label>
            </div>
            <Button onClick={() => void sendMessage()} disabled={loading}>
              <Send className="h-4 w-4" aria-hidden />
              {loading ? "Thinking..." : "Send"}
            </Button>
          </div>
        </div>
      </section>

      <aside className="grid content-start gap-4">
        <Disclaimer />
        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
          <h2 className="font-display text-lg font-semibold text-white">Coach boundaries</h2>
          <div className="mt-4 grid gap-3 text-sm text-muted">
            <p>Habit planning, meal ideas, hydration routines, wellness motivation, and goal structure.</p>
            <p>Medical diagnosis, medication instructions, and emergency guidance are redirected to professionals.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
