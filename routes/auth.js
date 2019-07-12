const express = require('express');
const router = express();

//Controllers
const AuthController = require('../controllers/AuthController');

router.route('/login')
    .post(AuthController.login);
router.route('/register')
    .post(AuthController.register);

module.exports = router;