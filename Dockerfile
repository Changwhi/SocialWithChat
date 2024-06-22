FROM node:alpine3.20
WORKDIR /app
COPY pacakage*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm","run","start"]
