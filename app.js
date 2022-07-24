'use strict';

require('dotenv').config();

let express             = require('express');
let expressValidator    = require('express-validator');
let bodyParser          = require('body-parser');
let cors                = require('cors');
let swaggerUi           = require('swagger-ui-express');
const swaggerDocument   = require('./swagger.json');

let app             = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

require('./routes.js')(app);

app.listen(process.env.SERVER_PORT);

console.log(`${process.env.APP_NAME} started on :>> ${process.env.SERVER_PORT}`);