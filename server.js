const apiRouter = require('./api/api.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');
const express = require('express');
const morgan = require('morgan');

const app = express();
module.exports = app;

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

if (process.env.NODE_ENV === 'development') {
	app.use(errorhandler());
}

app.use('/api', apiRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
	console.log(`Expresso running on port ${port}`);
});
