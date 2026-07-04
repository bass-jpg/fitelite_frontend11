// ============================================================
//  mockData.ts — Données de secours (fallback)
//  Ces données sont utilisées uniquement si l'API est
//  indisponible. En production, tout passe par l'API REST.
// ============================================================

import { Coach, GymLocation, AppNotification } from '../types';

// Seul les emplacements de salles/coaches restent en mock
// (pas de module backend dédié pour les salles)
export const mockGyms: GymLocation[] = [
  { id: 'g1', name: 'FitZone Almadies', type: 'salle', address: 'Route des Almadies', city: 'Dakar', lat: 14.7461, lng: -17.5207, rating: 4.8, phone: '+221 77 123 45 67', hours: '6h-23h' },
  { id: 'g2', name: 'PowerGym Plateau', type: 'salle', address: 'Avenue Léopold Sédar Senghor', city: 'Dakar', lat: 14.6937, lng: -17.4441, rating: 4.5, phone: '+221 33 456 78 90', hours: '7h-22h' },
  { id: 'g3', name: 'CrossFit Dakar', type: 'salle', address: 'Mermoz, Dakar', city: 'Dakar', lat: 14.7291, lng: -17.459, rating: 4.7, phone: '+221 77 987 65 43', hours: '6h-21h' },
  { id: 'g4', name: 'Coach Marcus Diallo', type: 'coach', address: 'Point E, Dakar', city: 'Dakar', lat: 14.6981, lng: -17.4335, rating: 4.9, specialties: ['Powerlifting', 'Force'] },
  { id: 'g5', name: 'Coach Amara Sow', type: 'coach', address: 'Liberté 6, Dakar', city: 'Dakar', lat: 14.7167, lng: -17.4677, rating: 4.8, specialties: ['Cardio', 'Course à pied'] },
  { id: 'g6', name: 'Salle Sport Parcelles', type: 'salle', address: 'Parcelles Assainies', city: 'Dakar', lat: 14.7820, lng: -17.4150, rating: 4.2, phone: '+221 77 111 22 33', hours: '7h-21h' },
];

// Fallback data for Landing Page (public, no auth required)
export const mockPrograms = [
  { id: '1', name: 'Force Maximale', description: 'Programme de 12 semaines pour développer une force explosive.', duration: '12 semaines', level: 'Avancé', category: 'Force', sessionsPerWeek: 4, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', coach: { id: '1', name: 'Marcus Diallo', specialty: 'Force', experience: '8 ans', rating: 4.9, clients: 142, image: '', bio: '', certifications: [] }, exercises: [], estimatedMinutes: 75 },
  { id: '2', name: 'Cardio Endurance Pro', description: 'Améliorez votre VO2max et votre endurance en 8 semaines.', duration: '8 semaines', level: 'Intermédiaire', category: 'Cardio', sessionsPerWeek: 5, image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80', coach: { id: '2', name: 'Amara Sow', specialty: 'Cardio', experience: '6 ans', rating: 4.8, clients: 98, image: '', bio: '', certifications: [] }, exercises: [], estimatedMinutes: 45 },
  { id: '3', name: 'HIIT Brûle-Graisses', description: 'Séances intenses de 30 minutes pour brûler un maximum de calories.', duration: '6 semaines', level: 'Débutant', category: 'Perte de poids', sessionsPerWeek: 3, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80', coach: { id: '3', name: 'Léa Fontaine', specialty: 'HIIT', experience: '5 ans', rating: 4.9, clients: 215, image: '', bio: '', certifications: [] }, exercises: [], estimatedMinutes: 30 },
];

export const mockCoaches = [
  { id: '1', name: 'Marcus Diallo', specialty: 'Force & Powerlifting', experience: '8 ans', rating: 4.9, clients: 142, image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&q=80', bio: 'Champion national de powerlifting.', certifications: ['NSCA-CSCS', 'CrossFit L2'] },
  { id: '2', name: 'Amara Sow', specialty: 'Cardio & Endurance', experience: '6 ans', rating: 4.8, clients: 98, image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&q=80', bio: 'Ancienne marathonienne professionnelle.', certifications: ['IAAF Level 2', 'FFA Coaching'] },
  { id: '3', name: 'Léa Fontaine', specialty: 'HIIT & Functional', experience: '5 ans', rating: 4.9, clients: 215, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80', bio: 'Passionnée de fitness fonctionnel.', certifications: ['ACE Certified', 'TRX Instructor'] },
];
