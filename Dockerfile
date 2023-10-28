FROM node:18 AS development

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 6060

CMD [ "node", "./dist/index.js" ]