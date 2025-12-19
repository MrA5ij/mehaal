# Mehaal Domain Setup Script (Windows PowerShell)
# یہ script Windows پر domain configuration کے لیے ہے

param(
    [string]$Domain = "",
    [string]$Email = "",
    [string]$ServerIP = "",
    [string]$DBPassword = ""
)

function Write-ColorOutput($color, $message) {
    Write-Host $message -ForegroundColor $color
}

function Get-SecureInput($prompt) {
    $secureString = Read-Host -Prompt $prompt -AsSecureString
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToGlobalAllocUnicode($secureString)
    $plaintext = [System.Runtime.InteropServices.Marshal]::PtrToStringUni($bstr)
    [System.Runtime.InteropServices.Marshal]::ZeroFreeGlobalAllocUnicode($bstr)
    return $plaintext
}

function Test-PasswordStrength($password) {
    if ($password.Length -lt 16) {
        Write-ColorOutput "Red" "✗ Password must be at least 16 characters!"
        return $false
    }
    return $true
}

function Generate-SecretKey {
    $bytes = New-Object byte[] 32
    $random = New-Object System.Security.Cryptography.RNGCryptoServiceProvider
    $random.GetBytes($bytes)
    $key = [System.Convert]::ToBase64String($bytes)
    return $key
}

function Create-NginxConfig($domain, $configPath) {
    $templatePath = "nginx.conf.template"
    
    if (-not (Test-Path $templatePath)) {
        Write-ColorOutput "Red" "✗ nginx.conf.template not found!"
        exit 1
    }
    
    $content = Get-Content $templatePath
    $content = $content -replace '\$\{DOMAIN\}', $domain
    
    Set-Content -Path "nginx.conf" -Value $content
    Write-ColorOutput "Green" "✓ nginx.conf created for $domain"
}

function Create-BackendEnv($domain, $dbPassword, $secretKey, $email) {
    $envContent = @"
# Database
DATABASE_URL=postgresql://mehaal_user:${dbPassword}@postgres:5432/mehaal_db
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=40

# Environment
DEBUG=False
ENVIRONMENT=production

# CORS
CORS_ORIGINS=["https://${domain}","https://www.${domain}"]

# Security
SECRET_KEY=${secretKey}
ALLOWED_HOSTS=["${domain}","www.${domain}","api.${domain}"]

# Email Configuration
ADMIN_EMAIL=${email}

# Logging
LOG_LEVEL=info

# API
API_RATE_LIMIT=1000/hour
"@
    
    Set-Content -Path "backend\.env.prod" -Value $envContent
    Write-ColorOutput "Green" "✓ backend/.env.prod created"
}

function Create-FrontendEnv($domain) {
    $envContent = @"
# Frontend Environment Variables - Production
VITE_API_URL=https://api.${domain}
VITE_APP_NAME=Mehaal
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
"@
    
    Set-Content -Path ".env.production" -Value $envContent
    Write-ColorOutput "Green" "✓ .env.production created"
}

# Main Script
Write-ColorOutput "Cyan" "🚀 Mehaal Domain Setup Script (Windows)"
Write-ColorOutput "Cyan" "========================================"
Write-Host ""

# Step 1: Get domain information
if ([string]::IsNullOrEmpty($Domain)) {
    $Domain = Read-Host "Enter your domain (e.g., yourdomain.com)"
}

if ([string]::IsNullOrEmpty($Email)) {
    $Email = Read-Host "Enter your email for SSL (e.g., admin@yourdomain.com)"
}

if ([string]::IsNullOrEmpty($ServerIP)) {
    $ServerIP = Read-Host "Enter your server IP address"
}

Write-ColorOutput "Green" "✓ Domain: $Domain"
Write-ColorOutput "Green" "✓ Email: $Email"
Write-ColorOutput "Green" "✓ Server IP: $ServerIP"
Write-Host ""

# Step 2: Get database password
Write-ColorOutput "Cyan" "Step 2: Security Settings"
$DBPassword = Get-SecureInput "Enter database password (min 16 chars)"
$DBPasswordConfirm = Get-SecureInput "Confirm password"

if ($DBPassword -ne $DBPasswordConfirm) {
    Write-ColorOutput "Red" "✗ Passwords do not match!"
    exit 1
}

if (-not (Test-PasswordStrength $DBPassword)) {
    exit 1
}

Write-ColorOutput "Green" "✓ Password set"
Write-Host ""

# Step 3: Generate secret key
Write-ColorOutput "Cyan" "Step 3: Generating Security Keys"
$SecretKey = Generate-SecretKey
Write-ColorOutput "Green" "✓ Secret key generated"
Write-Host ""

# Step 4: Create nginx config
Write-ColorOutput "Cyan" "Step 4: Configuring Nginx"
Create-NginxConfig $Domain
Write-Host ""

# Step 5: Create backend .env
Write-ColorOutput "Cyan" "Step 5: Configuring Backend Environment"
Create-BackendEnv $Domain $DBPassword $SecretKey $Email
Write-Host ""

# Step 6: Create frontend .env
Write-ColorOutput "Cyan" "Step 6: Configuring Frontend Environment"
Create-FrontendEnv $Domain
Write-Host ""

# Step 7: Display DNS instructions
Write-ColorOutput "Cyan" "Step 7: DNS Configuration Instructions"
Write-Host ""
Write-ColorOutput "Yellow" "⚠️  IMPORTANT: Add these DNS records to your domain registrar:"
Write-Host ""
Write-Host "Type | Name | Value | TTL"
Write-Host "-----|------|-------|-----"
Write-Host "A    | @    | $ServerIP | 3600"
Write-Host "A    | www  | $ServerIP | 3600"
Write-Host "A    | api  | $ServerIP | 3600"
Write-Host ""
Write-ColorOutput "Yellow" "Check: https://www.whatsmydns.net/"
Write-Host ""

# Step 8: Display SSL instructions
Write-ColorOutput "Cyan" "Step 8: SSL Certificate Setup"
Write-Host ""
Write-ColorOutput "Yellow" "After DNS propagation (24-48 hours), on your Linux server run:"
Write-Host ""
Write-Host "sudo certbot certonly --standalone ``"
Write-Host "  -d $Domain ``"
Write-Host "  -d www.$Domain ``"
Write-Host "  -d api.$Domain ``"
Write-Host "  --email $Email ``"
Write-Host "  -n --agree-tos"
Write-Host ""

# Step 9: Display deployment commands
Write-ColorOutput "Cyan" "Step 9: Deployment Commands"
Write-Host ""
Write-ColorOutput "Yellow" "Copy files to your Linux server:"
Write-Host ""
Write-Host "scp -r . user@${ServerIP}:/var/www/mehaal/"
Write-Host ""
Write-ColorOutput "Yellow" "Then on server run:"
Write-Host ""
Write-Host "cd /var/www/mehaal"
Write-Host "docker-compose -f docker-compose.prod.yml up -d"
Write-Host "docker-compose -f docker-compose.prod.yml exec backend python init_db.py"
Write-Host ""

# Step 10: Create summary
Write-ColorOutput "Green" "════════════════════════════════════════"
Write-ColorOutput "Green" "✓ Configuration Complete!"
Write-ColorOutput "Green" "════════════════════════════════════════"
Write-Host ""

Write-ColorOutput "Yellow" "Files created:"
Write-Host "  ✓ nginx.conf"
Write-Host "  ✓ backend/.env.prod"
Write-Host "  ✓ .env.production"
Write-Host ""

Write-ColorOutput "Yellow" "Next Steps:"
Write-Host "1. Add DNS records to your registrar"
Write-Host "2. Wait 24-48 hours for DNS propagation"
Write-Host "3. Obtain SSL certificate from Let's Encrypt on your server"
Write-Host "4. Deploy using docker-compose"
Write-Host ""

# Save configuration to file
$configSummary = @"
# Mehaal Configuration Summary
# Generated: $(Get-Date)

Domain: $Domain
Email: $Email
Server IP: $ServerIP

DNS Records to Add:
- A record @ -> $ServerIP
- A record www -> $ServerIP
- A record api -> $ServerIP

Files Created:
- nginx.conf
- backend/.env.prod
- .env.production

Next Steps:
1. Add DNS records to your registrar
2. Wait for DNS propagation (24-48 hours)
3. Get SSL certificate: sudo certbot certonly --standalone -d $Domain -d www.$Domain -d api.$Domain
4. Upload to server and deploy with docker-compose
"@

$configSummary | Out-File -FilePath "setup-config-summary.txt" -Encoding UTF8
Write-ColorOutput "Green" "✓ Configuration summary saved to setup-config-summary.txt"
