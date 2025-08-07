FROM node:22-alpine

WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm

# Copy lock and manifest files
COPY pnpm-lock.yaml* package.json* ./

# Install dependencies
RUN pnpm install

# Copy the rest of the project
COPY . .

# Expose app port
EXPOSE 3000

# Start with dev script (watch mode)
CMD ["pnpm", "run", "dev"]
