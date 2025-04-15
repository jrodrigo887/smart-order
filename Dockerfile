FROM node:22.0-alpine

WORKDIR /app

# Install dependencies
COPY package.json ./

RUN npm cache clean \
   rm -rf node_modules \
   npm install

COPY . .

EXPOSE 3003
