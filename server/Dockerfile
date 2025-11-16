# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . ./

# Build TypeScript
RUN npm run build

# Expose port (Railway will override with PORT env var)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
