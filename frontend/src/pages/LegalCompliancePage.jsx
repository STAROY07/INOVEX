import React, { useState, useEffect } from 'react';
import {
  Scale,
  ShieldCheck,
  Building2,
  Receipt,
  FileCheck2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { LoadingSpinner } from '../components/LoadingSpinner';
import api from '../api/client';

export const LegalCompliancePage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [structuresData, setStructuresData] = useState([]);
  const [complianceData, setComplianceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('structures'); // structures, compliance, gst

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [structRes, compRes] = await Promise.all([
          api.get('/legal/structures'),
          api.get('/legal/compliance-checklist')
        ]);
        setStructuresData(structRes.data.structures || []);
        setComplianceData(compRes.data || []);
      } catch (err) {
        console.error("Legal data load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          setMobileOpen={setMobileOpen}
          pageTitle="Legal & Compliance Hub (India)"
          pageSubtitle="Entity formation comparison, SPICe+ registration, GST thresholds, and compliance roadmap"
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
          
          {/* MANDATORY DISCLAIMER */}
          <DisclaimerBanner />

          {/* TOP TABS */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('structures')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'structures'
                  ? 'bg-primary-600 text-white shadow-glow-sm'
                  : 'bg-surface-50 text-slate-400 hover:text-white'
              }`}
            >
              Entity Structures (Pvt Ltd vs LLP)
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'compliance'
                  ? 'bg-primary-600 text-white shadow-glow-sm'
                  : 'bg-surface-50 text-slate-400 hover:text-white'
              }`}
            >
              Compliance Checklist
            </button>
            <button
              onClick={() => setActiveTab('gst')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'gst'
                  ? 'bg-primary-600 text-white shadow-glow-sm'
                  : 'bg-surface-50 text-slate-400 hover:text-white'
              }`}
            >
              GST, MSME & Startup India
            </button>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading legal and compliance database..." />
          ) : (
            <>
              {/* TAB 1: ENTITY STRUCTURES COMPARISON */}
              {activeTab === 'structures' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {structuresData.map((st, idx) => (
                      <div
                        key={idx}
                        className={`glass-card rounded-2xl p-6 border transition-all relative ${
                          st.recommended
                            ? 'border-primary-500/60 shadow-glow-sm'
                            : 'border-slate-800'
                        }`}
                      >
                        {st.recommended && (
                          <span className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-600 text-white shadow-sm">
                            Recommended for VC & High Growth
                          </span>
                        )}

                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2.5 rounded-xl bg-surface-50 border border-slate-700 text-primary-400">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold font-display text-white">{st.name}</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">{st.ideal_for}</p>
                          </div>
                        </div>

                        {/* Pros */}
                        <div className="mt-4 space-y-1.5">
                          <span className="text-[10px] font-bold text-accent-emerald uppercase tracking-wider block">
                            Key Advantages:
                          </span>
                          {st.pros?.map((p, i) => (
                            <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald flex-shrink-0 mt-0.5" />
                              <span>{p}</span>
                            </div>
                          ))}
                        </div>

                        {/* Cons */}
                        <div className="mt-4 space-y-1.5">
                          <span className="text-[10px] font-bold text-accent-amber uppercase tracking-wider block">
                            Trade-offs & Burdens:
                          </span>
                          {st.cons?.map((c, i) => (
                            <div key={i} className="text-xs text-slate-400 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                              <span>{c}</span>
                            </div>
                          ))}
                        </div>

                        {/* Metadata bar */}
                        <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase">Est. Cost:</span>
                            <span className="font-semibold text-white">{st.estimated_cost}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase">Timeline:</span>
                            <span className="font-semibold text-accent-cyan">{st.timeline}</span>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: COMPLIANCE CHECKLIST */}
              {activeTab === 'compliance' && (
                <div className="space-y-6">
                  {complianceData.map((cat, idx) => (
                    <div key={idx} className="glass-panel rounded-2xl p-6 border border-slate-800">
                      <h3 className="text-base font-bold font-display text-white mb-4 flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-primary-400" />
                        {cat.category}
                      </h3>

                      <div className="space-y-2.5">
                        {cat.items?.map((item, i) => (
                          <div
                            key={i}
                            className="p-3.5 rounded-xl bg-surface-50 border border-slate-800/80 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <CheckCircle2 className="w-4 h-4 text-primary-400 flex-shrink-0" />
                              <span className="text-xs font-medium text-slate-200">{item.task}</span>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-surface-100 border border-slate-700 text-slate-400">
                                {item.status.replace('_', ' ')}
                              </span>
                              {item.link && (
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-accent-cyan hover:underline text-xs flex items-center gap-1"
                                >
                                  Portal <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: GST, MSME & STARTUP INDIA */}
              {activeTab === 'gst' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* GST */}
                  <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
                    <div className="p-2.5 rounded-xl bg-surface-50 border border-slate-700 text-accent-cyan w-fit">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold font-display text-white">GST Thresholds & Invoicing</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      GST registration is mandatory once turnover exceeds <strong>₹20 Lakhs</strong> (services) or <strong>₹40 Lakhs</strong> (goods).
                    </p>
                    <div className="p-3 rounded-xl bg-surface-50 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                      <p>• Mandatory for any inter-state software / SaaS sales</p>
                      <p>• Mandatory for online marketplace sellers</p>
                      <p>• Enables claiming Input Tax Credit (ITC)</p>
                    </div>
                    <a
                      href="https://www.gst.gov.in"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary-400 hover:underline inline-flex items-center gap-1 font-semibold pt-2"
                    >
                      Official GST Portal <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* MSME Udyam */}
                  <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
                    <div className="p-2.5 rounded-xl bg-surface-50 border border-slate-700 text-accent-emerald w-fit">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold font-display text-white">MSME / Udyam Certificate</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      100% free government certificate giving priority sector bank lending and delayed payment protection.
                    </p>
                    <div className="p-3 rounded-xl bg-surface-50 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                      <p>• Zero government fee on udyamregistration.gov.in</p>
                      <p>• Up to 50% subsidy on trademark applications</p>
                      <p>• Eligible for CGTMSE collateral-free loans</p>
                    </div>
                    <a
                      href="https://udyamregistration.gov.in"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-accent-emerald hover:underline inline-flex items-center gap-1 font-semibold pt-2"
                    >
                      Official Udyam Portal <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Startup India DPIIT */}
                  <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
                    <div className="p-2.5 rounded-xl bg-surface-50 border border-slate-700 text-purple-400 w-fit">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold font-display text-white">Startup India (DPIIT)</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Official central government recognition unlocking 3-year tax holidays and seed grants.
                    </p>
                    <div className="p-3 rounded-xl bg-surface-50 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                      <p>• Section 80-IAC 3-year income tax exemption</p>
                      <p>• Access to SISFS grant (up to ₹20L)</p>
                      <p>• Exemption from Angel Tax provisions</p>
                    </div>
                    <a
                      href="https://www.startupindia.gov.in"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-purple-400 hover:underline inline-flex items-center gap-1 font-semibold pt-2"
                    >
                      Startup India Portal <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                </div>
              )}

            </>
          )}

        </main>
      </div>
    </div>
  );
};
