# Guide de déploiement sur Azure

Ce guide vous explique comment déployer votre application ProjetStock sur Azure App Service.

## Prérequis

1. Un compte Azure avec un abonnement actif
2. Azure CLI installé (`az --version` pour vérifier)
3. Node.js installé localement pour les tests

## Architecture de déploiement

- **Backend**: Azure App Service (Node.js)
- **Frontend**: Azure App Service (Node.js avec Next.js)
- **Base de données**: Azure Database for MySQL

## Étape 1: Créer la base de données MySQL sur Azure

```bash
# Créer un groupe de ressources
az group create --name ProjetStock-RG --location westeurope

# Créer un serveur MySQL
az mysql flexible-server create \
  --resource-group ProjetStock-RG \
  --name projetstock-mysql \
  --location westeurope \
  --admin-user adminuser \
  --admin-password VotreMotDePasse123! \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 8.0.21 \
  --storage-size 32 \
  --public-access 0.0.0.0

# Créer une base de données
az mysql flexible-server db create \
  --resource-group ProjetStock-RG \
  --server-name projetstock-mysql \
  --database-name projetstock_db
```

## Étape 2: Déployer le Backend

```bash
# Se connecter à Azure
az login

# Créer une App Service pour le backend
az webapp create \
  --resource-group ProjetStock-RG \
  --plan ProjetStock-Plan \
  --name projetstock-backend \
  --runtime "NODE:20-lts"

# Configurer les variables d'environnement
az webapp config appsettings set \
  --resource-group ProjetStock-RG \
  --name projetstock-backend \
  --settings \
    DB_HOST="projetstock-mysql.mysql.database.azure.com" \
    DB_NAME="projetstock_db" \
    DB_USER="adminuser" \
    DB_PASSWORD="VotreMotDePasse123!" \
    NODE_ENV="production" \
    PORT="4000" \
    FRONTEND_URL="https://projetstock-frontend.azurewebsites.net"

# Activer le déploiement depuis Git (optionnel)
az webapp deployment source config-local-git \
  --resource-group ProjetStock-RG \
  --name projetstock-backend
```

### Déploiement du backend via Git

```bash
cd backend
git init
git add .
git commit -m "Initial commit"
git remote add azure <URL_GIT_DU_BACKEND>
git push azure main
```

## Étape 3: Déployer le Frontend

```bash
# Créer une App Service pour le frontend
az webapp create \
  --resource-group ProjetStock-RG \
  --plan ProjetStock-Plan \
  --name projetstock-frontend \
  --runtime "NODE:20-lts"

# Configurer les variables d'environnement
az webapp config appsettings set \
  --resource-group ProjetStock-RG \
  --name projetstock-frontend \
  --settings \
    NEXT_PUBLIC_API_URL="https://projetstock-backend.azurewebsites.net/api" \
    NODE_ENV="production"

# Configurer le build pour Next.js
az webapp config set \
  --resource-group ProjetStock-RG \
  --name projetstock-frontend \
  --startup-file "npm start"
```

### Déploiement du frontend via Git

```bash
cd frontend
git init
git add .
git commit -m "Initial commit"
git remote add azure <URL_GIT_DU_FRONTEND>
git push azure main
```

## Étape 4: Configuration CORS

La configuration CORS est déjà configurée dans `backend/app.js` pour accepter les requêtes depuis le frontend déployé. Assurez-vous que la variable d'environnement `FRONTEND_URL` est définie dans les paramètres de l'App Service backend.

## Étape 5: Vérifier le déploiement

1. **Backend**: Visitez `https://projetstock-backend.azurewebsites.net/api/products`
2. **Frontend**: Visitez `https://projetstock-frontend.azurewebsites.net`

## Déploiement via Azure DevOps (Recommandé)

Pour un déploiement automatisé, créez un pipeline Azure DevOps :

1. Créez un projet dans Azure DevOps
2. Configurez un pipeline YAML qui :
   - Build le backend et le frontend
   - Déploie sur Azure App Service

## Notes importantes

- **Variables d'environnement**: Configurées dans Azure Portal > App Service > Configuration > Application settings
- **Port**: Automatiquement défini par Azure (variable `PORT`)
- **API URL**: Le frontend utilise `NEXT_PUBLIC_API_URL` pour se connecter au backend
- **CORS**: Le backend accepte automatiquement les requêtes depuis le frontend configuré
- **Logs**: Utilisez Azure Portal > App Service > Log stream
- **Monitoring**: Activez Application Insights pour le suivi des performances
- **Build**: Azure exécute automatiquement `npm install` et `npm run build` lors du déploiement grâce au fichier `.deployment`

## Dépannage

### Vérifier les logs
```bash
az webapp log tail --resource-group ProjetStock-RG --name projetstock-backend
```

### Redémarrer l'application
```bash
az webapp restart --resource-group ProjetStock-RG --name projetstock-backend
```

### Vérifier la configuration
```bash
az webapp config show --resource-group ProjetStock-RG --name projetstock-backend
```

