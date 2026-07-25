import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useReservations } from '../context/ReservationsContext';
import { users } from '../data/users';

function getInitials(firstName = '', lastName = '') {
  const first = firstName?.trim()?.[0] || '';
  const last = lastName?.trim()?.[0] || '';
  return `${first}${last}`.toUpperCase();
}

function formatDateTime(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function getStatusStyle(status) {
  switch (status) {
    case 'acceptée':
      return 'bg-emerald-500/10 text-emerald-600';
    case 'refusée':
      return 'bg-rose-500/10 text-rose-600';
    default:
      return 'bg-amber-500/10 text-amber-700';
  }
}

function useCountdown(targetDate) {
  const [remaining, setRemaining] = useState(() => (targetDate ? new Date(targetDate).getTime() - Date.now() : null));

  useEffect(() => {
    if (!targetDate) return undefined;
    const interval = setInterval(() => {
      setRemaining(new Date(targetDate).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (remaining === null) return null;
  if (remaining <= 0) return { expired: true };

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  return { expired: false, days, hours, minutes, seconds };
}

function CountdownBadge({ deadline }) {
  const countdown = useCountdown(deadline);
  if (!deadline) return <p className="mt-3 text-sm text-slate-500">Aucune date limite définie pour cette réservation.</p>;
  if (!countdown) return null;
  if (countdown.expired) {
    return <p className="mt-3 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">Délai de réservation expiré</p>;
  }
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {[
        { value: countdown.days, label: 'j' },
        { value: countdown.hours, label: 'h' },
        { value: countdown.minutes, label: 'min' },
        { value: countdown.seconds, label: 's' },
      ].map(unit => (
        <div key={unit.label} className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
          <span className="text-lg font-bold">{unit.value}</span>
          <span className="text-[10px] uppercase">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

function OwnerNotifications() {
  const { getOwnerReservations, respondReservation, markOwnerRead } = useReservations();
  const reservations = getOwnerReservations();

  useEffect(() => {
    reservations.forEach(res => {
      if (!res.ownerRead) markOwnerRead(res.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      {reservations.length > 0 ? reservations.map(res => {
        const student = users.find(u => u.id === res.studentId);
        return (
          <div key={res.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                {student?.photo ? (
                  <img src={student.photo} alt={`${student.firstName} ${student.lastName}`} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/20 text-sm font-semibold text-sky-700">
                    {getInitials(student?.firstName, student?.lastName) || 'U'}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-slate-950">{student?.firstName} {student?.lastName}</p>
                  <p className="text-sm text-slate-500">souhaite réserver <span className="font-medium text-slate-700">{res.listingTitle}</span></p>
                  <p className="text-xs text-slate-400">{formatDateTime(res.createdAt)}</p>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(res.status)}`}>{res.status}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {student && (
                <Link to={`/utilisateurs/${student.id}`} className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:border-amber-300 hover:text-slate-950">
                  Voir le profil
                </Link>
              )}
              {res.status === 'en attente' && (
                <>
                  <button
                    onClick={() => respondReservation(res.id, 'acceptée')}
                    className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                  >
                    Accepter
                  </button>
                  <button
                    onClick={() => respondReservation(res.id, 'refusée')}
                    className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                  >
                    Refuser
                  </button>
                </>
              )}
            </div>
          </div>
        );
      }) : (
        <p className="rounded-[1.75rem] border border-slate-200 bg-white p-8 text-center text-slate-600">
          Vous n'avez reçu aucune demande de réservation pour le moment.
        </p>
      )}
    </div>
  );
}

function StudentNotifications() {
  const { getStudentReservations, markStudentRead } = useReservations();
  const reservations = getStudentReservations();

  useEffect(() => {
    reservations.forEach(res => {
      if (!res.studentRead) markStudentRead(res.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      {reservations.length > 0 ? reservations.map(res => (
        <div key={res.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-950">{res.listingTitle}</p>
              <p className="text-xs text-slate-400">Demande envoyée le {formatDateTime(res.createdAt)}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(res.status)}`}>{res.status}</span>
          </div>

          {res.status === 'en attente' && (
            <p className="mt-3 text-sm text-slate-500">Votre demande est en attente de réponse du propriétaire.</p>
          )}
          {res.status === 'refusée' && (
            <p className="mt-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">Le propriétaire a refusé votre demande de réservation pour ce logement.</p>
          )}
          {res.status === 'acceptée' && (
            <>
              <p className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Votre demande a été acceptée ! Finalisez votre réservation avant la fin du délai.</p>
              <CountdownBadge deadline={res.reservationDeadline} />
            </>
          )}
        </div>
      )) : (
        <p className="rounded-[1.75rem] border border-slate-200 bg-white p-8 text-center text-slate-600">
          Vous n'avez envoyé aucune demande de réservation pour le moment.
        </p>
      )}
    </div>
  );
}

export default function Notifications() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/10">
        <h1 className="text-3xl font-bold text-slate-950">Notifications</h1>
        <p className="mt-2 text-slate-500">
          {user.role === 'owner'
            ? 'Vos demandes de réservation reçues.'
            : 'Le suivi de vos demandes de réservation.'}
        </p>
      </div>

      {user.role === 'owner' ? <OwnerNotifications /> : <StudentNotifications />}
    </div>
  );
}