import axios from "axios";

const SET_USER_LATLONG = "SET_USER_LATLONG";
const GET_MATCH_LATLONG = "GET_MATCH_LATLONG";

const setUserLL = userLL => ({ type: SET_USER_LATLONG, userLL });
const getMatchLL = matchLL => ({ type: GET_MATCH_LATLONG, matchLL });

export const setUserLatLong = userLL => dispatch => {
  try {
    dispatch(setUserLL(userLL));
  } catch (err) {
    console.error(err);
  }
};

export const postLocation = ({
  coords: { longitude, latitude }
}) => async dispatch => {
  try {
    const { data } = await axios.post("/api/location", { longitude, latitude });
    dispatch(setUserLL(data.location.coordinates));
  } catch (e) {
    console.log(e);
  }
};

export const getMatchLatLong = userId => async dispatch => {
  try {
    let res = await axios.get(`/api/match/${userId}`);
    dispatch(getMatchLL(res.data));
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
    case SET_USER_LATLONG:
      return { ...state, user: action.userLL };
    case GET_MATCH_LATLONG:
      return { ...state, match: action.matchLL };
    default:
      return state;
  }
}
