FROM node:26-alpine

# Create the application directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy the backend source code
COPY . .

# Document the port the application listens on
EXPOSE 5000

# Start the backend
CMD ["npm", "start"]