var express = require("express");
var router = express.Router();
const {
  getUserIdByAccount,
  getUserInfo,
  insertOneUser,
} = require("../Api/dataBase/User/index");
const { Message } = require("../util/dataStruct/index.js");
const { createToken } = require("../util/token/index");

router.post("/login", async function (req, res) {
  const { account, password } = req.body;
  const userId = await getUserIdByAccount(account);
  if (!userId) {
    res.send(Message(-1, "账号不存在"));
    return;
  }
  const userInfo = await getUserInfo(userId);
  console.log(userInfo, password);
  // 判断密码是否匹配
  if (password !== userInfo.password) {
    res.send(Message(-1, "账号与密码不匹配"));
    return;
  }
  delete userInfo.password;
  // 如果都匹配， 生成token
  const token = createToken(account);

  res.send(
    Message(0, "账号密码正确", {
      token,
      userInfo,
    })
  );
});

router.post("/signUp", async function (req, res) {
  const { account, nickName, password } = req.body;
  // 判断账号是否存在
  let userId = await getUserIdByAccount(account);
  console.log(account, userId);
  if (userId) {
    res.send(Message(-1, "用户账号已经存在，请直接登录"));
    return;
  }

  const document = {
    account,
    nickName,
    password,
    likeMusics: [],
  };
  userId = await insertOneUser(document);
  const userInfo = await getUserInfo(userId, 1);

  // 带上token
  const token = createToken(account);

  res.send(
    Message(0, "创建成功", {
      userInfo,
      token,
    })
  );
});

module.exports = router;
