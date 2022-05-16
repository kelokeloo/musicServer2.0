var express = require("express");
var router = express.Router();
const { Message } = require("../util/dataStruct/index.js");
const config = require("../global.js");
const { getMusicById } = require("../Api/dataBase/Music");

/* GET home page. */
router.get("/recommend", async function (req, res) {
  const RecommendMusics = config.home.RecommendMusics;
  Promise.all(
    RecommendMusics.map((musicId) => {
      return getMusicById(musicId);
    })
  )
    .then((musics) => {
      res.send(Message(0, "success", musics));
    })
    .catch((e) => {
      console.error(e);
      res.send(Message(-1, "请求失败"));
    });
});

module.exports = router;
