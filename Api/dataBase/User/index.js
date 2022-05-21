const { MongoClient, ObjectId } = require("mongodb");
const { connectUri, dataBaseName } = require("../config");
const {
  findDocInCollectionById,
  UpdateDocInCollectionById,
  findAllDocInCollection,
  insertDocToCollection,
  findDocsInCollection,
} = require("../baseManipulate/index");

const collectionName = "user";

/**
 * 获取用户信息, 返回用户信息的Promise
 * @param {number} flag 默认0不移除密码， 1为移除密码
 */
async function getUserInfo(userId, flag = 0) {
  try {
    let userInfo = await findDocInCollectionById(collectionName, userId);
    if (flag === 1) {
      delete userInfo.password;
    }
    return userInfo;
  } catch (e) {
    return Promise.reject(e);
  }
}

/**
 * 更新用户信息, 返回更新文档Id的Promise
 */
async function updateUserInfo(userId, document) {
  try {
    const result = await UpdateDocInCollectionById(
      collectionName,
      userId,
      document
    );
    return userId;
  } catch (e) {
    return Promise.reject(e);
  }
}

/**
 * 获取所有用户信息, 返回所有docs的Promise
 */
async function getAllUserInfo() {
  try {
    const docs = await findAllDocInCollection(collectionName);
    return docs;
  } catch (e) {
    return Promise.reject(e);
  }
}

/**
 * 插入一个用户，返回插入用户id的Promise
 */
async function insertOneUser(document) {
  try {
    const insertedId = await insertDocToCollection(collectionName, document);
    return insertedId;
  } catch (e) {
    return Promise.reject(e);
  }
}

/**
 * 添加音乐到用户喜欢的音乐列表, 成功返回true
 */
async function addMusicToUserLikeList(userId, musicId) {
  try {
    const userInfo = await getUserInfo(userId);
    const { likeMusics } = userInfo;
    const index = likeMusics.findIndex((id) => id === musicId);
    if (index === -1) {
      // 不在喜欢列表就添加
      likeMusics.push(musicId);
    }
    userInfo.likeMusics = likeMusics;
    delete userInfo._id;
    await updateUserInfo(userId, userInfo);
    return true;
  } catch (e) {
    return Promise.reject(e);
  }
}

/**
 * 将音乐从用户的音乐喜欢列表移除, 成功返回true
 */
async function removeMusicFromUserLikeList(userId, musicId) {
  try {
    const userInfo = await getUserInfo(userId);
    const { likeMusics } = userInfo;
    const index = likeMusics.findIndex((id) => id === musicId);
    if (index !== -1) {
      // 在喜欢列表就移除
      likeMusics.splice(index, 1);
    }
    userInfo.likeMusics = likeMusics;
    delete userInfo._id;
    await updateUserInfo(userId, userInfo);
    return true;
  } catch (e) {
    return Promise.reject(e);
  }
}

/**
 * 获取用户喜欢的音乐列表
 */
async function getUserLikeMusicList(userId) {
  try {
    const userInfo = await getUserInfo(userId);
    return userInfo.likeMusics;
  } catch (e) {
    return Promise.reject(e);
  }
}

/**
 * 获取根据用户账号获取用户ID, 没有则返回null
 */
async function getUserIdByAccount(account) {
  const client = new MongoClient(connectUri);
  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();
      const collection = client.db(dataBaseName).collection(collectionName);

      const query = {
        account,
      };
      const result = await collection.findOne(query);
      if (!result) {
        resolve(null);
      }
      const userId = result._id.toHexString();
      resolve(userId);
    } catch (e) {
      reject(e);
    } finally {
      await client.close();
    }
  });
}

/**
 * 根据用户nickName和account查找用户
 */
async function searchUser(value) {
  console.log(value);
  const filter = {
    $or: [{ nickName: new RegExp(value) }, { account: new RegExp(value) }],
  };
  console.log(filter);
  try {
    const users = await findDocsInCollection(collectionName, filter);
    return users;
  } catch (e) {
    console.log(e);
    return [];
  }
}

module.exports = {
  getUserInfo,
  updateUserInfo,
  getAllUserInfo,
  insertOneUser,
  addMusicToUserLikeList,
  removeMusicFromUserLikeList,
  getUserLikeMusicList,
  getUserIdByAccount,
  searchUser,
};
