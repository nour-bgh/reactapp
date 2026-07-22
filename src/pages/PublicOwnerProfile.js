import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listings } from '../data/listings';
import { users } from '../data/users';

function getInitials(firstName = '', lastName = '') {
  const first = firstName?.trim()?.[0] || '';
  const last = lastName?.trim()?.[0] || '';
  return `${first}${last}`.toUpperCase();
}

export default function PublicOwnerProfile() {
  const { user } = useAuth();
  const { id } = useParams();
  const owner = useMemo(() => users.find(item => item.id === Number(id)), [id]);
  const ownerListings = useMemo(() => listings.filter(item => item.ownerId === owner?.id), [owner]);

  if (!owner) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6">
        <p className="text-lg text-slate-600">Profil introuvable.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {owner.photo ? (
              <img src={owner.photo} alt={`${owner.firstName} ${owner.lastName}`} className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/20 text-xl font-semibold text-amber-700">
                {getInitials(owner.firstName, owner.lastName) || 'U'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-950">{owner.firstName} {owner.lastName}</h1>
                {owner.verified && <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-600">Compte vérifié</span>}
              </div>
              <p className="mt-1 text-slate-500">{owner.company || 'Propriétaire indépendant'}</p>
            </div>
          </div>
          {user && user.id !== owner.id && (
            <Link to={`/messages/${owner.id}`} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
              💬 Envoyer un message
            </Link>
          )}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-amber-300">À propos</p>
            <div className="mt-4 space-y-3 text-slate-600">
              <p>{owner.bio || 'Aucune présentation disponible.'}</p>
              <p><span className="font-semibold text-slate-950">Téléphone :</span> {owner.phone || 'Non renseigné'}</p>
              <p><span className="font-semibold text-slate-950">Ville :</span> {owner.city || 'Non renseignée'}</p>
              <p><span className="font-semibold text-slate-950">Date d’inscription :</span> {owner.createdAt || 'Membre DariUni'}</p>
            </div>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Statistiques</p>
            <div className="mt-4 space-y-3 text-slate-600">
              <p><span className="font-semibold text-slate-950">Annonces publiées :</span> {ownerListings.length}</p>
              <p><span className="font-semibold text-slate-950">Note moyenne :</span> {owner.rating || 'À venir'}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[1.75rem] bg-slate-50 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.24em] text-amber-300">Annonces du propriétaire</p>
            <Link to="/logements" className="text-sm font-semibold text-amber-500">Voir toutes les annonces</Link>
          </div>
          <div className="mt-5 grid gap-4">
            {ownerListings.map(listing => (
              <div key={listing.id} className="rounded-3xl border border-slate-200 bg-white p-4 text-slate-600">
                <p className="font-semibold text-slate-950">{listing.title}</p>
                <p>{listing.city} • {listing.price} €/mois</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}