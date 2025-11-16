# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy entire server directory at once
COPY server ./

# Install dependencies
RUN npm install

# Build TypeScript
RUN npm run build

# Expose port (Railway will override with PORT env var)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
