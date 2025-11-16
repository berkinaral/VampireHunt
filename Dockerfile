# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy server package files first (for better caching)
COPY server/package.json server/package-lock.json ./

# Install dependencies
RUN npm install

# Copy all server source code
COPY server/src ./src
COPY server/tsconfig.json ./tsconfig.json
COPY server/test-web-client.html ./test-web-client.html
COPY server/test-simple.html ./test-simple.html
COPY server/test-local.html ./test-local.html
COPY server/socket.io.min.js ./socket.io.min.js

# Build TypeScript
RUN npm run build

# Expose port (Railway will override with PORT env var)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
