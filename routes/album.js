var express = require("express");
var router = express.Router();
const { Message } = require("./../util/dataStruct/index.js");
const {
  getAllAlbums,
  getAlbumById,
} = require("./../Api/dataBase/Album/index.js");

/**
 * 获取所有Albums
 */
router.get("/", async function (req, res) {
  try {
    const albums = await getAllAlbums();
    res.send(
      Message(0, "请求成功", {
        albums,
      })
    );
  } catch (e) {
    console.log(e);
    res.send(Message(-1, "请求失败"));
  }
});
router.get("/:albumId", async function (req, res) {
  try {
    const { albumId } = req.params;
    const album = await getAlbumById(albumId);
    res.send(Message(0, "请求成功", album));
  } catch (e) {
    console.log(e);
    res.send(Message(-1), "请求失败");
  }
});

module.exports = router;
