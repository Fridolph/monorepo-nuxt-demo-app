const routeRules = {
  // '/**': {
  //   headers: {
  //     'X-Frame-Options': 'SAMEORIGIN',
  //     'Content-Security-Policy': 'frame-ancestors \'self\' http://localhost:*',
  //   },
  // },
  '/': { redirect: { to: '/home', statusCode: 301 } },
  '/home': { redirect: { to: '/', statusCode: 301 } },
  // '/demo/**': { ssr: false },
  // '*/proposal/**/view': { ssr: true },
  // '*/proposal/**/review': { ssr: true },
  // '*/proposal/**': { ssr: false },
  // '*': { ssr: false, code: 404 }
}

export default routeRules