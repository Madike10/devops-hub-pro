# ===== STAGE 1: Builder =====
FROM node:20-alpine AS builder
WORKDIR /app

# Installer les dépendances
COPY app/package*.json ./
RUN npm install

# Copier le code source et builder
COPY app/ .
RUN npm run build

# ===== STAGE 2: Runtime =====
FROM node:20-alpine
WORKDIR /app

# Installer serve pour servir l'application statique
RUN npm install -g serve

# Copier le dossier dist
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]