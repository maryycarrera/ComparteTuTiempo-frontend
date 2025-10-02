# Etapa 1: Build de Angular
FROM node:22 AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build -- --configuration=production

# Etapa 2: Servir con nginx
FROM nginx:1.25-alpine AS serve
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
