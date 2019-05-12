import { socket } from "./socket";
const SEND_HISTORY = "SEND_HISTORY";
const RECEIVE_CHAT = "RECEIVE_CHAT";

const sendChatHistory = array => ({
  type: SEND_HISTORY,
  array
});

const receiveChat = msg => ({
  type: RECEIVE_CHAT,
  msg
});

export const joinChatRoom = () => dispatch => {
  socket.emit("join-chatroom");
  console.log("client joined chat room");
  socket.on("send-chat-history", chatHistory => {
    dispatch(sendChatHistory(chatHistory));
  });
};

export const sendMessage = msg => dispatch => {
  socket.emit("send-client-message", msg);
  console.log("client: sent it from client side");
};

export const chatListener = () => dispatch => {
  socket.on("message-from-server", msg => {
    console.log("client: got it from server side");
    dispatch(receiveChat(msg));
  });
};

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case SEND_HISTORY:
      return {
        ...state,
        chatHistory: action.array
      };
    case RECEIVE_CHAT:
      let newChatHistory = [...state.chatHistory, receiveChat.msg];
      return {
        ...state,
        chatHistory: newChatHistory
      };
    default:
      return state;
  }
};
