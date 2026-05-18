# Usar la imagen oficial de MongoDB como base
FROM mongo:7.0

# Copiar el script de inicialización y sembrado de base de datos
# Los archivos en /docker-entrypoint-initdb.d/ se ejecutan automáticamente
# en orden alfabético cuando el contenedor se levanta por primera vez.
COPY scripts/init-mongo.js /docker-entrypoint-initdb.d/init-mongo.js

# Exponer el puerto estándar de MongoDB
EXPOSE 27017
