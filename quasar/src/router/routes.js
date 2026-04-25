
const routes = [
	{
		path: "/",
		component: () => import("layouts/MainLayout.vue"),
		children: [
			{
				path: "",
				name: "home",
				component: () => import("pages/IndexPage.vue"),
				meta: {
					routeName: "Задачи"
				}
			},
			{
				path: "groups",
				name: "groups",
				component: () => import("pages/GroupsPage.vue"),
				meta: {
					routeName: "Группы"
				}
			},
			{
				path: "groups/:group_id",
				name: "groups_detail",
				component: () => import("pages/GroupsDetailPage.vue"),
				meta: {
					routeName: "Группа"
				}
			},
			{
				path: "groups/:group_id/users/:user_id",
				name: "groups_users_detail",
				component: () => import("pages/UsersDetailPage.vue"),
				meta: {
					routeName: "Пользователь"
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
