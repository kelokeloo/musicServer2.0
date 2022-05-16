/**
 * 音乐加载脚本
 * 1. 需要在/music下按照格式添加音乐, 音乐格式为 歌曲名-歌手-作词-作曲-编曲.suffix
 * 2. 需要在/images/music添加上对应的音乐封面, 格式为 歌曲名.suffix；歌曲名必须匹配
 */

const fs = require("fs");
const path = require("path");
const sourceBaseUrl = "/music";
const imgBaseUrl = "/images/music";
const { insertMusicToCollection } = require("../Api/dataBase/Music");

function getFileNames(startPath) {
  let result = [];

  function finder(path) {
    let files = fs.readdirSync(path);

    files.forEach((val, index) => {
      result.push(val);
    });
  }

  finder(startPath);

  return result;
}

function parseMusicToDocs(musicNames, imgNames) {
  // 分离imgNames的后缀
  const regImgName = /^(.*)\.(.*)$/;
  imgNames = imgNames.map((imgName) => {
    return {
      name: regImgName.exec(imgName)[1],
      suffix: regImgName.exec(imgName)[2],
    };
  });

  const result = [];
  musicNames.forEach((filename) => {
    const reg = /^(.*)-(.*)-(.*)-(.*)-(.*)\.mp3$/; // 匹配音乐名的正则
    const regRes = reg.exec(filename);
    let [rawName, name, singer, lyrics, composer, arranger] = regRes;

    const musicIndex = imgNames.findIndex((item) => item.name === name);
    const music = {
      name, // 姓名
      singer: singer.split("_"), // 歌手
      lyrics: lyrics.split("_"), // 作词
      composer: lyrics.split("_"), // 作曲
      arranger: arranger === "null" ? [] : arranger.split("_"), // 编曲
      source: `${sourceBaseUrl}/${rawName}`,
      count: 0,
      img:
        musicIndex !== -1
          ? `${imgBaseUrl}/${name}.${imgNames[musicIndex].suffix}`
          : "",
    };

    if (regRes) result.push(music);
  });
  return result;
}

let musicNames = getFileNames("D:/desktop/thesis/2.0/musicServer/public/music");
let imgNames = getFileNames(
  "D:/desktop/thesis/2.0/musicServer/public/images/music"
);
let docs = parseMusicToDocs(musicNames, imgNames);

docs.forEach(async (doc) => {
  try {
    const ids = await insertMusicToCollection(doc);
  } catch (e) {
    console.log(e);
  }
});

console.log(docs.length);
