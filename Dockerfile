FROM node:18.13.0 AS development

WORKDIR /backapp

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

RUN npm i -g nodemon

EXPOSE 6060

# CMD [ "nodemon", "index.ts" ]