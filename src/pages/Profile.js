import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { listings } from '../data/listings';


function getInitials(firstName = '', lastName = '') {
  const first = firstName?.trim()?.[0] || '';
  const last = lastName?.trim()?.[0] || '';
  return `${first}${last}`.toUpperCase();
}

const initialFormFrom = user => ({
  firstName: user?.firstName || '',
  lastName: user?.lastName || '',
  university: user?.university || '',
  phone: user?.phone || '',
  bio: user?.bio || '',
});

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const ownerListings = useMemo(() => listings.filter(item => item.ownerId === user?.id), [user]);
  const [form, setForm] = useState(() => initialFormFrom(user));

  if (!user) return null;

  const avatarBg = user.role === 'owner' ? 'bg-amber-500/20 text-amber-700' : 'bg-sky-500/20 text-sky-700';

  const original = initialFormFrom(user);
  const hasChanges = Object.keys(original).some(key => form[key] !== original[key]);

  const handleSubmit = event => {
    event.preventDefault();
    if (!hasChanges) return;
    updateProfile({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      university: form.university.trim(),
      phone: form.phone.trim(),
      bio: form.bio.trim(),
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-2xl shadow-slate-300/10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">Mon profil</h1>
            <p className="mt-2 text-slate-500">Votre photo et vos informations sont visibles de façon cohérente sur la plateforme.</p>
          </div>
          <div className="relative inline-flex">
            {user.photo ? (
              <img src={user.photo} alt={`${user.firstName} ${user.lastName}`} className="h-24 w-24 rounded-full object-cover ring-4 ring-amber-100" />
            ) : (
              <div className={`flex h-24 w-24 items-center justify-center rounded-full text-2xl font-semibold ring-4 ring-amber-100 ${avatarBg}`}>
                {getInitials(user.firstName, user.lastName) || 'U'}
              </div>
            )}
            <div className="absolute bottom-1 right-1 rounded-full border border-white bg-slate-900/80 p-2 text-white" title="Fonctionnalité à venir">
              <span className="text-sm">📷</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-amber-300">Informations</p>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-slate-600">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-slate-500">
                  Prénom
                  <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-slate-900" />
                </label>
                <label className="text-sm text-slate-500">
                  Nom
                  <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-slate-900" />
                </label>
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="mt-2">{user.email}</p>
              </div>
              {user.role === 'student' && (
                <label className="block text-sm text-slate-500">
                  Université
                  <input value={form.university} onChange={e => setForm({ ...form, university: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-slate-900" />
                </label>
              )}
              {user.role === 'owner' && (
                <div>
                  <p className="text-sm text-slate-500">Entreprise / activité</p>
                  <p className="mt-2">{user.company || 'Indépendant'}</p>
                </div>
              )}
              <label className="block text-sm text-slate-500">
                Bio
                <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows="3" className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-slate-900" />
              </label>
              <label className="block text-sm text-slate-500">
                Téléphone
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-slate-900" />
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={!hasChanges}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    hasChanges
                      ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Enregistrer
                </button>
                {hasChanges && (
                  <button
                    type="button"
                    onClick={() => setForm(initialFormFrom(user))}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-950"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Statut</p>
            <div className="mt-5 space-y-4 text-slate-600">
              <p className="text-lg font-semibold text-slate-950">{user.role === 'admin' ? 'Administrateur' : user.role === 'owner' ? 'Propriétaire' : 'Étudiant'}</p>
              <p>{user.role === 'student' ? 'Vous pouvez chercher un logement et gérer vos groupes de colocation.' : user.role === 'owner' ? 'Vous pouvez publier vos annonces et consulter les demandes.' : 'Vous gérez les utilisateurs et les annonces de la plateforme.'}</p>
              {user.role === 'owner' && <p className="text-sm text-slate-500">Annonces publiées : {ownerListings.length}</p>}
            </div>
          </div>
        </div>
        {ownerListings.length > 0 && (
          <div className="mt-10 rounded-[1.75rem] bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-amber-300">Vos annonces</p>
            <div className="mt-5 grid gap-4">
              {ownerListings.map(listing => (
                <div key={listing.id} className="rounded-3xl border border-slate-200 bg-white p-4 text-slate-600">
                  <p className="font-semibold text-slate-950">{listing.title}</p>
                  <p>{listing.city} • {listing.price} €/mois</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}