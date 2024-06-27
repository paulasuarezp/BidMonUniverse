# Usa la imagen base de Node 20
FROM node:20

# Establece el directorio de trabajo
WORKDIR /src

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias de Node.js
RUN npm install

# Copia el código de la aplicación
COPY . .

# Compila el código TypeScript
RUN npm run build

# Expone el puerto en el que la aplicación correrá
EXPOSE 5001

# Comando para iniciar la aplicación
CMD ["npm", "start" ]
