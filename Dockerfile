# Use a Node.js base image with platform specified
FROM --platform=linux/amd64 node:21-alpine
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Create a basic next.config.js file
RUN echo 'module.exports = { reactStrictMode: true };' > next.config.js

# Create minimal directory structure
RUN mkdir -p public
RUN mkdir -p .next/static/chunks

# Install Next.js directly
RUN npm install next@14.2.20

# Create a simple placeholder page
RUN mkdir -p pages
RUN echo 'export default function Home() { return <div style={{ padding: "20px" }}><h1>Application Starting</h1><p>The application is initializing in Docker mode.</p></div>; }' > pages/index.js
RUN next build

# Set to production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Expose the port (Cloud Run typically uses 8080)
EXPOSE 3000

# Add a non-root user to run the app
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app
USER nextjs

# Start the application
CMD ["npx", "next", "start", "-p", "8080"]
