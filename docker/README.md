# 📖 Docker - Guide de Démarrage Rapide

## 🚀 Démarrage Rapide

### Prérequis
- Docker & Docker Compose installés
- Variable d'environnement `VITE_GEMINI_API_KEY` configurée

### Installation Initiale

```bash
# 1. Cloner le projet
git clone <repo-url>
cd devops-hub-pro

# 2. Créer le fichier .env
cp .env.example .env
# Éditer .env et remplir VITE_GEMINI_API_KEY

# 3. Générer les certificats SSL (développement)
bash docker/generate-ssl.sh

# 4. Démarrer les services
bash docker/start.sh dev
```

## 📦 Structure Docker

```
docker/
├── Dockerfile           # Image application multi-stage
├── docker-compose.yml   # Orchestration des services
├── nginx.conf          # Configuration reverse proxy
├── start.sh            # Script de démarrage
├── stop.sh             # Script d'arrêt
├── generate-ssl.sh     # Génération certificats SSL
└── ssl/                # Certificats (généré automatiquement)
```

## 🔧 Services

### 1. **app** - Application React
- **Port**: 3000 (interne), 3000 (externe)
- **Variables**: GEMINI_API_KEY, NODE_ENV
- **Volumes**: Code source + node_modules (hot reload)
- **Health Check**: Curl HTTP GET
- **Restart**: Unless-stopped

### 2. **nginx** - Reverse Proxy
- **Port**: 80 (HTTP), 443 (HTTPS)
- **Fonctionnalités**:
  - SSL/TLS termination
  - Rate limiting
  - Gzip compression
  - Security headers
  - Caching statique
  - Load balancing

## 📋 Commandes Courantes

```bash
# Démarrage
docker-compose up                      # Dev mode (foreground)
docker-compose up -d                   # Production (background)
docker-compose up --build              # Rebuild images

# Arrêt
docker-compose down                    # Arrêt gracieux
docker-compose down -v                 # Arrêt + suppression volumes

# Monitoring
docker-compose ps                      # Statut des services
docker-compose logs -f                 # Logs en temps réel
docker-compose logs -f app             # Logs d'un service spécifique
docker-compose logs -f --tail=100      # Dernières 100 lignes

# Maintenance
docker-compose exec app npm install    # Installer dépendances
docker-compose exec app npm run build  # Build production
docker-compose restart app             # Redémarrer un service
docker-compose pull                    # Mettre à jour images

# Nettoyage
docker-compose down -v --remove-orphans  # Nettoyage complet
docker system prune -a                    # Nettoyage global
```

## 🌐 Accès

| URL | Service | Port |
|-----|---------|------|
| http://localhost:3000 | App directe | 3000 |
| http://localhost | Nginx HTTP | 80 |
| https://localhost | Nginx HTTPS | 443 |

## 🔐 Variables d'Environnement

### `.env` (obligatoire)
```bash
VITE_GEMINI_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
NODE_ENV=development
```

### Variables de Service (docker-compose)
```yaml
environment:
  - NODE_ENV
  - VITE_GEMINI_API_KEY
  - GEMINI_API_KEY
```

## 🔒 SSL/TLS

### Développement (Auto-signé)
```bash
# Générés automatiquement au démarrage
docker/ssl/devops-hub.key   # Clé privée
docker/ssl/devops-hub.crt   # Certificat
```

### Production
```bash
# Utiliser Let's Encrypt ou une CA validée
# Monter les certificats:
volumes:
  - /etc/letsencrypt/live/domain/fullchain.pem:/etc/nginx/ssl/cert.crt
  - /etc/letsencrypt/live/domain/privkey.pem:/etc/nginx/ssl/cert.key
```

## 📊 Monitoring & Logging

### Health Checks
```bash
# Vérifier le statut
docker-compose ps

# Détails d'un service
docker inspect devops-hub-app

# Test manuel
curl http://localhost:3000
curl https://localhost/health  # Nginx health
```

### Logs
```bash
# Tous les services
docker-compose logs

# En temps réel
docker-compose logs -f

# Service spécifique
docker-compose logs -f app
docker-compose logs -f nginx

# Dernières N lignes
docker-compose logs --tail=50

# Depuis un moment
docker-compose logs --since 10m
```

## ⚙️ Configuration Avancée

### Performance Tuning

```yaml
# Limiter ressources
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
    reservations:
      cpus: '0.25'
      memory: 256M
```

### Rate Limiting (Nginx)
```nginx
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=30r/s;
```

### Compression Gzip
```nginx
gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript;
```

## 🐛 Troubleshooting

### Port déjà utilisé
```bash
# Trouver le processus
lsof -i :3000
lsof -i :80

# Libérer le port
kill -9 <PID>

# Ou utiliser un port différent
docker-compose -f docker-compose.yml -e APP_PORT=3001 up
```

### Erreur API Key manquante
```bash
# Vérifier les variables
docker-compose config | grep GEMINI_API_KEY

# Éditer .env
nano .env
docker-compose restart app
```

### Certificats SSL invalides
```bash
# Régénérer
bash docker/generate-ssl.sh
docker-compose restart nginx
```

### Volumes corrompus
```bash
# Nettoyer les volumes
docker-compose down -v
docker-compose up --build
```

## 📈 Scaling

### Replicas (Production)
```yaml
services:
  app:
    deploy:
      replicas: 3  # 3 instances
```

### Load Balancing (Nginx)
```nginx
upstream app_server {
    least_conn;  # Least connections algorithm
    server app:3000 max_fails=3 fail_timeout=30s;
    server app2:3000;
    server app3:3000;
}
```

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
- name: Build and Run Docker Compose
  run: |
    docker-compose -f docker-compose.yml up -d
    docker-compose ps
    docker-compose exec -T app npm run build
```

## 📚 Ressources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Spec](https://github.com/compose-spec/compose-spec)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [SSL/TLS Best Practices](https://owasp.org/www-project-web-security-testing-guide/)

## 🆘 Support

Pour des problèmes:
1. Consulter les logs: `docker-compose logs -f`
2. Vérifier la configuration: `docker-compose config`
3. Tester les services: `docker-compose ps`
4. Relancer les services: `docker-compose restart`

---

**Version**: 1.0  
**Dernière mise à jour**: 25 janvier 2026  
**Status**: ✅ Production Ready
