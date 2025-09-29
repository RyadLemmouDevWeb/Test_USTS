#!/bin/bash

# Script pour lancer n8n avec la bonne configuration
# Usage: ./start-n8n.sh

echo "🚀 Démarrage de n8n avec configuration..."

# Se placer dans le bon dossier
cd "$(dirname "$0")"

# Charger les variables d'environnement
if [ -f .env ]; then
    echo "📋 Chargement des variables d'environnement..."
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️  Fichier .env non trouvé, utilisation des valeurs par défaut"
fi

# Variables supplémentaires pour éviter les warnings
export DB_SQLITE_POOL_SIZE=5
export N8N_RUNNERS_ENABLED=true
export N8N_BLOCK_ENV_ACCESS_IN_NODE=false

echo "🔑 Clé de chiffrement: ${N8N_ENCRYPTION_KEY:0:16}..."
echo "📧 Email Gmail: $GMAIL_EMAIL"

# Créer le dossier de données local s'il n'existe pas
mkdir -p ./data

# Définir le dossier de données n8n local
export N8N_USER_FOLDER="$(pwd)/data"

echo "📂 Dossier de données n8n: $N8N_USER_FOLDER"

# Lancer n8n
echo "🎯 Lancement de n8n..."
n8n
