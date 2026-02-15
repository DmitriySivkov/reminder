import { defineStore } from "pinia"

export const useUserStore = defineStore("user", {
	state: () => ({
		deviceId: null,
	}),

	actions: {
		setDeviceId(deviceId) {
			this.deviceId = deviceId
		},
	}
})
