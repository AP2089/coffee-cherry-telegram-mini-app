export function formatPrice(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCoffeeName(name: string): string {
  if (!name) return ''
  return name.charAt(0).toLocaleUpperCase('ru-RU') + name.slice(1).toLocaleLowerCase('ru-RU')
}
