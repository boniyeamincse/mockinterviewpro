# MOC - Mock Interview Platform Backend API
## Complete Installation Guide

---

## Table of Contents
1. [Quick Start](#quick-start)
2. [System Requirements](#system-requirements)
3. [Installation Steps](#installation-steps)
4. [Verification](#verification)
5. [Troubleshooting](#troubleshooting)
6. [Quick Reference](#quick-reference)

---

## Quick Start

```bash
# Clone repository
git clone <repo-url> moc
cd moc

# Install dependencies
composer install

# Setup environment
cp .env.example .env
php artisan key:generate
php artisan jwt:secret

# Setup database
php artisan migrate
php artisan db:seed

# Start server
php artisan serve
```

**Server running at:** `http://localhost:8000`

---

## System Requirements

### Minimum Requirements
- **PHP:** 8.1 or higher
- **MySQL:** 8.0 or higher
- **Composer:** 2.0 or higher
- **Node.js:** 16+ (for frontend integration)
- **RAM:** 2GB
- **Disk Space:** 500MB

### Required PHP Extensions
```
- openssl
- pdo
- mbstring
- tokenizer
- json
- bcmath
- ctype
- fileinfo
- curl
- xml
```

### Installation Verification

```bash
# Check PHP version (should be 8.1+)
php --version

# Check Composer
composer --version

# Check MySQL
mysql --version

# Verify PHP extensions
php -m | grep -E 'openssl|pdo|mbstring|tokenizer|json|bcmath|ctype'
```

---

## Installation Steps

### Step 1: Prerequisites Installation

#### macOS (using Homebrew)
```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PHP 8.1
brew tap shivammathur/php
brew install shivammathur/php/php@8.1

# Install MySQL
brew install mysql

# Install Composer
brew install composer

# Install Node.js
brew install node
```

#### Ubuntu/Debian
```bash
# Update package manager
sudo apt update
sudo apt upgrade

# Install PHP 8.1
sudo apt install php8.1 php8.1-cli php8.1-fpm php8.1-mysql php8.1-mbstring php8.1-xml php8.1-curl php8.1-json php8.1-bcmath php8.1-tokenizer php8.1-ctype php8.1-fileinfo

# Install MySQL
sudo apt install mysql-server

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs
```

#### Windows
1. Download PHP 8.1 from [php.net](https://windows.php.net/download)
2. Download MySQL from [mysql.com](https://dev.mysql.com/downloads/mysql)
3. Download Composer from [getcomposer.org](https://getcomposer.org)
4. Download Node.js from [nodejs.org](https://nodejs.org)

---

### Step 2: Clone Repository

```bash
# Clone the MOC backend repository
git clone https://github.com/yourorg/moc.git moc

# Navigate to project
cd moc

# Verify files
ls -la

# Expected files:
# app/
# bootstrap/
# config/
# database/
# public/
# resources/
# routes/
# storage/
# tests/
# .env.example
# artisan
# composer.json
# package.json
```

---

### Step 3: Install PHP Dependencies

```bash
# Install Composer dependencies
composer install

# Expected output:
# Installing dependencies from lock file
# - Installing [packages...]
# ...
# [OK] 50+ packages installed successfully

# Verify installation
composer show
```

---

### Step 4: Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Expected output:
# Application key set successfully.
```

---

### Step 5: Database Setup

#### Create Database

```bash
# MySQL (command line)
mysql -u root -p

# In MySQL prompt:
> CREATE DATABASE moc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> EXIT;

# Or use MySQL GUI (PHPMyAdmin, Sequel Pro, DBeaver)
```

#### Update .env File

```bash
# Open .env and update database credentials
nano .env

# Find and modify:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=moc
DB_USERNAME=root
DB_PASSWORD=your_password
```

#### Run Migrations

```bash
# Run all migrations
php artisan migrate

# Expected output:
# Migration table created successfully.
# Migrated: 2024_01_01_000000_create_users_table
# Migrated: 2024_01_01_000001_create_students_table
# ...
# [OK] All migrations completed successfully

# Verify database
mysql -u root -p -e "use moc; SHOW TABLES;"
```

#### Seed Database (Optional)

```bash
# Run all seeders
php artisan db:seed

# Or run specific seeders
php artisan db:seed --class=CategorySeeder
php artisan db:seed --class=UserSeeder

# Expected output:
# Seeding: CategorySeeder
# Seeded: CategorySeeder (0.25s)
# [OK] Database seeding completed successfully
```

---

### Step 6: JWT Configuration

```bash
# Generate JWT secret
php artisan jwt:secret

# Expected output:
# jwt-secret set successfully.

# Verify in .env
grep JWT .env

# Expected:
# JWT_SECRET=xxxxxxxxxxxxx
# JWT_ALGORITHM=HS256
# JWT_EXPIRES_IN=3600
```

---

### Step 7: Storage & Permissions

```bash
# Create storage symbolic link
php artisan storage:link

# Set directory permissions
chmod -R 755 storage bootstrap/cache

# For production (Linux/macOS)
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 755 storage bootstrap/cache
```

---

### Step 8: Install NPM Dependencies (Optional)

```bash
# Install Node dependencies for frontend build
npm install

# Install specific packages if needed
npm install axios cors dotenv
```

---

### Step 9: Start Development Server

```bash
# Method 1: Using Laravel Artisan
php artisan serve

# Expected output:
# Starting Laravel development server: http://127.0.0.1:8000
# [Mon Jan 15 10:30:00 2024] PHP 8.1.0 Development Server

# Method 2: On different host/port
php artisan serve --host=0.0.0.0 --port=8000

# Method 3: Using Valet (macOS)
valet link moc
# Access at: http://moc.test
```

---

### Step 10: Verify Installation

```bash
# Test API endpoint
curl -X GET http://localhost:8000/api/v1/categories

# Expected response:
# {"data": [...], "message": "Categories retrieved successfully"}

# Or use Postman
# Import: docs/postman_collection.json
# Test: GET http://localhost:8000/api/v1/categories
```

---

## Verification

### Health Checks

```bash
# Check Laravel installation
php artisan about

# Expected output:
# Application name: MOC
# Laravel version: 10.x.x
# PHP version: 8.1.x
# ...

# Check database connection
php artisan tinker
> DB::connection()->getPdo()
# Should return PDO object

# Check JWT
> Tymon\JWTAuth\Facades\JWTAuth::fromUser(User::first())
# Should return a token
```

### API Testing

```bash
# Register new user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password@123",
    "password_confirmation": "Password@123",
    "role": "student"
  }'

# Expected response:
# {
#   "message": "User registered successfully",
#   "user": {...},
#   "access_token": "eyJhbGc...",
#   "token_type": "Bearer",
#   "expires_in": 3600
# }

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password@123"
  }'

# Get current user (use token from login)
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Troubleshooting

### Common Issues & Solutions

#### 1. Composer Dependency Issues

```bash
# Clear composer cache
composer clear-cache

# Remove lock file and reinstall
rm composer.lock
composer install

# Update to latest versions
composer update
```

#### 2. Database Connection Error

```bash
# Test MySQL connection
mysql -u root -p
> SELECT 1;
> EXIT;

# Verify .env database settings
cat .env | grep DB_

# Check MySQL service (macOS)
brew services list | grep mysql

# Start MySQL (macOS)
brew services start mysql

# Start MySQL (Ubuntu)
sudo service mysql start
```

#### 3. PHP Extension Missing

```bash
# Install missing extension (Ubuntu)
sudo apt install php8.1-{extension-name}

# Restart PHP-FPM
sudo service php8.1-fpm restart

# Verify extension installed
php -m | grep {extension-name}
```

#### 4. Storage Permission Error

```bash
# Fix ownership (Linux)
sudo chown -R www-data:www-data /path/to/moc
sudo chmod -R 755 /path/to/moc/storage
sudo chmod -R 755 /path/to/moc/bootstrap/cache

# Fix permissions (macOS)
sudo chown -R $(whoami) storage bootstrap/cache
chmod -R 755 storage bootstrap/cache
```

#### 5. Port 8000 Already in Use

```bash
# Use different port
php artisan serve --port=8001

# Find and kill process using port 8000
lsof -i :8000
kill -9 <PID>

# Or use port range
php artisan serve --host=0.0.0.0 --port=8080
```

#### 6. JWT Secret Not Generated

```bash
# Regenerate JWT secret
php artisan jwt:secret

# Verify in .env
grep JWT_SECRET .env

# Should see: JWT_SECRET=xxxxxxxxxxxxx
```

#### 7. CORS Issues

```bash
# Verify CORS configuration
cat config/cors.php

# Update if needed
# Add frontend URL to allowed_origins
'allowed_origins' => ['http://localhost:3000'],

# Clear config cache
php artisan config:clear
php artisan config:cache
```

#### 8. Migration Errors

```bash
# Rollback migrations
php artisan migrate:rollback

# Fresh migration (WARNING: deletes data)
php artisan migrate:fresh

# Run migrations step by step
php artisan migrate:refresh --seed
```

---

## Quick Reference

### Useful Artisan Commands

```bash
# Server
php artisan serve                              # Start dev server
php artisan serve --port=8001                  # Custom port

# Database
php artisan migrate                            # Run migrations
php artisan migrate:rollback                   # Rollback migrations
php artisan db:seed                            # Seed database
php artisan tinker                             # Interactive shell

# Cache
php artisan cache:clear                        # Clear all caches
php artisan config:clear                       # Clear config cache
php artisan config:cache                       # Cache config

# Logs
tail -f storage/logs/laravel.log               # Watch logs

# Testing
php artisan test                               # Run tests
php artisan test --coverage                    # With coverage

# Optimization
php artisan optimize                           # Optimize app
php artisan optimize:clear                     # Clear optimization
```

### Useful File Locations

```
moc/
├── .env                          # Configuration file
├── artisan                        # Command runner
├── routes/
│   └── api.php                  # API routes
├── app/
│   ├── Http/Controllers/        # Controllers
│   ├── Models/                  # Database models
│   └── Services/                # Business logic
├── database/
│   ├── migrations/              # Database migrations
│   └── seeders/                 # Database seeders
├── storage/
│   └── logs/laravel.log         # Application logs
├── config/
│   ├── app.php                  # App config
│   ├── auth.php                 # Auth config
│   ├── database.php             # Database config
│   └── jwt.php                  # JWT config
└── tests/                       # Test files
```

### Environment Variables

```env
# App
APP_NAME=MOC
APP_ENV=local
APP_KEY=base64:xxxxx
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=moc
DB_USERNAME=root
DB_PASSWORD=

# JWT
JWT_SECRET=xxxxx
JWT_ALGORITHM=HS256
JWT_EXPIRES_IN=3600

# Mail
MAIL_DRIVER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=587
MAIL_USERNAME=xxxxx
MAIL_PASSWORD=xxxxx
MAIL_FROM_ADDRESS=noreply@mockinterviewplatform.com
```

### Project Structure Overview

```
moc/
├── app/                         # Application code
│   ├── Http/Controllers/        # Request handlers
│   ├── Http/Middleware/         # Middleware
│   ├── Http/Requests/           # Form requests
│   ├── Models/                  # Eloquent models
│   ├── Services/                # Business logic
│   └── Resources/               # API resources
├── bootstrap/                   # Bootstrap files
├── config/                      # Configuration files
├── database/
│   ├── migrations/              # Database migrations
│   └── seeders/                 # Database seeders
├── public/
│   └── index.php                # Entry point
├── resources/                   # Views and assets
├── routes/
│   ├── api.php                  # API routes
│   └── web.php                  # Web routes
├── storage/
│   ├── app/                     # File storage
│   ├── logs/                    # Application logs
│   └── framework/               # Framework storage
├── tests/                       # Test files
├── .env                         # Environment variables
├── .gitignore                   # Git ignore
├── artisan                      # Laravel command runner
├── composer.json                # PHP dependencies
└── package.json                 # Node dependencies
```

---

## Next Steps

1. **Frontend Setup:** Follow the React frontend installation guide
2. **API Testing:** Import Postman collection and test endpoints
3. **Database:** Review and customize database schema
4. **Development:** Start developing features
5. **Deployment:** Follow production deployment guide

---

## Support & Resources

- **Laravel Documentation:** https://laravel.com/docs
- **JWT Documentation:** https://jwt-auth.readthedocs.io
- **Laravel API:** https://laravel.com/api
- **Project Documentation:** See `/docs` folder
- **Issue Tracker:** GitHub Issues

---

## Troubleshooting Checklist

- [ ] PHP 8.1+ installed
- [ ] MySQL running and accessible
- [ ] Composer installed
- [ ] Repository cloned
- [ ] `composer install` completed
- [ ] `.env` file created and configured
- [ ] `php artisan key:generate` executed
- [ ] `php artisan jwt:secret` executed
- [ ] Database created
- [ ] `php artisan migrate` completed
- [ ] `php artisan serve` running
- [ ] API endpoints responding
- [ ] JWT authentication working

---

*Last Updated: May 18, 2026*
*Version: 1.0*
*Project: MOC - Mock Interview Platform Backend API*
