#!/bin/bash

# Script de setup SSL pour développement local
# Génère des certificats auto-signés pour HTTPS

set -e

CERT_DIR="./docker/ssl"
CERT_NAME="devops-hub"
DAYS=365

echo "🔐 Génération des certificats SSL auto-signés..."

# Créer le répertoire s'il n'existe pas
mkdir -p "$CERT_DIR"

# Générer la clé privée et le certificat
openssl req -x509 -newkey rsa:2048 -keyout "$CERT_DIR/$CERT_NAME.key" \
    -out "$CERT_DIR/$CERT_NAME.crt" -days $DAYS -nodes \
    -subj "/C=FR/ST=France/L=Paris/O=DevOps/CN=localhost"

echo "✅ Certificats générés avec succès!"
echo "📁 Location: $CERT_DIR/"
echo "🔑 Clé privée: $CERT_DIR/$CERT_NAME.key"
echo "📜 Certificat: $CERT_DIR/$CERT_NAME.crt"
echo ""
echo "⚠️  ATTENTION: Les certificats sont auto-signés (DÉVELOPPEMENT SEULEMENT)"
echo "   Pour la production, utilisez Let's Encrypt ou une CA validée."
