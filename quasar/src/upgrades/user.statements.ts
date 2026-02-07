export const UserUpgradeStatements = [
	{
		toVersion: 1,
		statements: [
			`CREATE TABLE IF NOT EXISTS users (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             external_id INTEGER NOT NULL,
             name TEXT NOT NULL,
             display_name TEXT
             );`,
			`CREATE TABLE IF NOT EXISTS families (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             external_id INTEGER NOT NULL,
             name TEXT NOT NULL
             );`,
			`CREATE TABLE IF NOT EXISTS family_user (
             family_id INTEGER NOT NULL,
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
