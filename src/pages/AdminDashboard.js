import { listings } from '../data/listings';
import { reviews } from '../data/reviews';
import { users } from '../data/users';

export default function AdminDashboard() {
  const usersByRole = users.reduce((acc, user) => {
    if (user.role === 'admin') return acc;
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const listingsByStatus = listings.reduce((acc, listing) => {
    const status = listing.adminStatus || 'en attente de validation';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/10">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Utilisateurs</p>
          <p className="mt-4 text-4xl font-bold text-amber-300">{users.filter(user => user.role !== 'admin').length}</p>
          <p className="mt-2 text-slate-600">Étudiants et propriétaires actifs.</p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/10">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Logements</p>
          <p className="mt-4 text-4xl font-bold text-amber-300">{listings.length}</p>
          <p className="mt-2 text-slate-600">Par statut : {Object.entries(listingsByStatus).map(([key, value]) => `${key}: ${value}`).join(', ')}</p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/10">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Avis en attente</p>
          <p className="mt-4 text-4xl font-bold text-amber-300">{reviews.filter(item => item.status === 'en attente').length}</p>
          <p className="mt-2 text-slate-600">Commentaires à approuver ou supprimer.</p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/10">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Répartition</p>
          <p className="mt-4 text-sm font-semibold text-slate-950">{Object.entries(usersByRole).map(([key, value]) => `${key}: ${value}`).join(' • ') || 'Aucune donnée'}</p>
        </div>
      </div>
      <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/10">
        <h2 className="text-2xl font-bold text-slate-950">Vue synthétique</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-amber-300">Logements publiés</p>
            <p className="mt-3 text-3xl font-bold text-slate-950">{listings.filter(item => item.adminStatus === 'publiée').length}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-600">Avis approuvés</p>
            <p className="mt-3 text-3xl font-bold text-slate-950">{reviews.filter(item => item.status === 'approuvé').length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}



