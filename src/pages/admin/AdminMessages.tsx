import React, { useEffect, useState } from 'react';
import { MessageSquare, Mail, Trash2, CheckCircle2, Clock, Search, Send, Check } from 'lucide-react';
import { getAllContactMessages, toggleMessageRead, deleteContactMessage } from '../../services/interactions';
import { ContactMessage } from '../../types';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useToast } from '../../components/Toast';
import { SEO } from '../../components/SEO';

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await getAllContactMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load contact messages.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    const nextRead = !currentRead;
    try {
      await toggleMessageRead(id, nextRead);
      setMessages(messages.map(m => m.id === id ? { ...m, read: nextRead } : m));
      showToast(nextRead ? 'Message marked as read.' : 'Message marked as unread.', 'info');
    } catch (err) {
      showToast('Could not update status.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      await deleteContactMessage(id);
      setMessages(messages.filter(m => m.id !== id));
      showToast('Message deleted.', 'info');
    } catch (err) {
      showToast('Could not delete message.', 'error');
    }
  };

  const filtered = messages.filter(m => {
    const isRead = Boolean(m.read);
    const matchesFilter = filter === 'all' || (filter === 'unread' ? !isRead : isRead);
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || (
      m.name.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query) ||
      m.message.toLowerCase().includes(query)
    );
    return matchesFilter && matchesSearch;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <AdminLayout>
      <div className="py-10 md:py-14">
        <SEO title="Reader Inquiries — Mental Tactic CMS" description="Review messages, questions, and quiet correspondence." />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EBE6DC]">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#122B22] font-normal tracking-tight">
                Reader Correspondence
              </h1>
              <p className="text-xs text-[#122B22]/70 font-sans mt-1">
                Reflections, partnership inquiries, and questions submitted from the sanctuary contact form.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-full border border-[#EBE6DC]">
              <button
                onClick={() => setFilter('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                  filter === 'all' ? 'bg-[#122B22] text-[#FAF7F2]' : 'text-[#122B22]/70 hover:text-[#122B22]'
                }`}
              >
                All ({messages.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                  filter === 'unread' ? 'bg-[#122B22] text-[#FAF7F2]' : 'text-[#122B22]/70 hover:text-[#122B22]'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                  filter === 'read' ? 'bg-[#122B22] text-[#FAF7F2]' : 'text-[#122B22]/70 hover:text-[#122B22]'
                }`}
              >
                Read ({messages.length - unreadCount})
              </button>
            </div>
          </div>

          {/* Messages List */}
          {loading ? (
            <div className="py-16 text-center text-xs text-[#8EA595] animate-pulse">
              Loading correspondence records from Firestore...
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#EBE6DC] shadow-sm space-y-2">
              <p className="font-serif text-lg text-[#122B22]">No correspondence found.</p>
              <p className="text-xs text-[#8EA595]">
                {filter === 'unread' ? 'All inquiries have been addressed.' : 'Reader inquiries will appear here.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(msg => {
                const isRead = Boolean(msg.read);

                return (
                  <div
                    key={msg.id}
                    className={`bg-white rounded-3xl p-6 sm:p-8 border transition-all ${
                      isRead ? 'border-[#EBE6DC] opacity-90' : 'border-[#6F8A77] shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F2ECE4]">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold font-serif text-sm ${
                          isRead ? 'bg-[#FAF7F2] text-[#8EA595]' : 'bg-[#122B22] text-[#B8E0D2]'
                        }`}>
                          {msg.name?.charAt(0) || 'M'}
                        </div>
                        <div>
                          <div className="font-medium text-[#122B22] flex items-center gap-2">
                            <span>{msg.name}</span>
                            {!isRead && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E27D60] text-white">
                                New
                              </span>
                            )}
                          </div>
                          <a
                            href={`mailto:${msg.email}?subject=Re: Mental Tactic Inquiry`}
                            className="text-xs text-[#6F8A77] hover:underline font-mono"
                          >
                            {msg.email}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleRead(msg.id, isRead)}
                          className="px-3 py-1.5 rounded-full border border-[#EBE6DC] bg-[#FAF7F2] text-xs font-semibold text-[#122B22] hover:bg-[#EAE5DB] transition-colors flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5 text-[#6F8A77]" />
                          <span>{isRead ? 'Mark Unread' : 'Mark Read'}</span>
                        </button>

                        <a
                          href={`mailto:${msg.email}?subject=Re: Mental Tactic Reflection`}
                          className="px-3.5 py-1.5 rounded-full bg-[#122B22] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A3B2F] transition-all flex items-center gap-1.5 shadow-xs"
                        >
                          <Send className="w-3 h-3" />
                          <span>Reply</span>
                        </a>

                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="p-1.5 rounded-full hover:bg-red-50 text-red-600 transition-colors"
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 text-sm text-[#122B22]/85 leading-relaxed font-sans whitespace-pre-line">
                      {msg.message}
                    </div>

                    <div className="pt-3 text-[11px] text-[#8EA595] font-mono">
                      Received: {msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleString() : 'Recently'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
