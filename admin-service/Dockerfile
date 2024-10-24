FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm rebuild bcrypt --build-from-source
COPY . .
EXPOSE 8000
CMD [ "node", "server.js" ]