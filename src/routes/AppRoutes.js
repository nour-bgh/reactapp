import { Navigate, Route, Routes } from 'react-router-dom';
import FrontLayout from '../layouts/FrontLayout';
import AdminLayout from '../layouts/AdminLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Listings from '../pages/Listings';
import ListingDetail from '../pages/ListingDetail';
import Compatibility from '../pages/Compatibility';
import MyListings from '../pages/MyListings';
import Profile from '../pages/Profile';
import PublicOwnerProfile from '../pages/PublicOwnerProfile';
import Favorites from '../pages/Favorites';
import SavedListings from '../pages/SavedListings';
import Messages from '../pages/Messages';
import Conversation from '../pages/Conversation';
import Notifications from '../pages/Notifications';
import AdminDashboard from '../pages/AdminDashboard';
import AdminUsers from '../pages/AdminUsers';
import AdminListings from '../pages/AdminListings';
import AdminUniversities from '../pages/AdminUniversities';
import AdminReviews from '../pages/AdminReviews';
import ProtectedRoute from './ProtectedRoute';
import About from '../pages/About';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<FrontLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="logements" element={<Listings />} />
        <Route path="logements/:id" element={<ListingDetail />} />
        <Route path="compatibilite" element={<ProtectedRoute allowedRoles={['student', 'owner']}><Compatibility /></ProtectedRoute>} />
        <Route path="mes-annonces" element={<ProtectedRoute allowedRoles={['owner']}><MyListings /></ProtectedRoute>} />
        <Route path="profil" element={<ProtectedRoute allowedRoles={['student', 'owner', 'admin']}><Profile /></ProtectedRoute>} />
        <Route path="utilisateurs/:id" element={<ProtectedRoute allowedRoles={['student', 'owner']}><PublicOwnerProfile /></ProtectedRoute>} />
        <Route path="favoris" element={<ProtectedRoute allowedRoles={['student', 'owner']}><Favorites /></ProtectedRoute>} />
        <Route path="enregistres" element={<ProtectedRoute allowedRoles={['student', 'owner']}><SavedListings /></ProtectedRoute>} />
        <Route path="messages" element={<ProtectedRoute allowedRoles={['student', 'owner']}><Messages /></ProtectedRoute>} />
        <Route path="messages/:userId" element={<ProtectedRoute allowedRoles={['student', 'owner']}><Conversation /></ProtectedRoute>} />
        <Route path="notifications" element={<ProtectedRoute allowedRoles={['student', 'owner']}><Notifications /></ProtectedRoute>} />
        <Route path="a-propos" element={<About />} />
      </Route>
      <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="utilisateurs" element={<AdminUsers />} />
        <Route path="logements" element={<AdminListings />} />
        <Route path="universites" element={<AdminUniversities />} />
        <Route path="avis" element={<AdminReviews />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}