FROM node:18-alpine

# Carpeta de trabajo dentro de docker
WORKDIR /app

# Archivos estáticos de paqueteria de Node
COPY package*.json ./

# Instalar dependencias puras omitiendo desarrollo
RUN npm install --production

# Copiar nuestra lógica (Rutas y Conexion)
COPY . .

# Dejar expuesto el puerto donde Node escuchará
EXPOSE 8080

# Inicializa usando nuestro punto de entrada nativo
CMD ["node", "index.js"]
