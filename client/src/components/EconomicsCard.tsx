import React from 'react';
import type { EconomicOutlook } from '@shared/schema';
import { DollarSign, TrendingUp, Calendar, ArrowUpRight, Scale, Coins } from 'lucide-react';

interface EconomicsCardProps {
  economics: EconomicOutlook;
  acreage?: number;
  projectedYieldQuintals?: number;
}

export const EconomicsCard: React.FC<EconomicsCardProps> = ({
  economics,
  acreage = 1,
  projectedYieldQuintals,
}) => {
  const costPerAcre = economics.estimatedCostPerAcre;
  const revenuePerAcre = economics.estimatedRevenuePerAcre;
  const netMarginPerAcre = revenuePerAcre - costPerAcre;
  const roiPercent = costPerAcre > 0 ? ((netMarginPerAcre / costPerAcre) * 100).toFixed(0) : '0';

  const totalCost = costPerAcre * acreage;
  const totalRevenue = revenuePerAcre * acreage;
  const totalNet = netMarginPerAcre * acreage;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-emerald-500/15 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100">Market Timing & Commercial Yield Economics</h3>
            <p className="text-xs text-slate-400">Projections calibrated per single acre and total parcel</p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+{roiPercent}% Projected ROI</span>
        </div>
      </div>

      {/* Per Acre Financial Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Estimated Cost */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Input Costs / Acre</span>
          <div className="text-xl font-bold font-mono text-slate-200">
            ₹{costPerAcre.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500">Seeds, fertilizer, irrigation & labor</p>
        </div>

        {/* Projected Revenue */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Gross Revenue / Acre</span>
          <div className="text-xl font-bold font-mono text-emerald-400">
            ₹{revenuePerAcre.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500">
            {projectedYieldQuintals ? `${projectedYieldQuintals} q/ac @ market price` : 'Procurement index price'}
          </p>
        </div>

        {/* Net Margin */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
          <span className="text-xs text-emerald-300 font-medium">Net Profit Margin / Acre</span>
          <div className="text-xl font-bold font-mono text-emerald-300 flex items-center gap-1">
            <span>₹{netMarginPerAcre.toLocaleString()}</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <p className="text-[11px] text-emerald-400/80">Net disposable agricultural return</p>
        </div>
      </div>

      {/* Total Field Scaled Economics if acreage > 1 */}
      {acreage > 1 && (
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="text-slate-400">
            Field Scale (<span className="text-slate-200 font-bold">{acreage} Acres</span>):
          </div>
          <div className="flex items-center gap-6">
            <div>
              <span className="text-slate-500">Total Investment:</span>{' '}
              <span className="text-slate-300 font-semibold">₹{totalCost.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500">Total Net Yield:</span>{' '}
              <span className="text-emerald-400 font-bold text-sm">₹{totalNet.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Market Procurement Window */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-900/50 to-slate-900 border border-amber-500/20 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 flex-shrink-0">
          <Calendar className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-semibold text-amber-300 uppercase font-mono tracking-wider">
            Optimal Market Timing Window
          </span>
          <p className="text-xs text-slate-200 font-medium mt-0.5">
            {economics.recommendedMarketWindow}
          </p>
        </div>
      </div>
    </div>
  );
};
