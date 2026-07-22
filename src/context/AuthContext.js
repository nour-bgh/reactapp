import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { users as mockUsers } from '../data/users';

const AuthContext = createContext(null);

const storedSession = () => {
  try {
    const raw = window.localStorage.getItem('dariuni_session');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storedSession());
  const [message, setMessage] = useState(null);

  useEffect(() => {
    window.localStorage.setItem('dariuni_session', JSON.stringify(user));
  }, [user]);

  const login = ({ email, password }) => {
    const found = mockUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      setMessage({ type: 'error', text: 'Identifiants invalides.' });
      return false;
    }
    setUser({ ...found, password: undefined });
    setMessage({ type: 'success', text: `Bienvenue ${found.firstName} !` });
    return true;
  };

  const register = payload => {
    if (payload?.role === 'admin') {
      setMessage({ type: 'error', text: "L'inscription d'un compte administrateur n'est pas autorisée. Utilisez les identifiants préconfigurés." });
      return false;
    }

    setUser({ ...payload, id: Date.now(), role: payload.role, password: payload.password });
    setMessage({ type: 'success', text: 'Inscription réussie, vous êtes connecté(e).' });
    return true;
  };

  const logout = () => {
    setUser(null);
    setMessage({ type: 'info', text: 'Déconnexion effectuée.' });
  };

  const updateProfile = updates => {
    setUser(current => current ? { ...current, ...updates } : null);
    setMessage({ type: 'success', text: 'Profil mis à jour.' });
  };

  const value = useMemo(
    () => ({ user, login, logout, register, updateProfile, message, setMessage }),
    [user, message]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
