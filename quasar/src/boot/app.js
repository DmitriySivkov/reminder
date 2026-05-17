import SqliteService from "src/services/sqliteService"
import DbVersionService from "src/services/dbVersionService"
import StorageService from "src/services/storageService"
import InitializeAppService from "src/services/initializeAppService"
import { useTaskStore } from "src/stores/task"
import { useGroupStore } from "src/stores/group"

export default async ({ app, router, store }) => {
	// Define services as unique
	const sqliteServ = new SqliteService()
	const dbVersionServ = new DbVersionService()
	const storageServ = new StorageService(sqliteServ, dbVersionServ)

	const initAppServ = new InitializeAppService(sqliteServ, storageServ)

	app.provide("sqliteServ", sqliteServ)
	app.provide("dbVersionServ", dbVersionServ)
	app.provide("storageServ", storageServ)

	try {
		await initAppServ.initializeApp()

		const taskStore = useTaskStore()
		const groupStore = useGroupStore()

		const promiseTasks = getTasks(storageServ)

		promiseTasks.then((result) => {
			if (result?.values.length) {
				taskStore.setTasks(result.values)
			}
		})

		const promiseGroups = getGroups(storageServ)

		promiseGroups.then((result) => {
			if (result?.values.length) {
				groupStore.setGroups(result.values)
			}
		})
	} catch (error) {
		console.error("App Initialization error:", error)
	}
}

const getTasks = (storageServ) => {
	const sql = "" +
		"SELECT tasks.*, " +
		"groups.name as group_name, " +
		"users.name as user_name, " +
		"users.display_name as user_display_name, " +
		"users.is_device_user as is_device_user " +
		"FROM tasks " +
		"LEFT JOIN groups ON groups.id = tasks.group_id " +
		"LEFT JOIN users ON users.id = tasks.user_id " +
		"ORDER BY tasks.id DESC" +
		";"

	return storageServ.db?.query(sql)
}

const getGroups = async (storageServ) => {
	return storageServ.db?.query("SELECT * FROM groups;")
}
