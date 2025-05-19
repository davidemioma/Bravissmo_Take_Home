FROM oven/bun:1

# Set working directory
WORKDIR /app

# Copy package.json
COPY server/package.json ./

# Install dependencies
RUN bun install

# Copy the rest of the application
COPY server/. .

# Expose the port your app runs on
EXPOSE 8080

# Start the development server
CMD ["bun", "run", "dev"]
