#!/bin/bash

max_retry=5
retry=0
sleep 15
while [ ${retry} -lt ${max_retry} ]
do
		echo -e '\033[1;33m ---------- CHECKING CONTAINER STATE ... ---------- \e[0m'
		if [ "$( docker container inspect -f '{{.State.Running}}' v-quasar )" = "true" ]
		then
				echo -e '\033[0;32m ---------- UP AND RUNNING. REVVVVV ---------- \e[0m'
				echo -e '\033[1;33m ---------- COPYING NODE_MODULES FROM CONTAINER ... ---------- \e[0m'
				docker cp quasar:/app/node_modules ./quasar/
				echo -e '\033[0;32m ---------- NODE_MODULES IS COPIED ---------- \e[0m'
				break
		else
				(( retry = retry + 1 ))
				sleep 1
		fi
done
