import { useMemo, useState } from 'react';
import { listings as baseListings } from '../data/listings';
import { formatPrice } from '../utils/formatters';

export default function AdminListings() {
  const [listings, setListings] = useState(baseListings);
  const [selectedId, setSelectedId] = useState(null);

  const visibleListings = useMemo(() => listings.filter(item => item.adminStatus !== 'supprimé'), [listings]);

  const publishListing = id => {
    setListings(current => current.map(item => item.id === id ? { ...item, adminStatus: 'publiée', available: true } : item));
  };

  const rejectListing = id => {
    setListings(current => current.map(item => item.id === id ? { ...item, adminStatus: 'rejetée' } : item));
  };

  const deleteListing = id => {
    setListings(current => current.map(item => item.id === id ? { ...item, adminStatus: 'supprimé' } : item));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/10">
        <h1 className="text-3xl font-bold text-slate-950">Gestion des logements</h1>
        <p className="mt-2 text-slate-500">Validez, rejetez ou supprimez les annonces publiées par les propriétaires.</p>
        <div className="mt-10 grid gap-6">
          {visibleListings.map(listing => (
            <div key={listing.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-950">{listing.title}</p>
                <p className="mt-2 text-slate-600">{listing.city} • {listing.type} • {formatPrice(listing.price)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-2 text-xs ${listing.adminStatus === 'publiée' ? 'bg-emerald-500/10 text-emerald-400' : listing.adminStatus === 'rejetée' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {listing.adminStatus || 'en attente de validation'}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 sm:mt-0">
                {listing.adminStatus !== 'publiée' && <button onClick={() => publishListing(listing.id)} className="rounded-full border border-emerald-500 px-4 py-2 text-sm text-emerald-400">Publier</button>}
                {listing.adminStatus !== 'rejetée' && <button onClick={() => rejectListing(listing.id)} className="rounded-full border border-amber-500 px-4 py-2 text-sm text-amber-400">Rejeter</button>}
                <button onClick={() => setSelectedId(listing.id)} className="rounded-full border border-red-500 px-4 py-2 text-sm text-red-400">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-slate-950">Supprimer cette annonce ?</h2>
            <p className="mt-3 text-slate-600">Cette action est définitive et retirera l’annonce de la plateforme.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setSelectedId(null)} className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-600">Annuler</button>
              <button onClick={() => { deleteListing(selectedId); setSelectedId(null); }} className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


