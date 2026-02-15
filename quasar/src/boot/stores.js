import { useUserStore } from "src/stores/user"

export default async ({ store }) => {
	const _userStore = useUserStore(store)
}
