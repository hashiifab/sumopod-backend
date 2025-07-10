# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="NodeJS/Prisma"

# NodeJS/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV=production


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y python-is-python3 pkg-config build-essential openssl libssl-dev

# Install node modules
COPY --link package.json package-lock.json ./
RUN npm install --production=false

# Generate Prisma Client
COPY --link prisma ./prisma
RUN npx prisma generate

# Copy application code
COPY --link . .

# Build the application
RUN npm run build

# Remove development dependencies
RUN npm prune --production


# Final stage for app image
FROM base

# Install OpenSSL in final image
RUN apt-get update -qq && \
    apt-get install -y openssl libssl-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy built application
COPY --from=build /app /app

# Entrypoint prepares the database.
ENTRYPOINT ["/app/docker-entrypoint"]

# Start the server by default, this can be overwritten at runtime
CMD [ "npm", "run", "start" ]
