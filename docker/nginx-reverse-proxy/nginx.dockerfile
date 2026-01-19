FROM nginx

RUN mkdir -p /var/cache/nginx/app && \
		chown -R www-data:www-data /var/cache/nginx && \
		chmod -R 755 /var/cache/nginx

ADD docker/nginx-reverse-proxy/config/nginx.conf /etc/nginx/conf.d/default.conf
