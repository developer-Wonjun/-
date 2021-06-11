var express = require('express');
var router = express.Router();

const crypto = require('crypto-promise');

const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage')
const db = require('../../../module/pool');
const jwtUtils = require('../../../module/jwt');


router.post('/signup', async (req, res) => {

    const getUser = "SELECT * FROM user WHERE email=?";
    const getResult = await db.queryParam_Parse(getUser, req.body.email);

    if (getResult[0] == null) {
        console.log("중복 없음");
        const Signup = "INSERT INTO user(email, password, name, phone, user_identity, nickname, cancer_kind, cancer_status, cancer_step, gender, age, height, weight, disease, disable_food) Values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        const SignupResult = await db.queryParam_Parse(Signup, [req.body.email, req.body.password, req.body.name, req.body.phone, req.body.user_identity, req.body.nickname, req.body.cancer_kind, req.body.cancer_status, req.body.cancer_step, req.body.gender, req.body.age, req.body.height, req.body.weight, req.body.disease, req.body.disable_food]);
        res.status(200).send(SignupResult);
    } else {
        res.status(200).send("존재하는 이메일입니다.");
    }

});
module.exports = router;