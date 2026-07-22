import { useState } from 'react';

const categories = [
  {
    label: 'Général',
    color: 'amber',
    faqs: [
      {
        question: "Qu'est-ce que DariUni ?",
        answer: "DariUni est une plateforme qui met en relation les étudiants tunisiens et les propriétaires pour faciliter la recherche de logements et de colocations près des universités.",
      },
      {
        question: 'Comment fonctionne la recherche de logement ?',
        answer: "Vous pouvez filtrer les annonces par ville, type de logement, université la plus proche et budget, afin de trouver rapidement un logement adapté à vos besoins.",
      },
    ],
  },
  {
    label: 'Réservation',
    color: 'sky',
    faqs: [
      {
        question: 'Comment réserver un logement ?',
        answer: "Une fois connecté, vous pouvez consulter les détails d'une annonce et envoyer une demande de réservation directement au propriétaire, qui pourra l'accepter ou la refuser.",
      },
      {
        question: 'Puis-je enregistrer des annonces pour plus tard ?',
        answer: 'Oui, vous pouvez ajouter des logements à vos favoris ou les enregistrer pour les consulter facilement depuis votre menu de navigation.',
      },
    ],
  },
  {
    label: 'Colocation',
    color: 'emerald',
    faqs: [
      {
        question: "Qu'est-ce que la compatibilité colocataire ?",
        answer: "C'est un questionnaire qui évalue votre style de vie (propreté, sociabilité, horaires, etc.) afin de vous proposer des colocataires potentiels compatibles avec vos habitudes.",
      },
    ],
  },
  {
    label: 'Propriétaires',
    color: 'rose',
    faqs: [
      {
        question: 'Comment publier une annonce en tant que propriétaire ?',
        answer: "Depuis votre espace \"Mes annonces\", vous pouvez créer une nouvelle annonce en renseignant les informations du logement, ses équipements et ses règles. Elle sera ensuite soumise à validation par notre équipe.",
      },
      {
        question: 'Les comptes sont-ils vérifiés ?',
        answer: 'Oui, les comptes étudiants et propriétaires peuvent être vérifiés par notre équipe pour renforcer la confiance entre les utilisateurs de la plateforme.',
      },
      {
        question: 'Comment contacter un propriétaire ?',
        answer: "Vous pouvez consulter le profil public d'un propriétaire depuis une annonce et lui envoyer un message directement via la messagerie intégrée.",
      },
    ],
  },
];

const colorStyles = {
  amber: {
    badge: 'bg-amber-400 text-slate-950',
    ring: 'ring-amber-200',
    text: 'text-amber-600 dark:text-amber-300',
    bar: 'bg-amber-400',
  },
  sky: {
    badge: 'bg-sky-400 text-slate-950',
    ring: 'ring-sky-200',
    text: 'text-sky-600 dark:text-sky-300',
    bar: 'bg-sky-400',
  },
  emerald: {
    badge: 'bg-emerald-400 text-slate-950',
    ring: 'ring-emerald-200',
    text: 'text-emerald-600 dark:text-emerald-300',
    bar: 'bg-emerald-400',
  },
  rose: {
    badge: 'bg-rose-400 text-slate-950',
    ring: 'ring-rose-200',
    text: 'text-rose-600 dark:text-rose-300',
    bar: 'bg-rose-400',
  },
};

function FaqItem({ item, index, color, isOpen, onToggle }) {
  const styles = colorStyles[color];

  return (
    <div
      className={`group relative overflow-hidden rounded-[1.75rem] border bg-white transition-all duration-300 dark:bg-slate-900 ${
        isOpen ? `border-transparent shadow-xl ${styles.ring} ring-2` : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      <span className={`absolute inset-y-0 left-0 w-1.5 ${styles.bar} transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-6 py-5 text-left"
      >
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${styles.badge}`}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="flex-1 text-base font-semibold text-slate-950 dark:text-slate-100">{item.question}</span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            isOpen ? `rotate-45 ${styles.bar} border-transparent text-slate-950` : 'border-slate-300 text-slate-500 group-hover:border-slate-400 dark:border-slate-600 dark:text-slate-400'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <p className="px-6 pb-6 pl-[4.25rem] text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const [activeCategory, setActiveCategory] = useState(categories[0].label);
  const [openKey, setOpenKey] = useState(`${categories[0].label}-0`);

  const currentCategory = categories.find(cat => cat.label === activeCategory);

  const toggle = key => {
    setOpenKey(current => (current === key ? '' : key));
  };

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-amber-400 via-amber-300 to-orange-300 p-10 text-center shadow-2xl shadow-amber-300/30 sm:p-14">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
          <h1 className="mt-3 text-4xl font-extrabold text-slate-950 sm:text-5xl">On répond à vos questions</h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-800/80">
            Tout ce qu'il faut savoir sur DariUni, la plateforme de logement étudiant et de colocation en Tunisie.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {categories.map(cat => {
            const styles = colorStyles[cat.color];
            const active = activeCategory === cat.label;
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => setActiveCategory(cat.label)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  active
                    ? `${styles.badge} shadow-md`
                    : 'border border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 space-y-4">
          {currentCategory.faqs.map((item, index) => {
            const key = `${currentCategory.label}-${index}`;
            return (
              <FaqItem
                key={key}
                item={item}
                index={index}
                color={currentCategory.color}
                isOpen={openKey === key}
                onToggle={() => toggle(key)}
              />
            );
          })}
        </div>

        <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-900">
          <div className="text-center">
            <p className="font-semibold text-slate-950 dark:text-slate-100">Une autre question ?</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Contactez-nous directement, on répond vite.</p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <a
              href="mailto:contact@dariuni.tn"
              className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 p-5 text-center transition hover:border-rose-300 hover:bg-rose-50/50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m4 6.5 8 6.5 8-6.5" />
                </svg>
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Email</p>
                <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-slate-100">contact@dariuni.tn</p>
              </div>
            </a>

            <a
              href="tel:+21671000000"
              className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 p-5 text-center transition hover:border-sky-300 hover:bg-sky-50/50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-500/10 text-sky-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M15 19h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1M10 5h4M11 17h2" />
                </svg>
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Téléphone fixe</p>
                <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-slate-100">71 000 000</p>
              </div>
            </a>

            <a
              href="https://wa.me/21620000000"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 p-5 text-center transition hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M20 12a8 8 0 1 1-3.66-6.73" />
                  <path d="M20 4 12 12l-3-2" />
                  <path d="M14 20.5a8 8 0 0 1-9.8-9.8" />
                </svg>
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">WhatsApp</p>
                <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-slate-100">20 000 000</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}