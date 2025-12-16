const runtime = {
  apiSecret: '',
  public: {
    // apiBase: 'http://192.168.2.204:8080',
    // siteOrigin: process.env.NUXT_PUBLIC_SITE_ORIGIN,

    // Modules public config
    motion: {
      directives: {
        'spring-bottom': {
          initial: { y: 100, opacity: 0 },
          visible: {
            y: 0,
            opacity: 1,
            transition: {
              type: 'spring',
              duration: 1000,
              stiffness: 60,
              damping: 12,
              mass: 1,
            },
          },
        },
      },
    },
    // crowdinTool: 'disable',
    // vercelTool: 'disable',
    sentry: {
      enable: 'disable',
      // dsn: DOT_ENV_INFO.SENTRY_DSN,
      // environment: DOT_ENV_INFO.SENTRY_ENVIRONMENT,
    },
    scripts: {
      googleMaps: {
        apiKey: '',
      },
    },
  },
}

export default runtime
