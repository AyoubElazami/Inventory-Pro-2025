# Script de configuration de la base de données après déploiement backend
# Usage: .\setup-database.ps1

Write-Host "=== Configuration de la Base de Données MySQL ===" -ForegroundColor Green

# Variables
$resourceGroup = "Inventoryy22"
$location = "westeurope"
$mysqlServerName = "projetstock-mysql"
$dbName = "projetstock_db"
$dbUser = "adminuser"
$backendAppName = "Inventory-pro1"

# Demander le mot de passe MySQL
Write-Host "`n⚠️  Créez un mot de passe fort pour MySQL" -ForegroundColor Yellow
Write-Host "   (min 8 caractères, majuscules, minuscules, chiffres, caractères spéciaux)" -ForegroundColor Yellow
$dbPassword = Read-Host "Entrez le mot de passe MySQL" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
)

# Demander l'URL du frontend
Write-Host "`nQuel est le nom de votre App Service frontend ?" -ForegroundColor Yellow
$frontendAppName = Read-Host "Nom de l'App Service frontend"
$frontendUrl = "https://$frontendAppName.azurewebsites.net"

Write-Host "`n1. Vérification de la connexion Azure..." -ForegroundColor Yellow
az account show
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erreur: Vous devez être connecté à Azure. Exécutez: az login" -ForegroundColor Red
    exit 1
}

Write-Host "`n2. Création du serveur MySQL..." -ForegroundColor Yellow
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
    Write-Host "Erreur lors de la création du serveur MySQL." -ForegroundColor Red
    Write-Host "Le nom '$mysqlServerName' est peut-être déjà utilisé. Choisissez un autre nom." -ForegroundColor Yellow
    exit 1
}

Write-Host "`n3. Création de la base de données..." -ForegroundColor Yellow
az mysql flexible-server db create `
    --resource-group $resourceGroup `
    --server-name $mysqlServerName `
    --database-name $dbName

Write-Host "`n4. Configuration des règles de pare-feu..." -ForegroundColor Yellow
# Autoriser Azure Services
az mysql flexible-server firewall-rule create `
    --resource-group $resourceGroup `
    --name $mysqlServerName `
    --rule-name AllowAzureServices `
    --start-ip-address 0.0.0.0 `
    --end-ip-address 0.0.0.0

# Obtenir l'IP publique actuelle
try {
    $myIP = (Invoke-WebRequest -Uri "https://ifconfig.me" -UseBasicParsing).Content.Trim()
    Write-Host "Votre IP publique: $myIP" -ForegroundColor Cyan
    
    az mysql flexible-server firewall-rule create `
        --resource-group $resourceGroup `
        --name $mysqlServerName `
        --rule-name AllowMyIP `
        --start-ip-address $myIP `
        --end-ip-address $myIP
} catch {
    Write-Host "Impossible d'obtenir votre IP publique. Vous devrez ajouter manuellement la règle de pare-feu." -ForegroundColor Yellow
}

Write-Host "`n5. Configuration des variables d'environnement du backend..." -ForegroundColor Yellow
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

Write-Host "`n6. Redémarrage du backend..." -ForegroundColor Yellow
az webapp restart `
    --resource-group $resourceGroup `
    --name $backendAppName

Write-Host "`n=== Configuration terminée ===" -ForegroundColor Green
Write-Host "`n📋 Informations de la base de données:" -ForegroundColor Cyan
Write-Host "  - Serveur MySQL: $dbHost" -ForegroundColor White
Write-Host "  - Base de données: $dbName" -ForegroundColor White
Write-Host "  - Utilisateur: $dbUser" -ForegroundColor White
Write-Host "  - Backend: $backendAppName" -ForegroundColor White

Write-Host "`n📝 Prochaines étapes:" -ForegroundColor Yellow
Write-Host "  1. Vérifiez les logs du backend:" -ForegroundColor White
Write-Host "     az webapp log tail --resource-group $resourceGroup --name $backendAppName" -ForegroundColor Gray
Write-Host "  2. Testez l'API:" -ForegroundColor White
Write-Host "     curl https://$backendAppName.azurewebsites.net/api/products" -ForegroundColor Gray
Write-Host "  3. Créez un produit de test:" -ForegroundColor White
Write-Host "     curl -X POST https://$backendAppName.azurewebsites.net/api/products -H 'Content-Type: application/json' -d '{\"name\":\"Test\",\"quantity\":10,\"price\":29.99}'" -ForegroundColor Gray

Write-Host "`n✅ La base de données est configurée et le backend est connecté !" -ForegroundColor Green
Write-Host "   Les tables seront créées automatiquement au prochain démarrage du backend." -ForegroundColor Cyan

