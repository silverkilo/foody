const SET_VENUE_DETAILS = "SET_VENUE_DETAILS";

const setDetails = obj => ({
  type: SET_VENUE_DETAILS,
  obj
});

export const setVenueDetails = obj => dispatch => {
  try {
    dispatch(setDetails(obj));
  } catch (err) {
    console.error(err);
  }
};

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_VENUE_DETAILS:
      return {
        ...action.obj
      };
    default:
      return state;
  }
}
