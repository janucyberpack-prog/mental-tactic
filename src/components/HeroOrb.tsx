import React, { useState, useEffect } from 'react';
import { Sparkles, Wind, Play, Pause } from 'lucide-react';

export const HeroOrb: React.FC = () => {
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Mouse interaction for subtle 3D parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 25;
    const y = (e.clientY - rect.top - rect.height / 2) / 25;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // 4-7-8 Breathing Cycle
  useEffect(() => {
    if (!breathingActive) return;

    let timer: NodeJS.Timeout;
    if (breathPhase === 'inhale') {
      if (secondsLeft > 0) {
        timer = setTimeout(() => setSecondsLeft(prev => prev - 1), 1000);
      } else {
        setBreathPhase('hold');
        setSecondsLeft(7);
      }
    } else if (breathPhase === 'hold') {
      if (secondsLeft > 0) {
        timer = setTimeout(() => setSecondsLeft(prev => prev - 1), 1000);
      } else {
        setBreathPhase('exhale');
        setSecondsLeft(8);
      }
    } else if (breathPhase === 'exhale') {
      if (secondsLeft > 0) {
        timer = setTimeout(() => setSecondsLeft(prev => prev - 1), 1000);
      } else {
        setBreathPhase('inhale');
        setSecondsLeft(4);
      }
    }

    return () => clearTimeout(timer);
  }, [breathingActive, breathPhase, secondsLeft]);

  const getBreathInstructions = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'Inhale deeply through your nose';
      case 'hold':
        return 'Hold gently in stillness';
      case 'exhale':
        return 'Release slowly through your lips';
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center min-h-[460px] md:min-h-[540px] w-full select-none"
    >
      {/* Background ambient blooms */}
      <div className="absolute w-72 md:w-96 h-72 md:h-96 rounded-full bg-[#B8E0D2]/35 blur-3xl -top-10 -left-10 pointer-events-none" />
      <div className="absolute w-80 md:w-[420px] h-80 md:h-[420px] rounded-full bg-[#C8B6DB]/30 blur-3xl -bottom-10 -right-10 pointer-events-none" />
      <div className="absolute w-60 h-60 rounded-full bg-[#E27D60]/15 blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Orbit Track ring */}
      <div
        className="absolute w-[340px] md:w-[440px] h-[340px] md:h-[440px] rounded-full border border-[#6F8A77]/20 pointer-events-none"
        style={{
          transform: `translate3d(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px, 0)`
        }}
      >
        {/* Orbital thought node 1 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#8EA595] border-2 border-[#FAF7F2] shadow-sm animate-pulse" />
        {/* Orbital thought node 2 */}
        <div className="absolute bottom-10 right-10 w-3 h-3 rounded-full bg-[#E27D60]/80 border-2 border-[#FAF7F2]" />
      </div>

      {/* Outer Orbit Track ring 2 */}
      <div
        className="absolute w-[440px] md:w-[560px] h-[440px] md:h-[560px] rounded-full border border-dashed border-[#122B22]/10 pointer-events-none"
        style={{
          transform: `translate3d(${mouseOffset.x * 0.2}px, ${mouseOffset.y * 0.2}px, 0)`
        }}
      />

      {/* Floating Thoughts Cards */}
      <div
        className="absolute -top-4 md:top-6 left-4 md:left-12 z-20 transition-transform duration-500 ease-out pointer-events-none animate-float-slow"
        style={{
          transform: `translate3d(${mouseOffset.x * -0.6}px, ${mouseOffset.y * -0.6}px, 0)`
        }}
      >
        <div className="bg-white/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#EBE6DC] shadow-sm text-xs font-medium text-[#122B22] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#6F8A77]" />
          <span>Stillness is not passive</span>
        </div>
      </div>

      <div
        className="absolute bottom-6 md:bottom-12 right-4 md:right-10 z-20 transition-transform duration-500 ease-out pointer-events-none animate-float-slow"
        style={{
          animationDelay: '2s',
          transform: `translate3d(${mouseOffset.x * -0.8}px, ${mouseOffset.y * -0.8}px, 0)`
        }}
      >
        <div className="bg-white/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#EBE6DC] shadow-sm text-xs font-medium text-[#122B22] flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#E27D60]" />
          <span>Clarity through reduction</span>
        </div>
      </div>

      <div
        className="hidden md:flex absolute bottom-8 left-16 z-20 transition-transform duration-500 ease-out pointer-events-none animate-float-slow"
        style={{
          animationDelay: '4s',
          transform: `translate3d(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px, 0)`
        }}
      >
        <div className="bg-white/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#EBE6DC] shadow-sm text-xs text-[#6F8A77] flex items-center gap-2">
          <Wind className="w-3 h-3 text-[#B8E0D2]" />
          <span>4-7-8 parasympathetic rhythm</span>
        </div>
      </div>

      {/* The Central Breathing Orb */}
      <div
        className="relative z-10 flex flex-col items-center justify-center transition-transform duration-300 ease-out cursor-pointer group"
        style={{
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`
        }}
        onClick={() => {
          if (!breathingActive) {
            setBreathingActive(true);
            setBreathPhase('inhale');
            setSecondsLeft(4);
          }
        }}
      >
        {/* Luminous Glow aura */}
        <div
          className={`absolute rounded-full transition-all duration-1000 ${
            breathingActive
              ? breathPhase === 'inhale'
                ? 'w-72 md:w-96 h-72 md:h-96 bg-gradient-to-tr from-[#B8E0D2] via-[#8EA595] to-[#C8B6DB] opacity-80 blur-2xl scale-110'
                : breathPhase === 'hold'
                ? 'w-72 md:w-96 h-72 md:h-96 bg-gradient-to-tr from-[#B8E0D2] via-[#E27D60]/60 to-[#C8B6DB] opacity-90 blur-2xl scale-115'
                : 'w-64 md:w-80 h-64 md:h-80 bg-gradient-to-tr from-[#B8E0D2]/70 via-[#6F8A77] to-[#FAF7F2] opacity-60 blur-xl scale-95'
              : 'w-64 md:w-80 h-64 md:h-80 bg-gradient-to-tr from-[#B8E0D2]/60 via-[#A7D7C5]/40 to-[#C8B6DB]/50 opacity-70 blur-xl animate-breath'
          }`}
        />

        {/* Tactile Sphere Body */}
        <div
          className={`relative rounded-full flex flex-col items-center justify-center p-8 text-center backdrop-blur-xl border border-white/60 shadow-xl transition-all duration-1000 ${
            breathingActive
              ? breathPhase === 'inhale'
                ? 'w-56 md:w-72 h-56 md:h-72 bg-gradient-to-b from-white/90 via-[#FAF7F2]/80 to-[#B8E0D2]/40 scale-105'
                : breathPhase === 'hold'
                ? 'w-56 md:w-72 h-56 md:h-72 bg-gradient-to-b from-white/95 via-[#FAF7F2]/90 to-[#EAE5DB]/60 scale-110 ring-4 ring-[#8EA595]/30'
                : 'w-52 md:w-64 h-52 md:h-64 bg-gradient-to-b from-white/90 via-[#FAF7F2]/75 to-[#C8B6DB]/30 scale-95'
              : 'w-52 md:w-68 h-52 md:h-68 bg-gradient-to-b from-white/90 via-[#FAF7F2]/85 to-[#B8E0D2]/30 animate-breath hover:scale-105'
          }`}
        >
          {breathingActive ? (
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#6F8A77] mb-1">
                {breathPhase.toUpperCase()}
              </span>
              <span className="font-serif text-5xl md:text-6xl font-light text-[#122B22] mb-1">
                {secondsLeft}s
              </span>
              <p className="text-xs text-[#122B22]/70 max-w-[150px] leading-tight font-medium">
                {getBreathInstructions()}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setBreathingActive(false);
                }}
                className="mt-4 px-3 py-1 rounded-full text-[11px] font-medium bg-[#122B22]/10 hover:bg-[#122B22]/20 text-[#122B22] flex items-center gap-1 transition-colors"
              >
                <Pause className="w-3 h-3" /> Stop
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-[#122B22]/5 flex items-center justify-center text-[#122B22] mb-2.5 group-hover:bg-[#122B22] group-hover:text-[#FAF7F2] transition-colors duration-300">
                <Play className="w-4 h-4 ml-0.5" />
              </div>
              <span className="font-serif text-2xl md:text-3xl text-[#122B22] font-normal leading-tight">
                Breathe
              </span>
              <p className="text-xs text-[#6F8A77] font-medium mt-1">
                Tap to calibrate focus
              </p>
              <span className="mt-2 text-[10px] tracking-wider uppercase text-[#122B22]/40 font-semibold">
                4 • 7 • 8 protocol
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
