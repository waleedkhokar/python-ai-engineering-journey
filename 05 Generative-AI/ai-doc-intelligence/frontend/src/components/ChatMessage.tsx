"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div className={`flex gap-3 p-4 border-b border-gray-100 ${isUser ? "bg-white" : "bg-slate-50"}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? "bg-indigo-600 text-white" : "bg-emerald-600 text-white"}`}>
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>

      <div className="flex-1 overflow-hidden prose prose-slate max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            table: ({ children }) => (
              <div className="overflow-x-auto my-3 border rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 text-sm border-collapse">{children}</table>
              </div>
            ),
            thead: ({ children }) => <thead className="bg-slate-100">{children}</thead>,
            th: ({ children }) => <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 border-b">{children}</th>,
            td: ({ children }) => <td className="px-3 py-2 text-slate-600 border-b border-gray-100">{children}</td>,
            p: ({ children }) => <p className="leading-relaxed mb-2 last:mb-0 text-slate-800">{children}</p>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

