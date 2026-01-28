# develop stage
FROM node:22.20 as reminder-develop-stage
WORKDIR /app
COPY /quasar/package*.json ./
RUN npm i -g @vue/cli
RUN npm i -g @quasar/cli
RUN npm install
COPY /quasar .

# build stage
FROM reminder-develop-stage as reminder-build-stage
RUN npm install
RUN quasar build

# production stage
FROM nginx as reminder-production-stage
ADD docker/quasar/config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=reminder-build-stage /app/dist/spa /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
