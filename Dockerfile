FROM node:22-alpine AS base

RUN apk update && apk add --no-cache libc6-compat

RUN npm install -g pnpm turbo

WORKDIR /app

FROM base AS builder

ARG SERVICE 
ENV SERVICE=${SERVICE}

COPY . .

RUN turbo prune ${SERVICE} --docker

FROM base AS installer

ARG SERVICE
ENV SERVICE=${SERVICE}

WORKDIR /app

COPY --from=builder /app/out/json/ ./
COPY --from=builder /app/out/full/ ./
COPY --from=builder /app/out/full/apps/${SERVICE} ./

RUN pnpm install --force

RUN pnpm turbo build --filter=${SERVICE}...

FROM node:22-alpine AS runner

ARG SERVICE
ENV SERVICE=${SERVICE}
WORKDIR /app

COPY --from=installer /app/apps/${SERVICE}/dist ./dist
COPY --from=installer /app/node_modules ./node_modules

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "dist/src/main.js"]
