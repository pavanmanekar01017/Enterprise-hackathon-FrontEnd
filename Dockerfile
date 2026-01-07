# Use Bun official image for fast builds
FROM oven/bun:1.0.0 as builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lockb ./
RUN bun install

# Copy the rest of the application
COPY . .

# Build the Vite app
RUN bun run build

# Use a lightweight web server to serve static files
FROM nginx:alpine

# Copy built files to NGINX public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
