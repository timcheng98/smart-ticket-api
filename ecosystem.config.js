module.exports = {
  apps : [{
    name: 'smartticketapi',
    script: 'build/main.js',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    // args: 'one two',
    // instances: 1,
    autorestart: true,
    // watch: false,
    // max_memory_restart: '1G',
    restart_delay: 10000,
    env: {
      NODE_ENV: 'production'
    }
  }, {
    name: 'smartticketapi',
    script: 'build/main.js',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    // args: 'one two',
    // instances: 1,
    autorestart: true,
    // watch: false,
    // max_memory_restart: '1G',
    restart_delay: 10000,
    env: {
      NODE_ENV: 'production'
    }
  }, {
    name: 'smartticketapi',
    script: 'build/main.js',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    // args: 'one two',
    // instances: 1,
    autorestart: true,
    // watch: false,
    // max_memory_restart: '1G',
    restart_delay: 10000,
    env: {
      NODE_ENV: 'production'
    }
  }],
};
