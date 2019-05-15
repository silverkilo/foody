import { socket } from "./socket";
const SEND_HISTORY = "SEND_HISTORY";
const ADD_NEW_MSG = "ADD_NEW_MSG";

const sendChatHistory = array => ({
  type: SEND_HISTORY,
  array
});

const addNewMessage = array => ({
  type: ADD_NEW_MSG,
  array
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
  });
};

export const disconnectChat = () => dispatch => {
  socket.emit("disconnect-chat");
};

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case SEND_HISTORY:
      return action.array;
    case ADD_NEW_MSG:
      return [...state, action.array];
    default:
      return state;
  }
};
