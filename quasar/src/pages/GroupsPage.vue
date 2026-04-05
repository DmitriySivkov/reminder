<script setup>
import MainHeader from "src/layouts/MainHeader.vue"
import GroupDialog from "src/dialogs/GroupDialog.vue"
import { inject, onMounted, ref } from "vue"
import { Dialog } from "quasar"
import { api } from "src/boot/axios"
import { useNotification } from "src/composables/notification"
import { useUserStore } from "src/stores/user"

const sqliteServ = inject("sqliteServ")
const storageServ = inject("storageServ")
const userStore = useUserStore()

const groups = ref([])

const { notifyError } = useNotification()

const isLoading = ref(false)

const showGroupDialog = ({ name, groupExternalId }) => {
	Dialog.create({
		component: GroupDialog,
		componentProps: {
			name,
			groupExternalId
		}
	}).onOk(({ name, groupExternalId }) => {
		if (groupExternalId !== null) {
			updateGroup({ name, groupExternalId })
		} else {
			storeGroup({ name })
		}
	})
}

const updateGroup = ({ name, groupIndex }) => {

}

const storeGroup = ({ name }) => {
	isLoading.value = true

	const promise = api.post("groups", {
		name,
		device_id: userStore.deviceId
	})

	promise.then((response) => {
		storeGroupOnDevice({
			external_id: response.data.id,
			name: response.data.name
		})
	})

	promise.catch(() => {
		notifyError("Что-то пошло не так")
	})

	promise.finally(() => isLoading.value = false)
}

const storeGroupOnDevice = async (group) => {
	const isConn = await sqliteServ?.isConnection(storageServ?.getDatabaseName(), false)

	if (!isConn) {
		const msg = "Error handleAddUser: No DatabaseConnection"
		console.error(msg)
	}

	group.id = await storageServ?.add("groups", group)

	const result = await storageServ.db?.query("SELECT * FROM users WHERE is_device_user = 1;")

	await storageServ?.add("group_user", {
		group_id: group.id,
		user_id: result?.values[0].id
	})

	groups.value.push(group)
}

const getGroups = async () => {
	const result = await storageServ.db?.query("SELECT * FROM groups;")
	groups.value = result?.values
}

onMounted(async() => {
	// todo - try to avoid blinking cause of db query on mount
	await getGroups()
})
</script>

<template>
	<MainHeader>
		<q-toolbar>
			<q-toolbar-title>
				Группа
			</q-toolbar-title>

			<q-btn
				flat
				@click="showGroupDialog"
				:loading="isLoading"
			>
				<q-icon name="add" />
			</q-btn>
		</q-toolbar>
	</MainHeader>

	<q-page>
		<q-list
			separator
			dark
			class="q-mt-xs"
		>
			<q-item
				v-for="group in groups"
				:key="group.id"
				clickable
				class="bg-primary text-white q-py-lg q-px-md"
				:to="`/groups/${group.id}`"
			>
				<q-item-section>
					{{ group.name }}
				</q-item-section>
				<q-item-section avatar>
					<q-icon name="edit" />
				</q-item-section>
			</q-item>
		</q-list>
	</q-page>
</template>
