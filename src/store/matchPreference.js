import axios from "axios";

const MATCH_PREFERENCE = "MATCH_PREFERENCE";

const matchPreference = preference => ({ type: MATCH_PREFERENCE, preference });

export const getMatchPreference = userId => async dispatch => {
  try {
    // add a line to get the matched prefences
    dispatch(matchPreference());
  } catch (err) {
    console.error(err);
  }
};

export default function(state = [], action) {
  switch (action.type) {
    case MATCH_PREFERENCE:
      return action.preference;
    default:
      return state;
  }
}
