<script setup>
import { onBeforeMount, inject } from "vue"
import { useDevice } from "src/composables/device"
import { useStorage } from "src/composables/storage"
import { useUserStore } from "src/stores/user"
import { api } from "src/boot/axios"
import { Dialog } from "quasar"
import MainFooter from "src/layouts/MainFooter.vue"
import { useNotification } from "src/composables/notification"
import UserInitializeDialog from "src/dialogs/UserInitializeDialog.vue"

const { notifyError } = useNotification()

const storageServ = inject("storageServ")
const userStore = useUserStore()

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

const setUser = async() => {
	const result = await storageServ.db?.query("SELECT * FROM users WHERE is_device_user = 1;")

	userStore.setUser(result?.values[0])
}

onBeforeMount(async() => {
	// todo - probably move to boot file
	const { identifier } = await getDeviceId()
	const { platform, model } = await getDeviceInfo()

	userStore.setDeviceId(identifier)

	let hasDeviceKey = await has(deviceIdKey)

	if (hasDeviceKey) {
		await setUser()
		return
	}

	if (!hasDeviceKey) {
		await init({ identifier, platform, model })
	}
})
</script>

<template>
	<q-layout view="lHh Lpr lFf">
		<q-page-container>
			<router-view />
		</q-page-container>

		<MainFooter>
			<div class="row q-col-gutter-xs">
				<div class="col-4">
					<q-btn
						flat
						to="/"
						size="lg"
						icon="home"
						class="full-width"
					/>
				</div>
				<div class="col">
					<q-btn
						flat
						to="/groups"
						size="lg"
						icon="group"
						class="full-width"
					/>
				</div>
			</div>
		</MainFooter>
	</q-layout>
</template>
