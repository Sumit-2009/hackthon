import React from 'react';
import { Link } from 'wouter';
import { 
  useDashboardStats, 
  useFields, 
  useAdvisories, 
  useScans 
} from '../hooks/useAgriApi';
import { 
  Sparkles, 
  Microscope, 
  Plus, 
  MapPin, 
  Layers, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Calendar, 
  Droplet,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { WeatherForecastBadge } from '../components/WeatherForecastBadge';

export const Dashboard: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: fields } = useFields();
  const { data: advisories } = useAdvisories();
  const { data: scans } = useScans();

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome & Quick Launch */}
      <div className="relative glass-panel p-6 border-4 border-[#ff0055] bg-[#1a0033] shadow-[8px_8px_0px_#00ffff]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ffff00] text-black border-2 border-black text-xs font-black uppercase tracking-wider animate-bounce">
              <Sparkles className="w-4 h-4 text-red-600" />
              <span>★ 100% FREE AGRONOMY MATRIX (NO VIRUS GUARANTEE) ★</span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-wider text-[#00ff66] rainbow-glitch">
              ☣️ EXECUTIVE CROP TELEMETRY & GLITCH HAVOC ☣️
            </h1>
            <p className="text-xs md:text-sm text-[#00ffff] font-mono leading-relaxed bg-[#000000] p-2 border border-[#ff00ff]">
              Convert buggy soil N-P-K profiles, lightning storms, and radioactive foliage scans into unhinged agricultural protocols.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/advisory/new"
              className="px-5 py-3 bg-[#00ff00] text-black font-black text-sm flex items-center gap-2 border-4 border-black hover:bg-[#ff00ff] hover:text-white shadow-[6px_6px_0px_#ff0000] glitch-vibrate transition-all active:translate-x-1 active:translate-y-1"
            >
              <Sparkles className="w-5 h-5 text-red-600 animate-spin" />
              <span>CLICK TO DISCOVER NEW WEED</span>
            </Link>

            <Link
              href="/diagnostics"
              className="px-5 py-3 bg-[#ffff00] text-black font-black text-sm flex items-center gap-2 border-4 border-black hover:bg-[#00ffff] shadow-[6px_6px_0px_#0000ff] glitch-vibrate transition-all active:translate-x-1 active:translate-y-1"
            >
              <Microscope className="w-5 h-5 text-blue-600 animate-pulse" />
              <span>SUMMON CROP DOCTOR 9000</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Weather Telemetry Widget */}
      <WeatherForecastBadge
        temperature={22.4}
        rainfallMm={85}
        humidity={64}
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Parcels */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Operational Plots</span>
            <div className="text-2xl font-bold font-mono text-slate-100">
              {stats?.activeFieldsCount ?? 3}
            </div>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1">
              <span>Under active surveillance</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Total Acreage */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Acreage Managed</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {stats?.totalAcres ?? '145.8'} <span className="text-sm font-normal text-slate-400">ac</span>
            </div>
            <p className="text-[11px] text-slate-400">GIS calibrated parcels</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-emerald-300">
            <MapPin className="w-6 h-6" />
          </div>
        </div>

        {/* Advisories Synthesized */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Precision Advisories</span>
            <div className="text-2xl font-bold font-mono text-slate-100">
              {stats?.advisoriesGenerated ?? 1}
            </div>
            <p className="text-[11px] text-emerald-400">Phased crop calendars</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* High Risk Threats */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Active Pathogen Risks</span>
            <div className="text-2xl font-bold font-mono text-amber-400">
              {stats?.highRiskThreats ?? 1}
            </div>
            <p className="text-[11px] text-amber-400/90">Pathology scans triaged</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans): Operational Field Parcels */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Registered Field Parcels</h2>
              <p className="text-xs text-slate-400">Soil profile & irrigation infrastructure per plot</p>
            </div>
            <Link
              href="/fields"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <span>Manage all ({fields?.length ?? 3})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields?.slice(0, 4).map((field) => (
              <div
                key={field.id}
                className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-slate-100 text-sm">{field.name}</h3>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                      {field.acreage} ac
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Soil Classification:</span>
                      <span className="text-slate-300 font-medium">{field.soilType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Irrigation:</span>
                      <span className="text-slate-300 font-medium">{field.irrigationType}</span>
                    </div>
                  </div>

                  {field.historicalNotes && (
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 pt-2 border-t border-slate-800/80 italic">
                      "{field.historicalNotes}"
                    </p>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-400">
                    {field.latitude && field.longitude ? `${Number(field.latitude).toFixed(2)}°N, ${Number(field.longitude).toFixed(2)}°E` : 'GPS Calibrated'}
                  </span>
                  <Link
                    href={`/advisory/new?fieldId=${field.id}`}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <span>Synthesize Plan</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (1 span): Recent Advisories & Pathology Alerts */}
        <div className="space-y-6">
          {/* Recent Advisories */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Recent Advisory Plans</span>
              </h2>
              <Link href="/history" className="text-[11px] text-slate-400 hover:text-emerald-400">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {advisories?.slice(0, 3).map((adv) => (
                <Link
                  key={adv.id}
                  href={`/advisory/${adv.id}`}
                  className="block p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">
                      {adv.cropName}
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                      {adv.confidenceScore}% Fit
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {adv.advisorySummary}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>Est. Yield: {adv.projectedYieldQuintalsPerAcre} q/ac</span>
                    <span>{new Date(adv.createdAt).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Pathology Triage Alert Mini-Feed */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Microscope className="w-4 h-4 text-emerald-400" />
                <span>Field Pathology Feed</span>
              </h2>
              <Link href="/diagnostics" className="text-[11px] text-emerald-400 font-semibold">
                + New Scan
              </Link>
            </div>

            <div className="space-y-3">
              {scans?.slice(0, 3).map((scan) => (
                <div
                  key={scan.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-200">{scan.diagnosisLabel}</span>
                      <p className="text-[11px] text-slate-400">Host: {scan.cropName}</p>
                    </div>
                    <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${
                      scan.severity === 'Critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                      scan.severity === 'Severe' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {scan.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
