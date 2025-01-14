# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.10.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

# Install Yarn
RUN apt-get update && apt-get install -y curl gnupg \
    && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor -o /usr/share/keyrings/yarnkey.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" > /etc/apt/sources.list.d/yarn.list \
    && apt-get update && apt-get install -y yarn \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Node.js app lives here
WORKDIR /app

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install build tools for native dependencies
RUN apt-get update && apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy root dependency files
COPY --link package.json yarn.lock ./

# Copy the workspace's package.json
COPY --link backend/package.json backend/

# Install dependencies for the specific workspace
RUN yarn install --frozen-lockfile --non-interactive

# Copy application code
COPY --link backend /app/backend

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app
WORKDIR /app/backend

# Set production environment
ENV NODE_ENV="production"

# Start the server by default, this can be overwritten at runtime
EXPOSE 4000
CMD ["yarn", "start"]
