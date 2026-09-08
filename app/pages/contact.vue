<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { apiPostContact } from '~/api/contacts'

const schema = toTypedSchema(
  z.object({
    name: z.string().trim().min(2, 'Минимум 2 символа'),
    email: z.string().email('Некорректный email'),
    message: z.string().trim().min(10, 'Минимум 10 символов'),
  }),
)

const { defineField, handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema,
  initialValues: { name: '', email: '', message: '' },
})

const [name, nameAttrs] = defineField('name')
const [email, emailAttrs] = defineField('email')
const [message, messageAttrs] = defineField('message')

const sending = ref(false)
const sent = ref(false)
const sendError = ref(false)

const submit = handleSubmit(async (values) => {
  sending.value = true
  sendError.value = false

  try {
    await apiPostContact(values)
    sent.value = true
    resetForm()
    setTimeout(() => (sent.value = false), 5000)
  } catch {
    sendError.value = true
  } finally {
    sending.value = false
  }
})
</script>

<template>
  <div class="px-4 pb-4 pt-6">
    <p class="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">связь</p>
    <h1 class="mt-2 font-display text-2xl font-semibold text-bone">Контакты</h1>
    <p class="mt-1 text-sm text-muted-foreground">
      coffee cherry — specialty coffee. Напишите нам.
    </p>

    <div class="mt-6 surface p-4">
      <Transition name="fade" mode="out-in">
        <div v-if="sent" key="ok" class="py-8 text-center">
          <p class="font-display text-xl font-semibold text-bone">Сообщение отправлено</p>
          <p class="mt-2 text-sm text-muted-foreground">Ответим в ближайшее время.</p>
        </div>

        <form v-else key="form" class="space-y-3" @submit.prevent="submit">
          <div>
            <label class="text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
              >Имя *</label
            >
            <input v-model="name" v-bind="nameAttrs" class="field" placeholder="Ваше имя" />
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
            <label class="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Сообщение *
            </label>
            <textarea
              v-model="message"
              v-bind="messageAttrs"
              rows="4"
              class="field resize-none"
              placeholder="Ваш вопрос"
            />
            <p v-if="errors.message" class="mt-1 text-[11px] text-destructive">
              {{ errors.message }}
            </p>
          </div>

          <button
            type="submit"
            class="w-full py-3.5 text-sm font-semibold text-bone transition-opacity"
            :class="sending ? 'bg-bronze/60' : 'bg-bronze'"
            :disabled="sending"
          >
            {{ sending ? 'Отправка…' : 'Отправить' }}
          </button>

          <p v-if="sendError" class="text-center text-sm text-destructive">
            Ошибка отправки. Попробуйте позже.
          </p>
        </form>
      </Transition>
    </div>
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
