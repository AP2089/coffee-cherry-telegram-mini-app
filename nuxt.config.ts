import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  spaLoadingTemplate: 'spa-loading-template.html',
  devtools: { enabled: false },

  modules: ['@nuxt/eslint', '@pinia/nuxt'],

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: true,
    },
  },

  css: ['~/assets/css/tailwind.css'],

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || '',
      botUsername: process.env.NUXT_PUBLIC_BOT_USERNAME || '',
    },
  },

  app: {
    head: {
      title: 'coffee cherry',
      htmlAttrs: { lang: 'ru' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#0E0C0A' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600&family=Syne:wght@500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap',
        },
      ],
      script: [{ src: 'https://telegram.org/js/telegram-web-app.js' }],
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },
})
