#!/bin/bash

# Busi Platform - Automated Backup Script
# Backs up PostgreSQL database and Strapi uploads
# Add to crontab: 0 2 * * * /var/www/busi/deployment/backup.sh

set -e

BACKUP_DIR="/var/backups/busi"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# Database credentials
DB_NAME="busi_prod"
DB_USER="busi"
DB_PASSWORD="CHANGE_ME_SECURE_PASSWORD"

# Create backup directory
mkdir -p $BACKUP_DIR

echo "Starting backup at $(date)"

# Backup PostgreSQL database
echo "Backing up database..."
export PGPASSWORD=$DB_PASSWORD
pg_dump -U $DB_USER -h localhost $DB_NAME | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup Strapi uploads
echo "Backing up uploads..."
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C /var/www/busi/apps/backend/public uploads

# Backup environment files (encrypted)
echo "Backing up configuration..."
tar -czf $BACKUP_DIR/config_$DATE.tar.gz -C /var/www/busi \
    apps/backend/.env \
    apps/frontend/.env.production

# Calculate sizes
DB_SIZE=$(du -h $BACKUP_DIR/db_$DATE.sql.gz | cut -f1)
UPLOADS_SIZE=$(du -h $BACKUP_DIR/uploads_$DATE.tar.gz | cut -f1)
CONFIG_SIZE=$(du -h $BACKUP_DIR/config_$DATE.tar.gz | cut -f1)

echo "Backup completed:"
echo "  - Database: $DB_SIZE"
echo "  - Uploads: $UPLOADS_SIZE"
echo "  - Config: $CONFIG_SIZE"

# Remove old backups (older than RETENTION_DAYS)
echo "Cleaning up old backups..."
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -type f -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed successfully at $(date)"

# Optional: Upload to remote storage
# Uncomment and configure if using Hetzner Storage Box or S3
# rsync -avz --delete $BACKUP_DIR/ user@backup-server:/backups/busi/
