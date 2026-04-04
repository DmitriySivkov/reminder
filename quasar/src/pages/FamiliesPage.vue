<script setup>
import MainHeader from "src/layouts/MainHeader.vue"
import FamilyDialog from "src/dialogs/familyDialog.vue"
import { inject, onMounted, ref } from "vue"
import { Dialog } from "quasar"
import { api } from "src/boot/axios"
import { useNotification } from "src/composables/notification"
import { useUserStore } from "src/stores/user"

const sqliteServ = inject("sqliteServ")
const storageServ = inject("storageServ")
const userStore = useUserStore()

const families = ref([])

const { notifyError } = useNotification()

const isLoading = ref(false)

const showFamilyDialog = ({ name, familyExternalId }) => {
	Dialog.create({
		component: FamilyDialog,
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
		name,
		device_id: userStore.deviceId
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

	const result = await storageServ.db?.query("SELECT * FROM users WHERE is_device_user = 1;")

	await storageServ?.add("family_user", {
		family_id: family.id,
		user_id: result?.values[0].id
	})

	families.value.push(family)
}

const getFamilies = async () => {
	const result = await storageServ.db?.query("SELECT * FROM families;")
	families.value = result?.values
}

onMounted(async() => {
	// todo - try to avoid blinking cause of db query on mount
	await getFamilies()
})
</script>

<template>
	<MainHeader>
		<q-toolbar>
			<q-toolbar-title>
				Семья
			</q-toolbar-title>

			<q-btn
				flat
				@click="showFamilyDialog"
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
				class="bg-primary text-white q-py-lg q-px-md"
				:to="`/families/${family.id}`"
			>
				<q-item-section>
					{{ family.name }}
				</q-item-section>
				<q-item-section avatar>
					<q-icon name="edit" />
				</q-item-section>
			</q-item>
		</q-list>
	</q-page>
</template>
