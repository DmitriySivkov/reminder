import { computed } from "vue"
import { Centrifuge } from "centrifuge"
import { consola } from "consola/browser"
import { api } from "src/boot/axios"
import { useNotification } from "src/composables/notification"
import { useCentrifugoStore } from "src/stores/centrifugo"

export const useSockets = () => {
	const centrifugoStore = useCentrifugoStore()
	const centrifugo = computed(() => centrifugoStore.centrifugo)
	const { notifyError } = useNotification()

	const getSockets = (connectionToken) => {
		try {
			centrifugoStore.setCentrifugo(
				new Centrifuge(process.env.CENTRIFUGO_URL, {
					token: connectionToken,
				})
			)

			centrifugo.value
				.on("connecting", function (ctx) {
					consola.info("Initializing centrifugo")
					consola.log(`connecting: ${ctx.code}, ${ctx.reason}`)
				})
				.on("connected", function (ctx) {
					consola.success(`connected over ${ctx.transport}`)
				})
				.on("disconnected", function (ctx) {
					consola.info(`disconnected: ${ctx.code}, ${ctx.reason}`)

					if (ctx.reason !== "disconnect called") {
						notifyError("Соединение потеряно - пожалуйста, перезагрузите приложение", true)
					}
				})
		} catch (error) {
			consola.error("sockets request failed")
		}
	}

	const getSubscriptionToken = async (channel) => {
		const response = await api.post(
			`${process.env.BACKEND_SERVER}/broadcasting/auth`,
			{ channel }
		)

		return response.data.token
	}

	return {
		getSockets,
		getSubscriptionToken,
	}
}
