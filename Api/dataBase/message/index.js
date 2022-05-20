const {
  findAllDocInCollection,
  insertDocToCollection,
  findDocsInCollection,
  UpdateDocInCollectionById,
} = require("../baseManipulate/index");
const collectionName = "message";
/**
 * 拿到所有信息
 */
async function getAllMessages() {
  try {
    const messages = await findAllDocInCollection(collectionName);
    return messages;
  } catch (e) {
    return Promise.reject(e);
  }
}

/**
 * 保存消息
 */
async function saveOneMessage(message) {
  try {
    const result = await insertDocToCollection(collectionName, message);
    return result;
  } catch (e) {
    return null;
  }
}

/**
 * 标记消息已读
 */
async function readMessage(from, to) {
  try {
    const filter = {
      from,
      to,
    };
    const messages = await findDocsInCollection(collectionName, filter);
    return Promise.all(
      messages.map((message) => {
        const { _id } = message;
        message.read = true;
        delete message._id;
        return UpdateDocInCollectionById(collectionName, _id, message);
      })
    );
  } catch (e) {
    console.log(e);
    return null;
  }
}

module.exports = {
  getAllMessages,
  saveOneMessage,
  readMessage,
};
