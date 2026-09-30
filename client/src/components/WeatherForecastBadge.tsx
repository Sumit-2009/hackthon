import React from 'react';
import { CloudRain, Sun, Droplets, Thermometer, Wind, RefreshCw } from 'lucide-react';

interface WeatherForecastBadgeProps {
  temperature: number;
  rainfallMm: number;
  humidity: number;
  onRefresh?: () => void;
}

export const WeatherForecastBadge: React.FC<WeatherForecastBadgeProps> = ({
  temperature,
  rainfallMm,
  humidity,
  onRefresh,
}) => {
  const isHighRain = rainfallMm > 150;
  const isHumid = humidity > 70;

  return (
    <div className="glass-panel rounded-2xl p-4 border border-emerald-500/15 flex flex-wrap items-center justify-between gap-4">
      {/* Weather Condition Icon & Main Indicator */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-500/20 to-emerald-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
          {isHighRain ? (
            <CloudRain className="w-6 h-6 animate-bounce" />
          ) : (
            <Sun className="w-6 h-6 text-amber-400" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-100">
              {isHighRain ? 'High Precipitation Zone' : 'Moderate Weather Telemetry'}
            </span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-slate-400">Regional micro-climate calibrated for active phenology</p>
        </div>
      </div>

      {/* Triplet of Metrics */}
      <div className="flex items-center gap-6 font-mono text-xs">
        {/* Temperature */}
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-amber-400" />
          <div>
            <div className="text-slate-400 text-[10px] uppercase">Avg Temp</div>
            <div className="font-bold text-slate-200">{temperature}°C</div>
          </div>
        </div>

        {/* Rainfall */}
        <div className="flex items-center gap-2">
          <CloudRain className="w-4 h-4 text-sky-400" />
          <div>
            <div className="text-slate-400 text-[10px] uppercase">Rainfall</div>
            <div className="font-bold text-slate-200">{rainfallMm} mm</div>
          </div>
        </div>

        {/* Humidity */}
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-emerald-400" />
          <div>
            <div className="text-slate-400 text-[10px] uppercase">Humidity</div>
            <div className="font-bold text-slate-200">{humidity}%</div>
          </div>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            title="Refresh micro-climate telemetry"
            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
