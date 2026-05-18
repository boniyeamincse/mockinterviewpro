# Mock Interview Platform - Setup & Configuration Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup (Laravel)](#backend-setup-laravel)
3. [Frontend Setup (React)](#frontend-setup-react)
4. [Database Configuration](#database-configuration)
5. [Environment Variables](#environment-variables)
6. [API Configuration](#api-configuration)
7. [Payment Gateway Setup](#payment-gateway-setup)
8. [Video Streaming Setup](#video-streaming-setup)
9. [Email Configuration](#email-configuration)
10. [Local Development](#local-development)
11. [Production Deployment](#production-deployment)
12. [Testing](#testing)

---

## Prerequisites

### System Requirements

**Operating System:**
- Linux (Ubuntu 20.04+), macOS, or Windows (WSL2)

**Software:**
- PHP 8.1+ with extensions: openssl, pdo, mbstring, tokenizer, json, bcmath, ctype, fileinfo
- Node.js 16+ and npm 8+
- MySQL 8.0+ or PostgreSQL 12+
- Composer 2.0+
- Git

### Installation Verification

```bash
# Check PHP version
php --version

# Check Node version
node --version
npm --version

# Check MySQL/PostgreSQL
mysql --version
psql --version

# Check Composer
composer --version

# Check Git
git --version
```

---

## Backend Setup (Laravel)

### Step 1: Clone Repository

```bash
git clone <backend-repo-url>
cd mock-interview-platform
```

### Step 2: Install Dependencies

```bash
# Install PHP dependencies
composer install

# If you need dev dependencies too
composer install --with-all-dependencies
```

### Step 3: Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Generate JWT secret
php artisan jwt:secret
```

### Step 4: Database Setup

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE mock_interview_platform;"

# Run migrations
php artisan migrate

# Seed initial data
php artisan db:seed

# Specific seeder (optional)
php artisan db:seed --class=CategorySeeder
```

### Step 5: Storage Setup

```bash
# Create symbolic link for storage
php artisan storage:link

# Set permissions
chmod -R 755 storage bootstrap/cache
sudo chown -R www-data:www-data storage bootstrap/cache
```

### Step 6: Install JWT Authentication

```bash
# Already included in composer.json, just publish config
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
```

### Step 7: Run Development Server

```bash
# Start Laravel development server
php artisan serve

# Server runs on http://localhost:8000
```

### Step 8: Queue Worker (Optional)

```bash
# For email sending and notifications
php artisan queue:work

# Or in supervisor for production
```

---

## Frontend Setup (React)

### Step 1: Clone Repository

```bash
git clone <frontend-repo-url>
cd mock-interview-web
```

### Step 2: Install Dependencies

```bash
npm install

# If using yarn
yarn install
```

### Step 3: Environment Configuration

```bash
# Create environment file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_AGORA_APP_ID=your_agora_app_id
REACT_APP_STRIPE_KEY=your_stripe_publishable_key
REACT_APP_ENVIRONMENT=development
EOF
```

### Step 4: Run Development Server

```bash
# Start React development server
npm run dev

# Server runs on http://localhost:5173 (Vite) or http://localhost:3000 (CRA)
```

### Step 5: Build for Production

```bash
npm run build

# Output in 'dist' folder
```

---

## Database Configuration

### Create Database

```bash
# MySQL
mysql -u root -p
> CREATE DATABASE mock_interview_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> EXIT;

# PostgreSQL
psql -U postgres
> CREATE DATABASE mock_interview_platform;
> \q
```

### Database Connection (.env)

```env
# MySQL
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mock_interview_platform
DB_USERNAME=root
DB_PASSWORD=

# PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=mock_interview_platform
DB_USERNAME=postgres
DB_PASSWORD=
```

### Run Migrations

```bash
# All migrations
php artisan migrate

# Specific migration
php artisan migrate --path=database/migrations/2024_01_01_000003_create_events_table.php

# Rollback
php artisan migrate:rollback

# Fresh migration (warning: deletes all data)
php artisan migrate:fresh
```

### Database Backup

```bash
# MySQL backup
mysqldump -u root -p mock_interview_platform > backup.sql

# Restore
mysql -u root -p mock_interview_platform < backup.sql

# PostgreSQL backup
pg_dump mock_interview_platform > backup.sql

# Restore
psql mock_interview_platform < backup.sql
```

---

## Environment Variables

### Laravel (.env)

```env
APP_NAME="Mock Interview Platform"
APP_ENV=local
APP_KEY=base64:xxxxx
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mock_interview_platform
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
MAIL_FROM_NAME="Mock Interview Platform"

# Redis (optional)
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Payment Gateway
STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Video Service (Agora)
AGORA_APP_ID=xxxxx
AGORA_APP_CERTIFICATE=xxxxx

# File Storage
FILESYSTEM_DISK=public
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=

# Queue
QUEUE_CONNECTION=database
```

### React (.env)

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_AGORA_APP_ID=your_agora_app_id
REACT_APP_STRIPE_KEY=pk_test_xxxxx
REACT_APP_ENVIRONMENT=development
REACT_APP_LOG_LEVEL=debug
```

### Production (.env.production)

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://mockinterviewplatform.com

DB_CONNECTION=mysql
DB_HOST=db.example.com
DB_PORT=3306
DB_DATABASE=mock_interview_production
DB_USERNAME=prod_user
DB_PASSWORD=secure_password_here

JWT_SECRET=secure_jwt_secret_here

MAIL_DRIVER=ses
MAIL_HOST=email-smtp.region.amazonaws.com
MAIL_PORT=587

STRIPE_SECRET_KEY=sk_live_xxxxx
AGORA_APP_ID=production_agora_id
```

---

## API Configuration

### CORS Configuration

```php
// config/cors.php
'paths' => ['api/*'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:3000', 'https://example.com'],
'allowed_origins_patterns' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => ['Authorization'],
'max_age' => 0,
'supports_credentials' => true,
```

### Rate Limiting

```php
// config/rate-limit.php
// In routes/api.php
Route::middleware(['throttle:60,1'])->group(function () {
    Route::post('/auth/login', 'AuthController@login');
    Route::post('/auth/register', 'AuthController@register');
});

Route::middleware(['auth:api', 'throttle:300,1'])->group(function () {
    // Authenticated routes
});
```

### API Versioning

```php
// routes/api.php
Route::prefix('v1')->group(function () {
    // API v1 routes
    Route::post('/auth/login', 'AuthController@login');
});

Route::prefix('v2')->group(function () {
    // API v2 routes (future)
});
```

---

## Payment Gateway Setup

### Stripe Configuration

```bash
# Install Stripe package
composer require stripe/stripe-php
```

```php
// app/Services/StripeService.php
class StripeService {
    public function __construct() {
        \Stripe\Stripe::setApiKey(config('services.stripe.secret'));
    }
    
    public function createPaymentIntent($amount) {
        return \Stripe\PaymentIntent::create([
            'amount' => $amount * 100, // Convert to cents
            'currency' => 'usd',
            'payment_method_types' => ['card'],
        ]);
    }
}
```

### Webhook Setup

```php
// app/Http/Controllers/StripeWebhookController.php
public function handleWebhook(Request $request) {
    $payload = $request->getContent();
    $event = json_decode($payload);
    
    switch($event->type) {
        case 'payment_intent.succeeded':
            // Handle successful payment
            break;
        case 'payment_intent.payment_failed':
            // Handle failed payment
            break;
    }
}
```

### React Stripe Integration

```jsx
// src/components/PaymentForm.jsx
import { loadStripe } from '@stripe/js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-js';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)
    });
    
    // Send to backend
    const response = await api.post('/payments', {
      payment_method_id: paymentMethod.id
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit">Pay</button>
    </form>
  );
};
```

---

## Video Streaming Setup

### Agora SDK Setup

```bash
# Install Laravel Agora
composer require agora-io/agora-token-service

# Install React Agora
npm install agora-rtc-sdk-ng agora-react-uikit
```

### Generate Token (Laravel)

```php
// app/Services/AgoraService.php
use AgoraIO\PHP\Token\RtcTokenBuilder;

class AgoraService {
    public function generateToken($channelName, $userId) {
        $appId = config('services.agora.app_id');
        $appCertificate = config('services.agora.app_certificate');
        
        $token = RtcTokenBuilder::buildTokenWithUid(
            $appId,
            $appCertificate,
            $channelName,
            $userId,
            RtcTokenBuilder::RolePublisher,
            3600
        );
        
        return $token;
    }
}
```

### React Video Component

```jsx
// src/components/VideoInterface.jsx
import { AgoraVideoProvider, AgoraBasicProfile, useRTCClient } from "agora-react-uikit";

const VideoInterface = ({ channelName, token }) => {
  const client = useRTCClient();
  
  useEffect(() => {
    if (!client) return;
    
    client.join({
      appid: process.env.REACT_APP_AGORA_APP_ID,
      channel: channelName,
      uid: userId,
      token: token
    });
    
    return () => client.leave();
  }, [client, channelName]);
  
  return (
    <AgoraVideoProvider>
      <AgoraBasicProfile />
    </AgoraVideoProvider>
  );
};
```

---

## Email Configuration

### Gmail SMTP

```env
MAIL_DRIVER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@mockinterviewplatform.com
```

### Mailtrap (Development)

```env
MAIL_DRIVER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=587
MAIL_USERNAME=your_mailtrap_user
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
```

### AWS SES (Production)

```bash
composer require aws/aws-sdk-php
```

```env
MAIL_DRIVER=ses
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_DEFAULT_REGION=us-east-1
```

### Mail Templates

```bash
# Generate mail class
php artisan make:mail UserWelcomeEmail

# Generate template
php artisan make:mail UserWelcomeEmail --markdown=emails.user-welcome
```

---

## Local Development

### Hot Reload Setup

#### Laravel (Vite)

```bash
# Install Vite
npm install

# Run with hot reload
npm run dev
```

#### React (Vite)

```bash
# vite.config.js already configured
npm run dev

# Runs on http://localhost:5173
```

### Database Seeding

```bash
# Create factory
php artisan make:factory EventFactory

# Create seeder
php artisan make:seeder EventSeeder

# Run all seeders
php artisan db:seed

# Run specific seeder
php artisan db:seed --class=EventSeeder
```

### Debugging

#### Laravel Debugging

```php
// Use dd() helper
dd($variable);

// Use log()
Log::info('Message', ['data' => $value]);

// Check logs
tail -f storage/logs/laravel.log
```

#### React Debugging

```javascript
// Use console
console.log('Variable:', variable);

// Use React DevTools
// Browser extension for debugging

// Network tab
// Check API calls
```

### API Testing

```bash
# Using Postman
# Import postman collection from docs/postman_collection.json

# Using curl
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Using artisan tinker
php artisan tinker
> $user = User::first();
> $token = auth()->login($user);
```

---

## Production Deployment

### Laravel Deployment (Ubuntu Server)

```bash
# 1. Install dependencies
sudo apt update
sudo apt install nginx mysql-server php php-fpm php-mysql composer

# 2. Clone repository
cd /var/www
git clone <repo-url> mockinterviewplatform
cd mockinterviewplatform

# 3. Install dependencies
composer install --optimize-autoloader --no-dev

# 4. Configure .env
cp .env.example .env
# Edit .env with production values
php artisan key:generate
php artisan jwt:secret

# 5. Setup database
php artisan migrate --force

# 6. Configure Nginx
sudo nano /etc/nginx/sites-available/mockinterviewplatform
# Add nginx config (see below)

# 7. Enable site
sudo ln -s /etc/nginx/sites-available/mockinterviewplatform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 8. Setup SSL
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com

# 9. Setup queue worker
sudo nano /etc/supervisor/conf.d/mockinterviewplatform-queue.conf
# Add supervisor config (see below)
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start mockinterviewplatform-queue:*
```

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/mockinterviewplatform
upstream mockinterviewplatform {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    root /var/www/mockinterviewplatform/public;
    index index.php;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### Supervisor Configuration

```ini
# /etc/supervisor/conf.d/mockinterviewplatform-queue.conf
[program:mockinterviewplatform-queue]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/mockinterviewplatform/artisan queue:work
autostart=true
autorestart=true
numprocs=4
redirect_stderr=true
stdout_logfile=/var/www/mockinterviewplatform/storage/logs/queue.log
```

### React Deployment (Vercel)

```bash
# 1. Push to GitHub
git push origin main

# 2. Import in Vercel
# - Go to https://vercel.com/new
# - Import Git repository
# - Set environment variables
# - Deploy

# Or deploy manually
npm run build
vercel --prod
```

### Docker Deployment

```dockerfile
# Dockerfile (Laravel)
FROM php:8.1-fpm-alpine

RUN apk add --no-cache \
    mysql-client \
    nginx \
    supervisor

WORKDIR /app
COPY . .

RUN composer install --no-dev --optimize-autoloader

CMD ["php", "artisan", "serve", "--host=0.0.0.0"]
```

```dockerfile
# Dockerfile (React)
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

---

## Testing

### Laravel Testing

```bash
# Create test
php artisan make:test PaymentTest

# Run tests
php artisan test

# Run specific test
php artisan test tests/Feature/PaymentTest.php

# Run with coverage
php artisan test --coverage
```

### React Testing

```bash
# Install dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm run test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Load Testing

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Run load test
ab -n 1000 -c 10 http://localhost:8000/api/v1/events

# Using k6
brew install k6
k6 run load-test.js
```

---

## Troubleshooting

### Common Issues

#### Laravel Composer Error
```bash
# Clear composer cache
composer clear-cache

# Update dependencies
composer update

# Reinstall
rm -rf vendor composer.lock
composer install
```

#### Database Connection Error
```bash
# Check database
mysql -u root -p -e "SELECT * FROM mock_interview_platform.users LIMIT 1;"

# Check permissions
mysql -u root -p -e "GRANT ALL PRIVILEGES ON mock_interview_platform.* TO 'username'@'localhost';"
```

#### React Build Error
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for syntax errors
npm run lint
```

#### JWT Token Issues
```bash
# Regenerate JWT secret
php artisan jwt:secret

# Check token expiry
php artisan jwt:check-token <token>
```

---

*Last Updated: May 18, 2026*
*Version: 1.0*
