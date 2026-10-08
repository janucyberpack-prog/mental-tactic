import React, { useState } from 'react';
import { Wind, Sparkles, RefreshCw } from 'lucide-react';

export const MindfulExercise: React.FC = () => {
  const [thought, setThought] = useState('');
  const [isReleasing, setIsReleasing] = useState(false);
  const [released, setReleased] = useState(false);

  const handleRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought.trim()) return;

    setIsReleasing(true);
    setTimeout(() => {
      setIsReleasing(false);
      setReleased(true);
    }, 2400);
  };

  const handleReset = () => {
    setThought('');
    setReleased(false);
    setIsReleasing(false);
  };

  return (
    <section className="py-20 bg-[#F4EFE6] border-y border-[#EBE6DC] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-[#122B22] font-normal mb-3">
          The 60-Second Cognitive Offload
        </h2>
        <p className="text-sm text-[#122B22]/70 max-w-lg mx-auto mb-10 leading-relaxed">
          Type an anxious loop, heavy assumption, or urgent thought that is crowding your mind right now. Give it away to the ether.
        </p>

        <div className="max-w-xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-[#EBE6DC] shadow-sm relative">
          {released ? (
            <div className="py-8 space-y-4 animate-in fade-in zoom-in duration-500">
              <div className="w-12 h-12 rounded-full bg-[#B8E0D2]/40 text-[#122B22] flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-[#6F8A77]" />
              </div>
              <h3 className="font-serif text-2xl text-[#122B22]">
                Your mind has made room.
              </h3>
              <p className="text-xs text-[#122B22]/70 max-w-md mx-auto leading-relaxed">
                Take one deep breath into your lower ribs. Notice the subtle expanse between your thoughts. You are not your thoughts; you are the sky witnessing them drift away.
              </p>
              <button
                onClick={handleReset}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#122B22] text-[#FAF7F2] text-xs font-semibold hover:bg-[#1A3B2F] transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Release Another Loop</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleRelease} className="space-y-4">
              <div className="relative">
                <textarea
                  rows={3}
                  value={thought}
                  onChange={(e) => setThought(e.target.value)}
                  disabled={isReleasing}
                  placeholder="e.g. 'I feel rushed to solve everything before noon...'"
                  className={`w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl p-4 text-sm text-[#122B22] placeholder-[#122B22]/40 focus:outline-none focus:border-[#8EA595] transition-all resize-none ${
                    isReleasing ? 'opacity-0 scale-90 blur-md transition-all duration-1000' : ''
                  }`}
                />
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  disabled={!thought.trim() || isReleasing}
                  className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm ${
                    isReleasing
                      ? 'bg-[#B8E0D2] text-[#122B22] animate-pulse'
                      : thought.trim()
                      ? 'bg-[#122B22] text-[#FAF7F2] hover:bg-[#1A3B2F]'
                      : 'bg-[#EAE5DB] text-[#122B22]/40 cursor-not-allowed'
                  }`}
                >
                  {isReleasing ? 'Evaporating into Stillness...' : 'Release to Ether'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
