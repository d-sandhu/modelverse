FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
RUN pnpm install --frozen-lockfile --filter @modelverse/api...
COPY apps/api apps/api
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build
RUN pnpm --filter @modelverse/api prisma:generate && pnpm --filter @modelverse/api build

FROM node:22-alpine
RUN corepack enable
WORKDIR /app
COPY --from=build /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api ./apps/api
ENV NODE_ENV=production
EXPOSE 3001
CMD ["sh", "-c", "pnpm --filter @modelverse/api prisma:migrate && pnpm --filter @modelverse/api start"]
