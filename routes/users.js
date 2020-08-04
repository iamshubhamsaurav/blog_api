const express = require('express');

const userController = require('../controllers/users');

const router = express.Router();

router.route('/').get(userController.getUsers).post(userController.createUser);

router.route('/admins').get(userController.getAdmins);

router
  .route('/:id')
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
