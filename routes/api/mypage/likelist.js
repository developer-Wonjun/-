var express = require('express');
var router = express.Router();

const authUtil = require("../../../module/utils/authUtils"); 

const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage');
const db = require('../../../module/pool');


router.get('/', authUtil.isLoggedin,async (req, res) => {

    const LikeSelectQuery = 
    'SELECT food_id, name,img,category,cancerNM,wishes,likes,nutrition1,background_color,foreground_color '
    + 'FROM likelist A, food_thumbnail B, cancer_food C  '
    + 'WHERE A.user_id = ? '
    + 'AND A.food = B.name '
    + 'AND A.food = C.food' // 로그인한 유저가 좋아요한 음식을 썸네일,암-음식 테이블에서 정보를 가져온다.
    const LikeSelectResult = await db.queryParam_Arr(LikeSelectQuery, [req.decoded.id]);
    
    if(!LikeSelectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    }else{
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.LIKE_SELECT_SUCCESS,LikeSelectResult));
    }


});

module.exports = router;