// PM2 Ecosystem Configuration
// Manages both backend (Strapi) and frontend (Next.js) processes

module.exports = {
  apps: [
    // Strapi Backend
    {
      name: 'busi-backend',
      cwd: '/var/www/busi/apps/backend',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 1337,
      },
      error_file: '/var/log/busi/backend-error.log',
      out_file: '/var/log/busi/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },

    // Next.js Frontend
    {
      name: 'busi-frontend',
      cwd: '/var/www/busi/apps/frontend',
      script: 'npm',
      args: 'start',
      instances: 2, // Run 2 instances for load balancing
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/busi/frontend-error.log',
      out_file: '/var/log/busi/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};
