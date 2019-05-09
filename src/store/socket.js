import io from "socket.io-client";
export const socket = io(process.env.SERVER_URL || "http://localhost:3001");

const CONNECTED = "CONNECTED";
const ERROR = "ERROR";
const POTENTIAL_MATCHES = "POTENTIAL_MATCHES";
const GETTING_MATCHES = "GETTING_MATCHES";
const DID_MATCH_LISTENER = "DID_MATCH_LISTENER";
const DID_MATCH = "DID_MATCH";
const initialState = {
  connected: false,
  error: {
    exists: false,
    message: ""
  }
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
const gettingMatches = () => ({
  type: GETTING_MATCHES
});
const potentialMatches = () => ({
  type: POTENTIAL_MATCHES
});
const didMatch = () => ({
  type: DID_MATCH
});
export const createConnection = () => dispatch => {
  socket.on("connect", () => {
    dispatch(connect(socket.connected));
    console.log("SOCKET ", socket.connected);
  });
};

export const disconnectListener = () => dispatch => {
  socket.on("disconnect", () => {
    dispatch(connect(socket.connected));
    console.log("SOCKET ", socket.connected);
  });
};

export const errorListener = () => dispatch => {
  socket.on("errorMessage", message => {
    console.log(message);
    dispatch(err(message));
  });
};
export const potentialMatchesListener = () => dispatch => {
  socket.on("potentialMatches", data => {
    if (data.length) {
      socket.emit("swipe", { value: true, matchee: data[0].id });
      console.log(data);
    }
  });
  dispatch(gettingMatches());
};
export const didMatchListener = () => dispatch => {
  socket.on("didMatch", data => {
    console.log(data);
    dispatch(didMatch());
  });
};
export const haveIMatched = () => dispatch => {
  socket.emit("haveIMatched");
};
export const getPotentialMatches = () => dispatch => {
  socket.emit("getPotentialMatches");
  dispatch(potentialMatches());
};
export default (state = initialState, action) => {
  switch (action.type) {
    case CONNECTED:
      return { ...state, connected: action.connected };
    case ERROR:
      return { ...state, error: action.error };
    default:
      return state;
  }
};
