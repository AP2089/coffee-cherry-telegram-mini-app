<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { apiPostOrder } from '~/api/orders'
import { useCartStore } from '~/stores/cart'
import { formatCoffeeName, formatPrice } from '~/utils/format'
import { resolveImageUrl } from '~/composables/useImageUrl'

const cart = useCartStore()
const config = useRuntimeConfig()
const imageOf = (path: string | undefined, slug: string) =>
  resolveImageUrl(String(config.public.apiUrl), path, slug)

onMounted(() => cart.hydrate())

const schema = toTypedSchema(
  z.object({
    name: z.string().trim().min(2, 'Минимум 2 символа'),
    email: z.string().email('Некорректный email'),
    phone: z.string().min(18, 'Введите полный номер'),
    city: z.string().trim().min(2, 'Минимум 2 символа'),
    address: z.string().trim().min(5, 'Минимум 5 символов'),
    comment: z.string().optional(),
  }),
)

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    comment: '',
  },
})

const [name, nameAttrs] = defineField('name')
const [email, emailAttrs] = defineField('email')
const [phone, phoneAttrs] = defineField('phone')
const [city, cityAttrs] = defineField('city')
const [address, addressAttrs] = defineField('address')
const [comment, commentAttrs] = defineField('comment')

const submitting = ref(false)
const orderDone = ref(false)
const orderId = ref('')
const orderError = ref(false)

const handleOrder = handleSubmit(async (values) => {
  if (cart.count === 0) return
  submitting.value = true
  orderError.value = false

  try {
    const res = await apiPostOrder({
      items: cart.items.map((item) => ({
        slug: item.slug,
        weight: item.weight,
        quantity: item.quantity,
      })),
      customer: {
        name: values.name,
        email: values.email,
        phone: values.phone,
        city: values.city,
        address: values.address,
        comment: values.comment || '',
      },
    })

    orderId.value = res.data._id
    cart.clearCart()
    orderDone.value = true
  } catch {
    orderError.value = true
  } finally {
    submitting.value = false
  }
})
</script>

<template>
  <div class="px-4 pb-4 pt-6">
    <p class="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">заказ</p>
    <h1 class="mt-2 font-display text-2xl font-semibold text-bone">
      Корзина
      <span v-if="cart.count > 0" class="text-bronze">{{ cart.count }}</span>
    </h1>

    <Transition name="fade" mode="out-in">
      <div v-if="orderDone" key="done" class="py-14 text-center">
        <p class="font-display text-2xl font-semibold text-bone">Заказ оформлен</p>
        <p class="mt-2 text-sm text-muted-foreground">Номер заказа</p>
        <p class="mt-1 font-mono text-lg text-bronze">{{ orderId }}</p>
        <p class="mt-4 text-sm text-muted-foreground">Мы свяжемся с вами в ближайшее время.</p>
        <NuxtLink
          to="/"
          class="mt-8 inline-block bg-bronze px-6 py-3 text-sm font-semibold text-bone"
        >
          К каталогу
        </NuxtLink>
      </div>

      <div v-else-if="cart.count > 0" key="cart" class="mt-5 space-y-3">
        <div
          v-for="item in cart.items"
          :key="`${item.slug}-${item.weight}`"
          class="surface flex gap-3 p-3"
        >
          <img
            :src="imageOf(item.image, item.slug)"
            :alt="formatCoffeeName(item.name)"
            class="h-16 w-16 shrink-0 object-cover"
          />
          <div class="min-w-0 flex-1">
            <p class="font-display text-sm font-semibold text-bone">
              {{ formatCoffeeName(item.name) }}
            </p>
            <p class="text-xs text-muted-foreground">{{ item.weight }} г · {{ item.country }}</p>
            <p class="mt-1 font-serif text-sm text-bronze">
              {{ formatPrice(item.price * item.quantity) }}
            </p>
          </div>
          <div class="flex flex-col items-end justify-between">
            <button
              type="button"
              class="cursor-pointer text-bone/25 transition-colors hover:text-destructive"
              @click="cart.removeItem(item.slug, item.weight)"
            >
              ✕
            </button>
            <div class="flex items-center gap-1.5">
              <button
                type="button"
                class="flex h-7 w-7 cursor-pointer items-center justify-center border border-border text-bone/60"
                @click="cart.updateQuantity(item.slug, item.weight, item.quantity - 1)"
              >
                −
              </button>
              <span class="w-5 text-center text-sm font-semibold">{{ item.quantity }}</span>
              <button
                type="button"
                class="flex h-7 w-7 cursor-pointer items-center justify-center border border-border text-bone/60"
                @click="cart.updateQuantity(item.slug, item.weight, item.quantity + 1)"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div class="surface p-4">
          <div class="flex items-center justify-between">
            <span class="text-xs uppercase tracking-[0.16em] text-muted-foreground">Итого</span>
            <span class="font-serif text-2xl text-bronze">{{ formatPrice(cart.total) }}</span>
          </div>
        </div>

        <form class="surface space-y-3 p-4" @submit.prevent="handleOrder">
          <h2 class="font-display text-lg font-semibold text-bone">Оформление</h2>

          <div>
            <label class="text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
              >Имя *</label
            >
            <input v-model="name" v-bind="nameAttrs" class="field" placeholder="Иван Иванов" />
            <p v-if="errors.name" class="mt-1 text-[11px] text-destructive">{{ errors.name }}</p>
          </div>

          <div>
            <label class="text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
              >Email *</label
            >
            <input
              v-model="email"
              v-bind="emailAttrs"
              type="email"
              class="field"
              placeholder="mail@example.com"
            />
            <p v-if="errors.email" class="mt-1 text-[11px] text-destructive">{{ errors.email }}</p>
          </div>

          <div>
            <label class="text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
              >Телефон *</label
            >
            <input
              v-model="phone"
              v-bind="phoneAttrs"
              v-maska="'+7 (###) ###-##-##'"
              type="tel"
              class="field"
              placeholder="+7 (___) ___-__-__"
            />
            <p v-if="errors.phone" class="mt-1 text-[11px] text-destructive">{{ errors.phone }}</p>
          </div>

          <div>
            <label class="text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
              >Город *</label
            >
            <input v-model="city" v-bind="cityAttrs" class="field" placeholder="Москва" />
            <p v-if="errors.city" class="mt-1 text-[11px] text-destructive">{{ errors.city }}</p>
          </div>

          <div>
            <label class="text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
              >Адрес *</label
            >
            <input
              v-model="address"
              v-bind="addressAttrs"
              class="field"
              placeholder="ул. Примерная, д. 1"
            />
            <p v-if="errors.address" class="mt-1 text-[11px] text-destructive">
              {{ errors.address }}
            </p>
          </div>

          <div>
            <label class="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Комментарий
            </label>
            <textarea
              v-model="comment"
              v-bind="commentAttrs"
              rows="2"
              class="field resize-none"
              placeholder="Необязательно"
            />
          </div>

          <button
            type="submit"
            class="flex w-full cursor-pointer items-center justify-center py-3.5 text-sm font-semibold text-bone transition-opacity"
            :class="submitting ? 'cursor-wait bg-bronze/60' : 'bg-bronze'"
            :disabled="submitting"
          >
            {{ submitting ? 'Отправка…' : 'Оформить заказ' }}
          </button>

          <p v-if="orderError" class="text-center text-sm text-destructive">
            Не удалось оформить заказ. Попробуйте позже.
          </p>
        </form>

        <button
          type="button"
          class="mx-auto block cursor-pointer py-2 text-sm text-bone/25 transition-colors hover:text-destructive"
          @click="cart.clearCart()"
        >
          Очистить корзину
        </button>
      </div>

      <div v-else key="empty" class="py-16 text-center">
        <p class="font-display text-2xl font-semibold text-bone">Корзина пуста</p>
        <p class="mt-2 text-sm text-muted-foreground">Добавьте сорт из каталога</p>
        <NuxtLink
          to="/"
          class="mt-8 inline-block bg-bronze px-6 py-3 text-sm font-semibold text-bone"
        >
          К каталогу
        </NuxtLink>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
