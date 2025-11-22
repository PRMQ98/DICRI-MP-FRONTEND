# Etapa 1: build de React
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# VITE_API_URL vendrá desde docker-compose como variable de build/entorno
RUN npm run build

# Etapa 2: servir estáticos con Nginx
FROM nginx:alpine

# Copiar build al directorio público de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Opcional: quitar el default.conf si luego quieres personalizar
# RUN rm /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
