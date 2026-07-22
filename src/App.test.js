import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';

function AuthProbe() {
  const { login, register, message } = useAuth();

  return (
    <div>
      <button onClick={() => login({ email: 'admin@dariuni.tn', password: 'Admin123!' })}>login-admin</button>
      <button onClick={() => register({ firstName: 'Test', lastName: 'Test', email: 'admin@dariuni.tn', password: 'Admin123!', role: 'admin' })}>register-admin</button>
      <div>{message?.text}</div>
    </div>
  );
}

test('redirects unauthenticated visitors to the login page when they open a listing detail', () => {
  render(
    <MemoryRouter initialEntries={['/logements/apt-1']}>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { name: /connexion/i })).toBeInTheDocument();
});

test('rejects admin registration and keeps admin access reserved to predefined credentials', () => {
  render(
    <AuthProvider>
      <AuthProbe />
    </AuthProvider>
  );

  fireEvent.click(screen.getByRole('button', { name: /register-admin/i }));

  expect(screen.getByText(/l'inscription d'un compte administrateur n'est pas autorisée/i)).toBeInTheDocument();
});

test('redirects unauthenticated visitors to the login page when they open a public owner profile', () => {
  render(
    <MemoryRouter initialEntries={['/utilisateurs/4']}>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { name: /connexion/i })).toBeInTheDocument();
});
