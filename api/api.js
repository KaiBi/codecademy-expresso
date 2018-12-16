const express = require('express');
const employeesRouter = require('./employees.js');

const apiRouter = express.Router();
module.exports = apiRouter;
apiRouter.use('/employees', employeesRouter);
