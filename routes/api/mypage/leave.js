var express = require('express');
var router = express.Router();

const authUtil = require("../../../module/utils/authUtils");   // 토큰 있을 때 사용ßß

const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage');
const db = require('../../../module/pool');
const { Health } = require('aws-sdk');


router.get('/:leave_reason', authUtil.isLoggedin, async(req, res) => {
    const LeaveResonQuery = "INSERT INTO myside.leave(email, leave_reason) VALUES((SELECT email FROM user WHERE user_id=?),?) "
    const LeaveReasonResult = await db.queryParam_Arr(LeaveResonQuery, [req.decoded.id, req.params.leave_reason]);

    if(!LeaveReasonResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    }
    else {
        const LeaveAccountQuery = "DELETE FROM user WHERE user_id = ?"
        const LeaveAccountResult = await db.queryParam_Arr(LeaveAccountQuery, [req.decoded.id]);

        if (!LeaveAccountResult){
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
        else {
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.LEAVE_ACCOUNT_SUCCESS));
    }
}})


module.exports = router;