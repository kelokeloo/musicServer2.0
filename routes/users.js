var express = require("express");
var router = express.Router();
const { Message } = require("./../util/dataStruct/index.js");
const {
  getUserLikeMusicList,
  addMusicToUserLikeList,
  removeMusicFromUserLikeList,
  getUserInfo,
  searchUser,
  getUserFocus,
  addFocus,
  cancelFocus,
} = require("./../Api/dataBase/User/index.js");

/**
 * 判断用户是否喜欢该音乐
 */

router.post("/musiclike", async function (req, res) {
  const { userId, musicId } = req.body;
  try {
    const list = await getUserLikeMusicList(userId);
    const index = list.findIndex((item) => item === musicId);
    res.send(
      Message(0, "请求成功", {
        like: index === -1 ? false : true,
      })
    );
  } catch (e) {
    console.log(e);
    res.send(Message(-1, "请求失败"));
  }
});

// 添加到喜欢列表
router.post("/addmusictolikes", async function (req, res) {
  const { userId, musicId } = req.body;
  try {
    const result = await addMusicToUserLikeList(userId, musicId);
    if (result) {
      res.send(Message(0, "设置成功"));
    } else {
      res.send(Message(-1, "设置失败"));
    }
  } catch (e) {
    console.log(e);
    res.send(Message(-1, "设置失败"));
  }
});

// 从喜欢列表中移除
router.post("/removemusictolikes", async function (req, res) {
  const { userId, musicId } = req.body;
  try {
    const result = await removeMusicFromUserLikeList(userId, musicId);
    if (result) {
      res.send(Message(0, "设置成功"));
    } else {
      res.send(Message(-1, "设置失败"));
    }
  } catch (e) {
    console.log(e);
    res.send(Message(-1, "设置失败"));
  }
});

router.get("/userinfo", async function (req, res) {
  const { userId } = req.query;
  try {
    const result = await getUserInfo(userId, 1);
    res.send(Message(1, "请求成功", result));
  } catch (e) {
    console.log(e);
    res.send(Message(-1, "获取失败"));
  }
});
router.get("/searchuser", async function (req, res) {
  const { value } = req.query;
  try {
    let result = await searchUser(value);
    result = result.map((user) => {
      delete user.password;
      return user;
    });
    res.send(Message(1, "请求成功", result));
  } catch (e) {
    console.log(e);
    res.send(Message(-1, "获取失败"));
  }
});
router.get("/focus", async function (req, res) {
  const { userId } = req.query;
  try {
    let result = await getUserFocus(userId);
    res.send(Message(1, "请求成功", result));
  } catch (e) {
    console.log(e);
    res.send(Message(-1, "获取失败"));
  }
});

router.get("/addfocus", async function (req, res) {
  const { userId, focusId } = req.query;
  console.log(userId, focusId);
  try {
    let result = await addFocus(userId, focusId);
    if (result) {
      res.send(Message(1, "设置成功"));
    } else {
      res.send(Message(-1, "设置失败"));
    }
  } catch (e) {
    console.log(e);
    res.send(Message(-1, "设置失败"));
  }
});
router.get("/cancelfocus", async function (req, res) {
  const { userId, focusId } = req.query;
  try {
    let result = await cancelFocus(userId, focusId);
    if (result) {
      res.send(Message(1, "设置成功"));
    } else {
      res.send(Message(-1, "设置失败"));
    }
  } catch (e) {
    console.log(e);
    res.send(Message(-1, "设置失败"));
  }
});

module.exports = router;
