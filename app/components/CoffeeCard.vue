<script setup lang="ts">
import type { Coffee } from '~/types'
import { formatCoffeeName, formatPrice } from '~/utils/format'

const props = defineProps<{ coffee: Coffee }>()
const theme = computed(() => useCoffeeTheme(props.coffee.slug))
const imageSrc = computed(() => useImageUrl(props.coffee.image, props.coffee.slug))
</script>

<template>
  <NuxtLink
    :to="`/coffee/${coffee.slug}`"
    class="surface group block overflow-hidden transition-opacity active:opacity-70"
  >
    <div
      class="relative h-28 overflow-hidden"
      :style="`background: linear-gradient(135deg, ${theme.accentDeep}, ${theme.accent})`"
    >
      <img
        v-if="imageSrc"
        :src="imageSrc"
        :alt="formatCoffeeName(coffee.name)"
        class="size-full object-cover opacity-80"
        loading="lazy"
      />
    </div>
    <div class="space-y-1 p-3">
      <p class="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {{ coffee.country }}
      </p>
      <p class="font-display text-sm font-semibold leading-snug text-bone">
        {{ formatCoffeeName(coffee.name) }}
      </p>
      <p class="font-serif text-sm text-bronze">{{ formatPrice(coffee.price) }}</p>
    </div>
  </NuxtLink>
</template>
