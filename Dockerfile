# --- ETAPA 1: Compilación ---
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copiar configuración de dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies para compilar)
RUN npm ci

# Copiar el código fuente y compilar
COPY . .
RUN npm run build

# --- ETAPA 2: Producción ---
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Copiar configuración de dependencias
COPY package*.json ./

# Instalar únicamente dependencias de producción para optimizar el tamaño de la imagen
RUN npm ci --only=production

# Copiar los archivos compilados de la etapa anterior
COPY --from=builder /usr/src/app/dist ./dist

# Exponer el puerto por defecto de NestJS
EXPOSE 3000

# Iniciar la aplicación NestJS en producción
CMD ["node", "dist/src/main.js"]
