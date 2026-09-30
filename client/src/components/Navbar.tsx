import React from 'react';
import { Sprout, ShieldCheck, Sparkles, User, Bell, Cpu } from 'lucide-react';
import { useUserProfile, useDashboardStats } from '../hooks/useAgriApi';
import { Link } from 'wouter';

export const Navbar: React.FC = () => {
  const { data: profile } = useUserProfile();
  const { data: stats } = useDashboardStats();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-emerald-500/10 px-4 lg:px-8 py-3.5 backdrop-blur-md">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 p-0.5 shadow-glow-green transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sprout className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-200 bg-clip-text text-transparent">
                  AgriSmart AI
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Precision v2.5
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Precision Agronomy & Crop Advisory</p>
            </div>
          </Link>
        </div>

        {/* Center / Right Metadata & Status */}
        <div className="flex items-center gap-3 lg:gap-6">
          {/* Engine Status Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-medium">
            <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-300">Engine:</span>
            <span className="text-emerald-400 font-mono text-[11px]">
              {profile?.engineMode || 'Gemini 2.5 Pro / Flash'}
            </span>
          </div>

          {/* Quick Metrics Capsule */}
          {stats && (
            <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-slate-400 border-x border-slate-800 px-4">
              <div>
                <span className="text-slate-500">Parcels:</span>{' '}
                <span className="text-slate-200 font-semibold">{stats.activeFieldsCount}</span>
              </div>
              <div>
                <span className="text-slate-500">Coverage:</span>{' '}
                <span className="text-emerald-400 font-semibold">{stats.totalAcres} ac</span>
              </div>
              <div>
                <span className="text-slate-500">Alerts:</span>{' '}
                <span className={stats.highRiskThreats > 0 ? "text-amber-400 font-semibold" : "text-slate-300"}>
                  {stats.highRiskThreats}
                </span>
              </div>
            </div>
          )}

          {/* User Profile Pill */}
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-200">{profile?.fullName || 'Dr. Rajesh Patel'}</p>
              <p className="text-[11px] text-emerald-400/90 truncate max-w-[170px]">{profile?.farmName || 'Patel Agro-Ecosystems'}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 flex items-center justify-center text-emerald-400 shadow-sm">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
