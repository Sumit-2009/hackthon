import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useFields, useGenerateAdvisory } from '../hooks/useAgriApi';
import { SoilMetricsCard } from '../components/SoilMetricsCard';
import { WeatherForecastBadge } from '../components/WeatherForecastBadge';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Layers, 
  Calendar, 
  Activity, 
  CloudSun, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Cpu,
  Droplets,
  Thermometer,
  ShieldCheck
} from 'lucide-react';

export const AdvisoryWizard: React.FC = () => {
  const [, setLocation] = useLocation();
  const { data: fields } = useFields();
  const generateAdvisoryMutation = useGenerateAdvisory();

  // Wizard Step (1: Field & Season, 2: Soil Metrics, 3: Climate Context, 4: Review & Synthesize)
  const [step, setStep] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [selectedFieldId, setSelectedFieldId] = useState<string>('');
  const [targetSeason, setTargetSeason] = useState<"Kharif / Monsoon" | "Rabi / Winter" | "Zaid / Summer" | "Perennial">("Rabi / Winter");
  const [cropPreferences, setCropPreferences] = useState<string>('High-Yield Wheat or Mustard');

  const [soilMetrics, setSoilMetrics] = useState({
    nitrogenPpm: 140,
    phosphorusPpm: 16,
    potassiumPpm: 180,
    ph: 5.4,
    organicCarbonPercent: 0.65,
  });

  const [weatherContext, setWeatherContext] = useState({
    avgTemperatureCelsius: 21,
    rainfallForecastMm: 65,
    relativeHumidityPercent: 60,
  });

  // Pick query param if provided
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fieldParam = params.get('fieldId');
    if (fieldParam) {
      setSelectedFieldId(fieldParam);
    } else if (fields && fields.length > 0 && !selectedFieldId) {
      setSelectedFieldId(fields[0].id);
    }
  }, [fields, selectedFieldId]);

  const selectedField = fields?.find(f => f.id === selectedFieldId);

  const handleNext = () => {
    if (step === 1 && !selectedFieldId) {
      setErrorMsg('Please select a field parcel to proceed');
      return;
    }
    setErrorMsg(null);
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setErrorMsg(null);
    setStep(prev => prev - 1);
  };

  const handleGenerate = async () => {
    setErrorMsg(null);
    try {
      const result = await generateAdvisoryMutation.mutateAsync({
        fieldId: selectedFieldId,
        targetSeason,
        cropPreferences: cropPreferences || undefined,
        soilMetrics,
        weatherContext,
      });

      // Celebrate with Canvas Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#10b981', '#34d399', '#f59e0b']
        });
      } catch (e) {
        // ignore confetti errors if any
      }

      // Navigate to detailed advisory view
      if (result && result.id) {
        setLocation(`/advisory/${result.id}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to synthesize advisory plan');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Wizard Header */}
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Precision Agronomic Synthesis Wizard</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Generate Precision Crop Advisory
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Calibrate phenological growth stages, split-fertilizer schedules, and irrigation intervals against your field's soil chemistry.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
        {[
          { num: 1, label: 'Field & Season', icon: Layers },
          { num: 2, label: 'Soil Chemistry', icon: Activity },
          { num: 3, label: 'Climate Context', icon: CloudSun },
          { num: 4, label: 'AI Review', icon: Cpu },
        ].map((s) => {
          const Icon = s.icon;
          const isDone = step > s.num;
          const isCurrent = step === s.num;

          return (
            <div key={s.num} className="flex-1 flex items-center">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold font-mono transition-all ${
                  isCurrent
                    ? 'bg-emerald-500 text-slate-950 shadow-glow-green scale-105'
                    : isDone
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}>
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <div className="hidden sm:block">
                  <p className={`text-xs font-medium leading-none ${isCurrent ? 'text-slate-100 font-semibold' : 'text-slate-400'}`}>
                    {s.label}
                  </p>
                </div>
              </div>
              {s.num < 4 && (
                <div className={`flex-1 h-0.5 mx-3 rounded ${
                  step > s.num ? 'bg-emerald-500' : 'bg-slate-800'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step 1: Field Selection & Season */}
      {step === 1 && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>Select Target Operational Plot & Seasonal Cycle</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase font-mono tracking-wider mb-2">
                Operational Field Parcel
              </label>
              <select
                value={selectedFieldId}
                onChange={(e) => setSelectedFieldId(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700/80 text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
              >
                {fields?.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} — {f.acreage} ac ({f.soilType} &bull; {f.irrigationType})
                  </option>
                ))}
              </select>
            </div>

            {selectedField && (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Soil Type</span>
                  <span className="font-semibold text-slate-200">{selectedField.soilType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Acreage</span>
                  <span className="font-semibold text-emerald-400 font-mono">{selectedField.acreage} ac</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Irrigation</span>
                  <span className="font-semibold text-slate-200 truncate block">{selectedField.irrigationType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Coordinates</span>
                  <span className="font-semibold text-slate-400 font-mono">
                    {selectedField.latitude ? `${Number(selectedField.latitude).toFixed(2)}°N` : 'Calibrated'}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase font-mono tracking-wider mb-2">
                Target Agro-Climatic Season
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "Kharif / Monsoon", desc: "July – October" },
                  { id: "Rabi / Winter", desc: "October – April" },
                  { id: "Zaid / Summer", desc: "March – June" },
                  { id: "Perennial", desc: "Year-round" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setTargetSeason(s.id as any)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      targetSeason === s.id
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-glow-green'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <div className="font-semibold text-xs text-slate-100">{s.id}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase font-mono tracking-wider mb-2">
                Crop Preferences or Target Goals (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Hard Winter Wheat, Bt Cotton, Yellow Mustard, Basmati Rice"
                value={cropPreferences}
                onChange={(e) => setCropPreferences(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700/80 text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Soil Chemistry & Sliders */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span>Soil Lab Test Telemetry (N-P-K & pH Calibration)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Adjust sliders to simulate your latest soil core laboratory analysis. Safety brackets update dynamically.
              </p>
            </div>

            {/* Visual Gauges Component with editable sliders */}
            <SoilMetricsCard
              nitrogenPpm={soilMetrics.nitrogenPpm}
              phosphorusPpm={soilMetrics.phosphorusPpm}
              potassiumPpm={soilMetrics.potassiumPpm}
              ph={soilMetrics.ph}
              organicCarbonPercent={soilMetrics.organicCarbonPercent}
              editable={true}
              onChange={(updated) => setSoilMetrics({ ...soilMetrics, ...updated })}
            />

            {/* Quick Soil Preset Testing Buttons */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">
                Simulation Presets for Quick Testing:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSoilMetrics({ nitrogenPpm: 110, phosphorusPpm: 15, potassiumPpm: 140, ph: 5.2, organicCarbonPercent: 0.42 })}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-medium"
                >
                  ⚡ Acidic Soil (pH 5.2 + Low Nitrogen)
                </button>
                <button
                  type="button"
                  onClick={() => setSoilMetrics({ nitrogenPpm: 240, phosphorusPpm: 32, potassiumPpm: 290, ph: 6.8, organicCarbonPercent: 0.85 })}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-medium"
                >
                  ✓ Prime Alluvial Loam (pH 6.8)
                </button>
                <button
                  type="button"
                  onClick={() => setSoilMetrics({ nitrogenPpm: 190, phosphorusPpm: 22, potassiumPpm: 340, ph: 8.2, organicCarbonPercent: 0.55 })}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-medium"
                >
                  ⚡ Alkaline Sodic Soil (pH 8.2)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Weather Context */}
      {step === 3 && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-emerald-400" />
              <span>Micro-Climate Forecast & Telemetry Ingestion</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Configure temperature, rainfall windows, and relative humidity for phenological water balance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Avg Temp */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Avg Temperature</span>
                <span className="text-base font-bold font-mono text-amber-400">{weatherContext.avgTemperatureCelsius}°C</span>
              </div>
              <input
                type="range"
                min="5"
                max="48"
                step="1"
                value={weatherContext.avgTemperatureCelsius}
                onChange={(e) => setWeatherContext({ ...weatherContext, avgTemperatureCelsius: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[11px] text-slate-400">Phenological base threshold</span>
            </div>

            {/* Rainfall */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Precipitation Forecast</span>
                <span className="text-base font-bold font-mono text-sky-400">{weatherContext.rainfallForecastMm} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="800"
                step="5"
                value={weatherContext.rainfallForecastMm}
                onChange={(e) => setWeatherContext({ ...weatherContext, rainfallForecastMm: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[11px] text-slate-400">Total seasonal accumulation</span>
            </div>

            {/* Relative Humidity */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Relative Humidity</span>
                <span className="text-base font-bold font-mono text-emerald-400">{weatherContext.relativeHumidityPercent}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={weatherContext.relativeHumidityPercent}
                onChange={(e) => setWeatherContext({ ...weatherContext, relativeHumidityPercent: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[11px] text-slate-400">Evapotranspiration rate index</span>
            </div>
          </div>

          <WeatherForecastBadge
            temperature={weatherContext.avgTemperatureCelsius}
            rainfallMm={weatherContext.rainfallForecastMm}
            humidity={weatherContext.relativeHumidityPercent}
          />
        </div>
      )}

      {/* Step 4: AI Review & Confirmation */}
      {step === 4 && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span>Review Agronomic Profile Before Synthesis</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Gemini 2.5 Pro and our Agronomic Science Engine will synthesize a 4-phase crop lifecycle plan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field & Season Summary */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
              <span className="font-mono text-emerald-400 font-semibold uppercase tracking-wider text-[11px]">Field Parcel</span>
              <p className="text-sm font-bold text-slate-100">{selectedField?.name || 'Selected Field'}</p>
              <div className="text-slate-400 space-y-1">
                <div>Acreage: <span className="text-slate-200 font-mono font-medium">{selectedField?.acreage} ac</span></div>
                <div>Soil: <span className="text-slate-200 font-medium">{selectedField?.soilType}</span></div>
                <div>Irrigation: <span className="text-slate-200 font-medium">{selectedField?.irrigationType}</span></div>
                <div>Target Season: <span className="text-emerald-400 font-medium">{targetSeason}</span></div>
              </div>
            </div>

            {/* Soil & Weather Summary */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
              <span className="font-mono text-emerald-400 font-semibold uppercase tracking-wider text-[11px]">Telemetry Inputs</span>
              <div className="grid grid-cols-2 gap-2 text-slate-400">
                <div>Soil pH: <span className="text-slate-200 font-mono font-bold">{soilMetrics.ph}</span></div>
                <div>Nitrogen: <span className="text-slate-200 font-mono font-bold">{soilMetrics.nitrogenPpm} ppm</span></div>
                <div>Phosphorus: <span className="text-slate-200 font-mono font-bold">{soilMetrics.phosphorusPpm} ppm</span></div>
                <div>Potassium: <span className="text-slate-200 font-mono font-bold">{soilMetrics.potassiumPpm} ppm</span></div>
                <div>Avg Temp: <span className="text-slate-200 font-mono font-bold">{weatherContext.avgTemperatureCelsius}°C</span></div>
                <div>Rainfall: <span className="text-slate-200 font-mono font-bold">{weatherContext.rainfallForecastMm} mm</span></div>
              </div>
              {soilMetrics.ph < 5.5 && (
                <p className="text-[11px] text-amber-400 mt-2 font-mono">
                  ⚡ Auto-detect: Soil pH {soilMetrics.ph} will trigger liming calculation in plan.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-glow-green"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={generateAdvisoryMutation.isPending}
            onClick={handleGenerate}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold text-sm flex items-center gap-2.5 shadow-xl shadow-emerald-500/30 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-5 h-5" />
            <span>{generateAdvisoryMutation.isPending ? 'Synthesizing with Gemini 2.5 Pro...' : 'Synthesize Precision Advisory'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
