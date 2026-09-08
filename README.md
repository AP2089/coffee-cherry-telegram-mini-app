# Coffee Cherry Telegram Mini App

## Демо

```bash
@coffee_cherry_bot
```

## Запуск

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Переменные окружения

| Переменная                 | Описание                                       |
| -------------------------- | ---------------------------------------------- |
| `NUXT_PUBLIC_API_URL`      | Базовый URL backend API                        |
| `NUXT_PUBLIC_BOT_USERNAME` | Username бота без `@` (deep-link AI-помощника) |

## Scripts

- `npm run lint` / `npm run lint:fix` — ESLint
- `npm run format` / `npm run format:check` — Prettier
- Husky + lint-staged — pre-commit
