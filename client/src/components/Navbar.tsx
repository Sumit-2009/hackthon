import React from 'react';
import { Sprout, ShieldCheck, Sparkles, User, Bell, Cpu, Skull, Flame, AlertOctagon } from 'lucide-react';
import { useUserProfile, useDashboardStats } from '../hooks/useAgriApi';
import { Link } from 'wouter';

export const Navbar: React.FC = () => {
  const { data: profile } = useUserProfile();
  const { data: stats } = useDashboardStats();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#110022] border-b-4 border-[#ff00ff] px-4 py-2 shadow-[0_5px_0_#ffff00]">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-[#ffff00] border-4 border-[#ff0055] p-1 flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
              <Skull className="w-8 h-8 text-[#ff0000]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-widest rainbow-glitch">
                  ★ AGRI-SMART AI 9000 ★
                </span>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-[#ff00ff] text-white border-2 border-[#00ffff] animate-pulse">
                  HOT! NEW! GLITCHED!
                </span>
              </div>
              <p className="text-[11px] text-[#00ffcc] font-mono font-bold tracking-tight">
                ⚠️ WARNING: PRECISION AGRONOMY SYSTEM IS CURRENTLY UNSTABLE ⚠️
              </p>
            </div>
          </Link>
        </div>

        {/* Center / Right Metadata & Status */}
        <div className="flex items-center gap-3">
          {/* Netscape Navigator badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-[#000080] border-2 border-t-white border-l-white border-b-black border-r-black text-[11px] text-white font-mono">
            <Flame className="w-3.5 h-3.5 text-yellow-400 animate-bounce" />
            <span>NETSCAPE NAVIGATOR 4.0 CERTIFIED</span>
          </div>

          {/* Quick Metrics Capsule */}
          {stats && (
            <div className="hidden sm:flex items-center gap-3 text-xs font-mono bg-[#000000] border-2 border-[#00ff00] p-1.5 text-[#00ff00]">
              <div>
                <span>PLOTS:</span>{' '}
                <span className="text-[#ffff00] font-black">{stats.activeFieldsCount}</span>
              </div>
              <div>
                <span>ACRES:</span>{' '}
                <span className="text-[#ff00ff] font-black">{stats.totalAcres}</span>
              </div>
              <div>
                <span>HAZARDS:</span>{' '}
                <span className="text-[#ff0000] font-black animate-ping">{stats.highRiskThreats + 99}</span>
              </div>
            </div>
          )}

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 bg-[#ffff00] border-2 border-black p-1 text-black font-bold text-xs rotate-1">
            <span className="text-[10px] text-red-600 animate-pulse">● LIVE</span>
            <span className="truncate max-w-[130px]">{profile?.fullName || 'DR. RAJESH PATEL'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
