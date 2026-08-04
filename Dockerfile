# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++ \
  && ln -sf python3 /usr/bin/python

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Stage 2: Migration + runtime (default for Docker Compose)
FROM node:22-alpine AS migration

WORKDIR /app

RUN apk add --no-cache python3 make g++ \
  && ln -sf python3 /usr/bin/python

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY tsconfig.json tsconfig.build.json ./

ENV NODE_ENV=production

EXPOSE 4300

CMD ["sh", "-c", "yarn migration:run:prod && node dist/main"]

# Stage 3: Production runtime (no auto-migration)
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production \
  && yarn cache clean

COPY --from=builder /app/dist ./dist

USER node

EXPOSE 4300

CMD ["node", "dist/main"]
