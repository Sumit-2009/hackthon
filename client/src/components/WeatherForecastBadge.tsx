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
    <div className="glass-panel p-4 border-4 border-[#00ffff] bg-[#000033] shadow-[6px_6px_0px_#ff00ff] flex flex-wrap items-center justify-between gap-4 select-none">
      {/* Weather Condition Icon & Main Indicator */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#ffff00] border-2 border-black flex items-center justify-center text-red-600 animate-spin" style={{ animationDuration: '8s' }}>
          {isHighRain ? (
            <CloudRain className="w-8 h-8 animate-bounce text-blue-600" />
          ) : (
            <Sun className="w-8 h-8 text-red-600" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-[#ffff00] uppercase tracking-wider">
              {isHighRain ? '⚠️ ACID MONSOON APOCALYPSE' : '☢️ SOLAR FLARE MICROWAVE LEVEL 5'}
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#ff0000] text-white font-black animate-ping">
              DANGER
            </span>
          </div>
          <p className="text-xs text-[#00ffcc] font-mono">Telemetry reported by broken satellite in low orbit</p>
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
