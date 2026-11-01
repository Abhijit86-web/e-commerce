import React, { useState } from 'react';
import { X, Ruler, HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { RING_SIZES_CHART, NECKLACE_LENGTHS_CHART } from '../data/jewelryData';

interface SizingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChatWithQuery?: (query: string) => void;
}

export const SizingGuideModal: React.FC<SizingGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenChatWithQuery,
}) => {
  const [activeTab, setActiveTab] = useState<'ring' | 'necklace'>('ring');
  const [sliderDiameter, setSliderDiameter] = useState<number>(17.3); // Default US 7 (17.3mm)
  const [circumferenceInput, setCircumferenceInput] = useState<string>('');
  const [calculatedSize, setCalculatedSize] = useState<string | null>(null);

  // Calculate US size from diameter slider
  const getNearestRingSize = (diameter: number) => {
    let closest = RING_SIZES_CHART[0];
    let minDiff = Math.abs(parseFloat(closest.diameterMm) - diameter);
    for (const r of RING_SIZES_CHART) {
      const diff = Math.abs(parseFloat(r.diameterMm) - diameter);
      if (diff < minDiff) {
        minDiff = diff;
        closest = r;
      }
    }
    return closest;
  };

  const currentMatch = getNearestRingSize(sliderDiameter);

  // Circumference calculation
  const handleCalculateCircumference = (e: React.FormEvent) => {
    e.preventDefault();
    const mm = parseFloat(circumferenceInput);
    if (isNaN(mm) || mm < 40 || mm > 75) {
      setCalculatedSize('Please enter a measurement between 45mm and 70mm');
      return;
    }
    let nearest = RING_SIZES_CHART[0];
    let minDiff = Math.abs(parseFloat(nearest.circMm) - mm);
    for (const item of RING_SIZES_CHART) {
      const diff = Math.abs(parseFloat(item.circMm) - mm);
      if (diff < minDiff) {
        minDiff = diff;
        nearest = item;
      }
    }
    setCalculatedSize(`Your recommended fit is US Size ${nearest.us} (UK ${nearest.uk}, ${nearest.circMm} circumference).`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-[#faf8f5] w-full max-w-3xl rounded-3xl shadow-2xl border border-[#e8ded1] overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e8ded1] bg-[#f5efe6]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#241e1b] text-white">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-[#241e1b]">Interactive Sizing Atelier</h3>
              <p className="text-xs text-[#6e5d4e]">Precision guidelines for rings, bands, and necklace drops</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#eae0d2] text-[#4a3f35] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#e8ded1] bg-[#faf8f5] px-6">
          <button
            onClick={() => setActiveTab('ring')}
            className={`py-3.5 px-4 text-xs font-semibold tracking-wider uppercase border-b-2 transition-all ${
              activeTab === 'ring'
                ? 'border-[#241e1b] text-[#241e1b]'
                : 'border-transparent text-[#8c7866] hover:text-[#241e1b]'
            }`}
          >
            Ring & Band Sizer
          </button>
          <button
            onClick={() => setActiveTab('necklace')}
            className={`py-3.5 px-4 text-xs font-semibold tracking-wider uppercase border-b-2 transition-all ${
              activeTab === 'necklace'
                ? 'border-[#241e1b] text-[#241e1b]'
                : 'border-transparent text-[#8c7866] hover:text-[#241e1b]'
            }`}
          >
            Necklace & Choker Lengths
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {activeTab === 'ring' ? (
            <div className="space-y-8">
              
              {/* Interactive Virtual Ring Placement */}
              <div className="bg-white p-6 rounded-2xl border border-[#e8ded1] shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  
                  {/* Calibrated Circle */}
                  <div className="flex flex-col items-center justify-center p-4 bg-[#faf8f5] rounded-2xl border border-[#e8ded1] w-48 h-48 shrink-0">
                    <div
                      className="rounded-full border-2 border-dashed border-[#a0683a] bg-amber-500/10 flex items-center justify-center transition-all duration-150"
                      style={{
                        width: `${sliderDiameter * 4.2}px`,
                        height: `${sliderDiameter * 4.2}px`,
                        maxHeight: '160px',
                        maxWidth: '160px',
                      }}
                    >
                      <span className="text-[11px] font-bold text-[#241e1b]">
                        {sliderDiameter.toFixed(1)} mm
                      </span>
                    </div>
                    <span className="text-[10px] text-[#8c7866] mt-2 text-center">
                      Place existing ring over circle
                    </span>
                  </div>

                  {/* Slider Control & Info */}
                  <div className="flex-1 w-full space-y-4">
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-semibold text-[#241e1b]">Adjust Inner Diameter:</span>
                        <span className="font-mono text-sm font-bold text-[#a0683a]">{sliderDiameter.toFixed(1)} mm</span>
                      </div>
                      <input
                        type="range"
                        min="14.8"
                        max="20.0"
                        step="0.1"
                        value={sliderDiameter}
                        onChange={(e) => setSliderDiameter(parseFloat(e.target.value))}
                        className="w-full accent-[#241e1b] cursor-pointer"
                      />
                    </div>

                    <div className="p-3.5 bg-[#f5efe6] rounded-xl border border-[#e0d3c1] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#8a5d3b] block">Closest Size Match:</span>
                        <span className="font-serif text-xl font-bold text-[#241e1b]">
                          US Size {currentMatch.us}
                        </span>
                      </div>
                      <div className="text-right text-xs text-[#5c4d3f]">
                        <p>UK / AU: <strong>{currentMatch.uk}</strong></p>
                        <p>Circumference: <strong>{currentMatch.circMm}</strong></p>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#6e5d4e]">
                      <strong>Elena’s Sizing Tip:</strong> If choosing wider bands like the <em>Sol Invictus</em>, we suggest going up half a size for ultimate breathing room.
                    </p>
                  </div>
                </div>
              </div>

              {/* String / Paper Circumference Measurement Tool */}
              <div className="bg-white p-5 rounded-2xl border border-[#e8ded1] shadow-sm">
                <h4 className="text-sm font-semibold text-[#241e1b] mb-1">
                  Measure with String or Paper Strip
                </h4>
                <p className="text-xs text-[#6e5d4e] mb-3">
                  Wrap a strip of paper around the base of your finger, mark where it overlaps, and measure the distance in millimeters with a standard ruler.
                </p>

                <form onSubmit={handleCalculateCircumference} className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Enter finger mm (e.g. 54.4)"
                    value={circumferenceInput}
                    onChange={(e) => setCircumferenceInput(e.target.value)}
                    className="flex-1 bg-[#faf8f5] border border-[#d8c8b4] rounded-xl px-3 py-2 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#241e1b] hover:bg-[#a0683a] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Find My Size
                  </button>
                </form>

                {calculatedSize && (
                  <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{calculatedSize}</span>
                  </div>
                )}
              </div>

              {/* Standard Chart */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8a5d3b] mb-2">
                  Standard Conversion Reference
                </h4>
                <div className="overflow-x-auto rounded-xl border border-[#e8ded1] bg-white">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#f5efe6] text-[#241e1b] uppercase font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">US / Canada</th>
                        <th className="py-2.5 px-3">Inner Diameter</th>
                        <th className="py-2.5 px-3">Circumference</th>
                        <th className="py-2.5 px-3">UK / Australia</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0e8dc] text-[#5c4d3f]">
                      {RING_SIZES_CHART.map((r) => (
                        <tr key={r.us} className="hover:bg-[#faf8f5]">
                          <td className="py-2 px-3 font-semibold text-[#241e1b]">US {r.us}</td>
                          <td className="py-2 px-3">{r.diameterMm}</td>
                          <td className="py-2 px-3">{r.circMm}</td>
                          <td className="py-2 px-3">{r.uk}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : (
            /* Necklace Length Visualizer */
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {NECKLACE_LENGTHS_CHART.map((n) => (
                  <div key={n.length} className="bg-white p-4 rounded-2xl border border-[#e8ded1] shadow-sm space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-lg font-bold text-[#241e1b]">{n.length} ({n.name})</span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-[#f5efe6] text-[#8a5d3b] rounded">
                        Standard Drape
                      </span>
                    </div>
                    <p className="text-xs text-[#5c4d3f] leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#f5efe6] p-4 rounded-2xl border border-[#dfd2be] text-xs text-[#5c4d3f] space-y-1">
                <span className="font-semibold text-[#241e1b] block">Layering Recommendation:</span>
                <p>
                  For an effortless Bohemian look, pair a 16" choker (like our <em>Luna Baroque Pearl</em>) with an 18" or 20" pendant (like the <em>Soleil Sun Medallion</em>). All our necklaces feature an included 2-inch extender link.
                </p>
              </div>
            </div>
          )}

          {/* Ask Concierge Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#241e1b] to-[#40332a] text-[#f7f2ea] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#e0a96d] shrink-0" />
              <div>
                <span className="text-xs font-semibold block">Need personalized sizing assistance?</span>
                <span className="text-[11px] text-[#d4c5b3]">Ask Aura AI Concierge for advice based on your current rings or neckline styles.</span>
              </div>
            </div>
            {onOpenChatWithQuery && (
              <button
                onClick={() => {
                  onClose();
                  onOpenChatWithQuery("Help me find my ring size. I measured my finger at 54mm.");
                }}
                className="px-3.5 py-2 rounded-xl bg-[#e0a96d] text-[#241e1b] text-xs font-bold hover:bg-[#f0bd88] transition-colors shrink-0 cursor-pointer"
              >
                Ask Concierge
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
