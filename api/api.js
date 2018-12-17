const express = require('express');
const employeesRouter = require('./employees.js');
const menusRouter = require('./menus.js');

const apiRouter = express.Router();
module.exports = apiRouter;
apiRouter.use('/employees', employeesRouter);
apiRouter.use('/menus', menusRouter);
