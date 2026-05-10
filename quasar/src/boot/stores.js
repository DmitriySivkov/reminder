import { useUserStore } from "src/stores/user"
import { useCentrifugoStore } from "src/stores/centrifugo"

export default async ({ store }) => {
	const _userStore = useUserStore(store)
	const _centrifugoStore = useCentrifugoStore(store)
}
