import en from './en.json';
import vi from './vi.json';

export type Language = 'en' | 'vi';
export type TranslationKey = string;

const translations = {
  en,
  vi,
};

let currentLanguage: Language = 'en';

export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
  if (typeof window !== 'undefined') {
    localStorage.setItem('lazorkit-language', lang);
  }
};

export const getLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('lazorkit-language') as Language;
    if (stored && (stored === 'en' || stored === 'vi')) {
      currentLanguage = stored;
    }
  }
  return currentLanguage;
};

export const t = (key: TranslationKey): string => {
  const keys = key.split('.');
  let value: any = translations[currentLanguage];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English if key not found
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key; // Return key if not found in any language
        }
      }
      break;
    }
  }

  return typeof value === 'string' ? value : key;
};

// Initialize language from localStorage on client side
if (typeof window !== 'undefined') {
  getLanguage();
}
