var express = require('express');
var router = express.Router();

const db = require('../module/pool');



router.get('/search', async (req, res) => {
    
    
    const getBoard = "SELECT * FROM board";
    const getResult = await db.queryParam_None(getBoard);

    console.log(getResult);
    if (!getResult) {
        res.status(200).send("DB 오류");
    } else { //쿼리문이 성공했을 때
        res.status(200).send(getResult);
    }
});

router.get('/search/:boardIdx', async (req, res) => {
    
    console.log(req.params);  /*덩어리 */
    console.log(req.params.boardIdx); /* 덩어리 중에 idx */
    /* get은 params. 나머지는 body로. */
    const getBoard = "SELECT * FROM board WHERE boardIdx = ? ";
    const getResult = await db.queryParam_Parse(getBoard, req.params.boardIdx);

    console.log(getResult);
    if (!getResult) {
        res.status(200).send("DB 오류");
    } else { //쿼리문이 성공했을 때
        res.status(200).send(getResult);
    }
});

router.post('/input', async (req, res) => {
    
    console.log(req.body);

    const getBoard = "INSERT INTO board(title, content, user_id) Values(?,?,?)";
    const getResult = await db.queryParam_Parse(getBoard, [req.body.title, req.body.content, req.body.user_id]);

    console.log(getResult);


    if (!getResult) {
        res.status(200).send("DB 오류");
    } else { //쿼리문이 성공했을 때
        res.status(200).send("성공했습니다.");
    }

});


module.exports = router;





