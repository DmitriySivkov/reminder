import { consola } from "consola/browser"
import { useUserStore } from "src/stores/user"
import { useSockets } from "src/composables/centrifugo.js"
import { useTaskStore } from "src/stores/task"
import { useGroupStore } from "src/stores/group"

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
	const userStore = useUserStore()
	const userResult = await storageServ.db?.query(`SELECT * FROM users WHERE external_id=${externalTask.user_id};`)
	const user = userResult?.values[0]

	const taskOwnerResult = await storageServ.db?.query(`SELECT * FROM users WHERE external_id=${externalTask.owner_id};`)
	const taskOwner = taskOwnerResult?.values[0]

	const groupStore = useGroupStore()
	const taskStore = useTaskStore()

	const group = groupStore.data.find((g) => g.uuid === externalTask.group.uuid)
	const deviceTask = taskStore.data.find((t) => !t.external_id && t.group_id === group.id && t.user_id === user.id)

	if (deviceTask) {
		await storageServ.db?.query(`UPDATE tasks SET external_id=${externalTask.id} WHERE id=${deviceTask.id};`)

		taskStore.setTaskField({
			taskId: deviceTask.id,
			fields: {
				external_id: externalTask.id
			}
		})
	} else {
		const isOwner = externalTask.owner_id === userStore.data.external_id

		if (!isOwner) {
			const newTask = addTaskOnDevice({
				external_id: externalTask.id,
				group_id: group.id,
				user_id: user.id,
				owner_id: taskOwner.id,
				headline: externalTask.headline,
				text: externalTask.text
			}, storageServ)

			taskStore.addTask(newTask)
		}
	}
}

// todo - вынести в composable
const addTaskOnDevice = async (task, storageServ) => {
	task.id = await storageServ?.add("tasks", task)

	const sql = "" +
		"SELECT tasks.*, " +
		"groups.name as group_name, " +
		"users.name as user_name, " +
		"users.display_name as user_display_name, " +
		"users.is_device_user as is_device_user " +
		"FROM tasks " +
		"LEFT JOIN groups ON groups.id = tasks.group_id " +
		"LEFT JOIN users ON users.id = tasks.user_id " +
		`WHERE tasks.id=${task.id}` +
		";"

	const result = await storageServ.db?.query(sql)

	return result?.values[0]
}
