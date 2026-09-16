'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Send,
  User,
  Search,
  Sparkles,
  BrainCircuit,
  Upload,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

interface ChatBoxProps {
  docId: string;
  fileName?: string;
  onResetDocument?: () => void;
}

type StreamStatus = 'idle' | 'analyzing' | 'searching' | 'synthesizing';

const SUGGESTED_PROMPTS = [
  'Summarize the primary objectives and key findings',
  'What are the critical requirements or action items?',
  'Extract key decisions and conclusions into bullet points'
];

export default function ChatBox({ docId, fileName = 'Document.pdf', onResetDocument }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState<StreamStatus>('idle');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const executeSend = async (questionText: string) => {
    if (!questionText.trim() || isStreaming) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: questionText };
    const aiMessageId = (Date.now() + 1).toString();
    const initialAiMessage: Message = { id: aiMessageId, sender: 'ai', text: '' };

    setMessages((prev) => [...prev, userMessage, initialAiMessage]);
    setInput('');
    setIsStreaming(true);

    setStatus('analyzing');
    const searchTimer = setTimeout(() => setStatus('searching'), 1000);
    const synthTimer = setTimeout(() => setStatus('synthesizing'), 2400);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

    try {
      const response = await fetch(
        `${baseUrl}/api/chat?doc_id=${encodeURIComponent(docId)}&question=${encodeURIComponent(questionText)}`,
        { method: 'POST' }
      );

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      if (!response.body) throw new Error('No streaming response body found.');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let hasReceivedFirstChunk = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        if (!hasReceivedFirstChunk) {
          hasReceivedFirstChunk = true;
          clearTimeout(searchTimer);
          clearTimeout(synthTimer);
          setStatus('idle');
        }

        const chunk = decoder.decode(value, { stream: true });

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, text: msg.text + chunk } : msg
          )
        );
      }
    } catch (err: any) {
      console.error('Chat streaming error:', err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, text: `Error: ${err.message || 'Unable to connect to AI server.'}` }
            : msg
        )
      );
    } finally {
      clearTimeout(searchTimer);
      clearTimeout(synthTimer);
      setStatus('idle');
      setIsStreaming(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSend(input);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-800 truncate max-w-xs">{fileName}</span>
          <span className="text-[10px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full">
            Indexed & Active
          </span>
        </div>

        {onResetDocument && (
          <button
            onClick={onResetDocument}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Change File</span>
          </button>
        )}
      </div>

      {/* Message Feed */}
      <div className="flex-1 min-h-0 p-6 overflow-y-auto space-y-6 bg-slate-50/30">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800">Document Workspace Active</h3>
              <p className="text-xs text-slate-500">Pick a starter query or type your question below.</p>
            </div>

            <div className="flex flex-col gap-2 w-full">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => executeSend(prompt)}
                  className="text-left text-xs bg-white hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-200 p-3.5 rounded-xl text-slate-700 transition-all flex items-center justify-between shadow-xs group"
                >
                  <span>{prompt}</span>
                  <span className="text-slate-400 group-hover:text-indigo-600 transition-colors">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="relative w-7 h-7 rounded-lg overflow-hidden shrink-0 shadow-xs mt-0.5 border border-slate-200">
                <Image
                  src="/logo.jpeg"
                  alt="Bot Avatar"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="group relative max-w-[85%] min-w-[200px]">
              {/* Copy Button Action */}
              {msg.sender === 'ai' && msg.text && (
                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="p-1.5 rounded-lg bg-white/90 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 shadow-xs transition-colors flex items-center gap-1.5 text-[11px] font-medium"
                    title="Copy AI response"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Response</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <div
                className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-xs shadow-sm font-medium whitespace-pre-wrap'
                    : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs shadow-xs pr-12'
                }`}
              >
                {msg.text ? (
                  msg.sender === 'ai' ? (
                    <div className="prose prose-slate prose-xs md:prose-sm max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-headings:text-slate-900 prose-ul:list-disc prose-ol:list-decimal prose-li:my-0.5 prose-strong:text-slate-900 prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.text
                  )
                ) : msg.sender === 'ai' && status !== 'idle' ? (
                  <div className="flex items-center gap-2 text-indigo-600 font-medium py-1">
                    {status === 'analyzing' && <BrainCircuit className="w-4 h-4 animate-spin" />}
                    {status === 'searching' && <Search className="w-4 h-4 animate-pulse" />}
                    {status === 'synthesizing' && <Sparkles className="w-4 h-4 animate-bounce" />}

                    <span className="text-xs">
                      {status === 'analyzing' && 'Analyzing context...'}
                      {status === 'searching' && 'Searching vector database...'}
                      {status === 'synthesizing' && 'Synthesizing response...'}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <form
          onSubmit={handleFormSubmit}
          className="max-w-3xl mx-auto flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:bg-white focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-xs"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about this document..."
            className="flex-1 bg-transparent px-3 py-1.5 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            disabled={isStreaming}
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all shadow-md shadow-indigo-100 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}