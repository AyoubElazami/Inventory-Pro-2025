# Configuration de la Base de Données après Déploiement Backend

## 📋 Étapes à suivre

Une fois le backend déployé, vous devez créer et configurer la base de données MySQL sur Azure.

## Étape 1 : Créer le Serveur MySQL

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
- Remplacez `VotreMotDePasseSecurise123!` par un mot de passe fort
- Le nom `projetstock-mysql` doit être unique globalement (changez-le si nécessaire)
- Le mot de passe doit contenir : majuscules, minuscules, chiffres, caractères spéciaux, minimum 8 caractères

## Étape 2 : Créer la Base de Données

```bash
az mysql flexible-server db create \
  --resource-group Inventoryy22 \
  --server-name projetstock-mysql \
  --database-name projetstock_db
```

## Étape 3 : Configurer les Règles de Pare-feu

### 3.1 Autoriser Azure App Service

```bash
az mysql flexible-server firewall-rule create \
  --resource-group Inventoryy22 \
  --name projetstock-mysql \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### 3.2 Autoriser votre IP (pour les tests)

```bash
# Obtenir votre IP publique
$myIP = (Invoke-WebRequest -Uri "https://ifconfig.me" -UseBasicParsing).Content.Trim()

# Ajouter la règle
az mysql flexible-server firewall-rule create \
  --resource-group Inventoryy22 \
  --name projetstock-mysql \
  --rule-name AllowMyIP \
  --start-ip-address $myIP \
  --end-ip-address $myIP
```

## Étape 4 : Configurer les Variables d'Environnement du Backend

Maintenant que la base de données est créée, vous devez configurer les variables d'environnement dans votre App Service backend :

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
    FRONTEND_URL="https://VOTRE-FRONTEND.azurewebsites.net"
```

**⚠️ Remplacez** :
- `VotreMotDePasseSecurise123!` : Le même mot de passe que vous avez utilisé à l'étape 1
- `VOTRE-FRONTEND` : Le nom de votre App Service frontend

## Étape 5 : Redémarrer le Backend

Après avoir configuré les variables d'environnement, redémarrez l'application :

```bash
az webapp restart \
  --resource-group Inventoryy22 \
  --name Inventory-pro1
```

## Étape 6 : Vérifier la Connexion

### 6.1 Vérifier les logs

```bash
az webapp log tail \
  --resource-group Inventoryy22 \
  --name Inventory-pro1
```

Vous devriez voir :
```
✅ DB connected & synced
Server started on 4000
```

### 6.2 Tester l'API

```bash
# Tester l'endpoint des produits
curl https://inventory-pro1.azurewebsites.net/api/products
```

Si tout fonctionne, vous devriez recevoir une réponse JSON (probablement un tableau vide `[]` au début).

## Étape 7 : Vérifier que les Tables sont Créées

Le backend utilise Sequelize avec `sequelize.sync({ alter: true })`, ce qui crée automatiquement les tables au démarrage.

### 7.1 Vérifier via l'API

```bash
# Créer un produit de test
curl -X POST https://inventory-pro1.azurewebsites.net/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Produit Test","quantity":10,"price":29.99}'

# Récupérer les produits
curl https://inventory-pro1.azurewebsites.net/api/products
```

### 7.2 Vérifier directement dans MySQL (optionnel)

```bash
# Se connecter à MySQL
mysql -h projetstock-mysql.mysql.database.azure.com \
  -u adminuser \
  -p \
  projetstock_db

# Dans MySQL, lister les tables
SHOW TABLES;

# Vous devriez voir :
# - Products
# - Suppliers
# - Orders
# - OrderItems
```

## 📝 Résumé des Informations

Après avoir suivi ces étapes, vous aurez :

- ✅ **Serveur MySQL** : `projetstock-mysql.mysql.database.azure.com`
- ✅ **Base de données** : `projetstock_db`
- ✅ **Utilisateur** : `adminuser`
- ✅ **Mot de passe** : (celui que vous avez défini)
- ✅ **Backend connecté** : Variables d'environnement configurées
- ✅ **Tables créées** : Automatiquement par Sequelize

## 🔍 Dépannage

### Erreur : "Cannot connect to database"

1. **Vérifiez les variables d'environnement** :
```bash
az webapp config appsettings list \
  --resource-group Inventoryy22 \
  --name Inventory-pro1 \
  --query "[?name=='DB_HOST' || name=='DB_NAME' || name=='DB_USER']" \
  -o table
```

2. **Vérifiez les règles de pare-feu** :
```bash
az mysql flexible-server firewall-rule list \
  --resource-group Inventoryy22 \
  --name projetstock-mysql \
  -o table
```

3. **Testez la connexion depuis votre machine** :
```bash
mysql -h projetstock-mysql.mysql.database.azure.com \
  -u adminuser \
  -p \
  projetstock_db
```

### Erreur : "Access denied"

- Vérifiez que le mot de passe dans les variables d'environnement correspond au mot de passe MySQL
- Vérifiez que l'utilisateur est `adminuser`

### Les tables ne sont pas créées

- Vérifiez les logs du backend pour voir les erreurs Sequelize
- Vérifiez que `sequelize.sync({ alter: true })` est bien exécuté dans `backend/app.js`
- Redémarrez l'application après avoir corrigé les erreurs

## ✅ Checklist Finale

- [ ] Serveur MySQL créé
- [ ] Base de données créée
- [ ] Règles de pare-feu configurées
- [ ] Variables d'environnement configurées dans l'App Service
- [ ] Backend redémarré
- [ ] Logs vérifiés (connexion DB réussie)
- [ ] API testée (endpoint `/api/products` fonctionne)
- [ ] Tables créées (test avec création d'un produit)

Une fois toutes ces étapes complétées, votre backend sera connecté à la base de données et prêt à être utilisé ! 🎉

