import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader, Trash2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { useAuth } from '../context/AuthContext';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `Tu es Coach IA FitTrack, un coach sportif et nutritionniste expert au Sénégal. Réponds toujours en français, sois motivant et concis (max 100 mots). Tu conseilles sur les exercices, la nutrition sénégalaise (Thiéboudienne, Yassa, Mafé), et la motivation fitness.`;

const CoachIA: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'assistant', content: `Bonjour ${user?.name ?? ''} ! 💪 Je suis votre Coach IA FitTrack. Comment puis-je vous aider ?`, timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const history = messages.slice(1).map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] }));
      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [...history, { role: 'user', parts: [{ text: userMsg.content }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Erreur API');
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Désolé, pas de réponse.';
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), role: 'assistant', content: text, timestamp: new Date() }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), role: 'assistant', content: `❌ Erreur: ${e.message}`, timestamp: new Date() }]);
    } finally { setLoading(false); }
  };

  const quickReplies = ['Exercices débutant', 'Nutrition sénégalaise', 'Je suis démotivé', 'Programme recommandé'];

  return (
    <>
      <button onClick={() => setOpen(o => !o)} className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30 transition-all hover:scale-110">
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-dark-950 animate-pulse" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-24px)] flex flex-col bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden" style={{ height: '520px' }}>
          <div className="flex items-center gap-3 p-4 border-b border-dark-700 bg-dark-800/50">
            <div className="w-9 h-9 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-400"><Bot size={18} /></div>
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">Coach IA FitTrack</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <p className="text-emerald-400 text-xs">Gemini AI • En ligne</p>
              </div>
            </div>
            <button onClick={() => setMessages([{ id: '0', role: 'assistant', content: 'Bonjour ! Comment puis-je vous aider ?', timestamp: new Date() }])} className="text-dark-500 hover:text-dark-300"><Trash2 size={14} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && <div className="w-6 h-6 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 mr-2 mt-1 shrink-0"><Bot size={12} /></div>}
                <div className={`max-w-[80%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary-500 text-white rounded-tr-sm' : 'bg-dark-800 border border-dark-700 text-dark-200 rounded-tl-sm'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 mr-2 shrink-0"><Bot size={12} /></div>
                <div className="bg-dark-800 border border-dark-700 px-4 py-3 rounded-2xl flex gap-1.5 items-center">
                  {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-dark-800">
            {quickReplies.map(q => (
              <button key={q} onClick={() => setInput(q)} className="shrink-0 px-3 py-1.5 bg-dark-800 border border-dark-700 rounded-full text-xs text-dark-300 hover:border-primary-500/50 hover:text-primary-400 transition-all whitespace-nowrap">{q}</button>
            ))}
          </div>

          <div className="p-4 border-t border-dark-700 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} className="input-field flex-1 text-sm py-2" placeholder="Posez votre question..." disabled={loading} />
            <button onClick={send} disabled={!input.trim() || loading} className="w-10 h-10 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-all">
              {loading ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CoachIA;