#!/bin/bash
echo -e '\e[1;42m building quasar image \e[0m'
docker-compose -f docker-compose.production.yml build quasar
echo -e '\e[1;42m stopping quasar container \e[0m'
docker stop v-quasar
echo -e '\e[1;42m removing quasar container \e[0m'
docker rm v-quasar
echo -e '\e[1;42m starting quasar container \e[0m'
docker-compose -f docker-compose.production.yml up quasar -d
echo -e '\e[1;42m cleaning unused docker build cache \e[0m'
docker builder prune -f
