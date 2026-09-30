import React, { useState } from 'react';
import { useFields, useScanPlant } from '../hooks/useAgriApi';
import { LeafScannerUpload } from '../components/LeafScannerUpload';
import { PathologyTriageAlert } from '../components/PathologyTriageAlert';
import type { PathologyTreatmentProtocols } from '@shared/schema';
import { 
  Microscope, 
  Sparkles, 
  AlertCircle, 
  Layers, 
  CheckCircle2, 
  Image as ImageIcon,
  History,
  FileCheck2
} from 'lucide-react';

// Curated Specimen Samples for 1-Click Instant Testing
const SAMPLE_SPECIMENS = [
  {
    title: 'Potato Early Blight',
    crop: 'Potato (Solanum tuberosum)',
    disease: 'Alternaria solani',
    description: 'Concentric dark target-board necrotic lesions with yellow chlorotic halos.',
    // Compressed lightweight SVG representation
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%231a3320"/><ellipse cx="300" cy="200" rx="200" ry="140" fill="%232f6b3d"/><circle cx="250" cy="180" r="45" fill="%235a4025" stroke="%233d2814" stroke-width="6"/><circle cx="250" cy="180" r="30" fill="%237a5933" stroke="%232a1809" stroke-width="4"/><circle cx="250" cy="180" r="15" fill="%232a1809"/><circle cx="340" cy="230" r="35" fill="%235a4025" stroke="%233d2814" stroke-width="5"/><circle cx="340" cy="230" r="20" fill="%237a5933"/><ellipse cx="250" cy="180" rx="58" ry="58" fill="none" stroke="%23eab308" stroke-width="3" stroke-dasharray="8,4"/><text x="20" y="380" fill="%23ffffff" font-family="monospace" font-size="16">Specimen: Potato Foliar Target Spot (A. solani)</text></svg>`
  },
  {
    title: 'Wheat Stripe Rust',
    crop: 'Wheat (Triticum aestivum)',
    disease: 'Puccinia striiformis',
    description: 'Bright linear yellow-orange uredinial pustules rupturing leaf epidermis.',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%2328402a"/><rect x="150" y="50" width="300" height="300" fill="%233d6b38" rx="20"/><line x1="200" y1="80" x2="200" y2="320" stroke="%23eab308" stroke-width="8" stroke-dasharray="14,6"/><line x1="230" y1="70" x2="230" y2="330" stroke="%23f97316" stroke-width="9" stroke-dasharray="16,8"/><line x1="260" y1="90" x2="260" y2="310" stroke="%23eab308" stroke-width="7" stroke-dasharray="12,6"/><line x1="300" y1="60" x2="300" y2="340" stroke="%23eab308" stroke-width="10" stroke-dasharray="15,7"/><line x1="340" y1="80" x2="340" y2="320" stroke="%23f97316" stroke-width="8" stroke-dasharray="14,6"/><line x1="380" y1="90" x2="380" y2="300" stroke="%23eab308" stroke-width="7" stroke-dasharray="10,5"/><text x="20" y="380" fill="%23ffffff" font-family="monospace" font-size="16">Specimen: Wheat Stripe Rust (Puccinia striiformis)</text></svg>`
  },
  {
    title: 'Cotton Leaf Curl & Whitefly',
    crop: 'Cotton (Gossypium hirsutum)',
    disease: 'CLCuV Vector Complex',
    description: 'Vein thickening, foliar enations and severe upward cupping.',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%231a3320"/><path d="M 200,320 C 150,150 250,80 300,100 C 350,80 450,150 400,320 Z" fill="%23356e39" stroke="%2322c55e" stroke-width="4"/><path d="M 300,100 L 300,320" stroke="%23e2e8f0" stroke-width="5"/><path d="M 300,180 Q 240,160 210,210" stroke="%23e2e8f0" stroke-width="3"/><path d="M 300,240 Q 360,220 390,270" stroke="%23e2e8f0" stroke-width="3"/><circle cx="260" cy="220" r="15" fill="%23f59e0b" opacity="0.8"/><circle cx="340" cy="180" r="18" fill="%23f59e0b" opacity="0.8"/><text x="20" y="380" fill="%23ffffff" font-family="monospace" font-size="16">Specimen: Cotton Leaf Curl Begomovirus</text></svg>`
  },
  {
    title: 'Healthy Maize Foliage (Control)',
    crop: 'Hybrid Maize (Zea mays)',
    disease: 'Healthy Control',
    description: 'Vigorous chlorophyll saturation, uniform parallel venation with zero necrotic lesions.',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f2414"/><path d="M 120,350 Q 300,50 480,350 Z" fill="%2316a34a"/><line x1="300" y1="50" x2="300" y2="350" stroke="%234ade80" stroke-width="6"/><line x1="240" y1="120" x2="210" y2="350" stroke="%2322c55e" stroke-width="2"/><line x1="360" y1="120" x2="390" y2="350" stroke="%2322c55e" stroke-width="2"/><text x="20" y="380" fill="%23ffffff" font-family="monospace" font-size="16">Specimen: Healthy Zea mays Foliage (Control)</text></svg>`
  }
];

export const DiagnosticDoctor: React.FC = () => {
  const { data: fields } = useFields();
  const scanMutation = useScanPlant();

  const [selectedFieldId, setSelectedFieldId] = useState<string>('');
  const [cropName, setCropName] = useState<string>('Potato (Solanum tuberosum)');
  const [imageBase64, setImageBase64] = useState<string | null>(SAMPLE_SPECIMENS[0].dataUrl);
  const [mimeType, setMimeType] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');

  const [diagnosisResult, setDiagnosisResult] = useState<PathologyTreatmentProtocols | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageReady = (base64: string, detectedMime: 'image/jpeg' | 'image/png' | 'image/webp') => {
    setImageBase64(base64);
    setMimeType(detectedMime);
  };

  const handleClearImage = () => {
    setImageBase64(null);
    setDiagnosisResult(null);
  };

  const loadSampleSpecimen = (sample: typeof SAMPLE_SPECIMENS[0]) => {
    setImageBase64(sample.dataUrl);
    setCropName(sample.crop);
    setMimeType('image/jpeg');
    setDiagnosisResult(null);
    setErrorMsg(null);
  };

  const handleAnalyze = async () => {
    if (!imageBase64) {
      setErrorMsg('Please upload a leaf photograph or select a specimen sample.');
      return;
    }
    if (!cropName.trim()) {
      setErrorMsg('Please specify the host crop name.');
      return;
    }

    setErrorMsg(null);
    try {
      const result = await scanMutation.mutateAsync({
        fieldId: selectedFieldId || undefined,
        cropName,
        imageBase64,
        mimeType,
      });

      if (result && result.treatmentProtocols) {
        setDiagnosisResult(result.treatmentProtocols as PathologyTreatmentProtocols);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Pathology analysis failed. Please try again.');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-medium">
          <Microscope className="w-3.5 h-3.5" />
          <span>Multimodal Plant Pathology Diagnostician</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Visual Crop Doctor & IPM Triage
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl font-sans">
          Upload field foliage, stem, or root photos. Gemini 2.5 Flash Vision analyzes fungal lesions, bacterial blights, viral complexes, and insect vectors, outputting chemical, bio-organic, and cultural protocols.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid: Upload & Controls on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (5 spans): Upload & Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-5">
            <h2 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              <span>Plant Specimen Imagery</span>
            </h2>

            {/* Field & Crop Selectors */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Host Crop Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Potato, Cotton, Wheat, Tomato, Paddy"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Field Parcel (Optional Reference)</label>
                <select
                  value={selectedFieldId}
                  onChange={(e) => setSelectedFieldId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">No parcel linked (General triage)</option>
                  {fields?.map((f) => (
                    <option key={f.id} value={f.id}>{f.name} ({f.soilType})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Leaf Scanner Uploader Component */}
            <LeafScannerUpload
              onImageReady={handleImageReady}
              previewUrl={imageBase64}
              onClear={handleClearImage}
              isProcessing={scanMutation.isPending}
            />

            {/* Run Triage Button */}
            <button
              type="button"
              disabled={scanMutation.isPending || !imageBase64}
              onClick={handleAnalyze}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-95"
            >
              <Microscope className="w-5 h-5" />
              <span>{scanMutation.isPending ? 'Diagnosing Foliage via Gemini Vision...' : 'Diagnose Plant Pathology'}</span>
            </button>
          </div>

          {/* Curated Specimen Quick Tester Gallery */}
          <div className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider">
                1-Click Specimen Gallery
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Test library</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_SPECIMENS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => loadSampleSpecimen(sample)}
                  className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
                >
                  <div className="font-semibold text-xs text-slate-200 group-hover:text-emerald-300">
                    {sample.title}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {sample.disease}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (7 spans): Diagnostic Triage Output */}
        <div className="lg:col-span-7 space-y-6">
          {scanMutation.isPending ? (
            <div className="glass-panel rounded-3xl p-12 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse shadow-glow-green">
                <Microscope className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-100">Analyzing Morphological Plant Symptoms</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Gemini 2.5 Flash Vision is inspecting cellular lesion contours, chlorosis gradients, and pathogen structures...
                </p>
              </div>
            </div>
          ) : diagnosisResult ? (
            <div className="space-y-6 animate-fadeIn">
              <PathologyTriageAlert diagnosis={diagnosisResult} />
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-12 border border-slate-800 text-center space-y-4 min-h-[400px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                <Microscope className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-200">Awaiting Specimen Upload</h3>
                <p className="text-xs text-slate-400 max-w-md">
                  Select a leaf photo or pick one of the curated specimen presets on the left to generate an immediate agronomic pathology report.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
