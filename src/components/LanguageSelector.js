import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { availableLanguages } from '../i18n/translations';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const currentLanguage = availableLanguages.find(item => item.code === language) || availableLanguages[0];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex h-10 items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
      >
        <span>{currentLanguage.flag}</span>
        <span>{currentLanguage.label}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <ul className="divide-y divide-slate-200 text-sm dark:divide-slate-700">
            {availableLanguages.map(lang => (
              <li key={lang.code}>
                <button
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-4 py-3 text-left transition ${language === lang.code ? 'bg-slate-100 font-semibold dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
