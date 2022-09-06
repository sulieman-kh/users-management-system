const mysql = require('mysql');


// Create connection
const data = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

// View Users
exports.view = (req, res) => {
  // Connect to the database
  data.getConnection((err, connection) => {
    if (err) throw err;
    console.log('MySql connected...' + connection.threadId)

    // User the connection
    connection.query('SELECT * FROM user', (err, rows) => {
      // Release Users
      connection.release();
      let removedUser = req.query.removed;
      if (!err) {
        res.render('home', { rows, removedUser });
      } else {
        console.error(err);
      };
      console.log('Results: \n', rows)
    });


  });
}

// Search user
exports.find = (req, res) => {
  // Connect to the database
  data.getConnection((err, connection) => {
    if (err) throw err;
    console.log('MySql connected...' + connection.threadId)
    let searchUser = req.body.search;
    // console.log(searchUser);
    connection.query('SELECT * FROM user WHERE first_name LIKE ?', ['%' + searchUser + '%'], (err, rows) => {
      connection.release();
      if (!err) {
        res.render('home', { rows });
      } else {
        console.error(err);
      };
      console.log('Results: \n', rows)
    });
  });
};


exports.form = (req, res) => {
  res.render('add-user');
};

// Add new user
exports.create = (req, res) => {
  const { firstName, lastName, email, phone, comments, userImage } = req.body;
  data.getConnection((err, connection) => {
    if (err) throw err;
    console.log('MySql connected...' + connection.threadId)
    connection
      .query('INSERT INTO user SET ?',
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
          comments: comments,
          user_image: userImage
        },
        (err, rows) => {
          connection.release();
          if (!err) {
            res.render('add-user', { alert: 'User added successfully!' });
          } else {
            console.error(err);
          };
          console.log('Results: \n', rows)
        });
  });
};




// Edit user
exports.edit = (req, res) => {
  // Connect to the database
  data.getConnection((err, connection) => {
    if (err) throw err;
    console.log('MySql connected...' + connection.threadId)

    // User the connection
    connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
      // Release Users
      connection.release();

      if (!err) {
        res.render('edit-user', { rows });
      } else {
        console.error(err);
      };
      console.log('Results: \n', rows)
    });
  });
};

// Update user after edit 
exports.update = (req, res) => {
  const { firstName, lastName, email, phone, comments, userImage } = req.body;
  // Connect to the database
  data.getConnection((err, connection) => {
    if (err) throw err;
    console.log('MySql connected...' + connection.threadId)
    // User the connection
    connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?, user_image = ? WHERE id =?', [firstName, lastName, email, phone, comments, userImage, req.params.id], (err, rows) => {
      // Release Users
      connection.release();
      if (!err) {
        data.getConnection((err, connection) => {
          if (err) throw err;
          console.log('MySql connected...' + connection.threadId)
          // User the connection
          connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
            // Release Users
            connection.release();
            if (!err) {

              res.render('edit-user', {
                rows, alert: `${firstName} hass been updated.`
              });
            } else {
              console.error(err);
            };
            console.log('Results: \n', rows)
          });
        });
      } else {
        console.error(err);
      };
      console.log('Results: \n', rows)
    });
  });
};

// Delete user
exports.delete = (req, res) => {
  // Connect to the database
  data.getConnection((err, connection) => {
    if (err) throw err;
    console.log('MySql connected...' + connection.threadId)
    connection.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, rows) => {
      // Release Users
      connection.release();

      if (!err) {
        let removedUser = encodeURIComponent('User successfully removed.')
        res.redirect('/?removed=?' + removedUser);
      } else {
        console.error(err);
      };
      console.log('Results: \n', rows)
    });
    /*
        //User the connection
        connection.query('UPDATE user SET status = ? WHERE id = ?', ['removed', req.params.id], (err, rows) => {
          if (!err) {
            let removedUser = encodeURIComponent('User successeflly removed.');
            res.redirect('/?removed=' + removedUser);
          } else {
            console.log(err);
          }
          console.log('The data from beer table are: \n', rows);
        });
        */
  });
}
