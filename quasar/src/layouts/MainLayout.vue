<script setup>
import MainFooter from "src/layouts/MainFooter.vue"
</script>

<template>
	<q-layout view="lHh Lpr lFf">
		<q-page-container>
			<router-view />
		</q-page-container>

		<MainFooter>
			<div class="row q-col-gutter-xs">
				<div class="col-4">
					<q-btn
						flat
						to="/"
						size="lg"
						icon="home"
						class="full-width"
					/>
				</div>
				<div class="col">
					<q-btn
						flat
						to="/groups"
						size="lg"
						icon="group"
						class="full-width"
					/>
				</div>
			</div>
		</MainFooter>
	</q-layout>
</template>
