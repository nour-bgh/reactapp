import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useMessages } from '../context/MessagesContext';
import ThemeToggle from './ThemeToggle';

function getInitials(firstName = '', lastName = '') {
  const first = firstName?.trim()?.[0] || '';
  const last = lastName?.trim()?.[0] || '';
  return `${first}${last}`.toUpperCase();
}

function Avatar({ user, className = '' }) {
  const initials = getInitials(user?.firstName, user?.lastName);
  const bgClass = user?.role === 'owner' ? 'bg-amber-500/20 text-amber-700' : 'bg-sky-500/20 text-sky-700';

  if (user?.photo) {
    return <img src={user.photo} alt={`${user.firstName} ${user.lastName}`} className={`h-10 w-10 rounded-full object-cover ${className}`} />;
  }

  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${bgClass} ${className}`}>
      {initials || 'U'}
    </div>
  );
}

const navItems = [
  { path: '/', label: 'Accueil', public: true },
  { path: '/logements', label: 'Logements', public: true },
  { path: '/compatibilite', label: 'Compatibilité', roles: ['student'] },
  { path: '/mes-annonces', label: 'Mes annonces', roles: ['owner'] },
  { path: '/a-propos', label: 'À propos', public: true },
  { path: '/admin', label: 'Admin Dashboard', roles: ['admin'] },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { favorites, saved } = useFavorites();
  const { unreadTotal } = useMessages();

  return (
    <header className="bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold tracking-tight text-amber-600 dark:text-amber-300">DariUni</Link>
        <nav className="hidden items-center gap-4 md:flex">
          {navItems.map(item => {
            const allowed = item.public || (user && (!item.roles || item.roles.includes(user.role)));
            if (!allowed) return null;
            return (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => isActive ? 'text-amber-300 font-semibold' : 'text-slate-700 hover:text-slate-950'}>
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          {user && (
            <>
              <Link to="/messages" aria-label="Messagerie" className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M21 11.5a8.38 8.38 0 0 1-8.34 8.5H12a8.28 8.28 0 0 1-4.15-1.1L3 20l1.15-4.65A8.38 8.38 0 0 1 3.5 11.5 8.38 8.38 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z" />
                </svg>
                {unreadTotal > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-semibold text-slate-950">{unreadTotal}</span>
                )}
              </Link>
              <Link to="/favoris" aria-label="Mes favoris" className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M12 20s-7-4.35-9.5-8.5C.8 8.1 2.2 4.5 5.6 4A5 5 0 0 1 12 6.5 5 5 0 0 1 18.4 4c3.4.5 4.8 4.1 3.1 7.5C19 15.65 12 20 12 20Z" />
                </svg>
                {favorites.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-semibold text-slate-950">{favorites.length}</span>
                )}
              </Link>
              <Link to="/enregistres" aria-label="Logements enregistrés" className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M6 3.5h12a.5.5 0 0 1 .5.5v16.5l-6.5-4-6.5 4V4a.5.5 0 0 1 .5-.5Z" />
                </svg>
                {saved.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-semibold text-slate-950">{saved.length}</span>
                )}
              </Link>
            </>
          )}
          <ThemeToggle />
          {!user ? (
            <>
              <Link to="/login" className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-amber-300">Connexion</Link>
              <Link to="/register" className="rounded-full border border-amber-400 px-4 py-2 text-sm text-slate-950 transition hover:border-amber-300 hover:text-amber-200">Inscription</Link>
            </>
          ) : (
            <>
              <Link to="/profil" className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 transition hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">
                <Avatar user={user} />
                <span className="hidden sm:inline text-sm text-slate-700 hover:underline dark:text-slate-200">{user.firstName} {user.lastName}</span>
              </Link>
              <button onClick={logout} className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-950 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">Déconnexion</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}