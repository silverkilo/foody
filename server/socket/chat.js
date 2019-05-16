const cache = require("./appCache");

module.exports = function(socket, userId) {
  //joining chatroom and sending back chat history
  socket.on("join-chatroom", async () => {
    try {
      // await checkMatchId(socket, userId);
      socket.join(cache.getRoom(userId));
      // console.log(chatHistory);
      socket.emit("send-chat-history", cache.getChatHistory(userId));
    } catch (e) {
      socket.emit("errorMessage", "There was an error joining chatroom");
    }
  });

  // CLIENT send message
  socket.on("send-client-message", msg => {
    try {
      cache.addMessage(msg, userId);
      // console.log(cache.getChatHistory(userId));
      socket.broadcast.to(cache.getRoom(userId)).emit("send-others-message", {
        msg,
        userId
      });
    } catch (e) {
      socket.emit(
        "errorMessage",
        "There was an error getting-sending client messages."
      );
    }
  });

  socket.on("disconnect-chat", () => {
    try {
      cache.clearRecord(userId);
      socket.off("disconnect-chat");
      socket.off("start-choosing-res");
      socket.off("setUserLocation");
      socket.off("getMatchLocation");
      socket.off("send-client-message");
      socket.off("join-chatroom");
    } catch (e) {
      socket.emit("errorMessage", "There was an error disconnecting chats.");
    }
  });

  socket.on("start-choosing-res", () => {
    try {
      cache.createVenueList(userId);
    } catch (e) {
      socket.emit(
        "errorMessage",
        "There was an error creating empty venue list."
      );
    }
  });

  socket.on("send-client-res", restaurantId => {
    try {
      cache.addVenue(userId, restaurantId);
      if (cache.checkVenueList(userId, restaurantId)) {
        socket.to(cache.getRoom(userId)).emit("matched", restaurantId);
        socket.emit("matched", restaurantId);
      }
    } catch (e) {
      socket.emit(
        "errorMessage",
        "There was an error sending client res choice."
      );
    }
  });
  socket.on("setUserLocation", location => {
    try {
      socket.broadcast
        .to(cache.getRoom(userId))
        .emit("matchLocation", cache.setUserLocation(userId, location));
    } catch (e) {
      console.log(e);
      socket.emit("errorMessage", "There was an error setting location");
    }
  });
  socket.on("getMatchLocation", location => {
    try {
      socket.emit("matchLocation", cache.getMatchLocation(userId));
    } catch (e) {
      console.log(e);
      socket.emit("errorMessage", "There was an error getting match location");
    }
  });
};
