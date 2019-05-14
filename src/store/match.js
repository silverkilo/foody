import { socket } from "./socket";
const SWIPE = "SWIPE";
const POTENTIAL_MATCHES = "POTENTIAL_MATCHES";
const DID_MATCH = "DID_MATCH";
const LOADING = "LOADING";
const initialState = {
  didMatch: { matched: false },
  potentials: [],
  loading: false
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
let timeout;
export const swipe = (value, matchee, matched, fetchMore) => dispatch => {
  if (value !== undefined) socket.emit("swipe", { value, matchee, matched });
  if (value === undefined || fetchMore) {
    socket.emit("getPotentialMatches");
    timeout = new Promise(resolve => {
      setTimeout(() => {
        dispatch(loading(true));
        resolve();
      }, 250);
    });
  }
  return dispatch(swiped(value, matchee));
};

export const matchListeners = resolveAppStart => dispatch => {
  socket.on("haveYouMatched", data => {
    if (data.matched) {
      dispatch(didMatch(data));
      resolveAppStart();
    } else {
      socket.on("didMatch", data => {
        dispatch(didMatch(data));
      });
      socket.on("potentialMatches", async data => {
        await timeout;
        dispatch(potentialMatches(data));
        dispatch(loading(false));
      });

      socket.emit("getPotentialMatches");
      resolveAppStart();
    }
  });
  socket.emit("haveIMatched");
};

export const loading = value => ({ type: LOADING, value });
export default (state = initialState, action) => {
  switch (action.type) {
    case DID_MATCH:
      return { ...state, didMatch: action.match };
    case POTENTIAL_MATCHES:
      return { ...state, potentials: action.data.reverse() };
    case LOADING:
      return { ...state, loading: action.value };
    case SWIPE:
      return {
        ...state
        // potentials: state.potentials.filter(user => user.id !== action.matchee)
      };
    default:
      return state;
  }
};
