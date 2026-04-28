# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install deps first (better caching)
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "run", "dev"]