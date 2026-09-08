export function resolveImageUrl(apiUrl: string, path: string | undefined, slug?: string): string {
  const origin = String(apiUrl || '').replace(/\/api\/?$/, '')

  let imagePath = path
  if (!imagePath || !/\.(jpe?g|png|webp|svg)$/i.test(imagePath)) {
    imagePath = slug ? `/images/${slug}.jpg` : ''
  }

  if (!imagePath) return ''
  if (/^https?:\/\//i.test(imagePath)) return imagePath
  return `${origin}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
}

export function useImageUrl(path: string | undefined, slug?: string): string {
  const config = useRuntimeConfig()
  return resolveImageUrl(String(config.public.apiUrl), path, slug)
}
