const { MongoClient, ObjectId } = require("mongodb");
const { connectUri, dataBaseName } = require("../config");
const {
  findDocInCollectionById,
  UpdateDocInCollectionById,
  findAllDocInCollection,
  insertDocToCollection,
  findDocsInCollection,
} = require("../baseManipulate/index");

const collectionName = "memory";

async function getAllMemorys() {
  try {
    const memorys = findAllDocInCollection(collectionName);
    return memorys;
  } catch (e) {}
}

/**
 * 获取喜欢列表
 */
async function getMemoryLike(memoryId) {
  try {
    const memory = await findDocInCollectionById(collectionName, memoryId);
    return memory.like;
  } catch (e) {
    return Promise.reject(e);
  }
}

/**
 * 获取memory
 */
async function getMemory(memoryId) {
  try {
    const memory = await findDocInCollectionById(collectionName, memoryId);
    return memory;
  } catch (e) {
    return Promise.reject(e);
  }
}

async function updateMemory(memoryId, docment) {
  try {
    const id = await UpdateDocInCollectionById(
      collectionName,
      memoryId,
      docment
    );
    return id;
  } catch (e) {
    return Promise.reject(e);
  }
}

/**
 * 设置喜欢
 */
async function setMemoryLike(memoryId, userId) {
  try {
    const memory = await getMemory(memoryId);
    let { like } = memory;
    if (like.includes(userId)) {
      return true;
    } else {
      like.push(userId);
      memory.like = like;
      delete memory._id;
      await updateMemory(memoryId, memory);
      return true;
    }
    return true;
  } catch (e) {
    return Promise.reject(e);
  }
}

/**
 * 取消喜欢
 */
async function removeMemoryLike(memoryId, userId) {
  try {
    const memory = await getMemory(memoryId);
    let { like } = memory;
    if (like.includes(userId)) {
      const index = like.findIndex((id) => id === userId);
      like.splice(index, 1);
      memory.like = like;
      delete memory._id;
      await updateMemory(memoryId, memory);
      return true;
    } else {
      return true;
    }
  } catch (e) {
    return Promise.reject(e);
  }
}

module.exports = {
  getAllMemorys,
  getMemoryLike,
  setMemoryLike,
  removeMemoryLike,
};
