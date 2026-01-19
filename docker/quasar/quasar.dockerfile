# develop stage
FROM node:22.20 as develop-stage
WORKDIR /app
COPY /quasar/package*.json ./
RUN npm i -g @vue/cli
RUN npm i -g @quasar/cli
COPY /quasar .

# build stage
FROM develop-stage as build-stage
RUN npm install
RUN quasar build

# production stage
FROM nginx as production-stage
ADD docker/quasar/config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
