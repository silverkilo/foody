import io from "socket.io-client";
export const socket = io(process.env.SERVER_URL || "http://localhost:3001", {
  autoConnect: false
});
const CONNECTED = "CONNECTED";
const ERROR = "ERROR";
const READY = "READY";
const DEBUG_CONNECTION = "DEBUG_CONNECTION";
const initialState = {
  connected: false,
  error: {
    exists: false,
    message: ""
  },
  ready: false,
  debugConnection: ""
};

const connect = connected => ({
  type: CONNECTED,
  connected
});

const err = message => ({
  type: ERROR,
  error: {
    exists: true,
    message
  }
});

const ready = () => ({
  type: READY
});
const debugConnection = message => ({
  type: DEBUG_CONNECTION,
  message
});

export const createConnection = () => dispatch => {
  socket.connect();
  socket.on("connect", () => {
    dispatch(connect(socket.connected));
    console.log("SOCKET ", socket.connected);
    dispatch(debugConnection(socket.connected ? "CONNECTED" : "NOT_CONNECTED"));
  });
  dispatch(debugConnection("CONNECTING"));
};

export const disconnectListener = () => dispatch => {
  socket.on("disconnect", () => {
    dispatch(connect(socket.connected));
    dispatch(debugConnection(socket.connected ? "CONNECTED" : "NOT_CONNECTED"));
  });
};
export const readyToListen = initListeners => dispatch => {
  socket.on("ready", () => {
    dispatch(ready());
    socket.on("errorMessage", message => {
      dispatch(err(message));
    });
    socket.on("connect_error", ({ message }) => {
      dispatch(err(message));
    });
    socket.on("reconnect_error", ({ message }) => {
      dispatch(err(message));
    });
    initListeners();
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CONNECTED:
      return { ...state, connected: action.connected };
    case ERROR:
      return { ...state, error: action.error };
    case READY:
      return { ...state, ready: true };
    case DEBUG_CONNECTION:
      return { ...state, debugConnection: action.message };
    default:
      return state;
  }
};
