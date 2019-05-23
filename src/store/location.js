import axios from "axios";
import { socket } from "./socket";

const SET_USER_LOC = "SET_USER_LOC";
const GET_MATCH_LOC = "GET_MATCH_LOC";
const LOADING_LOC = "LOADING_LOC";

const setUserLoc = location => ({ type: SET_USER_LOC, location });
const getMatchLoc = location => ({ type: GET_MATCH_LOC, location });
const loadingLoc = () => ({ type: LOADING_LOC });
export const setUserLocation = location => (dispatch, getState) => {
  if (getState().match.didMatch.match) socket.emit("setUserLocation", location);
  dispatch(setUserLoc(location));
};

export const postLocation = ({
  coords: { longitude, latitude }
}) => async dispatch => {
  try {
    const { data } = await axios.post("/api/location", { longitude, latitude });
    dispatch(setUserLoc(data.location.coordinates));
  } catch (e) {
    console.log(e);
  }
};

export const getMatchLocation = () => async dispatch => {
  try {
    dispatch(loadingLoc());
    return await new Promise(resolve => {
      let timeout = setTimeout(() => {
        socket.emit("getMatchLocation");
      }, 3000);
      socket.on("matchLocation", location => {
        dispatch(getMatchLoc(location));
        resolve(location);
        clearTimeout(timeout);
      });
    });
  } catch (err) {
    console.error(err);
  }
};

const initialState = {
  user: [-74.006, 40.712],
  match: [-74.006, 40.712],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER_LOC:
      return { ...state, user: action.location };
    case GET_MATCH_LOC:
      return { ...state, match: action.location, loading: false };
    case LOADING_LOC:
      return { ...state, loading: true };
    default:
      return state;
  }
}
