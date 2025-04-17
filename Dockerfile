# ---------- FRONTEND BUILD ----------
FROM node:20-alpine as frontend

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY src ./src
COPY vite.config.js ./

# building frontend with vite make sure vite.config.js is present in the iamge at /app/vite.config.js
RUN npm run build 


# ---------- BACKEND BUILD ----------
FROM node:20-alpine as backend

WORKDIR /app

COPY node-api/package*.json ./node-api/

RUN npm ci


# ---------- Final Integration ----------
COPY --from=frontend /app/dist /app/node-api/public

EXPOSE 3000

CMD ["node", "node-api/index.js"]