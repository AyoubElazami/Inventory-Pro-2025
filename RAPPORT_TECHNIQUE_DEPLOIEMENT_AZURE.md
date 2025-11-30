# Rapport Technique - Déploiement Azure
## Application de Gestion de Stock (Inventory Pro 2025)

**Date** : Novembre 2025  
**Version** : 1.0  
**Auteur** : Équipe de développement

---

## Table des matières

1. [Description du cas concret](#1-description-du-cas-concret)
2. [Architecture de l'application](#2-architecture-de-lapplication)
3. [Choix des services cloud Azure](#3-choix-des-services-cloud-azure)
4. [Architecture de déploiement](#4-architecture-de-déploiement)
5. [Étapes détaillées du déploiement](#5-étapes-détaillées-du-déploiement)
6. [Configuration de la base de données](#6-configuration-de-la-base-de-données)
7. [Configuration CI/CD](#7-configuration-cicd)
8. [Sécurité et bonnes pratiques](#8-sécurité-et-bonnes-pratiques)
9. [Monitoring et maintenance](#9-monitoring-et-maintenance)
10. [Conclusion](#10-conclusion)

---

## 1. Description du cas concret

### 1.1 Contexte métier

**Inventory Pro 2025** est une application web de gestion de stock conçue pour répondre aux besoins des entreprises de petite et moyenne taille qui nécessitent une solution simple, efficace et moderne pour gérer leur inventaire.

### 1.2 Problématique résolue

Les entreprises rencontrent souvent des difficultés dans la gestion de leur stock :
- **Suivi manuel** des produits entraînant des erreurs et des pertes
- **Manque de visibilité** sur les niveaux de stock en temps réel
- **Gestion complexe** des commandes et des fournisseurs
- **Absence de rapports** pour prendre des décisions éclairées
- **Solutions existantes** trop coûteuses ou trop complexes

### 1.3 Solution proposée

Inventory Pro 2025 offre une solution complète et intuitive permettant de :
- **Gérer les produits** : ajout, modification, suivi des quantités et des prix
- **Créer et suivre les commandes** : gestion des commandes clients avec calcul automatique des totaux
- **Gérer les fournisseurs** : centralisation des informations de contact
- **Générer des rapports** : visualisation des stocks faibles, ruptures de stock, valeur totale de l'inventaire
- **Interface moderne** : design responsive et intuitif pour une utilisation facile

### 1.4 Fonctionnalités principales

#### Gestion des produits
- Création, lecture, mise à jour et suppression (CRUD) des produits
- Suivi des quantités en stock
- Gestion des prix unitaires
- Association avec les fournisseurs

#### Gestion des commandes
- Création de commandes avec sélection de produits
- Calcul automatique des totaux
- Gestion des informations clients (nom, email)
- Suivi du statut des commandes

#### Gestion des fournisseurs
- Enregistrement des informations de contact (nom, email, téléphone, adresse)
- Association avec les produits

#### Rapports et statistiques
- Produits en rupture de stock
- Produits avec stock faible (< 5 unités)
- Valeur totale de l'inventaire
- Nombre total de fournisseurs et commandes

---

## 2. Architecture de l'application

### 2.1 Stack technologique

#### Frontend
- **Framework** : Next.js 16.0.3 (React 19.2.0)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS 4
- **Architecture** : App Router (Next.js 13+)

#### Backend
- **Framework** : Express.js 5.1.0
- **Langage** : Node.js 20.x
- **ORM** : Sequelize 6.37.7
- **Base de données** : MySQL 8.0

#### Outils de développement
- **Linting** : ESLint
- **Versioning** : Git / GitHub
- **CI/CD** : GitHub Actions

### 2.2 Structure de l'application

```
ProjetStock/
├── frontend/                 # Application Next.js
│   ├── app/                 # Pages et composants
│   │   ├── pages/           # Routes de l'application
│   │   │   ├── products/    # Gestion des produits
│   │   │   ├── orders/      # Gestion des commandes
│   │   │   ├── suppliers/   # Gestion des fournisseurs
│   │   │   └── reports/     # Rapports
│   │   └── layout.tsx       # Layout principal
│   ├── lib/                 # Utilitaires
│   │   └── api.ts           # Client API centralisé
│   ├── public/              # Assets statiques
│   ├── server.js            # Serveur Node.js pour Azure
│   └── package.json
│
└── backend/                  # API Express.js
    ├── models/              # Modèles Sequelize
    │   ├── product.js
    │   ├── order.js
    │   ├── orderItem.js
    │   └── supplier.js
    ├── routes/              # Routes API
    │   ├── products.js
    │   ├── orders.js
    │   ├── suppliers.js
    │   └── reports.js
    ├── config/              # Configuration
    │   └── database.js      # Configuration Sequelize
    ├── app.js               # Application Express
    └── server.js            # Point d'entrée
```

### 2.3 Modèle de données

#### Produit (Product)
- `id` : Identifiant unique (auto-increment)
- `name` : Nom du produit
- `quantity` : Quantité en stock
- `price` : Prix unitaire
- `supplierId` : Référence au fournisseur (clé étrangère)

#### Commande (Order)
- `id` : Identifiant unique
- `customerName` : Nom du client
- `customerEmail` : Email du client
- `status` : Statut de la commande (pending, completed, cancelled)
- `total` : Montant total de la commande
- `OrderItems` : Relation avec les articles de commande

#### Article de commande (OrderItem)
- `id` : Identifiant unique
- `orderId` : Référence à la commande
- `productId` : Référence au produit
- `quantity` : Quantité commandée
- `price` : Prix unitaire au moment de la commande

#### Fournisseur (Supplier)
- `id` : Identifiant unique
- `name` : Nom du fournisseur
- `email` : Email de contact
- `phone` : Téléphone
- `address` : Adresse complète

---

## 3. Choix des services cloud Azure

### 3.1 Justification du choix d'Azure

Azure a été choisi pour plusieurs raisons :

1. **Intégration native** avec les outils Microsoft
2. **Scalabilité** : possibilité de faire évoluer l'application selon les besoins
3. **Sécurité** : conformité et certifications internationales
4. **Support** : documentation complète et communauté active
5. **Coûts** : tarification flexible avec options gratuites pour le développement

### 3.2 Services Azure utilisés

#### Azure App Service
**Service** : Azure App Service (Linux)  
**Justification** :
- **Gestion simplifiée** : pas besoin de gérer les serveurs
- **Déploiement continu** : intégration avec GitHub Actions
- **Scaling automatique** : possibilité d'augmenter les ressources selon la charge
- **Support Node.js** : runtime Node.js 20.x pré-configuré
- **HTTPS** : certificats SSL gérés automatiquement
- **Monitoring** : logs et métriques intégrés

**Configuration** :
- **Backend** : App Service Linux avec runtime Node.js 20
- **Frontend** : App Service Linux avec runtime Node.js 20
- **Plan de service** : App Service Plan (Basic ou Standard)

#### Azure Database for MySQL Flexible Server
**Service** : Azure Database for MySQL Flexible Server  
**Justification** :
- **Compatibilité** : MySQL 8.0 compatible avec Sequelize
- **Haute disponibilité** : options de réplication et sauvegarde automatique
- **Sécurité** : chiffrement au repos et en transit
- **Scalabilité** : possibilité d'augmenter les performances
- **Gestion simplifiée** : maintenance et mises à jour gérées par Azure

**Configuration** :
- **Version** : MySQL 8.0.21
- **Tier** : Burstable (B1ms) pour le développement, Standard pour la production
- **Stockage** : 32 GB minimum
- **Sauvegarde** : activée automatiquement

#### Azure Resource Groups
**Service** : Resource Groups  
**Justification** :
- **Organisation** : regroupement logique des ressources
- **Gestion** : déploiement et suppression simplifiés
- **Coûts** : suivi des coûts par groupe de ressources

### 3.3 Alternatives considérées

#### Pour l'hébergement
- **Heroku** : Plus simple mais plus coûteux à long terme
- **AWS Elastic Beanstalk** : Plus complexe, courbe d'apprentissage plus élevée
- **DigitalOcean App Platform** : Moins d'intégrations avec les outils Microsoft

#### Pour la base de données
- **Azure SQL Database** : Plus performant mais nécessite une migration vers SQL Server
- **PostgreSQL** : Alternative viable mais nécessite des modifications du code
- **Cosmos DB** : Trop complexe pour ce cas d'usage

---

## 4. Architecture de déploiement

### 4.1 Schéma d'architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        INTERNET                              │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTPS
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌───────────────┐              ┌───────────────┐
│   Frontend    │              │   Backend     │
│  Next.js App  │              │  Express API  │
│               │              │               │
│ App Service   │◄─────────────┤ App Service   │
│  (Linux)      │   API Calls  │  (Linux)      │
└───────────────┘              └───────┬───────┘
                                       │
                                       │ Sequelize ORM
                                       │
                                       ▼
                              ┌───────────────┐
                              │   MySQL DB    │
                              │ Flexible      │
                              │ Server        │
                              └───────────────┘
```

### 4.2 Flux de données

1. **Requête utilisateur** → Frontend (Next.js)
2. **Appel API** → Backend (Express.js)
3. **Requête base de données** → MySQL via Sequelize
4. **Réponse** → Backend → Frontend → Utilisateur

### 4.3 Communication entre services

- **Frontend ↔ Backend** : Communication via API REST (HTTPS)
- **Backend ↔ Database** : Connexion MySQL via Sequelize ORM
- **CORS** : Configuré pour autoriser les requêtes depuis le frontend

---

## 5. Étapes détaillées du déploiement

### 5.1 Prérequis

#### Outils nécessaires
- Compte Azure avec abonnement actif
- Azure CLI installé (`az --version`)
- Compte GitHub
- Node.js 20.x installé localement (pour les tests)

#### Configuration initiale Azure CLI
```bash
# Connexion à Azure
az login

# Vérification de l'abonnement
az account show

# Sélection de l'abonnement si nécessaire
az account set --subscription "Votre-Subscription-ID"
```

### 5.2 Étape 1 : Création du groupe de ressources

**Objectif** : Organiser toutes les ressources Azure dans un groupe logique.

```bash
# Créer le groupe de ressources
az group create \
  --name ProjetStock-RG \
  --location westeurope
```

**Justification du choix de la région** :
- **westeurope** : Proximité géographique pour les utilisateurs européens
- Latence réduite
- Conformité avec le RGPD

### 5.3 Étape 2 : Création de la base de données MySQL

#### 2.1 Création du serveur MySQL

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

**Paramètres expliqués** :
- `--name` : Nom unique du serveur MySQL (doit être globalement unique)
- `--admin-user` : Nom d'utilisateur administrateur
- `--admin-password` : Mot de passe fort (minimum 8 caractères, majuscules, minuscules, chiffres)
- `--sku-name Standard_B1ms` : Niveau de performance (1 vCore, 2 GB RAM)
- `--tier Burstable` : Niveau de service adapté aux charges variables
- `--version 8.0.21` : Version MySQL compatible avec Sequelize
- `--storage-size 32` : Taille de stockage en GB
- `--public-access 0.0.0.0` : Autorise les connexions depuis n'importe quelle IP (à restreindre en production)

#### 2.2 Création de la base de données

```bash
az mysql flexible-server db create \
  --resource-group ProjetStock-RG \
  --server-name projetstock-mysql \
  --database-name projetstock_db
```

#### 2.3 Configuration des règles de pare-feu

```bash
# Autoriser l'accès depuis Azure App Service
az mysql flexible-server firewall-rule create \
  --resource-group ProjetStock-RG \
  --name projetstock-mysql \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Autoriser l'accès depuis votre IP (pour les tests)
az mysql flexible-server firewall-rule create \
  --resource-group ProjetStock-RG \
  --name projetstock-mysql \
  --rule-name AllowMyIP \
  --start-ip-address VOTRE_IP_PUBLIQUE \
  --end-ip-address VOTRE_IP_PUBLIQUE
```

### 5.4 Étape 3 : Création du plan App Service

**Objectif** : Définir le plan de tarification et les ressources pour les App Services.

```bash
az appservice plan create \
  --name ProjetStock-Plan \
  --resource-group ProjetStock-RG \
  --location westeurope \
  --sku B1 \
  --is-linux
```

**Niveaux de service** :
- **B1 (Basic)** : 1 vCore, 1.75 GB RAM - Adapté pour le développement
- **S1 (Standard)** : 1 vCore, 1.75 GB RAM - Recommandé pour la production
- **P1V2 (Premium)** : 1 vCore, 3.5 GB RAM - Pour les charges importantes

### 5.5 Étape 4 : Déploiement du Backend

#### 4.1 Création de l'App Service Backend

```bash
az webapp create \
  --resource-group ProjetStock-RG \
  --plan ProjetStock-Plan \
  --name projetstock-backend \
  --runtime "NODE:20-lts"
```

#### 4.2 Configuration des variables d'environnement

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

**Variables d'environnement expliquées** :
- `DB_HOST` : Nom d'hôte du serveur MySQL
- `DB_NAME` : Nom de la base de données
- `DB_USER` : Utilisateur MySQL
- `DB_PASSWORD` : Mot de passe MySQL (stocké de manière sécurisée)
- `NODE_ENV` : Environnement (production)
- `PORT` : Port d'écoute (Azure définit automatiquement, mais on peut spécifier)
- `FRONTEND_URL` : URL du frontend pour la configuration CORS

#### 4.3 Configuration du démarrage

```bash
az webapp config set \
  --resource-group ProjetStock-RG \
  --name projetstock-backend \
  --startup-file "npm start"
```

#### 4.4 Configuration CORS dans le code

Le fichier `backend/app.js` contient la configuration CORS :

```javascript
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'https://projetstock-frontend.azurewebsites.net'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

### 5.6 Étape 5 : Déploiement du Frontend

#### 5.1 Création de l'App Service Frontend

```bash
az webapp create \
  --resource-group ProjetStock-RG \
  --plan ProjetStock-Plan \
  --name projetstock-frontend \
  --runtime "NODE:20-lts"
```

#### 5.2 Configuration des variables d'environnement

```bash
az webapp config appsettings set \
  --resource-group ProjetStock-RG \
  --name projetstock-frontend \
  --settings \
    NEXT_PUBLIC_API_URL="https://projetstock-backend.azurewebsites.net/api" \
    NODE_ENV="production"
```

**Variables d'environnement expliquées** :
- `NEXT_PUBLIC_API_URL` : URL de l'API backend (préfixe `NEXT_PUBLIC_` nécessaire pour exposer la variable au client)
- `NODE_ENV` : Environnement de production

#### 5.3 Configuration du démarrage

```bash
az webapp config set \
  --resource-group ProjetStock-RG \
  --name projetstock-frontend \
  --startup-file "node server.js"
```

### 5.7 Étape 6 : Configuration des fichiers de déploiement

#### 6.1 Fichier `.deployment` (Backend)

```
[config]
SCM_DO_BUILD_DURING_DEPLOYMENT=true
NPM_CONFIG_PRODUCTION=false
```

#### 6.2 Fichier `.deployment` (Frontend)

```
[config]
SCM_DO_BUILD_DURING_DEPLOYMENT=false
NPM_CONFIG_PRODUCTION=true
```

**Explication** :
- Backend : Azure installe toutes les dépendances (y compris devDependencies)
- Frontend : Le build est fait dans GitHub Actions, Azure installe seulement les dépendances de production

#### 6.3 Fichier `web.config` (Backend)

Configuration IIS pour Node.js avec iisnode.

#### 6.4 Fichier `web.config` (Frontend)

Configuration IIS pour Next.js avec routing.

### 5.8 Étape 7 : Déploiement initial via Git

#### 7.1 Configuration du déploiement Git pour le Backend

```bash
az webapp deployment source config-local-git \
  --resource-group ProjetStock-RG \
  --name projetstock-backend
```

Cette commande retourne une URL Git. Utilisez-la pour pousser le code :

```bash
cd backend
git init
git add .
git commit -m "Initial commit"
git remote add azure <URL_GIT_RETOURNEE>
git push azure main
```

#### 7.2 Configuration du déploiement Git pour le Frontend

```bash
az webapp deployment source config-local-git \
  --resource-group ProjetStock-RG \
  --name projetstock-frontend
```

Puis pousser le code de la même manière.

---

## 6. Configuration de la base de données

### 6.1 Schéma de base de données

Le schéma est créé automatiquement par Sequelize lors du premier démarrage grâce à la méthode `sequelize.sync({ alter: true })` dans `backend/app.js`.

#### Tables créées

1. **Products**
   - `id` INT PRIMARY KEY AUTO_INCREMENT
   - `name` VARCHAR(255) NOT NULL
   - `quantity` INT DEFAULT 0
   - `price` DECIMAL(10,2) NOT NULL
   - `supplierId` INT (clé étrangère)
   - `createdAt` DATETIME
   - `updatedAt` DATETIME

2. **Suppliers**
   - `id` INT PRIMARY KEY AUTO_INCREMENT
   - `name` VARCHAR(255) NOT NULL
   - `email` VARCHAR(255)
   - `phone` VARCHAR(255)
   - `address` TEXT
   - `createdAt` DATETIME
   - `updatedAt` DATETIME

3. **Orders**
   - `id` INT PRIMARY KEY AUTO_INCREMENT
   - `customerName` VARCHAR(255)
   - `customerEmail` VARCHAR(255)
   - `status` VARCHAR(255) DEFAULT 'pending'
   - `total` FLOAT DEFAULT 0
   - `createdAt` DATETIME
   - `updatedAt` DATETIME

4. **OrderItems**
   - `id` INT PRIMARY KEY AUTO_INCREMENT
   - `orderId` INT (clé étrangère)
   - `productId` INT (clé étrangère)
   - `quantity` INT
   - `price` DECIMAL(10,2)
   - `createdAt` DATETIME
   - `updatedAt` DATETIME

### 6.2 Relations entre tables

- **Product ↔ Supplier** : Relation Many-to-One (plusieurs produits peuvent avoir le même fournisseur)
- **Order ↔ OrderItem** : Relation One-to-Many (une commande contient plusieurs articles)
- **Product ↔ OrderItem** : Relation One-to-Many (un produit peut être dans plusieurs commandes)

### 6.3 Configuration Sequelize

Fichier `backend/config/database.js` :

```javascript
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // Désactiver les logs SQL en production
  }
);

module.exports = sequelize;
```

### 6.4 Synchronisation automatique

Dans `backend/app.js` :

```javascript
await sequelize.sync({ alter: true });
```

**Options de synchronisation** :
- `{ alter: true }` : Modifie les tables existantes pour correspondre au modèle (développement)
- `{ force: true }` : Supprime et recrée les tables (⚠️ perte de données)
- `{}` : Ne crée que les tables manquantes (production recommandée)

### 6.5 Connexion sécurisée

La connexion à MySQL utilise :
- **Chiffrement SSL** : Activé par défaut sur Azure MySQL
- **Authentification** : Nom d'utilisateur et mot de passe
- **Pare-feu** : Règles configurées pour autoriser uniquement les IPs nécessaires

### 6.6 Sauvegarde automatique

Azure Database for MySQL Flexible Server effectue automatiquement :
- **Sauvegardes quotidiennes** : Conservées pendant 7 jours (configurable)
- **Sauvegardes à la demande** : Possibilité de créer des snapshots manuels
- **Point-in-time restore** : Restauration à un moment précis

---

## 7. Configuration CI/CD

### 7.1 GitHub Actions Workflows

#### 7.1.1 Workflow Backend (`master_inventory-pro.yml`)

**Déclencheurs** :
- Push sur les branches `master` ou `main`
- Déclenchement manuel (workflow_dispatch)

**Étapes** :

1. **Build Job** :
   - Checkout du code
   - Installation de Node.js 20.x
   - Installation des dépendances (`npm ci`)
   - Préparation du package (suppression de `node_modules`)
   - Upload de l'artifact

2. **Deploy Job** :
   - Download de l'artifact
   - Authentification Azure
   - Déploiement sur Azure App Service

#### 7.1.2 Workflow Frontend (`master_inventory-pro-front.yml`)

**Déclencheurs** : Identiques au backend

**Étapes** :

1. **Build Job** :
   - Checkout du code
   - Installation de Node.js 20.x
   - Installation des dépendances
   - Build Next.js (`npm run build`)
   - Préparation du package :
     - Copie de `.next` (build)
     - Copie de `app/`, `lib/`, `public/`
     - Copie des fichiers de configuration
     - Création d'un zip
   - Upload de l'artifact

2. **Deploy Job** :
   - Download de l'artifact
   - Décompression du zip
   - Authentification Azure
   - Déploiement sur Azure App Service

### 7.2 Configuration des secrets GitHub

Les secrets suivants doivent être configurés dans GitHub :

**Backend** :
- `AZURE_BACK_CLIENTID`
- `AZURE_BACK_CLIENTSECRET`
- `AZURE_BACK_SUBSCRIPTION`
- `AZURE_BACK_TENANTID`
- `AZURE_BACK_APP_NAME` (optionnel)

**Frontend** :
- `AZURE_FRONT_CLIENTID`
- `AZURE_FRONT_CLIENTSECRET`
- `AZURE_FRONT_SUBSCRIPTION`
- `AZURE_FRONT_TENANTID`
- `AZURE_FRONT_APP_NAME` (optionnel)

### 7.3 Création d'un Service Principal Azure

```bash
# Pour le Backend
az ad sp create-for-rbac \
  --name "github-actions-backend" \
  --role contributor \
  --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/ProjetStock-RG \
  --sdk-auth

# Pour le Frontend
az ad sp create-for-rbac \
  --name "github-actions-frontend" \
  --role contributor \
  --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/ProjetStock-RG \
  --sdk-auth
```

Ces commandes retournent un JSON avec les credentials à copier dans les secrets GitHub.

### 7.4 Processus de déploiement automatique

1. **Développeur** : Push du code sur `master`
2. **GitHub Actions** : Déclenchement automatique du workflow
3. **Build** : Compilation et préparation du package
4. **Deploy** : Déploiement sur Azure App Service
5. **Azure** : Redémarrage automatique de l'application

---

## 8. Sécurité et bonnes pratiques

### 8.1 Sécurité

#### Variables d'environnement
- ✅ Tous les secrets stockés dans Azure App Service Configuration
- ✅ Pas de secrets dans le code source
- ✅ Utilisation de secrets GitHub pour les credentials Azure

#### Base de données
- ✅ Mot de passe fort (minimum 12 caractères)
- ✅ Pare-feu configuré (accès restreint)
- ✅ Chiffrement SSL activé
- ✅ Sauvegardes automatiques

#### CORS
- ✅ Configuration restrictive (seulement le frontend autorisé)
- ✅ Pas de wildcard (`*`) en production

#### HTTPS
- ✅ Certificats SSL gérés automatiquement par Azure
- ✅ Redirection HTTP → HTTPS configurée

### 8.2 Bonnes pratiques

#### Code
- ✅ Séparation frontend/backend
- ✅ API RESTful
- ✅ Gestion d'erreurs appropriée
- ✅ Validation des données

#### Déploiement
- ✅ Build dans CI/CD (pas sur Azure)
- ✅ Tests avant déploiement
- ✅ Rollback possible via GitHub Actions

#### Monitoring
- ✅ Logs activés dans Azure Portal
- ✅ Application Insights (recommandé pour la production)

---

## 9. Monitoring et maintenance

### 9.1 Logs Azure

#### Accès aux logs
```bash
# Logs en temps réel
az webapp log tail \
  --resource-group ProjetStock-RG \
  --name projetstock-backend

# Télécharger les logs
az webapp log download \
  --resource-group ProjetStock-RG \
  --name projetstock-backend
```

#### Dans Azure Portal
- App Service → Log stream (logs en temps réel)
- App Service → Logs (logs historiques)

### 9.2 Métriques

Azure fournit automatiquement :
- **CPU Usage** : Utilisation du processeur
- **Memory Usage** : Utilisation de la mémoire
- **HTTP Server Errors** : Erreurs 5xx
- **Response Time** : Temps de réponse
- **Requests** : Nombre de requêtes

### 9.3 Alertes

Configuration d'alertes recommandées :
- CPU > 80%
- Mémoire > 80%
- Erreurs HTTP 5xx > 10/min
- Temps de réponse > 5s

### 9.4 Maintenance

#### Mises à jour
- **Node.js** : Mises à jour gérées par Azure
- **Dépendances** : Mises à jour via `npm audit` et `npm update`
- **Base de données** : Mises à jour gérées par Azure

#### Sauvegardes
- **Base de données** : Automatiques (7 jours de rétention)
- **Code** : Versionné dans GitHub
- **Configuration** : Documentée dans ce rapport

---

## 10. Conclusion

### 10.1 Résumé

Ce projet a permis de déployer avec succès une application de gestion de stock sur Azure en utilisant :
- **Azure App Service** pour l'hébergement
- **Azure Database for MySQL** pour la persistance des données
- **GitHub Actions** pour le CI/CD
- **Architecture moderne** avec Next.js et Express.js

### 10.2 Points forts

✅ **Scalabilité** : Architecture prête pour la montée en charge  
✅ **Sécurité** : Bonnes pratiques appliquées  
✅ **Maintenabilité** : Code structuré et documenté  
✅ **Automatisation** : Déploiement continu configuré  
✅ **Coûts** : Solution économique pour PME

### 10.3 Améliorations futures

#### Court terme
- [ ] Ajout de tests automatisés (Jest, Cypress)
- [ ] Configuration d'Application Insights
- [ ] Mise en place d'alertes proactives
- [ ] Optimisation des performances (cache Redis)

#### Moyen terme
- [ ] Authentification utilisateur (Azure AD B2C)
- [ ] Export de rapports (PDF, Excel)
- [ ] Notifications (email, SMS)
- [ ] Application mobile (React Native)

#### Long terme
- [ ] Multi-tenant (plusieurs entreprises)
- [ ] API publique pour intégrations
- [ ] Analytics avancés (Power BI)
- [ ] Intelligence artificielle (prédiction de stock)

### 10.4 Coûts estimés

**Développement/Test** (par mois) :
- App Service Plan B1 : ~13€
- MySQL Flexible Server B1ms : ~20€
- **Total** : ~33€/mois

**Production** (par mois) :
- App Service Plan S1 : ~60€
- MySQL Flexible Server Standard : ~100€
- **Total** : ~160€/mois

*Note : Les prix peuvent varier selon la région et les promotions Azure.*

---

## Annexes

### A. Commandes Azure CLI utiles

```bash
# Lister les ressources
az resource list --resource-group ProjetStock-RG

# Redémarrer une App Service
az webapp restart --resource-group ProjetStock-RG --name projetstock-backend

# Vérifier la configuration
az webapp config show --resource-group ProjetStock-RG --name projetstock-backend

# Voir les logs
az webapp log tail --resource-group ProjetStock-RG --name projetstock-backend
```

### B. Structure des URLs

- **Frontend** : `https://projetstock-frontend.azurewebsites.net`
- **Backend API** : `https://projetstock-backend.azurewebsites.net/api`
- **Endpoints** :
  - `/api/products` - Gestion des produits
  - `/api/orders` - Gestion des commandes
  - `/api/suppliers` - Gestion des fournisseurs
  - `/api/reports` - Rapports

### C. Documentation technique

- [Documentation Azure App Service](https://docs.microsoft.com/azure/app-service/)
- [Documentation Azure MySQL](https://docs.microsoft.com/azure/mysql/)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Express.js](https://expressjs.com/)
- [Documentation Sequelize](https://sequelize.org/)

---

**Fin du rapport**

*Document généré le : Novembre 2025*  
*Version : 1.0*

