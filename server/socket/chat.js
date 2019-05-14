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

const venueList = {
  //user1: [ resId ],
  //user2: [ resId ]
};

let roomId = 0;

function getChatHistory(roomId) {
  console.log("getCHatHistory - roomId", roomId);
  if (allChats[roomId] === undefined) {
    allChats[roomId] = [];
  }
  return allChats[roomId];
}

function clearRecord(userId, roomId) {
  delete allChats[roomId];
  delete roomInfo[userId];
}

const checkMatchId = async (socket, userId) => {
  //get matchId from database
  const { id } = socket;
  const userInfo = await User.findByPk(userId);
  console.log("userInfo", userInfo);
  const matchId = userInfo.hasMatched;
  console.log("matchId", matchId);
  // check if your match already has a room
  if (roomInfo.hasOwnProperty(matchId)) {
    roomInfo[userId] = {
      matchId: matchId,
      id: id,
      roomId: roomInfo[matchId].roomId
    };
  } else {
    roomInfo[userId] = {
      matchId: matchId,
      id: id,
      roomId: String(roomId)
    };
    roomId++;
  }
  console.log("chatMatchId - roomInfo", roomInfo);
};

function addNewMessage(userId, msg) {
  let roomName = roomInfo[userId].roomId;
  if (allChats[roomName] === []) {
    allChats[roomName] = [[msg, userId]];
  } else {
    allChats[roomName].push([msg, userId]);
  }
  console.log("addNewMessage - allchats", allChats);
}

function createVenueList(userId) {
  venueList[userId] = [];
}

function checkVenueList(userId, restaurantId) {
  const matchId = roomInfo[userId].matchId;
  console.log(matchId);
  if (venueList[matchId].includes(restaurantId)) {
    return true;
  } else {
    return false;
  }
}
//socket
module.exports = function(socket, userId) {
  //joining chatroom and sending back chat history
  socket.on("join-chatroom", async () => {
    try {
      console.log(userId, "joined chat room on he backend");
      await checkMatchId(socket, userId);
      socket.join(roomInfo[userId].roomId);
      const chatHistory = getChatHistory(String(roomInfo[userId].roomId));
      socket.emit("send-chat-history", chatHistory);
    } catch (e) {
      console.log(e);
      socket.emit("errorMessage", "There was an error joining chatroom");
    }
  });

  // CLIENT send message
  socket.on("send-client-message", msg => {
    try {
      addNewMessage(userId, msg);
      socket.broadcast.to(roomInfo[userId].roomId).emit("send-others-messege", {
        msg,
        userId
      });
    } catch (e) {
      console.log(e);
      socket.emit(
        "errorMessage",
        "There was an error getting-sending client messages."
      );
    }
  });

  socket.on("disconnect-chat", () => {
    try {
      let roomId = roomInfo[userId].roomId;
      clearRecord(userId, roomId);
    } catch (e) {
      console.log(e);
      socket.emit("errorMessage", "There was an error disconnecting chats.");
    }
  });

  socket.on("start-choosing-res", userId => {
    try {
      createVenueList(userId);
    } catch (e) {
      console.log(e);
      socket.emit(
        "errorMessage",
        "There was an error creating empty venue list."
      );
    }
  });

  socket.on("send-client-res", restaurantId => {
    try {
      venueList[userId].push(restaurantId);
      console.log("venue list", venueList);
      if (checkVenueList(userId, restaurantId)) {
        socket.emit("matched", restaurantId);
      }
    } catch (e) {
      console.log(e);
      socket.emit(
        "errorMessage",
        "There was an error sending client res choice."
      );
    }
  });
};
