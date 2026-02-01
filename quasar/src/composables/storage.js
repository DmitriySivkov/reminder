import { LocalStorage } from "quasar"
import { Preferences } from "@capacitor/preferences"
import { Platform } from "quasar"

export const useStorage = () => {
	const set = async({ key, value }) => {
		if (Platform.is.capacitor) {
			await Preferences.set({ key, value })
		} else {
			LocalStorage.set(key, value)
		}
	}

	const get = async(key) => {
		if (Platform.is.capacitor) {
			let data = await Preferences.get({ key })
			return data.value
		} else {
			return LocalStorage.getItem(key)
		}
	}

	const has = async(key) => {
		if (Platform.is.capacitor) {
			const { keys } = await Preferences.keys()
			return keys.includes(key)
		} else {
			return LocalStorage.has(key)
		}
	}

	return {
		set,
		get,
		has
	}
}
