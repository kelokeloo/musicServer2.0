const { MongoClient, ObjectId } = require("mongodb");
const { connectUri, dataBaseName } = require("../config");
const {
  findDocInCollectionById,
  UpdateDocInCollectionById,
  findAllDocInCollection,
  insertDocToCollection,
} = require("../baseManipulate/index");

const collectionName = "album";

/**
 * 获取所有歌单
 */
async function getAllAlbums() {
  try {
    let albums = await findAllDocInCollection(collectionName);
    return albums;
  } catch (e) {
    return Promise.reject(e);
  }
}

async function getAlbumById(albumId) {
  try {
    let album = await findDocInCollectionById(collectionName, albumId);
    return album;
  } catch (e) {
    return Promise.reject(e);
  }
}

module.exports = {
  getAllAlbums,
  getAlbumById,
};
