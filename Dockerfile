# Use the official Node.js 20 image as the base for the build stage
FROM --platform=linux/amd64 node:20-alpine as builder

# Set the working directory
WORKDIR /app

# Copy package files first (for better layer caching)
COPY package*.json ./

# Configure npm
RUN npm config set fetch-retry-maxtimeout 60000

# Install production dependencies first (for caching)
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Install dev dependencies for build
RUN npm install

# Set NODE_OPTIONS to ensure enough memory for the build
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build the Next.js app
RUN npm run build

# Explicitly set permissions after the build
RUN chown -R node:node /app

# Verify build output exists
RUN ls -la .next || (echo "Build failed - .next directory not created" && exit 1)

# Production stage
FROM --platform=linux/amd64 node:20-alpine
WORKDIR /app

# Set production environment (only once)
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# First copy package files
COPY --from=builder /app/package*.json ./

# Install ONLY production dependencies
RUN npm install --omit=dev

# Copy ONLY what's needed for production, ensuring correct paths
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Create a non-root user and group with ID 1001
RUN addgroup -g 1001 nodejs && \
    adduser -u 1001 -G nodejs -s /bin/sh -D nextjs

# Set correct ownership for application files (using numeric IDs)
RUN chown -R 1001:1001 /app

# Change to the non-root user
USER nextjs

# Verify the .next directory was copied correctly
RUN ls -la .next || (echo ".next directory not copied from builder" && exit 1)

# Expose the port
EXPOSE 8080

# Use a specific start command
CMD ["npm", "start", "--", "-p", "${PORT:-8080}"]
