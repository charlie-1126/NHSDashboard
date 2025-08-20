FROM node:20-alpine AS base
RUN npm install -g pnpm

FROM base AS dependencies-env
COPY . /app
WORKDIR /app
RUN pnpm install

FROM base AS build-env
COPY . /app/
COPY --from=dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN pnpm run build

FROM base
COPY ./package.json pnpm-lock.yaml /app/
COPY --from=dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
COPY ./drizzle.config.ts ./.env /app/
COPY ./app/db/schemas /app/app/db/schemas
WORKDIR /app
CMD ["pnpm", "run", "start:prod"]