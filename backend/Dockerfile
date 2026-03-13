FROM node:20-alpine AS base
WORKDIR /app

COPY package.json ./
RUN npm install

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate
RUN npm run build
RUN touch .env

EXPOSE 3001
CMD ["npm", "run", "start"]
