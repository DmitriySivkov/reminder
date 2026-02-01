<template>
	<router-view />
</template>

<script setup>
import { Platform } from "quasar"
import { StatusBar, Style } from "@capacitor/status-bar"

if (Platform.is.capacitor) {
	// Display content under transparent status bar
	StatusBar.setOverlaysWebView({ overlay: false })
	StatusBar.setStyle({ style: Style.Dark })
	StatusBar.setBackgroundColor({
		color: "#1976D2"
	})
}
</script>
