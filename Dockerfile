# Stage 1: Build the React app
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Use your production build script (this example uses "build:production")
RUN npm run build:production

# Stage 2: Serve the built app with nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
