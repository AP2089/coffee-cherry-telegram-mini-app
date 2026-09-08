import type { ApiResponse, CreateContactMessagePayload } from '~/types'

export const apiPostContact = (body: CreateContactMessagePayload) => {
  const { $apiContent } = useNuxtApp()

  return $apiContent<ApiResponse<unknown>>('/contacts', {
    method: 'POST',
    body,
  })
}
