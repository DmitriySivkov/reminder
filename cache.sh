#!/bin/bash
echo -e '\e[1;42m clearing app container \e[0m'
docker exec -it v-app-php sh -c 'php artisan route:clear && php artisan config:clear && php artisan cache:clear && php artisan event:clear'
echo -e '\e[1;42m clearing queue container \e[0m'
docker exec -it v-qw-php sh -c 'php artisan route:clear && php artisan config:clear && php artisan cache:clear && php artisan event:clear'
