# Guide de Déploiement Backend et Base de Données

## Étape 1 : Créer la Base de Données MySQL

### 1.1 Créer le serveur MySQL

```bash
az mysql flexible-server create \
  --resource-group Inventoryy22 \
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

**⚠️ Important** : 
- Remplacez `VotreMotDePasseSecurise123!` par un mot de passe fort (min 8 caractères, majuscules, minuscules, chiffres, caractères spéciaux)
- Le nom du serveur doit être unique globalement (vous pouvez changer `projetstock-mysql` si nécessaire)

### 1.2 Créer la base de données

```bash
az mysql flexible-server db create \
  --resource-group Inventoryy22 \
  --server-name projetstock-mysql \
  --database-name projetstock_db
```

### 1.3 Configurer les règles de pare-feu

```bash
# Autoriser l'accès depuis Azure App Service
az mysql flexible-server firewall-rule create \
  --resource-group Inventoryy22 \
  --name projetstock-mysql \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Autoriser votre IP actuelle (pour les tests)
az mysql flexible-server firewall-rule create \
  --resource-group Inventoryy22 \
  --name projetstock-mysql \
  --rule-name AllowMyIP \
  --start-ip-address $(curl -s ifconfig.me) \
  --end-ip-address $(curl -s ifconfig.me)
```

## Étape 2 : Créer le Plan App Service (si pas déjà créé)

```bash
az appservice plan create \
  --name ProjetStock-Plan \
  --resource-group Inventoryy22 \
  --location westeurope \
  --sku B1 \
  --is-linux
```

## Étape 3 : Créer l'App Service Backend

```bash
az webapp create \
  --resource-group Inventoryy22 \
  --plan ProjetStock-Plan \
  --name Inventory-pro1 \
  --runtime "NODE:20-lts"
```

**Note** : Le nom `Inventory-pro1` correspond à ce que vous avez dans votre workflow. Si vous voulez un autre nom, changez-le ici et dans le workflow.

## Étape 4 : Configurer les Variables d'Environnement

**⚠️ Remplacez les valeurs suivantes** :
- `VotreMotDePasseSecurise123!` : Le mot de passe MySQL que vous avez utilisé à l'étape 1.1
- `projetstock-frontend` : Le nom de votre App Service frontend (ou l'URL complète)

```bash
az webapp config appsettings set \
  --resource-group Inventoryy22 \
  --name Inventory-pro1 \
  --settings \
    DB_HOST="projetstock-mysql.mysql.database.azure.com" \
    DB_NAME="projetstock_db" \
    DB_USER="adminuser" \
    DB_PASSWORD="VotreMotDePasseSecurise123!" \
    NODE_ENV="production" \
    PORT="4000" \
    FRONTEND_URL="https://projetstock-frontend.azurewebsites.net"
```

**Pour trouver le nom de votre frontend** :
```bash
az webapp list --resource-group Inventoryy22 --query "[].{Name:name}" -o table
```

## Étape 5 : Configurer la Commande de Démarrage

```bash
az webapp config set \
  --resource-group Inventoryy22 \
  --name Inventory-pro1 \
  --startup-file "npm start"
```

## Étape 6 : Déployer le Code

### Option A : Via GitHub Actions (Recommandé)

1. **Vérifiez que les secrets GitHub sont configurés** :
   - `AZURE_BACK_CLIENTID`
   - `AZURE_BACK_CLIENTSECRET`
   - `AZURE_BACK_SUBSCRIPTION`
   - `AZURE_BACK_TENANTID`
   - `AZURE_BACK_APP_NAME` = `Inventory-pro1`
   - `AZURE_BACK_RESOURCE_GROUP` = `Inventoryy22` (optionnel)

2. **Push sur master** :
```bash
git add .
git commit -m "Deploy backend"
git push origin master
```

Le workflow GitHub Actions se déclenchera automatiquement.

### Option B : Via Git Local

```bash
# Obtenir l'URL de déploiement Git
az webapp deployment source config-local-git \
  --resource-group Inventoryy22 \
  --name Inventory-pro1

# Dans le dossier backend
cd backend
git init
git add .
git commit -m "Initial backend deployment"
git remote add azure <URL_GIT_RETOURNEE>
git push azure main
```

### Option C : Via ZIP Deploy

```bash
# Créer un zip du backend (sans node_modules)
cd backend
zip -r ../backend-deploy.zip . -x "node_modules/*" ".git/*"

# Déployer
az webapp deployment source config-zip \
  --resource-group Inventoryy22 \
  --name Inventory-pro1 \
  --src ../backend-deploy.zip
```

## Étape 7 : Vérifier le Déploiement

### 7.1 Vérifier les logs

```bash
az webapp log tail \
  --resource-group Inventoryy22 \
  --name Inventory-pro1
```

### 7.2 Tester l'API

```bash
# Tester l'endpoint des produits
curl https://inventory-pro1.azurewebsites.net/api/products
```

### 7.3 Vérifier dans Azure Portal

1. Allez dans Azure Portal
2. App Service → `Inventory-pro1`
3. Vérifiez les logs dans "Log stream"
4. Vérifiez les métriques dans "Metrics"

## Étape 8 : Mettre à jour le Frontend

Assurez-vous que le frontend pointe vers le bon backend :

```bash
# Trouver le nom de votre App Service frontend
az webapp list --resource-group Inventoryy22 --query "[].{Name:name}" -o table

# Mettre à jour la variable d'environnement
az webapp config appsettings set \
  --resource-group Inventoryy22 \
  --name <NOM_DE_VOTRE_FRONTEND> \
  --settings \
    NEXT_PUBLIC_API_URL="https://inventory-pro1.azurewebsites.net/api"
```

## Dépannage

### Erreur de connexion à la base de données

1. **Vérifiez les variables d'environnement** :
```bash
az webapp config appsettings list \
  --resource-group Inventoryy22 \
  --name Inventory-pro1
```

2. **Vérifiez les règles de pare-feu MySQL** :
```bash
az mysql flexible-server firewall-rule list \
  --resource-group Inventoryy22 \
  --name projetstock-mysql
```

3. **Testez la connexion depuis votre machine** :
```bash
mysql -h projetstock-mysql.mysql.database.azure.com \
  -u adminuser \
  -p \
  projetstock_db
```

### L'application ne démarre pas

1. **Vérifiez les logs** :
```bash
az webapp log tail --resource-group Inventoryy22 --name Inventory-pro1
```

2. **Vérifiez que server.js existe** :
```bash
az webapp ssh --resource-group Inventoryy22 --name Inventory-pro1
# Puis dans le shell : ls -la
```

3. **Vérifiez le script start dans package.json** :
```bash
az webapp config appsettings list \
  --resource-group Inventoryy22 \
  --name Inventory-pro1 \
  --query "[?name=='WEBSITE_NODE_DEFAULT_VERSION']"
```

### Erreur CORS

Vérifiez que `FRONTEND_URL` est correctement configuré dans les variables d'environnement du backend.

## Commandes Utiles

```bash
# Redémarrer l'application
az webapp restart --resource-group Inventoryy22 --name Inventory-pro1

# Voir la configuration
az webapp config show --resource-group Inventoryy22 --name Inventory-pro1

# Voir les variables d'environnement
az webapp config appsettings list --resource-group Inventoryy22 --name Inventory-pro1

# Voir les logs en temps réel
az webapp log tail --resource-group Inventoryy22 --name Inventory-pro1

# Lister toutes les App Services
az webapp list --resource-group Inventoryy22 --query "[].{Name:name, State:state}" -o table
```

## Résumé des URLs

- **Backend API** : `https://inventory-pro1.azurewebsites.net/api`
- **Endpoints** :
  - `/api/products` - Gestion des produits
  - `/api/orders` - Gestion des commandes
  - `/api/suppliers` - Gestion des fournisseurs
  - `/api/reports` - Rapports

## Prochaines Étapes

1. ✅ Base de données créée
2. ✅ Backend déployé
3. ✅ Variables d'environnement configurées
4. ⏭️ Tester l'API depuis le frontend
5. ⏭️ Configurer les sauvegardes automatiques
6. ⏭️ Configurer Application Insights (optionnel)

