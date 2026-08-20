import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Award,
  Milestone,
  CheckSquare,
  FlaskConical,
  Bot,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  FileText,
  Scale,
  PlusCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useStartup } from '../context/StartupContext';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { StatCard } from '../components/StatCard';
import { RadarScoreChart } from '../components/RadarScoreChart';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import api from '../api/client';

export const DashboardPage = () => {
  const { activeStartup, hasStartup, loading: startupLoading } = useStartup();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [assessment, setAssessment] = useState(null);
  const [roadmapStages, setRoadmapStages] = useState([]);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [validationRecords, setValidationRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeStartup) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [assessRes, roadRes, taskRes, valRes] = await Promise.all([
          api.get(`/startups/${activeStartup.id}/assessment`),
          api.get(`/startups/${activeStartup.id}/roadmap`),
          api.get(`/startups/${activeStartup.id}/actions`),
          api.get(`/startups/${activeStartup.id}/validation`)
        ]);

        setAssessment(assessRes.data);
        setRoadmapStages(roadRes.data);
        setDailyTasks(taskRes.data);
        setValidationRecords(valRes.data);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [activeStartup]);

  const handleToggleTask = async (taskId, currentStatus) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      await api.put(`/startups/${activeStartup.id}/actions/${taskId}`, { status: nextStatus });
      setDailyTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: nextStatus } : t));
    } catch (err) {
      console.error("Task toggle failed:", err);
    }
  };

  // Calculate Roadmap Progress
  const totalTasks = roadmapStages.reduce((acc, stage) => acc + (stage.tasks?.length || 0), 0);
  const completedTasksCount = roadmapStages.reduce((acc, stage) => {
    return acc + (stage.tasks?.filter(t => t.status === 'completed').length || 0);
  }, 0);
  const roadmapPercent = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          setMobileOpen={setMobileOpen}
          pageTitle="Founder Command Center"
          pageSubtitle="Real-time startup health, prioritized actions, and validation milestones"
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {!hasStartup ? (
            <EmptyState
              icon={Sparkles}
              title="Welcome to INOVEX!"
              description="Start by describing your business idea. INOVEX AI will evaluate your concept, build an 11-stage roadmap, and generate your prioritized next actions."
              actionLabel="Describe My Startup Idea"
              onAction={() => navigate('/onboarding')}
            />
          ) : loading ? (
            <LoadingSpinner message="Syncing founder dashboard..." />
          ) : (
            <>
              {/* TOP METRICS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Idea Health Score"
                  value={`${assessment?.overall_score || 72}/100`}
                  subtitle="Based on 8 AI assessment dimensions"
                  icon={Award}
                  color="primary"
                  badge={assessment?.overall_score >= 75 ? 'Strong Potential' : 'Needs Validation'}
                />
                <StatCard
                  title="Roadmap Execution"
                  value={`${roadmapPercent}%`}
                  subtitle={`${completedTasksCount} of ${totalTasks} tasks completed`}
                  icon={Milestone}
                  color="cyan"
                  badge={`${roadmapStages.filter(s => s.status === 'completed').length}/11 Stages`}
                />
                <StatCard
                  title="Validation Evidence"
                  value={validationRecords.length}
                  subtitle="Interviews, surveys & experiments"
                  icon={FlaskConical}
                  color="emerald"
                  badge={validationRecords.length >= 5 ? 'Validated' : 'Collect More'}
                />
                <StatCard
                  title="Today's Actions"
                  value={`${dailyTasks.filter(t => t.status === 'completed').length}/${dailyTasks.length}`}
                  subtitle="High-impact priority focus items"
                  icon={CheckSquare}
                  color="amber"
                  badge="Daily Focus"
                />
              </div>

              {/* RECOMMENDED NEXT ACTION BANNER */}
              {assessment?.recommended_next_action && (
                <div className="rounded-2xl p-5 bg-gradient-to-r from-primary-900/40 via-surface-100 to-surface-100 border border-primary-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-glow-sm">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-primary-600/30 border border-primary-400/40 flex items-center justify-center text-primary-300 flex-shrink-0 mt-0.5">
                      <Sparkles className="w-5 h-5 text-accent-cyan animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-primary-300 uppercase tracking-wider">Recommended Next Action</span>
                        <span className="text-[10px] bg-primary-950 text-accent-cyan px-2 py-0.5 rounded-full font-semibold">Priority #1</span>
                      </div>
                      <p className="text-sm font-semibold text-white mt-1 leading-snug">
                        {assessment.recommended_next_action}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/mentor')}
                    className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-glow-sm transition-all flex items-center gap-1.5 flex-shrink-0"
                  >
                    <span>Ask Mentor How</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* MAIN CONTENT SPLIT: RADAR SCORE & DAILY TASKS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left: 8-Dimension Assessment Radar Chart */}
                <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
                          <Award className="w-4 h-4 text-primary-400" />
                          AI Idea Feasibility Radar
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Multi-dimensional scoring across critical viability axes
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/assessment')}
                        className="text-xs text-primary-400 hover:text-primary-300 font-semibold flex items-center gap-1"
                      >
                        <span>Full Review</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <RadarScoreChart assessment={assessment} />
                  </div>

                  {/* Summary Breakdown Pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-800/80 text-center">
                    <div className="p-2 rounded-lg bg-surface-50">
                      <p className="text-[10px] text-slate-400">Market Demand</p>
                      <p className="text-xs font-bold text-white mt-0.5">{assessment?.market_demand_score || 70}/100</p>
                    </div>
                    <div className="p-2 rounded-lg bg-surface-50">
                      <p className="text-[10px] text-slate-400">Feasibility</p>
                      <p className="text-xs font-bold text-white mt-0.5">{assessment?.feasibility_score || 65}/100</p>
                    </div>
                    <div className="p-2 rounded-lg bg-surface-50">
                      <p className="text-[10px] text-slate-400">Business Model</p>
                      <p className="text-xs font-bold text-white mt-0.5">{assessment?.business_model_score || 72}/100</p>
                    </div>
                    <div className="p-2 rounded-lg bg-surface-50">
                      <p className="text-[10px] text-slate-400">Scalability</p>
                      <p className="text-xs font-bold text-white mt-0.5">{assessment?.scalability_score || 80}/100</p>
                    </div>
                  </div>
                </div>

                {/* Right: Today's Startup Actions */}
                <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
                          <CheckSquare className="w-4 h-4 text-accent-cyan" />
                          Today's Startup Actions
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          High-leverage tasks to move your startup forward today
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/actions')}
                        className="text-xs text-primary-400 hover:text-primary-300 font-semibold flex items-center gap-1"
                      >
                        <span>View All</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {dailyTasks.slice(0, 3).map((task) => {
                        const isDone = task.status === 'completed';
                        return (
                          <div
                            key={task.id}
                            className={`p-3.5 rounded-xl border transition-all ${
                              isDone
                                ? 'bg-surface-50/40 border-emerald-500/30 opacity-70'
                                : 'bg-surface-50 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => handleToggleTask(task.id, task.status)}
                                className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                                  isDone
                                    ? 'bg-emerald-500 border-emerald-400 text-white'
                                    : 'border-slate-600 hover:border-primary-500'
                                }`}
                              >
                                {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                              </button>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-bold leading-snug ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                                    {task.title}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                                  {task.why_it_matters}
                                </p>
                                <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {task.estimated_time}
                                  </span>
                                  <span>•</span>
                                  <span className="text-primary-400">{task.category}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      {dailyTasks.filter(t => t.status === 'completed').length} completed today
                    </span>
                    <button
                      onClick={() => navigate('/actions')}
                      className="text-primary-400 hover:text-primary-300 font-semibold flex items-center gap-1"
                    >
                      <span>Manage Next Actions</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>

              {/* QUICK SHORTCUT CARDS: STAGE ROADMAP, BUSINESS PLAN, LEGAL */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div
                  onClick={() => navigate('/roadmap')}
                  className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-primary-500/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Milestone className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">11 Stages</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-primary-300 transition-colors">
                    Personalized Roadmap
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Track stage gates from Idea & Validation to Launch & Funding.
                  </p>
                  <div className="mt-4 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary-500 h-full transition-all" style={{ width: `${roadmapPercent}%` }}></div>
                  </div>
                </div>

                <div
                  onClick={() => navigate('/business-plan')}
                  className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-primary-500/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">16 Sections</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    AI Business Plan
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Investor-ready plan with unit economics and section regeneration.
                  </p>
                  <div className="mt-4 flex items-center text-xs font-semibold text-amber-400 gap-1">
                    <span>Open Plan Builder</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>

                <div
                  onClick={() => navigate('/legal')}
                  className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-primary-500/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Scale className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">India Focus</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Legal & Compliance Hub
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Pvt Ltd vs LLP matrix, GST rules, and Startup India SISFS grants.
                  </p>
                  <div className="mt-4 flex items-center text-xs font-semibold text-accent-emerald gap-1">
                    <span>Check Compliance</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>

              </div>

            </>
          )}

        </main>
      </div>
    </div>
  );
};
