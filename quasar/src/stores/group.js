import { defineStore } from "pinia"

export const useGroupStore = defineStore("group", {
	state: () => ({
		data: [],
	}),

	actions: {
		setGroups(groups) {
			this.data = groups
		},
		addGroup(group) {
			this.data.unshift(group)
		}
	}
})
