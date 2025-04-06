# Development image (no separate build stage needed)
FROM node:18-slim
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
# Set environment to development
ENV NODE_ENV=development
# Expose the port your Next.js app runs on
EXPOSE 3000
# Start the Next.js application in development mode
CMD ["npm", "run", "dev"]
