<script setup>
import MainHeader from "src/layouts/MainHeader.vue"
</script>

<template>
	<MainHeader>
		<q-toolbar>
			<q-toolbar-title>
				Главная
			</q-toolbar-title>
		</q-toolbar>
	</MainHeader>

	<q-page>
		<q-list
			separator
			dark
			class="q-mt-xs"
		>
			<q-item
				clickable
				class="bg-primary text-white flex-center q-pa-lg"
				to="groups"
			>
				Группы
			</q-item>

			<q-item
				clickable
				class="bg-primary text-white flex-center q-pa-lg"
				to="groups"
			>
				Задачи
			</q-item>
		</q-list>
	</q-page>
</template>
