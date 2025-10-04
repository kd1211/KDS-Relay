# Use Node.js image
FROM node:18-alpine

# Set app dir
WORKDIR /app

# Install deps
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy code
COPY . .

# Expose Fly.io’s dynamic port
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
