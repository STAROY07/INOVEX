import React, { useState, useEffect } from 'react';
import {
  BadgePercent,
  Sparkles,
  ExternalLink,
  GraduationCap,
  TrendingUp,
  Building2,
  DollarSign,
  Briefcase,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useStartup } from '../context/StartupContext';
import api from '../api/client';

export const FundingPage = () => {
  const { activeStartup } = useStartup();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState('All');

  const fundingRoutes = [
    { name: 'Bootstrapping & Cash Flow', tag: 'Non-dilutive', desc: 'Self-financing via customer pre-payments, services, and zero burn.' },
    { name: 'Government Grants (SISFS / TIDE)', tag: 'Non-dilutive', desc: 'Up to ₹20L-₹50L grants for DPIIT recognized Indian startups.' },
    { name: 'Angel Investors & Syndicates', tag: 'Equity', desc: 'High-net-worth individuals investing ₹10L - ₹1Cr for 5-15% equity.' },
    { name: 'Venture Capital (Seed / Pre-Series A)', tag: 'Equity', desc: 'Institutional funds for hyper-scalable startups with proven PMF.' },
    { name: 'Incubators & Accelerators', tag: 'Program & Capital', desc: 'Cohort-based mentoring, network, and initial capital (e.g. NSRCEL, T-Hub, AIC).' },
    { name: 'Collateral-Free Bank Loans (CGTMSE)', tag: 'Debt', desc: 'Government-backed bank credit lines up to ₹5Cr for viable operations.' }
  ];

  useEffect(() => {
    const fetchSchemes = async () => {
      setLoading(true);
      try {
        const res = await api.get('/legal/schemes');
        setSchemes(res.data.schemes || []);
      } catch (err) {
        console.error("Schemes load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          setMobileOpen={setMobileOpen}
          pageTitle="Funding Routes & Government Schemes"
          pageSubtitle="Grants, angel networks, institutional venture capital, and DPIIT schemes for Indian founders"
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
          
          {/* Top Banner with Startup Context */}
          <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-surface-100 via-surface-100 to-primary-950/40 border border-slate-800 shadow-glow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-accent-cyan uppercase tracking-wider">
                  Capital Strategy
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {activeStartup?.stage || 'Idea'} Stage Target
                </span>
              </div>
              <h2 className="text-2xl font-bold font-display text-white mt-1">
                Funding Pathways for {activeStartup?.name || 'Your Startup'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Avoid raising equity too early. Match your current validation traction with the appropriate capital instrument.
              </p>
            </div>

            <div className="bg-surface-50 p-4 rounded-xl border border-slate-800 text-xs space-y-1.5 flex-shrink-0 min-w-[240px]">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Recommended Path:</span>
              <p className="font-bold text-accent-emerald text-sm">
                {activeStartup?.stage === 'Idea' || activeStartup?.stage === 'Validation'
                  ? 'Bootstrap → SISFS Grant'
                  : 'Angel Round / Seed Fund'}
              </p>
              <p className="text-[11px] text-slate-400">
                Current Budget: <strong className="text-slate-200">{activeStartup?.available_budget || 'Bootstrap'}</strong>
              </p>
            </div>
          </div>

          {/* FUNDING INSTRUMENTS GRID */}
          <div>
            <h3 className="text-lg font-bold font-display text-white mb-4">
              Explore Funding Routes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fundingRoutes.map((route, idx) => (
                <div
                  key={idx}
                  className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">{route.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-50 text-accent-cyan border border-slate-700">
                        {route.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mt-2">{route.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OFFICIAL INDIAN GOVERNMENT SCHEMES DIRECTORY */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-display text-white">
                  Government Grants & Support Schemes
                </h3>
                <p className="text-xs text-slate-400">
                  Non-dilutive grants and credit guarantee schemes for DPIIT recognized startups
                </p>
              </div>
            </div>

            {loading ? (
              <LoadingSpinner message="Fetching government schemes..." />
            ) : (
              <div className="space-y-4">
                {schemes.map((sch, idx) => (
                  <div
                    key={idx}
                    className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-primary-500/40 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold font-display text-white">{sch.name}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-accent-emerald border border-emerald-800">
                            {sch.stage}
                          </span>
                        </div>
                        <p className="text-xs text-primary-400 font-semibold">{sch.department}</p>
                        
                        <div className="p-3 rounded-xl bg-surface-50 border border-slate-800 text-xs">
                          <strong className="text-accent-cyan font-bold block mb-0.5">Financial Support:</strong>
                          <span className="text-white font-semibold">{sch.grant_amount}</span>
                        </div>

                        <p className="text-xs text-slate-300">
                          <strong className="text-slate-400">Eligibility: </strong>
                          {sch.eligibility}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {sch.focus_areas?.map((fa, i) => (
                            <span key={i} className="text-[10px] bg-surface-50 border border-slate-700 px-2 py-0.5 rounded text-slate-400">
                              {fa}
                            </span>
                          ))}
                        </div>
                      </div>

                      <a
                        href={sch.link}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-glow-sm transition-all flex items-center gap-1.5 flex-shrink-0 self-start"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};
