# 🐳 Configuration Docker Détaillée

## 📋 Table des Matières
1. [Dockerfile](#dockerfile)
2. [Docker Compose](#docker-compose)
3. [Nginx Configuration](#nginx-configuration)
4. [Scripts de Gestion](#scripts-de-gestion)
5. [Best Practices](#best-practices)

---

## Dockerfile

### 🏗️ Architecture Multi-Stage

```dockerfile
STAGE 1: Builder       → STAGE 2: Runtime
├─ Node 20-Alpine     ├─ Node 20-Alpine (lightweight)
├─ npm ci             ├─ Utilisateur non-root
├─ npm run build      ├─ Seulement dist/
└─ ~500MB             └─ ~150MB
```

### Avantages du Multi-Stage
- ✅ Taille réduite: 150MB vs 500MB
- ✅ Sécurité: Pas de source dans l'image
- ✅ Performance: Build layer caché
- ✅ Maintenabilité: Séparation claire

### Sécurité Implémentée
```dockerfile
# Non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Healthcheck intégré
HEALTHCHECK --interval=30s --timeout=10s ...

# Minimal dependencies
npm ci --only=production
```

### Optimization

**Layer Caching**
```dockerfile
# Cache immuable (rarement changé)
COPY package*.json ./
RUN npm ci

# Cache mutable (change souvent)
COPY . .
RUN npm run build
```

---

## Docker Compose

### 📦 Services

#### 1. **app** - Application React
```yaml
build:
  context: ..                 # Chemin au Dockerfile
  dockerfile: docker/Dockerfile
  args:
    NODE_ENV: development     # Arg de build

ports:
  - "3000:3000"              # Port interne:externe

environment:
  - NODE_ENV=development
  - VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY}

volumes:
  - ../app:/app/app           # Code source (hot reload)
  - app-cache:/app/.vite      # Cache Vite

healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s

deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
    reservations:
      cpus: '0.25'
      memory: 256M
```

#### 2. **nginx** - Reverse Proxy
```yaml
image: nginx:alpine

ports:
  - "80:80"                   # HTTP
  - "443:443"                 # HTTPS

volumes:
  - ./nginx.conf:/etc/nginx/nginx.conf:ro
  - ./ssl:/etc/nginx/ssl:ro

depends_on:
  - app                       # Attendre que app soit prête
```

### 🌐 Network

```yaml
networks:
  devops-hub-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

**Avantages:**
- DNS automatique entre services
- Isolation réseau
- Communication interne sécurisée

### 💾 Volumes

```yaml
volumes:
  app-cache:                  # Volume nommé persistent
    driver: local
```

---

## Nginx Configuration

### 🔄 Upstream & Load Balancing

```nginx
upstream app_server {
    least_conn;              # Algorithme: least connections
    server app:3000 max_fails=3 fail_timeout=30s;
}
```

**Algorithmes disponibles:**
- `round_robin` - Alternance simple
- `least_conn` - Moins de connexions (recommandé)
- `ip_hash` - Par IP client
- `random` - Aléatoire

### 🔒 SSL/TLS

```nginx
ssl_certificate /etc/nginx/ssl/devops-hub.crt;
ssl_certificate_key /etc/nginx/ssl/devops-hub.key;

ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers HIGH:!aNULL:!MD5;
```

### 🚦 Security Headers

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Content-Security-Policy "default-src 'self'";
```

### ⚡ Performance

#### Compression Gzip
```nginx
gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript;
```

#### Caching
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

#### Rate Limiting
```nginx
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
location / {
    limit_req zone=general burst=20 nodelay;
}
```

### 📤 Proxy Configuration

```nginx
proxy_pass http://app_server;
proxy_http_version 1.1;

# Headers d'origine
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;

# WebSocket support
proxy_set_header Connection "upgrade";
proxy_set_header Upgrade $http_upgrade;

# Timeouts
proxy_connect_timeout 60s;
proxy_read_timeout 60s;

# Buffering
proxy_buffering on;
proxy_buffer_size 4k;
proxy_buffers 8 4k;
```

---

## Scripts de Gestion

### 🚀 start.sh

```bash
bash docker/start.sh dev    # Mode développement
bash docker/start.sh prod   # Mode production
```

**Actions:**
1. Vérifier/créer `.env`
2. Générer certificats SSL
3. Charger variables d'environnement
4. Démarrer avec `docker-compose up`

### 🛑 stop.sh

```bash
bash docker/stop.sh soft    # Arrêt gracieux
bash docker/stop.sh hard    # Arrêt + suppression
```

**Différences:**
- `soft`: Conserve les volumes (données)
- `hard`: Supprime tout (nettoyage complet)

### 🔐 generate-ssl.sh

```bash
bash docker/generate-ssl.sh
```

Génère les certificats auto-signés pour développement:
- `docker/ssl/devops-hub.crt` - Certificat (365 jours)
- `docker/ssl/devops-hub.key` - Clé privée

---

## Best Practices

### 1. ✅ Development vs Production

**Development**
```yaml
# docker-compose.yml
volumes:
  - ../app:/app/app  # Hot reload
environment:
  - NODE_ENV=development
ports:
  - "3000:3000"     # Accès direct
```

**Production**
```yaml
# Pas de volumes source
# Pas de ports directs
# Restart policy: always
# Resource limits définis
# Health checks robustes
```

### 2. ✅ Environment Variables

```bash
# .env
VITE_GEMINI_API_KEY=sk-xxx
NODE_ENV=development

# docker-compose.yml
environment:
  - VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY}
  - NODE_ENV=${NODE_ENV:-development}
```

### 3. ✅ Logging & Monitoring

```bash
# Logs en temps réel
docker-compose logs -f app

# Spécifique au service
docker-compose logs -f nginx

# Statistiques
docker stats

# Inspection détaillée
docker inspect devops-hub-app
```

### 4. ✅ Resource Management

```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'        # Max 50% d'une CPU
      memory: 512M       # Max 512MB RAM
    reservations:
      cpus: '0.25'       # Réservé
      memory: 256M
```

### 5. ✅ Health Checks

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000"]
  interval: 30s          # Tous les 30 secondes
  timeout: 10s           # Max 10 secondes
  retries: 3             # 3 essais max
  start_period: 40s      # Attendre 40s au démarrage
```

### 6. ✅ Network Isolation

```yaml
networks:
  - devops-hub-network   # Réseau personnalisé
  
# Isolation:
# - Services connectés entre eux
# - Isolés du réseau hôte
# - DNS interne automatique
```

### 7. ✅ Volume Management

```bash
# Voir les volumes
docker volume ls

# Nettoyer les orphans
docker volume prune

# Backup
docker run --rm -v devops-hub_app-cache:/data \
  -v $(pwd):/backup alpine tar czf /backup/cache.tar.gz /data
```

---

## 🔄 Workflow Complet

### Première exécution
```bash
# 1. Cloner
git clone <repo>
cd devops-hub-pro

# 2. Configurer
cp .env.example .env
nano .env  # Éditer GEMINI_API_KEY

# 3. Démarrer
bash docker/start.sh dev

# 4. Accéder
open http://localhost:3000
```

### Développement quotidien
```bash
# Terminal 1: Logs
docker-compose logs -f app

# Terminal 2: Modifications du code
# (hot reload automatique)

# Terminal 3: Commandes
docker-compose exec app npm test
docker-compose restart app
```

### Mise en production
```bash
# Build image
docker build -t devops-hub:1.0 .

# Push au registry
docker tag devops-hub:1.0 registry.io/devops-hub:1.0
docker push registry.io/devops-hub:1.0

# Deploy avec compose
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📊 Commandes de Diagnostic

```bash
# Configuration
docker-compose config          # Valider & afficher config
docker-compose config --services  # Lister services

# Status
docker-compose ps             # État des containers
docker-compose ps -a          # Inclure les arrêtés

# Logs
docker-compose logs           # Tous les logs
docker-compose logs -f app    # Suivi en temps réel
docker-compose logs --tail=50 # Dernières 50 lignes

# Exécution
docker-compose exec app bash  # Shell dans le container
docker-compose run app npm list  # Exécuter commande

# Événements
docker-compose events         # Flux d'événements

# Performance
docker stats                  # CPU, RAM, I/O usage
docker-compose exec app top   # Top du container
```

---

**Dernière mise à jour**: 25 janvier 2026  
**Version**: 1.0  
**Status**: ✅ Production Ready
