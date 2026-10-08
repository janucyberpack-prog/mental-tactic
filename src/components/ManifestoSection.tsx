import React from 'react';
import { Compass, Feather, ShieldCheck, Sun } from 'lucide-react';

export const ManifestoSection: React.FC = () => {
  const principles = [
    {
      icon: <Compass className="w-5 h-5 text-[#6F8A77]" />,
      number: "01",
      title: "Radical Single-Tasking",
      description: "Depth requires unfragmented presence. We reject the tyranny of twenty open tabs in favor of devotion to the singular present moment."
    },
    {
      icon: <Sun className="w-5 h-5 text-[#E27D60]" />,
      number: "02",
      title: "Rest as Fertile Soil",
      description: "Stillness is not lost time; it is the silent biological substrate from which genuine wisdom, creativity, and resilience take root."
    },
    {
      icon: <Feather className="w-5 h-5 text-[#8EA595]" />,
      number: "03",
      title: "Somatic Emotional Agility",
      description: "We do not bypass psychological discomfort with toxic positivity. We learn to make spacious, compassionate room for the full weather of human emotion."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#C8B6DB]" />,
      number: "04",
      title: "Sanctuary from the Attention Economy",
      description: "Your consciousness is not an extractive resource to be harvested by algorithmic notifications. Guard your interior stillness like sacred ground."
    }
  ];

  return (
    <section className="py-24 bg-[#FAF7F2] border-t border-[#EBE6DC] relative overflow-hidden">
      {/* Decorative subtle aura */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 rounded-full bg-[#B8E0D2]/25 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 rounded-full bg-[#C8B6DB]/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Editorial Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl text-[#122B22] font-normal leading-tight">
            "We do not rise to the level of our ambitions; we fall to the quietness of our nervous system."
          </h2>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-[#EBE6DC] hover:border-[#8EA595] transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] flex items-center justify-center border border-[#EBE6DC] group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <span className="font-serif text-xs font-bold text-[#8EA595] tracking-widest">
                    {item.number}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-[#122B22] mb-3 font-normal leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[#122B22]/70 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#F2ECE4]/80 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6F8A77]" />
                <span className="text-[11px] font-semibold text-[#6F8A77] uppercase tracking-wider">
                  Core Axiom
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
