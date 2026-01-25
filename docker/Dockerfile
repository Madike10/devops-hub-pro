# 🏗️ DevOps Hub Pro - Multi-Stage Docker Build
# Optimisé pour production avec image légère et sécurisée

# ===== STAGE 1: Builder =====
FROM node:20-alpine AS builder

# Définir les variables de build
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Installer les dépendances (cache layer)
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Copier le code source
COPY . .

# Builder l'application
RUN npm run build

# ===== STAGE 2: Runtime (Production) =====
FROM node:20-alpine

# Metadata
LABEL maintainer="DevOps Team"
LABEL description="DevOps Hub Pro - Interactive DevOps Learning Platform"
LABEL version="1.0"

# Variables d'environnement
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV} \
    PORT=3000 \
    HOSTNAME=0.0.0.0

WORKDIR /app

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copier uniquement les fichiers nécessaires du builder
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Changer vers l'utilisateur nodejs
USER nodejs

# Exposer le port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Commande de démarrage
CMD ["npm", "run", "preview"]