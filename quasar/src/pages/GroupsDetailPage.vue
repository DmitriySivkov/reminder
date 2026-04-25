<script setup>
import MainHeader from "src/layouts/MainHeader.vue"
import { inject, onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import { useNotification } from "src/composables/notification"
import { useUserStore } from "src/stores/user"

const sqliteServ = inject("sqliteServ")
const storageServ = inject("storageServ")

const userStore = useUserStore()

const route = useRoute()

const group = ref(null)
const groupUsers = ref([])

const { notifySuccess } = useNotification()

const copyGroupUuid = (groupUuid) => {
	navigator.clipboard.writeText(groupUuid)

	groupUuid = groupUuid.slice(0, 7) + "..."

	notifySuccess({
		message: `ID группы ${groupUuid} скопирован - передайте его желаемому пользователю`,
		timeout: 5000,
		position: "bottom"
	})
}

const getGroup = async () => {
	const result = await storageServ.db?.query("SELECT * FROM groups WHERE id = " + route.params.group_id + ";")
	group.value = result?.values[0]
}

const getGroupUsers = async () => {
	const result = await storageServ.db?.query(
		`SELECT * FROM users WHERE EXISTS (SELECT 1 FROM group_user WHERE users.id = group_user.user_id AND group_user.group_id = ${route.params.group_id});`
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
				{{ group?.name }}
			</q-toolbar-title>

			<q-item class="bg-primary text-white q-pa-none">
				<q-item-section class="items-center">
					<q-btn
						flat
						icon="person_add"
						@click="copyGroupUuid(group.uuid)"
					/>
				</q-item-section>
			</q-item>
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
				:to="{
					name: 'groups_users_detail',
					params: {
						group_id: group.id,
						user_id: groupUser.id
					}
				}"
			>
				<q-item-section>
					{{ groupUser.display_name ?? groupUser.name }} {{ groupUser.is_device_user ? '(вы)' : ''}}
				</q-item-section>
				<q-item-section avatar>
					<q-icon name="assignment" />
				</q-item-section>
			</q-item>
		</q-list>
	</q-page>
</template>
