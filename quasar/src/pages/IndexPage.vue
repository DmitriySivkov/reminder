<script setup>
import MainHeader from "src/layouts/MainHeader.vue"
import { Dialog } from "quasar"
import { inject, computed, watch } from "vue"
import AddTaskDialog from "src/dialogs/AddTaskDialog.vue"
import { api } from "src/boot/axios"
import { useUserStore } from "src/stores/user"
import { useNotification } from "src/composables/notification"
import { useTaskStore } from "src/stores/task"
import { useGroupStore } from "src/stores/group"

const sqliteServ = inject("sqliteServ")
const storageServ = inject("storageServ")

const userStore = useUserStore()
const taskStore = useTaskStore()
const groupStore = useGroupStore()

const { notifyError } = useNotification()

const groups = computed(() => groupStore.data)
const tasks = computed(() => taskStore.data)

const showAddTaskDialog = () => {
	Dialog.create({
		component: AddTaskDialog,
		componentProps: {
			sqliteServ,
			storageServ,
			groups: groupStore.data
		}
	}).onOk((newTask) => {
		taskStore.addTask(newTask)
	})
}

// todo - потестить синхронизацию после деплоя на сервер. При локальной разработке из-за перезагрузки не ясно верно ли работает.
//  todo - если переместить в onMounted, то работает верно
//  todo - (вероятно из-за того, что ивент приходит раньше чем загружается приложение)
watch(() => userStore.isConnected, (isConnected) => {
	if (!isConnected) return

	const unsyncTasks = tasks.value.filter((t) => !t.external_id)

	if (unsyncTasks.length) {
		const promise = api.post("tasks/sync", {
			tasks: unsyncTasks.map((t) => ({
				user_id: t.user_external_id ?? "userId",
				owner_id: userStore.data.external_id,
				group_id: t.group_external_id ?? "groupId",
				headline: t.headline,
				text: t.text,
			}))
		})

		promise.catch((error) => {
			notifyError({
				message: error.response.data.message ?? "Не удалось назначить задачи",
				timeout: 3000,
				position: "bottom",
				classes: "full-width text-center"
			})
		})
	}
})
</script>

<template>
	<MainHeader>
		<template #action>
			<q-item class="bg-primary text-white q-pa-none">
				<q-item-section class="items-center">
					<q-btn
						flat
						icon="add"
						@click="showAddTaskDialog"
					/>
				</q-item-section>
			</q-item>
		</template>
	</MainHeader>

	<q-page>
		<q-list
			separator
			dark
		>
			<q-separator dark />
			<q-item
				v-for="task in tasks"
				:key="task.id"
				class="bg-primary text-white q-py-lg q-px-md"
			>
				<q-item-section>
					<q-item-label>{{ task.headline }}</q-item-label>
					<q-item-label caption>
						{{ task.user_display_name ?? task.user_name }}
						{{ task?.is_device_user ? '(вы)' : ''}}
					</q-item-label>
					<q-item-label>
						<q-badge
							outline
							:class="task.external_id ? 'bg-teal' : 'bg-brown'"
						>
							<template v-if="task.external_id">
								<q-icon name="done" />
							</template>
							<template v-else>
								<q-spinner-ios color="white" />
							</template>
						</q-badge>
					</q-item-label>
				</q-item-section>

				<q-item-section
					side
					top
				>
					<q-item-label caption>{{ task.group_name }}</q-item-label>
				</q-item-section>
			</q-item>
		</q-list>
	</q-page>
</template>
