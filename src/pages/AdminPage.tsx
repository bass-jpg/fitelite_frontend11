import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import AdminOverview from './admin/AdminOverview';
import AdminUsers from './admin/AdminUsers';
import AdminProducts from './admin/AdminProducts';
import AdminPrograms from './admin/AdminPrograms';
import AdminNutrition from './admin/AdminNutrition';
import AdminGamification from './admin/AdminGamification';
import AdminNotifications from './admin/AdminNotifications';
import AdminStats from './admin/AdminStats';

const pageTitles: Record<string, string> = {
  '/admin': "Vue d'ensemble",
  '/admin/users': 'Utilisateurs',
  '/admin/products': 'Boutique',
  '/admin/programs': 'Programmes',
  '/admin/nutrition': 'Nutrition',
  '/admin/gamification': 'Gamification',
  '/admin/notifications': 'Notifications',
  '/admin/stats': 'Statistiques',
};

const AdminPage: React.FC = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? 'Administration';

  return (
    <AdminLayout title={title}>
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="programs" element={<AdminPrograms />} />
        <Route path="nutrition" element={<AdminNutrition />} />
        <Route path="gamification" element={<AdminGamification />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="stats" element={<AdminStats />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminPage;
