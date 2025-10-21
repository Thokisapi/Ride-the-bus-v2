const express = require('express');
const router = express.Router();
const loginUser = require('../controllers/logincontroller');

router.post('/', loginUser.login);

module.exports = router;