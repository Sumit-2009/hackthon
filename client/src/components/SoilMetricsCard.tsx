import React from 'react';
import { Activity, AlertTriangle, CheckCircle2, Flame, Droplet, Sparkles } from 'lucide-react';

interface SoilMetricsCardProps {
  nitrogenPpm: number;
  phosphorusPpm: number;
  potassiumPpm: number;
  ph: number;
  organicCarbonPercent?: number;
  editable?: boolean;
  onChange?: (metrics: {
    nitrogenPpm: number;
    phosphorusPpm: number;
    potassiumPpm: number;
    ph: number;
    organicCarbonPercent?: number;
  }) => void;
}

export const SoilMetricsCard: React.FC<SoilMetricsCardProps> = ({
  nitrogenPpm,
  phosphorusPpm,
  potassiumPpm,
  ph,
  organicCarbonPercent = 0.65,
  editable = false,
  onChange,
}) => {
  // Helper to determine status color and label
  const getPhStatus = (val: number) => {
    if (val < 5.5) return { label: 'Acidic (Liming Needed)', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', bar: 'bg-amber-500' };
    if (val > 7.8) return { label: 'Alkaline (Gypsum Needed)', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', bar: 'bg-rose-500' };
    return { label: 'Optimal Buffer Zone', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', bar: 'bg-emerald-500' };
  };

  const getNStatus = (val: number) => {
    if (val < 150) return { label: 'Deficient (Top-Dress Split)', color: 'text-amber-400', bar: 'bg-amber-500' };
    if (val > 350) return { label: 'Excessive (Lodging Risk)', color: 'text-rose-400', bar: 'bg-rose-500' };
    return { label: 'Optimal Nitrogen Balance', color: 'text-emerald-400', bar: 'bg-emerald-500' };
  };

  const getPStatus = (val: number) => {
    if (val < 18) return { label: 'Low (Basal DAP Required)', color: 'text-amber-400', bar: 'bg-amber-500' };
    return { label: 'Adequate Bioavailability', color: 'text-emerald-400', bar: 'bg-emerald-500' };
  };

  const getKStatus = (val: number) => {
    if (val < 140) return { label: 'Low (MOP Enrichment)', color: 'text-amber-400', bar: 'bg-amber-500' };
    return { label: 'Optimal Structural Strength', color: 'text-emerald-400', bar: 'bg-emerald-500' };
  };

  const phStatus = getPhStatus(ph);
  const nStatus = getNStatus(nitrogenPpm);
  const pStatus = getPStatus(phosphorusPpm);
  const kStatus = getKStatus(potassiumPpm);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-emerald-500/15">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100">Soil Chemical Telemetry & Macronutrients</h3>
            <p className="text-xs text-slate-400">Calibrated against ICAR & FAO soil fertility standards</p>
          </div>
        </div>

        <div className={`px-2.5 py-1 rounded-full text-xs font-mono font-medium border flex items-center gap-1.5 ${phStatus.bg} ${phStatus.color} ${phStatus.border}`}>
          {ph < 5.5 || ph > 7.8 ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
          <span>{phStatus.label}</span>
        </div>
      </div>

      {/* Grid of Gauges & Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Soil pH Gauge */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Reaction (pH)</span>
            <span className={`text-base font-bold font-mono ${phStatus.color}`}>{Number(ph).toFixed(2)}</span>
          </div>

          {/* pH Indicator Bar with Safety Zone */}
          <div className="relative pt-1">
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div style={{ width: `${Math.min(100, Math.max(0, ((ph - 3.5) / (9.5 - 3.5)) * 100))}%` }} className={`h-full transition-all duration-300 ${phStatus.bar}`} />
            </div>
            {/* Visual safety bracket markers: 5.5 to 7.8 */}
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>3.5 Acid</span>
              <span className="text-emerald-400 font-semibold">[6.0 - 7.5 Ideal]</span>
              <span>9.5 Alk</span>
            </div>
          </div>

          {editable && onChange && (
            <input
              type="range"
              min="3.5"
              max="9.5"
              step="0.1"
              value={ph}
              onChange={(e) => onChange({ nitrogenPpm, phosphorusPpm, potassiumPpm, ph: parseFloat(e.target.value), organicCarbonPercent })}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          )}

          <p className="text-[11px] text-slate-400 font-mono mt-1">
            {ph < 5.5 ? '⚠️ Prescribe CaCO3 Liming' : ph > 7.8 ? '⚠️ Prescribe Gypsum' : '✓ Safe Cation Exchange'}
          </p>
        </div>

        {/* 2. Available Nitrogen (N) */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Nitrogen (N)</span>
            <span className={`text-base font-bold font-mono ${nStatus.color}`}>{nitrogenPpm} <span className="text-[10px] text-slate-500 font-normal">mg/kg</span></span>
          </div>

          <div className="relative pt-1">
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div style={{ width: `${Math.min(100, (nitrogenPpm / 450) * 100)}%` }} className={`h-full transition-all duration-300 ${nStatus.bar}`} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>0</span>
              <span className="text-emerald-400 font-semibold">[180-280 Target]</span>
              <span>450+</span>
            </div>
          </div>

          {editable && onChange && (
            <input
              type="range"
              min="20"
              max="500"
              step="5"
              value={nitrogenPpm}
              onChange={(e) => onChange({ nitrogenPpm: parseInt(e.target.value), phosphorusPpm, potassiumPpm, ph, organicCarbonPercent })}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          )}

          <p className="text-[11px] text-slate-400 truncate">{nStatus.label}</p>
        </div>

        {/* 3. Available Phosphorus (P) */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Phosphorus (P)</span>
            <span className={`text-base font-bold font-mono ${pStatus.color}`}>{phosphorusPpm} <span className="text-[10px] text-slate-500 font-normal">mg/kg</span></span>
          </div>

          <div className="relative pt-1">
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div style={{ width: `${Math.min(100, (phosphorusPpm / 60) * 100)}%` }} className={`h-full transition-all duration-300 ${pStatus.bar}`} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>0</span>
              <span className="text-emerald-400 font-semibold">[20-40 Target]</span>
              <span>60+</span>
            </div>
          </div>

          {editable && onChange && (
            <input
              type="range"
              min="5"
              max="80"
              step="1"
              value={phosphorusPpm}
              onChange={(e) => onChange({ nitrogenPpm, phosphorusPpm: parseInt(e.target.value), potassiumPpm, ph, organicCarbonPercent })}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          )}

          <p className="text-[11px] text-slate-400 truncate">{pStatus.label}</p>
        </div>

        {/* 4. Available Potassium (K) */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Potassium (K)</span>
            <span className={`text-base font-bold font-mono ${kStatus.color}`}>{potassiumPpm} <span className="text-[10px] text-slate-500 font-normal">mg/kg</span></span>
          </div>

          <div className="relative pt-1">
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div style={{ width: `${Math.min(100, (potassiumPpm / 400) * 100)}%` }} className={`h-full transition-all duration-300 ${kStatus.bar}`} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>0</span>
              <span className="text-emerald-400 font-semibold">[180-320 Target]</span>
              <span>400+</span>
            </div>
          </div>

          {editable && onChange && (
            <input
              type="range"
              min="40"
              max="500"
              step="5"
              value={potassiumPpm}
              onChange={(e) => onChange({ nitrogenPpm, phosphorusPpm, potassiumPpm: parseInt(e.target.value), ph, organicCarbonPercent })}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          )}

          <p className="text-[11px] text-slate-400 truncate">{kStatus.label}</p>
        </div>
      </div>
    </div>
  );
};
