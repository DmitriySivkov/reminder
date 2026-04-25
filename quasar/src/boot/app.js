import SqliteService from "src/services/sqliteService"
import DbVersionService from "src/services/dbVersionService"
import StorageService from "src/services/storageService"
import InitializeAppService from "src/services/initializeAppService"

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
	} catch (error) {
		console.error("App Initialization error:", error)
	}
}
