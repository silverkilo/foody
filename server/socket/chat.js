//chat history
const allChats = {
  // roomId: [
  //   [msg, id],
  //   [msg, id]
  // ]
};

function getChatHistory (roomId) {
  if (allChats[roomId] === undefined) {
    allChats[roomId] = [];
  }
  return allChats[roomId];
}

function addNewMessage(userId, msg){
  let roomName = roomInfo.userId.roomId
  allChats.roomName.push([msg, userId])
}


//info storage
let matchId
let roomId = 0;
let socketId

const roomInfo = {
  // user: {
  //   matchId,
  //   roomId,
  //   socketId
  // }
};

const checkMatchId = async (socket, userId) => {
  //get matchId from database
  const { id } = socket
  const userInfo = await User.findOne({
    id: userId
  })
  const matchId = userInfo.hasMatched

  //create record
  roomInfo.userId = {
    matchId,
    id
  }
  //check record
  if(roomInfo.hasOwnProperty(roomInfo.userId.matchId)){
    roomId += 1
    roomInfo.userId.roomId = roomId
    roomInfo.matchId.roomId = roomId
  }
}

//socket
module.exports = function(socket, userId) {
  //joining chatroom and sending back chat history
  socket.on("join-chatroom", () => {
    checkMatchId(socket, userId)
    socket.join(roomInfo.userId.roomId)
    const chatHistory = getChatHistory(roomName);
    socket.emit('send-chat-history', chatHistory);
  },

  // CLIENT send message
  socket.on('send-client-message', (msg) => {
    addNewMessage(userId, msg)
    socket.broadcast.to(roomInfo.userId.roomId).emit('messege-from-server', msg)
  })


  // CLIENT receive message

  //recieves whether or not the user swiped right or left (value: boolean), the matchee id (matchee: number)
  // and whether a match happened and the CLIENT already knew about it
  // EMITS whether there was a match, and if there was and both users are connected, emits the corresponding matcher/matchee to the client
  socket.on("swipe", async ({ value, matchee, matched }) => {
    try {
      exclusions[userId].push(matchee);
      if (value) {
        matched =
          matched ||
          !!(await Match.findOne({
            where: {
              matcheeId: userId,
              matcherId: matchee
            }
          }));
        if (matched) {
          await Promise.all([
            User.update(
              {
                hasMatched: matchee
              },
              {
                where: {
                  id: userId
                }
              }
            ),
            User.update(
              {
                hasMatched: userId
              },
              {
                where: {
                  id: matchee
                }
              }
            )
          ]).catch(e => console.log(e));
          const matcherInfo = await User.findByPk(userId, {
            attributes: [
              "id",
              "firstName",
              "lastName",
              "location",
              "hasMatched",
              "socketId"
            ],
            include: [
              {
                model: Preference,
                attributes: ["id", "category"]
              }
            ]
          });
          const matcheeInfo = await User.findByPk(matchee, {
            attributes: [
              "id",
              "firstName",
              "lastName",
              "location",
              "hasMatched",
              "socketId"
            ],
            include: [
              {
                model: Preference,
                where: {
                  id: {
                    [Op.in]: matcherInfo.preferences.map(({ id }) => id)
                  }
                },
                attributes: ["id", "category"]
              }
            ]
          });
          if (matcherInfo.socketId && matcheeInfo.socketId) {
            socket.emit("didMatch", { matched, matcheeInfo });
            return socket
              .to(matcheeInfo.socketId)
              .emit("didMatch", { matched, matcherInfo });
          } else {
            return socket.emit("didMatch", { matched: false });
          }
        } else {
          await Match.create({
            matcherId: userId,
            matcheeId: matchee
          });
        }
      } else {
        matched = false;
      }
      return socket.emit("didMatch", { matched });
    } catch (error) {
      console.log(error);
      socket.emit("errorMessage", "There was an error processing the swipe");
    }
  });
};
