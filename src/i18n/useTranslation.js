import { useLanguage } from '../context/LanguageContext';
import { translations } from './translations';

export function useTranslation() {
  const { language, languageData } = useLanguage();
  const t = translations[language] || translations.fr;
  return { t, languageData };
}
