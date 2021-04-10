var express = require('express');
var router = express.Router();

const db = require('../module/pool');


//게시글 전체리스트
router.get('/search/:flag', async (req, res) => {
    
    var flag =req.params.flag;
    let getBoard = "";

    if(!flag){
        getBoard = "SELECT * FROM board";
    }
    else{
        if (flag == 1) { // 좋아요순
        getBoard = "SELECT * FROM board ORDER BY like_sum DESC";
        } else if(flag == 2) {
        getBoard = "SELECT * FROM board ORDER BY date DESC ";
        }
    }
    const getResult = await db.queryParam_None(getBoard);
    res.status(200).send(getResult);
});

//게시글 상세보기
router.get('/detail/:boardIdx/:user_id', async (req, res) => {
    
    console.log(req.params);  /*덩어리 */
    console.log(req.params.boardIdx); /* 덩어리 중에 idx */
    /* get은 params. 나머지는 body로. */
    const getBoard1 = "SELECT * FROM board WHERE boardIdx = ? ";
    const getResult1 = await db.queryParam_Parse(getBoard1, req.params.boardIdx);

    const getBoard2 = "SELECT * FROM likelist WHERE boardIdx = ? AND user_id=?" ;
    const getResult2 = await db.queryParam_Parse(getBoard2, [req.params.boardIdx, req.params.user_id]);

    if (!getResult1 || !getResult2) {
        res.status(200).send("DB 오류");
    } else { //쿼리문이 성공했을 때
        var resResult = {
            success: 0,
            message: "",
            data : {
                title:"",
                content:"",
                like_sum:0,
                like_status: 0
            }
        }
        if (!getResult2[0]){
            resResult.success = 0;
            resResult.message = "좋아요 누르지 않음.";
            resResult.data.title = getResult1[0].title;
            resResult.data.content = getResult1[0].content;
            resResult.data.like_sum = getResult1[0].like_sum;
    
            resResult.data.like_status = 0;
            res.status(200).send(resResult);

    
        } else{
            resResult.success = 1;
            resResult.message = "좋아요 누른 상태.";
            resResult.data.title = getResult1[0].title;
            resResult.data.content = getResult1[0].content;
            resResult.data.like_sum = getResult1[0].like_sum;
    
            resResult.data.like_status = 1;
            res.status(200).send(resResult);
        }
    }
});

//게시글 댓글보기
router.get('/search/:boardIdx/comment', async (req, res) => {
    
    console.log(req.params);  /*덩어리 */
    console.log(req.params.boardIdx); /* 덩어리 중에 idx */
    const getComment = "SELECT * FROM comment WHERE boardIdx = ?";
    const getCommentResult = await db.queryParam_Parse(getComment, req.params.boardIdx);

    if (!getCommentResult) {
        res.status(200).send("DB 오류");
    } else { //쿼리문이 성공했을 때

        res.status(200).send(getCommentResult);
    }
});

//게시글 댓글 쓰기
router.post('/search/:boardIdx/comment', async (req, res) => {
    
    console.log(req.body);
    console.log(req.body.boardIdx);

    const getComment = "INSERT INTO comment(boardIdx, user_id, content) Values(?,?,?)";
    const getResult = await db.queryParam_Parse(getComment, [req.body.boardIdx, req.body.user_id, req.body.content]);

    console.log(getResult);


    if (!getResult) {
        res.status(200).send("DB 오류");
    } else { //쿼리문이 성공했을 때
        res.status(200).send(getResult);
    }

});

//게시글 쓰기
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

router.post('/like/:like_status', async (req, res) => {

    console.log(req.body);
    console.log(req.body.boardIdx);
    console.log(req.body.like_status);
     
    

    if (like_status == 0) {
        console.log(req.body);
        const addLike = "INSERT INTO likelist(boardIdx, user_id, date) Values(?,?,?)";
        const addResult = await db.queryParam_Parse(addLike, [req.body.boardIdx, req.body.user_id, req.body.date]);
        res.status(200).sendStatus("좋아요 추가 성공");
    } else{
        console.log(req.body);
        const delLike = "DELETE FROM likelist WHERE boardIdx = ?";
        const delResult = await db.queryParam_Parse(delLike, [req.body.boardIdx]);
        res.status(200).sendStatus("좋아요 삭제 성공");

    }

});

module.exports = router;





