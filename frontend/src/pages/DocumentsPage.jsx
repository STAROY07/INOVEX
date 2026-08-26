import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Files,
  Sparkles,
  Copy,
  Check,
  Trash2,
  Edit3,
  Save,
  X,
  Loader2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useStartup } from '../context/StartupContext';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import api from '../api/client';

export const DocumentsPage = () => {
  const { activeStartup, hasStartup } = useStartup();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const [docType, setDocType] = useState('pitch_deck');
  const [customPrompt, setCustomPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  const docTypesList = [
    { type: 'pitch_deck', label: '10-Slide Investor Pitch Deck' },
    { type: 'executive_summary', label: 'Executive Summary One-Pager' },
    { type: 'swot_analysis', label: 'Strategic SWOT Matrix' },
    { type: 'customer_persona', label: 'Ideal Buyer Persona (ICP) Blueprint' },
    { type: 'marketing_plan', label: '90-Day Go-To-Market Strategy' },
    { type: 'problem_statement', label: 'Comprehensive Problem Statement' },
    { type: 'market_research', label: 'Market Sizing & Competitor Report' },
    { type: 'financial_projection', label: '3-Year Financial Model Outline' },
    { type: 'startup_proposal', label: 'Commercial & Partnership Proposal' }
  ];

  useEffect(() => {
    if (!activeStartup) {
      setLoading(false);
      return;
    }

    const fetchDocs = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/startups/${activeStartup.id}/documents`);
        setDocuments(res.data);
        if (res.data.length > 0) {
          setSelectedDoc(res.data[0]);
          setEditedContent(res.data[0].content);
        }
      } catch (err) {
        console.error("Docs fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [activeStartup]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await api.post(`/startups/${activeStartup.id}/documents/generate`, {
        doc_type: docType,
        custom_instructions: customPrompt
      });

      setDocuments(prev => [res.data, ...prev]);
      setSelectedDoc(res.data);
      setEditedContent(res.data.content);
      setShowGenerateModal(false);
      setCustomPrompt('');
    } catch (err) {
      console.error("Generate doc failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedDoc) return;
    try {
      const res = await api.put(`/startups/${activeStartup.id}/documents/${selectedDoc.id}`, {
        content: editedContent
      });
      setSelectedDoc(res.data);
      setDocuments(prev => prev.map(d => d.id === res.data.id ? res.data : d));
      setIsEditing(false);
    } catch (err) {
      console.error("Save edit failed:", err);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await api.delete(`/startups/${activeStartup.id}/documents/${docId}`);
      const filtered = documents.filter(d => d.id !== docId);
      setDocuments(filtered);
      if (selectedDoc?.id === docId) {
        setSelectedDoc(filtered[0] || null);
      }
    } catch (err) {
      console.error("Delete doc failed:", err);
    }
  };

  const handleCopy = () => {
    if (!selectedDoc) return;
    navigator.clipboard.writeText(selectedDoc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          setMobileOpen={setMobileOpen}
          pageTitle="AI Business Document Generator"
          pageSubtitle="Generate pitch decks, SWOT analyses, marketing plans, and personas instantly"
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {!hasStartup ? (
            <EmptyState
              icon={Files}
              title="No startup found"
              description="Create a startup idea to start generating business documents."
              actionLabel="Describe Idea"
              onAction={() => navigate('/onboarding')}
            />
          ) : loading ? (
            <LoadingSpinner message="Loading startup documents..." />
          ) : (
            <>
              {/* TOP HEADER */}
              <div className="rounded-2xl p-6 bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">
                    Asset Library
                  </span>
                  <h2 className="text-2xl font-extrabold font-display text-slate-900 mt-1">
                    Startup Documents for {activeStartup.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Exportable, markdown-formatted assets for partners, investors, and team members.
                  </p>
                </div>

                <button
                  onClick={() => setShowGenerateModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md shadow-primary-500/20 transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Generate New Document</span>
                </button>
              </div>

              {/* MAIN CONTENT SPLIT: SIDE LIST & PREVIEW */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
                
                {/* Left: Document List */}
                <div className="lg:col-span-4 space-y-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 mb-3">
                    Generated Documents ({documents.length})
                  </h3>

                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                    {documents.map((doc) => {
                      const isSelected = selectedDoc?.id === doc.id;
                      return (
                        <div
                          key={doc.id}
                          onClick={() => {
                            setSelectedDoc(doc);
                            setEditedContent(doc.content);
                            setIsEditing(false);
                          }}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                            isSelected
                              ? 'bg-primary-50 border-primary-500 text-primary-900 shadow-sm font-semibold'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold truncate text-slate-900">{doc.title}</h4>
                            <span className="text-[10px] text-slate-500 capitalize block mt-0.5 font-medium">
                              {doc.doc_type.replace('_', ' ')}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(doc.id);
                            }}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Document Viewer / Editor */}
                <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                  {selectedDoc ? (
                    <div>
                      {/* Doc Header Action Bar */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                        <h3 className="text-lg font-bold font-display text-slate-900 truncate">
                          {selectedDoc.title}
                        </h3>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => setIsEditing(false)}
                                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSaveEdit}
                                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                              >
                                <Save className="w-3.5 h-3.5" />
                                Save
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Edit document manually"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleCopy}
                                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                                title="Copy Markdown"
                              >
                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copied ? 'Copied' : 'Copy'}</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Content Preview or Textarea */}
                      {isEditing ? (
                        <textarea
                          rows={16}
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="w-full p-4 bg-slate-50 text-slate-900 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-primary-600 focus:bg-white leading-relaxed font-mono shadow-sm"
                        />
                      ) : (
                        <div className="prose-custom text-xs sm:text-sm text-slate-700 leading-relaxed max-h-[500px] overflow-y-auto pr-2">
                          <ReactMarkdown>{selectedDoc.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-20 text-slate-500 text-xs font-medium">
                      Select a document from the left or generate a new one.
                    </div>
                  )}
                </div>

              </div>

            </>
          )}

          {/* GENERATE DOCUMENT MODAL */}
          {showGenerateModal && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 font-display">Generate Business Document</h3>
                  <button onClick={() => setShowGenerateModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleGenerate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Document Type</label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white text-slate-900 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:border-primary-600 shadow-sm"
                    >
                      {docTypesList.map((dt) => (
                        <option key={dt.type} value={dt.type}>
                          {dt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Custom Instructions (Optional)</label>
                    <textarea
                      rows={3}
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="e.g. Focus on B2B SaaS unit economics and India market growth potential..."
                      className="w-full px-3.5 py-2.5 bg-white text-slate-900 text-xs rounded-xl border border-slate-300 placeholder:text-slate-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100 shadow-sm"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowGenerateModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={generating}
                      className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md shadow-primary-500/20 flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {generating ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Generate Asset</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
