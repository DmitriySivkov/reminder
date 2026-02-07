<script setup>
import MainHeader from "src/layouts/MainHeader.vue"
import AddFamilyDialog from "src/dialogs/familyDialog.vue"
import { inject, onMounted, ref, onBeforeUnmount } from "vue"
import { Dialog, Platform } from "quasar"
import { api } from "src/boot/axios"
import { useQuerySQLite } from "src/hooks/useQuerySQLite"
import { useNotification } from "src/composables/notification"

const sqliteServ = inject("sqliteServ")
const storageServ = inject("storageServ")
const db = ref(null)
const isDbInitCompleted = ref(false)

const families = ref([])

const { notifyError } = useNotification()

const isLoading = ref(false)

const showAddFamilyDialog = ({ name, familyExternalId }) => {
	Dialog.create({
		component: AddFamilyDialog,
		componentProps: {
			name,
			familyExternalId
		}
	}).onOk(({ name, familyExternalId }) => {
		if (familyExternalId !== null) {
			updateFamily({ name, familyExternalId })
		} else {
			storeFamily({ name })
		}
	})
}

const updateFamily = ({ name, familyIndex }) => {

}

const storeFamily = ({ name }) => {
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

const storeFamilyOnDevice = async (family) => {
	const isConn = await sqliteServ?.isConnection(storageServ?.getDatabaseName(), false)

	if (!isConn) {
		const msg = "Error handleAddUser: No DatabaseConnection"
		console.error(msg)
	}

	family.id = await storageServ?.add("families", family)

	families.value.push(family)
}

const openDatabase = async () => {
	// Open the connection to the database
	try {
		db.value = await sqliteServ?.openDatabase(
			storageServ?.getDatabaseName(),
			storageServ?.getDatabaseVersion(),
			false
		)
	} catch (error) {
		const msg = `Error open database: ${error}`
		console.error(msg)
	}
}

const getFamilies = async () => {
	families.value = await useQuerySQLite(db.value, "SELECT * FROM families", [])
}

onMounted(async() => {
	await openDatabase()
	await getFamilies()
})

// onMounted(() => {
// 	storageServ?.isInitCompleted.subscribe(async (value) => {
// 		isDbInitCompleted.value = value
// 		// Open the connection to the database
// 		if (isDbInitCompleted.value === true) {
// 			if (!Platform.is.capacitor) {
// 				// Web Plaform
// 				customElements
// 					.whenDefined("jeep-sqlite")
// 					.then(async () => {
// 						await openDatabase()
// 					})
// 					.catch((error) => {
// 						const msg = `Error open database: ${error}`
// 						console.log(msg)
// 					})
// 			} else {
// 				// Native Platforms
// 				await openDatabase()
// 			}
// 		}
// 	})
// })

// onBeforeUnmount(() => {
// 	// Close the connection to the database
// 	sqliteServ?.closeDatabase(storageServ?.getDatabaseName(), false)
// })
</script>

<template>
	<MainHeader>
		<q-toolbar>
			<q-toolbar-title>
				Семья
			</q-toolbar-title>

			<q-btn
				flat
				@click="showAddFamilyDialog"
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
				v-for="family in families"
				:key="family.id"
				clickable
				class="bg-primary text-white"
			>
				{{ family.name }}
			</q-item>
		</q-list>
	</q-page>
</template>
