#!/bin/bash

# Busi Platform - Server Setup Script
# For Ubuntu 22.04 LTS on Hetzner VPS
# Run as root: sudo bash setup.sh

set -e

echo "================================"
echo "Busi Platform - Server Setup"
echo "================================"
echo ""

# Update system
echo "Updating system packages..."
apt update && apt upgrade -y

# Install Node.js 20.x
echo "Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install pnpm
echo "Installing pnpm..."
npm install -g pnpm

# Install PostgreSQL 15
echo "Installing PostgreSQL 15..."
apt install -y postgresql postgresql-contrib

# Install Nginx
echo "Installing Nginx..."
apt install -y nginx

# Install PM2
echo "Installing PM2..."
npm install -g pm2

# Install Certbot for SSL
echo "Installing Certbot..."
apt install -y certbot python3-certbot-nginx

# Setup PostgreSQL Database
echo "Setting up PostgreSQL database..."
sudo -u postgres psql <<EOF
CREATE DATABASE busi_prod;
CREATE USER busi WITH ENCRYPTED PASSWORD 'CHANGE_ME_SECURE_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE busi_prod TO busi;
ALTER DATABASE busi_prod OWNER TO busi;
\q
EOF

echo "PostgreSQL database 'busi_prod' created successfully!"

# Configure firewall
echo "Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Create application directory
echo "Creating application directory..."
mkdir -p /var/www/busi
mkdir -p /var/backups/busi
mkdir -p /var/log/busi

# Set proper permissions
chown -R www-data:www-data /var/www/busi
chmod -R 755 /var/www/busi

echo ""
echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Generate secure secrets for Strapi (see docs)"
echo "2. Upload your application code to /var/www/busi"
echo "3. Install dependencies: cd /var/www/busi && pnpm install"
echo "4. Configure environment variables in apps/backend/.env"
echo "5. Configure Nginx: cp deployment/nginx/brandini.conf /etc/nginx/sites-available/"
echo "6. Enable Nginx site: ln -s /etc/nginx/sites-available/brandini.conf /etc/nginx/sites-enabled/"
echo "7. Test Nginx: nginx -t"
echo "8. Reload Nginx: systemctl reload nginx"
echo "9. Setup SSL: certbot --nginx -d brandini.tn -d '*.brandini.tn'"
echo "10. Start apps with PM2: pm2 start deployment/ecosystem.config.js"
echo "11. Save PM2 config: pm2 save && pm2 startup"
echo ""
echo "IMPORTANT: Change the PostgreSQL password in the script!"
echo "Database: busi_prod"
echo "User: busi"
echo "Password: CHANGE_ME_SECURE_PASSWORD (update this!)"
echo ""
