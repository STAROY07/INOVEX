import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Milestone,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useStartup } from '../context/StartupContext';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import api from '../api/client';
import confetti from 'canvas-confetti';

export const RoadmapPage = () => {
  const { activeStartup, hasStartup } = useStartup();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedStage, setExpandedStage] = useState(null);

  useEffect(() => {
    if (!activeStartup) {
      setLoading(false);
      return;
    }

    const fetchRoadmap = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/startups/${activeStartup.id}/roadmap`);
        setStages(res.data);
        if (res.data.length > 0) {
          // Default expand first in-progress or not completed stage
          const current = res.data.find(s => s.status !== 'completed') || res.data[0];
          setExpandedStage(current.id);
        }
      } catch (err) {
        console.error("Roadmap fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [activeStartup]);

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    if (!activeStartup) return;
    try {
      const res = await api.put(`/startups/${activeStartup.id}/roadmap/tasks/${taskId}`, {
        status: newStatus
      });

      // Update state locally
      setStages(prevStages => {
        return prevStages.map(stage => {
          const updatedTasks = stage.tasks.map(t => t.id === taskId ? res.data : t);
          const allDone = updatedTasks.length > 0 && updatedTasks.every(t => t.status === 'completed');
          const anyActive = updatedTasks.some(t => t.status === 'in_progress' || t.status === 'completed');
          return {
            ...stage,
            tasks: updatedTasks,
            status: allDone ? 'completed' : anyActive ? 'in_progress' : 'not_started'
          };
        });
      });

      if (newStatus === 'completed') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    } catch (err) {
      console.error("Task update failed:", err);
    }
  };

  const toggleExpand = (stageId) => {
    setExpandedStage(expandedStage === stageId ? null : stageId);
  };

  // Progress metrics
  const totalTasks = stages.reduce((acc, s) => acc + (s.tasks?.length || 0), 0);
  const completedTasks = stages.reduce((acc, s) => acc + (s.tasks?.filter(t => t.status === 'completed').length || 0), 0);
  const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const completedStagesCount = stages.filter(s => s.status === 'completed').length;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          setMobileOpen={setMobileOpen}
          pageTitle="Personalized Startup Roadmap"
          pageSubtitle="11 structured milestones from Idea Validation to Growth & Funding"
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
          
          {!hasStartup ? (
            <EmptyState
              icon={Milestone}
              title="No startup found"
              description="Create a startup idea to generate your personalized 11-stage roadmap."
              actionLabel="Describe Idea"
              onAction={() => navigate('/onboarding')}
            />
          ) : loading ? (
            <LoadingSpinner message="Building your personalized 11-stage roadmap..." submessage="Mapping out problem discovery, MVP, Indian legal registration, and growth milestones..." />
          ) : (
            <>
              {/* TOP ROADMAP OVERVIEW CARD */}
              <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-surface-100 via-surface-100 to-primary-950/40 border border-slate-800 shadow-glow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">
                      Structured Founder Journey
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {completedStagesCount} / 11 Stages Completed
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
                    {activeStartup.name} Execution Plan
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                    Follow the sequential gates below. Mark tasks in progress or completed to unlock subsequent stage gates.
                  </p>
                </div>

                <div className="w-full md:w-64 flex-shrink-0 bg-surface-50 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-slate-300">Overall Progress</span>
                    <span className="text-accent-cyan font-extrabold">{percent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-accent-cyan h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 text-right">
                    {completedTasks} of {totalTasks} tasks complete
                  </p>
                </div>
              </div>

              {/* 11 STAGES TIMELINE */}
              <div className="space-y-4">
                {stages.map((stage, idx) => {
                  const isExpanded = expandedStage === stage.id;
                  const isDone = stage.status === 'completed';
                  const isCurrent = stage.status === 'in_progress';
                  const stageTasksCount = stage.tasks?.length || 0;
                  const stageDoneTasks = stage.tasks?.filter(t => t.status === 'completed').length || 0;

                  return (
                    <div
                      key={stage.id}
                      className={`glass-card rounded-2xl border transition-all overflow-hidden ${
                        isCurrent
                          ? 'border-primary-500/60 shadow-glow-sm'
                          : isDone
                          ? 'border-emerald-500/40 bg-surface-100/40'
                          : 'border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {/* Stage Header Accordion Toggle */}
                      <div
                        onClick={() => toggleExpand(stage.id)}
                        className="p-5 flex items-center justify-between cursor-pointer hover:bg-surface-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-sm flex-shrink-0 ${
                            isDone
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : isCurrent
                              ? 'bg-primary-600 text-white shadow-glow-sm'
                              : 'bg-surface-50 text-slate-400 border border-slate-700'
                          }`}>
                            {isDone ? <CheckCircle2 className="w-5 h-5" /> : `0${stage.stage_order}`}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold font-display text-white truncate">
                                {stage.stage_name}
                              </h3>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                isDone
                                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800/50'
                                  : isCurrent
                                  ? 'bg-primary-950 text-accent-cyan border-primary-800/50'
                                  : 'bg-slate-900 text-slate-400 border-slate-800'
                              }`}>
                                {isDone ? 'Completed' : isCurrent ? 'Active Stage' : 'Up Next'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xl">
                              {stage.objective}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 flex-shrink-0">
                          <span className="text-xs text-slate-400 hidden sm:inline">
                            {stageDoneTasks}/{stageTasksCount} Tasks
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </div>

                      {/* Stage Body Content */}
                      {isExpanded && (
                        <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 bg-surface-100/30 space-y-4">
                          
                          {/* Objective & Expected Outcome Strip */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-surface-50 p-4 rounded-xl border border-slate-800 text-xs">
                            <div>
                              <strong className="text-primary-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                                Stage Objective
                              </strong>
                              <p className="text-slate-200">{stage.objective}</p>
                            </div>
                            <div>
                              <strong className="text-accent-emerald font-bold uppercase tracking-wider text-[10px] block mb-1">
                                Expected Deliverable / Outcome
                              </strong>
                              <p className="text-slate-200">{stage.expected_outcome}</p>
                            </div>
                          </div>

                          {/* Tasks List */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                              Action Items for this Stage
                            </h4>

                            {stage.tasks?.map((task) => {
                              const isTaskDone = task.status === 'completed';
                              const isTaskActive = task.status === 'in_progress';

                              return (
                                <div
                                  key={task.id}
                                  className={`p-4 rounded-xl border transition-all ${
                                    isTaskDone
                                      ? 'bg-surface-50/50 border-emerald-500/30'
                                      : isTaskActive
                                      ? 'bg-surface-50 border-primary-500/50 shadow-sm'
                                      : 'bg-surface-50 border-slate-800 hover:border-slate-700'
                                  }`}
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                    <div className="space-y-1">
                                      <h5 className={`text-sm font-bold ${isTaskDone ? 'line-through text-slate-400' : 'text-white'}`}>
                                        {task.title}
                                      </h5>
                                      {task.description && (
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                          {task.description}
                                        </p>
                                      )}
                                      {task.why_it_matters && (
                                        <p className="text-[11px] text-slate-400 italic">
                                          <strong className="text-primary-400 not-italic">Why it matters: </strong>
                                          {task.why_it_matters}
                                        </p>
                                      )}
                                      <div className="flex items-center gap-3 pt-1 text-[10px] text-slate-500">
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          Est: {task.estimated_time}
                                        </span>
                                        <span>•</span>
                                        <span className="text-primary-400 font-semibold">{task.priority} Priority</span>
                                      </div>
                                    </div>

                                    {/* Status Controls */}
                                    <div className="flex items-center gap-2 flex-shrink-0 pt-2 sm:pt-0">
                                      <select
                                        aria-label="Update task status"
                                        value={task.status}
                                        onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                                        className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border focus:outline-none cursor-pointer ${
                                          isTaskDone
                                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                            : isTaskActive
                                            ? 'bg-primary-950 text-accent-cyan border-primary-800'
                                            : 'bg-surface-100 text-slate-300 border-slate-700'
                                        }`}
                                      >
                                        <option value="not_started">Not Started</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed ✓</option>
                                      </select>
                                    </div>
                                  </div>

                                  {/* Resources Links */}
                                  {task.resources && task.resources.length > 0 && (
                                    <div className="mt-3 pt-2 border-t border-slate-800 flex items-center gap-2 text-xs">
                                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Guides:</span>
                                      {task.resources.map((res, i) => (
                                        <a
                                          key={i}
                                          href={res.url}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-primary-400 hover:text-primary-300 text-xs inline-flex items-center gap-1 underline"
                                        >
                                          {res.name}
                                          <ExternalLink className="w-3 h-3" />
                                        </a>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

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
