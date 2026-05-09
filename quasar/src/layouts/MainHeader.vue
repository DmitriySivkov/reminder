<script setup>
import { useUserStore } from "src/stores/user"
import { useRoute } from "vue-router"
const userStore = useUserStore()

const route = useRoute()
</script>

<template>
	<q-header elevated>
		<q-item dense>
			<q-item-section>
				<q-item-label>
					<q-badge
						:label="userStore.data.name"
						:class="userStore.isConnected ? 'bg-teal' : 'bg-brown'"
					/>
				</q-item-label>
			</q-item-section>
			<q-item-section side>
				<q-item-label caption>
					<q-badge
						:label="userStore.isConnected ? 'есть соединение с интернетом' : 'без соединения с интернетом'"
						:class="userStore.isConnected ? 'bg-teal' : 'bg-brown'"
					/>
				</q-item-label>
			</q-item-section>
		</q-item>
		<slot name="default">
			<q-toolbar>
				<q-toolbar-title>
					{{ route.meta?.routeName }}
				</q-toolbar-title>

				<slot name="action" />
			</q-toolbar>
		</slot>
	</q-header>
</template>
