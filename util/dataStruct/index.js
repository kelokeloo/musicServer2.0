/**
 *
 * @param {number} code 0 表示成功 -1 表示失败
 * @param {string} msg
 * @param {Object} append
 * @returns {{code, msg}}
 */
function Message(code, msg, append) {
  return {
    code,
    msg,
    ...append,
  };
}
module.exports = {
  Message,
};
