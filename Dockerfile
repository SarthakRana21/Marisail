FROM node:20-alpine

WORKDIR /app

COPY package.json ./

COPY . .

RUN npm install
RUN cd node-api && npm install && npm run start

# frontend port
EXPOSE 5173 
# backend port
EXPOSE 3007
# test backend port
EXPOSE 3000

CMD ["npm", "run", "dev"]