import { consola } from "consola/browser"
import { useUserStore } from "src/stores/user"
import { useSockets } from "src/composables/centrifugo.js"

export const useSocketUserGroups = () => {
	const userStore = useUserStore()

	const { getSubscriptionToken } = useSockets()

	const makeSubscription = (centrifugo, groupUuid) => {
		const channel = `users.${userStore.deviceId}.groups.${groupUuid}`

		centrifugo
			.newSubscription(channel, {
				getToken: async (ctx) => getSubscriptionToken(ctx.channel),
			})
			.on("publication", (ctx) => {
				try {
					if (ctx.data.event === "task.created") {
						console.log(ctx.data)
					}
				} catch (error) {
					consola.error(error)
				}
			})

		return getSubscription(centrifugo, channel)
	}

	const getSubscription = (centrifugo, channel) => {
		return centrifugo.getSubscription(channel)
	}

	return { makeSubscription, getSubscription }
}
