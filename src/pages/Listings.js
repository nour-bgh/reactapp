import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listings } from '../data/listings';
import { getUniversities } from '../data/universities';
import { formatPrice } from '../utils/formatters';

const cities = [...new Set(listings.map(item => item.city))];
const types = [...new Set(listings.map(item => item.type))];

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Listings() {
  const [filters, setFilters] = useState({
    city: '',
    type: '',
    university: '',
    minPrice: '',
    maxPrice: '',
    status: '',
    sortBy: '',
    minOccupants: 1,
  });
  const [universities, setUniversities] = useState(getUniversities());

  useEffect(() => {
    const syncUniversities = () => setUniversities(getUniversities());
    syncUniversities();
    window.addEventListener('dariuni:data-updated', syncUniversities);
    return () => window.removeEventListener('dariuni:data-updated', syncUniversities);
  }, []);

  const filtered = useMemo(() => {
    const result = listings.filter(item => {
      const cityMatch = !filters.city || item.city === filters.city;
      const typeMatch = !filters.type || item.type === filters.type;
      const universityMatch = !filters.university || item.universiteProche === filters.university;
      const minMatch = !filters.minPrice || item.price >= Number(filters.minPrice);
      const maxMatch = !filters.maxPrice || item.price <= Number(filters.maxPrice);
      const statusMatch = !filters.status || (item.status || 'Disponible') === filters.status;
      const occupantsMatch = item.capacity >= filters.minOccupants;
      return cityMatch && typeMatch && universityMatch && minMatch && maxMatch && statusMatch && occupantsMatch;
    });

    if (filters.sortBy === 'recent') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (filters.sortBy === 'ancien') {
      result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    }

    return result;
  }, [filters]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-6 rounded-[2rem] bg-white p-8 shadow-2xl shadow-slate-300/10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Logements</h1>
          <p className="mt-2 text-slate-500">Découvrez les annonces d’appartements, maisons, duplex et villas adaptés aux étudiants tunisiens.</p>
        </div>
        <Link to="/" className="rounded-full border border-amber-400 px-5 py-3 text-sm text-amber-200 transition hover:bg-amber-500/10">Retour à l’accueil</Link>
      </div>
      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <aside className="rounded-[2rem] border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-slate-950">Filtres</h2>
          <div className="space-y-4">
            <label className="block text-sm text-slate-600">Ville
              <select value={filters.city} onChange={e => setFilters({ ...filters, city: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900">
                <option value="">Toutes</option>
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </label>
            <label className="block text-sm text-slate-600">Type
              <select value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900">
                <option value="">Tous</option>
                {types.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>
            <label className="block text-sm text-slate-600">Université
              <select value={filters.university} onChange={e => setFilters({ ...filters, university: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900">
                <option value="">Toutes</option>
                {universities.map(university => (
                  <option key={university.id} value={university.name}>
                    {university.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm text-slate-600">Trier par date
              <select value={filters.sortBy} onChange={e => setFilters({ ...filters, sortBy: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900">
                <option value="">Par défaut</option>
                <option value="recent">Plus récent</option>
                <option value="ancien">Plus ancien</option>
              </select>
            </label>

            <label className="block text-sm text-slate-600">Statut
              <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900">
                <option value="">Tous</option>
                <option value="Disponible">Disponible</option>
                <option value="Réservé">Réservé</option>
              </select>
            </label>

            <div>
              <label className="flex items-center justify-between text-sm text-slate-600">
                <span>Nombre d'occupants</span>
                <span className="font-semibold text-amber-500">{filters.minOccupants}+</span>
              </label>
              <input
                type="range"
                min="1"
                max="6"
                step="1"
                value={filters.minOccupants}
                onChange={e => setFilters({ ...filters, minOccupants: Number(e.target.value) })}
                className="mt-3 w-full accent-amber-400"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-slate-600">Prix min
                <input type="number" value={filters.minPrice} onChange={e => setFilters({ ...filters, minPrice: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900" placeholder="DT" />
              </label>
              <label className="block text-sm text-slate-600">Prix max
                <input type="number" value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900" placeholder="DT" />
              </label>
            </div>
          </div>
        </aside>
        <div className="grid gap-6">
          {filtered.map(item => (
            <article key={item.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-300/10 sm:flex sm:gap-6">
              <img src={item.photos[0]} alt={item.title} className="h-56 w-full object-cover sm:h-auto sm:w-72" />
              <div className="p-6 sm:flex-1">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-amber-300">
                  <span>{item.city}</span>
                  <span>{item.type}</span>
                  <span className="normal-case tracking-normal text-slate-400">Publié le {formatDate(item.createdAt)}</span>
                </div>
                <h3 className="mt-3 text-2xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-slate-500">{item.description}</p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
                  <span>{item.surface} m² • {item.rooms} chambres • {item.capacity} colocataires max</span>
                  <span className="font-semibold text-amber-300">{formatPrice(item.price)}</span>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to={`/logements/${item.id}`} className="rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300">Voir l’annonce</Link>
                  <span className={`rounded-full px-3 py-2 text-sm ${(item.status || 'Disponible') === 'Disponible' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-600'}`}>{item.status || 'Disponible'}</span>
                </div>
              </div>
            </article>
          ))}
          {filtered.length === 0 && <p className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-600">Aucune annonce ne correspond aux filtres.</p>}
        </div>
      </div>
    </div>
  );
}