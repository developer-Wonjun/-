var express = require('express');
var router = express.Router();
const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage')
const db = require('../../../module/pool');


router.get('/email/:email', async (req, res) => {

    const getEmail = "SELECT email FROM user WHERE email=?";
    const getEmailResult = await db.queryParam_Parse(getEmail, req.body.email);

    if (!getEmailResult) {
        res.status(200).send("DB오류");
    } else {
        if (getEmailResult[0] == null) {
            console.log("중복 없음");
            res.status(200).send(defaultRes.successTrue(statusCode.OK, "사용할 수 있는 이메일 입니다.", {

            }))
        } else {
            res.status(200).send(defaultRes.successTrue(statusCode.OK, "중복된 이메일 입니다.", {

            }))
        }
    }
});

router.get('/nickname/:nickname', async (req, res) => {

    const getNickname = "SELECT nickname FROM user WHERE nickname=?";
    const getNicknameResult = await db.queryParam_Parse(getNickname, req.body.nickname);

    if (!getNicknameResult) {
        res.status(200).send("DB오류");
    } else {
        if (getNicknameResult[0] == null) {
            res.status(200).send(defaultRes.successTrue(statusCode.OK, "사용할 수 있는 닉네임입니다.", {

            }))
        } else {
            res.status(200).send(defaultRes.successFalse(statusCode.OK, "중복된 닉네임입니다.", {

            }))
        }
    }
});

module.exports = router;
