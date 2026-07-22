import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roles = [
  { value: 'student', label: 'Étudiant' },
  { value: 'owner', label: 'Propriétaire' },
];

export default function Register() {
  const { register, user, setMessage } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo || '/profil';
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'student' });

  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true });
    return () => setMessage(null);
  }, [user, navigate, setMessage, redirectTo]);

  const handleSubmit = event => {
    event.preventDefault();
    register(form);
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="rounded-[2rem] bg-white p-8 shadow-2xl shadow-slate-300/10">
        <h2 className="text-3xl font-bold text-slate-950">Créer un compte DariUni</h2>
        <p className="mt-2 text-slate-500">Choisissez un rôle et commencez à gérer logements ou colocations.</p>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Prénom
              <input required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Nom
              <input required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900" />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Mot de passe
              <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900" />
            </label>
          </div>
          <div className="rounded-3xl border border-slate-300 bg-slate-50 p-4">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">Rôle</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {roles.map(role => (
                <button key={role.value} type="button" onClick={() => setForm({ ...form, role: role.value })} className={`rounded-3xl border px-4 py-3 text-left text-sm transition ${form.role === role.value ? 'border-amber-300 bg-amber-400/10 text-amber-200' : 'border-slate-300 bg-slate-50 text-slate-600 hover:border-amber-300 hover:text-slate-950'}`}>
                  <div className="font-semibold">{role.label}</div>
                  <div className="text-xs text-slate-500">{role.value === 'student' ? 'Cherche un logement/coloc' : 'Publie et gère des annonces'}</div>
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full rounded-2xl bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300">S’inscrire</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" state={{ redirectTo }} className="font-semibold text-amber-500 hover:text-amber-400">Connectez-vous</Link>
        </p>
      </div>
    </div>
  );
}


