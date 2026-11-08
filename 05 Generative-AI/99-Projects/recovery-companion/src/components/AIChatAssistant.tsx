import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ShieldAlert, 
  FileText, 
  Loader2, 
  HelpCircle,
  X
} from 'lucide-react';
import { ChatMessage, DischargePlan } from '../types';
import { safeFetchJson } from '../lib/apiUtils';

interface AIChatAssistantProps {
  plan: DischargePlan;
  onOpenSourceModal: (quote: string, title: string) => void;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ plan, onOpenSourceModal }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello ${plan.patientName || 'Patient'}! I am your AI Medical Recovery Assistant. I am here to help you understand your prescription, recovery instructions for ${plan.primaryDiagnosis || 'your health'}, wound care, symptoms, diet, and general medical care guidance. How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    'Can I drive while taking pain medication?',
    'When can I take a shower?',
    'What food should I eat?',
    'When should I contact my doctor?'
  ];

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!questionText) setInput('');
    setIsLoading(true);

    try {
      const data = await safeFetchJson('/api/assistant-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planContext: plan,
          userQuestion: textToSend
        }),
        retries: 2,
        timeoutMs: 30000
      });
      
      const replyText = (data && data.answer) 
        ? data.answer 
        : "For safety, please follow your physician's instructions. Prescription pain medications or sedating drugs can cause drowsiness and impair reflexes, making driving or operating machinery unsafe. Please check with your care team for personalized guidance.";

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'Unable to process request right now. As a general medical safety precaution, always consult your physician or pharmacist regarding activity restrictions, driving safety, and medication timing.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl border border-slate-200/80 shadow-md flex flex-col h-[540px] overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-wider text-sm text-white">AI Medical Recovery Assistant</h3>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Prescriptions, Recovery, Symptoms & Health Care Guidance</p>
          </div>
        </div>

        <span className="mono text-[10px] font-bold bg-blue-600 text-white px-2.5 py-1 rounded uppercase tracking-wider">
          AI HEALTH ASSISTANT
        </span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2.5 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm font-black">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[82%] p-4 rounded-2xl text-xs leading-relaxed shadow-xs font-medium ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-none font-semibold'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none font-medium'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <span className={`block text-[10px] font-mono mt-1.5 ${
                msg.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'
              }`}>
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 font-black">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-bold p-2">
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
            <span>Analyzing medical guidance & recovery plan...</span>
          </div>
        )}
      </div>

      {/* Suggested Questions Chips */}
      <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 overflow-x-auto flex items-center space-x-2 shrink-0">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest shrink-0 flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-blue-600" />
          <span>Suggested:</span>
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1 rounded-xl bg-white text-slate-800 hover:bg-blue-600 hover:text-white text-[11px] font-black uppercase tracking-wider border border-slate-200 transition-all shrink-0 shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3.5 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about medications, recovery care, diet, or symptoms..."
            className="flex-1 px-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2.5 bg-blue-600 text-white font-black uppercase text-xs rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm flex items-center space-x-1"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
