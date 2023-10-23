const express = require('express');
const exphbs = require('express-handlebars');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
const port = 5000;

// Default option
app.use(fileUpload());

// Parse application/www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());


// Static files
app.use(express.static('public'));


// Templating Engine 
app.engine('hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', 'hbs');


// Test
app.get('/api/test', () => {
  console.log('test is successfull 🎉')
})

// Router
const routes = require('./server/routes/user');
app.use('/', routes);
// Listen
app.listen(port, () => {
  console.log(`server is working - port ${port}`);
});