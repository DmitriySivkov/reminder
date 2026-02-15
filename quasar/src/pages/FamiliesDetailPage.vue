<script setup>
import MainHeader from "src/layouts/MainHeader.vue"
import FamilyUserDialog from "src/dialogs/familyUserDialog.vue"
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

const family = ref(null)
const familyUsers = ref([])

const { notifyError } = useNotification()

const isLoading = ref(false)

const showFamilyUserDialog = (familyUser) => {
	Dialog.create({
		component: FamilyUserDialog,
		componentProps: {
			familyUser
		}
	}).onOk((user) => {
		if (user.external_id) {
			updateFamilyUser(user)
		} else {
			storeFamilyUser(user)
		}
	})
}

const updateFamilyUser = ({ name, familyUserExternalId }) => {

}

const storeFamilyUser = (user) => {
	console.log(user)
	isLoading.value = true

	const promise = api.post(`families/${route.params.family_id}/users`, {
		device_id: userStore.deviceId,
		add_user_device_id: user.device_id
	})

	promise.then((response) => {
		storeFamilyUserOnDevice({
			external_id: response.data.id,
			name: response.data.name,
			display_name: response.data.display_name
		})
	})

	promise.catch(() => {
		notifyError("Что-то пошло не так")
	})

	promise.finally(() => isLoading.value = false)
}

const storeFamilyUserOnDevice = async (familyUser) => {
	const isConn = await sqliteServ?.isConnection(storageServ?.getDatabaseName(), false)

	if (!isConn) {
		const msg = "Error handleAddUser: No DatabaseConnection"
		console.error(msg)
	}

	familyUser.id = await storageServ?.add("users", familyUser)

	familyUsers.value.push(familyUser)
}

const getFamily = async () => {
	const result = await storageServ.db?.query("SELECT * FROM families WHERE id = " + route.params.family_id + ";")
	family.value = result?.values[0]
}

const getFamilyUsers = async () => {
	const result = await storageServ.db?.query(
		"SELECT * FROM users WHERE EXISTS (" +
		"SELECT * FROM family_user WHERE users.id = family_user.user_id AND family_user.family_id = " + route.params.family_id + ");"
	)
	familyUsers.value = result?.values
}

onMounted(async() => {
	await getFamily()
	await getFamilyUsers()
})
</script>

<template>
	<MainHeader>
		<q-toolbar>
			<q-toolbar-title>
				{{ family?.name }}
			</q-toolbar-title>

			<q-btn
				flat
				@click="showFamilyUserDialog(null)"
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
				v-for="familyUser in familyUsers"
				:key="familyUser.id"
				clickable
				class="bg-primary text-white q-py-lg q-px-md"
				@click="showFamilyUserDialog(familyUser)"
			>
				<q-item-section>
					{{ familyUser.display_name ?? familyUser.name }}
				</q-item-section>
				<q-item-section avatar>
					<q-icon name="edit" />
				</q-item-section>
			</q-item>
		</q-list>
	</q-page>
</template>
