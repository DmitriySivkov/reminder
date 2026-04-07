<script setup>
import { useDialogPluginComponent } from "quasar"
import { ref } from "vue"
import { api } from "src/boot/axios"
import { useUserStore } from "src/stores/user"

defineEmits([
	...useDialogPluginComponent.emits,
])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

const userStore = useUserStore()

const groupUserForm = ref(null)
const groupUuid = ref(null)

const isLoading = ref(false)

const uuidLength = 36

const confirm = () => {
	onDialogOK()
}

const groupUuidChanged = (val) => {
	groupUuid.value = val

	if (groupUuid.value < uuidLength) return

	isLoading.value = true

	const promise = api.post(`groups/${groupUuid.value}/users/${userStore.deviceId}`)

	promise.then((response) => {
		// storeGroupOnDevice({
		// 	external_id: response.data.id,
		// 	uuid: response.data.uuid,
		// 	name: response.data.name
		// })
	})

	promise.catch(() => {
		// notifyError("Что-то пошло не так")
	})

	promise.finally(() => isLoading.value = false)
}
</script>

<template>
	<q-dialog
		ref="dialogRef"
		@hide="onDialogHide"
		maximized
		transition-show="jump-left"
		transition-hide="none"
	>
		<q-card class="q-dialog-plugin q-pa-md">
			<div class="text-right q-mb-md">
				<q-icon
					v-close-popup
					name="close"
					size="md"
					class="cursor-pointer"
				/>
			</div>

			<q-card-section class="q-pa-none q-mb-md text-center">
				<div class="text-h5">Вступить в группу</div>
			</q-card-section>

			<q-form
				ref="groupUserForm"
				greedy
				@submit="confirm"
			>
				<q-input
					filled
					hide-bottom-space
					:model-value="groupUuid"
					:disable="isLoading"
					label="Введите ID группы"
					@update:model-value="groupUuidChanged"
				/>
			</q-form>
		</q-card>
	</q-dialog>
</template>
