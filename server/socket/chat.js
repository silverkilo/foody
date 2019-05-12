const { User } = require("../db/models");
//chat history
const allChats = {
  // roomId: [
  //   [msg, id],
  //   [msg, id]
  // ]
};

function getChatHistory(roomId) {
  if (allChats[roomId] === undefined) {
    allChats[roomId] = [];
  }
  return allChats[roomId];
}

function addNewMessage(userId, msg) {
  let roomName = roomInfo.userId.roomId;
  allChats[roomName].push([msg, userId]);
}

//info storage
let roomId = 0;

const roomInfo = {
  // user: {
  //   matchId,
  //   roomId,
  //   socketId
  // }
};

const checkMatchId = async (socket, userId) => {
  //get matchId from database
  const { id } = socket;
  const userInfo = await User.findOne({
    id: userId
  });
  const matchId = userInfo.hasMatched;

  //create record
  roomInfo.userId = {
    matchId,
    id
  };
  //check record
  if (roomInfo.hasOwnProperty(roomInfo.userId.matchId)) {
    roomId += 1;
    roomInfo.userId.roomId = roomId;
    roomInfo.matchId.roomId = roomId;
  }
};

//socket
module.exports = function(socket, userId) {
  //joining chatroom and sending back chat history
  socket.on("join-chatroom", () => {
    try {
      console.log("the client had joined chatroom");
      checkMatchId(socket, userId);
      socket.join(roomInfo.userId.roomId);
      const chatHistory = getChatHistory(roomInfo.userId.roomId);
      socket.emit("send-chat-history", chatHistory);
    } catch (e) {
      console.log(e);
      socket.emit("errorMessage", "There was an error joinging matches");
    }
  });

  // CLIENT send message
  socket.on("send-client-message", msg => {
    try {
      addNewMessage(userId, msg);
      console.log("server: got it from client side");
      socket.broadcast
        .to(roomInfo[userId][roomId])
        .emit("messege-from-server", msg);
      console.log("server: sent it from server side");
    } catch (e) {
      console.log(e);
      socket.emit("errorMessage", "There was an error joinging matches");
    }
  });
};
