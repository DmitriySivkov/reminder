<script setup>
import { useDialogPluginComponent } from "quasar"
import { ref } from "vue"

defineEmits([
	...useDialogPluginComponent.emits,
])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

const props = defineProps({
	name: {
		type: String,
		required: false,
		default: null
	},
	groupExternalId: {
		type: Number,
		required: false,
		default: null
	},
})

const groupForm = ref(null)

const groupData = ref({
	name: props.name,
	groupExternalId: props.groupExternalId
})

const confirm = () => {
	onDialogOK({
		...groupData.value,
	})
}
</script>

<template>
	<q-dialog
		ref="dialogRef"
		@hide="onDialogHide"
		maximized
		transition-show="jump-right"
		transition-hide="none"
	>
		<q-card class="q-dialog-plugin q-pa-md">
			<div class="text-right q-mb-md">
				<q-icon
					v-close-popup
					name="close"
					size="md"
					class="cursor-pointer"
				/>
			</div>

			<q-card-section class="q-pa-none q-mb-md text-center">
				<div class="text-h5">Добавить группу</div>
			</q-card-section>

			<q-form
				ref="groupForm"
				greedy
				@submit="confirm"
			>
				<q-input
					filled
					hide-bottom-space
					v-model="groupData.name"
					label="Название"
					lazy-rules="ondemand"
					:rules="[
						val => !!val,
					]"
				/>
			</q-form>

			<div class="row q-mt-md">
				<div class="col">
					<q-btn
						label="Продолжить"
						color="primary"
						class="q-pa-md full-width text-body1"
						@click="groupForm?.submit"
					/>
				</div>
			</div>
		</q-card>
	</q-dialog>
</template>
