import { socket } from "./socket";
const SEND_HISTORY = "SEND_HISTORY";
const ADD_NEW_MSG = "ADD_NEW_MSG";
const UNREAD_MSG = "UNREAD_MSG";
const CLEAR_UNREAD_MSG = "CLEAR_UNREAD_MSG";

const sendChatHistory = array => ({
  type: SEND_HISTORY,
  array
});

const addNewMessage = array => ({
  type: ADD_NEW_MSG,
  array
});

const plusUnreadMessage = num => ({
  type: UNREAD_MSG,
  num
});

const clearUnreadMessage = () => ({
  type: CLEAR_UNREAD_MSG,
  num: 0
});

export const joinChatRoom = () => dispatch => {
  socket.emit("join-chatroom");
  socket.on("send-chat-history", chatHistory => {
    dispatch(sendChatHistory(chatHistory));
  });
};

export const sendMessage = (msg, userId) => dispatch => {
  socket.emit("send-client-message", msg);
  dispatch(addNewMessage([msg, userId]));
};

export const chatListener = () => dispatch => {
  socket.on("send-others-message", data => {
    let { msg, userId } = data;
    dispatch(addNewMessage([msg, userId]));
    dispatch(plusUnreadMessage(1));
  });
};

export const clearUnread = () => dispatch => {
  dispatch(clearUnreadMessage());
};

export const disconnectChat = () => dispatch => {
  socket.emit("disconnect-chat");
};

export function chatHistory(state = [], action) {
  switch (action.type) {
    case SEND_HISTORY:
      return action.array;
    case ADD_NEW_MSG:
      return [...state, action.array];
    default:
      return state;
  }
}

export function unreadMsg(state = 0, action) {
  switch (action.type) {
    case UNREAD_MSG:
      return (state += action.num);
    case CLEAR_UNREAD_MSG:
      return action.num;
    default:
      return state;
  }
}
