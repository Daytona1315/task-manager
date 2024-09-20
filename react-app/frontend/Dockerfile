FROM node:alpine

WORKDIR /app 

COPY package.json package.json

RUN yarn install

COPY . .

RUN yarn run 

EXPOSE 3000

CMD ["yarn", "dev", "--host", "0.0.0.0", "--port", "3000"]
