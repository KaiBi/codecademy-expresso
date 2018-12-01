const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

// TODO: routes go here

const port = process.env.PORT || 4001;
app.listen(port, () => {
	console.log(`Expresso running on port ${port}`);
});
