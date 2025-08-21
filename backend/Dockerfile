FROM node:22-alpine

WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm

# Copy lock and manifest files
COPY pnpm-lock.yaml* package.json* ./

# Install all dependencies (including dev)
RUN pnpm install

# Copy the rest of the project
COPY . .

COPY .env .env

# Expose app port
EXPOSE 3000

# Start with dev script
CMD ["pnpm", "dev"]
