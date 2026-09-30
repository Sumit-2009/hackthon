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
  Skull,
  Flame,
  Bomb,
  Radio,
  Construction
} from 'lucide-react';
import { useDashboardStats } from '../hooks/useAgriApi';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const navItems: NavItem[] = [
  { name: '🔥 CHAOS DASHBOARD', href: '/', icon: LayoutDashboard, tag: 'HOT' },
  { name: '🚜 DIRT / PLOTS (BUGGY)', href: '/fields', icon: Layers, tag: 'LAG' },
  { name: '🧪 AI WEED ADVISOR 3000', href: '/advisory/new', icon: Sparkles, tag: 'NEW' },
  { name: '☣️ VISUAL CROP DOCTOR', href: '/diagnostics', icon: Microscope, tag: 'TOXIC' },
  { name: '📜 ANCIENT ARCHIVES', href: '/history', icon: History, tag: 'OLD' },
];

export const Sidebar: React.FC = () => {
  const [location] = useLocation();
  const { data: stats } = useDashboardStats();

  return (
    <aside className="w-64 bg-[#140026] border-r-4 border-[#ffff00] p-3 hidden md:flex flex-col justify-between sticky top-[53px] h-[calc(100vh-53px)] font-mono select-none overflow-y-auto">
      <div className="space-y-4">
        {/* Navigation Category */}
        <div>
          <div className="bg-[#ff00ff] text-black font-black px-2 py-1 text-xs uppercase tracking-wider mb-2 flex items-center justify-between border-2 border-black">
            <span>☣️ NAVIGATION SYS ☣️</span>
            <span className="animate-spin text-sm">☢️</span>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 text-xs font-black transition-all border-4 glitch-vibrate ${
                    isActive
                      ? 'bg-[#00ff66] text-[#000000] border-[#ff0055] shadow-[4px_4px_0_#ffff00] translate-x-1'
                      : 'bg-[#000033] text-[#00ffff] border-[#333399] hover:bg-[#ff0055] hover:text-[#ffff00] hover:border-[#00ff00]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 animate-bounce" />
                    <span className="tracking-tight">{item.name}</span>
                  </div>

                  <span className="text-[9px] px-1 bg-yellow-400 text-black font-extrabold border border-black animate-pulse">
                    {item.tag}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Construction gif banner */}
        <div className="p-3 bg-[#ffff00] text-black border-4 border-[#ff0000] text-center font-bold text-xs space-y-1 rotate-[-1deg] shadow-[4px_4px_0_#000]">
          <div className="flex items-center justify-center gap-1 text-red-600 animate-pulse">
            <Construction className="w-5 h-5" />
            <span className="tracking-widest">UNDER CONSTRUCTION</span>
            <Construction className="w-5 h-5" />
          </div>
          <p className="text-[10px] leading-tight font-sans">
            Page maintained by WebMaster 1999. Do not sign the guestbook with malicious intentions!
          </p>
        </div>

        {/* Hit Counter */}
        <div className="bg-[#000000] p-2 border-2 border-[#00ff00] text-center">
          <p className="text-[10px] text-[#00ff00] uppercase tracking-wider mb-1">TOTAL HACKER HITS:</p>
          <div className="inline-block bg-[#222222] border-2 border-white px-3 py-1 font-mono font-black text-xl text-red-500 tracking-widest shadow-inner">
            0 0 4 2 0 6 9
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t-2 border-dashed border-[#ff00ff] text-[10px] text-yellow-300 font-mono text-center">
        <span>BEST VIEWED WITH CRT MONITOR</span>
        <div className="text-[9px] text-[#00ffff] animate-pulse">
          ⚡ 56k DIAL-UP MODEM CONNECTED ⚡
        </div>
      </div>
    </aside>
  );
};
