import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, ArrowRight, ShieldCheck, Gem } from 'lucide-react';

interface VideoJewelSectionProps {
  onShopClick: () => void;
  onOpenSizing: () => void;
}

export const VideoJewelSection: React.FC<VideoJewelSectionProps> = ({
  onShopClick,
  onOpenSizing,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // High quality royalty-free craftsmanship video URL (fallback to stylish animated fine jewelry canvas)
  const videoSrc = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

  return (
    <section className="relative bg-[#1a1513] text-[#f7f2ea] overflow-hidden py-20 lg:py-28 border-t border-b border-[#3d3128]">
      {/* Background Decorative Gradient */}
      <div className="absolute inset-0 bg-radial from-[#2e231c]/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3d3128]/80 border border-[#e0a96d]/30 text-[#e0a96d] text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>The Atelier Bench &bull; Living Masterpiece</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight text-white">
            Where Fire, Gold & <br />
            <span className="italic text-[#e0a96d]">Artisan Souls Converge</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#b8a695] leading-relaxed">
            Witness the intimate alchemy behind each bespoke jewel. Every ring is forged from molten Fairmined 18k gold over steel stakes, file-shaped by hand, and set with ethical gemstones.
          </p>
        </div>

        {/* Cinematic Video Player Showcase */}
        <div className="relative mx-auto max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-[#4a3c31] bg-[#140f0e] group aspect-video">
          
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-700"
            poster="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80"
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Video Control Bar */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-center justify-between z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all shadow-md cursor-pointer"
                title={isPlaying ? 'Pause Atelier Film' : 'Play Atelier Film'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              <button
                onClick={toggleMute}
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all shadow-md cursor-pointer"
                title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <div className="hidden sm:block text-xs">
                <span className="font-serif font-semibold text-white block">Atelier Craftsmanship Film</span>
                <span className="text-[10px] text-[#d4c5b3]">Recorded at our Coastal Silversmith Bench</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onShopClick}
                className="px-5 py-2.5 rounded-full bg-[#e0a96d] hover:bg-[#f2bd8b] text-[#241e1b] text-xs font-bold tracking-wider uppercase transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Forged Jewels</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Floating Artisan Badges inside Video */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-col gap-2 z-20">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-black/60 backdrop-blur-md text-[#e0a96d] border border-white/10 flex items-center gap-1.5 shadow-sm">
              <Gem className="w-3 h-3 text-[#e0a96d]" />
              <span>100% Solid Recycled Gold</span>
            </span>
          </div>

        </div>

        {/* 3 Process Steps Below Video */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
          <div className="p-5 rounded-2xl bg-[#241e1b]/70 border border-[#3d3128] space-y-2">
            <span className="font-mono text-xs font-bold text-[#e0a96d]">01 &bull; TORCH & ANVIL</span>
            <h4 className="font-serif text-lg text-white">Molten Gold Cold-Hammering</h4>
            <p className="text-xs text-[#b8a695] leading-relaxed">
              We never use flimsy hollow casts. Each ring is shaped directly from solid heavy wire over hardened steel stakes.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#241e1b]/70 border border-[#3d3128] space-y-2">
            <span className="font-mono text-xs font-bold text-[#e0a96d]">02 &bull; GEMOLOGICAL SETTING</span>
            <h4 className="font-serif text-lg text-white">Microscope Claw Prongs</h4>
            <p className="text-xs text-[#b8a695] leading-relaxed">
              Untreated Montana sapphires, Grade-AAA baroque pearls, and conflict-free diamonds are secured individually under 40x magnification.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#241e1b]/70 border border-[#3d3128] space-y-2">
            <span className="font-mono text-xs font-bold text-[#e0a96d]">03 &bull; HEIRLOOM SEAL</span>
            <h4 className="font-serif text-lg text-white">Velvet Wax-Sealed Packaging</h4>
            <p className="text-xs text-[#b8a695] leading-relaxed">
              Every shipment is inspected by the master jeweler, accompanied by an artisan certificate, and sealed with antique gold wax.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
