#1st Stage
FROM node:18 AS builder

WORKDIR /energy/frontend

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

#2nd Stage
FROM nginx:1.22.1-alpine

COPY --from=0 /energy/frontend/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

CMD ["nginx", "-g","daemon off;"]