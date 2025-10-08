#!/bin/bash

# Script pour lancer n8n avec l'environnement système (ancien)
# Usage: ./start-n8n-legacy.sh

echo "Démarrage de n8n avec l'ancien environnement..."

# Se placer dans le bon dossier
cd "$(dirname "$0")"

# Charger les variables d'environnement
if [ -f .env ]; then
    echo "Chargement des variables d'environnement..."
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Fichier .env non trouvé, utilisation des valeurs par défaut"
fi

# Variables supplémentaires pour éviter les warnings
export DB_SQLITE_POOL_SIZE=5
export N8N_RUNNERS_ENABLED=true
export N8N_BLOCK_ENV_ACCESS_IN_NODE=false

# NE PAS définir N8N_USER_FOLDER pour utiliser l'environnement système (~/.n8n)
echo "Utilisation de l'environnement n8n système (~/.n8n)"

# Option 1: Essayer sans clé de chiffrement (laisse n8n utiliser celle existante)
echo "Option: Utilisation de la clé existante du système"
unset N8N_ENCRYPTION_KEY

echo "Email Gmail: $GMAIL_EMAIL"
echo "Lancement de n8n..."

# Lancer n8n
n8n