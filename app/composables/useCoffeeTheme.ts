import type { CoffeeSlug } from '~/types'

export interface CoffeeTheme {
  slug: CoffeeSlug
  accent: string
  accentDeep: string
}

const themes: Record<CoffeeSlug, CoffeeTheme> = {
  bloom: { slug: 'bloom', accent: '#C9A0B0', accentDeep: '#8E5F72' },
  velvet: { slug: 'velvet', accent: '#8B5E3C', accentDeep: '#3A241A' },
  santos: { slug: 'santos', accent: '#C4A35A', accentDeep: '#8A6F2E' },
  noir: { slug: 'noir', accent: '#8B3A4A', accentDeep: '#0D141C' },
  ember: { slug: 'ember', accent: '#C45C26', accentDeep: '#7A3214' },
}

export function useCoffeeTheme(slug: string): CoffeeTheme {
  const key = slug.toLowerCase() as CoffeeSlug
  return themes[key] ?? themes.bloom
}
