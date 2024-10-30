FROM bitnami/node:20.11.0-debian-11-r3

WORKDIR /app
COPY . .

RUN npm run build

# production 
FROM bitnami/node:20.11.0-debian-11-r3

WORKDIR /app

COPY ./package*.json .
RUN npm install
COPY ./dist ./dist 

CMD [ "npm", "start" ]

