# Use the official Node.js 20 image as the base for the build stage
FROM --platform=linux/amd64 node:20-alpine as builder
# Set the working directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./

# Increase the timeout for npm
RUN npm config set fetch-retry-maxtimeout 60000
# Use a different npm registry (optional)
RUN npm config set registry https://registry.npmjs.org/
# Update npm to the latest version
RUN npm install -g npm@latest
# Install dependencies
RUN npm install
# Correctly copy the entire project
COPY . .
# Build the Next.js app
RUN npm run build
# After the npm run build step
RUN ls -la /app/.next
# Use the official Node.js 20 image as the base for the production stage
FROM --platform=linux/amd64 node:20-alpine
# Set the working directory
WORKDIR /app
# Copy the entire app from the builder stage
COPY --from=builder /app .
# Install production dependencies
RUN npm install --production
# Expose the port that will be defined by the PORT environment variable
EXPOSE 8080
# Start the app with environment variable for PORT
CMD ["sh", "-c", "npm start -- -p ${PORT:-8080}"]
