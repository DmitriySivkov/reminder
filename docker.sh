#!/bin/bash
if [ "$1" == "local" ]
then
		echo -e '\033[0;31m ---------- LAUNCHING THE V-SPACE SHUTTLE ---------- \e[0m'

		# копируем node_modules из контейнера на хост (для дебага, например)
		./copy-node-modules.sh &

		docker-compose -f docker-compose.local.yml up
else
    docker-compose -f docker-compose.production.yml up -d
fi
