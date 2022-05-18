const {
  findDocInCollectionById,
  UpdateDocInCollectionById,
  findAllDocInCollection,
  insertDocToCollection,
  findDocsInCollection,
} = require("../baseManipulate/index");

const collectionName = "music";

/**
 * 获取音乐信息, 返回音乐信息的Promise
 */
async function getMusicById(musicId) {
  try {
    const musicInfo = await findDocInCollectionById(collectionName, musicId);
    return musicInfo;
  } catch (e) {
    return Promise.reject(e);
  }
}

/**
 * 获取所有音乐, 返回一个数组, 数组元素为音乐信息
 */
async function getAllMusics() {
  try {
    const musics = await findAllDocInCollection(collectionName);
    return musics;
  } catch (e) {
    return Promise.reject(e);
  }
}

/**
 * 添加音乐, 返回添加音乐的id
 */
async function insertMusicToCollection(doc) {
  try {
    // 重复判断 如果重复就不插入
    const filter = {
      name: doc.name,
    };
    const docs = await findDocsInCollection(collectionName, filter);
    if (docs.length > 0) {
      const music = docs[0];
      return music._id;
    }
    const musicId = await insertDocToCollection(collectionName, doc);
    return musicId;
  } catch (e) {
    return Promise.reject(e);
  }
}

/**
 * 更新音乐，返回更新音乐的Id
 */
async function updateMusicInfo(musicId, document) {
  try {
    const result = await UpdateDocInCollectionById(
      collectionName,
      musicId,
      document
    );
    return result;
  } catch (e) {
    return Promise.reject(e);
  }
}

/**
 * 添加音乐的播放次数
 */
async function addMusicCount(musicId) {
  try {
    const musicInfo = await getMusicById(musicId);
    const count =
      musicInfo.count && musicInfo.count !== 0 ? musicInfo.count : 0;
    musicInfo.count = count + 1;
    delete musicInfo._id;
    const res = await updateMusicInfo(musicId, musicInfo);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

module.exports = {
  getMusicById,
  getAllMusics,
  insertMusicToCollection,
  addMusicCount,
};
