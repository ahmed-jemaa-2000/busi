# Deployment Guide - Busi Platform

Complete guide for deploying Busi to a Hetzner VPS running Ubuntu 22.04 LTS.

## Prerequisites

- Hetzner VPS (recommended: CPX21 or CX31)
  - 4 vCPUs
  - 8GB RAM
  - 160GB+ disk
  - Cost: ~€8-10/month
- Domain name: `brandini.tn` (or your chosen domain)
- DNS configured (see DNS Setup below)
- SSH access to server

---

## Step 1: DNS Configuration

Configure your DNS provider with these records:

```
Type    Name        Value                TTL
A       @           YOUR_SERVER_IP       300
A       *           YOUR_SERVER_IP       300
CNAME   www         brandini.tn          300
CNAME   api         brandini.tn          300
CNAME   dashboard   brandini.tn          300
```

**Important**: Wildcard DNS (`*`) is required for multi-tenant storefronts.

Wait 5-10 minutes for DNS propagation.

---

## Step 2: Server Setup

### 2.1 Connect to Server

```bash
ssh root@YOUR_SERVER_IP
```

### 2.2 Run Setup Script

```bash
# Upload setup.sh to server
scp deployment/setup.sh root@YOUR_SERVER_IP:/root/

# Run setup
ssh root@YOUR_SERVER_IP
chmod +x /root/setup.sh
bash /root/setup.sh
```

This installs:
- Node.js 20.x
- PostgreSQL 15
- Nginx
- PM2
- Certbot (for SSL)
- Creates database and directories

### 2.3 Update Database Password

**CRITICAL**: Change the default PostgreSQL password!

```bash
sudo -u postgres psql
ALTER USER busi WITH ENCRYPTED PASSWORD 'your-super-secure-password';
\q
```

---

## Step 3: Application Deployment

### 3.1 Upload Code

```bash
# From your local machine
rsync -avz --exclude 'node_modules' --exclude '.next' \
    ./ root@YOUR_SERVER_IP:/var/www/busi/
```

### 3.2 Install Dependencies

```bash
ssh root@YOUR_SERVER_IP

cd /var/www/busi
pnpm install
```

### 3.3 Configure Environment Variables

**Backend Environment** (`/var/www/busi/apps/backend/.env`):

```bash
cd /var/www/busi/apps/backend
cp .env.example .env
nano .env
```

Generate secrets:
```bash
# Run this 4 times for APP_KEYS
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

Update `.env`:
```env
HOST=0.0.0.0
PORT=1337

# Generate these using the command above
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=generated_salt_here
ADMIN_JWT_SECRET=generated_secret_here
TRANSFER_TOKEN_SALT=generated_salt_here
JWT_SECRET=generated_secret_here

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=busi_prod
DATABASE_USERNAME=busi
DATABASE_PASSWORD=your-super-secure-password

NODE_ENV=production
```

**Frontend Environment** (`/var/www/busi/apps/frontend/.env.production`):

```bash
cd /var/www/busi/apps/frontend
cp .env.example .env.production
nano .env.production
```

```env
NEXT_PUBLIC_STRAPI_URL=https://api.brandini.tn
NEXT_PUBLIC_SITE_URL=https://brandini.tn
NODE_ENV=production
```

### 3.4 Build Applications

```bash
cd /var/www/busi

# Build backend
cd apps/backend
pnpm build

# Build frontend
cd ../frontend
pnpm build

cd /var/www/busi
```

---

## Step 4: Nginx Configuration

### 4.1 Copy Nginx Config

```bash
cp /var/www/busi/deployment/nginx/brandini.conf /etc/nginx/sites-available/
ln -s /etc/nginx/sites-available/brandini.conf /etc/nginx/sites-enabled/
```

### 4.2 Test Configuration

```bash
nginx -t
```

Should output: `syntax is ok` and `test is successful`

### 4.3 Remove Default Site

```bash
rm /etc/nginx/sites-enabled/default
```

---

## Step 5: SSL Certificates

```bash
# Stop nginx temporarily
systemctl stop nginx

# Get wildcard SSL certificate
certbot certonly --standalone \
    -d brandini.tn \
    -d '*.brandini.tn' \
    --email your@email.com \
    --agree-tos

# Start nginx
systemctl start nginx
```

**Note**: For wildcard certificates, you may need to use DNS validation. Follow Certbot prompts.

---

## Step 6: Start Applications

### 6.1 Start with PM2

```bash
cd /var/www/busi
pm2 start deployment/ecosystem.config.js
```

### 6.2 Verify Status

```bash
pm2 status
```

Should show:
- `busi-backend` (online)
- `busi-frontend` (online, 2 instances)

### 6.3 Save PM2 Configuration

```bash
pm2 save
pm2 startup

# Follow the command output to enable PM2 on system boot
```

### 6.4 Check Logs

```bash
# View all logs
pm2 logs

# View specific app logs
pm2 logs busi-backend
pm2 logs busi-frontend

# Check Nginx logs
tail -f /var/log/nginx/api.brandini.tn.access.log
tail -f /var/log/nginx/dashboard.brandini.tn.access.log
```

---

## Step 7: Initial Setup

### 7.1 Access Strapi Admin

Visit: `https://api.brandini.tn/admin`

1. Create your platform admin account
2. This is YOUR admin account (not for shop owners)

### 7.2 Create First Shop

In Strapi admin:
1. Go to Content Manager → Shop
2. Click "Create new entry"
3. Fill in:
   - Name: Demo Boutique
   - Subdomain: demo
   - Primary Color: #000000
   - Is Active: true
   - Plan: free
   - WhatsApp Number: +216XXXXXXXX
4. Save & Publish

### 7.3 Create Shop Owner User

1. Content Manager → User
2. Create new user with role: Authenticated
3. Edit the shop → Set Owner to this user

### 7.4 Test Storefront

Visit: `https://demo.brandini.tn`

You should see the empty storefront!

### 7.5 Test Dashboard

Visit: `https://dashboard.brandini.tn`

Login with shop owner credentials.

---

## Step 8: Automated Backups

### 8.1 Configure Backup Script

```bash
nano /var/www/busi/deployment/backup.sh
```

Update the database password in the script.

### 8.2 Make Executable

```bash
chmod +x /var/www/busi/deployment/backup.sh
```

### 8.3 Add to Crontab

```bash
crontab -e
```

Add this line (runs daily at 2 AM):
```
0 2 * * * /var/www/busi/deployment/backup.sh >> /var/log/busi/backup.log 2>&1
```

### 8.4 Test Backup

```bash
bash /var/www/busi/deployment/backup.sh
```

Check: `/var/backups/busi/` for backup files.

---

## Step 9: Monitoring & Maintenance

### 9.1 Monitor Application

```bash
# PM2 monitoring
pm2 monit

# System resources
htop

# Disk space
df -h

# Memory usage
free -h
```

### 9.2 Restart Applications

```bash
# Restart all
pm2 restart all

# Restart specific
pm2 restart busi-backend
pm2 restart busi-frontend

# Reload nginx
systemctl reload nginx
```

### 9.3 Update Application

```bash
cd /var/www/busi

# Pull latest code
git pull origin main

# Install dependencies
pnpm install

# Build
cd apps/backend && pnpm build
cd ../frontend && pnpm build

# Restart
pm2 restart all
```

### 9.4 View Logs

```bash
# Application logs
pm2 logs

# Nginx logs
tail -f /var/log/nginx/*.log

# Backup logs
tail -f /var/log/busi/backup.log
```

---

## Security Checklist

- [x] Firewall configured (UFW)
- [x] SSL certificates installed
- [x] Strong database password set
- [x] Strapi secrets generated
- [x] Regular backups configured
- [ ] SSH key authentication (disable password login)
- [ ] Fail2ban installed
- [ ] Monitor logs regularly
- [ ] Keep system updated: `apt update && apt upgrade`

---

## Troubleshooting

### Application won't start

```bash
# Check PM2 logs
pm2 logs busi-backend

# Check if ports are in use
netstat -tulpn | grep :1337
netstat -tulpn | grep :3000

# Restart processes
pm2 restart all
```

### Nginx errors

```bash
# Test configuration
nginx -t

# Check logs
tail -f /var/log/nginx/error.log

# Restart nginx
systemctl restart nginx
```

### Database connection errors

```bash
# Check if PostgreSQL is running
systemctl status postgresql

# Check database exists
sudo -u postgres psql -l

# Test connection
psql -U busi -d busi_prod -h localhost
```

### SSL certificate renewal

Certbot auto-renews, but to manually renew:

```bash
certbot renew --dry-run
certbot renew
systemctl reload nginx
```

---

## Performance Optimization (Optional)

### Enable Nginx Caching

Add to nginx config:
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;
proxy_cache my_cache;
```

### Enable HTTP/2

Already enabled in the provided nginx config.

### Database Optimization

```bash
sudo -u postgres psql busi_prod
```

```sql
-- Analyze tables
ANALYZE;

-- Create indexes (if needed)
CREATE INDEX idx_products_shop ON products(shop_id);
CREATE INDEX idx_products_active ON products(is_active);
```

---

## Cost Breakdown

**Hetzner VPS** (CPX21): €8.90/month
**Domain** (.tn): ~€20/year
**Total**: ~€10-12/month

---

## Support

For issues:
1. Check logs: `pm2 logs`
2. Check Nginx: `tail -f /var/log/nginx/error.log`
3. Check this guide's troubleshooting section
4. Review [GETTING_STARTED.md](../GETTING_STARTED.md)

---

**Deployment complete! Your multi-tenant e-commerce platform is now live! 🚀**
