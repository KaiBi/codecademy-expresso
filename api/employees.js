const express = require('express');
const sqlite3 = require('sqlite3');

const employeesRouter = express.Router();
module.exports = employeesRouter;

const dbPath = process.env.TEST_DATABASE || './database.sqlite';
const db = new sqlite3.Database(dbPath);


// ============================================================================
// =  PARAMETERS                                                              =
// ============================================================================


employeesRouter.param('employeeId', (req, res, next, employeeId) => {
	const findEmployeeSql = 'SELECT * FROM Employee WHERE id = $employeeId';
	const sqlParams = {$employeeId: employeeId};
	db.get(findEmployeeSql, sqlParams, (error, employee) => {
		if (error) {
			next(error);
		} else if (employee) {
			req.employee = employee;
			next();
		} else {
			res.sendStatus(404);
		}
	});
});


employeesRouter.param('timesheetId', (req, res, next, timesheetId) => {
	const findTimesheetSql = 'SELECT * FROM Timesheet WHERE id = $timesheetId';
	const sqlParams = {$timesheetId: timesheetId};
	db.get(findTimesheetSql, sqlParams, (error, timesheet) => {
		if (error) {
			next(error);
		} else if (timesheet) {
			req.timesheet = timesheet;
			next();
		} else {
			res.sendStatus(404);
		}
	});
});


// ============================================================================
// =  Endpoint "/"                                                            =
// ============================================================================


employeesRouter.get('/', (req, res, next) => {
	db.all(
		'SELECT * FROM Employee WHERE is_current_employee = 1',
		(error, employees) => {
			if (error) {
				return next(error);
			}
			res.status(200).json({employees});
		}
	);
});


employeesRouter.post('/', (req, res, next) => {
	const {name, position, wage, is_current_employee: isCurrentEmployee} = req.body.employee;
	if (!name || !position || !wage) {
		return res.sendStatus(400);
	}
	const insertNewEmployeeSql = `
		INSERT INTO Employee (name, position, wage
		${isCurrentEmployee > -1? ', is_current_employee' : ''}
		) VALUES ($name, $position, $wage
		${isCurrentEmployee > -1? ', $isCurrentEmployee' : ''}
		)`;
	const values = {
		$name: name,
		$position: position,
		$wage: wage,
		$isCurrentEmployee: isCurrentEmployee
	};
	db.run(insertNewEmployeeSql, values, function(error) {
		if (error) {
			return next(error);
		}
		db.get(
			`SELECT * FROM Employee WHERE id = ${this.lastID}`,
			(error, employee) => {
				res.status(201).json({employee});
			}
		);
	});
});


// ============================================================================
// =  Endpoint "/:employeeId"                                                 =
// ============================================================================


employeesRouter.get('/:employeeId', (req, res, next) => {
	res.status(200).json({employee : req.employee});
});


employeesRouter.put('/:employeeId', (req, res, next) => {
	const {name, position, wage} = req.body.employee;
	if (!name || !position || !wage) {
		return res.sendStatus(400);
	}
	const updateEmployeeSql = `
		UPDATE Employee SET
			name = $name,
			position = $position,
			wage = $wage
		WHERE id = ${req.params.employeeId}`;
	const values = {
		$name: name,
		$position: position,
		$wage: wage
	}
	db.run(updateEmployeeSql, values, (error) => {
		if (error) {
			return next(error);
		}
		db.get(
			`SELECT * FROM Employee WHERE id = ${req.params.employeeId}`,
			(error, employee) => {
				res.status(200).json({employee});
			}
		);
	});
});


employeesRouter.delete('/:employeeId', (req, res, next) => {
	db.run(`
		UPDATE Employee SET is_current_employee = 0 WHERE id = ${req.params.employeeId}`,
		(error) => {
			if (error) {
				return next(error);
			}
			db.get(
				`SELECT * FROM Employee WHERE id = ${req.params.employeeId}`,
				(error, employee) => {
					res.status(200).json({employee});
				}
			);
		}
	);
});


// ============================================================================
// =  Endpoint "/:employeeId/timesheets"                                      =
// ============================================================================


employeesRouter.get('/:employeeId/timesheets', (req, res, next) => {
	db.all(
		`SELECT * FROM Timesheet WHERE employee_id = ${req.params.employeeId}`,
		(error, timesheets) => {
			if (error) {
				return next(error);
			}
			res.status(200).json({timesheets});
		}
	);
});


employeesRouter.post('/:employeeId/timesheets', (req, res, next) => {
	const {hours, rate, date} = req.body.timesheet;
	if (!hours || !rate || !date) {
		return res.sendStatus(400);
	}
	const insertNewTimesheetSql = `
		INSERT INTO Timesheet (hours, rate, date, employee_id)
		VALUES ($hours, $rate, $date, $employee_id)`;
	const values = {
		$hours: hours,
		$rate: rate,
		$date: date,
		$employee_id: req.params.employeeId
	}
	db.run(insertNewTimesheetSql, values, function(error) {
		if (error) {
			return next(error);
		}
		db.get(
			`SELECT * FROM Timesheet WHERE id = ${this.lastID}`,
			(error, timesheet) => {
				res.status(201).json({timesheet: timesheet});
			}
		);
	});
});


// ============================================================================
// =  Endpoint "/:employeeId/timesheets/:timesheetId"                         =
// ============================================================================


employeesRouter.put('/:employeeId/timesheets/:timesheetId', (req, res, next) => {
	const {hours, rate, date} = req.body.timesheet;
	if (!hours || !rate || !date) {
		return res.sendStatus(400);
	}
	const updateTimesheetSql = `
		UPDATE Timesheet SET
			hours = $hours,
			rate = $rate,
			date = $date
		WHERE id = ${req.params.timesheetId}`;
	const values = {
		$hours: hours,
		$rate: rate,
		$date: date
	}
	db.run(updateTimesheetSql, values, (error) => {
		if (error) {
			return next(error);
		}
		db.get(
			`SELECT * FROM Timesheet WHERE id = ${req.params.timesheetId}`,
			(error, timesheet) => {
				res.status(200).json({timesheet});
			}
		);
	});
});


employeesRouter.delete('/:employeeId/timesheets/:timesheetId', (req, res, next) => {
	db.run(
		`DELETE FROM Timesheet WHERE id = ${req.params.timesheetId}`,
		(error) => {
			if (error) {
				return next(error);
			}
			res.sendStatus(204);
		}
	);
});
