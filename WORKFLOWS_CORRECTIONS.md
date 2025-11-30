# Corrections apportées aux Workflows

## ✅ Corrections effectuées

### Frontend Workflow (`master_inventory-pro-front.yml`)

1. **Installation des dépendances de production** : Le workflow installe maintenant toutes les dépendances nécessaires avant le build
2. **Vérification du build** : Ajout d'une vérification pour s'assurer que le dossier `.next` existe après le build
3. **Copie du dossier `lib`** : Le dossier `lib` contenant `api.ts` est maintenant inclus dans le package
4. **Configuration `.deployment`** : 
   - `SCM_DO_BUILD_DURING_DEPLOYMENT=false` (le build est déjà fait)
   - `NPM_CONFIG_PRODUCTION=true` (Azure installera seulement les dépendances de production)
5. **Amélioration du `server.js`** : 
   - Hostname configuré pour `0.0.0.0` pour Azure
   - Utilise la variable d'environnement `PORT` d'Azure

### Backend Workflow (`master_inventory-pro.yml`)

Le workflow backend est déjà correctement configuré :
- Installation des dépendances
- Suppression de `node_modules` avant le déploiement (Azure les installera)
- Startup command configurée

## 📦 Structure du package de déploiement Frontend

Le package inclut maintenant :
- ✅ `package.json` et `package-lock.json`
- ✅ `.next/` (dossier de build Next.js)
- ✅ `app/` (pages et composants)
- ✅ `lib/` (client API)
- ✅ `public/` (assets statiques)
- ✅ `server.js` (serveur Node.js)
- ✅ `web.config` (configuration IIS)
- ✅ `next.config.ts` et autres fichiers de config
- ✅ `.deployment` (configuration Azure)

**Note** : `node_modules` n'est PAS inclus - Azure les installera automatiquement avec `npm install --production`

## 🔧 Configuration Azure requise

### Variables d'environnement Frontend
Dans Azure Portal > App Service Frontend > Configuration > Application settings :
- `NEXT_PUBLIC_API_URL` = `https://votre-backend.azurewebsites.net/api`
- `NODE_ENV` = `production`
- `PORT` = (défini automatiquement par Azure)

### Variables d'environnement Backend
- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `NODE_ENV` = `production`
- `FRONTEND_URL` = `https://votre-frontend.azurewebsites.net`
- `PORT` = (défini automatiquement par Azure)

## 🚀 Déploiement

1. **Push sur `master` ou `main`** : Le workflow se déclenche automatiquement
2. **Ou déclencher manuellement** : GitHub Actions > Workflow > Run workflow

## 🔍 Vérification après déploiement

### Backend
```bash
# Tester l'API
curl https://votre-backend.azurewebsites.net/api/products
```

### Frontend
- Visitez : `https://votre-frontend.azurewebsites.net`
- Vérifiez les logs dans Azure Portal > Log stream

## ⚠️ Problèmes courants et solutions

### Erreur : "Cannot find module 'next'"
- **Cause** : Les dépendances ne sont pas installées
- **Solution** : Vérifiez que `package.json` et `package-lock.json` sont dans le package

### Erreur : "Cannot find module './lib/api'"
- **Cause** : Le dossier `lib` n'est pas copié
- **Solution** : Vérifiez que le workflow copie bien le dossier `lib`

### Le frontend ne se connecte pas au backend
- **Cause** : `NEXT_PUBLIC_API_URL` mal configuré
- **Solution** : Vérifiez la variable d'environnement dans Azure Portal

### Build échoue
- **Cause** : Erreurs TypeScript ou de dépendances
- **Solution** : Vérifiez les logs du workflow dans GitHub Actions

## 📝 Notes importantes

1. Le build Next.js est fait dans GitHub Actions, pas sur Azure
2. Azure installera seulement les dépendances de production (`npm install --production`)
3. Le serveur démarre avec `npm start` qui exécute `server.js`
4. Le port est automatiquement défini par Azure via la variable `PORT`

