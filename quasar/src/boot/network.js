import { Network } from "@capacitor/network"
import { useUserStore } from "src/stores/user"

export default async ({ store }) => {
	const userStore = useUserStore(store)

	const promise = Network.getStatus()

	// todo - проверить что при инициализации приложения отрабатывает. Сейчас не отрабатывает
	promise.then(({ connected }) => {
		userStore.setIsConnected(connected)
	})

	Network.addListener("networkStatusChange", ({ connected}) => {
		userStore.setIsConnected(connected)
	})
}
