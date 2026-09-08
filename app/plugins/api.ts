import { StatusCodes } from 'http-status-codes'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const baseURL = String(config.public.apiUrl || '').trim()

  if (import.meta.client && !baseURL) {
    console.error('[api] NUXT_PUBLIC_API_URL is empty — API requests will fail')
  }

  const api = $fetch.create({
    retry: 1,
    retryDelay: 800,
    retryStatusCodes: [
      StatusCodes.TOO_MANY_REQUESTS,
      StatusCodes.BAD_GATEWAY,
      StatusCodes.SERVICE_UNAVAILABLE,
      StatusCodes.GATEWAY_TIMEOUT,
    ],
  })

  const apiContent = api.create({
    baseURL,
  })

  return {
    provide: {
      api,
      apiContent,
    },
  }
})
