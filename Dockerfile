FROM arm64v8/node:21

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

ARG APP_ENV=dev
ENV APP_ENV=${APP_ENV}

CMD if [ "$APP_ENV" = "dev" ]; then npm run dev; else npm run build && npm run start; fi
