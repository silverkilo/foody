class AppCache {
  constructor() {
    this.roomId = 0;
    this.roomInfo = {};
    this.allChats = {};
    this.venueList = {};
  }
  createRoom(user1, user2) {
    const { roomId } = this;
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
    return this.roomInfo[userId].roomId;
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
  clearRecord(userId) {
    if (this.roomInfo[userId]) {
      const { roomId, matchId } = this.roomInfo[userId];

      delete this.allChats[roomId];
      delete this.roomInfo[userId];
      delete this.roomInfo[matchId];
    }
  }
}

module.exports = new AppCache();
