import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Ruler, ShoppingBag, ArrowRight, Tag, RefreshCw } from 'lucide-react';
import { Product, ChatMessage } from '../types';

interface AuraChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onQuickView: (product: Product) => void;
  onOpenSizing: () => void;
  onApplyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  initialQuery?: string;
}

export const AuraChatbot: React.FC<AuraChatbotProps> = ({
  isOpen,
  onClose,
  products,
  onQuickView,
  onOpenSizing,
  onApplyCoupon,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: "Warm greetings! I am Aura, your bespoke gemological advisor and studio concierge. How may I assist you today? I can help calculate your exact ring size, suggest tailored gifts for special occasions, or share our active studio discount codes like ARTISAN15.",
      timestamp: 'Just now',
      recommendedProductIds: ['sol-invictus-ring', 'luna-baroque-pearl-choker'],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle external query trigger (e.g., from Sizing Guide or Hero)
  useEffect(() => {
    if (initialQuery && isOpen) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.slice(-5),
        }),
      });

      const data = await response.json();
      const replyText = data.reply || "I'd be honored to assist you with our handcrafted jewels.";

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProductIds: data.recommendedProductIds,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: "Forgive me, my connection to the jeweler's bench flickered. You can explore our Sol Invictus band or Luna pearl choker, or apply code ARTISAN15 for 15% off at checkout!",
          timestamp: 'Just now',
          recommendedProductIds: ['sol-invictus-ring'],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    '💍 How do I measure my ring size?',
    '✨ Recommend a unique gift under $200',
    '🏷️ Do you have any active coupons?',
    '🌿 Are your earrings nickel-free & hypoallergenic?',
    '📿 What necklace length looks best on high collars?',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#faf8f5] shadow-2xl border-l border-[#e8ded1] flex flex-col justify-between animate-slideLeft">
      {/* Concierge Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#241e1b] via-[#3d3128] to-[#241e1b] text-[#f7f2ea] flex items-center justify-between border-b border-[#40332a]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#f5efe6]/10 border border-[#e0a96d]/40 flex items-center justify-center text-[#e0a96d]">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#241e1b] rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif text-lg font-medium text-white">Aura AI Concierge</h3>
              <span className="text-[10px] bg-[#e0a96d]/20 text-[#e0a96d] px-1.5 py-0.2 rounded font-medium">
                Gemini 3.8
              </span>
            </div>
            <p className="text-[11px] text-[#d4c5b3]">Master Jeweler & Styling Assistant</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 text-white/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-start gap-2 max-w-[90%]">
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-[#241e1b] text-[#e0a96d] flex items-center justify-center shrink-0 mt-0.5 text-xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#241e1b] text-[#f7f2ea] rounded-tr-none'
                    : 'bg-white text-[#241e1b] border border-[#e8ded1] rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span
                  className={`text-[9px] mt-1.5 block ${
                    msg.sender === 'user' ? 'text-white/60 text-right' : 'text-[#8c7866]'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>

            {/* Embedded Recommended Product Cards */}
            {msg.recommendedProductIds && msg.recommendedProductIds.length > 0 && (
              <div className="mt-2.5 ml-9 space-y-2 w-[85%]">
                <span className="text-[10px] font-semibold text-[#8a5d3b] uppercase tracking-wider block">
                  Featured Pieces Recommended:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {msg.recommendedProductIds.map((pId) => {
                    const prod = products.find((p) => p.id === pId);
                    if (!prod) return null;
                    return (
                      <div
                        key={pId}
                        onClick={() => onQuickView(prod)}
                        className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-[#e0d3c1] hover:border-[#241e1b] cursor-pointer shadow-sm transition-all group"
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-11 h-11 rounded-lg object-cover bg-[#f5efe6]"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-serif text-xs font-semibold text-[#241e1b] group-hover:text-[#a0683a] truncate">
                            {prod.name}
                          </p>
                          <span className="text-[11px] font-bold text-[#8a5d3b]">
                            ${prod.price}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="px-2 py-1 bg-[#241e1b] group-hover:bg-[#a0683a] text-white text-[10px] font-medium rounded-lg"
                        >
                          View
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#8c7866] ml-9">
            <div className="w-2 h-2 rounded-full bg-[#a0683a] animate-ping" />
            <span>Aura is consulting the jeweler's ledger...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="px-4 py-2 bg-[#f5efe6] border-t border-[#e8ded1] overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
        {samplePrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt.replace(/^[^a-zA-Z0-9]+/, ''))}
            className="text-[11px] px-2.5 py-1 bg-white hover:bg-[#ede5d8] border border-[#d8c8b4] rounded-full text-[#4a3f35] shrink-0 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-[#e8ded1]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about ring sizes, gifts, materials, or coupons..."
            className="flex-1 bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3.5 py-2.5 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 bg-[#241e1b] hover:bg-[#a0683a] disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer"
            aria-label="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between mt-2 text-[10px] text-[#8c7866] px-1">
          <button
            type="button"
            onClick={onOpenSizing}
            className="text-[#8a5d3b] hover:underline flex items-center gap-1"
          >
            <Ruler className="w-3 h-3" />
            <span>Open Interactive Sizing Tool</span>
          </button>
          <span>Powered by Gemini AI</span>
        </div>
      </div>
    </div>
  );
};
