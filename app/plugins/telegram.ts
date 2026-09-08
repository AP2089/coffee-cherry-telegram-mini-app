import { init, miniApp, themeParams, backButton, viewport } from '@telegram-apps/sdk-vue'

export default defineNuxtPlugin(() => {
  try {
    init()
    miniApp.mount()
    themeParams.mount()
    backButton.mount()
    viewport.mount()
    try {
      viewport.expand()
    } catch {
      // expand may be unavailable on some clients
    }
    miniApp.ready()
  } catch {
    try {
      miniApp.ready()
    } catch {
      // Running outside Telegram (dev browser)
    }
  }
})
