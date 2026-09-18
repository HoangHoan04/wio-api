FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++ \
  && ln -sf python3 /usr/bin/python

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

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

CMD ["yarn", "migration:run:prod"]

FROM node:22-alpine AS production

WORKDIR /app

RUN apk add --no-cache wget \
  && addgroup -S wio && adduser -S wio -G wio

ENV NODE_ENV=production
ENV PORT=4300

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production \
  && yarn cache clean

COPY --from=builder /app/dist ./dist

USER wio

EXPOSE 4300

HEALTHCHECK --interval=20s --timeout=5s --start-period=30s --retries=5 \
  CMD wget -qO- http://127.0.0.1:4300/health || exit 1

CMD ["node", "dist/main"]
