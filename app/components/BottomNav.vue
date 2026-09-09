<script setup lang="ts">
import { openTelegramLink, miniApp } from '@telegram-apps/sdk-vue'
import { useCartStore } from '~/stores/cart'

const cart = useCartStore()
const route = useRoute()
const config = useRuntimeConfig()

onMounted(() => cart.hydrate())

const isActive = (to: string) =>
  to === '/' ? route.path === '/' || route.path.startsWith('/coffee') : route.path.startsWith(to)

function openAiAssistant() {
  const username = config.public.botUsername as string
  if (!username) return

  const url = `https://t.me/${username}?start=ai`

  try {
    if (typeof openTelegramLink.isAvailable === 'function' && openTelegramLink.isAvailable()) {
      openTelegramLink(url)
      if (typeof miniApp.close?.isAvailable === 'function' && miniApp.close.isAvailable()) {
        miniApp.close()
      }
      return
    }
  } catch {
    // Outside Telegram
  }

  window.open(url, '_blank')
}
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-50 flex h-16 border-t border-border bg-ink/95 backdrop-blur-md"
  >
    <NuxtLink
      to="/"
      class="flex flex-1 flex-col items-center justify-center gap-1 transition-colors"
      :class="isActive('/') ? 'text-bronze' : 'text-bone/30 hover:text-bone/60'"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M4 7h16M6 7v11a2 2 0 002 2h8a2 2 0 002-2V7M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2" />
        <path d="M9 12h6M9 16h4" />
      </svg>
      <span class="text-[10px] font-medium tracking-wide">Каталог</span>
    </NuxtLink>

    <NuxtLink
      to="/cart"
      class="relative flex flex-1 flex-col items-center justify-center gap-1 transition-colors"
      :class="isActive('/cart') ? 'text-bronze' : 'text-bone/30 hover:text-bone/60'"
    >
      <span class="relative">
        <svg
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path d="M3 5h2l2.4 11.2a2 2 0 002 1.6h7.8a2 2 0 001.9-1.5L21 8H7" />
          <circle cx="10" cy="20" r="1.2" fill="currentColor" />
          <circle cx="17" cy="20" r="1.2" fill="currentColor" />
        </svg>
        <span
          v-if="cart.count > 0"
          class="absolute -right-2 -top-1.5 flex h-[15px] min-w-[15px] items-center justify-center bg-bronze px-0.5 text-[9px] font-bold text-bone"
        >
          {{ cart.count }}
        </span>
      </span>
      <span class="text-[10px] font-medium tracking-wide">Корзина</span>
    </NuxtLink>

    <button
      type="button"
      class="flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 text-bone/30 transition-colors hover:text-bone/60"
      @click="openAiAssistant"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path
          d="M12 3v2M12 19v2M5 12H3M21 12h-2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4"
        />
        <circle cx="12" cy="12" r="3.5" />
      </svg>
      <span class="text-[10px] font-medium tracking-wide">AI</span>
    </button>

    <NuxtLink
      to="/contact"
      class="flex flex-1 flex-col items-center justify-center gap-1 transition-colors"
      :class="isActive('/contact') ? 'text-bronze' : 'text-bone/30 hover:text-bone/60'"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M5 6h14v12H5z" />
        <path d="M5 8l7 5 7-5" />
      </svg>
      <span class="text-[10px] font-medium tracking-wide">Контакты</span>
    </NuxtLink>
  </nav>
</template>
