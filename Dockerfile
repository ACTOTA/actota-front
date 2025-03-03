# Build stage
FROM node:18-slim AS builder

# Set working directory
WORKDIR /app

# Set build arguments for API URL (with default value)
ARG API_URL=http://localhost:8080
ENV NEXT_PUBLIC_API_URL=${API_URL}

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install ALL dependencies including dev dependencies
RUN npm ci

# Explicitly install Stripe packages to ensure they're available
RUN npm install @stripe/stripe-js @stripe/react-stripe-js

# Copy the rest of your Next.js project
COPY . .

# Create a .env.local file explicitly for the build
RUN echo "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" > .env.local

# Diagnostic: Print the installed packages to verify Stripe is there
RUN npm list @stripe/stripe-js @stripe/react-stripe-js

# Build your application
RUN npm run build

# Production stage
FROM node:18-slim

# Set working directory
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Set runtime environment variables
ARG API_URL=http://localhost:8080
ENV NEXT_PUBLIC_API_URL=${API_URL}

# Copy package files
COPY --from=builder /app/package*.json ./

# Install production dependencies
# Note: Stripe packages need to be available in production too
RUN npm ci --only=production
RUN npm install @stripe/stripe-js @stripe/react-stripe-js --save

# Copy built application from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.env.local ./.env.local

# Expose the port your Next.js app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
