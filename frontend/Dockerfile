# --------------------------------------------------
# Build stage
# --------------------------------------------------

FROM node:26-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source code
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the production application
RUN npm run build


# --------------------------------------------------
# Production stage
# --------------------------------------------------

FROM node:26-alpine AS production

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy the production build
COPY --from=build /app/build ./build

# Document the port the application listens on
EXPOSE 3000

# Start the production server
CMD ["npm", "run", "start", "--", "--port", "3000"]