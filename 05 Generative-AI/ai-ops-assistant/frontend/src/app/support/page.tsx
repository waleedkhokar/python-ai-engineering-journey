"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { sendSupportMessage } from "@/services/api";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export default function SupportChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "Hello! How can I help you with our products today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setLoading(true);

    try {
      const data = await sendSupportMessage(userMessage);
      setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, something went wrong connecting to the support agent." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-4">Customer Support Assistant</h1>
        
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-4 overflow-y-auto mb-4 space-y-4 max-h-[60vh]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-xl text-sm ${
                  m.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-200 border border-gray-700 whitespace-pre-wrap"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 text-gray-400 p-3 rounded-xl text-sm animate-pulse">
                Thinking...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about products, pricing, or stock..."
            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-medium transition disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}