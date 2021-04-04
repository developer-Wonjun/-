var express = require('express');
var router = express.Router();
const defaultRes = require("../module/utils/utils");
const statusCode = require("../module/utils/statusCode");
const resMessage = require("../module/utils/responseMessage");
const db = require('../module/pool');
var nodemailer = require('nodemailer');
var smtpPool=require('nodemailer-smtp-pool');

router.get('/', async (req, res) => {


  const getBoard = "SELECT * FROM board";
  const getResult = await db.queryParam_None(getBoard);

  console.log(getResult);
  if (!getResult) {
    res.status(200).send("DB 오류");
  } else { //쿼리문이 성공했을 때
    res.status(200).send(getResult);
  }
});
/* GET users listing. */
router.post('/login', async (req, res) => {

  console.log(req.body);

  const getUser = "SELECT * FROM User_TB WHERE user_email=? AND user_password =? ";
  const getResult = await db.queryParam_Parse(getUser, [req.body.user_email, req.body.user_password]);



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
      resResult.success = 1;
      resResult.message = "DB연결 성공 및 로그인 성공";
      resResult.user_id = getResult[0].user_idx;
      res.status(200).send(resResult);
    }
  }
});

  router.post('/password', async (req, res) => {

    console.log(req.body);
    const getUser = "SELECT * FROM User_TB WHERE user_email=? AND user_phone =? ";
    const getResult = await db.queryParam_Parse(getUser, [req.body.user_email, req.body.user_phone]);

  
  /*
    var resResult = {
      success: 0,
      message: "",
      user_id: ""
    }
    */
    console.log(getResult);
    
    if (!getResult[0]) {
      res.status(200).send("입력된 정보가 잘못되었습니다.");
    } else { //쿼리문이 성공했을 때

      //f 추출
      var random = Math.floor(Math.random() * 10000);

      const getUpdate = "UPDATE myside.User_TB SET user_password =? WHERE user_email =? AND user_phone = ?";
      const getResult = await db.queryParam_Parse(getUpdate, [random,req.body.user_email, req.body.user_phone]);
      
      
      //sms 보내기 

      //res.status(200).send("비밀번호 변경 완료 ");
      res.status(200).send(defaultRes.successTrue(statusCode.OK, "필독사항 조회 성공"));
    }
    
});

module.exports = router;
