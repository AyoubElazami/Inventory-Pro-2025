# Déploiement Azure - Guide Rapide

## Résumé des modifications

Votre projet est maintenant configuré pour être déployé sur Azure App Service. Voici ce qui a été fait :

### ✅ Fichiers créés/modifiés

1. **Backend**:
   - `backend/.deployment` - Configuration de déploiement Azure
   - `backend/web.config` - Amélioré pour Azure App Service
   - `backend/app.js` - CORS configuré pour accepter le frontend

2. **Frontend**:
   - `frontend/.deployment` - Configuration de déploiement Azure
   - `frontend/web.config` - Configuration pour Next.js sur Azure
   - `frontend/server.js` - Serveur Node.js pour Next.js
   - `frontend/lib/api.ts` - Client API centralisé avec support des variables d'environnement
   - Tous les fichiers de pages mis à jour pour utiliser le client API

3. **Documentation**:
   - `DEPLOYMENT_AZURE.md` - Guide complet de déploiement

## Prochaines étapes

1. **Créer les ressources Azure** (voir `DEPLOYMENT_AZURE.md`):
   ```bash
   az login
   az group create --name ProjetStock-RG --location westeurope
   ```

2. **Créer la base de données MySQL**:
   ```bash
   az mysql flexible-server create ...
   ```

3. **Déployer le backend**:
   ```bash
   az webapp create --resource-group ProjetStock-RG --plan ProjetStock-Plan --name projetstock-backend --runtime "NODE:20-lts"
   ```

4. **Déployer le frontend**:
   ```bash
   az webapp create --resource-group ProjetStock-RG --plan ProjetStock-Plan --name projetstock-frontend --runtime "NODE:20-lts"
   ```

5. **Configurer les variables d'environnement** dans Azure Portal pour chaque App Service

## Variables d'environnement importantes

### Backend
- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `NODE_ENV=production`
- `FRONTEND_URL=https://projetstock-frontend.azurewebsites.net`

### Frontend
- `NEXT_PUBLIC_API_URL=https://projetstock-backend.azurewebsites.net/api`
- `NODE_ENV=production`

## Test local avant déploiement

Pour tester avec les variables d'environnement :

**Backend**:
```bash
cd backend
# Créer un fichier .env avec vos variables
npm install
npm start
```

**Frontend**:
```bash
cd frontend
# Créer un fichier .env.local avec NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm install
npm run build
npm start
```

Pour plus de détails, consultez `DEPLOYMENT_AZURE.md`.

