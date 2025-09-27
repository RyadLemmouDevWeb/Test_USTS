# 📧 Email Management System avec n8n

Projet de test technique combinant développement web moderne et automatisation intelligente avec n8n.

## 🎯 Objectifs du projet

- ✅ **Interface web responsive** pour consulter les emails reçus dans la journée
- 🔄 **Workflow n8n automatisé** pour récupération, traitement et résumé des emails
- 🤖 **Réponses intelligentes** : manuelles ou générées par IA
- 📊 **Résumé global** des communications quotidiennes

## 🏗️ Architecture

```
├── Frontend (React + Vite)
│   ├── Interface utilisateur moderne
│   ├── Gestion d'état avec Context API
│   └── Communication avec n8n via API
│
├── Backend (n8n Self-hosted)
│   ├── Récupération emails Gmail
│   ├── Traitement et sauvegarde JSON
│   ├── Génération résumés IA
│   └── Envoi de réponses automatisées
│
└── Intégration
    ├── Webhooks n8n ↔ Frontend
    ├── API Gmail pour emails
    └── IA (Groq/OpenAI) pour résumés
```

## 🚀 Installation et démarrage

### Prérequis
- Node.js 18+
- Docker & Docker Compose
- Compte Gmail avec mot de passe d'application
- Clé API Groq (gratuite) ou OpenAI

### 1. Frontend (Interface Web)

```bash
# Installation des dépendances
npm install

# Configuration
cp .env.example .env
# Éditer .env avec vos URLs

# Démarrage en développement
npm run dev
```

### 2. Backend (n8n)

```bash
# Aller dans le dossier n8n
cd n8n

# Configuration
cp .env.example .env
# Éditer .env avec vos credentials

# Lancer n8n avec Docker
docker-compose up -d

# Accéder à l'interface n8n
# URL: http://localhost:5678
# User: admin / Pass: admin123
```

### 3. Configuration Gmail

1. Aller dans votre compte Google
2. Activer l'authentification 2FA
3. Générer un mot de passe d'application
4. Utiliser ce mot de passe dans n8n

## 🔧 Fonctionnalités

### Interface Web
- 📱 **Responsive Design** - Compatible desktop/mobile
- 🌙 **Mode sombre/clair** - Préférence sauvegardée
- 🔍 **Recherche et filtres** - Par expéditeur, objet, priorité
- 📊 **Dashboard** - Statistiques temps réel
- ✉️ **Réponses avancées** - Manuel + IA automatique

### Automatisation n8n
- 📬 **Sync Gmail** - Récupération emails du jour
- 💾 **Sauvegarde JSON** - Stockage local structuré
- 🧠 **Résumé IA** - Vue d'ensemble intelligente
- 🚀 **API RESTful** - Endpoints pour le frontend

### Intégration IA
- **Résumés automatiques** - Points clés + actions urgentes
- **Génération de réponses** - Contextuelle et personnalisable
- **Support multi-modèles** - Groq (gratuit) ou OpenAI

## 📂 Structure du projet

```
├── src/
│   ├── components/
│   │   ├── EmailManagement.jsx    # Composant principal
│   │   ├── AIEmailSummary.jsx     # Résumé IA
│   │   ├── EmailReplyForm.jsx     # Formulaire réponses
│   │   └── ui/                    # Composants UI réutilisables
│   ├── services/
│   │   └── emailService.js        # API client n8n
│   ├── contexts/
│   │   └── ThemeContext.jsx       # Gestion thème
│   └── data/
│       └── mock.js                # Données de développement
├── n8n/
│   ├── workflows/                 # Exports workflows n8n
│   ├── data/                      # Fichiers JSON générés
│   ├── docker-compose.yml         # Configuration Docker
│   └── README.md                  # Documentation n8n
└── docs/
    └── RAPPORT.md                 # Rapport technique détaillé
```

## 🔄 Workflows n8n

### 1. Email Fetcher
- **Déclencheur** : Cron ou manuel
- **Actions** : Gmail → Filter → Transform → Save JSON

### 2. AI Summary Generator  
- **Déclencheur** : Webhook GET
- **Actions** : Read JSON → IA Processing → Response

### 3. Email Reply Handler
- **Déclencheur** : Webhook POST
- **Actions** : Validate → IA (si auto) → Gmail Send

## 🔧 Configuration avancée

### Variables d'environnement

#### Frontend (.env)
```env
VITE_N8N_URL=http://localhost:5678
VITE_BACKEND_URL=http://localhost:5000
```

#### n8n (.env)
```env
GMAIL_EMAIL=test@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
GROQ_API_KEY=gsk_...
```

### Endpoints API

- `GET /webhook/get-emails` - Liste emails du jour
- `GET /webhook/get-summary` - Résumé IA global
- `POST /webhook/send-reply` - Réponse manuelle
- `POST /webhook/send-auto-reply` - Réponse IA automatique
- `POST /webhook/generate-reply` - Génération réponse (sans envoi)

## 🎨 Stack technique

### Frontend
- **React 19** - Interface utilisateur moderne
- **Vite** - Build tool rapide et moderne  
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Icônes cohérentes
- **React Router** - Navigation (préparé pour évolution)

### Backend  
- **n8n** - Plateforme d'automatisation no-code
- **Docker** - Conteneurisation et déploiement
- **Gmail API** - Intégration email native
- **Groq/OpenAI** - Intelligence artificielle

## 📊 Métriques et monitoring

- **Emails traités** - Compteur temps réel
- **Taux de réponse** - Statistiques d'engagement  
- **Performance IA** - Temps de génération
- **Erreurs** - Logging et gestion d'erreurs

## 🔒 Sécurité et bonnes pratiques

- ✅ Variables d'environnement pour credentials
- ✅ Validation des données côté client/serveur
- ✅ Gestion d'erreurs robuste
- ✅ Rate limiting (préparé)
- ✅ Logs structurés

## 📋 TODO / Améliorations futures

- [ ] Tests unitaires et e2e (Jest + Cypress)
- [ ] Authentification utilisateur (OAuth)
- [ ] Base de données persistante (PostgreSQL)
- [ ] Notifications push temps réel
- [ ] Analytics avancées (tracking interactions)
- [ ] Support multi-comptes email
- [ ] Template de réponses personnalisés
- [ ] Intégration calendrier (planification)

## 👥 Contributeurs

Développé par **Ryad** dans le cadre du test technique USTS.

---

## 📚 Documentation complémentaire

- [Rapport technique détaillé](./docs/RAPPORT.md)
- [Configuration n8n](./n8n/README.md)
- [Guide de déploiement](./docs/DEPLOYMENT.md)
