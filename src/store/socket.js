import io from "socket.io-client";
export const socket = io(
  // process.env.NODE_ENV === "production"
  //   ? `https://${window.location.host}`
  //   : `http://${window.location.hostname}:3001`,
  {
    autoConnect: false,
    secure: process.env.NODE_ENV === "production",
    host: window.location.host,
    rejectUnauthorized: false
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

export const createConnection = () => async dispatch => {
  socket.open();
  return await new Promise(resolve => {
    socket.on("connect", () => {
      dispatch(connect(socket.connected));
      resolve(socket.connected);
    });
    socket.on("disconnect", () => {
      dispatch(connect(socket.connected));
    });
  });
};

export const readyToListen = () => dispatch => {
  return new Promise(resolve => {
    socket.on("ready", val => {
      dispatch(ready());
      resolve(val);
      socket.on("errorMessage", message => {
        dispatch(err(message));
      });
      socket.on("connect_error", ({ message }) => {
        dispatch(err(message));
      });
      socket.on("reconnect_error", ({ message }) => {
        dispatch(err(message));
      });
    });
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CONNECTED:
      return {
        ...state,
        connected: action.connected
      };
    case ERROR:
      return {
        ...state,
        error: action.error
      };
    case READY:
      return {
        ...state,
        ready: true
      };
    default:
      return state;
  }
};
