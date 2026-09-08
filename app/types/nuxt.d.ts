import type { $Fetch } from 'ofetch'

declare module '#app' {
  interface NuxtApp {
    $api: $Fetch
    $apiContent: $Fetch
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: $Fetch
    $apiContent: $Fetch
  }
}

export {}
