import colors from 'vuetify/es5/util/colors'

export default {
  server: {
    port: process.env.LISTEN_PORT || 3333,
    host: process.env.LISTEN_HOST || 'localhost'
  },
  target: 'static',
  router: {
    base: '/public/'
  },
  env: {
    baseUrl: process.env.SITE_BASE_URL || 'http://localhost:8099/',
    browser: true,
    node: true
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - SIPTL',
    title: 'SIPTL',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/cookie.js',
    '~/plugins/axios.js',
    '~/plugins/tool.js',
   // '~/plugins/dialog.js',
    { src: '@/plugins/dialog', mode: 'client' },
    { src: '@/plugins/vue-html2pdf', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    ['cookie-universal-nuxt', { alias: 'cookie' }],
    '@nuxtjs/axios',
    '@nuxtjs/moment',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      light: true,
      themes: {
        light: {
          primary: '#32A859',
          accent: colors.grey.darken3,
          secondary: '#284B8C',
          info: '#3AABCE',
          warning: '#F0AD28',
          error: '#B52912',
          success: colors.green.accent3
        }
      }
    }
  },

  // other configs
  axios: {
    baseURL: process.env.SITE_API_URL || 'http://localhost:8099/',
  },

  loading: {
    color: 'blue',
    height: '5px'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
