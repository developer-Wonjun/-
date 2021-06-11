var express = require('express');
var router = express.Router();
const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage')
const db = require('../../../module/pool');
const crypto = require('crypto-promise');
const jwtUtils = require('../../../module/jwt');
const nodemailer = require('nodemailer');        // e-mail 보낼 때 사용
const senderInfo = require('../../../config/senderInfo.json');
const { hash } = require('crypto-promise');
const saltRounds = 10;


router.get('/:email/:name', async (req, res) => {

  const userInfoQurey = "SELECT * from user WHERE email = ? AND name = ?";
  const userInfoResult = await db.queryParam_Parse(userInfoQurey, [req.params.email, req.params.name]); //유저 입력 정보
  if (!userInfoResult) {  //False
    res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR)); 
  }
  else {//True --> 임시비밀번호 랜덤으로 생성하여 발송 && 암호화하여 디비 저장
      var ar = "!@#$%^&*()_-+=~" //특수문자 문자열
      var ac = "0123456789" //숫자가 안들어가는 경우가 있기에 임의로 숫자 추가
      var result = ac.charAt(Math.floor(Math.random()*ac.length)); //숫자추가
      for(var i = 0; i <2; i++){ //랜덤한 특수문자열 2개 추가
        result += ar.charAt(Math.floor(Math.random()*ar.length))
        
      }
      const password = Math.random().toString(36).slice(2); // 랜덤 임시비밀번호 난수 생성
      const newpassword = password + result; // 기존 임시비밀번호 + 임의 숫자 + 랜덤특수문자 2개

      const salt = userInfoResult[0].salt; // salt 업데이트

      const hashPassword = await crypto.pbkdf2(newpassword, salt, 1000, 32, 'SHA512')
      const tempPWD = hashPassword.toString('base64') //임시비밀번호 암호화

      const changePasswordQuery = "UPDATE user SET password = ? WHERE name = ? AND email = ?";
      const changePasswordResult = await db.queryParam_Parse(changePasswordQuery, [tempPWD, req.params.name, req.params.email]);


      const smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: senderInfo.user, // 보내는 메일의 주소 
          pass: senderInfo.pass  // 보내는 메일의 비밀번호
        }
      })

      const mailOptions = {
        from: senderInfo.user,
        to: req.params.email,
        subject: '안녕하세요. 이웃집닥터입니다.',
        text: "임시 비밀번호 : " + newpassword
      };

      await smtpTransport.sendMail(mailOptions, (error, responses) => {
        if (error) {
          console.log(error);
          res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.FIND_PASSWORD_FAIL));      // 올바르지 않은 정보 입니다
        } else {
          res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.FIND_PASSWORD_SUCCESS));      // 아이디 찾기 성공 
        }
        smtpTransport.close();
      });
    }
  });


module.exports = router;
