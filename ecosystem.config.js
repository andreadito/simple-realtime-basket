module.exports = {
  apps : [{
    name: 'ACME BASKET SERVICE',
    script: 'server.js',
    args: 'inspect',
    instances: 1,
    autorestart: true,
    watch: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
