# Guide de Déploiement Backend et Base de Données

## Prérequis

1. Azure CLI installé et connecté
2. Nom du groupe de ressources (ex: ProjetStock-RG)
3. Nom de votre App Service frontend (pour configurer CORS)

## Étape 1 : Vérifier la connexion Azure

```bash
az login
az account show
```

## Étape 2 : Créer le groupe de ressources (si pas déjà créé)

```bash
az group create \
  --name ProjetStock-RG \
  --location westeurope
```

## Étape 3 : Créer la base de données MySQL

### 3.1 Créer le serveur MySQL

```bash
az mysql flexible-server create \
  --resource-group ProjetStock-RG \
  --name projetstock-mysql \
  --location westeurope \
  --admin-user adminuser \
  --admin-password "VotreMotDePasseSecurise123!" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 8.0.21 \
  --storage-size 32 \
  --public-access 0.0.0.0
```

**⚠️ Important** : Remplacez `VotreMotDePasseSecurise123!` par un mot de passe fort (minimum 8 caractères, majuscules, minuscules, chiffres, caractères spéciaux).

### 3.2 Créer la base de données

```bash
az mysql flexible-server db create \
  --resource-group ProjetStock-RG \
  --server-name projetstock-mysql \
  --database-name projetstock_db
```

### 3.3 Configurer les règles de pare-feu

```bash
# Autoriser l'accès depuis Azure App Service
az mysql flexible-server firewall-rule create \
  --resource-group ProjetStock-RG \
  --name projetstock-mysql \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Autoriser votre IP actuelle (pour les tests)
az mysql flexible-server firewall-rule create \
  --resource-group ProjetStock-RG \
  --name projetstock-mysql \
  --rule-name AllowMyIP \
  --start-ip-address $(curl -s ifconfig.me) \
  --end-ip-address $(curl -s ifconfig.me)
```

## Étape 4 : Créer le plan App Service (si pas déjà créé)

```bash
az appservice plan create \
  --name ProjetStock-Plan \
  --resource-group ProjetStock-RG \
  --location westeurope \
  --sku B1 \
  --is-linux
```

## Étape 5 : Créer l'App Service Backend

```bash
az webapp create \
  --resource-group ProjetStock-RG \
  --plan ProjetStock-Plan \
  --name projetstock-backend \
  --runtime "NODE:20-lts"
```

## Étape 6 : Configurer les variables d'environnement

**⚠️ Remplacez les valeurs suivantes** :
- `VotreMotDePasseSecurise123!` : Le mot de passe MySQL que vous avez utilisé
- `projetstock-frontend.azurewebsites.net` : L'URL de votre frontend Azure

```bash
az webapp config appsettings set \
  --resource-group ProjetStock-RG \
  --name projetstock-backend \
  --settings \
    DB_HOST="projetstock-mysql.mysql.database.azure.com" \
    DB_NAME="projetstock_db" \
    DB_USER="adminuser" \
    DB_PASSWORD="VotreMotDePasseSecurise123!" \
    NODE_ENV="production" \
    PORT="4000" \
    FRONTEND_URL="https://projetstock-frontend.azurewebsites.net"
```

## Étape 7 : Configurer le démarrage

```bash
az webapp config set \
  --resource-group ProjetStock-RG \
  --name projetstock-backend \
  --startup-file "npm start"
```

## Étape 8 : Déployer le code

### Option A : Via GitHub Actions (Recommandé)

1. Assurez-vous que le workflow backend est configuré
2. Push sur la branche `master` ou `main`
3. Le workflow se déclenchera automatiquement

### Option B : Via Git local

```bash
# Obtenir l'URL de déploiement Git
az webapp deployment source config-local-git \
  --resource-group ProjetStock-RG \
  --name projetstock-backend

# Dans le dossier backend
cd backend
git init
git add .
git commit -m "Initial backend deployment"
git remote add azure <URL_GIT_RETOURNEE>
git push azure main
```

### Option C : Via ZIP deploy

```bash
# Créer un zip du backend (sans node_modules)
cd backend
zip -r ../backend-deploy.zip . -x "node_modules/*" ".git/*"

# Déployer
az webapp deployment source config-zip \
  --resource-group ProjetStock-RG \
  --name projetstock-backend \
  --src ../backend-deploy.zip
```

## Étape 9 : Vérifier le déploiement

### 9.1 Vérifier les logs

```bash
az webapp log tail \
  --resource-group ProjetStock-RG \
  --name projetstock-backend
```

### 9.2 Tester l'API

```bash
# Tester l'endpoint des produits
curl https://projetstock-backend.azurewebsites.net/api/products
```

### 9.3 Vérifier dans Azure Portal

1. Allez dans Azure Portal
2. App Service → `projetstock-backend`
3. Vérifiez les logs dans "Log stream"
4. Vérifiez les métriques dans "Metrics"

## Étape 10 : Mettre à jour le frontend

Assurez-vous que le frontend a la bonne URL de l'API :

```bash
az webapp config appsettings set \
  --resource-group ProjetStock-RG \
  --name projetstock-frontend \
  --settings \
    NEXT_PUBLIC_API_URL="https://projetstock-backend.azurewebsites.net/api"
```

## Dépannage

### Erreur de connexion à la base de données

1. Vérifiez les variables d'environnement :
```bash
az webapp config appsettings list \
  --resource-group ProjetStock-RG \
  --name projetstock-backend
```

2. Vérifiez les règles de pare-feu MySQL :
```bash
az mysql flexible-server firewall-rule list \
  --resource-group ProjetStock-RG \
  --name projetstock-mysql
```

3. Testez la connexion depuis votre machine :
```bash
mysql -h projetstock-mysql.mysql.database.azure.com \
  -u adminuser \
  -p \
  projetstock_db
```

### L'application ne démarre pas

1. Vérifiez les logs :
```bash
az webapp log tail --resource-group ProjetStock-RG --name projetstock-backend
```

2. Vérifiez que `server.js` existe et contient :
```javascript
require('./app');
```

3. Vérifiez que `package.json` a le script :
```json
"start": "node server.js"
```

### Erreur CORS

Vérifiez que `FRONTEND_URL` est correctement configuré dans les variables d'environnement du backend.

## Commandes utiles

```bash
# Redémarrer l'application
az webapp restart --resource-group ProjetStock-RG --name projetstock-backend

# Voir la configuration
az webapp config show --resource-group ProjetStock-RG --name projetstock-backend

# Voir les variables d'environnement
az webapp config appsettings list --resource-group ProjetStock-RG --name projetstock-backend

# Supprimer une variable d'environnement
az webapp config appsettings delete \
  --resource-group ProjetStock-RG \
  --name projetstock-backend \
  --setting-names VARIABLE_NAME
```

## Prochaines étapes

1. ✅ Backend déployé
2. ✅ Base de données créée
3. ✅ Variables d'environnement configurées
4. ⏭️ Tester l'API depuis le frontend
5. ⏭️ Configurer les sauvegardes automatiques
6. ⏭️ Configurer Application Insights (optionnel)

