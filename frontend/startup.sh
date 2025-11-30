#!/bin/bash
# Script de démarrage pour Azure App Service

echo "=== Starting Next.js Application ==="
echo "Working directory: $(pwd)"
echo "PORT: $PORT"
echo "NODE_ENV: $NODE_ENV"

# Lister les fichiers présents
echo "=== Files in current directory ==="
ls -la

# Vérifier que .next existe
if [ ! -d ".next" ]; then
  echo "❌ ERROR: .next directory not found!"
  echo "Current directory contents:"
  ls -la
  exit 1
fi

# Vérifier que server.js existe
if [ ! -f "server.js" ]; then
  echo "❌ ERROR: server.js not found!"
  exit 1
fi

echo "✅ All required files found"
echo "=== Starting server with: node server.js ==="

# Démarrer le serveur
exec node server.js

