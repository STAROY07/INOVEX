import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FlaskConical,
  PlusCircle,
  Calendar,
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
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Pivot':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Iterate':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
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
    <div className="min-h-screen bg-slate-50 flex text-slate-900">
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
              <div className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      Hypothesis Testing Hub
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {records.length} Evidence Records
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-2">
                    Customer Discovery & Proof
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                    Every startup is a set of untested assumptions. Document interviews, prototype experiments, and survey data here.
                  </p>
                </div>

                <button
                  onClick={() => setShowModal(true)}
                  className="px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md shadow-primary-500/20 transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer"
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
                        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          {/* Header pill strip */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-lg bg-primary-50 border border-primary-200 text-primary-700">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-900 block">{rec.type}</span>
                                <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                                  <Calendar className="w-3 h-3" />
                                  {rec.date}
                                </span>
                              </div>
                            </div>

                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getDecisionBadge(rec.decision)}`}>
                              Decision: {rec.decision}
                            </span>
                          </div>

                          <h3 className="text-base font-bold font-display text-slate-900">
                            {rec.title}
                          </h3>

                          {/* Description & Result */}
                          <div className="space-y-2 text-xs">
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                              <strong className="text-slate-500 text-[10px] font-bold uppercase block mb-0.5">What was tested:</strong>
                              <p className="text-slate-700 leading-relaxed font-medium">{rec.description}</p>
                            </div>

                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                              <strong className="text-cyan-700 text-[10px] font-bold uppercase block mb-0.5">Key Finding / Result:</strong>
                              <p className="text-slate-900 font-semibold leading-relaxed">{rec.result}</p>
                            </div>

                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                              <strong className="text-emerald-700 text-[10px] font-bold uppercase block mb-0.5">Concrete Proof / Quote:</strong>
                              <p className="text-slate-800 italic font-medium leading-relaxed">"{rec.evidence}"</p>
                            </div>
                          </div>

                          {rec.notes && (
                            <p className="text-[11px] text-slate-500 italic">
                              <strong className="not-italic text-slate-700 font-semibold">Notes: </strong>{rec.notes}
                            </p>
                          )}
                        </div>

                        {/* Footer actions */}
                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 font-medium">
                            Validated on {rec.date}
                          </span>
                          <button
                            onClick={() => handleDelete(rec.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-xl w-full shadow-2xl my-8">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 font-display">Record Validation Evidence</h3>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Evidence Type *</label>
                      <select
                        value={vType}
                        onChange={(e) => setVType(e.target.value)}
                        className="w-full px-3 py-2 bg-white text-slate-900 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-primary-600 shadow-sm"
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
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Date *</label>
                      <input
                        type="date"
                        required
                        value={vDate}
                        onChange={(e) => setVDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white text-slate-900 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-primary-600 shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Evidence Title *</label>
                    <input
                      type="text"
                      required
                      value={vTitle}
                      onChange={(e) => setVTitle(e.target.value)}
                      placeholder="e.g. 5 Discovery calls with SMB agency owners in Bangalore"
                      className="w-full px-3.5 py-2.5 bg-white text-slate-900 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description / What was tested *</label>
                    <textarea
                      rows={2}
                      required
                      value={vDesc}
                      onChange={(e) => setVDesc(e.target.value)}
                      placeholder="e.g. Tested willingness to pay ₹1,499/mo for automated GST reconciliation"
                      className="w-full px-3.5 py-2.5 bg-white text-slate-900 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Result / Findings *</label>
                    <textarea
                      rows={2}
                      required
                      value={vResult}
                      onChange={(e) => setVResult(e.target.value)}
                      placeholder="e.g. 4 out of 5 confirmed they would switch immediately if bank statement import worked seamlessly"
                      className="w-full px-3.5 py-2.5 bg-white text-slate-900 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Concrete Evidence / Direct Quotes *</label>
                    <textarea
                      rows={2}
                      required
                      value={vEvidence}
                      onChange={(e) => setVEvidence(e.target.value)}
                      placeholder='e.g. "I currently pay ₹5,000/mo to my accountant just for basic filing errors."'
                      className="w-full px-3.5 py-2.5 bg-white text-slate-900 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Strategic Decision</label>
                    <select
                      value={vDecision}
                      onChange={(e) => setVDecision(e.target.value)}
                      className="w-full px-3 py-2 bg-white text-slate-900 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-primary-600 shadow-sm"
                    >
                      <option value="Persevere">Persevere (Hypothesis validated, proceed forward)</option>
                      <option value="Iterate">Iterate (Minor adjustments to pricing or messaging)</option>
                      <option value="Pivot">Pivot (Fatal assumption disproven, shift strategy)</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md shadow-primary-500/20 cursor-pointer"
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
