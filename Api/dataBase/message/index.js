const {
  findAllDocInCollection,
  insertDocToCollection,
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

module.exports = {
  getAllMessages,
  saveOneMessage,
};
