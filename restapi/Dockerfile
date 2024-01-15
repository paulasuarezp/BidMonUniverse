# Usa la imagen base de Node 20
FROM node:20

# Copia el código de la aplicación
COPY . /app

# Establece el directorio de trabajo
WORKDIR /app

# Instala las dependencias de Node.js
RUN npm install


# Comando para iniciar la aplicación
CMD ["npm", "start" ]
