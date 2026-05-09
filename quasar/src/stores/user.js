import { defineStore } from "pinia"

export const useUserStore = defineStore("user", {
	state: () => ({
		data: {},
		deviceId: null,
		isConnected: false,
	}),

	actions: {
		setUser(userData) {
			this.data = userData
		},
		setDeviceId(deviceId) {
			this.deviceId = deviceId
		},
		setIsConnected(isConnected) {
			this.isConnected = isConnected
		}
	}
})
