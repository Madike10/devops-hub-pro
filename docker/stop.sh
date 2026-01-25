#!/bin/bash

# 🛑 Script d'arrêt et nettoyage Docker
# Usage: ./docker/stop.sh [soft|hard]

set -e

CLEANUP_MODE=${1:-soft}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================="
echo "🛑 DevOps Hub Pro - Docker Shutdown"
echo "=========================================="
echo "Mode: $CLEANUP_MODE"
echo ""

case $CLEANUP_MODE in
    soft)
        echo "🔵 Arrêt gracieux des containers..."
        docker-compose -f "$SCRIPT_DIR/../docker-compose.yml" down
        echo "✅ Containers arrêtés (volumes conservés)"
        ;;
    hard)
        echo "🔴 Arrêt forcé et nettoyage complet..."
        docker-compose -f "$SCRIPT_DIR/../docker-compose.yml" down -v
        echo "✅ Tout supprimé (images, containers, volumes)"
        ;;
    *)
        echo "❌ Mode invalide: $CLEANUP_MODE"
        echo "Usage: $0 [soft|hard]"
        exit 1
        ;;
esac

echo ""
echo "=========================================="
echo "✅ Arrêt terminé!"
echo "=========================================="
