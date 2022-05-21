var express = require("express");
var router = express.Router();
const {
  getAllMemorys,
  getMemoryLike,
  setMemoryLike,
  removeMemoryLike,
} = require("../Api/dataBase/memory");
const { Message } = require("./../util/dataStruct/index.js");
/* GET home page. */
router.get("/", async function (req, res) {
  try {
    const result = await getAllMemorys();
    res.send(Message(1, "请求成功", result));
  } catch (e) {
    console.log(e);
    res.send(Message(-1, "获取失败"));
  }
});
/**
 * 获取回忆喜欢列表
 */
router.get("/like", async function (req, res) {
  const { memoryId } = req.query;
  try {
    const result = await getMemoryLike(memoryId);
    res.send(Message(1, "请求成功", result));
  } catch (e) {
    console.log(e);
    res.send(Message(-1, "获取失败"));
  }
});

/**
 * 喜欢memory
 */
router.get("/setMemoryLike", async function (req, res) {
  const { memoryId, userId } = req.query;
  try {
    const result = await setMemoryLike(memoryId, userId);
    res.send(Message(1, "设置成功", result));
  } catch (e) {
    console.log(e);
    res.send(Message(-1, "设置失败"));
  }
});

router.get("/removeMemoryLike", async function (req, res) {
  const { memoryId, userId } = req.query;
  try {
    const result = await removeMemoryLike(memoryId, userId);
    res.send(Message(1, "设置成功", result));
  } catch (e) {
    console.log(e);
    res.send(Message(-1, "设置失败"));
  }
});
module.exports = router;
