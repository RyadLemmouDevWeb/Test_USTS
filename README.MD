# Test Technique USTS – Développement Web & Automatisation avec n8n

## Sommaire
- [Contexte](#contexte)
- [Architecture du projet](#architecture-du-projet)
- [Installation & Lancement](#installation--lancement)
- [Fonctionnalités](#fonctionnalités)
- [Schéma d’architecture](#schéma-darchitecture)
- [Difficultés rencontrées & solutions](#difficultés-rencontrées--solutions)
- [Résultats obtenus & limites](#résultats-obtenus--limites)
- [Structure du dépôt](#structure-du-dépôt)
- [Annexes](#annexes)

---

## Contexte

Ce projet vise à démontrer la capacité à développer une interface web moderne et responsive pour la gestion des e-mails, couplée à l’automatisation de processus avec n8n (récupération, résumé, réponse IA…).

---

## Architecture du projet

- **Frontend** : React + Tailwind CSS
- **Backend/Automatisation** : n8n (self-hosted, Docker ou local)
- **Stockage temporaire** : Fichier JSON local pour les e-mails du jour
- **Intégration IA** : Appel à l’API Groq (Llama 3) via n8n pour la génération de réponses et de résumés

---

## Installation & Lancement

### Prérequis

- Node.js (>= 18)
- npm ou yarn
- Docker (optionnel, recommandé pour n8n)
- Compte Gmail de test

### 1. Cloner le dépôt

```bash
git clone https://github.com/<ton-user>/<ton-repo>.git
cd <ton-repo>
```

### 2. Variables d'environnement
- Copie le fichier `.env.example` en `.env` à la racine et dans `n8n/`
- Renseigne :
  - `VITE_USER_EMAIL` (ton email Gmail de test)
  - `VITE_N8N_URL` (ex: http://localhost:5678)
  - `GROQ_API_KEY` (clé API Groq)
  - `GMAIL_EMAIL`, `GMAIL_APP_PASSWORD` (dans `n8n/.env`)
- **Ne jamais commiter les .env !**

### 3. Lancement du frontend
```bash
npm install
npm run dev
```

### 4. Lancement de n8n
- Avec Docker :
  ```bash
  cd n8n
  docker-compose up
  ```
- Ou avec le script :
  ```bash
  ./start-n8n.sh
  ```

### 5. Import des workflows n8n
- Ouvre n8n (http://localhost:5678)
- Menu “Workflows” > “Importer” > Sélectionne les fichiers `.json` du dossier `n8n/workflows/`

---

## Schéma d’architecture

```
+-------------------+         +-------------------+         +-------------------+
|   Interface Web   | <-----> |      n8n API      | <-----> |     Gmail API     |
|  (React + Vite)   |         | (webhooks, flows) |         |   (lecture/envoi) |
+-------------------+         +-------------------+         +-------------------+
        |                             |                              |
        |                             |                              |
        |                             v                              |
        |                  +-------------------+                    |
        |                  |   IA (Groq API)   | <------------------+
        |                  +-------------------+
```

---

## Sécurité
- **Aucun identifiant ou mot de passe ne doit être commité**
- Les fichiers `.env` sont dans le `.gitignore`
- Les scripts bash utilisent uniquement les variables d’environnement

---

## Exemple de test utilisateur
1. Lancer le front et n8n
2. Se connecter à l’interface web
3. Vérifier l’affichage des e-mails du jour
4. Générer un résumé IA
5. Répondre à un e-mail (manuel et IA)
6. Vérifier la réception dans la boîte Gmail

---

## Liens utiles
- [Documentation n8n](https://docs.n8n.io/)
- [Documentation Groq](https://console.groq.com/docs)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## Collaborateurs
- lilgar77
- Holo795

---

*Pour toute question, ouvrir une issue sur le dépôt GitHub.*