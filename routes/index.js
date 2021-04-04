var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/board', require('./board.js'));
router.use('/user', require('./users.js'));

module.exports = router;

