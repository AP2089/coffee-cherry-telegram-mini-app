import { init, miniApp, themeParams, backButton, viewport } from '@telegram-apps/sdk-vue'

export default defineNuxtPlugin(() => {
  try {
    init()
    miniApp.mount()
    themeParams.mount()
    backButton.mount()
    viewport.mount()
    viewport.expand()
    miniApp.ready()
  } catch {
    // Running outside Telegram (dev browser)
  }
})
