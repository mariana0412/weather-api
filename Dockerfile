FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

CMD ["sh", "-c", "node src/migrations/init.js && node src/app.js"]
