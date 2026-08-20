import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Send,
  Sparkles,
  User,
  ArrowRight,
  Lightbulb,
  CornerDownLeft,
  Loader2,
  CheckSquare
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useStartup } from '../context/StartupContext';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { EmptyState } from '../components/EmptyState';
import api from '../api/client';

export const MentorPage = () => {
  const { activeStartup, hasStartup } = useStartup();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const chatEndRef = useRef(null);

  const suggestedQuestions = [
    "How should I price my product?",
    "Who should my first 10 customers be?",
    "How can I validate my idea using The Mom Test?",
    "How do I build a lean MVP in 14 days?",
    "Should I register as an LLP or Pvt Ltd in India?",
    "What government funding schemes (SISFS, TIDE 2.0) apply to me?",
    "How do I calculate customer acquisition cost (CAC) & unit economics?"
  ];

  useEffect(() => {
    if (!activeStartup) {
      setInitialLoading(false);
      return;
    }

    const fetchHistory = async () => {
      setInitialLoading(true);
      try {
        const res = await api.get(`/startups/${activeStartup.id}/mentor/history`);
        setMessages(res.data);
      } catch (err) {
        console.error("Chat history fetch failed:", err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchHistory();
  }, [activeStartup]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (queryToSend) => {
    const text = queryToSend || inputQuery;
    if (!text.trim() || loading || !activeStartup) return;

    const userTempMsg = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userTempMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await api.post(`/startups/${activeStartup.id}/mentor/chat`, {
        content: text
      });
      setMessages(prev => [...prev, res.data]);
    } catch (err) {
      console.error("Chat message failed:", err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: "I encountered a momentary issue processing your startup inquiry. Please try again or rephrase your question.",
          recommended_action: "Retry asking your question with specific operational details.",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 h-screen">
        <Header
          setMobileOpen={setMobileOpen}
          pageTitle="AI Startup Mentor"
          pageSubtitle={`Tailored guidance contextualized to ${activeStartup?.name || 'your startup'}`}
        />

        <main className="flex-1 flex flex-col p-4 sm:p-6 max-w-5xl mx-auto w-full min-h-0">
          
          {!hasStartup ? (
            <EmptyState
              icon={Bot}
              title="No startup found"
              description="Create a startup idea to activate your contextual AI Startup Mentor."
              actionLabel="Describe Idea"
              onAction={() => navigate('/onboarding')}
            />
          ) : (
            <div className="flex-1 flex flex-col glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-glow-sm">
              
              {/* Context Bar */}
              <div className="px-5 py-3 border-b border-slate-800/80 bg-surface-100/70 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-primary-600/30 border border-primary-500/40 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-accent-cyan" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">{activeStartup.name} Context Active</span>
                    <span className="text-[10px] text-slate-400 block -mt-0.5">
                      {activeStartup.stage} Stage • {activeStartup.industry} • {activeStartup.business_model}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                  AI Mentor Online
                </span>
              </div>

              {/* Chat Message Scrollable Feed */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {messages.length === 0 && !initialLoading && (
                  <div className="text-center py-10 max-w-lg mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-cyan flex items-center justify-center mx-auto mb-3 shadow-glow-sm">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-white font-display">
                      Hello, Founder of {activeStartup.name}!
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                      I have analyzed your business idea, target customer ({activeStartup.target_customer}), and current {activeStartup.stage} stage. What would you like guidance on today?
                    </p>

                    {/* Quick suggested prompt buttons */}
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      {suggestedQuestions.slice(0, 4).map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(q)}
                          className="text-xs text-slate-300 bg-surface-50 hover:bg-surface-200 border border-slate-700/80 px-3 py-2 rounded-xl transition-all hover:border-primary-500 text-left"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, idx) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={idx}
                      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-cyan flex items-center justify-center flex-shrink-0 shadow-glow-sm">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}

                      <div className={`max-w-2xl rounded-2xl p-4 sm:p-5 ${
                        isUser
                          ? 'bg-primary-600 text-white rounded-br-none shadow-glow-sm'
                          : 'bg-surface-50 border border-slate-800 text-slate-200 rounded-bl-none'
                      }`}>
                        {isUser ? (
                          <p className="text-xs sm:text-sm font-medium whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <div>
                            <div className="prose-custom text-xs sm:text-sm">
                              <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>

                            {/* Recommended Next Action Highlight */}
                            {msg.recommended_action && (
                              <div className="mt-4 pt-3 border-t border-slate-700/60 bg-primary-950/40 p-3 rounded-xl border border-primary-800/40">
                                <div className="flex items-center gap-1.5 text-accent-cyan text-[11px] font-bold uppercase tracking-wider mb-1">
                                  <Sparkles className="w-3.5 h-3.5" />
                                  Recommended Next Action
                                </div>
                                <p className="text-xs font-semibold text-white">
                                  {msg.recommended_action}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {isUser && (
                        <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-300">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex gap-3 justify-start items-center">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-cyan flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white animate-pulse" />
                    </div>
                    <div className="bg-surface-50 border border-slate-800 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-2 text-xs text-slate-300">
                      <Loader2 className="w-4 h-4 animate-spin text-primary-400" />
                      <span>INOVEX Mentor is analyzing your startup context and drafting guidance...</span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 sm:p-4 border-t border-slate-800/80 bg-surface-100/70">
                <div className="flex items-center gap-2">
                  <textarea
                    rows={1}
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about pricing, MVP, hiring, GST compliance, or finding first customers..."
                    className="flex-1 px-4 py-3 bg-surface-50 text-white text-xs sm:text-sm rounded-xl border border-slate-700/80 focus:outline-none focus:border-primary-500 resize-none transition-colors max-h-32"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputQuery.trim() || loading}
                    className="px-4 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold shadow-glow-sm transition-all disabled:opacity-50 flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2 px-1">
                  <span className="text-[10px] text-slate-500">Press Enter to send, Shift + Enter for new line</span>
                  <span className="text-[10px] text-slate-500">Actionable advice • Structured for Indian & Global Startups</span>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
};
