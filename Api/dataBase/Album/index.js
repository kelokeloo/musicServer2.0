const { MongoClient, ObjectId } = require("mongodb");
const { connectUri, dataBaseName } = require("../config");
const {
  findDocInCollectionById,
  UpdateDocInCollectionById,
  findAllDocInCollection,
  insertDocToCollection,
  findDocsInCollection,
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

/**
 * 查找歌单
 */
async function searchAlbum(keyword) {
  try {
    const filter = { name: new RegExp(keyword) };
    let albums = await findDocsInCollection(collectionName, filter);
    // 添加append属性
    albums = albums.map((album) => {
      album.append = { relation: 0, type: "album" };
      return album;
    });

    // 计算相关度
    albums = albums.map((album) => {
      const relation = keyword.length / album.name.length;
      album.append.relation = relation;
      return album;
    });
    // 对相关度进行排序
    albums.sort((a, b) => {
      return b.append.relation - a.append.relation;
    });
    return albums;
  } catch (e) {
    return Promise.reject(e);
  }
}

module.exports = {
  getAllAlbums,
  getAlbumById,
  searchAlbum,
};
