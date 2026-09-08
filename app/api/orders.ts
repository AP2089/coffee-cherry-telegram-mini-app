import type { ApiResponse, CreateOrderPayload, Order } from '~/types'

export const apiPostOrder = (body: CreateOrderPayload) => {
  const { $apiContent } = useNuxtApp()

  return $apiContent<ApiResponse<Order>>('/orders', {
    method: 'POST',
    body,
  })
}
