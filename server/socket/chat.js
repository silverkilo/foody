const { User } = require("../db/models");

const allChats = {
  // roomId: [
  //   [msg, id],
  //   [msg, id]
  // ]
};

const roomInfo = {
  // user: {
  //   matchId,
  //   roomId,
  //   socketId
  // }
};

//info storage
let roomId = 0;

function getChatHistory(roomId) {
  if (allChats[roomId] === undefined) {
    allChats[roomId] = [];
  }
  return allChats[roomId];
}

function addNewMessage(userId, msg) {
  let roomName = roomInfo.userId.roomId;
  console.log("room name", roomName);
  if ((allChats[roomName] = [])) {
    allChats[roomName].push([msg, userId]);
  } else {
    console.log(allChats[roomName]);
    allChats[roomName] = [[msg, userId]];
  }
  console.log("allChats", allChats);
}

const checkMatchId = async (socket, userId) => {
  //get matchId from database
  const { id } = socket;
  const userInfo = await User.findOne({
    id: userId
  });
  const matchId = userInfo.hasMatched;
  console.log("matchId", matchId);

  //create record
  roomInfo.userId = {
    matchId,
    id,
    roomId: String(roomId)
  };

  console.log(roomInfo);
  console.log(roomId);
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
      console.log("server side - the client has joined chatroom");
      checkMatchId(socket, userId);
      socket.join(roomInfo.userId.roomId);
      const chatHistory = getChatHistory(String(roomInfo.userId.roomId));
      socket.emit("send-chat-history", chatHistory);
    } catch (e) {
      console.log(e);
      socket.emit("errorMessage", "There was an error joining matches");
    }
  });

  // CLIENT send message
  socket.on("send-client-message", msg => {
    console.log("server: got it from client side", msg, userId);
    try {
      console.log("server: sent it from server side");
      addNewMessage(userId, msg);
      socket.broadcast
        .to(roomInfo[userId][roomId])
        .emit("messege-from-server", msg);
    } catch (e) {
      console.log(e);
      socket.emit("errorMessage", "There was an error joining matches");
    }
  });
};
