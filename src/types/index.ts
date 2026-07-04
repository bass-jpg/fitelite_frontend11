export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  avatar?: string;
  gender?: 'homme' | 'femme' | 'autre';
  age?: number;
  weight?: number;
  targetWeight?: number;
  height?: number;
  goal: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  role?: 'user' | 'coach' | 'admin';
  joinDate: string;
  streak?: number;
  totalSessions?: number;
  totalPoints?: number;
  badges?: string[];
  notifEmail?: boolean;
  notifPush?: boolean;
  notifReminder?: boolean;
  notifWeekly?: boolean;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  sessionsPerWeek: number;
  image: string;
  coach: Coach;
  exercises: Exercise[];
  videoUrl?: string;
  estimatedMinutes?: number;
  enrolledCount?: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  muscle: string;
  completed?: boolean;
  duration?: string;
  videoUrl?: string;
}

export interface Coach {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  clients: number;
  image: string;
  bio: string;
  certifications: string[];
  location?: { lat: number; lng: number; address: string };
}

export interface WorkoutSession {
  id: string;
  date: string;
  programName: string;
  duration: number;
  calories: number;
  exercises: number;
  completed: boolean;
}

export interface ProgressData {
  week: string;
  sessions: number;
  calories: number;
  duration: number;
  weight?: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, goal?: string, level?: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

export interface Meal {
  id: string;
  name: string;
  category: 'petit-dejeuner' | 'dejeuner' | 'diner' | 'collation';
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  image: string;
  description: string;
  portions: MealPortion[];
  tags: string[];
}

export interface MealPortion {
  size: 'petite' | 'normale' | 'grande';
  label: string;
  multiplier: number;
}

export interface DailyMenu {
  goal: 'perte-de-poids' | 'prise-de-masse' | 'maintenance';
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  totalCalories: number;
  totalProteins: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'vetements' | 'accessoires' | 'complements';
  inStock: boolean;
  rating: number;
  reviews: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BadgeItem {
  id: string;
  icon: string;
  label: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  icon: string;
  userChallengeId?: string;
  challengeDate?: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  sessions: number;
  challenges?: number;
  streak: number;
  points: number;
  isCurrentUser?: boolean;
}

export interface AppNotification {
  id: string;
  type: 'training' | 'meal' | 'motivation' | 'badge' | 'challenge' | 'order' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
}

export interface GymLocation {
  id: string;
  name: string;
  type: 'salle' | 'coach';
  address: string;
  city: string;
  lat: number;
  lng: number;
  rating: number;
  phone?: string;
  hours?: string;
  specialties?: string[];
  image?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
