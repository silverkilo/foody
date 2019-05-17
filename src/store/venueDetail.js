const SET_VENUE_DETAILS = "SET_VENUE_DETAILS";

const setDetails = obj => ({ type: SET_VENUE_DETAILS, obj });

export const setVenueDetails = obj => dispatch => {
  try {
    dispatch(setDetails(obj));
  } catch (err) {
    console.error(err);
  }
};

const initialState = {
  // name: t(venue, "name").safeObject,
  // address: t(venue, "location.address").safeObject,
  // city: t(venue, "location.city").safeObject,
  // state: t(venue, "location.state").safeObject,
  // price: t(venue, "price.tier").safeObject,
  // currency: t(venue, "price.currency").safeObject,
  // rating: t(venue, "rating").safeObject,
  // categories: t(venue, "categories[0].shortName").safeObject,
  // photo: t(venue, "bestPhoto").safeObject
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_VENUE_DETAILS:
      return action.obj;
    default:
      return state;
  }
}
