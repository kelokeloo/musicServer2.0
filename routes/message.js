var express = require("express");
var router = express.Router();
const {
  getAllMessages,
  readMessage,
} = require("../Api/dataBase/message/index");
const { Message } = require("./../util/dataStruct/index.js");

/* GET home page. */
router.get("/", async function (req, res) {
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

/**
 * 已读标记
 */
router.get("/read", async function (req, res) {
  const { from, to } = req.query;
  try {
    await readMessage(from, to);
    res.send(Message(1, "设置成功"));
  } catch (e) {
    console.log(e);
    res.send(Message(-1, "设置失败"));
  }
});

module.exports = router;
