import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessagesContext';
import { users } from '../data/users';

function getInitials(firstName = '', lastName = '') {
  const first = firstName?.trim()?.[0] || '';
  const last = lastName?.trim()?.[0] || '';
  return `${first}${last}`.toUpperCase();
}

export default function Conversation() {
  const { userId } = useParams();
  const { user } = useAuth();
  const { getMessagesWith, sendMessage, markConversationRead } = useMessages();
  const [text, setText] = useState('');

  const otherId = Number(userId);
  const other = users.find(u => u.id === otherId);
  const thread = getMessagesWith(otherId);

  useEffect(() => {
    markConversationRead(otherId);
  }, [otherId]);

  if (!other) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <p className="text-slate-600">Utilisateur introuvable.</p>
        <Link to="/messages" className="mt-4 inline-block rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-950">Retour aux messages</Link>
      </div>
    );
  }

  if (user && other.id === user.id) {
    return <Navigate to="/messages" replace />;
  }

  const handleSend = event => {
    event.preventDefault();
    if (!text.trim()) return;
    sendMessage(otherId, text);
    setText('');
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-4 py-16 sm:px-6" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="flex items-center gap-4 rounded-t-[2rem] border border-b-0 border-slate-200 bg-white p-6 shadow-2xl shadow-slate-300/10">
        <Link to="/messages" className="text-slate-400 transition hover:text-slate-950" aria-label="Retour aux messages">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        {other.photo ? (
          <img src={other.photo} alt={`${other.firstName} ${other.lastName}`} className="h-11 w-11 rounded-full object-cover" />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/20 text-sm font-semibold text-amber-700">
            {getInitials(other.firstName, other.lastName) || 'U'}
          </div>
        )}
        <div>
          <p className="font-semibold text-slate-950">{other.firstName} {other.lastName}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{other.role === 'owner' ? 'Propriétaire' : other.role === 'student' ? 'Étudiant' : 'Membre'}</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto border-x border-slate-200 bg-slate-50 p-6">
        {thread.length > 0 ? thread.map(message => {
          const isMine = message.senderId === user.id;
          return (
            <div key={message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${isMine ? 'bg-amber-400 text-slate-950' : 'bg-white text-slate-700 shadow-sm'}`}>
                <p>{message.content}</p>
                <p className={`mt-1 text-[10px] ${isMine ? 'text-slate-950/60' : 'text-slate-400'}`}>
                  {new Date(message.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        }) : (
          <p className="py-10 text-center text-sm text-slate-500">
            Aucun message pour l'instant. Envoyez le premier message à {other.firstName} !
          </p>
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-3 rounded-b-[2rem] border border-t-0 border-slate-200 bg-white p-4 shadow-2xl shadow-slate-300/10">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Écrivez votre message..."
          className="flex-1 rounded-full border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-300"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
            text.trim()
              ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}