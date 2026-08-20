import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  Clock,
  CheckCircle2,
  ArrowRight,
  Filter,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import api from '../api/client';

export const LearningResourcesPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const categoriesList = [
    'All',
    'Idea Validation',
    'Market Research',
    'Business Model',
    'Marketing',
    'Legal Basics',
    'Funding',
    'MVP Development',
    'Sales'
  ];

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category !== 'All') params.category = category;
        if (search.trim()) params.search = search.trim();

        const res = await api.get('/resources', { params });
        setResources(res.data);
      } catch (err) {
        console.error("Resources load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [category, search]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          setMobileOpen={setMobileOpen}
          pageTitle="Startup Learning Resources"
          pageSubtitle="Curated playbooks on validation, pricing, sales, and entity incorporation in India"
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
          
          {/* SEARCH & CATEGORY FILTER */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search playbooks by title, topic, or keyword (e.g. Mom Test, Pricing, GST, MVP)..."
                className="w-full pl-10 pr-4 py-3 bg-surface-50 text-white text-xs sm:text-sm rounded-xl border border-slate-700 focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    category === cat
                      ? 'bg-primary-600 border-primary-500 text-white shadow-glow-sm'
                      : 'bg-surface-50 border-slate-700/80 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          {/* RESOURCES FEED */}
          {loading ? (
            <LoadingSpinner message="Searching curated founder knowledge..." />
          ) : resources.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <p className="text-sm font-semibold text-white">No matching resources found.</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for a different keyword or selecting 'All'.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {resources.map((res) => {
                const isExpanded = expandedId === res.id;
                return (
                  <div
                    key={res.id}
                    className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-950 text-accent-cyan border border-primary-800">
                          {res.category}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {res.read_time}
                        </span>
                        <span className="text-[10px] text-slate-400">• {res.difficulty}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold font-display text-white">
                      {res.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {res.description}
                    </p>

                    {/* Expandable Deep Dive */}
                    {isExpanded && (
                      <div className="pt-4 border-t border-slate-800 space-y-4">
                        <div className="p-4 rounded-xl bg-surface-50 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                          {res.content}
                        </div>

                        {/* Key Takeaways */}
                        {res.key_takeaways && res.key_takeaways.length > 0 && (
                          <div className="p-4 rounded-xl bg-primary-950/30 border border-primary-900/50 space-y-2">
                            <span className="text-xs font-bold text-accent-cyan uppercase tracking-wider block">
                              Key Takeaways:
                            </span>
                            <ul className="space-y-1.5 text-xs text-slate-300">
                              {res.key_takeaways.map((t, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-accent-cyan flex-shrink-0 mt-0.5" />
                                  <span>{t}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Action Steps */}
                        {res.action_steps && res.action_steps.length > 0 && (
                          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-900/50 space-y-2">
                            <span className="text-xs font-bold text-accent-emerald uppercase tracking-wider block">
                              Immediate Action Steps:
                            </span>
                            <ul className="space-y-1.5 text-xs text-slate-300">
                              {res.action_steps.map((a, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5" />
                                  <span>{a}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {res.tags?.map((t, i) => (
                          <span key={i} className="text-[10px] text-slate-400 bg-surface-50 border border-slate-800 px-2 py-0.5 rounded">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => toggleExpand(res.id)}
                        className="text-xs font-semibold text-primary-400 hover:text-primary-300 flex items-center gap-1"
                      >
                        <span>{isExpanded ? 'Show Less' : 'Read Full Playbook'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
