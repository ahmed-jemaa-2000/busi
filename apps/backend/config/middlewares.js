module.exports = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            env => env('NODE_ENV') === 'production' ? 'https://api.brandini.tn' : 'http://localhost:1337',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            env => env('NODE_ENV') === 'production' ? 'https://api.brandini.tn' : 'http://localhost:1337',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: ({ env }) => {
        if (env('NODE_ENV') === 'production') {
          return [
            'https://brandini.tn',
            'https://dashboard.brandini.tn',
            /^https:\/\/.*\.brandini\.tn$/,
          ];
        }
        return [
          'http://localhost:3000',
          'http://localhost:1337',
          'http://dashboard.brandini.test:3000',
          /^http:\/\/.*\.brandini\.test:3000$/,
        ];
      },
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
