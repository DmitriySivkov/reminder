export const UserUpgradeStatements = [
	{
		toVersion: 1,
		statements: [
			`CREATE TABLE IF NOT EXISTS users (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             external_id INTEGER NOT NULL,
             name VARCHAR(255) NOT NULL,
             display_name VARCHAR(255),
						 is_device_user INTEGER NOT NULL DEFAULT 0
             );`,
			`CREATE TABLE IF NOT EXISTS groups (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             external_id INTEGER NOT NULL,
             uuid VARCHAR(255) NOT NULL,
             name VARCHAR(255) NOT NULL
             );`,
			`CREATE TABLE IF NOT EXISTS group_user (
             group_id INTEGER NOT NULL,
             user_id INTEGER NOT NULL
             );`,
			`CREATE TABLE IF NOT EXISTS tasks (
							id INTEGER PRIMARY KEY AUTOINCREMENT,
							external_id INTEGER NOT NULL,
							group_id INTEGER NOT NULL,
							user_id INTEGER NOT NULL,
							headline VARCHAR(255) NOT NULL,
							text VARCHAR(65535) NOT NULL,
							is_sent INTEGER NOT NULL DEFAULT 0
             );`,
		]
	},
	/* add new statements below for next database version when required*/
	/*
	{
			toVersion: 2,
			statements: [
					`ALTER TABLE users ADD COLUMN email TEXT;`,
			]
	},
	*/
]
