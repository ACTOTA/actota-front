# Use a Node.js base image with platform specified
FROM --platform=linux/amd64 node:21 AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Create a .env.local file for static builds if needed
# Uncomment and modify this if you need environment variables during build
# RUN echo "NEXT_PUBLIC_API_URL=https://your-api-url.com" > .env.local

# Build the application with specific output settings
RUN npx next build

# Set to production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Expose the port
EXPOSE 8080

# Add a non-root user to run the app
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

USER nextjs

# Start the application
CMD ["npx", "next", "start", "-p", "8080"]
