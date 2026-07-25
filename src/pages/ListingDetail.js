import { useMemo } from 'react';
import { Navigate, useLocation, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useReservations } from '../context/ReservationsContext';
import { listings } from '../data/listings';
import { users } from '../data/users';
import { formatPrice } from '../utils/formatters';

function getInitials(firstName = '', lastName = '') {
  const first = firstName?.trim()?.[0] || '';
  const last = lastName?.trim()?.[0] || '';
  return `${first}${last}`.toUpperCase();
}

function formatDate(dateString) {
  if (!dateString) return 'Non renseignée';
  return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function ListingDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite, isSaved, toggleSaved } = useFavorites();
  const { createReservation, hasActiveReservation } = useReservations();
  const listing = useMemo(() => listings.find(item => item.id === id), [id]);
  const owner = useMemo(() => users.find(item => item.id === listing?.ownerId), [listing]);
  const ownerListings = useMemo(() => listings.filter(item => item.ownerId === owner?.id), [owner]);

  if (!user) {
    return <Navigate to="/login" state={{ from: { pathname: location.pathname, search: location.search }, redirectTo: `${location.pathname}${location.search}` }} replace />;
  }

  if (!listing) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
        <p className="text-lg text-slate-600">Annonce introuvable.</p>
        <Link to="/logements" className="mt-6 inline-block rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950">Retour aux logements</Link>
      </div>
    );
  }

  const favorited = isFavorite(listing.id);
  const savedListing = isSaved(listing.id);
  const isAvailable = (listing.status || 'Disponible') === 'Disponible';
  const alreadyRequested = user.role === 'student' && hasActiveReservation(listing.id);

  const handleReserve = () => {
    if (!isAvailable || alreadyRequested) return;
    createReservation(listing);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/10">
          <img src={listing.photos[0]} alt={listing.title} className="h-80 w-full rounded-[1.75rem] object-cover" />
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.28em] text-amber-300">
            <span>{listing.city}</span>
            <span>{listing.type}</span>
            <span>{listing.rating} ★</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${listing.status === 'Réservé' ? 'bg-amber-500/10 text-amber-700' : listing.status === 'Loué' ? 'bg-slate-500/10 text-slate-700' : 'bg-emerald-500/10 text-emerald-600'}`}>{listing.status || 'Disponible'}</span>
            {listing.validationStatus === 'en attente de validation' && <span className="rounded-full bg-orange-500/10 px-3 py-1 text-sm font-semibold text-orange-600">En attente de validation</span>}
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500">Publié le {formatDate(listing.createdAt)}</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-950">{listing.title}</h1>
          <p className="text-slate-600">{listing.description}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Adresse</p>
              <p className="mt-2 text-slate-700">{listing.location}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Surface</p>
              <p className="mt-2 text-slate-700">{listing.surface} m² • {listing.rooms} pièces</p>
            </div>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Équipements</p>
            <ul className="mt-3 grid gap-2 text-slate-600 sm:grid-cols-2">
              {listing.amenities.map(item => <li key={item} className="rounded-2xl bg-white/80 px-3 py-2">{item}</li>)}
            </ul>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => toggleFavorite(listing.id)}
              className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${favorited ? 'bg-rose-500 text-white' : 'border border-slate-300 text-slate-700 hover:border-rose-300 hover:text-rose-500'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M12 20s-7-4.35-9.5-8.5C.8 8.1 2.2 4.5 5.6 4A5 5 0 0 1 12 6.5 5 5 0 0 1 18.4 4c3.4.5 4.8 4.1 3.1 7.5C19 15.65 12 20 12 20Z" />
              </svg>
              {favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            </button>
            <button
              type="button"
              onClick={() => toggleSaved(listing.id)}
              className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${savedListing ? 'bg-amber-400 text-slate-950' : 'border border-slate-300 text-slate-700 hover:border-amber-300 hover:text-amber-600'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={savedListing ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M6 3.5h12a.5.5 0 0 1 .5.5v16.5l-6.5-4-6.5 4V4a.5.5 0 0 1 .5-.5Z" />
              </svg>
              {savedListing ? 'Retirer des enregistrés' : 'Enregistrer'}
            </button>
          </div>
          {owner && (
            <Link to={user ? `/utilisateurs/${owner.id}` : '/login'} state={user ? undefined : { from: { pathname: location.pathname, search: location.search }, redirectTo: `${location.pathname}${location.search}` }} className="block rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 transition hover:border-amber-300 hover:bg-white">
              <p className="text-sm uppercase tracking-[0.24em] text-amber-300">Publié par</p>
              <div className="mt-4 flex items-center gap-4">
                {owner.photo ? (
                  <img src={owner.photo} alt={`${owner.firstName} ${owner.lastName}`} className="h-14 w-14 rounded-full object-cover" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20 text-base font-semibold text-amber-700">
                    {getInitials(owner.firstName, owner.lastName) || 'U'}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-950">{owner.firstName} {owner.lastName}</p>
                    {owner.verified && <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-600">Compte vérifié</span>}
                  </div>
                  <p className="text-sm text-slate-500">{ownerListings.length} annonce{ownerListings.length > 1 ? 's' : ''} publiée{ownerListings.length > 1 ? 's' : ''}</p>
                </div>
              </div>
            </Link>
          )}
        </div>
        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/10">
            <div className="flex items-center justify-between">
              <span className="text-sm uppercase tracking-[0.24em] text-amber-300">Prix</span>
              <span className="text-2xl font-bold text-slate-950">{formatPrice(listing.price)}</span>
            </div>
            <div className="mt-6 space-y-4 text-slate-600">
              <p><span className="font-semibold text-slate-950">Type :</span> {listing.type}</p>
              <p><span className="font-semibold text-slate-950">Disponibilité :</span> {listing.status || 'Disponible'}</p>
              <p><span className="font-semibold text-slate-950">Université la plus proche :</span> {listing.universiteProche}</p>
              <p><span className="font-semibold text-slate-950">Capacité :</span> {listing.capacity} colocataires max</p>
              <p><span className="font-semibold text-slate-950">Note :</span> {listing.rating} / 5</p>
              <p><span className="font-semibold text-slate-950">Publié le :</span> {formatDate(listing.createdAt)}</p>
            </div>

            {user.role === 'student' && (
              <button
                type="button"
                onClick={handleReserve}
                disabled={!isAvailable || alreadyRequested}
                className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                  !isAvailable || alreadyRequested
                    ? 'cursor-not-allowed bg-slate-200 text-slate-400'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
              >
                {!isAvailable ? 'Non disponible' : alreadyRequested ? 'Demande déjà envoyée' : 'Réserver'}
              </button>
            )}

            <Link to="/logements" className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300">Retour aux annonces</Link>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/10">
            <h2 className="text-xl font-semibold text-slate-950">Contact</h2>
            <p className="mt-3 text-slate-500">Envoyez une demande pour ce logement et recevez une réponse du propriétaire.</p>
            <button className="mt-6 w-full rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">Envoyer une demande</button>
          </div>
        </aside>
      </div>
    </div>
  );
}