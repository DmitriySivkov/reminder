import { defineStore } from "pinia"

export const useTaskStore = defineStore("task", {
	state: () => ({
		data: [],
	}),

	actions: {
		setTasks(tasks) {
			this.data = tasks
		},
		addTask(task) {
			this.data.unshift(task)
		}
	}
})
