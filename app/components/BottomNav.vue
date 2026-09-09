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
      <IconCatalog class="h-5 w-5" />
      <span class="text-[10px] font-medium tracking-wide">Каталог</span>
    </NuxtLink>

    <NuxtLink
      to="/cart"
      class="relative flex flex-1 flex-col items-center justify-center gap-1 transition-colors"
      :class="isActive('/cart') ? 'text-bronze' : 'text-bone/30 hover:text-bone/60'"
    >
      <span class="relative">
        <IconCart class="h-5 w-5" />
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
      <IconAi class="h-5 w-5" />
      <span class="text-[10px] font-medium tracking-wide">AI</span>
    </button>

    <NuxtLink
      to="/contact"
      class="flex flex-1 flex-col items-center justify-center gap-1 transition-colors"
      :class="isActive('/contact') ? 'text-bronze' : 'text-bone/30 hover:text-bone/60'"
    >
      <IconEmail class="h-5 w-5" />
      <span class="text-[10px] font-medium tracking-wide">Контакты</span>
    </NuxtLink>
  </nav>
</template>
