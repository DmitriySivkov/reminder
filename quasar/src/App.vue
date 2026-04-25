<script setup>
import { StatusBar, Style } from "@capacitor/status-bar"

// todo - посмотреть можно ли запускать это раньше, например в boot файле
// Display content under transparent status bar
StatusBar.setOverlaysWebView({ overlay: false })
StatusBar.setStyle({ style: Style.Dark })
StatusBar.setBackgroundColor({
	color: "#1976D2"
})
</script>

<template>
	<router-view />
</template>
