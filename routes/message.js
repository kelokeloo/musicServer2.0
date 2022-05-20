var express = require("express");
var router = express.Router();
const { getAllMessages } = require("../Api/dataBase/message/index");
const { Message } = require("./../util/dataStruct/index.js");

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    const result = await getAllMessages();
    if (result) {
      res.send(Message(0, "获取成功", result));
    } else {
      res.send(Message(-1, "获取失败"));
    }
  } catch (e) {
    console.log(e);
    res.send(Message(-1, "设置失败"));
  }
});

module.exports = router;
