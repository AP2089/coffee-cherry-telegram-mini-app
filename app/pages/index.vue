<script setup lang="ts">
import { apiGetCoffees } from '~/api/coffees'

const { data, pending } = await apiGetCoffees()
const coffees = computed(() => data.value?.data ?? [])
</script>

<template>
  <div class="px-4 pb-4 pt-6">
    <p class="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">coffee cherry</p>
    <h1 class="mt-2 font-display text-2xl font-semibold tracking-tight text-bone">Каталог</h1>
    <p class="mt-1 text-sm text-muted-foreground">5 сортов. 5 историй.</p>

    <div v-if="pending" class="mt-6 grid grid-cols-2 gap-3">
      <div v-for="i in 4" :key="i" class="surface animate-pulse overflow-hidden">
        <div class="h-28 bg-bone/5" />
        <div class="space-y-2 p-3">
          <div class="h-2 w-2/3 bg-bone/5" />
          <div class="h-3 bg-bone/5" />
          <div class="h-3 w-1/2 bg-bone/5" />
        </div>
      </div>
    </div>

    <div v-else class="mt-6 grid grid-cols-2 gap-3">
      <CoffeeCard v-for="coffee in coffees" :key="coffee._id" :coffee="coffee" />
    </div>
  </div>
</template>
