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
const bcrypt = require('bcrypt');

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
