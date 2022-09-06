const express = require('express');
const exphbs = require('express-handlebars');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Default option
app.use(fileUpload());

// Parsing middleware
// Parse application/www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());


// Static files
app.use(express.static('public'));


// Templating Engine 
app.engine('hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', 'hbs');

// Create connection
const data = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});


// Connect to the database
data.getConnection((err, connection) => {
  if (err) throw err;
  console.log('MySql connected...' + connection.threadId)
});


// Router
const routes = require('./server/routes/user');
app.use('/', routes);

app.listen(port, () => {
  console.log(`server is working - port ${port}`);
});