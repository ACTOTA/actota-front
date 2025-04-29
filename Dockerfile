# Use multi-stage build for production
FROM node:18-slim AS builder
# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./
# Install dependencies
RUN npm ci

# Copy the rest of your Next.js project
COPY . .

# Build arguments for API URL and other NEXT_PUBLIC_ vars
ARG API_URL=http://localhost:8080
ENV NEXT_PUBLIC_API_URL=${API_URL}

# Create a .env.local file for the build
RUN echo "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" > .env.local

# Build the Next.js application
ENV NODE_ENV=production
RUN npm run build

# Production image
FROM node:18-slim AS runner
WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/src/lib/config ./src/lib/config

# Add environment variable runtime handling
COPY --from=builder /app/docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Expose port
EXPOSE 3000

# Command to run the application with environment variable support
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
