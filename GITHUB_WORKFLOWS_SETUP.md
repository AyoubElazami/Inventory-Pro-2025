# Configuration des Workflows GitHub Actions pour Azure

Ce guide vous explique comment configurer les workflows GitHub Actions pour déployer automatiquement votre application sur Azure App Service.

## 📋 Prérequis

1. Un compte Azure avec un abonnement actif
2. Un repository GitHub avec votre code
3. Les App Services créés dans Azure (backend et frontend) _

## 🔐 Configuration des Secrets GitHub

Vous devez créer les secrets suivants dans votre repository GitHub :

### Pour le Backend

1. Allez dans votre repository GitHub > **Settings** > **Secrets and variables** > **Actions**
2. Cliquez sur **New repository secret** et ajoutez :

| Secret Name | Description | Exemple |
|------------|-------------|---------|
| `AZURE_BACK_CLIENTID` | Client ID du service principal Azure | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `AZURE_BACK_CLIENTSECRET` | Secret du service principal | `votre-secret` |
| `AZURE_BACK_SUBSCRIPTION` | ID de l'abonnement Azure | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `AZURE_BACK_TENANTID` | ID du tenant Azure | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `AZURE_BACK_APP_NAME` | Nom de votre App Service backend | `Inventory-pro` |

### Pour le Frontend

| Secret Name | Description | Exemple |
|------------|-------------|---------|
| `AZURE_FRONT_CLIENTID` | Client ID du service principal Azure | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `AZURE_FRONT_CLIENTSECRET` | Secret du service principal | `votre-secret` |
| `AZURE_FRONT_SUBSCRIPTION` | ID de l'abonnement Azure | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `AZURE_FRONT_TENANTID` | ID du tenant Azure | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `AZURE_FRONT_APP_NAME` | Nom de votre App Service frontend | `inventory-pro-01` |

## 🔧 Créer un Service Principal Azure

Pour obtenir les credentials Azure, créez un service principal :

```bash
# Se connecter à Azure
az login

# Créer un service principal pour le backend
az ad sp create-for-rbac --name "github-actions-backend" \
  --role contributor \
  --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP> \
  --sdk-auth

# Créer un service principal pour le frontend
az ad sp create-for-rbac --name "github-actions-frontend" \
  --role contributor \
  --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP> \
  --sdk-auth
```

**Important** : Remplacez `<SUBSCRIPTION_ID>` et `<RESOURCE_GROUP>` par vos valeurs réelles.

La commande retournera un JSON avec les credentials. Copiez les valeurs dans les secrets GitHub correspondants.

## 📝 Obtenir les noms des App Services

Pour trouver le nom exact de vos App Services :

```bash
# Lister toutes les App Services dans votre groupe de ressources
az webapp list --resource-group <VOTRE_GROUPE_DE_RESSOURCES> --query "[].{Name:name}" -o table
```

Ou dans le portail Azure :
1. Allez dans votre groupe de ressources
2. Trouvez vos App Services
3. Le nom est visible en haut de la page

## 🚀 Utilisation des Workflows

### Déclenchement automatique

Les workflows se déclenchent automatiquement lors d'un push sur la branche `master` ou `main`.

### Déclenchement manuel

1. Allez dans l'onglet **Actions** de votre repository GitHub
2. Sélectionnez le workflow que vous voulez exécuter
3. Cliquez sur **Run workflow**

## ✅ Vérification du déploiement

### Backend

1. Vérifiez les logs dans GitHub Actions
2. Testez l'API : `https://<nom-app-backend>.azurewebsites.net/api/products`
3. Vérifiez les logs dans Azure Portal > App Service > Log stream

### Frontend

1. Vérifiez les logs dans GitHub Actions
2. Visitez : `https://<nom-app-frontend>.azurewebsites.net`
3. Vérifiez les logs dans Azure Portal > App Service > Log stream

## 🔍 Dépannage

### Erreur : "Authentication failed"

- Vérifiez que tous les secrets sont correctement configurés
- Vérifiez que le service principal a les bonnes permissions

### Erreur : "App not found"

- Vérifiez que le nom de l'App Service dans les secrets correspond exactement au nom dans Azure
- Les noms sont sensibles à la casse

### Erreur de build

- Vérifiez que `package.json` et `package-lock.json` sont à jour
- Vérifiez que toutes les dépendances sont correctement déclarées

### Le frontend ne se connecte pas au backend

- Vérifiez que la variable d'environnement `NEXT_PUBLIC_API_URL` est configurée dans Azure Portal
- Vérifiez que l'URL du backend est correcte (sans `/api` à la fin dans `NEXT_PUBLIC_API_URL`)

## 📚 Structure des Workflows

### Backend Workflow (`master_inventory-pro.yml`)

1. **Build** : Installe les dépendances et prépare le package
2. **Deploy** : Déploie sur Azure App Service

### Frontend Workflow (`master_inventory-pro-front.yml`)

1. **Build** : 
   - Installe les dépendances
   - Build Next.js (`npm run build`)
   - Prépare le package avec tous les fichiers nécessaires
2. **Deploy** : 
   - Décompresse le package
   - Déploie sur Azure App Service

## 🎯 Fichiers inclus dans le déploiement

### Backend
- Tous les fichiers source (sans `node_modules`)
- `package.json` et `package-lock.json`
- `web.config`
- `.deployment`

### Frontend
- `.next` (dossier de build)
- `app/` (pages et composants)
- `lib/` (utilitaires API)
- `public/` (assets statiques)
- `package.json` et `package-lock.json`
- `server.js` (serveur Node.js pour Next.js)
- `web.config`
- `next.config.ts`
- `tsconfig.json`
- Autres fichiers de configuration

## 💡 Conseils

1. **Testez localement** avant de pousser sur GitHub
2. **Vérifiez les logs** dans Azure Portal si quelque chose ne fonctionne pas
3. **Utilisez des branches de test** pour valider les workflows avant de les mettre en production
4. **Gardez les secrets à jour** si vous changez les credentials Azure

