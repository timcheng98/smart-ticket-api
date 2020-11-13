module.exports = {
  apps : [{
    name: 'io.technine.smartaccessapidev',
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
    name: 'io.technine.t9sa-api',
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
    name: 'io.technine.restore-smartaccess',
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

  deploy : {
    testing : {
      user : 'developer',
      host : 'dev.technine.io',
      ref  : 'origin/testing',
      repo : 'git@gitlab.com:technine/2003-smart-system/smart-access-api.git',
      path : '/home/developer/io.technine.smartaccessapidev',
      'post-deploy' : 'npm run init && npm run build && pm2 reload ecosystem.config.js --only io.technine.smartaccessapidev'
    },
    production : {
      user : 'sysadmin',
      host : '178.128.23.76',
      ref  : 'origin/master',
      repo : 'git@gitlab.com:technine/2003-smart-system/smart-access-api.git',
      path : '/home/sysadmin/io.technine.t9sa-api',
      'post-deploy' : 'npm run init && npm run build && pm2 reload ecosystem.config.js --only io.technine.t9sa-api'
    },
    productionRestore : {
      user : 'sysadmin',
      host : '128.199.77.68',
      ref  : 'origin/master',
      repo : 'git@gitlab.com:technine/2003-smart-system/smart-access-api.git',
      path : '/home/sysadmin/io.technine.restore-smartaccess',
      'post-deploy' : 'npm run init && npm run build && pm2 reload ecosystem.config.js --only io.technine.restore-smartaccess'
    },
  },
};
