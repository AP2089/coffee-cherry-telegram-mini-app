import { StatusCodes } from 'http-status-codes'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    retry: 6,
    retryDelay: 10000,
    retryStatusCodes: [
      StatusCodes.TOO_MANY_REQUESTS,
      StatusCodes.INTERNAL_SERVER_ERROR,
      StatusCodes.BAD_GATEWAY,
      StatusCodes.SERVICE_UNAVAILABLE,
      StatusCodes.GATEWAY_TIMEOUT,
    ],
  })

  const apiContent = api.create({
    baseURL: String(config.public.apiUrl),
  })

  return {
    provide: {
      api,
      apiContent,
    },
  }
})
