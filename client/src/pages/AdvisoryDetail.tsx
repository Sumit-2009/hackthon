import React from 'react';
import { useRoute, Link } from 'wouter';
import { useAdvisory } from '../hooks/useAgriApi';
import { LifecycleTimeline } from '../components/LifecycleTimeline';
import { EconomicsCard } from '../components/EconomicsCard';
import { SoilMetricsCard } from '../components/SoilMetricsCard';
import { WeatherForecastBadge } from '../components/WeatherForecastBadge';
import { 
  Sparkles, 
  Printer, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  ShieldCheck, 
  FileText,
  Share2
} from 'lucide-react';
import type { AdvisoryActionPlan } from '@shared/schema';

export const AdvisoryDetail: React.FC = () => {
  const [, params] = useRoute('/advisory/:id');
  const advisoryId = params?.id || '';
  const { data: advisory, isLoading, error } = useAdvisory(advisoryId);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 rounded-2xl border-2 border-emerald-500 border-t-transparent animate-spin" />
        <p className="text-sm font-mono text-emerald-400">Loading Agronomic Advisory Plan...</p>
      </div>
    );
  }

  if (error || !advisory) {
    return (
      <div className="glass-panel rounded-3xl p-8 max-w-lg mx-auto text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-lg font-bold text-slate-100">Advisory Not Found</h2>
        <p className="text-xs text-slate-400">The requested agronomic advisory record could not be loaded.</p>
        <Link href="/" className="inline-flex px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const plan = advisory.actionPlan as AdvisoryActionPlan;
  const field = advisory.field;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Action Bar (hidden on print) */}
      <div className="flex items-center justify-between no-print">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-emerald-500/40 text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Export PDF Report</span>
          </button>
        </div>
      </div>

      {/* Plan Header Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 relative overflow-hidden bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-900 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                {plan.variety || 'Recommended Cultivar'}
              </span>
              {field && (
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{field.name} ({field.acreage} ac)</span>
                </span>
              )}
              {plan.targetSeason && (
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono">
                  {plan.targetSeason}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              {advisory.cropName}
            </h1>

            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed font-sans pt-1">
              {advisory.advisorySummary}
            </p>
          </div>

          {/* Metrics Pill (Yield & Confidence) */}
          <div className="flex sm:flex-col gap-3 min-w-[180px]">
            {/* Confidence Score */}
            <div className="flex-1 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Agronomic Fit</span>
              <div className="text-2xl font-black font-mono text-emerald-400">
                {advisory.confidenceScore}%
              </div>
              <span className="text-[10px] text-emerald-400/80">Suitability Index</span>
            </div>

            {/* Projected Yield */}
            <div className="flex-1 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Projected Yield</span>
              <div className="text-2xl font-black font-mono text-slate-100">
                {advisory.projectedYieldQuintalsPerAcre} <span className="text-xs font-normal text-slate-400">q/ac</span>
              </div>
              <span className="text-[10px] text-slate-400">Net Field Metric</span>
            </div>
          </div>
        </div>
      </div>

      {/* Soil Amendments & Acidity/Alkalinity Protocol */}
      {plan.soilAmendments && plan.soilAmendments.length > 0 && (
        <div className="glass-panel rounded-2xl p-6 border border-emerald-500/15 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-100">Prescribed Soil Amendments & Conditioning</h3>
              <p className="text-xs text-slate-400">Corrective procedures based on soil pH and N-P-K bioavailability</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {plan.soilAmendments.map((amendment, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed font-sans">{amendment}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lifecycle Timeline */}
      {plan.lifecyclePhases && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Phased Phenological Management Schedule</h2>
              <p className="text-xs text-slate-400">Actionable irrigation, fertilizer split-dosing, and pest surveillance across 4 growth stages</p>
            </div>
          </div>

          <LifecycleTimeline phases={plan.lifecyclePhases} />
        </div>
      )}

      {/* Economics Projections */}
      {plan.economicOutlook && (
        <EconomicsCard
          economics={plan.economicOutlook}
          acreage={field ? Number(field.acreage) : 1}
          projectedYieldQuintals={Number(advisory.projectedYieldQuintalsPerAcre || 24.5)}
        />
      )}

      {/* Baseline Soil Telemetry from Advisory */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">
          Baseline Telemetry Ingested for this Advisory
        </h3>
        <SoilMetricsCard
          nitrogenPpm={Number(advisory.soilNitrogenPpm || 180)}
          phosphorusPpm={Number(advisory.soilPhosphorusPpm || 24)}
          potassiumPpm={Number(advisory.soilPotassiumPpm || 220)}
          ph={Number(advisory.soilPh || 6.8)}
          editable={false}
        />
      </div>

      {/* Dynamic Weather Context Ingested */}
      {plan.weatherForecast && (
        <WeatherForecastBadge
          temperature={plan.weatherForecast.avgTemperatureCelsius}
          rainfallMm={plan.weatherForecast.rainfallForecastMm}
          humidity={plan.weatherForecast.relativeHumidityPercent}
        />
      )}
    </div>
  );
};
