const { Match, User } = require("../db/models");
const { Op } = require("sequelize");

class AppCache {
  constructor() {
    this.roomId = 0;
    this.roomInfo = {
      // userId: {
      //   matchId,
      //   roomId,
      //   socketId
      // }
    };
    this.allChats = {
      // roomId: [
      //   [msg, id]
      // ]
    };
    this.venueList = {
      // user: ""
    };
    this.exclusions = {};
  }
  addExclusion(userId, exclusion) {
    if (!this.exclusions[userId]) {
      this.exclusions[userId] = [userId];
    }
    if (exclusion) {
      this.exclusions[userId].push(exclusion);
    }
  }
  getExclusions(userId) {
    return this.exclusions[userId];
  }
  createRoom(user1, user2) {
    const roomId = String(this.roomId);
    if (!this.roomInfo[user1] || !this.roomInfo[user2]) {
      this.roomInfo[user1] = {
        matchId: user2,
        roomId
      };
      this.roomInfo[user2] = {
        matchId: user1,
        roomId
      };
      this.allChats[roomId] = [];
      this.roomId++;
    }
  }
  getRoom(userId) {
    return String(this.roomInfo[userId].roomId);
  }
  createVenueList(userId) {
    this.venueList[userId] = [];
  }
  getChatHistory(userId) {
    const { roomId } = this.roomInfo[userId];
    return this.allChats[roomId];
  }
  addMessage(msg, userId) {
    const { roomId } = this.roomInfo[userId];
    this.allChats[roomId].push([msg, userId]);
  }
  checkVenueList(userId, restaurantId) {
    const matchId = this.roomInfo[userId].matchId;
    return this.venueList[matchId].includes(restaurantId);
  }

  async clearRecord(userId) {
    if (this.roomInfo[userId]) {
      const { roomId, matchId } = this.roomInfo[userId];

      delete this.allChats[roomId];
      delete this.roomInfo[userId];
      delete this.roomInfo[matchId];
      delete this.venueList[userId];
      delete this.venueList[matchId];
      await Promise.all([
        Match.destroy({
          where: {
            matcheeId: userId
          }
        }),
        Match.destroy({
          where: {
            matcherId: userId
          }
        }),
        User.update(
          {
            hasMatched: null
          },
          { where: { id: userId } }
        )
      ]);
    }
  }
}

module.exports = new AppCache();
