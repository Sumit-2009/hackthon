import React, { useState } from 'react';
import { useAdvisories, useScans } from '../hooks/useAgriApi';
import { Link } from 'wouter';
import { 
  History, 
  Search, 
  Sparkles, 
  Microscope, 
  ChevronRight, 
  Filter, 
  Calendar, 
  MapPin, 
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  X
} from 'lucide-react';
import { PathologyTriageAlert } from '../components/PathologyTriageAlert';
import type { PathologyTreatmentProtocols } from '@shared/schema';

export const HistoryPage: React.FC = () => {
  const { data: advisories } = useAdvisories();
  const { data: scans } = useScans();

  const [activeTab, setActiveTab] = useState<'advisories' | 'scans'>('advisories');
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedScan, setSelectedScan] = useState<any | null>(null);

  // Filter Advisories
  const filteredAdvisories = advisories?.filter(a => {
    const matchesSearch = 
      a.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.variety && a.variety.toLowerCase().includes(searchTerm.toLowerCase())) ||
      a.advisorySummary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Filter Scans
  const filteredScans = scans?.filter(s => {
    const matchesSearch =
      s.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.diagnosisLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.pathogenType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || s.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">Agronomic Historical Archive</h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold">
              Permanent Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Search and review all past phased crop management advisories and pathology scans.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 flex items-center">
          <button
            type="button"
            onClick={() => setActiveTab('advisories')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'advisories'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-green'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Advisories ({advisories?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('scans')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'scans'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-green'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Microscope className="w-3.5 h-3.5" />
            <span>Pathology Scans ({scans?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={activeTab === 'advisories' ? 'Search by crop or variety...' : 'Search by pathogen or crop...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        {activeTab === 'scans' && (
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
            <span className="text-slate-400 font-mono">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="Severe">Severe</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
            </select>
          </div>
        )}
      </div>

      {/* Advisories Tab Content */}
      {activeTab === 'advisories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAdvisories?.map((adv) => (
            <div
              key={adv.id}
              className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-slate-100">{adv.cropName}</h3>
                    <p className="text-xs text-emerald-400 font-mono">{adv.variety || 'Optimized cultivar'}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold">
                    {adv.confidenceScore}% Fit
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed pt-1">
                  {adv.advisorySummary}
                </p>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Projected Yield</span>
                    <span className="text-slate-200 font-bold">{adv.projectedYieldQuintalsPerAcre} q/ac</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Soil pH</span>
                    <span className="text-slate-200 font-bold">{adv.soilPh}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  {new Date(adv.createdAt).toLocaleDateString()}
                </span>
                <Link
                  href={`/advisory/${adv.id}`}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <span>Open Phased Plan</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pathology Scans Tab Content */}
      {activeTab === 'scans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredScans?.map((scan) => (
            <div
              key={scan.id}
              className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-sm text-slate-100">{scan.diagnosisLabel}</h3>
                    <p className="text-xs text-slate-400">Host: <span className="text-slate-200">{scan.cropName}</span></p>
                  </div>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                    scan.severity === 'Critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                    scan.severity === 'Severe' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {scan.severity}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                  <span className="text-slate-500 block text-[10px] font-mono uppercase">Pathogen Type</span>
                  <span className="text-slate-300 font-semibold">{scan.pathogenType}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  {new Date(scan.createdAt).toLocaleDateString()}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedScan(scan)}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <span>View Protocols</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pathology Scan Detail Modal */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 border border-emerald-500/30 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedScan(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-4">
              <PathologyTriageAlert diagnosis={selectedScan.treatmentProtocols as PathologyTreatmentProtocols} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
