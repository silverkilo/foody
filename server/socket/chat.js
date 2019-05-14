const { User } = require("../db/models");
const cache = require("./appCache");

// const allChats = {
//   // roomId: [
//   //   [msg, id],
//   //   [msg, id]
//   // ]
// };

// const roomInfo = {
//   // user: {
//   //   matchId,
//   //   roomId,
//   //   socketId
//   // }
// };

// const venueList = {
//   //user1: [ resId ],
//   //user2: [ resId ]
// };

// let roomId = 0;

// function getChatHistory(roomId) {
//   console.log("getCHatHistory - roomId", roomId);
//   if (allChats[roomId] === undefined) {
//     allChats[roomId] = [];
//   }
//   return allChats[roomId];
// }

// function clearRecord(userId, roomId) {
//   delete allChats[roomId];
//   delete roomInfo[userId];
// }

// const checkMatchId = async (socket, userId) => {
//   //get matchId from database
//   const { id } = socket;
//   const userInfo = await User.findByPk(userId);
//   console.log("userInfo", userInfo);
//   const matchId = userInfo.hasMatched;
//   console.log("matchId", matchId);
//   // check if your match already has a room
//   if (roomInfo.hasOwnProperty(matchId)) {
//     roomInfo[userId] = {
//       matchId: matchId,
//       id: id,
//       roomId: roomInfo[matchId].roomId
//     };
//   } else {
//     roomInfo[userId] = {
//       matchId: matchId,
//       id: id,
//       roomId: String(roomId)
//     };
//     roomId++;
//   }
//   console.log("chatMatchId - roomInfo", roomInfo);
// };

// function addNewMessage(userId, msg) {
//   let roomName = roomInfo[userId].roomId;
//   if (allChats[roomName] === []) {
//     allChats[roomName] = [[msg, userId]];
//   } else {
//     allChats[roomName].push([msg, userId]);
//   }
//   console.log("addNewMessage - allchats", allChats);
// }

// function createVenueList(userId) {
//   venueList[userId] = [];
// }

// function checkVenueList(userId, restaurantId) {
//   const matchId = roomInfo[userId].matchId;
//   if (venueList[matchId].includes(restaurantId)) {
//     return true;
//   } else {
//     return false;
//   }
// }
//socket
module.exports = function(socket, userId) {
  //joining chatroom and sending back chat history
  socket.on("join-chatroom", async () => {
    try {
      // await checkMatchId(socket, userId);
      socket.join(cache.getRoom(userId));
      // console.log(chatHistory);
      socket.emit("send-chat-history", cache.getChatHistory(userId));
    } catch (e) {
      console.log(e);
      socket.emit("errorMessage", "There was an error joining chatroom");
    }
  });

  // CLIENT send message
  socket.on("send-client-message", msg => {
    try {
      cache.addMessage(msg, userId);
      socket.broadcast.to(cache.getRoom(userId)).emit("send-others-messege", {
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
      cache.clearRecord(userId);
    } catch (e) {
      console.log(e);
      socket.emit("errorMessage", "There was an error disconnecting chats.");
    }
  });

  socket.on("start-choosing-res", () => {
    try {
      cache.createVenueList(userId);
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
      cache.venueList[userId].push(restaurantId);
      if (cache.checkVenueList(userId, restaurantId)) {
        socket.to(cache.getRoom(userId)).emit("matched", restaurantId);
        console.log("resId in chat backend", restaurantId);
        console.log("venue list", cache.venueList);
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
