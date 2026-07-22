const STORAGE_KEY = 'dariuni_universities';

const baseUniversities = [
  { id: 'u1', name: 'Université de Tunis', city: 'Tunis' },
  { id: 'u2', name: 'Université de Tunis El Manar', city: 'Tunis' },
  { id: 'u3', name: 'Université de Carthage', city: 'Tunis' },
  { id: 'u4', name: 'Université de la Manouba', city: 'Manouba' },
  { id: 'u5', name: 'Université de Sousse', city: 'Sousse' },
  { id: 'u6', name: 'Université de Sfax', city: 'Sfax' },
  { id: 'u7', name: 'Université de Monastir', city: 'Monastir' },
  { id: 'u8', name: 'Université de Gabès', city: 'Gabès' },
  { id: 'u9', name: 'INSAT', city: 'Tunis' },
  { id: 'u10', name: 'ENIT', city: 'Tunis' },
  { id: 'u11', name: 'ESPRIT', city: 'Ariana' },
  { id: 'u12', name: 'Faculté de Droit', city: 'Ariana' },
  { id: 'u13', name: 'Faculté des sciences de Bizerte', city: 'Bizerte' }
];

const notify = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dariuni:data-updated', { detail: { key: 'universities' } }));
  }
};

const loadUniversities = () => {
  if (typeof window === 'undefined') {
    return baseUniversities;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : baseUniversities;
  } catch {
    return baseUniversities;
  }
};

export const universities = loadUniversities();

export function saveUniversities(nextUniversities) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUniversities));
  }

  universities.splice(0, universities.length, ...nextUniversities);
  notify();
}

export function getUniversities() {
  return loadUniversities();
}
