<script setup>
import { ref, onMounted } from "vue"
import { useDevice } from "src/composables/device"
import { useStorage } from "src/composables/storage"
import { api } from "src/boot/axios"

const isLoading = ref(true)
const deviceId = ref(null)

const { getDeviceId, deviceIdKey, getDeviceInfo } = useDevice()
const { set, has } = useStorage()

onMounted(async() => {
	const { identifier } = await getDeviceId()
	const { platform } = await getDeviceInfo()

	deviceId.value = identifier

	let hasDeviceKey = await has(deviceIdKey)

	if (!hasDeviceKey) {
		// todo 1 - check if internet connection is on
		// todo 2 - if app is reinstalled then device_id is the same. Instead of storing - only check for existence
		const promise = api.post("users", {
			device_id: deviceId.value,
			platform
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
		<q-header elevated>
			<q-toolbar>
				<q-toolbar-title>
					Ваш ID: {{ deviceId }}
				</q-toolbar-title>
			</q-toolbar>
		</q-header>

		<q-page-container>
			<q-inner-loading :showing="isLoading">
				<q-spinner-gears
					size="42px"
					color="primary"
				/>
			</q-inner-loading>
		</q-page-container>
	</q-layout>
</template>
