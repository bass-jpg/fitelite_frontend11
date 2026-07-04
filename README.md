# 🏋️ FitTrack Frontend

Application React/Vite connectée à l'API REST NestJS.

## ⚡ Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'URL de l'API
cp .env.example .env
# (le fichier .env est déjà configuré pour localhost:3000)

# 3. Lancer l'application
npm run dev
```

L'application sera disponible sur **http://localhost:5173**

## 🔗 Connexion au Backend

Assurez-vous que le backend NestJS tourne sur `http://localhost:3000` avant de démarrer le frontend.

```bash
# Dans le dossier fittrack-backend :
npm run start:dev
```

## 🔐 Comptes de test

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| `aminata@fittrack.com` | `fittrack2024` | USER |
| `admin@fittrack.com` | `fittrack2024` | ADMIN |
| `marcus@fittrack.com` | `fittrack2024` | COACH |

> Ces comptes sont créés par le seeder : `npm run seed` (dans le dossier backend)

## 📁 Architecture

```
src/
├── services/
│   └── api.ts              ← Tous les appels HTTP vers le backend
├── context/
│   ├── AuthContext.tsx     ← Auth JWT (login/register/logout)
│   ├── NotifContext.tsx    ← Notifications temps réel
│   └── CartContext.tsx     ← Panier boutique
├── components/
│   └── dashboard/
│       ├── DashboardHome.tsx       ← Stats + météo + défis
│       ├── DashboardProgram.tsx    ← Programmes + séances
│       ├── DashboardProgress.tsx   ← Graphiques de progression
│       ├── DashboardNutrition.tsx  ← Repas + menus
│       ├── DashboardShop.tsx       ← Boutique + commandes
│       ├── DashboardGamification.tsx ← Badges + classement
│       └── DashboardSettings.tsx   ← Profil + mot de passe
└── pages/
    ├── LoginPage.tsx       ← Connexion
    └── RegisterPage.tsx    ← Inscription (2 étapes)
```

## 🌍 Variables d'environnement

```env
VITE_API_URL=http://localhost:3000/api
```
