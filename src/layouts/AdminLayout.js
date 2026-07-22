import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/utilisateurs', label: 'Utilisateurs' },
  { path: '/admin/logements', label: 'Logements' },
  { path: '/admin/universites', label: 'Universités' },
  { path: '/admin/avis', label: 'Avis' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-amber-300">Admin</h1>
            {user && <p className="mt-2 text-sm text-slate-500">{user.firstName} {user.lastName}</p>}
          </div>
          <nav className="flex flex-col gap-3">
            {menuItems.map(item => (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => `rounded-lg px-4 py-3 text-sm transition ${isActive ? 'bg-amber-500 text-slate-950' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:text-amber-500"
          >
            Déconnexion
          </button>
        </aside>
        <div className="p-6 lg:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}



