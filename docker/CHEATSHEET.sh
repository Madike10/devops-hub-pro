#!/bin/bash

# 📋 Cheat Sheet Docker - Commandes Fréquentes
# Usage: Consulter ce fichier pour les commandes courantes

# ============================================
# 🚀 DÉMARRAGE & ARRÊT
# ============================================

# Démarrer en développement
docker-compose up

# Démarrer en arrière-plan
docker-compose up -d

# Rebuilder les images
docker-compose up --build

# Arrêter gracieusement
docker-compose down

# Arrêter et nettoyer (volumes inclus)
docker-compose down -v

# Redémarrer un service
docker-compose restart app

# ============================================
# 📊 MONITORING & LOGS
# ============================================

# Statut des services
docker-compose ps

# Logs de tous les services
docker-compose logs

# Logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f app
docker-compose logs -f nginx

# Dernières N lignes
docker-compose logs --tail=50

# Depuis N minutes
docker-compose logs --since 10m

# Avec timestamps
docker-compose logs -f --timestamps

# Statistiques CPU/RAM
docker stats

# ============================================
# 🔧 EXÉCUTION & INTERACTION
# ============================================

# Exécuter une commande
docker-compose exec app npm install
docker-compose exec app npm run build

# Accéder au shell
docker-compose exec app bash
docker-compose exec app sh

# Exécuter en background
docker-compose exec -d app npm run dev

# Avec utilisateur spécifique
docker-compose exec -u nodejs app ls

# ============================================
# 📁 VOLUMES & DONNÉES
# ============================================

# Lister les volumes
docker volume ls

# Inspecter un volume
docker volume inspect devops-hub-pro_app-cache

# Nettoyer les volumes orphans
docker volume prune

# Copier depuis un container
docker cp devops-hub-app:/app/dist ./

# Copier vers un container
docker cp ./file.txt devops-hub-app:/app/

# ============================================
# 🔐 IMAGES & REGISTRIES
# ============================================

# Lister les images
docker images

# Supprimer une image
docker rmi devops-hub:latest

# Taguer une image
docker tag devops-hub:latest myregistry/devops-hub:1.0

# Pusher au registry
docker push myregistry/devops-hub:1.0

# Puller du registry
docker pull myregistry/devops-hub:1.0

# Inspecter une image
docker image inspect devops-hub:latest

# ============================================
# 🐛 DEBUGGING
# ============================================

# Voir la configuration complète
docker-compose config

# Valider la syntaxe
docker-compose config --quiet && echo "✅ Valid"

# Inspecter un container
docker inspect devops-hub-app

# Voir les processus du container
docker top devops-hub-app

# Événements en temps réel
docker-compose events

# Sortir les différences (base vs current)
docker diff devops-hub-app

# ============================================
# 🧹 NETTOYAGE
# ============================================

# Nettoyer les containers arrêtés
docker container prune

# Nettoyer les images non-tagées
docker image prune

# Nettoyer les volumes orphans
docker volume prune

# Nettoyer les réseaux non-utilisés
docker network prune

# NETTOYAGE COMPLET (⚠️ irréversible!)
docker system prune -a --volumes

# ============================================
# 🌐 NETWORK & CONNECTIVITÉ
# ============================================

# Lister les réseaux
docker network ls

# Inspecter un réseau
docker network inspect devops-hub-pro_devops-hub-network

# Connecter un container à un réseau
docker network connect network_name container_name

# Tester la connectivité
docker-compose exec app ping nginx

# DNS interne (résolution)
docker-compose exec app nslookup nginx

# ============================================
# 📦 DOCKER COMPOSE AVANCÉ
# ============================================

# Définir des variables d'environnement
export NODE_ENV=production
docker-compose up

# Avec .env custom
docker-compose --env-file .env.prod up

# Avec override file
docker-compose -f docker-compose.yml \
               -f docker-compose.prod.yml up

# Voir les services
docker-compose config --services

# Dépendances des services
docker-compose config --resolve-image-digests

# ============================================
# 🔄 TROUBLESHOOTING
# ============================================

# Reconstruire sans cache
docker-compose build --no-cache

# Killer un container
docker kill devops-hub-app

# Forcer un redémarrage
docker-compose restart --timeout 0 app

# Vérifier les logs du daemon
docker logs container_name

# Vérifier la santé
docker-compose exec app curl http://localhost:3000

# ============================================
# 📈 PERFORMANCE & OPTIMISATION
# ============================================

# Voir l'utilisation des ressources
docker stats --no-stream

# Limiter les ressources (temporaire)
docker update --memory 512m --cpus 0.5 devops-hub-app

# Prune des layers inutilisés
docker system prune --all

# ============================================
# 🔐 SÉCURITÉ & DROITS
# ============================================

# Voir qui possède un container
docker inspect -f "{{.Config.User}}" devops-hub-app

# Scanner les vulnérabilités
docker scan devops-hub:latest

# Voir les secrets montés
docker-compose config --no-interpolate

# ============================================
# 📚 AIDE & INFORMATION
# ============================================

# Aide sur une commande
docker-compose --help
docker-compose up --help

# Version
docker-compose --version
docker --version

# Informations système
docker system info

# Diagnostic complet
docker system info --verbose

# ============================================
# 💡 EXEMPLES PRATIQUES
# ============================================

# Backup de la base de données
docker-compose exec -T db pg_dump > backup.sql

# Exporter les logs
docker-compose logs app > logs.txt

# Test de charge (via curl)
for i in {1..100}; do curl http://localhost:3000; done

# Vérifier un port
docker-compose exec app netstat -tuln | grep 3000

# Profiling mémoire
docker-compose exec app node --prof app.js

# Monitor en temps réel
watch 'docker stats --no-stream'

# ============================================

# 📖 Documentation complète: docker/README.md
# 📖 Configuration détaillée: docker/DETAILED.md
