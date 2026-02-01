import { Notify } from "quasar"

export const useNotification = () => {
	const notifySuccess = (message, isPersistent = false) => {
		return Notify.create({
			timeout: isPersistent ? 0 : 1500,
			color: "green-4",
			textColor: "white",
			multiLine: true,
			icon: "cloud_done",
			position: "top-right",
			message,
			actions: isPersistent ? [{ label: "ok", color: "white" }] : []
		})
	}

	const notifyError = (message, isPersistent = false) => {
		return Notify.create({
			timeout: isPersistent ? 0 : 1500,
			color: "red-5",
			textColor: "white",
			multiline: true,
			icon: "warning",
			position: "top-right",
			message,
			actions: isPersistent ? [{ icon: "close", color: "white" }] : []
		})
	}


	return { notifySuccess, notifyError }
}
