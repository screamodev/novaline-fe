# Nuxt 4 SSR — production image
FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat && corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ENV NODE_ENV=production NUXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NITRO_HOST=0.0.0.0 NITRO_PORT=3000
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nitro
COPY --from=builder --chown=nitro:nodejs /app/.output ./.output
USER nitro
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
