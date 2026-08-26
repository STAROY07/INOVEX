import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  RefreshCw,
  Copy,
  Printer,
  Check,
  Edit3,
  Save
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useStartup } from '../context/StartupContext';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import api from '../api/client';

export const BusinessPlanPage = () => {
  const { activeStartup, hasStartup } = useStartup();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [regeneratingSection, setRegeneratingSection] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const sectionsList = [
    { key: 'executive_summary', title: '1. Executive Summary' },
    { key: 'problem', title: '2. Problem Statement' },
    { key: 'solution', title: '3. Solution & Product Overview' },
    { key: 'target_market', title: '4. Target Market & Demographics' },
    { key: 'customer_persona', title: '5. Ideal Customer Persona (ICP)' },
    { key: 'market_opportunity', title: '6. Market Opportunity (TAM/SAM/SOM)' },
    { key: 'competitor_analysis', title: '7. Competitor Analysis & Moat' },
    { key: 'business_model', title: '8. Business Model & Value Metric' },
    { key: 'revenue_model', title: '9. Revenue Streams & Pricing' },
    { key: 'marketing_strategy', title: '10. Go-To-Market (GTM) Strategy' },
    { key: 'operations', title: '11. Operational Plan & Tech Architecture' },
    { key: 'team', title: '12. Founders & Key Hires' },
    { key: 'financial_overview', title: '13. Financial Projections & Margins' },
    { key: 'funding_requirement', title: '14. Funding Requirement & Use of Funds' },
    { key: 'risks', title: '15. Risk Assessment & Mitigation' },
    { key: 'future_growth', title: '16. Roadmap & Future Expansion' },
  ];

  useEffect(() => {
    if (!activeStartup) {
      setLoading(false);
      return;
    }

    const fetchPlan = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/startups/${activeStartup.id}/bizplan`);
        setPlan(res.data);
      } catch (err) {
        console.error("Plan fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [activeStartup]);

  const handleStartEdit = (key) => {
    setEditingSection(key);
    setEditedText(plan ? plan[key] || '' : '');
  };

  const handleSaveSection = async (key) => {
    try {
      const updatePayload = { [key]: editedText };
      const res = await api.put(`/startups/${activeStartup.id}/bizplan`, updatePayload);
      setPlan(res.data);
      setEditingSection(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error("Save section error:", err);
    }
  };

  const handleRegenerateSection = async (key) => {
    setRegeneratingSection(key);
    try {
      const res = await api.post(`/startups/${activeStartup.id}/bizplan/regenerate-section`, {
        section_name: key,
        additional_prompt: `Focus on realistic numbers and actionable execution for ${activeStartup?.name} in India.`
      });

      setPlan(prev => ({
        ...prev,
        [key]: res.data.content
      }));
    } catch (err) {
      console.error("Regenerate section error:", err);
    } finally {
      setRegeneratingSection(null);
    }
  };

  const handleCopyFullPlan = () => {
    if (!plan) return;
    let fullText = `# ${activeStartup?.name || 'Startup'} — Complete Business Plan\n\n`;
    sectionsList.forEach(sec => {
      fullText += `## ${sec.title}\n\n${plan[sec.key] || ''}\n\n---\n\n`;
    });

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 print:bg-white print:text-black">
      <div className="print:hidden">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      </div>

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 print:pl-0">
        <div className="print:hidden">
          <Header
            setMobileOpen={setMobileOpen}
            pageTitle="AI Business Plan Generator"
            pageSubtitle="16-section investor-ready business plan with inline editing and AI regeneration"
          />
        </div>

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full print:p-0 print:max-w-none">
          
          {!hasStartup ? (
            <EmptyState
              icon={FileText}
              title="No startup found"
              description="Create a startup idea to generate a complete 16-section business plan."
              actionLabel="Describe Idea"
              onAction={() => navigate('/onboarding')}
            />
          ) : loading ? (
            <LoadingSpinner message="Generating 16-section business plan..." submessage="Synthesizing market size, unit economics, go-to-market strategy, and risk disclosures..." />
          ) : (
            <>
              {/* TOP ACTIONS BAR */}
              <div className="rounded-2xl p-6 bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                      Investor-Grade Documentation
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      16 Comprehensive Sections
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold font-display text-slate-900 mt-2">
                    {activeStartup.name} Business Plan
                  </h2>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleCopyFullPlan}
                    className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied Full Plan!' : 'Copy Markdown'}</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md shadow-primary-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / Export PDF</span>
                  </button>
                </div>
              </div>

              {saveSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium shadow-sm">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Section saved successfully to database!</span>
                </div>
              )}

              {/* 16 SECTIONS LIST */}
              <div className="space-y-5">
                {sectionsList.map((sec) => {
                  const content = plan ? plan[sec.key] || '' : '';
                  const isEditing = editingSection === sec.key;
                  const isRegenerating = regeneratingSection === sec.key;

                  return (
                    <div
                      key={sec.key}
                      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 transition-all print:border-b print:rounded-none print:shadow-none print:p-4 print:mb-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 print:border-b-2">
                        <h3 className="text-base font-bold font-display text-slate-900 print:text-black">
                          {sec.title}
                        </h3>

                        <div className="flex items-center gap-2 print:hidden">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => setEditingSection(null)}
                                className="px-3 py-1 text-xs text-slate-500 hover:text-slate-900 font-semibold cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveSection(sec.key)}
                                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Save className="w-3.5 h-3.5" />
                                Save
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleStartEdit(sec.key)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Edit section manually"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRegenerateSection(sec.key)}
                                disabled={isRegenerating}
                                className="p-1.5 rounded-lg text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-colors disabled:opacity-50 cursor-pointer"
                                title="Regenerate with AI"
                              >
                                <Sparkles className={`w-4 h-4 ${isRegenerating ? 'animate-spin text-primary-600' : ''}`} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {isEditing ? (
                        <textarea
                          rows={6}
                          value={editedText}
                          onChange={(e) => setEditedText(e.target.value)}
                          className="w-full p-4 bg-slate-50 text-slate-900 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-primary-600 focus:bg-white leading-relaxed font-mono shadow-sm"
                        />
                      ) : isRegenerating ? (
                        <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center gap-2 text-xs text-slate-700 font-medium">
                          <RefreshCw className="w-4 h-4 animate-spin text-primary-600" />
                          <span>AI is refining and regenerating {sec.title}...</span>
                        </div>
                      ) : (
                        <div className="prose-custom text-xs sm:text-sm text-slate-700 leading-relaxed print:text-black">
                          <ReactMarkdown>{content}</ReactMarkdown>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </>
          )}

        </main>
      </div>
    </div>
  );
};
