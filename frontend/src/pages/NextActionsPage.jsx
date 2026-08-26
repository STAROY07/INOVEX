import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  PlusCircle,
  Clock,
  CheckCircle2,
  Target,
  RefreshCw,
  X
} from 'lucide-react';
import { useStartup } from '../context/StartupContext';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import api from '../api/client';
import confetti from 'canvas-confetti';

export const NextActionsPage = () => {
  const { activeStartup, hasStartup } = useStartup();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newWhy, setNewWhy] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const [newPriority, setNewPriority] = useState('High');
  const [newTime, setNewTime] = useState('1 hour');
  const [newCategory, setNewCategory] = useState('Validation');

  useEffect(() => {
    if (!activeStartup) {
      setLoading(false);
      return;
    }

    const fetchActions = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/startups/${activeStartup.id}/actions`);
        setActions(res.data);
      } catch (err) {
        console.error("Actions fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, [activeStartup]);

  const handleToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      await api.put(`/startups/${activeStartup.id}/actions/${id}`, { status: nextStatus });
      setActions(prev => prev.map(a => a.id === id ? { ...a, status: nextStatus } : a));
      if (nextStatus === 'completed') {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error("Toggle action error:", err);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const res = await api.post(`/startups/${activeStartup.id}/actions/regenerate`);
      setActions(res.data);
    } catch (err) {
      console.error("Regenerate failed:", err);
    } finally {
      setRegenerating(false);
    }
  };

  const handleCreateCustom = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await api.post(`/startups/${activeStartup.id}/actions`, {
        title: newTitle,
        why_it_matters: newWhy || 'Founder-defined operational milestone',
        expected_outcome: newOutcome || 'Documented task completion',
        priority: newPriority,
        estimated_time: newTime,
        category: newCategory,
        step_by_step: ['Execute task', 'Verify results with team / customers']
      });

      setActions(prev => [res.data, ...prev]);
      setShowAddModal(false);
      setNewTitle('');
      setNewWhy('');
      setNewOutcome('');
    } catch (err) {
      console.error("Create action failed:", err);
    }
  };

  const completedCount = actions.filter(a => a.status === 'completed').length;

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          setMobileOpen={setMobileOpen}
          pageTitle="Prioritised Next Actions"
          pageSubtitle="The high-leverage steps you need to execute right now"
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full">
          
          {!hasStartup ? (
            <EmptyState
              icon={CheckSquare}
              title="No startup found"
              description="Create a startup idea to generate prioritized daily actions."
              actionLabel="Describe Idea"
              onAction={() => navigate('/onboarding')}
            />
          ) : loading ? (
            <LoadingSpinner message="Calculating highest-impact actions..." />
          ) : (
            <>
              {/* TOP BANNER */}
              <div className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
                      Execution Queue
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {completedCount} / {actions.length} Completed
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-2">
                    What to do next for {activeStartup.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                    Focus strictly on these high-conviction tasks before adding more features or starting random marketing.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md shadow-primary-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Custom Action</span>
                  </button>

                  <button
                    onClick={handleRegenerate}
                    disabled={regenerating}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 shadow-sm transition-colors cursor-pointer"
                    title="Generate New Action Recommendations"
                  >
                    <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin text-primary-600' : ''}`} />
                  </button>
                </div>
              </div>

              {/* ACTION CARDS LIST */}
              <div className="space-y-4">
                {actions.map((act, index) => {
                  const isDone = act.status === 'completed';
                  return (
                    <div
                      key={act.id}
                      className={`bg-white rounded-2xl p-6 border transition-all ${
                        isDone
                          ? 'border-emerald-200 bg-emerald-50/20'
                          : 'border-slate-200 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        
                        {/* Checkbox */}
                        <button
                          onClick={() => handleToggle(act.id, act.status)}
                          className={`w-7 h-7 rounded-xl border flex items-center justify-center mt-1 flex-shrink-0 transition-all cursor-pointer ${
                            isDone
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                              : 'border-slate-300 hover:border-primary-500 bg-white'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-bold text-slate-500">{index + 1}</span>}
                        </button>

                        <div className="min-w-0 flex-1 space-y-3">
                          
                          {/* Title & Badges */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h3 className={`text-base font-bold font-display ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                              {act.title}
                            </h3>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200">
                                {act.priority} Priority
                              </span>
                              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                {act.category}
                              </span>
                            </div>
                          </div>

                          {/* Why it matters */}
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                            <strong className="text-primary-700 font-bold block mb-0.5">Why this matters:</strong>
                            <p className="text-slate-700 leading-relaxed font-medium">{act.why_it_matters}</p>
                          </div>

                          {/* Step by Step */}
                          {act.step_by_step && act.step_by_step.length > 0 && (
                            <div>
                              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                                Step-by-Step Instructions
                              </span>
                              <ol className="space-y-1.5 pl-1">
                                {act.step_by_step.map((step, i) => (
                                  <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                                    <span className="w-4 h-4 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                      {i + 1}
                                    </span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}

                          {/* Expected Deliverable */}
                          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100 text-xs">
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Target className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Deliverable: <strong className="text-slate-900">{act.expected_outcome}</strong></span>
                            </div>

                            <div className="flex items-center gap-1 text-slate-500 text-[11px] font-medium">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>Est: {act.estimated_time}</span>
                            </div>
                          </div>

                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

            </>
          )}

          {/* ADD CUSTOM ACTION MODAL */}
          {showAddModal && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 font-display">Add Custom Founder Action</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateCustom} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Task Title *</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Schedule 5 user test calls"
                      className="w-full px-3.5 py-2.5 bg-white text-slate-900 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Why it matters</label>
                    <textarea
                      rows={2}
                      value={newWhy}
                      onChange={(e) => setNewWhy(e.target.value)}
                      placeholder="Explain the strategic rationale for doing this now"
                      className="w-full px-3.5 py-2.5 bg-white text-slate-900 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Expected Outcome</label>
                    <input
                      type="text"
                      value={newOutcome}
                      onChange={(e) => setNewOutcome(e.target.value)}
                      placeholder="e.g. 5 completed feedback logs"
                      className="w-full px-3.5 py-2.5 bg-white text-slate-900 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100 shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Priority</label>
                      <select
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value)}
                        className="w-full px-2.5 py-2 bg-white text-slate-900 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-primary-600 shadow-sm"
                      >
                        <option value="Urgent">Urgent</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Est. Time</label>
                      <input
                        type="text"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        placeholder="e.g. 2 hours"
                        className="w-full px-2.5 py-2 bg-white text-slate-900 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-primary-600 shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-2.5 py-2 bg-white text-slate-900 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-primary-600 shadow-sm"
                      >
                        <option value="Validation">Validation</option>
                        <option value="Product">Product</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Legal">Legal</option>
                        <option value="Finance">Finance</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md shadow-primary-500/20 cursor-pointer"
                    >
                      Save Action
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
