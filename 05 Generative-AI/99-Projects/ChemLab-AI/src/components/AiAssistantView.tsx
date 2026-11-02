import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, X, AlertTriangle, RefreshCw, Trash2, BookOpen, ShieldAlert, Atom } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Experiment, ChatMessage } from '../types';

interface AiAssistantViewProps {
  activeExperimentContext: Experiment | null;
  onClearContext: () => void;
  onSelectExperimentContext: (exp: Experiment) => void;
  allExperiments: Experiment[];
}

const SAMPLE_QUESTIONS = [
  'Why is phenolphthalein indicator used in acid-base titration?',
  'How do I calculate the molarity of a standard Na₂CO₃ solution?',
  'Why does potassium show a lilac flame and how does cobalt blue glass help?',
  'What is the difference between equivalence point and endpoint?',
  'How do I confirm the presence of Fe³⁺ cations in qualitative analysis?'
];

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  activeExperimentContext,
  onClearContext,
  onSelectExperimentContext,
  allExperiments
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (overrideText?: string) => {
    const textToSend = (overrideText || inputText).trim();
    if (!textToSend || loading) return;

    setError(null);
    setInputText('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date(),
      experimentContextName: activeExperimentContext?.name
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Build history for backend
      const history = newMessages.slice(0, -1).map((m) => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history,
          experimentContext: activeExperimentContext || undefined
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.details || 'Failed to receive AI response.');
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply,
        timestamp: new Date(),
        isGuardrailRefusal: data.isGuardrailRefusal
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setError(err.message || 'Error connecting to ChemLab AI Assistant.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-teal-500/20">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  ChemLab AI Assistant
                </h1>
                <span className="bg-teal-500/20 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-400" />
                  Chemistry AI
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                Undergraduate Chemistry assistant for lab procedures, reaction mechanisms, calculations, and viva study.
              </p>
            </div>
          </div>

          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
              id="clear-chat-btn"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Chat</span>
            </button>
          )}
        </div>

        {/* Active Experiment Context Selector / Banner */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {activeExperimentContext ? (
            <div className="flex items-center gap-2 bg-teal-950/80 border border-teal-500/40 text-teal-200 px-3 py-1.5 rounded-xl">
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>
                Active Context: <strong className="text-white">{activeExperimentContext.name}</strong> ({activeExperimentContext.category})
              </span>
              <button
                onClick={onClearContext}
                className="ml-2 text-slate-400 hover:text-white p-0.5 rounded"
                title="Remove experiment context"
                id="clear-experiment-context-btn"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400">
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>Select Experiment Context (Optional):</span>
              <select
                onChange={(e) => {
                  const exp = allExperiments.find((x) => x.id === e.target.value);
                  if (exp) onSelectExperimentContext(exp);
                }}
                defaultValue=""
                className="bg-slate-800 text-white border border-slate-700 text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                id="select-experiment-context-dropdown"
              >
                <option value="" disabled>-- General Chemistry Mode --</option>
                {allExperiments.map((exp) => (
                  <option key={exp.id} value={exp.id}>
                    {exp.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Chemistry-only guardrails active</span>
          </div>
        </div>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-lg min-h-[480px] max-h-[620px] flex flex-col overflow-hidden">
        
        {/* Messages List Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/40">
          
          {/* Empty State when no messages */}
          {messages.length === 0 && (
            <div className="py-12 px-4 text-center space-y-6 max-w-lg mx-auto">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto text-teal-600 border border-teal-100 shadow-sm">
                <Atom className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-slate-900">
                  Welcome to ChemLab AI Assistant
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Ask any question about Chemistry laboratory experiments, volumetric calculations, indicators, qualitative separation schemes, or practical viva concepts.
                </p>
              </div>

              {/* Sample Questions Prompts */}
              <div className="space-y-2 text-left pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                  Try asking one of these questions:
                </p>
                <div className="space-y-2">
                  {SAMPLE_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="w-full text-left p-3 bg-white hover:bg-teal-50/80 border border-slate-200 hover:border-teal-300 rounded-xl text-xs text-slate-700 hover:text-teal-900 font-medium transition-colors shadow-sm"
                      id={`sample-question-${idx}`}
                    >
                      "{q}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Rendered Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none shadow-md'
                    : msg.isGuardrailRefusal
                    ? 'bg-amber-50 border border-amber-200 text-amber-950 rounded-tl-none shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                }`}
              >
                {msg.sender === 'user' && msg.experimentContextName && (
                  <div className="text-[10px] text-teal-300 font-semibold mb-1 pb-1 border-b border-slate-700">
                    Context: {msg.experimentContextName}
                  </div>
                )}

                {msg.sender === 'user' ? (
                  <p className="whitespace-pre-wrap font-sans">{msg.text}</p>
                ) : (
                  <div className="markdown-body space-y-2">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}

                <div
                  className={`text-[10px] mt-2 pt-1 flex items-center justify-end ${
                    msg.sender === 'user' ? 'text-slate-400' : 'text-slate-400'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Loading Indicator */}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-500 font-medium ml-2">ChemLab AI is thinking...</span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-rose-800 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => handleSend()}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3"
          >
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                activeExperimentContext
                  ? `Ask a question about ${activeExperimentContext.name}... (Press Enter to send)`
                  : "Ask a Chemistry question... (Press Enter to send)"
              }
              rows={1}
              className="flex-1 p-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white resize-none"
              id="ai-assistant-text-input"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="p-3.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-slate-950 font-bold rounded-2xl transition-colors shadow-md shadow-teal-500/20 shrink-0"
              id="ai-assistant-send-btn"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>Shift+Enter for line break</span>
            <span>Educational Chemistry Assistant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
