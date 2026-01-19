#!/bin/bash
echo -e '\e[1;42m emptying public storage \e[0m'
docker exec -it v-app-php sh -c 'cd storage/app/public && find . ! -path . -type d -exec rm -rf {} +'
echo -e '\e[1;42m recreating laravel.log \e[0m'
docker exec -it v-app-php sh -c 'cd storage/logs && rm laravel.log && touch laravel.log && chmod 777 laravel.log'
