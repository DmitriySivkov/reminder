<script setup>
import { ref, onMounted, inject } from "vue"
import { useDevice } from "src/composables/device"
import { useStorage } from "src/composables/storage"
import { useUserStore } from "src/stores/user"
import { api } from "src/boot/axios"
import MainFooter from "src/layouts/MainFooter.vue"
import { useNotification } from "src/composables/notification"

const { notifyError } = useNotification()

const storageServ = inject("storageServ")
const userStore = useUserStore()

const isLoading = ref(true)

const { getDeviceId, deviceIdKey, getDeviceInfo } = useDevice()
const { set, has } = useStorage()

onMounted(async() => {
	// todo - probably move to boot file
	const { identifier } = await getDeviceId()
	const { platform, model } = await getDeviceInfo()

	userStore.setDeviceId(identifier)

	let hasDeviceKey = await has(deviceIdKey)

	if (!hasDeviceKey) {
		const promise = api.post("users", {
			device_id: userStore.deviceId,
			platform,
			device_model: model
		})

		promise.then(async(response) => {
			await set({
				key: deviceIdKey,
				value: identifier
			})

			const deviceUser = {
				external_id: response.data.id,
				name: response.data.name ?? response.data.device_id,
				is_device_user: 1
				//todo - сделать чтобы юзер вводил свое имя (которое видят все) при первой инициализации приложения
			}

			await storageServ?.add("users", deviceUser)
		})

		promise.catch((error) => {
			notifyError(process.env.BACKEND_SERVER + "/api")
			notifyError(error)
		})
	}

	isLoading.value = false
})
</script>

<template>
	<q-layout view="lHh Lpr lFf">
		<q-page-container>
			<router-view />
		</q-page-container>

		<MainFooter>
			<q-toolbar class="q-py-xs">
				<q-btn
					flat
					to="/"
					size="lg"
					icon="home"
				/>
			</q-toolbar>
		</MainFooter>
	</q-layout>
</template>
