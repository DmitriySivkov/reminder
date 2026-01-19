#!/bin/bash
docker exec -it v-qw-php sh -c 'php artisan rabbitmq:consume --queue=broadcast'
