<script setup>
import MainHeader from "src/layouts/MainHeader.vue"
import { Dialog } from "quasar"
import { inject, ref, onMounted } from "vue"
import AddTaskDialog from "src/dialogs/AddTaskDialog.vue"

const sqliteServ = inject("sqliteServ")
const storageServ = inject("storageServ")

const groups = ref([])
const tasks = ref([])

const showAddTaskDialog = () => {
	Dialog.create({
		component: AddTaskDialog,
		componentProps: {
			sqliteServ,
			storageServ,
			groups: groups.value
		}
	}).onOk((newTask) => {
		tasks.value.unshift(newTask)
		console.log(tasks.value)
	})
}

const getGroups = async () => {
	const result = await storageServ.db?.query("SELECT * FROM groups;")
	groups.value = result?.values
}

onMounted(async() => {
	await getGroups()
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
		{{ tasks }}
		<q-list
			separator
			dark
		>
			<q-item
				v-for="task in tasks"
				:key="task.id"
				class="bg-primary text-white q-py-lg q-px-md"
			>
				{{ task.headline }}
			</q-item>
		</q-list>
	</q-page>
</template>
