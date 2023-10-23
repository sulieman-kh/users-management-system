const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// create, update, delete, activity
router.get('/', userController.view);
router.get('/adduser', userController.form);
router.post('/adduser', userController.createUser);

router.get('/usersactivities', userController.viewActivites);


router.get('/edituser/:id', userController.edit);
router.post('/edituser/:id', userController.update);
router.get('/:id', userController.delete);

module.exports = router;