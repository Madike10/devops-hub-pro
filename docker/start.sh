#!/bin/bash

# 🚀 Script de démarrage complet pour DevOps Hub Pro
# Usage: ./docker/start.sh [dev|prod]

set -e

ENVIRONMENT=${1:-dev}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "=========================================="
echo "🚀 DevOps Hub Pro - Docker Startup"
echo "=========================================="
echo "Environment: $ENVIRONMENT"
echo "Project Root: $PROJECT_ROOT"
echo ""

# Vérifier la présence du .env
if [ ! -f "$PROJECT_ROOT/.env" ]; then
    echo "⚠️  Fichier .env non trouvé. Copie depuis .env.example..."
    cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/.env"
    echo "📝 Veuillez éditer .env avec vos paramètres!"
fi

# Générer les certificats SSL s'ils n'existent pas
if [ ! -d "$SCRIPT_DIR/ssl" ] || [ ! -f "$SCRIPT_DIR/ssl/devops-hub.crt" ]; then
    echo "🔐 Génération des certificats SSL..."
    bash "$SCRIPT_DIR/generate-ssl.sh"
fi

# Charger les variables d'environnement
export $(cat "$PROJECT_ROOT/.env" | grep -v '^#' | xargs)

case $ENVIRONMENT in
    dev)
        echo "📦 Démarrage en mode DÉVELOPPEMENT..."
        echo "   - Hot reload activé"
        echo "   - Logs verbose activés"
        docker-compose -f "$SCRIPT_DIR/../docker-compose.yml" up --build
        ;;
    prod)
        echo "📦 Démarrage en mode PRODUCTION..."
        echo "   - Optimisation maximale"
        echo "   - Restart policy: unless-stopped"
        docker-compose -f "$SCRIPT_DIR/../docker-compose.yml" up -d
        echo ""
        echo "✅ Services démarrés en arrière-plan!"
        echo "📊 Status: docker-compose ps"
        echo "📋 Logs: docker-compose logs -f"
        ;;
    *)
        echo "❌ Environnement invalide: $ENVIRONMENT"
        echo "Usage: $0 [dev|prod]"
        exit 1
        ;;
esac

echo ""
echo "=========================================="
echo "✅ Démarrage terminé!"
echo "=========================================="
echo ""
echo "📍 Accès à l'application:"
echo "   HTTP:  http://localhost:80"
echo "   HTTPS: https://localhost:443"
echo "   Direct: http://localhost:3000"
echo ""
echo "🛑 Pour arrêter: docker-compose down"
echo "📊 Pour les logs: docker-compose logs -f app"
