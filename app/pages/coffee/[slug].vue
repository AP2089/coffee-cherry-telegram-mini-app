<script setup lang="ts">
import { backButton } from '@telegram-apps/sdk-vue'
import { apiGetCoffee } from '~/api/coffees'
import { useCartStore } from '~/stores/cart'
import type { CoffeeWeight } from '~/types'
import { formatCoffeeName, formatPrice } from '~/utils/format'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()

const { data, status } = await apiGetCoffee(() => String(route.params.slug), {
  lazy: true,
  server: false,
})
const coffee = computed(() => data.value?.data)

watch(status, async (s) => {
  if (s === 'error' || (s === 'success' && !coffee.value)) {
    await navigateTo('/')
  }
})
const theme = computed(() => useCoffeeTheme(coffee.value?.slug || 'bloom'))
const imageSrc = computed(() => useImageUrl(coffee.value?.image, coffee.value?.slug))

const weights = computed<CoffeeWeight[]>(() =>
  coffee.value?.weights?.length ? coffee.value.weights : [250, 500, 1000],
)

const selectedWeight = ref<CoffeeWeight>(250)
const quantity = ref(1)
const added = ref(false)

watch(
  weights,
  (list) => {
    if (list.length && !list.includes(selectedWeight.value)) {
      selectedWeight.value = list[0]
    }
  },
  { immediate: true },
)

const WEIGHT_MULTIPLIER: Record<CoffeeWeight, number> = {
  250: 1,
  500: 1.9,
  1000: 3.6,
}

const unitPrice = computed(() =>
  Math.round((coffee.value?.price || 0) * WEIGHT_MULTIPLIER[selectedWeight.value]),
)

const addToCart = () => {
  if (!coffee.value || coffee.value.stock <= 0) return
  cart.addItem(coffee.value, selectedWeight.value, quantity.value)
  added.value = true
  setTimeout(() => (added.value = false), 1800)
}

const goBack = () => router.back()
let offBack: (() => void) | undefined

onMounted(() => {
  cart.hydrate()
  try {
    backButton.show()
    offBack = backButton.onClick(goBack)
  } catch {
    // outside Telegram
  }
})

onUnmounted(() => {
  try {
    backButton.hide()
    offBack?.()
  } catch {
    // outside Telegram
  }
})
</script>

<template>
  <div v-if="coffee">
    <div
      class="relative h-56 overflow-hidden"
      :style="`background: linear-gradient(160deg, ${theme.accentDeep}, ${theme.accent})`"
    >
      <img
        v-if="imageSrc"
        :src="imageSrc"
        :alt="formatCoffeeName(coffee.name)"
        class="size-full object-cover opacity-75"
      />
      <div
        class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/40 to-transparent p-4 pt-16"
      >
        <p class="text-[10px] uppercase tracking-[0.2em] text-bone/60">
          {{ coffee.country }} · {{ coffee.region }}
        </p>
        <h1 class="mt-1 font-display text-3xl font-semibold text-bone">
          {{ formatCoffeeName(coffee.name) }}
        </h1>
      </div>
    </div>

    <div class="space-y-4 px-4 py-5">
      <div class="flex items-end justify-between gap-3">
        <div>
          <p class="font-serif text-3xl text-bronze">{{ formatPrice(unitPrice) }}</p>
          <p class="mt-1 text-xs text-muted-foreground">за {{ selectedWeight }} г</p>
        </div>
        <p class="text-xs" :class="coffee.stock > 0 ? 'text-emerald-400/80' : 'text-destructive'">
          {{ coffee.stock > 0 ? `В наличии · ${coffee.stock}` : 'Нет в наличии' }}
        </p>
      </div>

      <p class="text-sm leading-relaxed text-bone/70">{{ coffee.description }}</p>

      <div class="surface p-4">
        <p class="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Вкус</p>
        <p class="mt-2 font-serif text-sm text-bone/80">
          {{ coffee.flavorNotes.join(' · ') }}
        </p>
      </div>

      <div class="grid grid-cols-2 gap-3 text-sm">
        <div class="surface p-3">
          <p class="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Обработка</p>
          <p class="mt-1 text-bone/80">{{ coffee.process }}</p>
        </div>
        <div class="surface p-3">
          <p class="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Сорт</p>
          <p class="mt-1 text-bone/80">{{ coffee.variety }}</p>
        </div>
        <div class="surface col-span-2 p-3">
          <p class="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Высота</p>
          <p class="mt-1 text-bone/80">{{ coffee.altitude }}</p>
        </div>
      </div>

      <div>
        <p class="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Фасовка</p>
        <div class="mt-2 grid grid-cols-3 gap-2">
          <button
            v-for="w in weights"
            :key="w"
            type="button"
            class="border px-2 py-2.5 text-sm font-medium transition-colors"
            :class="
              selectedWeight === w
                ? 'border-bronze bg-bronze/15 text-bronze'
                : 'border-border text-bone/45'
            "
            @click="selectedWeight = w"
          >
            {{ w }} г
          </button>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="flex items-center border border-border">
          <button
            type="button"
            class="px-3 py-2 text-bone/60"
            @click="quantity = Math.max(1, quantity - 1)"
          >
            −
          </button>
          <span class="w-8 text-center text-sm font-semibold">{{ quantity }}</span>
          <button type="button" class="px-3 py-2 text-bone/60" @click="quantity++">+</button>
        </div>

        <button
          type="button"
          class="flex-1 py-3 text-sm font-semibold transition-colors"
          :class="
            coffee.stock <= 0
              ? 'cursor-not-allowed bg-bone/10 text-bone/30'
              : added
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-bronze text-bone'
          "
          :disabled="coffee.stock <= 0"
          @click="addToCart"
        >
          {{ added ? 'Добавлено' : 'В корзину' }}
        </button>
      </div>
    </div>
  </div>
</template>
