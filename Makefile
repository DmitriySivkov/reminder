include ./main/.env

.PHONY: pg dump import docker quasar

MYSQL_CONTAINER_NAME = v-app-mysql

APP_PHP_CONTAINER_NAME = v-app-php
APP_NGINX_CONTAINER_NAME = v-app-nginx
APP_QUASAR_CONTAINER_NAME = v-quasar

QUEUE_WORKER_PHP_CONTAINER_NAME = v-qw-php

DB_NAME = v_db
MYSQL_USER = root
MYSQL_PASS = root

EXEC_MYSQL = docker exec -it $(MYSQL_CONTAINER_NAME) bash
EXEC_APP_PHP = docker exec -it $(APP_PHP_CONTAINER_NAME) bash
EXEC_APP_NGINX = docker exec -it $(APP_NGINX_CONTAINER_NAME) bash
EXEC_APP_QUASAR = docker exec -it $(APP_QUASAR_CONTAINER_NAME) bash

EXEC_QUEUE_WORKER_PHP = docker exec -it $(QUEUE_WORKER_PHP_CONTAINER_NAME) bash

mysql_container:
	$(EXEC_MYSQL)

dump:
	mysqldump -u$(MYSQL_USER) -p$(MYSQL_PASS) $(DB_NAME) > dump/new_dump.sql

import:
	mysql -u$(MYSQL_USER) -p$(MYSQL_PASS) $(DB_NAME) < dump/new_dump.sql

app-php_container:
	$(EXEC_APP_PHP)

app-nginx_container:
	$(EXEC_APP_NGINX)

quasar:
	$(EXEC_APP_QUASAR)

qw-container:
	$(EXEC_QUEUE_WORKER_PHP)

ws-container:
	$(EXEC_WS_PHP)

ws:
	./ws.sh

ws-silent:
	./ws.sh silent

queue:
	./queue.sh

broadcast:
	./broadcast.sh

cache:
	./cache.sh

wipe-public:
	./wipe-public.sh

log:
	./log.sh

docker:
	./docker.sh $(APP_ENV)

build:
	./build.sh

centrifugo:
	./centrifugo.sh
