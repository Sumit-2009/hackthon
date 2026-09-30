import React, { useState } from 'react';
import type { LifecyclePhase } from '@shared/schema';
import { Calendar, Droplets, FlaskConical, ShieldAlert, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface LifecycleTimelineProps {
  phases: LifecyclePhase[];
}

export const LifecycleTimeline: React.FC<LifecycleTimelineProps> = ({ phases }) => {
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const [expandedIndices, setExpandedIndices] = useState<Record<number, boolean>>({ 0: true, 1: true });

  const toggleExpand = (idx: number) => {
    setExpandedIndices(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-6">
      {/* Stage Tabs Bar (Horizontal quick progression) */}
      <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-none gap-2">
        {phases.map((phase, idx) => {
          const isSelected = activePhaseIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => setActivePhaseIndex(idx)}
              className={`flex-1 min-w-[160px] p-3 rounded-xl border text-left transition-all duration-200 ${
                isSelected
                  ? 'bg-emerald-500/10 border-emerald-500/40 shadow-glow-green text-emerald-300'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-slate-800">
                  Stage {idx + 1}
                </span>
                <span className="text-xs font-mono font-medium text-emerald-400">{phase.dayRange}</span>
              </div>
              <p className="text-xs font-semibold truncate text-slate-100">{phase.phaseName}</p>
            </button>
          );
        })}
      </div>

      {/* Vertical Interactive Detail Timeline */}
      <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-emerald-500/50 before:to-slate-800">
        {phases.map((phase, idx) => {
          const isExpanded = expandedIndices[idx] ?? false;
          const isHighlighted = activePhaseIndex === idx;

          return (
            <div
              key={idx}
              className={`relative rounded-2xl border transition-all duration-300 ${
                isHighlighted
                  ? 'glass-panel border-emerald-500/30 shadow-glow-green'
                  : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Timeline Pin Indicator */}
              <div
                className={`absolute -left-[30px] top-4 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-transform duration-200 ${
                  isHighlighted
                    ? 'bg-emerald-500 border-emerald-300 text-slate-950 scale-110 shadow-glow-green'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                {idx + 1}
              </div>

              {/* Stage Header */}
              <div
                onClick={() => {
                  setActivePhaseIndex(idx);
                  toggleExpand(idx);
                }}
                className="p-4 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-100 text-sm md:text-base">{phase.phaseName}</h4>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/20">
                        {phase.dayRange}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Phenological growth & input calibration window</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-8 h-8 rounded-lg bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-slate-200"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Expandable Content Protocol */}
              {isExpanded && (
                <div className="px-4 pb-5 pt-1 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* 1. Irrigation Protocol */}
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-sky-500/20 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
                      <Droplets className="w-3.5 h-3.5" />
                      <span>Irrigation Schedule</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {phase.irrigationSchedule}
                    </p>
                  </div>

                  {/* 2. Fertilization & Nutrient Split */}
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-500/20 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                      <FlaskConical className="w-3.5 h-3.5" />
                      <span>Fertilization Action</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {phase.fertilizationAction}
                    </p>
                  </div>

                  {/* 3. Pest & Disease Surveillance */}
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-amber-500/20 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Pest & IPM Surveillance</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {phase.pestSurveillance}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
