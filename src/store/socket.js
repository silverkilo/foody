import io from "socket.io-client";
export const socket = io(
  `http://${window.location.hostname}${
    process.env.NODE_ENV === "production" ? "" : ":3001"
  }`,
  {
    autoConnect: false
  }
);
const CONNECTED = "CONNECTED";
const ERROR = "ERROR";
const READY = "READY";
const initialState = {
  connected: false,
  error: {
    exists: false,
    message: ""
  },
  ready: false
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

export const createConnection = () => dispatch => {
  socket.open();
  socket.on("connect", () => {
    dispatch(connect(socket.connected));
    console.log("SOCKET ", socket.connected);
  });
};

export const disconnectListener = () => dispatch => {
  socket.on("disconnect", () => {
    dispatch(connect(socket.connected));
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
    default:
      return state;
  }
};
