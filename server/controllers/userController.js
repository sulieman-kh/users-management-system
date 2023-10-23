const pool = require('../../database');


// View Users
exports.view = (req, res) => {
  pool.query('SELECT * FROM users', (err, result) => {
    let rows = result.rows
    let removedUser = req.query.removed;
    if (!err) {
      res.render('home', { rows, removedUser });
    } else {
      console.error(err);
    };
    // console.log('Results: \n', rows)
  });
};

exports.form = (req, res) => {
  res.render('add-user');
};

// Add new user
exports.createUser = (req, res) => {
  const { username, firstname, lastname, email, phone, comment, userImage } = req.body;
  pool.query(` INSERT INTO users (username, firstname, lastname, email, phone, comment, userimage, activity ) VALUES ( '${username}','${firstname}', '${lastname}', '${email}', ${phone}, '${comment}', '${userImage}', 'Добавлен новый пользователь ${username}')`, (err) => {
    if (!err) {
      res.render('add-user', { alert: 'Пользователь успешно добавлен!' });
    } else {
      console.error(' err ya sleman ' + err);
    };
  });
};

// Edit user
exports.edit = (req, res) => {
  pool.query('SELECT * FROM users WHERE id = $1', [req.params.id], (err, result) => {
    const rows = result.rows
    if (!err) {
      res.render('edit-user', { rows });
    } else {
      console.error(err);
    };
    // console.log('Results from edit: \n', rows)
  });
};

// Update user after edit 
exports.update = (req, res) => {
  const { username, firstname, lastname, email, phone, comment, userImage } = req.body;
  pool.query(`UPDATE users SET username = $1, firstname = $2, lastname = $3, email = $4, phone = $5, comment = $6, userImage = $7, activity = '${firstname}: Данные этого пользователя изменились' WHERE id = $8`, [username, firstname, lastname, email, phone, comment, userImage, req.params.id], (err, rows) => {
    if (!err) {
      pool.query('SELECT * FROM users WHERE id = $1', [req.params.id], (err, result) => {
        const rows = result.rows
        if (!err) {
          res.render('edit-user', {
            rows, alert: `${firstname} Данные пользователя обновлены.`
          });
        } else {
          console.error(err);
        };
        console.log('Results after updated user: \n', rows)
      });
    } else {
      console.error('mn hon' + err);
    };
    // console.log('Results: \n', rows)
  });
};

// Delete user
exports.delete = (req, res) => {
  pool.query('DELETE FROM users WHERE id = $1', [req.params.id], (err, result) => {
    if (!err) {
      let removedUser = encodeURIComponent('User successfully removed')
      res.redirect('/?removed=?' + removedUser);
    } else {
      console.error(err);
    };
  });
};


// View users activities
exports.viewActivites = (req, res) => {
  pool.query('SELECT * FROM users', (err, result) => {
    let rows = result.rows
    // let removedUser = req.query.removed;
    if (!err) {
      res.render('users-activities', { rows });
    } else {
      console.error(err);
    };
    // console.log('Results: \n', rows)
  });
}
