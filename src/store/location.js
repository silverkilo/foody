import axios from "axios";

const SET_USER_LOC = "SET_USER_LOC";
const GET_MATCH_LOC = "GET_MATCH_LOC";

const setUserLoc = location => ({ type: SET_USER_LOC, location });
const getMatchLoc = location => ({ type: GET_MATCH_LOC, location });

export const setUserLocation = location => setUserLoc(location);

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

export const getMatchLocation = () => (dispatch, getState) => {
  try {
    // let res = await axios.get(`/api/match/${userId}`);
    // dispatch(getMatchLoc(res.data));
    const { location } = getState().match.didMatch.info;
    dispatch(getMatchLoc(location.coordinates));
  } catch (err) {
    console.error(err);
  }
};

const initialState = {
  user: [-74.006, 40.712],
  match: [-74.006, 40.712]
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER_LOC:
      return { ...state, user: action.location };
    case GET_MATCH_LOC:
      return { ...state, match: action.location };
    default:
      return state;
  }
}
