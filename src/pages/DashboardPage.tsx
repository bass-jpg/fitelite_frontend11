import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardHome from '../components/dashboard/DashboardHome';
import DashboardProgram from '../components/dashboard/DashboardProgram';
import DashboardProgress from '../components/dashboard/DashboardProgress';
import DashboardSettings from '../components/dashboard/DashboardSettings';
import DashboardNutrition from '../components/dashboard/DashboardNutrition';
import DashboardShop from '../components/dashboard/DashboardShop';
import DashboardGamification from '../components/dashboard/DashboardGamification';
import DashboardMap from '../components/dashboard/DashboardMap';
import CoachIA from '../components/CoachIA';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Tableau de bord',
  '/dashboard/programme': 'Mon Programme',
  '/dashboard/progression': 'Progression',
  '/dashboard/nutrition': 'Nutrition',
  '/dashboard/boutique': 'Boutique',
  '/dashboard/gamification': 'Défis & Badges',
  '/dashboard/carte': 'Carte',
  '/dashboard/parametres': 'Paramètres',
};

const DashboardPage: React.FC = () => {
  const path = window.location.pathname;
  const title = pageTitles[path] ?? 'Dashboard';

  return (
    <>
      <DashboardLayout title={title}>
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="programme" element={<DashboardProgram />} />
          <Route path="progression" element={<DashboardProgress />} />
          <Route path="nutrition" element={<DashboardNutrition />} />
          <Route path="boutique" element={<DashboardShop />} />
          <Route path="gamification" element={<DashboardGamification />} />
          <Route path="carte" element={<DashboardMap />} />
          <Route path="parametres" element={<DashboardSettings />} />
        </Routes>
      </DashboardLayout>
      <CoachIA />
    </>
  );
};

export default DashboardPage;
