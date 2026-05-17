import { useUserStore } from "src/stores/user"
import { useCentrifugoStore } from "src/stores/centrifugo"
import { useTaskStore } from "src/stores/task"
import { useGroupStore } from "src/stores/group"

export default async ({ store }) => {
	const _centrifugoStore = useCentrifugoStore(store)
	const _userStore = useUserStore(store)
	const _taskStore = useTaskStore(store)
	const _groupStore = useGroupStore(store)
}
