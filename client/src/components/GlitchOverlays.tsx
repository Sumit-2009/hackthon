import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Skull, Flame, Bug, Volume2, VolumeX, Sparkles, RefreshCcw } from 'lucide-react';

export const GlitchOverlays: React.FC = () => {
  const [showErrorPopup, setShowErrorPopup] = useState(true);
  const [showSpamPopup, setShowSpamPopup] = useState(true);
  const [showTractorPopup, setShowTractorPopup] = useState(false);
  const [chaosIntensity, setChaosIntensity] = useState<'mild' | 'insane' | 'apocalyptic'>('insane');
  const [clickCount, setClickCount] = useState(42069);

  // Play retro PC speaker beep on button clicks if wanted
  const playAnnoyingBeep = (freq: number = 440) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
      // Audio might be blocked without gesture
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowTractorPopup(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* 1. Chaotic Marquee Ticker at Top */}
      <div className="worst-marquee sticky top-0 z-50 flex items-center justify-between overflow-hidden whitespace-nowrap shadow-lg">
        <marquee scrollamount="12" className="flex-1 font-mono tracking-widest text-sm uppercase">
          🚨 CRITICAL ERROR: SOIL NITROGEN EXPANDING RAPIDLY 🚨 PRAY FOR MONSOON 🚨 CONGRATULATIONS 1,000,000th AGRONOMIST! CLICK HERE TO CLAIM 500 TONNES OF UREA (NO VIRUS 2004) 🚨 YOUR CROP HAS A VIRUS: PLEASE INSERT FLOPPY DISK 2 🚨 APHIDS ARE READING YOUR SEARCH HISTORY 🚨 DO NOT WATER THE KEYBOARD 🚨
        </marquee>
      </div>

      {/* 2. Floating Retro Windows 95 Style Error Popup 1 */}
      {showErrorPopup && (
        <div
          className="fixed bottom-6 right-6 z-50 w-80 bg-[#c0c0c0] text-black border-4 border-t-white border-l-white border-b-black border-r-black p-1 shadow-2xl font-sans select-none animate-bounce"
          style={{ animationDuration: chaosIntensity === 'apocalyptic' ? '0.2s' : '1.5s' }}
        >
          {/* Win95 Header */}
          <div className="bg-[#000080] text-white font-bold px-2 py-1 text-xs flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Skull className="w-3.5 h-3.5 text-yellow-300" />
              <span>SYSTEM WARNING: SOIL FATAL EXCEPTION</span>
            </span>
            <button
              onClick={() => {
                playAnnoyingBeep(200);
                setShowErrorPopup(false);
              }}
              className="bg-[#c0c0c0] text-black px-1.5 font-mono text-[10px] border border-t-white border-l-white border-b-black border-r-black hover:bg-red-500 hover:text-white"
            >
              X
            </button>
          </div>

          {/* Win95 Body */}
          <div className="p-3 bg-[#c0c0c0] space-y-3 text-xs">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-xl flex-shrink-0">
                !
              </div>
              <p className="font-semibold text-black leading-snug">
                Fatal Exception 0E at 0028:C0011E36 in VMM(01) + Soil pH below zero! Earthworms have unionized.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => {
                  playAnnoyingBeep(880);
                  setShowErrorPopup(false);
                }}
                className="px-3 py-1 bg-[#c0c0c0] text-black text-xs font-bold border-2 border-t-white border-l-white border-b-black border-r-black active:border-inset"
              >
                Abort
              </button>
              <button
                onClick={() => {
                  playAnnoyingBeep(1200);
                  setClickCount(prev => prev + 1);
                }}
                className="px-3 py-1 bg-[#c0c0c0] text-black text-xs font-bold border-2 border-t-white border-l-white border-b-black border-r-black active:border-inset"
              >
                Panic ({clickCount})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Floating Ridiculous Clickbait Tractor Popup 2 */}
      {showTractorPopup && (
        <div className="fixed top-24 right-8 z-50 w-72 bg-[#ffff00] border-4 border-[#ff00ff] p-3 text-black shadow-[8px_8px_0px_#00ffff] rotate-2 animate-pulse">
          <div className="flex justify-between items-start mb-2">
            <span className="bg-[#ff0055] text-white px-2 py-0.5 text-[10px] font-black uppercase">
              🔥 SPECIAL AGRONOMY OFFER 🔥
            </span>
            <button
              onClick={() => {
                playAnnoyingBeep(300);
                setShowTractorPopup(false);
              }}
              className="text-black font-black hover:text-red-600 px-1 border border-black bg-white"
            >
              ✕
            </button>
          </div>
          <h4 className="font-black text-sm text-[#0000ff] leading-tight">
            🚜 HOT LOCAL TRACTORS IN YOUR REGION WANT TO TILL YOUR FIELD TONIGHT!
          </h4>
          <p className="text-[11px] font-bold text-gray-900 mt-1">
            Zero down payment, 150 Horsepower, runs on pure bio-diesel and rage.
          </p>
          <button
            onClick={() => {
              playAnnoyingBeep(600);
              alert("🚜 TRACTOR DISPATCHED DIRECTLY TO YOUR LIVING ROOM! ENJOY!");
              setShowTractorPopup(false);
            }}
            className="w-full mt-2 py-1.5 bg-[#00ff00] text-black font-black text-xs border-2 border-black hover:bg-[#ff00ff] hover:text-white transition-colors uppercase tracking-wider"
          >
            CLAIM MY FREE TRACTOR NOW!
          </button>
        </div>
      )}

      {/* 4. Floating Glitch Chaos Controller in Bottom Left */}
      <div className="fixed bottom-6 left-6 z-40 bg-[#000000] border-2 border-[#00ff00] p-2.5 text-[#00ff00] font-mono text-[11px] shadow-[4px_4px_0px_#ff00ff] opacity-90 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2 mb-1 border-b border-[#00ff00] pb-1">
          <Bug className="w-3.5 h-3.5 text-red-500 animate-spin" />
          <span className="font-bold uppercase tracking-wider text-yellow-300">GLITCH STATUS: 99.9% BAD</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <button
            onClick={() => {
              playAnnoyingBeep(350);
              document.body.classList.toggle('invert');
            }}
            className="px-2 py-0.5 bg-[#ff00ff] text-white font-bold hover:bg-[#00ffff] hover:text-black border border-white"
          >
            INVERT REALITY
          </button>
          <button
            onClick={() => {
              playAnnoyingBeep(520);
              document.body.classList.toggle('rotate-1');
            }}
            className="px-2 py-0.5 bg-[#00ffff] text-black font-bold hover:bg-[#ffff00] border border-black"
          >
            TILT SCREEN
          </button>
        </div>
      </div>
    </>
  );
};
