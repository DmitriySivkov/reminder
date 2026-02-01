import { Device } from "@capacitor/device"
import { Platform } from "quasar"
import { useStorage } from "src/composables/storage"

export const useDevice = () => {
	const { has, get } = useStorage()

	const deviceIdKey = "deviceId"

	const getDeviceId = async() => {
		let hasDeviceKey = await has(deviceIdKey)

		if (hasDeviceKey) {
			let identifier = await get(deviceIdKey)

			return { identifier }
		}

		if (Platform.is.capacitor) {
			return await Device.getId()
		}

		return {
			identifier: crypto.randomUUID()
		}
	}

	const getDeviceInfo = async() => {
		if (Platform.is.capacitor) {
			return await Device.getInfo()
		}

		return {
			platform: "android"
		}
	}

	return {
		deviceIdKey,
		getDeviceId,
		getDeviceInfo,
	}
}
