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
		},
		setTaskField({ taskId, fields }) {
			let task = this.data.find((t) => t.id === taskId)

			if (!task) return

			Object.assign(task, fields)
		},
	}
})
