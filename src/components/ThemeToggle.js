import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n/useTranslation';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={theme === 'dark' ? t.theme.activateLight : t.theme.activateDark}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-slate-950 shadow-sm transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
    >
      {theme === 'dark' ? (
        // Icône soleil (clique pour passer en mode clair)
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2M12 19.5v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2.5 12h2M19.5 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        // Icône lune (clique pour passer en mode sombre)
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
        </svg>
      )}
    </button>
  );
}