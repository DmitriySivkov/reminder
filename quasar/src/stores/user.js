import { defineStore } from "pinia"

export const useUserStore = defineStore("user", {
	state: () => ({
		name: null,
		deviceId: null,
	}),

	actions: {
		setDeviceId(deviceId) {
			this.deviceId = deviceId
		},
		setName(name) {
			this.name = name
		},
	}
})
