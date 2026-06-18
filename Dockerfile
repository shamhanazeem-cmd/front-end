# Stage 1: Build Angular app
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/institute-web /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
