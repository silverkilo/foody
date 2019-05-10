import { socket } from "./socket";
const SWIPE = "SWIPE";
const POTENTIAL_MATCHES = "POTENTIAL_MATCHES";
const DID_MATCH = "DID_MATCH";

const initialState = {
  didMatch: null,
  potentials: []
};

const potentialMatches = data => ({
  type: POTENTIAL_MATCHES,
  data
});
const didMatch = match => ({
  type: DID_MATCH,
  match
});

const swiped = (value, matchee) => ({
  type: SWIPE,
  value,
  matchee
});
export const swipe = (value, matchee) => {
  socket.emit("swipe", { value, matchee });
  return swiped(value, matchee);
};

export const initListeners = () => dispatch => {
  socket.on("didMatch", data => {
    dispatch(didMatch(data));
  });
  socket.emit("haveIMatched");
  socket.on("potentialMatches", data => {
    dispatch(potentialMatches(data));
  });

  socket.emit("getPotentialMatches");
};

export default (state = initialState, action) => {
  switch (action.type) {
    case DID_MATCH:
      return { ...state, didMatch: action.match };
    case POTENTIAL_MATCHES:
      return { ...state, potentials: action.data };
    default:
      return state;
  }
};
