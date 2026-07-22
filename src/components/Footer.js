export default function Footer() {
  return (
    <footer className="bg-white text-slate-600 dark:bg-slate-900 dark:text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-950 dark:text-slate-100">DariUni</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Gestion de logements étudiants et colocation, sans backend.</p>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">© 2026 DariUni. Tous droits réservés.</p>
      </div>
    </footer>
  );
}


