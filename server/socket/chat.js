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
  console.log("allChats for this room", allChats[roomName]);
  if (allChats[roomName] === []) {
    allChats[roomName] = [[msg, userId]];
    console.log("in here...");
  } else {
    allChats[roomName].push([msg, userId]);
    console.log(allChats[roomName]);
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
  socket.on("join-chatroom", async () => {
    try {
      console.log("server side - the client has joined chatroom");
      await checkMatchId(socket, userId);
      socket.join(roomInfo.userId.roomId);
      const chatHistory = getChatHistory(String(roomInfo.userId.roomId));
      console.log("this is your chat history.......", chatHistory);
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
      console.log("about to broadcast...");
      const chatHistory = getChatHistory(String(roomInfo.userId.roomId));
      socket.broadcast
        .to(roomInfo.userId.roomId)
        .emit("send-chat-history", chatHistory);
      // .emit("message-from-server", msg);
    } catch (e) {
      console.log(e);
      socket.emit("errorMessage", "There was an error joining matches");
    }
  });
};
