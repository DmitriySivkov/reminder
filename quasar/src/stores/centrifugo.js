import { defineStore } from "pinia"

export const useCentrifugoStore = defineStore("centrifugo", {
	state: () => ({
		centrifugo: null,
	}),

	actions: {
		setCentrifugo(centrifugo) {
			this.centrifugo = centrifugo
		}
	}
})
