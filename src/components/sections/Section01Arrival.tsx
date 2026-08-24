import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ArrowDown, ArrowRight, ShieldCheck, Truck, Award, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { atelierSound } from '../../utils/audioAtelier';

export const Section01Arrival: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 80);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = atelierSound.subscribe((state) => {
      setIsAudioActive(state === 'AUDIO_ENABLED');
    });
    return unsubscribe;
  }, []);

  // Ensure background video plays automatically
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback for strict browser autoplay policies
      });
    }
  }, []);

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const toggleAudio = async () => {
    if (!isAudioActive) {
      const started = await atelierSound.start();
      setIsAudioActive(started);
    } else {
      atelierSound.stop();
      setIsAudioActive(false);
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[92vh] lg:min-h-screen bg-pearl-100 selection:bg-champagne-300 flex flex-col justify-between pt-36 sm:pt-40 md:pt-44 pb-8 sm:pb-10 px-4 sm:px-6 md:px-10 lg:px-14 overflow-hidden"
      id="section-arrival"
    >
      {/* ===================================================================== */}
      {/* CLEAR, VIBRANT OPEN-SOURCE JEWELLERY BACKGROUND VIDEO                 */}
      {/* ===================================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-all duration-700 opacity-60 filter contrast-105 brightness-100"
        >
          <source src="/assets/videos/hero-jewelry.webm" type="video/webm" />
          <source src="https://upload.wikimedia.org/wikipedia/commons/4/47/Jewellery_Maker.webm" type="video/webm" />
          <source src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Making_a_silver_chain.webm" type="video/webm" />
        </video>

        {/* Soft, Minimal Ambient Vignette (Keeps Video Fully Visible While Making Text Pop) */}
        <div className="absolute inset-0 bg-gradient-to-r from-pearl-100/80 via-pearl-100/40 to-pearl-100/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-pearl-100/90 via-transparent to-pearl-100/60" />
      </div>

      {/* ===================================================================== */}
      {/* MAIN HERO CONTENT (Spacious, Luxury Full-Width Typography)            */}
      {/* ===================================================================== */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col justify-center py-6 sm:py-10">
        <div className="max-w-3xl space-y-6 text-left">
          
          {/* Top Identity Tag */}
          <div
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 100ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 100ms',
            }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-champagne-300/80 text-[10px] sm:text-xs uppercase font-mono tracking-widest text-gold-dark font-bold shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
            <span>Mumbai Atelier MMXXVI • 1,000+ Journeys Dispatched</span>
          </div>

          {/* Main Luxury Headline */}
          <h1
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms',
            }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight text-obsidian leading-[1.04]"
          >
            Handcrafted <br />
            <span className="text-gold-dark font-normal italic">Fine Jewellery</span> <br />
            Redefined For All.
          </h1>

          {/* Editorial Subtitle */}
          <p
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 300ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 300ms',
            }}
            className="text-base sm:text-lg md:text-xl text-obsidian/85 max-w-xl leading-relaxed font-normal bg-white/40 backdrop-blur-xs p-2 rounded-2xl"
          >
            Discover artisanal bangles, 18k gold dipped jewellery suites, and bespoke velvet celebration hampers handcrafted with love in Mumbai.
          </p>

          {/* Action CTAs */}
          <div
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 400ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 400ms',
            }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
          >
            <a
              href="#section-reveal"
              className="btn-primary group shadow-md hover:shadow-xl flex items-center justify-center gap-2 px-8 py-4 text-xs sm:text-sm uppercase font-bold tracking-widest text-center w-full sm:w-auto transition-all"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </a>

            <a
              href="/gifting"
              className="btn-secondary group flex items-center justify-center gap-2 px-8 py-4 text-xs sm:text-sm uppercase font-bold tracking-widest text-center w-full sm:w-auto transition-all bg-white/80 backdrop-blur-md"
            >
              <span>Gifting Atelier</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300 opacity-70" />
            </a>
          </div>

          {/* Trust Signals Strip */}
          <div
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 500ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 500ms',
            }}
            className="pt-4 border-t border-champagne-300/80 flex flex-wrap items-center gap-5 sm:gap-8 text-xs text-obsidian font-bold uppercase tracking-wider"
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-gold-dark shrink-0" />
              <span className="text-[11px] sm:text-xs">100% Handcrafted</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gold-dark shrink-0" />
              <span className="text-[11px] sm:text-xs">Pan-India Express</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-dark shrink-0" />
              <span className="text-[11px] sm:text-xs">Secure Payment</span>
            </div>
          </div>

        </div>
      </div>

      {/* ===================================================================== */}
      {/* BOTTOM CONTROLLER BAR & STATS                                         */}
      {/* ===================================================================== */}
      <div
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 600ms',
        }}
        className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-7xl mx-auto pt-6 border-t border-champagne-300/60"
      >
        <div className="flex items-center gap-2 sm:gap-3 text-center sm:text-left">
          <span className="hidden sm:inline w-8 sm:w-10 h-0.5 bg-gold-dark" />
          <span className="text-[10px] sm:text-xs uppercase font-mono tracking-widest text-obsidian font-bold">
            1,000+ Journeys Dispatched • Pan-India Free Express Delivery
          </span>
        </div>

        {/* Media Controls & Scroll CTA */}
        <div className="flex items-center gap-2.5">
          {/* Video Play/Pause Micro-Toggle */}
          <button
            onClick={toggleVideoPlayback}
            className="p-2 rounded-full border border-champagne-300/80 bg-white/90 hover:bg-champagne-100 text-obsidian transition-all shadow-xs shrink-0"
            title={isVideoPlaying ? 'Pause Background Video' : 'Play Background Video'}
            aria-label="Toggle Background Video"
          >
            {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Atmospheric Sound Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-full border transition-all shadow-xs shrink-0 ${
              isAudioActive
                ? 'bg-champagne-300 border-gold-dark text-obsidian'
                : 'border-champagne-300/80 bg-white/90 hover:bg-champagne-100 text-obsidian'
            }`}
            title={isAudioActive ? 'Sound: ON' : 'Sound: OFF'}
            aria-label="Toggle Atmosphere Sound"
          >
            {isAudioActive ? (
              <Volume2 className="w-4 h-4 text-gold-dark animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-obsidian" />
            )}
          </button>

          <a
            href="#section-reveal"
            className="flex items-center gap-2 text-[11px] sm:text-xs uppercase font-mono tracking-widest text-obsidian hover:text-gold-dark transition-all group cursor-pointer font-bold px-4 py-2 rounded-full bg-white/90 border border-champagne-300/80 shadow-xs hover:shadow-md"
          >
            <span>Explore Pieces</span>
            <ArrowDown className="w-3.5 h-3.5 text-gold-dark group-hover:translate-y-1 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Section01Arrival;
