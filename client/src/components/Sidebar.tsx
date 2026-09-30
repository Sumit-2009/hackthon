import React from 'react';
import { useLocation, Link } from 'wouter';
import { 
  LayoutDashboard, 
  Map, 
  Sparkles, 
  Microscope, 
  History, 
  TrendingUp,
  Droplets,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useDashboardStats } from '../hooks/useAgriApi';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { name: 'Executive Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Field Parcels', href: '/fields', icon: Layers },
  { name: 'Precision Advisory', href: '/advisory/new', icon: Sparkles, badge: 'AI' },
  { name: 'Visual Crop Doctor', href: '/diagnostics', icon: Microscope, badge: 'Vision' },
  { name: 'Historical Archive', href: '/history', icon: History },
];

export const Sidebar: React.FC = () => {
  const [location] = useLocation();
  const { data: stats } = useDashboardStats();

  return (
    <aside className="w-64 glass-panel border-r border-emerald-500/10 hidden md:flex flex-col justify-between p-4 sticky top-[61px] h-[calc(100vh-61px)]">
      <div className="space-y-6">
        {/* Navigation Category */}
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono mb-2">
            Agronomy Command
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 text-emerald-300 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-emerald-400'
                    }`} />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-800 text-slate-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Quicklaunch Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900/40 to-slate-950 border border-emerald-500/20 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Telemetry Summary</span>
          </div>
          <p className="text-[12px] text-slate-300 mb-2">
            Average projected harvest across monitored fields:
          </p>
          <div className="text-xl font-bold font-mono text-emerald-300">
            {stats?.averageProjectedYield || '24.5 q/acre'}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Soil moisture status:</span>
            <span className="text-emerald-400 font-medium">Optimal</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono flex items-center justify-between px-2">
        <span>AgriSmart Core</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          Online
        </span>
      </div>
    </aside>
  );
};
