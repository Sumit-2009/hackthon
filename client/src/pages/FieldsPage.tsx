import React, { useState } from 'react';
import { useFields, useCreateField } from '../hooks/useAgriApi';
import { SOIL_TYPES, IRRIGATION_TYPES } from '@shared/schema';
import { 
  Plus, 
  MapPin, 
  Layers, 
  Droplets, 
  Grid, 
  List, 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Navigation
} from 'lucide-react';
import { Link } from 'wouter';

export const FieldsPage: React.FC = () => {
  const { data: fields, isLoading } = useFields();
  const createFieldMutation = useCreateField();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    acreage: 25,
    soilType: SOIL_TYPES[0],
    irrigationType: IRRIGATION_TYPES[0],
    latitude: 30.900965,
    longitude: 75.857275,
    historicalNotes: '',
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await createFieldMutation.mutateAsync({
        name: formData.name,
        acreage: Number(formData.acreage),
        soilType: formData.soilType,
        irrigationType: formData.irrigationType,
        latitude: formData.latitude ? Number(formData.latitude) : undefined,
        longitude: formData.longitude ? Number(formData.longitude) : undefined,
        historicalNotes: formData.historicalNotes || undefined,
      });
      setIsModalOpen(false);
      setFormData({
        name: '',
        acreage: 25,
        soilType: SOIL_TYPES[0],
        irrigationType: IRRIGATION_TYPES[0],
        latitude: 30.900965,
        longitude: 75.857275,
        historicalNotes: '',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to register field parcel');
    }
  };

  const getGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({
            ...prev,
            latitude: Number(pos.coords.latitude.toFixed(6)),
            longitude: Number(pos.coords.longitude.toFixed(6))
          }));
        },
        (err) => {
          console.warn('Geolocation access failed:', err);
        }
      );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">Operational Field Parcels</h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold">
              {fields?.length || 0} Registered
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            GIS-calibrated agricultural plots, soil physics classifications, and irrigation infrastructure.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'table' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-glow-green transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Register Field Plot</span>
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {fields?.map((field) => (
            <div
              key={field.id}
              className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-slate-100">{field.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{field.latitude && field.longitude ? `${Number(field.latitude).toFixed(3)}°N, ${Number(field.longitude).toFixed(3)}°E` : 'GIS Tagged'}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold text-xs">
                    {field.acreage} ac
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Soil Type:</span>
                    <span className="text-slate-200 font-semibold">{field.soilType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Irrigation Setup:</span>
                    <span className="text-slate-200 font-semibold truncate max-w-[180px]">{field.irrigationType}</span>
                  </div>
                </div>

                {field.historicalNotes && (
                  <p className="text-xs text-slate-400 line-clamp-2 italic bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60">
                    "{field.historicalNotes}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  Registered: {new Date(field.createdAt).toLocaleDateString()}
                </span>
                <Link
                  href={`/advisory/new?fieldId=${field.id}`}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run Advisory</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Plot Name</th>
                  <th className="p-4">Acreage</th>
                  <th className="p-4">Soil Profile</th>
                  <th className="p-4">Irrigation</th>
                  <th className="p-4">Coordinates</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {fields?.map((field) => (
                  <tr key={field.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-semibold text-slate-200">{field.name}</td>
                    <td className="p-4 font-mono text-emerald-400 font-bold">{field.acreage} ac</td>
                    <td className="p-4 text-slate-300">{field.soilType}</td>
                    <td className="p-4 text-slate-300">{field.irrigationType}</td>
                    <td className="p-4 font-mono text-slate-400">
                      {field.latitude && field.longitude ? `${Number(field.latitude).toFixed(3)}°N, ${Number(field.longitude).toFixed(3)}°E` : '—'}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/advisory/new?fieldId=${field.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-semibold"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Advisory</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Register Field Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-emerald-500/30 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 mb-5">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <span>Register New Field Parcel</span>
              </h3>
              <p className="text-xs text-slate-400">Enter GIS boundaries, soil physics classification, and water infrastructure.</p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Field Name / Plot Identifier</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., South Canal Basin - Sector 4"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Acreage (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={formData.acreage}
                    onChange={(e) => setFormData({ ...formData, acreage: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Soil Classification</label>
                  <select
                    value={formData.soilType}
                    onChange={(e) => setFormData({ ...formData, soilType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    {SOIL_TYPES.map((soil) => (
                      <option key={soil} value={soil}>{soil}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Irrigation Access</label>
                <select
                  value={formData.irrigationType}
                  onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {IRRIGATION_TYPES.map((irr) => (
                    <option key={irr} value={irr}>{irr}</option>
                  ))}
                </select>
              </div>

              {/* Coordinates */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium">GIS Coordinates (Lat / Long)</label>
                  <button
                    type="button"
                    onClick={getGeoLocation}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Auto-detect GPS</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    step="0.000001"
                    placeholder="Latitude"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono text-xs"
                  />
                  <input
                    type="number"
                    step="0.000001"
                    placeholder="Longitude"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Historical Crop Rotation & Soil Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g., Cultivated with Soybean in Kharif. Responds quickly to DAP. Mild salinity observed on east ridge."
                  value={formData.historicalNotes}
                  onChange={(e) => setFormData({ ...formData, historicalNotes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createFieldMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-glow-green disabled:opacity-50"
                >
                  {createFieldMutation.isPending ? 'Registering Plot...' : 'Save Field Parcel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
