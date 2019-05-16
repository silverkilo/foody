const socketIO = require("socket.io");
const { User, Match } = require("../db/models");
const matchListeners = require("./match");
const chatListener = require("./chat");
const venueListener = require("./chat");
const cache = require("./appCache");

User.findAll().then(users => {
  for (let user of users) {
    Match.findAll({
      where: {
        matcherId: user.id
      }
    }).then(matches => {
      matches.forEach(({ matcheeId }) =>
        cache.addExclusion(user.id, matcheeId)
      );
    });
  }
});

module.exports = function socketio(server, sessionMiddleware) {
  const io = socketIO(server);
  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  io.on("connect", async socket => {
    let userId;
    if (
      socket.request &&
      socket.request.session &&
      socket.request.session.passport &&
      socket.request.session.passport.user
    ) {
      userId = socket.request.session.passport.user;
      await User.update(
        {
          socketId: socket.id
        },
        {
          where: {
            id: userId
          }
        }
      );
      cache.addExclusion(userId);
      socket.emit("ready", true);
    } else {
      return socket.emit("ready", false);
    }

    matchListeners(socket, userId);
    chatListener(socket, userId);

    socket.on("disconnect", async () => {
      console.log("disconnected", socket.id);
      await User.update(
        {
          socketId: null
        },
        {
          where: {
            id: userId
          }
        }
      );
    });
  });
};
