import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedCharacters from '../components/AnimatedCharacters';



const adminCredentials = ['admin@dariuni.tn'];

export default function Login() {
  const { login, user, message, setMessage } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || location.state?.from?.search ? `${location.state?.from?.pathname}${location.state?.from?.search || ''}` : '/';
  const redirectTo = location.state?.redirectTo || from;

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin', { replace: true });
      else if (user.role === 'owner') navigate('/mes-annonces', { replace: true });
      else navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, redirectTo]);

  useEffect(() => {
    return () => setMessage(null);
  }, [setMessage]);

  const handleSubmit = event => {
    event.preventDefault();

    if (form.email && adminCredentials.includes(form.email.toLowerCase()) && form.password !== 'Admin123!') {
      setMessage({ type: 'error', text: 'Le compte administrateur ne peut être utilisé qu’avec les identifiants préconfigurés.' });
      return;
    }

    const success = login(form);
    if (success) {
      navigate(redirectTo, { replace: true });
    }
  };

  

  return (
    <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-black lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <div className="pointer-events-none absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-1/4 left-1/4 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="relative z-10 flex flex-col items-center gap-10">
          <AnimatedCharacters eyesClosed={showPassword} />
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Bienvenue sur DariUni</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-400">Trouvez votre logement étudiant ou gérez vos annonces en toute simplicité.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-3xl bg-white p-8 shadow-2xl shadow-slate-300/10">
            <h2 className="text-3xl font-extrabold text-slate-950">Connexion</h2>
            <p className="mt-2 text-slate-500">Accédez à votre espace étudiant ou propriétaire.</p>
            {message && (
              <div className={`mt-6 rounded-2xl px-4 py-3 text-sm ${message.type === 'error' ? 'bg-red-500/10 text-red-200' : 'bg-emerald-500/10 text-emerald-200'}`}>
                {message.text}
              </div>
            )}
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <label className="block text-sm font-medium text-slate-700">
                Email
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 outline-none ring-1 ring-transparent transition focus:border-amber-300 focus:ring-amber-300/40" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Mot de passe
                <div className="relative mt-2">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 pr-11 text-slate-950 outline-none ring-1 ring-transparent transition focus:border-amber-300 focus:ring-amber-300/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(current => !current)}
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                        <path d="M9.5 5.4A9.8 9.8 0 0 1 12 5c5 0 9 4.5 10 7a12.6 12.6 0 0 1-3.2 4.3M6.2 6.2A12.7 12.7 0 0 0 2 12c1 2.5 5 7 10 7 1.2 0 2.3-.2 3.4-.6" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M2 12c1-2.5 5-7 10-7s9 4.5 10 7c-1 2.5-5 7-10 7s-9-4.5-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </label>
              <button type="submit" className="w-full rounded-2xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300">Se connecter</button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-500">
              Pas encore de compte ?{' '}
              <Link to="/register" state={{ redirectTo }} className="font-semibold text-amber-500 hover:text-amber-400">Inscrivez-vous</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}