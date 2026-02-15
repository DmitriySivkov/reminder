<script setup>
import { useDialogPluginComponent } from "quasar"
import { ref } from "vue"
import { api } from "src/boot/axios"

defineEmits([
	...useDialogPluginComponent.emits,
])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

const props = defineProps({
	familyUser: {
		type: Object,
		required: false,
		default: null
	},
})

const isLoading = ref(false)

const familyUserForm = ref(null)

const confirm = () => {
	onDialogOK({
		...user.value,
	})
}

const user = ref(props.familyUser)
const userOptions = ref([])

const searchUserByDeviceId = async(query, update) => {
	if (query.length < 1) {
		return update(() => {
			userOptions.value = []
		})
	}

	const response = await api.get("users/search", {
		params: {
			device_id: query
		}
	})

	update(() => {
		userOptions.value = response.data
	})
}
</script>

<template>
	<q-dialog
		ref="dialogRef"
		@hide="onDialogHide"
		maximized
		transition-show="slide-up"
		transition-hide="slide-down"
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

			<template v-if="familyUser">
				<q-card-section class="q-pa-none q-mb-md text-center">
					<div class="text-h5">Добавить пользователя в семью</div>
				</q-card-section>

				<q-form
					ref="familyUserForm"
					greedy
					@submit="confirm"
				>
					<q-input
						filled
						hide-bottom-space
						v-model="user.displayName"
						label="Имя"
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
							@click="familyUserForm?.submit"
						/>
					</div>
				</div>
			</template>

			<template v-else>
				<span>Найти пользователя</span>
				<q-select
					filled
					behavior="menu"
					v-model="user"
					:options="userOptions"
					option-value="id"
					option-label="name"
					use-input
					input-debounce="300"
					@filter="searchUserByDeviceId"
				>
					<template #option="scope">
						<q-item v-bind="scope.itemProps">
							<q-item-section>
								<q-item-label class="flex no-wrap items-center">
									{{ scope.opt.name }} {{ scope.opt.device_model }}
								</q-item-label>
							</q-item-section>
						</q-item>
					</template>
					<template #no-option="{ inputValue }">
						<q-item>
							<q-item-section class="text-grey">
								<span v-if="!inputValue">Введите ID пользователя</span>
								<span v-else>Пользователь не найден</span>
							</q-item-section>
						</q-item>
					</template>
				</q-select>

				<template v-if="user">
					<q-item class="bg-primary q-my-md text-white">
						<q-item-section>
							<q-item-label class="flex no-wrap items-center">
								{{ user.name }} {{ user.device_model }}
							</q-item-label>
						</q-item-section>
					</q-item>

					<q-btn
						label="Добавить пользователя"
						color="primary"
						class="q-pa-md full-width text-body1"
						@click="confirm"
					/>
				</template>

			</template>
		</q-card>
	</q-dialog>
</template>
