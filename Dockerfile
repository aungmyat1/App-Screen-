# Multi-stage Dockerfile for AppScreens

# Stage 1: Build the frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package.json ./
COPY vite.config.ts ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the frontend
RUN npm run build

# Stage 2: Build the backend
FROM node:18-alpine AS backend-builder

WORKDIR /app

# Copy backend package files
COPY server/package.json ./
COPY server/package-lock.json ./

# Install backend dependencies
RUN npm install --production

# Stage 3: Runtime image
FROM node:18-alpine

WORKDIR /app

# Copy built frontend files
COPY --from=frontend-builder /app/dist ./dist

# Copy backend files
COPY --from=backend-builder /app ./server
COPY server/. ./server

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server/index.js"]