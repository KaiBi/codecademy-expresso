const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

const createEmployeeTableSqlCommand = `
	CREATE TABLE IF NOT EXISTS \`Employee\`(
		id INTEGER NOT NULL,
		name TEXT NOT NULL,
		position TEXT NOT NULL,
		wage INTEGER NOT NULL,
		is_current_employee INTEGER DEFAULT 1,
		PRIMARY KEY(id)
	);
`;

const createTimesheetTableSqlCommand = `
	CREATE TABLE IF NOT EXISTS \`Timesheet\` (
		id INTEGER NOT NULL,
		hours INTEGER NOT NULL,
		rate INTEGER NOT NULL,
		date INTEGER NOT NULL,
		employee_id INTEGER NOT NULL,
		PRIMARY KEY(id),
		FOREIGN KEY(employee_id) REFERENCES Employees(id)
	)
`;

const createMenuTableSqlCommand = `
	CREATE TABLE IF NOT EXISTS \`Menu\` (
		id INTEGER NOT NULL,
		title TEXT NOT NULL,
		PRIMARY KEY(id)
	)
`;

const createMenuItemTableSqlCommand = `
	CREATE TABLE IF NOT EXISTS \`MenuItem\` (
		id INTEGER NOT NULL,
		name TEXT NOT NULL,
		description TEXT NOT NULL,
		inventory INTEGER NOT NULL,
		price INTEGER NOT NULL,
		menu_id INTEGER NOT NULL,
		PRIMARY KEY(id),
		FOREIGN KEY(menu_id) REFERENCES Menu(id)
	)
`;

db.serialize(function() {
	db.run(createEmployeeTableSqlCommand);
	db.run(createTimesheetTableSqlCommand);
	db.run(createMenuTableSqlCommand);
	db.run(createMenuItemTableSqlCommand);
});
