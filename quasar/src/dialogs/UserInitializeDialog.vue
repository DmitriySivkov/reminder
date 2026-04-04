<script setup>
import { useDialogPluginComponent } from "quasar"
import { ref } from "vue"

defineEmits([
	...useDialogPluginComponent.emits,
])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

const userName = ref("")
const userInitializeForm = ref(null)

const confirm = () => {
	onDialogOK(userName.value)
}
</script>

<template>
	<q-dialog
		ref="dialogRef"
		@hide="onDialogHide"
		maximized
		persistent
		transition-show="jump-right"
		transition-hide="none"
	>
		<q-card class="q-dialog-plugin q-pa-md">
			<q-card-section class="q-pa-none q-mb-md text-center">
				<div class="text-h5">Как Вас зовут?</div>
			</q-card-section>

			<q-form
				ref="userInitializeForm"
				greedy
				@submit="confirm"
			>
				<q-input
					filled
					hide-bottom-space
					v-model="userName"
					label="Ваше имя"
					lazy-rules="ondemand"
					:rules="[
						val => val.length > 2 || 'Минимальная длина имени - 2 символа'
					]"
				/>
			</q-form>

			<div class="row q-mt-md">
				<div class="col">
					<q-btn
						label="Продолжить"
						color="primary"
						class="q-pa-md full-width text-body1"
						@click="userInitializeForm?.submit"
					/>
				</div>
			</div>
		</q-card>
	</q-dialog>
</template>
