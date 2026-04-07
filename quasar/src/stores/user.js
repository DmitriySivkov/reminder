import { defineStore } from "pinia"

export const useUserStore = defineStore("user", {
	state: () => ({
		data: {},
		deviceId: null,
	}),

	actions: {
		setUser(userData) {
			this.data = userData
		},
		setDeviceId(deviceId) {
			this.deviceId = deviceId
		},
	}
})
