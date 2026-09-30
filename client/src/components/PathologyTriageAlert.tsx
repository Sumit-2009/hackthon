import React, { useState } from 'react';
import type { PathologyTreatmentProtocols } from '@shared/schema';
import { AlertOctagon, AlertTriangle, ShieldCheck, ShieldAlert, Sparkles, Leaf, Pill, CalendarCheck, Check } from 'lucide-react';

interface PathologyTriageAlertProps {
  diagnosis: PathologyTreatmentProtocols;
}

export const PathologyTriageAlert: React.FC<PathologyTriageAlertProps> = ({ diagnosis }) => {
  const [activeTab, setActiveTab] = useState<'chemical' | 'organic' | 'cultural'>('chemical');
  const [appliedStep, setAppliedStep] = useState<boolean>(false);

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return {
          badge: 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-glow-red',
          card: 'border-rose-500/30 bg-rose-950/10',
          icon: AlertOctagon,
          title: 'CRITICAL BIO-SECURITY ALERT'
        };
      case 'Severe':
        return {
          badge: 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-glow-amber',
          card: 'border-amber-500/30 bg-amber-950/10',
          icon: AlertTriangle,
          title: 'SEVERE PATHOGEN THREAT'
        };
      case 'Moderate':
        return {
          badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
          card: 'border-yellow-500/20 bg-yellow-950/10',
          icon: AlertTriangle,
          title: 'MODERATE CANOPY INFECTION'
        };
      default:
        return {
          badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-glow-green',
          card: 'border-emerald-500/20 bg-emerald-950/10',
          icon: ShieldCheck,
          title: 'LOW SEVERITY / HEALTHY MONITORING'
        };
    }
  };

  const style = getSeverityStyle(diagnosis.severity);
  const SeverityIcon = style.icon;

  return (
    <div className={`glass-panel rounded-2xl p-6 border ${style.card} space-y-6`}>
      {/* Header with Severity Badge & Diagnosis */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border flex items-center gap-1.5 ${style.badge}`}>
              <SeverityIcon className="w-3.5 h-3.5" />
              <span>{diagnosis.severity} Severity</span>
            </span>

            {diagnosis.quarantineRequired && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase bg-rose-600/30 text-rose-300 border border-rose-500/50 flex items-center gap-1 animate-pulse">
                <ShieldAlert className="w-3 h-3" />
                <span>Field Quarantine Advised</span>
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-slate-100 tracking-tight mt-1">
            {diagnosis.diagnosisLabel}
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Host: <span className="text-slate-200">{diagnosis.cropIdentified}</span> &bull; Classification: <span className="text-emerald-400">{diagnosis.pathogenType}</span>
          </p>
        </div>
      </div>

      {/* Observed Symptoms */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
          Morphological Symptoms Triaged
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {diagnosis.symptomsObserved.map((symptom, idx) => (
            <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
              <span>{symptom}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Treatment Protocols Tab Navigation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Actionable Eradication Protocol
          </h4>
          <span className="text-[11px] text-slate-500 font-mono">Select intervention vector:</span>
        </div>

        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('chemical')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'chemical'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span className="truncate">Chemical Protocol</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('organic')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'organic'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span className="truncate">Organic / Bio-IPM</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cultural')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'cultural'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span className="truncate">Cultural & Hygiene</span>
          </button>
        </div>

        {/* Treatment Tab Content */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          {activeTab === 'chemical' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
                <Pill className="w-4 h-4" />
                <span>Synthetic Agrochemical Intervention (Trade Active Ingredients)</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {diagnosis.treatments.chemicalIntervention}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center gap-2">
                <span>⚠️ Always wear personal protective equipment (PPE) and respect Pre-Harvest Intervals (PHI).</span>
              </div>
            </div>
          )}

          {activeTab === 'organic' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <Leaf className="w-4 h-4" />
                <span>Bio-Fungicidal, Microbial & Organic Formulation</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {diagnosis.treatments.organicAlternative}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center gap-2">
                <span>🌱 Safe for pollinators, beneficial fauna, and certified organic production standards.</span>
              </div>
            </div>
          )}

          {activeTab === 'cultural' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold">
                <CalendarCheck className="w-4 h-4" />
                <span>Agronomic Cultural Sanitation & Canopy Hygiene</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {diagnosis.treatments.culturalPreventativeMeasures}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center gap-2">
                <span>🚜 Disinfect farm implements, rogue heavily infested volunteer plants, and manage humidity.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
