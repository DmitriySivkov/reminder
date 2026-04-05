
const routes = [
	{
		path: "/",
		component: () => import("layouts/MainLayout.vue"),
		children: [
			{
				path: "",
				component: () => import("pages/IndexPage.vue")
			},
			{
				path: "groups",
				component: () => import("pages/GroupsPage.vue"),
				meta: {
					routeName: "Группы"
				}
			},
			{
				path: "groups/:group_id",
				component: () => import("pages/GroupsDetailPage.vue"),
				meta: {
					routeName: "Группа"
				}
			}
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
