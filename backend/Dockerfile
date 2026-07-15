FROM node:22

RUN apt-get update && apt-get install -y redis-server

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD sh -c "redis-server --daemonize yes && npm start"
# CMD ["npm", "start"]