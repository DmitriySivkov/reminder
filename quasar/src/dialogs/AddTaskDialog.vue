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
	storageServ: Object,
	groups: {
		type: Array,
		default: () => []
	}
})

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

const { notifyError, notifySuccess } = useNotification()

const userStore = useUserStore()

const isLoading = ref(false)
const isSuccessful = ref(null)

const addTaskForm = ref(null)

const selectedGroup = ref(null)
const selectedUser = ref(null)

const groupUsers = ref([])

const taskHeadline = ref("")
const taskText = ref("")

const selectGroup = async(val) => {
	selectedGroup.value = val

	await getGroupUsers()
}

const getGroupUsers = async () => {
	const result = await props.storageServ.db?.query(
		"SELECT * FROM users WHERE EXISTS (" +
		"SELECT * FROM group_user WHERE users.id = group_user.user_id AND group_user.group_id = " + selectedGroup.value.id + ");"
	)

	groupUsers.value = result?.values
}

const addTask = async() => {
	isLoading.value = true

	const promise = api.post("tasks", {
		user_id: selectedUser.value.external_id,
		owner_id: userStore.data.external_id,
		group_id: selectedGroup.value.external_id,
		headline: taskHeadline.value,
		text: taskText.value,
	})

	promise.then(async(response) => {
		let newTask = null

		try {
			newTask = await addTaskOnDevice({
				external_id: response.data,
				group_id: selectedGroup.value.id,
				user_id: selectedUser.value.external_id,
				headline: taskHeadline.value,
				text: taskText.value
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
			message: `Добавлено новое задание для пользователя ${selectedUser.value.display_name ?? selectedUser.value.name}`,
			timeout: 3000,
			position: "bottom",
			classes: "full-width text-center"
		})

		setTimeout(() => onDialogOK(newTask), 700)
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

const addTaskOnDevice = async (task) => {
	const isConn = await props.sqliteServ?.isConnection(props.storageServ?.getDatabaseName(), false)

	if (!isConn) {
		throw new Error("No DatabaseConnection")
	}

	task.id = await props.storageServ?.add("tasks", task)

	return task
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
		<q-card class="q-dialog-plugin">
			<div class="text-right q-ma-md">
				<q-icon
					v-close-popup
					name="close"
					size="md"
					class="cursor-pointer"
				/>
			</div>
			<q-card-section class="q-pa-none q-mb-md text-center">
				<div class="text-h5">Новое напоминание</div>
			</q-card-section>

			<q-form
				ref="addTaskForm"
				greedy
				@submit="addTask"
			>
				<q-card-section>
					<q-select
						behavior="menu"
						filled
						:model-value="selectedGroup"
						:options="groups"
						option-label="name"
						option-value="id"
						label="Выберите группу"
						lazy-rules
						:rules="[
							(val) => !!val
						]"
						hide-bottom-space
						no-error-icon
						@update:model-value="selectGroup"
					/>
				</q-card-section>

				<q-card-section>
					<q-select
						behavior="menu"
						filled
						v-model="selectedUser"
						label="Выберите пользователя"
						:options="groupUsers"
						:option-label="(o) => o.display_name ?? o.name"
						option-value="id"
						lazy-rules
						:rules="[
							(val) => !!val
						]"
						hide-bottom-space
						no-error-icon
					/>
				</q-card-section>

				<q-card-section>
					<q-input
						v-model="taskHeadline"
						filled
						type="text"
						label="Введите заголовок"
						lazy-rules
						:rules="[
							(val) => !!val
						]"
						hide-bottom-space
						no-error-icon
					/>
				</q-card-section>

				<q-card-section>
					<q-input
						v-model="taskText"
						filled
						type="textarea"
						label="Введите сообщение"
						input-style="min-height:100px"
						lazy-rules
						:rules="[
							(val) => !!val
						]"
						hide-bottom-space
						no-error-icon
						autogrow
					/>
				</q-card-section>

				<q-card-section>
					<q-btn
						label="Создать"
						color="primary"
						type="submit"
						class="q-pa-md full-width text-body1"
						:loading="isLoading"
						@click="addTaskForm?.submit"
					/>
				</q-card-section>
			</q-form>
		</q-card>
	</q-dialog>
</template>
