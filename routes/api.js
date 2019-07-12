const express = require('express');
const router = express();

//Controllers
const UserController = require('../controllers/UserController');

router.route('/')
    .get(UserController.index);
router.route('/users')
	.get(UserController.index)
	.post(UserController.store);
router.route('/user/:id')
	.get(UserController.show)
	.put(UserController.update)
	.delete(UserController.delete);

module.exports = router;