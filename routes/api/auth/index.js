var express = require('express');
var router = express.Router();

router.use("/signin", require("./signin"));
router.use("/signup", require("./signup"));
router.use("/duplicated", require("./duplicated"));
router.use("/password", require("./password"));
 

module.exports = router;
