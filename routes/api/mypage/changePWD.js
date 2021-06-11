var express = require('express');
var router = express.Router();
const authUtil = require("../../../module/utils/authUtils");   // 토큰 있을 때 사용ßß
const crypto = require('crypto-promise');

const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage');
const db = require('../../../module/pool');
const { Health } = require('aws-sdk');

const jwtUtils = require('../../../module/jwt');



router.put('/password', authUtil.isLoggedin, async (req, res) => {

    id = req.decoded.id; //토큰
    password = req.body.password //기존 비밀번호
    newpassword = req.body.newpassword //새로운 비밀번호
    const selectUserQuery = 'SELECT * FROM user WHERE user_id = ?'
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, [req.decoded.id]);
    const salt = selectUserResult[0].salt;
    const hashedEnterPw = await crypto.pbkdf2(password, salt, 1000, 32, 'SHA512')
    const dbPw = selectUserResult[0].password

    if (hashedEnterPw.toString('base64') == dbPw) {  // 입력한 비밀번호 True 

        const salt1 = selectUserResult[0].salt; // salt 업데이트

        const hashPassword = await crypto.pbkdf2(newpassword, salt1, 1000, 32, 'SHA512')//새로운 비밀번호
        const PassNew = hashPassword.toString('base64') //새로운 비밀번호
  
        const changePasswordQuery = "UPDATE user SET password = ? WHERE user_id = ?";
        const changePasswordResult = await db.queryParam_Parse(changePasswordQuery, [PassNew, id]);
  
        if(!changePasswordResult){
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
        else{
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.CHANGE_PASSWORD_SUCCESS));

        }
    } else { // 입력 비밀번호 False
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.INCORRECT_PASSWORD));
    }
});



module.exports = router;