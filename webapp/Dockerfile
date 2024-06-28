# Usa la imagen base de Node 20
FROM node:20

# Establece el directorio de trabajo
WORKDIR /src

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación
COPY . .

ARG API_URI="http://172.178.121.169/5001"
ENV REACT_APP_API_URI=$API_URI

# Construye la aplicación para producción
RUN npm run build

# Instala un servidor estático para servir la aplicación
RUN npm install -g serve

# Expone el puerto en el que la aplicación correrá
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["serve", "-s", "build"]
