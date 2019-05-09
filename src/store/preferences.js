import axios from "axios";

const ADD_PREFERENCE = "ADD_PREFERENCE";
const REMOVE_PREFERENCE = "REMOVE_PREFERENCE";
const SEND_PREFERENCES = "SEND_PREFERENCES";

export const addPreference = preference => ({
  type: ADD_PREFERENCE,
  preference
});
export const removePreference = preference => ({
  type: REMOVE_PREFERENCE,
  preference
});
const sendPreferences = () => ({ type: SEND_PREFERENCES });

export const sendUserPreference = (id, preferences) => async dispatch => {
  try {
    await axios.post(`/api/preferences/`, { preferences });
    dispatch(sendPreferences());
  } catch (err) {
    console.error(err);
  }
};

const initialState = [];

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_PREFERENCE:
      for (let preference of state) {
        if (preference.id === action.preference.id) {
          return state;
        }
      }
      return [...state, action.preference];
    case REMOVE_PREFERENCE:
      return state.filter(preference => preference.id !== action.preference.id);
    case SEND_PREFERENCES:
      return initialState;
    default:
      return state;
  }
}
