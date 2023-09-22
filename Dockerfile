# Use an official Node.js runtime as a base image
FROM node:16 as build-stage

# Set working directory in the docker image
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install only production dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Build the frontend for production
RUN npm run build

# Transpile the backend TypeScript to JavaScript
RUN npx tsc --project backend/tsconfig.json
RUN fix-esm-import-path dist/index.js 

# --- Production Stage ---
FROM node:16 as production-stage

WORKDIR /app

# Copy only the necessary files from the previous stage
COPY --from=build-stage /app/package*.json ./
COPY --from=build-stage /app/.nuxt ./.nuxt
COPY --from=build-stage /app/backend/dist ./backend/dist
COPY --from=build-stage /app/node_modules ./node_modules


EXPOSE 3000 3033

# Start the production servers for both frontend and backend
CMD ["npm", "start"]
