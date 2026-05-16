<script setup>
import { computed, inject, onBeforeMount } from "vue"
import { useUserStore } from "src/stores/user"
import { StatusBar, Style } from "@capacitor/status-bar"
import { useSockets } from "src/composables/centrifugo"
import { useSocketUserGroups } from "src/composables/socketUserGroups"
import { useCentrifugoStore } from "src/stores/centrifugo"
import { useDevice } from "src/composables/device"
import { useStorage } from "src/composables/storage"
import { Dialog } from "quasar"
import UserInitializeDialog from "src/dialogs/UserInitializeDialog.vue"
import { api } from "src/boot/axios"
import { useNotification } from "src/composables/notification"

const userStore = useUserStore()

const storageServ = inject("storageServ")
const { notifyError } = useNotification()

const getUserGroups = async () => {
	return await storageServ.db?.query(
		"SELECT * FROM groups WHERE EXISTS (" +
		"SELECT 1 FROM group_user WHERE groups.id = group_user.group_id AND group_user.user_id=" + userStore.data.id + ");"
	)
}

const { getSockets } = useSockets()
const socketUserGroups = useSocketUserGroups()
const centrifugoStore = useCentrifugoStore()
const centrifugo = computed(() => centrifugoStore.centrifugo)

const initSockets = () => {
	getSockets(userStore.centrifugoToken)

	if (centrifugo.value) {
		centrifugo.value.on("connected", async() => {
			const userGroupsQuery = await getUserGroups()
			const userGroups = userGroupsQuery.values ?? []

			for (let i in userGroups) {
				socketUserGroups.makeSubscription(centrifugo.value, storageServ, userGroups[i].uuid).subscribe()
			}
		})

		centrifugo.value.connect()
	}
}

// Display content under transparent status bar
StatusBar.setOverlaysWebView({ overlay: false })
StatusBar.setStyle({ style: Style.Dark })
StatusBar.setBackgroundColor({
	color: "#1976D2"
})

const { getDeviceId, deviceIdKey, getDeviceInfo } = useDevice()
const { set, has } = useStorage()

const init = ({ identifier, platform, model }) => {
	Dialog.create({
		component: UserInitializeDialog,
	}).onOk((userName) => {
		// todo - если юзер найден на бэке (по device_id), то не показывать диалог инициализации
		const promise = api.post("users", {
			user_name: userName,
			device_id: userStore.deviceId,
			platform,
			device_model: model
		})

		promise.then(async(response) => {
			await set({
				key: deviceIdKey,
				value: identifier
			})

			let deviceUser = {
				external_id: response.data.id,
				name: response.data.name ?? response.data.device_id,
				is_device_user: 1
			}

			deviceUser.id = await storageServ?.add("users", deviceUser)

			userStore.setUser(deviceUser)
		})

		promise.catch((error) => {
			notifyError(process.env.BACKEND_SERVER + "/api")
			notifyError(error)
		})
	})
}

onBeforeMount(async() => {
	const { identifier } = await getDeviceId()
	const { platform, model } = await getDeviceInfo()

	userStore.setDeviceId(identifier)

	let hasDeviceKey = await has(deviceIdKey)

	if (hasDeviceKey) {
		const result = await storageServ.db?.query("SELECT * FROM users WHERE is_device_user = 1;")
		userStore.setUser(result?.values[0])
	}

	if (!hasDeviceKey) {
		await init({ identifier, platform, model })
	}

	initSockets()
})
</script>

<template>
	<router-view />
</template>
