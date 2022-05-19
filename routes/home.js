var express = require("express");
var router = express.Router();
const { Message } = require("../util/dataStruct/index.js");
const config = require("../global.js");
const { getMusicById, getAllMusics } = require("../Api/dataBase/Music");

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

router.get("/range", async function (req, res) {
  try {
    const musics = await getAllMusics();
    musics.sort((a, b) => {
      return b.count - a.count;
    });
    const Top5Musics = musics.slice(0, 5);
    res.send(Message(0, "请求成功", Top5Musics));
  } catch (e) {
    console.log(e);
    res.send(Message(-1, "请求失败"));
  }
});

module.exports = router;
