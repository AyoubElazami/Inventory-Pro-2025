# Script de déploiement Backend et Base de données sur Azure
# Usage: .\deploy-backend.ps1

Write-Host "=== Déploiement Backend et Base de données ===" -ForegroundColor Green

# Variables à configurer
$resourceGroup = "ProjetStock-RG"
$location = "westeurope"
$mysqlServerName = "projetstock-mysql"
$dbName = "projetstock_db"
$dbUser = "adminuser"
$backendAppName = "projetstock-backend"
$frontendAppName = "projetstock-frontend"  # Remplacez par votre nom d'app frontend
$appServicePlan = "ProjetStock-Plan"

# Demander le mot de passe MySQL
$dbPassword = Read-Host "Entrez un mot de passe fort pour MySQL (min 8 caractères, majuscules, minuscules, chiffres)" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
)

Write-Host "`n1. Vérification de la connexion Azure..." -ForegroundColor Yellow
az account show
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erreur: Vous devez être connecté à Azure. Exécutez: az login" -ForegroundColor Red
    exit 1
}

Write-Host "`n2. Création du groupe de ressources..." -ForegroundColor Yellow
az group create --name $resourceGroup --location $location

Write-Host "`n3. Création du serveur MySQL..." -ForegroundColor Yellow
az mysql flexible-server create `
    --resource-group $resourceGroup `
    --name $mysqlServerName `
    --location $location `
    --admin-user $dbUser `
    --admin-password $dbPasswordPlain `
    --sku-name Standard_B1ms `
    --tier Burstable `
    --version 8.0.21 `
    --storage-size 32 `
    --public-access 0.0.0.0

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erreur lors de la création du serveur MySQL" -ForegroundColor Red
    exit 1
}

Write-Host "`n4. Création de la base de données..." -ForegroundColor Yellow
az mysql flexible-server db create `
    --resource-group $resourceGroup `
    --server-name $mysqlServerName `
    --database-name $dbName

Write-Host "`n5. Configuration des règles de pare-feu..." -ForegroundColor Yellow
# Autoriser Azure Services
az mysql flexible-server firewall-rule create `
    --resource-group $resourceGroup `
    --name $mysqlServerName `
    --rule-name AllowAzureServices `
    --start-ip-address 0.0.0.0 `
    --end-ip-address 0.0.0.0

# Obtenir l'IP publique actuelle
$myIP = (Invoke-WebRequest -Uri "https://ifconfig.me" -UseBasicParsing).Content.Trim()
Write-Host "Votre IP publique: $myIP" -ForegroundColor Cyan

az mysql flexible-server firewall-rule create `
    --resource-group $resourceGroup `
    --name $mysqlServerName `
    --rule-name AllowMyIP `
    --start-ip-address $myIP `
    --end-ip-address $myIP

Write-Host "`n6. Création du plan App Service..." -ForegroundColor Yellow
az appservice plan create `
    --name $appServicePlan `
    --resource-group $resourceGroup `
    --location $location `
    --sku B1 `
    --is-linux

Write-Host "`n7. Création de l'App Service Backend..." -ForegroundColor Yellow
az webapp create `
    --resource-group $resourceGroup `
    --plan $appServicePlan `
    --name $backendAppName `
    --runtime "NODE:20-lts"

Write-Host "`n8. Configuration des variables d'environnement..." -ForegroundColor Yellow
$frontendUrl = "https://$frontendAppName.azurewebsites.net"
$dbHost = "$mysqlServerName.mysql.database.azure.com"

az webapp config appsettings set `
    --resource-group $resourceGroup `
    --name $backendAppName `
    --settings `
    DB_HOST=$dbHost `
    DB_NAME=$dbName `
    DB_USER=$dbUser `
    DB_PASSWORD=$dbPasswordPlain `
    NODE_ENV="production" `
    PORT="4000" `
    FRONTEND_URL=$frontendUrl

Write-Host "`n9. Configuration du démarrage..." -ForegroundColor Yellow
az webapp config set `
    --resource-group $resourceGroup `
    --name $backendAppName `
    --startup-file "npm start"

Write-Host "`n10. Configuration du déploiement Git..." -ForegroundColor Yellow
$gitUrl = az webapp deployment source config-local-git `
    --resource-group $resourceGroup `
    --name $backendAppName `
    --query url `
    -o tsv

Write-Host "`n=== Déploiement terminé ===" -ForegroundColor Green
Write-Host "`nURL Git pour déployer le code:" -ForegroundColor Cyan
Write-Host $gitUrl -ForegroundColor White

Write-Host "`nPour déployer le code, exécutez dans le dossier backend:" -ForegroundColor Yellow
Write-Host "  git init" -ForegroundColor White
Write-Host "  git add ." -ForegroundColor White
Write-Host "  git commit -m 'Initial commit'" -ForegroundColor White
Write-Host "  git remote add azure $gitUrl" -ForegroundColor White
Write-Host "  git push azure main" -ForegroundColor White

Write-Host "`nURL de l'API Backend:" -ForegroundColor Cyan
Write-Host "  https://$backendAppName.azurewebsites.net/api" -ForegroundColor White

Write-Host "`nPour voir les logs:" -ForegroundColor Yellow
Write-Host "  az webapp log tail --resource-group $resourceGroup --name $backendAppName" -ForegroundColor White

