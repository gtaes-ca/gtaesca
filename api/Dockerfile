FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

EXPOSE 3001

CMD ["sh", "-c", "npm install && npm run dev"]
