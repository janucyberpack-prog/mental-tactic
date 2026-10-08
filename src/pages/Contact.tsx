import React, { useState } from 'react';
import { Mail, User, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { submitContactMessage } from '../services/interactions';
import { useToast } from '../components/Toast';
import { SEO } from '../components/SEO';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await submitContactMessage(name, email, message);
      setSubmitted(true);
      showToast(res.message, 'success');
    } catch (err: any) {
      setError(err.message || 'Unable to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-16 md:py-24 text-[#122B22]">
      <SEO
        title="Contact & Reflections"
        description="Connect with the editorial sanctuary of Mental Tactic."
      />

      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#6F8A77]">
            Correspondence
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#122B22] font-normal">
            Reach Out to Sanctuary
          </h1>
          <p className="text-sm text-[#122B22]/70 leading-relaxed font-sans">
            Whether inquiring about editorial collaborations, sharing a personal breakthrough in focus, or offering constructive feedback.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-[#EBE6DC] shadow-lg">
          {error && (
            <div className="p-3.5 rounded-2xl bg-[#FFF0F0] border border-[#E27D60]/30 text-xs text-[#992222] font-medium leading-relaxed mb-6">
              {error}
            </div>
          )}

          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#B8E0D2]/40 text-[#122B22] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-[#6F8A77]" />
              </div>
              <h3 className="font-serif text-2xl text-[#122B22]">
                Your words have landed gently.
              </h3>
              <p className="text-xs text-[#122B22]/70 leading-relaxed max-w-sm mx-auto">
                We review inquiries with unhurried care. You will hear back from our editorial team in stillness.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setMessage('');
                }}
                className="mt-2 px-6 py-2.5 rounded-full bg-[#122B22] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A3B2F] transition-all"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#122B22]/80 uppercase tracking-wider">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8EA595]" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Marcus Thorne"
                      className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl pl-11 pr-4 py-3 text-sm text-[#122B22] focus:outline-none focus:border-[#8EA595] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#122B22]/80 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8EA595]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="marcus@sanctuary.com"
                      className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl pl-11 pr-4 py-3 text-sm text-[#122B22] focus:outline-none focus:border-[#8EA595] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#122B22]/80 uppercase tracking-wider">
                  Your Reflection or Inquiry
                </label>
                <div className="relative">
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what is on your mind..."
                    className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-2xl p-4 text-sm text-[#122B22] focus:outline-none focus:border-[#8EA595] transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 rounded-full bg-[#122B22] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A3B2F] transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Dispatching...' : 'Dispatch Message'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
