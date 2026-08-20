import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Files,
  Sparkles,
  PlusCircle,
  FileText,
  Copy,
  Check,
  Trash2,
  Edit3,
  Save,
  Download,
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
    <div className="min-h-screen bg-background flex">
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
              <div className="rounded-2xl p-6 bg-gradient-to-r from-surface-100 via-surface-100 to-primary-950/40 border border-slate-800 shadow-glow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">
                    Asset Library
                  </span>
                  <h2 className="text-2xl font-bold font-display text-white mt-1">
                    Startup Documents for {activeStartup.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Exportable, markdown-formatted assets for partners, investors, and team members.
                  </p>
                </div>

                <button
                  onClick={() => setShowGenerateModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-glow-sm transition-all flex items-center gap-2 flex-shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-accent-cyan" />
                  <span>Generate New Document</span>
                </button>
              </div>

              {/* MAIN CONTENT SPLIT: SIDE LIST & PREVIEW */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
                
                {/* Left: Document List */}
                <div className="lg:col-span-4 space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-3">
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
                              ? 'bg-primary-600/20 border-primary-500 text-white shadow-glow-sm'
                              : 'bg-surface-50 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold truncate">{doc.title}</h4>
                            <span className="text-[10px] text-slate-400 capitalize block mt-0.5">
                              {doc.doc_type.replace('_', ' ')}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(doc.id);
                            }}
                            className="text-slate-500 hover:text-rose-400 p-1"
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
                <div className="lg:col-span-8 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
                  {selectedDoc ? (
                    <div>
                      {/* Doc Header Action Bar */}
                      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                        <h3 className="text-lg font-bold font-display text-white truncate">
                          {selectedDoc.title}
                        </h3>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => setIsEditing(false)}
                                className="px-3 py-1.5 rounded-lg bg-surface-50 text-slate-400 text-xs font-semibold hover:text-white"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSaveEdit}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1"
                              >
                                <Save className="w-3.5 h-3.5" />
                                Save
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 rounded-lg bg-surface-50 hover:bg-surface-200 border border-slate-700 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1"
                                title="Edit Document"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Edit</span>
                              </button>
                              <button
                                onClick={handleCopy}
                                className="p-2 rounded-lg bg-surface-50 hover:bg-surface-200 border border-slate-700 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1"
                                title="Copy Markdown"
                              >
                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Content Area */}
                      {isEditing ? (
                        <textarea
                          rows={16}
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="w-full p-4 bg-surface-50 text-white text-xs sm:text-sm rounded-xl border border-slate-700 focus:outline-none focus:border-primary-500 font-mono leading-relaxed"
                        />
                      ) : (
                        <div className="prose-custom text-xs sm:text-sm text-slate-300 leading-relaxed max-h-[600px] overflow-y-auto pr-2">
                          <ReactMarkdown>{selectedDoc.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
                      <Files className="w-12 h-12 text-slate-600 mb-3" />
                      <p className="text-sm font-semibold text-white">Select a document to preview or edit</p>
                      <p className="text-xs text-slate-500 mt-1">Or generate a new pitch deck, SWOT matrix, or marketing plan.</p>
                    </div>
                  )}
                </div>

              </div>

            </>
          )}

          {/* GENERATE MODAL */}
          {showGenerateModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-surface-100 rounded-2xl border border-slate-700 p-6 max-w-lg w-full shadow-glow-md">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white font-display">Generate Startup Document</h3>
                  <button onClick={() => setShowGenerateModal(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleGenerate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Select Document Type *</label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-surface-50 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-primary-500"
                    >
                      {docTypesList.map(dt => (
                        <option key={dt.type} value={dt.type}>{dt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Custom Focus / Context (Optional)</label>
                    <textarea
                      rows={3}
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="e.g. Highlight our UPI integration and focus on Tier-2 small business pain points..."
                      className="w-full px-3.5 py-2.5 bg-surface-50 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowGenerateModal(false)}
                      className="px-4 py-2 rounded-xl bg-surface-50 text-slate-400 text-xs font-semibold hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={generating}
                      className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-glow-sm flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {generating ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating with AI...</span>
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
