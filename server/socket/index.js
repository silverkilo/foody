const socketIO = require("socket.io");
const db = require("../db");
const { Op } = require("sequelize");
const { Preference, User, Match } = require("../db/models");
const matchListeners = require("./match");
const chatListener = require("./chat");
const exclusions = {};

User.findAll().then(users => {
  for (let user of users) {
    Match.findAll({
      where: {
        matcherId: user.id
      }
    }).then(matches => {
      exclusions[user.id] = [user.id].concat(
        matches.map(({ matcheeId }) => matcheeId)
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
      exclusions[userId] = exclusions[userId] || [userId];
      socket.emit("ready");
    } else return;

    //removes socketIds from disconnected users

    matchListeners(socket, userId, exclusions);
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
