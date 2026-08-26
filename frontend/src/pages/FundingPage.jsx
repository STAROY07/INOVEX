import React, { useState, useEffect } from 'react';
import {
  ExternalLink
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
    <div className="min-h-screen bg-slate-50 flex text-slate-900">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          setMobileOpen={setMobileOpen}
          pageTitle="Funding Routes & Government Schemes"
          pageSubtitle="Grants, angel networks, institutional venture capital, and DPIIT schemes for Indian founders"
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
          
          {/* Top Banner with Startup Context */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
                  Capital Strategy
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {activeStartup?.stage || 'Idea'} Stage Target
                </span>
              </div>
              <h2 className="text-2xl font-extrabold font-display text-slate-900 mt-2">
                Funding Pathways for {activeStartup?.name || 'Your Startup'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Avoid raising equity too early. Match your current validation traction with the appropriate capital instrument.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5 flex-shrink-0 min-w-[240px]">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Recommended Path:</span>
              <p className="font-extrabold text-emerald-700 text-sm">
                {activeStartup?.stage === 'Idea' || activeStartup?.stage === 'Validation'
                  ? 'Bootstrap → SISFS Grant'
                  : 'Angel Round / Seed Fund'}
              </p>
              <p className="text-[11px] text-slate-600 font-medium">
                Current Budget: <strong className="text-slate-900">{activeStartup?.available_budget || 'Bootstrap'}</strong>
              </p>
            </div>
          </div>

          {/* FUNDING INSTRUMENTS GRID */}
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900 mb-4">
              Explore Funding Routes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fundingRoutes.map((route, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900">{route.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200">
                        {route.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-2 font-medium">{route.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OFFICIAL INDIAN GOVERNMENT SCHEMES DIRECTORY */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-display text-slate-900">
                  Government Grants & Support Schemes
                </h3>
                <p className="text-xs text-slate-500 font-medium">
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
                    className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-primary-300 shadow-sm transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold font-display text-slate-900">{sch.name}</h4>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {sch.stage}
                          </span>
                        </div>
                        <p className="text-xs text-primary-700 font-bold">{sch.department}</p>
                        
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <strong className="text-cyan-700 font-bold block mb-0.5">Financial Support:</strong>
                          <span className="text-slate-900 font-semibold">{sch.grant_amount}</span>
                        </div>

                        <p className="text-xs text-slate-700">
                          <strong className="text-slate-900 font-semibold">Eligibility: </strong>
                          {sch.eligibility}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {sch.focus_areas?.map((fa, i) => (
                            <span key={i} className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-600 font-medium">
                              {fa}
                            </span>
                          ))}
                        </div>
                      </div>

                      <a
                        href={sch.link}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md shadow-primary-500/20 transition-all flex items-center gap-1.5 flex-shrink-0 self-start cursor-pointer"
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
