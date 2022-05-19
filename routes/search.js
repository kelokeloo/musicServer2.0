var express = require("express");
var router = express.Router();
const { Message } = require("../util/dataStruct/index.js");
const { searchMusic } = require("../Api/dataBase/Music/index.js");
const { searchAlbum } = require("../Api/dataBase/Album/index.js");

/**智能搜索
 * 相关度计算
 * 1) 歌曲 keyword占name/singer名的比率， 取一个最大值
 * 2) 歌单 keyword占album name 的比率
 *
 * step1 根据关键词从歌曲和歌单中查找数据, 并计算出查找数据的相关度
 * step2 根据相关度进行排序
 * step3
 *    如果相关度第一是音乐
 *     1）展示该音乐
 *     2）展示该音乐歌手的热门音乐[三个以内]
 *     3）展示该音乐所在的专辑[三个以内]
 *     4）展示剩下查找出来的数据
 *    如果相关度第一是歌单
 *     1）突出显示该歌单
 *     2）展示剩下查找出来的数据
 */

router.get("/", async function (req, res) {
  const { keyword } = req.query;
  const musicResult = await searchMusic(keyword);
  const albumResult = await searchAlbum(keyword);
  const result = [...musicResult, ...albumResult];
  result.sort((a, b) => b.append.relation - a.append.relation);

  res.send(Message(0, "请求成功", result));
});

module.exports = router;
