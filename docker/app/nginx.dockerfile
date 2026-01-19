FROM nginx

ADD docker/app/config/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /var/www/app
