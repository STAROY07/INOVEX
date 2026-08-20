import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Save,
  CheckCircle2,
  Building2,
  Sparkles
} from 'lucide-react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useStartup } from '../context/StartupContext';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { activeStartup } = useStartup();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [founderType, setFounderType] = useState('First-time Founder');
  const [experienceLevel, setExperienceLevel] = useState('Beginner');
  const [location, setLocation] = useState('India');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user?.profile) {
      setFounderType(user.profile.founder_type || 'First-time Founder');
      setExperienceLevel(user.profile.experience_level || 'Beginner');
      setLocation(user.profile.location || 'India');
      setPhone(user.profile.phone || '');
      setBio(user.profile.bio || '');
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        founder_type: founderType,
        experience_level: experienceLevel,
        location,
        phone,
        bio
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          setMobileOpen={setMobileOpen}
          pageTitle="Founder Profile & Settings"
          pageSubtitle="Manage your founder credentials, experience tier, and ecosystem preferences"
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full">
          
          {saved && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* PROFILE FORM */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-glow-sm">
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-cyan flex items-center justify-center font-display font-extrabold text-2xl text-white shadow-glow-sm">
                {user?.full_name?.charAt(0) || 'F'}
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-white">{user?.full_name || 'Founder'}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
                <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-950 text-accent-cyan border border-primary-800">
                  {founderType} • {experienceLevel}
                </span>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Founder Type</label>
                  <select
                    value={founderType}
                    onChange={(e) => setFounderType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-50 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-primary-500"
                  >
                    <option value="Student Founder">Student Founder</option>
                    <option value="First-time Founder">First-time Founder</option>
                    <option value="Serial Entrepreneur">Serial Entrepreneur</option>
                    <option value="Working Professional / Indie Hacker">Working Professional / Indie Hacker</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Experience Level</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-50 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-primary-500"
                  >
                    <option value="Beginner">Beginner (First startup venture)</option>
                    <option value="Intermediate">Intermediate (Prior project experience)</option>
                    <option value="Experienced">Experienced (Built & scaled products)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location / Base</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, India"
                    className="w-full px-3.5 py-2.5 bg-surface-50 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone (Optional)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-surface-50 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Founder Bio / Vision</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell INOVEX about your background and what fuels your startup mission..."
                  className="w-full px-3.5 py-2.5 bg-surface-50 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-glow-sm flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            </form>

          </div>

          {/* ACTIVE STARTUP INFO CARD */}
          {activeStartup && (
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-primary-400">
                <Building2 className="w-5 h-5" />
                <h4 className="text-sm font-bold text-white">Active Startup: {activeStartup.name}</h4>
              </div>
              <p className="text-xs text-slate-400">
                <strong>Industry: </strong>{activeStartup.industry} • <strong>Model: </strong>{activeStartup.business_model} • <strong>Budget: </strong>{activeStartup.available_budget}
              </p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
