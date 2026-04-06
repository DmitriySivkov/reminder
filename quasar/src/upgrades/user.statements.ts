export const UserUpgradeStatements = [
	{
		toVersion: 1,
		statements: [
			`CREATE TABLE IF NOT EXISTS users (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             external_id INTEGER NOT NULL,
             name TEXT NOT NULL,
             display_name TEXT,
						 is_device_user INTEGER NOT NULL DEFAULT 0
             );`,
			`CREATE TABLE IF NOT EXISTS groups (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             external_id INTEGER NOT NULL,
             uuid TEXT NOT NULL,
             name TEXT NOT NULL
             );`,
			`CREATE TABLE IF NOT EXISTS group_user (
             group_id INTEGER NOT NULL,
             user_id INTEGER NOT NULL
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
