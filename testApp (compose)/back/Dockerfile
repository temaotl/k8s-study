FROM node:18
LABEL authors="artem"

WORKDIR /app/back
COPY . .
RUN npm install

EXPOSE 4000
ENTRYPOINT ["node", "index.js"]