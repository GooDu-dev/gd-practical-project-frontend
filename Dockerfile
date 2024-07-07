FROM node:20.15.0

WORKDIR /practical-project

COPY . .

RUN npm install

CMD ["node", "index.js"]