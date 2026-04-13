import { Notify } from "quasar"

export const useNotification = () => {
	const notifySuccess = ({
		 message,
		 timeout = 1500,
		 position = "top-right",
		 isPersistent = false,
		 classes = ""
	}) => {
		return Notify.create({
			timeout: isPersistent ? 0 : timeout,
			color: "green-4",
			textColor: "white",
			multiLine: true,
			icon: "cloud_done",
			position,
			message,
			actions: isPersistent ? [{ label: "ok", color: "white" }] : [],
			classes
		})
	}

	const notifyError = ({
		 message,
		 timeout = 1500,
		 position = "top-right",
		 isPersistent = false,
		 classes = ""
	}) => {
		return Notify.create({
			timeout: isPersistent ? 0 : timeout,
			color: "red-5",
			textColor: "white",
			multiline: true,
			icon: "warning",
			position,
			message,
			actions: isPersistent ? [{ icon: "close", color: "white" }] : [],
			classes
		})
	}


	return { notifySuccess, notifyError }
}
