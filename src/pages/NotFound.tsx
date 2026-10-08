import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { SEO } from '../components/SEO';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-6 bg-[#FAF7F2] text-[#122B22]">
      <SEO title="Page Not Found" />

      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#B8E0D2]/40 text-[#122B22] flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 text-[#6F8A77]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#6F8A77]">
            Error 404
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#122B22]">
            Something went quiet.
          </h1>
          <p className="text-sm text-[#122B22]/70 leading-relaxed max-w-sm mx-auto font-sans">
            The path you sought has dissolved into the silent fog. Take an easy breath and return to familiar grounds.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#122B22] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A3B2F] transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Sanctuary</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
