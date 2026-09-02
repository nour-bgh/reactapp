import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginUser, createUser } from '../assests/services/api.service.user';

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

  const login = async ({ email, password }) => {
    try {
      const response = await loginUser({ email, password });
      const foundUser = response.data.data;

      setUser(foundUser);
      setMessage({ type: 'success', text: `Bienvenue ${foundUser.name} !` });
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Identifiants invalides.';
      setMessage({ type: 'error', text: errorMsg });
      return false;
    }
  };

  const register = async payload => {
    if (payload?.role === 'admin') {
      setMessage({ type: 'error', text: "L'inscription d'un compte administrateur n'est pas autorisée. Utilisez les identifiants préconfigurés." });
      return false;
    }

    try {
      const response = await createUser(payload);
      const newUser = response.data.data;

      setUser(newUser);
      setMessage({ type: 'success', text: 'Inscription réussie, vous êtes connecté(e).' });
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Erreur lors de l'inscription.";
      setMessage({ type: 'error', text: errorMsg });
      return false;
    }
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