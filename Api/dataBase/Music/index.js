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

/**
 * 搜索音乐
 */
async function searchMusic(keyword) {
  try {
    const filterByName = { name: new RegExp(keyword) };
    const filterBySinger = {
      singer: { $elemMatch: { $in: [new RegExp(keyword)] } },
    };

    let musicsByName = await findDocsInCollection(collectionName, filterByName);
    let musicsBySinger = await findDocsInCollection(
      collectionName,
      filterBySinger
    );

    // 添加一个额外的属性append
    musicsByName = musicsByName.map((music) => {
      music.append = { relation: 0, type: "music" };
      return music;
    });
    musicsBySinger = musicsBySinger.map((music) => {
      music.append = { relation: 0, type: "music" };
      return music;
    });

    // 计算相关度
    musicsByName = musicsByName.map((music) => {
      const nameRelation = keyword.length / music.name.length;
      music.append.relation = nameRelation;
      return music;
    });
    musicsBySinger = musicsBySinger.map((music) => {
      let singerRelationMax = 0;
      music.singer.forEach((singer) => {
        const curSingerRelation = keyword.length / singer.length;
        if (curSingerRelation > singerRelationMax)
          singerRelationMax = curSingerRelation;
      });
      music.append.relation = singerRelationMax;
      return music;
    });

    // 音乐有可能重复，因此需要去重，去重时候需要保留相关度高的
    const musicMap = new Map();
    musicsByName.forEach((music) => {
      musicMap.set(music._id, music);
    });
    musicsBySinger.forEach((music) => {
      // 查看是否在map中了
      const { _id: musicId } = music;
      if (musicMap.has(musicId)) {
        // 对比那个相关度高，取高的
        const musicInMap = musicMap.get(musicId);
        if (musicInMap.append.relation < music.append.relation) {
          // 删除原来的添加新的
          musicMap.delete(musicId);
          musicMap.set(musicId, music);
        }
      } else {
        // 没有就添加进去
        musicMap.set(musicId, music);
      }
    });
    let musics = [...musicMap].map((entry) => entry[1]);

    // 对相关度进行排序
    musics.sort((a, b) => {
      return b.append.relation - a.append.relation;
    });

    return musics;
  } catch (e) {
    return Promise.reject(e);
  }
}

/**
 * 根据歌手获取音乐
 */
async function getMusicsBySinger(singer) {
  try {
    const musics = await Promise.all(
      singer.map((item) => {
        const filter = {
          singer: {
            $elemMatch: { $eq: item },
          },
        };
        return findDocsInCollection(collectionName, filter);
      })
    ).then((arr) => {
      let result = [];
      arr.forEach((musics) => {
        result = [...result, ...musics];
      });
      return result;
    });
    return musics;
  } catch (e) {
    console.log(e);
    return [];
  }
}

module.exports = {
  getMusicById,
  getAllMusics,
  insertMusicToCollection,
  addMusicCount,
  searchMusic,
  getMusicsBySinger,
};
