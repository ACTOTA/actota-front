# Production image with build stage
FROM node:18-slim AS builder

# Set working directory
WORKDIR /app

# Set build arguments for API URL
ENV NEXT_PUBLIC_API_URL=https://actota-api-324035621794.us-central1.run.app

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Explicitly install Stripe packages to ensure they're available
RUN npm install @stripe/stripe-js @stripe/react-stripe-js

# Copy the rest of your Next.js project
COPY . .

# Create a .env.local file explicitly for the build
RUN echo "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" > .env.local

# Fix server components issue (if needed)
RUN if [ -f ./fix-server-components.sh ]; then chmod +x ./fix-server-components.sh && ./fix-server-components.sh; fi

# Set environment for build
ENV NODE_ENV=test

# Build the application
RUN npm run build

# Production runtime stage
FROM node:18-slim

WORKDIR /app

# Set environment to test
ENV NODE_ENV=test

# Copy only the necessary files from the builder stage
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set API URL for runtime
ENV NEXT_PUBLIC_API_URL=https://actota-api-324035621794.us-central1.run.app

# Expose the port your Next.js app runs on
EXPOSE 8080
ENV PORT=8080

# Start the Next.js application in production mode
CMD ["node", "server.js"]
