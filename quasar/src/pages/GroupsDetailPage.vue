<script setup>
import MainHeader from "src/layouts/MainHeader.vue"
import GroupUserDialog from "src/dialogs/GroupUserDialog.vue"
import { inject, onMounted, ref } from "vue"
import { Dialog } from "quasar"
import { api } from "src/boot/axios"
import { useRoute } from "vue-router"
import { useNotification } from "src/composables/notification"
import { useUserStore } from "src/stores/user"

const sqliteServ = inject("sqliteServ")
const storageServ = inject("storageServ")
const db = ref(null)

const userStore = useUserStore()

const route = useRoute()

const group = ref(null)
const groupUsers = ref([])

const { notifyError } = useNotification()

const isLoading = ref(false)

const showGroupUserDialog = (groupUser) => {
	Dialog.create({
		component: GroupUserDialog,
		componentProps: {
			groupUser
		}
	}).onOk((user) => {
		if (user.external_id) {
			updateGroupUser(user)
		} else {
			storeGroupUser(user)
		}
	})
}

const updateGroupUser = ({ name, groupUserExternalId }) => {

}

const storeGroupUser = (user) => {
	isLoading.value = true

	const promise = api.post(`groups/${route.params.group_id}/users`, {
		device_id: userStore.deviceId,
		add_user_device_id: user.device_id
	})

	promise.then((response) => {
		storeGroupUserOnDevice({
			external_id: response.data.id,
			name: response.data.name,
			// todo - add display name on user add to group form
		})
	})

	promise.catch(() => {
		notifyError("Что-то пошло не так")
	})

	promise.finally(() => isLoading.value = false)
}

const storeGroupUserOnDevice = async (groupUser) => {
	const isConn = await sqliteServ?.isConnection(storageServ?.getDatabaseName(), false)

	if (!isConn) {
		const msg = "Error handleAddUser: No DatabaseConnection"
		console.error(msg)
	}

	groupUser.id = await storageServ?.add("users", groupUser)

	groupUsers.value.push(groupUser)
}

const getGroup = async () => {
	const result = await storageServ.db?.query("SELECT * FROM groups WHERE id = " + route.params.group_id + ";")
	group.value = result?.values[0]
}

const getGroupUsers = async () => {
	const result = await storageServ.db?.query(
		"SELECT * FROM users WHERE EXISTS (" +
		"SELECT * FROM group_user WHERE users.id = group_user.user_id AND group_user.group_id = " + route.params.group_id + ");"
	)
	groupUsers.value = result?.values
}

onMounted(async() => {
	await getGroup()
	await getGroupUsers()
})
</script>

<template>
	<MainHeader>
		<q-toolbar>
			<q-toolbar-title>
				Группа {{ group?.name }}
			</q-toolbar-title>

			<q-btn
				flat
				@click="showGroupUserDialog(null)"
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
				v-for="groupUser in groupUsers"
				:key="groupUser.id"
				clickable
				class="bg-primary text-white q-py-lg q-px-md"
				@click="showGroupUserDialog(groupUser)"
			>
				<q-item-section>
					{{ groupUser.display_name ?? groupUser.name }}
				</q-item-section>
				<q-item-section avatar>
					<q-icon name="edit" />
				</q-item-section>
			</q-item>
		</q-list>
	</q-page>
</template>
