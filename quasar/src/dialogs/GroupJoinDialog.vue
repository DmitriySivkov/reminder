<script setup>
import { useDialogPluginComponent } from "quasar"
import { ref } from "vue"
import { api } from "src/boot/axios"
import { useUserStore } from "src/stores/user"
import { useNotification } from "src/composables/notification"

defineEmits([
	...useDialogPluginComponent.emits,
])

const props = defineProps({
	sqliteServ: Object,
	storageServ: Object
})

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

const { notifyError, notifySuccess } = useNotification()

const userStore = useUserStore()

const groupUuid = ref(null)

const isLoading = ref(false)
const isSuccessful = ref(null)

const uuidLength = 36

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const groupUuidChanged = async(val) => {
	groupUuid.value = val

	if (groupUuid.value.length < uuidLength) return

	isLoading.value = true

	await sleep(1500)

	const promise = api.post(`groups/${groupUuid.value}/users/${userStore.deviceId}`)

	promise.then(async(response) => {
		let newGroup = null

		try {
			newGroup = await joinGroupOnDevice({
				group: {
					external_id: response.data.id,
					uuid: response.data.uuid,
					name: response.data.name
				},
				users: response.data.users
			})
		} catch (error) {
			isSuccessful.value = false

			notifyError({
				message: error,
				timeout: 3000,
				position: "bottom",
				classes: "full-width text-center"
			})

			return
		}

		isSuccessful.value = true

		notifySuccess({
			message: `Вы присоединились к группе ${response.data.name}`,
			timeout: 3000,
			position: "bottom",
			classes: "full-width text-center"
		})

		setTimeout(() => onDialogOK(newGroup), 700)
	})

	promise.catch((error) => {
		notifyError({
			message: error.response.data.message ?? "Что-то пошло не так",
			timeout: 3000,
			position: "bottom",
			classes: "full-width text-center"
		})

		isSuccessful.value = false
	})

	promise.finally(() => isLoading.value = false)
}

const joinGroupOnDevice = async ({ group, users }) => {
	const isConn = await props.sqliteServ?.isConnection(props.storageServ.getDatabaseName(), false)

	if (!isConn) {
		throw new Error("No DatabaseConnection")
	}

	group.id = await props.storageServ.add("groups", group)

	users = users.filter((u) => u.id !== userStore.data.external_id).map((u) => ({
		external_id: u.id,
		name: u.name ?? u.device_id,
	}))

	await props.storageServ.addMultiple("users", users)

	const localUserIds = await props.storageServ.db?.query(
		`SELECT id FROM users WHERE external_id IN (${users.map((u) => u.external_id).join(", ")});`
	)

	await props.storageServ.addMultiple("group_user", localUserIds.values.map((u) => ({
		group_id: group.id,
		user_id: u.id
	})))

	return group
}

const clearGroupUuid = () => {
	groupUuid.value = null
	isSuccessful.value = null
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
				<div class="text-h5">Стать участником группы</div>
				f33619a0-3311-4eee-90c5-5e82c974fa73
			</q-card-section>

			<q-form greedy>
				<q-input
					filled
					hide-bottom-space
					:model-value="groupUuid"
					:disable="isLoading"
					label="Введите ID группы"
					@update:model-value="groupUuidChanged"
				>
					<template #append>
						<q-circular-progress
							v-if="isLoading"
							indeterminate
							color="primary"
						/>
						<q-icon
							v-if="isSuccessful === true"
							name="check_circle"
							size="31px"
							color="green"
						/>
						<q-icon
							v-if="isSuccessful === false"
							name="cancel"
							size="31px"
							color="red"
							@click="clearGroupUuid"
						/>
					</template>
				</q-input>
			</q-form>
		</q-card>
	</q-dialog>
</template>
