
const routes = [
	{
		path: "/",
		component: () => import("layouts/MainLayout.vue"),
		children: [
			{ path: "", component: () => import("pages/IndexPage.vue") },
			{ path: "families", component: () => import("pages/FamiliesPage.vue") },
			{ path: "families/:family_id", component: () => import("pages/FamiliesDetailPage.vue") }
		]
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: "/:catchAll(.*)*",
		component: () => import("pages/ErrorNotFound.vue")
	}
]

export default routes
