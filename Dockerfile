# syntax=docker.io/docker/dockerfile:1

# Define build arguments at the top level so they can be used in all stages
ARG NODE_ENV
ARG NEXT_PUBLIC_API_URL
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_KEY
ARG NEXT_PUBLIC_AUTH_SECRET
ARG NEXT_TELEMETRY_DISABLED=1

FROM node:18-alpine AS base
# Make the arguments available in this stage
ARG NODE_ENV
ARG NEXT_PUBLIC_API_URL
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_KEY
ARG NEXT_PUBLIC_AUTH_SECRET
ARG NEXT_TELEMETRY_DISABLED

# Install dependencies only when needed
FROM base AS deps
# Pass arguments to this stage
ARG NODE_ENV
ARG NEXT_PUBLIC_API_URL
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_KEY
ARG NEXT_PUBLIC_AUTH_SECRET
ARG NEXT_TELEMETRY_DISABLED

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
# Pass arguments to this stage
ARG NODE_ENV
ARG NEXT_PUBLIC_API_URL
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_KEY
ARG NEXT_PUBLIC_AUTH_SECRET
ARG NEXT_TELEMETRY_DISABLED

# Set environment variables for build time
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXT_PUBLIC_GOOGLE_MAPS_KEY=${NEXT_PUBLIC_GOOGLE_MAPS_KEY}
ENV NEXT_PUBLIC_AUTH_SECRET=${NEXT_PUBLIC_AUTH_SECRET}
ENV NEXT_TELEMETRY_DISABLED=${NEXT_TELEMETRY_DISABLED}

# Debug: Print environment variables during build 
# (secrets are masked in logs for security)
RUN echo "Building with NODE_ENV=${NODE_ENV}"
RUN echo "Building with NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}"
RUN echo "Building with NEXTAUTH_URL=${NEXTAUTH_URL}"

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
# Pass arguments to this stage
ARG NODE_ENV
ARG NEXT_PUBLIC_API_URL
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_KEY
ARG NEXT_PUBLIC_AUTH_SECRET
ARG NEXT_TELEMETRY_DISABLED

WORKDIR /app

# Set environment variables for runtime
# Instead of hardcoding, use the build arguments
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXT_PUBLIC_GOOGLE_MAPS_KEY=${NEXT_PUBLIC_GOOGLE_MAPS_KEY}
ENV NEXT_PUBLIC_AUTH_SECRET=${NEXT_PUBLIC_AUTH_SECRET}
ENV NEXT_TELEMETRY_DISABLED=${NEXT_TELEMETRY_DISABLED}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
