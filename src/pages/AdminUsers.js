import { useMemo, useState } from 'react';
import { users as baseUsers } from '../data/users';

const roles = ['all', 'student', 'owner'];

export default function AdminUsers() {
  const [users, setUsers] = useState(baseUsers.filter(user => user.role !== 'admin'));
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('');

  const filtered = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'verified' ? user.verified : !user.verified);
      const matchesCity = !cityFilter || (user.city || '').toLowerCase().includes(cityFilter.toLowerCase());
      return matchesSearch && matchesRole && matchesStatus && matchesCity;
    });
  }, [users, search, roleFilter, statusFilter, cityFilter]);

  const toggleStatus = id => {
    setUsers(current => current.map(user => user.id === id ? { ...user, suspended: !user.suspended } : user));
  };

  const verifyUser = id => {
    setUsers(current => current.map(user => user.id === id ? { ...user, verified: true } : user));
  };

  const deleteUser = id => {
    setUsers(current => current.filter(user => user.id !== id));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/10">
        <h1 className="text-3xl font-bold text-slate-950">Gestion des utilisateurs</h1>
        <p className="mt-2 text-slate-500">Recherche, vérification et modération des comptes étudiants et propriétaires.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un utilisateur" className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3" />
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3">
            <option value="all">Tous les rôles</option>
            {roles.filter(item => item !== 'all').map(role => <option key={role} value={role}>{role === 'student' ? 'Étudiant' : 'Propriétaire'}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3">
            <option value="all">Tous les statuts</option>
            <option value="verified">Vérifié</option>
            <option value="pending">En attente</option>
          </select>
          <input value={cityFilter} onChange={e => setCityFilter(e.target.value)} placeholder="Ville" className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 md:col-span-3" />
        </div>

        <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="border-b border-slate-200 bg-white text-slate-500">
              <tr>
                <th className="px-6 py-4">Nom</th>
                <th className="px-6 py-4">Rôle</th>
                <th className="px-6 py-4">Ville</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} className="border-b border-slate-200">
                  <td className="px-6 py-4 text-slate-700">
                    <div className="font-semibold">{user.firstName} {user.lastName}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 text-amber-300">{user.role === 'student' ? 'Étudiant' : 'Propriétaire'}</td>
                  <td className="px-6 py-4 text-slate-600">{user.city || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-2 text-xs ${user.verified ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {user.verified ? 'vérifié' : 'en attente'}
                    </span>
                    {user.suspended && <span className="ml-2 rounded-full bg-red-500/10 px-3 py-2 text-xs text-red-400">suspendu</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {!user.verified && <button onClick={() => verifyUser(user.id)} className="rounded-full border border-emerald-500 px-3 py-2 text-xs text-emerald-400">Vérifier</button>}
                      <button onClick={() => toggleStatus(user.id)} className="rounded-full border border-slate-300 px-3 py-2 text-xs text-slate-600">{user.suspended ? 'Réactiver' : 'Suspendre'}</button>
                      <button onClick={() => deleteUser(user.id)} className="rounded-full border border-red-500 px-3 py-2 text-xs text-red-400">Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


