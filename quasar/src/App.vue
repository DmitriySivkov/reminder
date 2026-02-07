<script setup>
import { Platform } from "quasar"
import { StatusBar, Style } from "@capacitor/status-bar"

import { onMounted, provide } from "vue"
import { JeepSqlite } from "jeep-sqlite/dist/components/jeep-sqlite"
import SqliteService from "src/services/sqliteService"
import DbVersionService from "src/services/dbVersionService"
import StorageService from "src/services/storageService"
import InitializeAppService from "src/services/initializeAppService"

// Define services as unique
const sqliteServ = new SqliteService()
const dbVersionServ = new DbVersionService()
const storageServ = new StorageService(sqliteServ, dbVersionServ)

provide("sqliteServ", sqliteServ)
provide("dbVersionServ", dbVersionServ)
provide("storageServ", storageServ)

customElements.define("jeep-sqlite", JeepSqlite)
const initAppServ = new InitializeAppService(sqliteServ, storageServ)

const initApp = async () => {
	try {
		await initAppServ.initializeApp()
	} catch (error) {
		console.error("App Initialization error:", error)
	}
}

if (Platform.is.capacitor) {
	// Display content under transparent status bar
	StatusBar.setOverlaysWebView({ overlay: false })
	StatusBar.setStyle({ style: Style.Dark })
	StatusBar.setBackgroundColor({
		color: "#1976D2"
	})
}

onMounted(async() => {
	if (Platform.is.capacitor) {
		await initApp()
	} else {
		const jeepEl = document.createElement("jeep-sqlite")
		document.body.appendChild(jeepEl)
		customElements
			.whenDefined("jeep-sqlite")
			.then(async () => {
				await initApp()
			})
			.catch((err) => {
				console.error("jeep-sqlite creation error:", err)
			})
	}
})
</script>

<template>
	<router-view />
</template>
