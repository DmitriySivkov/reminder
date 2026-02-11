<script setup>
import MainHeader from "src/layouts/MainHeader.vue"
import AddFamilyDialog from "src/dialogs/familyDialog.vue"
import { inject, onMounted, ref } from "vue"
import { Dialog } from "quasar"
import { api } from "src/boot/axios"
import { useRoute } from "vue-router"
import { useNotification } from "src/composables/notification"

const sqliteServ = inject("sqliteServ")
const storageServ = inject("storageServ")
const db = ref(null)

const route = useRoute()

const family = ref(null)
const familyUsers = ref([])

const { notifyError } = useNotification()

const isLoading = ref(false)

const showAddUserToFamilyDialog = ({ name, familyExternalId }) => {
	Dialog.create({
		component: AddFamilyDialog,
		componentProps: {
			name,
			familyExternalId
		}
	}).onOk(({ name, familyExternalId }) => {
		if (familyExternalId !== null) {
			updateFamilyUser({ name, familyExternalId })
		} else {
			storeFamilyUser({ name })
		}
	})
}

const updateFamilyUser = ({ name, familyIndex }) => {

}

const storeFamilyUser = ({ name }) => {
	isLoading.value = true

	const promise = api.post("families", {
		name
	})

	promise.then((response) => {
		storeFamilyOnDevice({
			external_id: response.data.id,
			name: response.data.name
		})
	})

	promise.catch(() => {
		notifyError("Что-то пошло не так")
	})

	promise.finally(() => isLoading.value = false)
}

const storeFamilyUserOnDevice = async (family) => {
	const isConn = await sqliteServ?.isConnection(storageServ?.getDatabaseName(), false)

	if (!isConn) {
		const msg = "Error handleAddUser: No DatabaseConnection"
		console.error(msg)
	}

	family.id = await storageServ?.add("families", family)

	families.value.push(family)
}

const getFamilyUsers = async () => {
	familyUsers.value = await storageServ?.getAll()
}

const getFamily = async () => {
	const result = await storageServ.db?.query("SELECT * FROM families WHERE id=" + route.params.family_id + ";")
	family.value = result?.values[0]
}

onMounted(async() => {
	await getFamily()
	// await getFamilyUsers()
})
</script>

<template>
	<MainHeader>
		<q-toolbar>
			<q-toolbar-title>
				{{ family?.name }}
			</q-toolbar-title>
		</q-toolbar>
	</MainHeader>

	<q-page>
		123
	</q-page>
</template>
