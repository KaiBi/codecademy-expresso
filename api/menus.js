const express = require('express');
const sqlite3 = require('sqlite3');

const menusRouter = express.Router();
module.exports = menusRouter;

const dbPath = process.env.TEST_DATABASE || './database.sqlite';
const db = new sqlite3.Database(dbPath);


// ============================================================================
// =  PARAMETERS                                                              =
// ============================================================================


menusRouter.param('menuId', (req, res, next, menuId) => {
	const findMenuSql = 'SELECT * FROM Menu WHERE id = $menuId';
	const sqlParams = {$menuId: menuId};
	db.get(findMenuSql, sqlParams, (error, menu) => {
		if (error) {
			next(error);
		} else if (menu) {
			req.menu = menu;
			next();
		} else {
			res.sendStatus(404);
		}
	});
});


menusRouter.param('menuItemId', (req, res, next, menuItemId) => {
	const findMenuItemSql = 'SELECT * FROM MenuItem WHERE id = $menuItemId';
	const sqlParams = {$menuItemId: menuItemId};
	db.get(findMenuItemSql, sqlParams, (error, menuItem) => {
		if (error) {
			next(error);
		} else if (menuItem) {
			req.menuItem = menuItem;
			next();
		} else {
			res.sendStatus(404);
		}
	});
});


// ============================================================================
// =  Endpoint "/"                                                            =
// ============================================================================


menusRouter.get('/', (req, res, next) => {
	db.all(
		'SELECT * FROM Menu',
		(error, menus) => {
			if (error) {
				return next(error);
			}
			res.status(200).json({menus});
		}
	);
});


menusRouter.post('/', (req, res, next) => {
	const {title} = req.body.menu;
	if (!title) {
		return res.sendStatus(400);
	}
	const insertNewMenuSql = 'INSERT INTO Menu (title) VALUES ($title)';
	const values = {$title: title};
	db.run(insertNewMenuSql, values, function(error) {
		if (error) {
			return next(error);
		}
		db.get(
			`SELECT * FROM Menu WHERE id = ${this.lastID}`,
			(error, menu) => {
				res.status(201).json({menu});
			}
		);
	});
});


// ============================================================================
// =  Endpoint "/:menuId"                                                     =
// ============================================================================


menusRouter.get('/:menuId', (req, res, next) => {
	res.status(200).json({menu: req.menu});
});


menusRouter.put('/:menuId', (req, res, next) => {
	const {title} = req.body.menu;
	if (!title) {
		return res.sendStatus(400);
	}
	const updateMenuSql = `UPDATE Menu SET title = $title WHERE id = $menuId`;
	const values = {
		$title: title,
		$menuId: req.params.menuId
	};
	db.run(updateMenuSql, values, (error) => {
		if (error) {
			return next(error);
		}
		db.get(
			`SELECT * FROM Menu WHERE id = ${req.params.menuId}`,
			(error, menu) => {
				res.status(200).json({menu});
			}
		);
	});
});


menusRouter.delete('/:menuId', (req, res, next) => {
	db.get(
		`SELECT * FROM MenuItem WHERE menu_id = ${req.menu.id}`,
		(error, menuItem) => {
			if (menuItem) {
				return res.sendStatus(400);
			}
			db.run(
				`DELETE FROM Menu WHERE id = ${req.params.menuId}`,
				(error) => {
					if (error) {
						return next(error);
					}
					res.sendStatus(204);
				}
			);
		}
	);
});


// ============================================================================
// =  Endpoint "/:menuId/menu-items"                                          =
// ============================================================================


menusRouter.get('/:menuId/menu-items', (req, res, next) => {
	db.all(
		`SELECT * FROM MenuItem WHERE menu_id = ${req.params.menuId}`,
		(error, menuItems) => {
			if (error) {
				return next(error);
			}
			res.status(200).json({menuItems});
		}
	);
});


menusRouter.post('/:menuId/menu-items', (req, res, next) => {
	const {name, description, inventory, price} = req.body.menuItem;
	if (!name || !description || !inventory || !price) {
		return res.sendStatus(400);
	}
	const insertNewMenuItemSql = `
		INSERT INTO MenuItem (
			name, description, inventory, price, menu_id
		) VALUES (
			$name, $description, $inventory, $price, $menu_id
		)`;
	const values = {
		$name: name,
		$description: description,
		$inventory: inventory,
		$price: price,
		$menu_id: req.params.menuId
	}
	db.run(insertNewMenuItemSql, values, function(error) {
		if (error) {
			return next(error);
		}
		db.get(
			`SELECT * FROM MenuItem WHERE id = ${this.lastID}`,
			(error, menuItem) => {
				res.status(201).json({menuItem});
			}
		);
	});
});


// ============================================================================
// =  Endpoint "/:menuId/menu-items/:menuItemId"                              =
// ============================================================================


menusRouter.put('/:menuId/menu-items/:menuItemId', (req, res, next) => {
	const {name, description, inventory, price} = req.body.menuItem;
	if (!name || !description || !inventory || !price) {
		return res.sendStatus(400);
	}
	const updateMenuItemSql = `
		UPDATE MenuItem SET
			name = $name,
			description = $description,
			inventory = $inventory,
			price = $price
		WHERE id = $menuItemId`;
	const values = {
		$name: name,
		$description: description,
		$inventory: inventory,
		$price: price,
		$menuItemId: req.params.menuItemId
	}
	db.run(updateMenuItemSql, values, (error) => {
		if (error) {
			return next(error);
		}
		db.get(
			`SELECT * FROM MenuItem WHERE id = ${req.params.menuItemId}`,
			(error, menuItem) => {
				res.status(200).json({menuItem});
			}
		);
	});
});


menusRouter.delete('/:menuId/menu-items/:menuItemId', (req, res, next) => {
	db.run(
		`DELETE FROM MenuItem WHERE id = ${req.params.menuItemId}`,
		(error) => {
			if (error) {
				return next(error);
			}
			res.sendStatus(204);
		}
	);
});
