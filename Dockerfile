# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy environment files first to make env vars available during build
COPY .env.docker ./.env
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install netcat for health checks
RUN apk add --no-cache netcat-openbsd

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
COPY .env.docker ./.env

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]