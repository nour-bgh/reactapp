import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listings as initialListings } from '../data/listings';
import { universities } from '../data/universities';
import { useAuth } from '../context/AuthContext';

const baseAmenities = ['Wifi', 'Climatisation', 'Meublé', 'Cuisine équipée', 'Parking', 'Laverie', 'Balcon', 'Jardin', 'Piscine'];
const statuses = ['Disponible', 'Réservé', 'Loué'];
const types = ['Appartement', 'Maison', 'Duplex', 'Studio', 'Villa'];

function formatDate(dateString) {
  if (!dateString) return 'Non renseignée';
  return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

const emptyForm = {
  title: '',
  description: '',
  type: 'Appartement',
  city: 'Tunis',
  location: '',
  universiteProche: universities[0]?.name || '',
  price: '',
  rooms: '1',
  bathrooms: '1',
  surface: '',
  photos: [''],
  amenities: ['Wifi'],
  capacity: '2',
  status: 'Disponible',
  validationStatus: 'en attente de validation',
  regles: {
    maxOccupants: '2',
    genderPreference: 'Mixte',
    reservationDeadline: '',
    autresRegles: ['Non fumeur'],
  },
};

function getStatusBadge(status) {
  switch (status) {
    case 'Réservé':
      return 'bg-amber-500/10 text-amber-700';
    case 'Loué':
      return 'bg-slate-500/10 text-slate-700';
    default:
      return 'bg-emerald-500/10 text-emerald-700';
  }
}

export default function MyListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState(initialListings);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const mine = useMemo(() => listings.filter(item => item.ownerId === user?.id), [user, listings]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const startCreate = () => {
    setForm({ ...emptyForm, amenities: ['Wifi'] });
    setEditingId(null);
    setShowForm(true);
  };

  const startEdit = item => {
    setEditingId(item.id);
    setForm({
      ...emptyForm,
      ...item,
      price: item.price.toString(),
      rooms: item.rooms.toString(),
      bathrooms: item.bathrooms.toString(),
      capacity: item.capacity.toString(),
      photos: item.photos?.length ? item.photos : [''],
      amenities: item.amenities || ['Wifi'],
      regles: {
        maxOccupants: item.regles?.maxOccupants?.toString() || '2',
        genderPreference: item.regles?.genderPreference || 'Mixte',
        reservationDeadline: item.regles?.reservationDeadline || '',
        autresRegles: item.regles?.autresRegles || ['Non fumeur'],
      },
    });
    setShowForm(true);
  };

  const saveListing = event => {
    event.preventDefault();
    const existing = editingId ? listings.find(item => item.id === editingId) : null;
    const payload = {
      ...form,
      id: editingId || `draft-${Date.now()}`,
      ownerId: user.id,
      price: Number(form.price),
      rooms: Number(form.rooms),
      bathrooms: Number(form.bathrooms),
      surface: Number(form.surface),
      capacity: Number(form.capacity),
      available: form.status === 'Disponible',
      rating: existing?.rating || 4.5,
      createdAt: existing?.createdAt || new Date().toISOString(),
      photos: form.photos.filter(Boolean),
      amenities: form.amenities,
      validationStatus: existing?.validationStatus || 'en attente de validation',
      regles: {
        maxOccupants: Number(form.regles.maxOccupants),
        genderPreference: form.regles.genderPreference,
        reservationDeadline: form.regles.reservationDeadline,
        autresRegles: form.regles.autresRegles.filter(Boolean),
      },
    };

    if (editingId) {
      setListings(current => current.map(item => item.id === editingId ? payload : item));
    } else {
      setListings(current => [payload, ...current]);
    }
    resetForm();
  };

  const removeListing = id => {
    setListings(current => current.filter(item => item.id !== id));
    setConfirmDeleteId(null);
  };

  const updateStatus = (id, nextStatus) => {
    setListings(current => current.map(item => item.id === id ? { ...item, status: nextStatus, available: nextStatus === 'Disponible' } : item));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950">Mes annonces</h1>
            <p className="mt-2 text-slate-500">Créez, modifiez et gérez vos logements publiés.</p>
          </div>
          <button onClick={startCreate} className="rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300">Publier une nouvelle annonce</button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={saveListing} className="mb-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-950">{editingId ? 'Modifier l’annonce' : 'Créer une annonce'}</h2>
            <button type="button" onClick={resetForm} className="text-sm font-semibold text-slate-500">Fermer</button>
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-slate-600">Titre<input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900" /></label>
                <label className="text-sm text-slate-600">Type<select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900">{types.map(type => <option key={type} value={type}>{type}</option>)}</select></label>
              </div>
              <label className="block text-sm text-slate-600">Description<textarea required rows="4" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900" /></label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-slate-600">Ville<select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900">{['Tunis','Sousse','Sfax','Monastir','Ariana','Manouba','Ben Arous','Gabès','Nabeul','Bizerte'].map(city => <option key={city} value={city}>{city}</option>)}</select></label>
                <label className="text-sm text-slate-600">Université la plus proche<select value={form.universiteProche} onChange={e => setForm({ ...form, universiteProche: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900">{universities.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}</select></label>
              </div>
              <label className="block text-sm text-slate-600">Adresse / localisation<input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900" /></label>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="text-sm text-slate-600">Prix (DT/mois)<input required type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900" /></label>
                <label className="text-sm text-slate-600">Chambres<input required type="number" min="1" value={form.rooms} onChange={e => setForm({ ...form, rooms: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900" /></label>
                <label className="text-sm text-slate-600">Salles de bain<input required type="number" min="1" value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900" /></label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-slate-600">Surface (m²)<input required type="number" min="1" value={form.surface} onChange={e => setForm({ ...form, surface: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900" /></label>
                <label className="text-sm text-slate-600">Capacité maximale<input required type="number" min="1" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900" /></label>
              </div>
              <label className="block text-sm text-slate-600">Photos (URLs séparées par une virgule)<input value={form.photos.join(',')} onChange={e => setForm({ ...form, photos: e.target.value.split(',').map(url => url.trim()).filter(Boolean) })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900" /></label>
            </div>
            <div className="space-y-5">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">Équipements</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {baseAmenities.map(item => (
                    <button key={item} type="button" onClick={() => setForm(current => ({ ...current, amenities: current.amenities.includes(item) ? current.amenities.filter(am => am !== item) : [...current.amenities, item] }))} className={`rounded-full px-3 py-2 text-sm ${form.amenities.includes(item) ? 'bg-amber-400 text-slate-950' : 'bg-white text-slate-600'}`}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">Règles</p>
                <div className="mt-4 space-y-4">
                  <label className="block text-sm text-slate-600">Préférence de genre<select value={form.regles.genderPreference} onChange={e => setForm({ ...form, regles: { ...form.regles, genderPreference: e.target.value } })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-slate-900"><option value="Mixte">Mixte</option><option value="Hommes uniquement">Hommes uniquement</option><option value="Femmes uniquement">Femmes uniquement</option></select></label>
                  <label className="block text-sm text-slate-600">Date limite de réservation<input type="date" value={form.regles.reservationDeadline} onChange={e => setForm({ ...form, regles: { ...form.regles, reservationDeadline: e.target.value } })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-slate-900" /></label>
                  <label className="block text-sm text-slate-600">Autres règles<input value={form.regles.autresRegles.join(', ')} onChange={e => setForm({ ...form, regles: { ...form.regles, autresRegles: e.target.value.split(',').map(value => value.trim()).filter(Boolean) } })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-slate-900" /></label>
                  <label className="block text-sm text-slate-600">Statut<select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-slate-900">{statuses.map(status => <option key={status} value={status}>{status}</option>)}</select></label>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={resetForm} className="rounded-full border border-slate-300 px-5 py-3 text-sm text-slate-600">Annuler</button>
            <button type="submit" className="rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950">Enregistrer</button>
          </div>
        </form>
      )}

      <div className="grid gap-6">
        {mine.length > 0 ? mine.map(item => (
          <article key={item.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-300/10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img src={item.photos?.[0] || 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80'} alt={item.title} className="h-28 w-40 rounded-[1.5rem] object-cover" />
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(item.status || 'Disponible')}`}>{item.status || 'Disponible'}</span>
                    {item.validationStatus === 'en attente de validation' && <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-600">En attente de validation</span>}
                  </div>
                  <p className="mt-2 text-slate-500">{item.city} • {item.type} • {item.price} DT/mois</p>
                  <p className="mt-1 text-xs text-slate-400">Publié le {formatDate(item.createdAt)}</p>
                  <p className="mt-2 text-sm text-slate-500">{item.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to={`/logements/${item.id}`} className="rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300">Voir</Link>
                <button onClick={() => startEdit(item)} className="rounded-full border border-slate-300 px-5 py-3 text-sm text-slate-600 transition hover:border-amber-300 hover:text-slate-950">Modifier</button>
                <button onClick={() => setConfirmDeleteId(item.id)} className="rounded-full border border-rose-300 px-5 py-3 text-sm text-rose-600 transition hover:bg-rose-50">Supprimer</button>
                <select value={item.status || 'Disponible'} onChange={e => updateStatus(item.id, e.target.value)} className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700">
                  {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
            </div>
            {confirmDeleteId === item.id && (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                <p className="font-semibold">Supprimer définitivement cette annonce ?</p>
                <div className="mt-3 flex gap-3">
                  <button onClick={() => removeListing(item.id)} className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Confirmer</button>
                  <button onClick={() => setConfirmDeleteId(null)} className="rounded-full border border-rose-300 px-4 py-2 text-sm">Annuler</button>
                </div>
              </div>
            )}
          </article>
        )) : (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-slate-600">Vous n’avez pas encore d’annonces publiées.</div>
        )}
      </div>
    </div>
  );
}