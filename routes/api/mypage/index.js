var express = require('express');
var router = express.Router();

router.use('/change', require('./changePWD.js'));
router.use('/leave', require('./leave.js'));
router.use('/likelist', require('./likelist.js'));



module.exports = router;
