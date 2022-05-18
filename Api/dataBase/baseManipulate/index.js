const { MongoClient, ObjectId } = require("mongodb");
const { connectUri, dataBaseName } = require("../config");

/**
 * @description 根据_id查找集合中的文档
 * @param {string} collectionName
 * @param {string} _id
 * @returns {Promise<doc>} doc
 */
function findDocInCollectionById(collectionName, _id) {
  const client = new MongoClient(connectUri);
  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();
      const collection = client.db(dataBaseName).collection(collectionName);

      const query = {
        _id: ObjectId(_id),
      };
      const result = await collection.findOne(query);
      if (result) {
        const _id = result._id.toHexString();
        result._id = _id;
      }
      resolve(result);
    } catch (e) {
      reject(e);
    } finally {
      await client.close();
    }
  });
}

/**
 * @description 向集合中插入一条数据，并返回插入id
 * @param {string} collectionName
 * @returns {Promise<string>} insertedId
 */
function insertDocToCollection(collectionName, document) {
  const client = new MongoClient(connectUri);
  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();
      const collection = client.db(dataBaseName).collection(collectionName);
      const result = await collection.insertOne(document);
      const insertedId = result.insertedId.toHexString();
      resolve(insertedId);
    } catch (e) {
      reject(e);
    } finally {
      client.close();
    }
  });
}

/**
 * @description 更新指定集合中的一个文档
 * @param {string} collectionName
 * @param {string} _id
 * @param {document} updateDoc new docment
 * @returns {Promise<string>} upsertedId
 */
function UpdateDocInCollectionById(collectionName, _id, newDoc) {
  const client = new MongoClient(connectUri);
  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();
      const collection = client.db(dataBaseName).collection(collectionName);

      const filter = {
        _id: ObjectId(_id),
      };
      const updateDoc = {
        $set: newDoc,
      };
      const result = await collection.updateOne(filter, updateDoc);
      resolve(result);
    } catch (e) {
      reject(e);
    } finally {
      client.close();
    }
  });
}

/**
 * @description 获取指定集合的所有文档
 * @param {string} collectionName
 */
function findAllDocInCollection(collectionName) {
  const client = new MongoClient(connectUri);
  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();
      const collection = client.db(dataBaseName).collection(collectionName);

      const cursor = await collection.find({});
      let docs = await cursor.toArray();
      if (docs.length > 0) {
        docs = docs.map((doc) => {
          const _id = doc._id.toHexString();
          doc._id = _id;
          return doc;
        });
      }
      resolve(docs);
    } catch (e) {
      reject(e);
    } finally {
      await client.close();
    }
  });
}

/**
 * @description 根据filter查询集合文档
 */

function findDocsInCollection(collectionName, filter) {
  const client = new MongoClient(connectUri);
  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();
      const collection = client.db(dataBaseName).collection(collectionName);

      let docs = await collection.find(filter).toArray();
      if (docs.length > 0) {
        docs = docs.map((doc) => {
          const _id = doc._id.toHexString();
          doc._id = _id;
          return doc;
        });
      }
      resolve(docs);
    } catch (e) {
      reject(e);
    } finally {
      await client.close();
    }
  });
}

module.exports = {
  findDocInCollectionById,
  insertDocToCollection,
  UpdateDocInCollectionById,
  findAllDocInCollection,
  findDocsInCollection,
};
