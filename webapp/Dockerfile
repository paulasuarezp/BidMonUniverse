FROM node:20
COPY . /app
WORKDIR /app
#Install the dependencies
RUN npm install

#Create an optimized version of the webapp
RUN npm run build

## EXPOSE [Port mentioned in the vite.config file]
EXPOSE 5173

#Execute npm run prod to run the server
#CMD [ "npm", "run", "prod" ]
CMD ["npm", "start"]