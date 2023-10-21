FROM node:18

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm install -g typescript

CMD [ "ts-node", "index.ts" ]