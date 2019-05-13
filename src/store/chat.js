import { socket } from "./socket";
const SEND_HISTORY = "SEND_HISTORY";

const sendChatHistory = array => ({
  type: SEND_HISTORY,
  array
});

export const joinChatRoom = () => dispatch => {
  socket.emit("join-chatroom");
  console.log("client joined chat room");
  socket.on("send-chat-history", chatHistory => {
    dispatch(sendChatHistory(chatHistory));
  });
};

export const sendMessage = msg => dispatch => {
  socket.on("send-chat-history", chatHistory => {
    dispatch(sendChatHistory(chatHistory));
  });
  socket.emit("send-client-message", msg);
  console.log("client: sent it from client side");
};

export const chatListener = () => dispatch => {
  socket.on("send-chat-history", chatHistory => {
    console.log("client receiving from server side");
    dispatch(sendChatHistory(chatHistory));
  });
};

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case SEND_HISTORY:
      return [...state, action.array];
    default:
      return state;
  }
};
