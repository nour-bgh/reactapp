import { Link } from 'react-router-dom';
import { listings } from '../data/listings';
import { useFavorites } from '../context/FavoritesContext';
import { formatPrice } from '../utils/formatters';

export default function SavedListings() {
  const { saved, toggleSaved } = useFavorites();
  const items = listings.filter(item => saved.includes(item.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/10">
        <h1 className="text-3xl font-bold text-slate-950">Logements enregistrés</h1>
        <p className="mt-2 text-slate-500">Les annonces que vous avez mises de côté pour plus tard.</p>
      </div>

      <div className="grid gap-6">
        {items.length > 0 ? items.map(item => (
          <article key={item.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-300/10 sm:flex sm:gap-6">
            <img src={item.photos[0]} alt={item.title} className="h-56 w-full object-cover sm:h-auto sm:w-72" />
            <div className="p-6 sm:flex-1">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-amber-300">
                <span>{item.city}</span>
                <span>{item.type}</span>
              </div>
              <h3 className="mt-3 text-2xl font-semibold text-slate-950">{item.title}</h3>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
                <span>{item.surface} m² • {item.rooms} chambres</span>
                <span className="font-semibold text-amber-300">{formatPrice(item.price)}</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to={`/logements/${item.id}`} className="rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300">Voir l'annonce</Link>
                <button
                  type="button"
                  onClick={() => toggleSaved(item.id)}
                  className="flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                  Retirer des enregistrés
                </button>
              </div>
            </div>
          </article>
        )) : (
          <p className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-600">Aucun logement enregistré pour le moment.</p>
        )}
      </div>
    </div>
  );
}