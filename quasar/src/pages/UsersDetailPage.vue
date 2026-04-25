<script setup>
import MainHeader from "src/layouts/MainHeader.vue"
import { inject, onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import { useNotification } from "src/composables/notification"
import { useUserStore } from "src/stores/user"

const sqliteServ = inject("sqliteServ")
const storageServ = inject("storageServ")
const db = ref(null)

const userStore = useUserStore()

const route = useRoute()

const group = ref(null)
const groupUser = ref(null)

const { notifySuccess } = useNotification()

const isLoading = ref(false)

const getGroup = async () => {
	const result = await storageServ.db?.query("SELECT * FROM groups WHERE id = " + route.params.group_id + ";")
	group.value = result?.values[0]
}

const getGroupUser = async () => {
	const result = await storageServ.db?.query(
		`SELECT * FROM users WHERE id=${route.params.user_id} AND EXISTS (
    	SELECT * FROM group_user WHERE group_id=${route.params.group_id}
    );`
	)

	groupUser.value = result?.values[0]
}

onMounted(async() => {
	await getGroup()
	await getGroupUser()
})
</script>

<template>
	<MainHeader>
		<q-toolbar>
			<q-toolbar-title>
				{{ groupUser?.display_name ?? groupUser?.name }} {{ groupUser?.is_device_user ? '(вы)' : ''}}
			</q-toolbar-title>
		</q-toolbar>
	</MainHeader>

	<q-page>
		test
	</q-page>
</template>
