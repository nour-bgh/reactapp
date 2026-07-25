import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

const getStorageKey = (userId) => `dariuni_favorites_${userId}`;

const loadData = (userId) => {
  if (!userId) return { favorites: [], saved: [] };
  try {
    const raw = window.localStorage.getItem(getStorageKey(userId));
    return raw ? JSON.parse(raw) : { favorites: [], saved: [] };
  } catch {
    return { favorites: [], saved: [] };
  }
};

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [data, setData] = useState({ favorites: [], saved: [] });

  useEffect(() => {
    setData(loadData(user?.id));
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      window.localStorage.setItem(getStorageKey(user.id), JSON.stringify(data));
    }
  }, [data, user?.id]);

  const toggleFavorite = (listingId) => {
    setData(current => ({
      ...current,
      favorites: current.favorites.includes(listingId)
        ? current.favorites.filter(id => id !== listingId)
        : [...current.favorites, listingId],
    }));
  };

  const toggleSaved = (listingId) => {
    setData(current => ({
      ...current,
      saved: current.saved.includes(listingId)
        ? current.saved.filter(id => id !== listingId)
        : [...current.saved, listingId],
    }));
  };

  const isFavorite = useCallback(
    (listingId) => data.favorites.includes(listingId),
    [data.favorites]
  );

  const isSaved = useCallback(
    (listingId) => data.saved.includes(listingId),
    [data.saved]
  );

  const value = useMemo(
    () => ({
      favorites: data.favorites,
      saved: data.saved,
      toggleFavorite,
      toggleSaved,
      isFavorite,
      isSaved,
    }),
    [data, isFavorite, isSaved]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  return useContext(FavoritesContext);
}