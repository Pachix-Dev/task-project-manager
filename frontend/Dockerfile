FROM node:20-alpine AS base
WORKDIR /app

COPY package.json ./
RUN npm install

COPY tsconfig.json ./
COPY next.config.ts ./
COPY postcss.config.js ./
COPY tailwind.config.ts ./
COPY next-env.d.ts ./
COPY src ./src

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
