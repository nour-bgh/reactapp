import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useMessages } from '../context/MessagesContext';
import { useReservations } from '../context/ReservationsContext';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../i18n/useTranslation';

const navItems = [
  { path: '/', labelKey: 'home', public: true },
  { path: '/logements', labelKey: 'listings', public: true },
  { path: '/compatibilite', labelKey: 'compatibility', roles: ['student'] },
  { path: '/mes-annonces', labelKey: 'profile', roles: ['owner'] },
  { path: '/a-propos', labelKey: 'about', public: true },
  { path: '/admin', labelKey: 'admin', roles: ['admin'] },
];

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

export default function Navbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { favorites, saved } = useFavorites();
  const { unreadTotal } = useMessages();
  const { unreadTotal: unreadNotifications } = useReservations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold tracking-tight text-amber-600 dark:text-amber-300">DariUni</Link>

        {/* Liens de navigation - desktop uniquement */}
        <nav className="hidden items-center gap-4 md:flex">
          {navItems.map(item => {
            const allowed = item.public || (user && (!item.roles || item.roles.includes(user.role)));
            if (!allowed) return null;
            return (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => isActive ? 'text-amber-300 font-semibold' : 'text-slate-700 hover:text-slate-950'}>
                {t.navbar[item.labelKey] || item.labelKey}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {user && (
            <>
              <Link to="/notifications" aria-label="Notifications" className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M18 8a6 6 0 0 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" />
                  <path d="M13.7 21a2 2 0 0 1-3.4 0" />
                </svg>
                {unreadNotifications > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">{unreadNotifications}</span>
                )}
              </Link>
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
          <LanguageSelector />
          <ThemeToggle />
          {!user ? (
            <>
              <Link to="/login" className="hidden rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-amber-300 sm:inline-block">{t.navbar.login}</Link>
              <Link to="/register" className="hidden rounded-full border border-amber-400 px-4 py-2 text-sm text-slate-950 transition hover:border-amber-300 hover:text-amber-200 sm:inline-block">{t.navbar.register}</Link>
            </>
          ) : (
            <>
              <Link to="/profil" className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-2 transition hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 sm:flex">
                <Avatar user={user} />
                <span className="hidden sm:inline text-sm text-slate-700 hover:underline dark:text-slate-200">{user.firstName} {user.lastName}</span>
              </Link>
              <button onClick={logout} className="hidden rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-950 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 sm:inline-block">{t.navbar.logout}</button>
            </>
          )}

          {/* Bouton hamburger - mobile uniquement */}
          <button
            onClick={() => setIsMenuOpen(prev => !prev)}
            aria-label="Menu"
            aria-expanded={isMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu déroulant mobile */}
      {isMenuOpen && (
        <div className="border-t border-slate-200 px-4 py-4 dark:border-slate-800 md:hidden">
          <nav className="flex flex-col gap-3">
            {navItems.map(item => {
              const allowed = item.public || (user && (!item.roles || item.roles.includes(user.role)));
              if (!allowed) return null;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={({ isActive }) => isActive ? 'text-amber-300 font-semibold' : 'text-slate-700 dark:text-slate-200'}
                >
                  {t.navbar[item.labelKey] || item.labelKey}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
            {!user ? (
              <>
                <Link to="/login" onClick={closeMenu} className="rounded-full bg-amber-400 px-4 py-2 text-center text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-amber-300">{t.navbar.login}</Link>
                <Link to="/register" onClick={closeMenu} className="rounded-full border border-amber-400 px-4 py-2 text-center text-sm text-slate-950 transition hover:border-amber-300 hover:text-amber-200">{t.navbar.register}</Link>
              </>
            ) : (
              <>
                <Link to="/profil" onClick={closeMenu} className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 transition hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">
                  <Avatar user={user} />
                  <span className="text-sm text-slate-700 dark:text-slate-200">{user.firstName} {user.lastName}</span>
                </Link>
                <button
                  onClick={() => { closeMenu(); logout(); }}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-950 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                >
                  {t.navbar.logout}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}