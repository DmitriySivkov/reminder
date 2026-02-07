<script setup>
import { ref, onMounted } from "vue"
import { useDevice } from "src/composables/device"
import { useStorage } from "src/composables/storage"
import { api } from "src/boot/axios"
import MainFooter from "src/layouts/MainFooter.vue"

const isLoading = ref(true)
const deviceId = ref(null)

const { getDeviceId, deviceIdKey, getDeviceInfo } = useDevice()
const { set, has } = useStorage()

onMounted(async() => {
	const { identifier } = await getDeviceId()
	const { platform, model } = await getDeviceInfo()

	deviceId.value = identifier

	let hasDeviceKey = await has(deviceIdKey)

	if (!hasDeviceKey) {
		const promise = api.post("users", {
			device_id: deviceId.value,
			platform,
			device_model: model
		})

		promise.then(async() => {
			await set({
				key: deviceIdKey,
				value: identifier
			})
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
			<q-toolbar>
				<q-btn to="/">
					<q-icon name="home" />
				</q-btn>
			</q-toolbar>
		</MainFooter>
	</q-layout>
</template>
