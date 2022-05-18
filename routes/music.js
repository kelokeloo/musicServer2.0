var express = require("express");
var router = express.Router();
const { Message } = require("./../util/dataStruct/index.js");
const { addMusicCount } = require("./../Api/dataBase/Music/index.js");

/* GET home page. */
router.get("/addmusiccount", async function (req, res) {
  const { musicId } = req.query;
  try {
    const result = await addMusicCount(musicId);
    console.log(result);
    res.send(Message(0, "设置成功"));
  } catch (e) {
    console.log(e);
    res.send(Message(-1, "设置失败"));
  }
});

module.exports = router;
