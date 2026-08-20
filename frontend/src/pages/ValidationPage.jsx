import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FlaskConical,
  PlusCircle,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Trash2,
  X,
  FileSearch,
  Users,
  BarChart3,
  TestTube
} from 'lucide-react';
import { useStartup } from '../context/StartupContext';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import api from '../api/client';

export const ValidationPage = () => {
  const { activeStartup, hasStartup } = useStartup();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [vType, setVType] = useState('Customer Interview');
  const [vDate, setVDate] = useState(new Date().toISOString().split('T')[0]);
  const [vTitle, setVTitle] = useState('');
  const [vDesc, setVDesc] = useState('');
  const [vResult, setVResult] = useState('');
  const [vEvidence, setVEvidence] = useState('');
  const [vDecision, setVDecision] = useState('Persevere');
  const [vNotes, setVNotes] = useState('');

  useEffect(() => {
    if (!activeStartup) {
      setLoading(false);
      return;
    }

    const fetchValidation = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/startups/${activeStartup.id}/validation`);
        setRecords(res.data);
      } catch (err) {
        console.error("Validation fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchValidation();
  }, [activeStartup]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!vTitle.trim()) return;

    try {
      const res = await api.post(`/startups/${activeStartup.id}/validation`, {
        type: vType,
        date: vDate,
        title: vTitle,
        description: vDesc,
        result: vResult,
        evidence: vEvidence,
        decision: vDecision,
        notes: vNotes
      });

      setRecords(prev => [res.data, ...prev]);
      setShowModal(false);
      // Reset form
      setVTitle('');
      setVDesc('');
      setVResult('');
      setVEvidence('');
      setVNotes('');
    } catch (err) {
      console.error("Create validation record failed:", err);
    }
  };

  const handleDelete = async (recordId) => {
    if (!window.confirm("Are you sure you want to delete this validation evidence record?")) return;
    try {
      await api.delete(`/startups/${activeStartup.id}/validation/${recordId}`);
      setRecords(prev => prev.filter(r => r.id !== recordId));
    } catch (err) {
      console.error("Delete record failed:", err);
    }
  };

  const getDecisionBadge = (decision) => {
    switch (decision) {
      case 'Persevere':
        return 'bg-emerald-950/80 text-accent-emerald border-emerald-800/50';
      case 'Pivot':
        return 'bg-rose-950/80 text-accent-rose border-rose-800/50';
      case 'Iterate':
        return 'bg-amber-950/80 text-accent-amber border-amber-800/50';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Customer Interview': return Users;
      case 'Survey Results': return BarChart3;
      case 'Competitor Research': return FileSearch;
      default: return TestTube;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          setMobileOpen={setMobileOpen}
          pageTitle="Validation Evidence Workspace"
          pageSubtitle="Record interviews, tests, and proof to ground strategic decisions in real evidence"
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
          
          {!hasStartup ? (
            <EmptyState
              icon={FlaskConical}
              title="No startup found"
              description="Create a startup idea to start recording validation evidence."
              actionLabel="Describe Idea"
              onAction={() => navigate('/onboarding')}
            />
          ) : loading ? (
            <LoadingSpinner message="Loading validation records..." />
          ) : (
            <>
              {/* TOP BANNER */}
              <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-surface-100 via-surface-100 to-primary-950/40 border border-slate-800 shadow-glow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-accent-emerald uppercase tracking-wider">
                      Hypothesis Testing Hub
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {records.length} Evidence Records
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
                    Customer Discovery & Proof
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                    Every startup is a set of untested assumptions. Document interviews, prototype experiments, and survey data here.
                  </p>
                </div>

                <button
                  onClick={() => setShowModal(true)}
                  className="px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-glow-sm transition-all flex items-center gap-2 flex-shrink-0"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Record New Evidence</span>
                </button>
              </div>

              {/* RECORDS GRID */}
              {records.length === 0 ? (
                <EmptyState
                  icon={FlaskConical}
                  title="No validation evidence recorded yet"
                  description="Interview 3 potential customers or run a smoke-test landing page to capture your first data point."
                  actionLabel="Record First Evidence"
                  onAction={() => setShowModal(true)}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {records.map((rec) => {
                    const Icon = getTypeIcon(rec.type);
                    return (
                      <div
                        key={rec.id}
                        className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          {/* Header pill strip */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-lg bg-surface-50 border border-slate-700 text-primary-400">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-200 block">{rec.type}</span>
                                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {rec.date}
                                </span>
                              </div>
                            </div>

                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getDecisionBadge(rec.decision)}`}>
                              Decision: {rec.decision}
                            </span>
                          </div>

                          <h3 className="text-base font-bold font-display text-white">
                            {rec.title}
                          </h3>

                          {/* Description & Result */}
                          <div className="space-y-2 text-xs">
                            <div className="p-3 rounded-xl bg-surface-50 border border-slate-800">
                              <strong className="text-slate-400 text-[10px] uppercase block mb-0.5">What was tested:</strong>
                              <p className="text-slate-300 leading-relaxed">{rec.description}</p>
                            </div>

                            <div className="p-3 rounded-xl bg-surface-50 border border-slate-800">
                              <strong className="text-accent-cyan text-[10px] uppercase block mb-0.5">Key Finding / Result:</strong>
                              <p className="text-white leading-relaxed">{rec.result}</p>
                            </div>

                            <div className="p-3 rounded-xl bg-surface-50 border border-slate-800">
                              <strong className="text-accent-emerald text-[10px] uppercase block mb-0.5">Concrete Proof / Quote:</strong>
                              <p className="text-slate-300 italic leading-relaxed">"{rec.evidence}"</p>
                            </div>
                          </div>

                          {rec.notes && (
                            <p className="text-[11px] text-slate-400 italic">
                              <strong className="not-italic text-slate-300">Notes: </strong>{rec.notes}
                            </p>
                          )}
                        </div>

                        {/* Footer actions */}
                        <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500">
                            Validated on {rec.date}
                          </span>
                          <button
                            onClick={() => handleDelete(rec.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                            title="Delete record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </>
          )}

          {/* CREATE RECORD MODAL */}
          {showModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-surface-100 rounded-2xl border border-slate-700 p-6 max-w-xl w-full shadow-glow-md my-8">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white font-display">Record Validation Evidence</h3>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Evidence Type *</label>
                      <select
                        value={vType}
                        onChange={(e) => setVType(e.target.value)}
                        className="w-full px-3 py-2 bg-surface-50 text-white text-xs rounded-xl border border-slate-700 focus:outline-none"
                      >
                        <option value="Customer Interview">Customer Interview</option>
                        <option value="Survey Results">Survey Results</option>
                        <option value="Competitor Research">Competitor Research</option>
                        <option value="Market Experiment">Market Experiment (Smoke Test)</option>
                        <option value="MVP Test">MVP Prototype Test</option>
                        <option value="User Feedback">User Feedback / Support Log</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Date *</label>
                      <input
                        type="date"
                        required
                        value={vDate}
                        onChange={(e) => setVDate(e.target.value)}
                        className="w-full px-3 py-2 bg-surface-50 text-white text-xs rounded-xl border border-slate-700 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Evidence Title *</label>
                    <input
                      type="text"
                      required
                      value={vTitle}
                      onChange={(e) => setVTitle(e.target.value)}
                      placeholder="e.g. 5 Discovery calls with SMB agency owners in Bangalore"
                      className="w-full px-3.5 py-2.5 bg-surface-50 text-white text-xs rounded-xl border border-slate-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Description / What was tested *</label>
                    <textarea
                      rows={2}
                      required
                      value={vDesc}
                      onChange={(e) => setVDesc(e.target.value)}
                      placeholder="e.g. Tested willingness to pay ₹1,499/mo for automated GST reconciliation"
                      className="w-full px-3.5 py-2.5 bg-surface-50 text-white text-xs rounded-xl border border-slate-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Result / Findings *</label>
                    <textarea
                      rows={2}
                      required
                      value={vResult}
                      onChange={(e) => setVResult(e.target.value)}
                      placeholder="e.g. 4 out of 5 confirmed they would switch immediately if bank statement import worked seamlessly"
                      className="w-full px-3.5 py-2.5 bg-surface-50 text-white text-xs rounded-xl border border-slate-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Concrete Evidence / Direct Quotes *</label>
                    <textarea
                      rows={2}
                      required
                      value={vEvidence}
                      onChange={(e) => setVEvidence(e.target.value)}
                      placeholder='e.g. "I currently pay ₹5,000/mo to my accountant just for basic filing errors."'
                      className="w-full px-3.5 py-2.5 bg-surface-50 text-white text-xs rounded-xl border border-slate-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Strategic Decision</label>
                    <select
                      value={vDecision}
                      onChange={(e) => setVDecision(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-50 text-white text-xs rounded-xl border border-slate-700 focus:outline-none"
                    >
                      <option value="Persevere">Persevere (Hypothesis validated, proceed forward)</option>
                      <option value="Iterate">Iterate (Minor adjustments to pricing or messaging)</option>
                      <option value="Pivot">Pivot (Fatal assumption disproven, shift strategy)</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-xl bg-surface-50 text-slate-400 text-xs font-semibold hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-glow-sm"
                    >
                      Save Evidence
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
