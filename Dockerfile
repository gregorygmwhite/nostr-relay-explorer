# Stage 1: Build
FROM node:18-alpine as builder

WORKDIR /app

COPY package.json ./
RUN npm install --frozen-lockfile

COPY . .

RUN npx prisma generate
RUN npm run build

# Stage 2: Run
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

ENV PATH /app/node_modules/.bin:$PATH

CMD ["npm", "run", "start"]
