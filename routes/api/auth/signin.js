var express = require('express');
var router = express.Router();

const crypto = require('crypto-promise');

const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage')
const db = require('../../../module/pool');

const jwtUtils = require('../../../module/jwt');


router.post('/login', async (req, res) => {

    console.log(req.body);

    const getUser = "SELECT * FROM user WHERE email=? AND password =? ";
    const getResult = await db.queryParam_Parse(getUser, [req.body.email, req.body.password]);



    var resResult = {
        success: 0,
        message: "",
        user_id: ""
    }

    if (!getResult) {
        res.status(200).send("DB 오류");
    } else { //쿼리문이 성공했을 때
        if (!getResult[0]) {
            resResult.success = 0;
            resResult.message = "등록된 정보가 없습니다.";
            resResult.user_id = "";
            res.status(200).send(resResult);
        } else {
            const token = jwt.sign({ username: req.body.email }, jwtObj.secret);
            console.log('토큰 생성됨:', token);
            const getToken = "UPDATE user SET token=? WHERE email=? ";
            const TokenResult = await db.queryParam_Parse(getToken, [token, req.body.email]);
            res.status(200).send(TokenResult);

        }
    }
});

module.exports = router;