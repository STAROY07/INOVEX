import React, { useState, useEffect } from 'react';
import {
  Scale,
  ShieldCheck,
  Building2,
  Receipt,
  FileCheck2,
  ExternalLink,
  CheckCircle2
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
    <div className="min-h-screen bg-slate-50 flex text-slate-900">
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
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setActiveTab('structures')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'structures'
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Entity Structures (Pvt Ltd vs LLP)
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'compliance'
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Compliance Checklist
            </button>
            <button
              onClick={() => setActiveTab('gst')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'gst'
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
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
                        className={`bg-white rounded-2xl p-6 border transition-all relative shadow-sm ${
                          st.recommended
                            ? 'border-primary-500 ring-1 ring-primary-200'
                            : 'border-slate-200'
                        }`}
                      >
                        {st.recommended && (
                          <span className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-600 text-white shadow-sm">
                            Recommended for VC & High Growth
                          </span>
                        )}

                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2.5 rounded-xl bg-primary-50 border border-primary-200 text-primary-700">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold font-display text-slate-900">{st.name}</h3>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">{st.ideal_for}</p>
                          </div>
                        </div>

                        {/* Pros */}
                        <div className="mt-4 space-y-1.5">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                            Key Advantages:
                          </span>
                          {st.pros?.map((p, i) => (
                            <div key={i} className="text-xs text-slate-700 flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>{p}</span>
                            </div>
                          ))}
                        </div>

                        {/* Cons */}
                        <div className="mt-4 space-y-1.5">
                          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                            Trade-offs & Burdens:
                          </span>
                          {st.cons?.map((c, i) => (
                            <div key={i} className="text-xs text-slate-600 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                              <span>{c}</span>
                            </div>
                          ))}
                        </div>

                        {/* Metadata bar */}
                        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase font-semibold">Est. Cost:</span>
                            <span className="font-bold text-slate-900">{st.estimated_cost}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase font-semibold">Timeline:</span>
                            <span className="font-bold text-cyan-700">{st.timeline}</span>
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
                    <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <h3 className="text-base font-bold font-display text-slate-900 mb-4 flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-primary-600" />
                        {cat.category}
                      </h3>

                      <div className="space-y-2.5">
                        {cat.items?.map((item, i) => (
                          <div
                            key={i}
                            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0" />
                              <span className="text-xs font-semibold text-slate-800">{item.task}</span>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded bg-slate-200 text-slate-700">
                                {item.status.replace('_', ' ')}
                              </span>
                              {item.link && (
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-primary-600 hover:underline font-bold text-xs flex items-center gap-1"
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
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                    <div className="p-2.5 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700 w-fit">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold font-display text-slate-900">GST Thresholds & Invoicing</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      GST registration is mandatory once turnover exceeds <strong className="text-slate-900">₹20 Lakhs</strong> (services) or <strong className="text-slate-900">₹40 Lakhs</strong> (goods).
                    </p>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1 font-medium">
                      <p>• Mandatory for any inter-state software / SaaS sales</p>
                      <p>• Mandatory for online marketplace sellers</p>
                      <p>• Enables claiming Input Tax Credit (ITC)</p>
                    </div>
                    <a
                      href="https://www.gst.gov.in"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary-700 hover:underline inline-flex items-center gap-1 font-bold pt-2"
                    >
                      Official GST Portal <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* MSME Udyam */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 w-fit">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold font-display text-slate-900">MSME / Udyam Certificate</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      100% free government certificate giving priority sector bank lending and delayed payment protection.
                    </p>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1 font-medium">
                      <p>• Zero government fee on udyamregistration.gov.in</p>
                      <p>• Up to 50% subsidy on trademark applications</p>
                      <p>• Eligible for CGTMSE collateral-free loans</p>
                    </div>
                    <a
                      href="https://udyamregistration.gov.in"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-700 hover:underline inline-flex items-center gap-1 font-bold pt-2"
                    >
                      Udyam Registration <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Startup India DPIIT */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                    <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 w-fit">
                      <Scale className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold font-display text-slate-900">DPIIT Recognition</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Official Startup India certificate unlocking Section 80-IAC 3-year income tax exemption and government tenders.
                    </p>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1 font-medium">
                      <p>• 80-IAC 100% income tax exemption for 3 years</p>
                      <p>• Self-certification under 9 labor and environmental laws</p>
                      <p>• Faster patent examination & 80% rebate</p>
                    </div>
                    <a
                      href="https://www.startupindia.gov.in"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-purple-700 hover:underline inline-flex items-center gap-1 font-bold pt-2"
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
