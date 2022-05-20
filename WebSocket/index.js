const WebSocket = require("ws");
const { webSocketPort } = require("../global.js");
const wsServer = new WebSocket.Server({ port: webSocketPort });
const { saveOneMessage } = require("../Api/dataBase/message/index");

/**
 *
 * @param {"connect"|"message"} type
 * @param {*} data
 * @returns
 */
function socketFrame(type, data) {
  return {
    type,
    data,
  };
}
const onLineUser = [];
// 连接结构
/**
 *
 * @param {"string"} userId
 * @param {connect} connect
 */
function connectFrame(userId, connect) {
  return {
    userId,
    connect,
  };
}

function connectIsOk(connect) {
  return connect.readyState === 1 ? true : false;
}

function clear() {
  const length = onLineUser.length;
  for (let i = length - 1; i >= 0; i--) {
    const connect = onLineUser[i].connect;
    if (!connectIsOk(connect)) {
      connect.send(
        JSON.stringify({
          msg: "连接正常吗？",
        })
      );
      onLineUser.splice(i, 1);
    }
  }
}
onLineUser.clear = clear;

// 监听连接
wsServer.on("connection", (connect) => {
  ManageConnect(connect);
});

function ManageConnect(connect) {
  // 监听连接发来的消息
  connect.on("message", (message) => messageProcessor(message, connect));
  connect.on("close", () => {
    console.log("连接被关闭");
  });
}

function transmit(data) {
  const { to } = data;
  const index = onLineUser.findIndex((item) => item.userId === to);
  if (index === -1) return;
  const connect = onLineUser[index].connect;
  connect.send(JSON.stringify(socketFrame("message", data)));
}
async function saveToDatabase(data) {
  try {
    const result = await saveOneMessage(data);
  } catch (e) {
    console.log("保存数据失败", e);
  }
}

function messageProcessor(message, connect) {
  // 先清理无效连接
  onLineUser.clear();
  const { type, data } = JSON.parse(message);
  let userId = null;
  switch (type) {
    case "connect":
      userId = data;
      handlerConnect(connect, userId);
      break;
    case "message":
      // 转发消息
      transmit(data);
      // 保存到数据库中
      saveToDatabase(data);
      break;

    default:
      break;
  }
}

// 处理连接
function handlerConnect(connect, userId) {
  // 判断该用户是否已经有连接，如果有需要覆盖掉
  const index = onLineUser.findIndex((item) => item.userId === userId);
  if (index >= 0) {
    onLineUser[index].connect = connect;
    return;
  }
  // 没有存在连接的情况
  onLineUser.push(connectFrame(userId, connect));
  console.log("[onLineUser]", onLineUser);
}
