FROM node:20-slim

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the app
RUN npm run build

# Copy and set permissions for entrypoint script
COPY docker-entrypoint /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint

# Expose port
EXPOSE 8080

# Use entrypoint script
ENTRYPOINT ["docker-entrypoint"]
CMD ["npm", "run", "start"]
