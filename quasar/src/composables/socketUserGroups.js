import { consola } from "consola/browser"
import { useUserStore } from "src/stores/user"
import { useSockets } from "src/composables/centrifugo.js"

export const useSocketUserGroups = () => {
	const userStore = useUserStore()

	const { getSubscriptionToken } = useSockets()

	const makeSubscription = (centrifugo, storageServ, groupUuid) => {
		const channel = `users.${userStore.deviceId}.groups.${groupUuid}`

		centrifugo
			.newSubscription(channel, {
				getToken: async (ctx) => getSubscriptionToken(ctx.channel),
			})
			.on("publication", (ctx) => {
				try {
					if (ctx.data.event === "task.created") {
						syncTask(storageServ, ctx.data.model)
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

const syncTask = async(storageServ, externalTask) => {
	const groupResult = await storageServ.db?.query(`SELECT * FROM groups WHERE uuid='${externalTask.group.uuid}';`)
	const userResult = await storageServ.db?.query(`SELECT * FROM users WHERE external_id=${externalTask.user.id};`)

	const group = groupResult?.values[0]
	const user = userResult?.values[0]

	const daviceTaskResult = await storageServ.db?.query(
		`SELECT * FROM tasks WHERE external_id IS NULL AND group_id=${group.id} AND user_id=${user.id};`
	)

	const deviceTask = daviceTaskResult?.values[0]

	if (deviceTask) {
		await storageServ.db?.query(`UPDATE tasks SET external_id=${externalTask.id} WHERE id=${deviceTask.id};`)
	} else {
		await storageServ?.add("tasks", {
			external_id: externalTask.id,
			group_id: group.id,
			user_id: user.id,
			headline: externalTask.headline,
			text: externalTask.text
		})
	}
}
