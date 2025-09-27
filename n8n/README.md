# Configuration n8n

Ce dossier contient tous les éléments nécessaires pour la partie automatisation avec n8n.

## Structure

- `workflows/` : Export des workflows n8n (.json)
- `docker-compose.yml` : Configuration pour lancer n8n en local
- `data/` : Données générées (mails-today.json)
- `README.md` : Documentation spécifique à n8n

## Démarrage rapide

1. Installer Docker et Docker Compose
2. Lancer n8n : `docker-compose up -d`
3. Accéder à l'interface : http://localhost:5678
4. Importer les workflows depuis le dossier `workflows/`

## Workflows à créer

### 1. Email Fetcher (`email-fetcher.json`)
- **Trigger** : Cron (toutes les heures ou manuel)
- **Nœuds** :
  - Gmail → Trigger (Get Emails)
  - Filter (emails du jour uniquement)
  - Transform (extraire les champs requis)
  - Write Binary File (sauvegarder en JSON)

### 2. AI Summary Generator (`ai-summary.json`)
- **Trigger** : Webhook ou File Watcher
- **Nœuds** :
  - Read Binary File (lire mails-today.json)
  - OpenAI/Groq API (générer résumé)
  - Transform (structurer la réponse)
  - HTTP Response

### 3. Email Reply Handler (`email-reply.json`)
- **Trigger** : Webhook POST
- **Nœuds** :
  - Webhook (recevoir données frontend)
  - Conditional (manuel vs auto)
  - OpenAI/Groq API (si réponse auto)
  - Gmail → Send Email
  - HTTP Response

## Variables d'environnement

Créer un fichier `.env` dans ce dossier avec :

```env
GMAIL_EMAIL=votre-email@gmail.com
GMAIL_PASSWORD=mot-de-passe-application
OPENAI_API_KEY=votre-cle-openai
GROQ_API_KEY=votre-cle-groq
```

## Endpoints API exposés

- `GET /webhook/get-emails` : Récupérer les emails du jour
- `GET /webhook/get-summary` : Obtenir le résumé IA
- `POST /webhook/send-reply` : Envoyer une réponse manuelle
- `POST /webhook/send-auto-reply` : Envoyer une réponse automatique
- `POST /webhook/generate-reply` : Générer une réponse sans l'envoyer