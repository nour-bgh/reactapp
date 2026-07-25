import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

const ReservationsContext = createContext(null);

const STORAGE_KEY = 'dariuni_reservations';

const loadReservations = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export function ReservationsProvider({ children }) {
  const { user } = useAuth();
  const [reservations, setReservations] = useState(loadReservations);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
  }, [reservations]);

  const createReservation = useCallback(
    listing => {
      if (!user || user.role !== 'student') return;
      const newReservation = {
        id: `res-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        listingId: listing.id,
        listingTitle: listing.title,
        listingPhoto: listing.photos?.[0] || '',
        studentId: user.id,
        ownerId: listing.ownerId,
        status: 'en attente',
        createdAt: new Date().toISOString(),
        reservationDeadline: listing.regles?.reservationDeadline || null,
        ownerRead: false,
        studentRead: true,
      };
      setReservations(current => [...current, newReservation]);
    },
    [user]
  );

  const respondReservation = useCallback((id, decision) => {
    setReservations(current =>
      current.map(res =>
        res.id === id ? { ...res, status: decision, studentRead: false, ownerRead: true } : res
      )
    );
  }, []);

  const markOwnerRead = useCallback(id => {
    setReservations(current => current.map(res => (res.id === id ? { ...res, ownerRead: true } : res)));
  }, []);

  const markStudentRead = useCallback(id => {
    setReservations(current => current.map(res => (res.id === id ? { ...res, studentRead: true } : res)));
  }, []);

  const getOwnerReservations = useCallback(() => {
    if (!user) return [];
    return reservations
      .filter(res => res.ownerId === user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [reservations, user]);

  const getStudentReservations = useCallback(() => {
    if (!user) return [];
    return reservations
      .filter(res => res.studentId === user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [reservations, user]);

  const hasActiveReservation = useCallback(
    listingId => {
      if (!user) return false;
      return reservations.some(
        res => res.listingId === listingId && res.studentId === user.id && res.status !== 'refusée'
      );
    },
    [reservations, user]
  );

  const unreadTotal = useMemo(() => {
    if (!user) return 0;
    if (user.role === 'owner') {
      return reservations.filter(res => res.ownerId === user.id && !res.ownerRead).length;
    }
    if (user.role === 'student') {
      return reservations.filter(res => res.studentId === user.id && !res.studentRead).length;
    }
    return 0;
  }, [reservations, user]);

  const value = useMemo(
    () => ({
      createReservation,
      respondReservation,
      markOwnerRead,
      markStudentRead,
      getOwnerReservations,
      getStudentReservations,
      hasActiveReservation,
      unreadTotal,
    }),
    [
      createReservation,
      respondReservation,
      markOwnerRead,
      markStudentRead,
      getOwnerReservations,
      getStudentReservations,
      hasActiveReservation,
      unreadTotal,
    ]
  );

  return <ReservationsContext.Provider value={value}>{children}</ReservationsContext.Provider>;
}

export function useReservations() {
  return useContext(ReservationsContext);
}