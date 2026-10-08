import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Shield, Heart, Sparkles, Feather } from 'lucide-react';
import { SEO } from '../components/SEO';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] py-16 md:py-24 text-[#122B22]">
      <SEO
        title="Manifesto & Origins"
        description="The philosophy, ethics, and architecture behind Mental Tactic."
      />

      <div className="max-w-4xl mx-auto px-6 space-y-16">
        {/* Editorial Header */}
        <div className="space-y-4 max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#6F8A77]">
            Origins & Philosophy
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#122B22] font-normal leading-[1.15]">
            Why we built an antidote to the attention economy.
          </h1>
          <p className="text-lg text-[#122B22]/75 leading-relaxed font-sans pt-2">
            Modern software is designed by behavioral psychologists to extract your awareness. Mental Tactic is designed by contemplators to give it back.
          </p>
        </div>

        {/* Feature Image */}
        <div className="rounded-3xl overflow-hidden shadow-md border border-[#EBE6DC] h-80 sm:h-96">
          <img
            src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1400&q=80"
            alt="Misty quiet pines"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Longform Editorial Essay */}
        <div className="space-y-8 text-base sm:text-lg leading-[1.8] text-[#122B22]/85 font-sans">
          <p>
            We did not start Mental Tactic as another wellness brand peddling superficial fixes. We started it because we watched ourselves and the people we love drowning in micro-interruptions, synthetic urgency, and chronic low-grade nervous system exhaustion.
          </p>

          <blockquote className="my-8 p-6 sm:p-8 rounded-3xl bg-white border-l-4 border-[#6F8A77] font-serif text-2xl text-[#122B22] font-normal italic leading-snug">
            "Your attention is not a resource to be harvested. It is the very substance of your mortal life."
          </blockquote>

          <h2 className="font-serif text-3xl font-normal text-[#122B22] pt-4">
            The Three Editorial Vows
          </h2>

          <div className="space-y-6 pt-2">
            <div className="p-6 rounded-3xl bg-white border border-[#EBE6DC] space-y-2">
              <h3 className="font-serif text-xl text-[#122B22]">1. Non-Extractive Design</h3>
              <p className="text-sm text-[#122B22]/70 leading-relaxed">
                No endless algorithmic feeds, no red notification badges designed to mimic neurological threat, and zero gamification of your stillness. When you finish an essay, we encourage you to close your device and return to your life.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#EBE6DC] space-y-2">
              <h3 className="font-serif text-xl text-[#122B22]">2. Somatic Grounding over Intellectual Noise</h3>
              <p className="text-sm text-[#122B22]/70 leading-relaxed">
                Philosophy is hollow if it remains in the head. Every reflection published in Mental Tactic bridges intellectual clarity with physical nervous system reality—breath, posture, parasympathetic tone, and felt somatic presence.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#EBE6DC] space-y-2">
              <h3 className="font-serif text-xl text-[#122B22]">3. Slowness as a Discipline</h3>
              <p className="text-sm text-[#122B22]/70 leading-relaxed">
                We believe anything worth understanding requires sustained, uninterrupted contemplation. Depth cannot happen in a fifteen-second short form clip.
              </p>
            </div>
          </div>

          <div className="pt-10 flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/journal"
              className="px-8 py-3.5 rounded-full bg-[#122B22] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A3B2F] transition-all flex items-center gap-2"
            >
              <span>Explore The Journal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full bg-white border border-[#EBE6DC] text-[#122B22] text-xs font-semibold uppercase tracking-wider hover:border-[#8EA595] transition-all"
            >
              Send an Inquiry
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
