var express = require("express");
var router = express.Router();
const { Message } = require("./../util/dataStruct/index.js");
const {
  addMusicCount,
  getMusicById,
  getMusicsBySinger,
} = require("./../Api/dataBase/Music/index.js");

router.get("/addmusiccount", async function (req, res) {
  const { musicId } = req.query;
  try {
    const result = await addMusicCount(musicId);
    res.send(Message(0, "设置成功"));
  } catch (e) {
    console.log(e);
    res.send(Message(-1, "设置失败"));
  }
});

/**
 * getMusicById
 */
router.get("/id", async function (req, res) {
  const { musicId } = req.query;
  try {
    const result = await getMusicById(musicId);
    res.send(
      Message(0, "获取成功", {
        musicInfo: result,
      })
    );
  } catch (e) {
    console.log(e);
    res.send(Message(-1, "获取失败"));
  }
});

/**
 * getMusicBySinger
 */
router.get("/singer", async function (req, res) {
  const { singer } = req.query;
  try {
    const musics = await getMusicsBySinger(singer);
    res.send(Message(0, "获取成功", musics));
  } catch (e) {
    console.log(e);
    res.send(Message(-1, "获取失败"));
  }
});

module.exports = router;
