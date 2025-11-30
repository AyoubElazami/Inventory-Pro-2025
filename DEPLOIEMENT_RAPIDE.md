# Déploiement Rapide Backend et Base de Données

## Option 1 : Script Automatique (Recommandé)

1. **Exécutez le script PowerShell** :
```powershell
.\deploy-backend.ps1
```

Le script vous demandera le mot de passe MySQL et fera tout automatiquement.

## Option 2 : Commandes Manuelles

### 1. Créer la base de données MySQL

```bash
# Créer le serveur MySQL
az mysql flexible-server create \
  --resource-group ProjetStock-RG \
  --name projetstock-mysql \
  --location westeurope \
  --admin-user adminuser \
  --admin-password "VotreMotDePasse123!" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 8.0.21 \
  --storage-size 32 \
  --public-access 0.0.0.0

# Créer la base de données
az mysql flexible-server db create \
  --resource-group ProjetStock-RG \
  --server-name projetstock-mysql \
  --database-name projetstock_db

# Configurer le pare-feu
az mysql flexible-server firewall-rule create \
  --resource-group ProjetStock-RG \
  --name projetstock-mysql \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### 2. Créer l'App Service Backend

```bash
# Créer le plan (si pas déjà créé)
az appservice plan create \
  --name ProjetStock-Plan \
  --resource-group ProjetStock-RG \
  --location westeurope \
  --sku B1 \
  --is-linux

# Créer l'App Service
az webapp create \
  --resource-group ProjetStock-RG \
  --plan ProjetStock-Plan \
  --name projetstock-backend \
  --runtime "NODE:20-lts"
```

### 3. Configurer les variables d'environnement

**⚠️ Remplacez `VotreMotDePasse123!` par votre mot de passe MySQL**  
**⚠️ Remplacez `projetstock-frontend` par le nom de votre App Service frontend**

```bash
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
```

### 4. Configurer le démarrage

```bash
az webapp config set \
  --resource-group ProjetStock-RG \
  --name projetstock-backend \
  --startup-file "npm start"
```

### 5. Déployer le code via GitHub Actions

Si votre workflow GitHub Actions est configuré, il suffit de push sur `master` :

```bash
git add .
git commit -m "Deploy backend"
git push origin master
```

### 6. Vérifier le déploiement

```bash
# Voir les logs
az webapp log tail --resource-group ProjetStock-RG --name projetstock-backend

# Tester l'API
curl https://projetstock-backend.azurewebsites.net/api/products
```

## Informations importantes

- **URL Backend** : `https://projetstock-backend.azurewebsites.net/api`
- **URL Base de données** : `projetstock-mysql.mysql.database.azure.com`
- **Nom de la base** : `projetstock_db`
- **Utilisateur** : `adminuser`

## Mettre à jour le frontend

Assurez-vous que le frontend pointe vers le bon backend :

```bash
az webapp config appsettings set \
  --resource-group ProjetStock-RG \
  --name projetstock-frontend \
  --settings \
    NEXT_PUBLIC_API_URL="https://projetstock-backend.azurewebsites.net/api"
```

