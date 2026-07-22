import { Link } from 'react-router-dom';
import { useMessages } from '../context/MessagesContext';
import { users } from '../data/users';

function getInitials(firstName = '', lastName = '') {
  const first = firstName?.trim()?.[0] || '';
  const last = lastName?.trim()?.[0] || '';
  return `${first}${last}`.toUpperCase();
}

export default function Messages() {
  const { getConversations } = useMessages();
  const conversations = getConversations();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/10">
        <h1 className="text-3xl font-bold text-slate-950">Messagerie</h1>
        <p className="mt-2 text-slate-500">Vos conversations avec les étudiants et propriétaires de DariUni.</p>
      </div>

      <div className="space-y-3">
        {conversations.length > 0 ? conversations.map(({ otherId, lastMessage, unread }) => {
          const other = users.find(u => u.id === otherId);
          if (!other) return null;
          return (
            <Link
              key={otherId}
              to={`/messages/${otherId}`}
              className="flex items-center gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-300 hover:bg-amber-50/40"
            >
              {other.photo ? (
                <img src={other.photo} alt={`${other.firstName} ${other.lastName}`} className="h-14 w-14 shrink-0 rounded-full object-cover" />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-base font-semibold text-amber-700">
                  {getInitials(other.firstName, other.lastName) || 'U'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-slate-950">{other.firstName} {other.lastName}</p>
                  {lastMessage && (
                    <span className="shrink-0 text-xs text-slate-400">
                      {new Date(lastMessage.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                    </span>
                  )}
                </div>
                <p className="truncate text-sm text-slate-500">{lastMessage?.content || 'Nouvelle conversation'}</p>
              </div>
              {unread > 0 && (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-semibold text-slate-950">{unread}</span>
              )}
            </Link>
          );
        }) : (
          <p className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center text-slate-600">
            Vous n'avez aucune conversation pour le moment. Rendez-vous sur le profil d'un étudiant ou d'un propriétaire pour lui envoyer un message.
          </p>
        )}
      </div>
    </div>
  );
}