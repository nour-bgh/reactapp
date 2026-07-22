import { Navigate } from 'react-router-dom';

export default function AdminReservations() {
  return <Navigate to="/admin" replace state={{ message: 'Accès refusé : la gestion des réservations n’est pas accessible au BackOffice.' }} />;
}


