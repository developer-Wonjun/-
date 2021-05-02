var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();
const defaultRes = require("../module/utils/utils");
const statusCode = require("../module/utils/statusCode");
const resMessage = require("../module/utils/responseMessage");
const db = require('../module/pool');
const mailer = require('./mail');
const senderInfo = require('../config/senderInfo.json');
const jwt = require("jsonwebtoken");
const jwtObj = require("../config/jwt");


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

router.post('/signup', async (req, res) => {

  const getUser = "SELECT * FROM user WHERE email=?";
  const getResult = await db.queryParam_Parse(getUser, req.body.email);

  if (getResult[0]==null) {
    console.log("중복 없음");
    const Signup = "INSERT INTO user(email, password, name, phone, user_identity, nickname, cancer_kind, cancer_status, cancer_step, gender, age, height, weight, disease, disable_food) Values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    const SignupResult = await db.queryParam_Parse(Signup, [req.body.email, req.body.password, req.body.name, req.body.phone, req.body.user_identity, req.body.nickname, req.body.cancer_kind, req.body.cancer_status, req.body.cancer_step, req.body.gender, req.body.age, req.body.height, req.body.weight, req.body.disease, req.body.disable_food]);
    res.status(200).send(SignupResult);
  }else{
    res.status(200).send("존재하는 이메일입니다.");
  }
  
});



/* GET users listing. */
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
      const token = jwt.sign({username:req.body.email}, jwtObj.secret);
      console.log('토큰 생성됨:', token);
      const getToken = "UPDATE user SET token=? WHERE email=? ";
      const TokenResult = await db.queryParam_Parse(getToken, [token, req.body.email]);
      res.status(200).send(TokenResult);
      
    }
  }
});

router.post('/password', async (req, res) => {

  console.log(req.body);
  const getUser = "SELECT * FROM user WHERE email=? AND name =? ";
  const getUserinfo = await db.queryParam_Parse(getUser, [req.body.email, req.body.name]);



  if (!getUserinfo[0]) {
    res.status(200).send("입력된 정보가 잘못되었습니다.");
  } else { //쿼리문이 성공했을 때

    //f 추출
    var random = Math.floor(Math.random() * 10000);

    const getUpdate = "UPDATE myside.user SET password =? WHERE email =? AND name = ?";
    const getResult = await db.queryParam_Parse(getUpdate, [random, req.body.email, req.body.name]);

    let email = req.body.email;
    var password = random;
    console.log(email);
    console.log(password);


    const smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: senderInfo.user,
        pass: senderInfo.pass
      }
    })
    
    const mailOptions = {
      from: senderInfo.user,
      to: email,
      subject: '안녕하세요. 이웃집닥터입니다.',
      text: "임시 비밀번호 : " + password
    };

    await smtpTransport.sendMail(mailOptions, (error, responses) => {
      if (error) {
        console.log(error);
        res.status(200).send("실패");
      } else {
        res.status(200).send("성공");
      }
      smtpTransport.close();
    });
  }
});


module.exports = router;
