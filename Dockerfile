FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
ARG NUXT_PUBLIC_API_URL=
ARG NUXT_PUBLIC_BOT_USERNAME=
ENV NUXT_PUBLIC_API_URL=$NUXT_PUBLIC_API_URL
ENV NUXT_PUBLIC_BOT_USERNAME=$NUXT_PUBLIC_BOT_USERNAME
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3005
COPY --chown=node:node --from=build /app/.output ./.output
EXPOSE 3005
USER node
CMD ["node", ".output/server/index.mjs"]
