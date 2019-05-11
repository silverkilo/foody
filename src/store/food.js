const SELECT_RESTAURANT = "SELECT_RESTAURANT";
const DESELECT_RESTAURANT = "DESELECT_RESTAURANT";

const selectRestaurant = restaurantId => ({
  type: SELECT_RESTAURANT,
  restaurantId
});

const deselectRestaurant = restaurantId => ({
  type: DESELECT_RESTAURANT,
  restaurantId
});

export const select = restaurantId => dispatch => {
  try {
    dispatch(selectRestaurant(restaurantId));
  } catch (err) {
    console.error(err);
  }
};
export const deselect = restaurantId => dispatch => {
  try {
    dispatch(deselectRestaurant(restaurantId));
  } catch (err) {
    console.error(err);
  }
};
let initialState = [];

export default function(state = initialState, action) {
  switch (action.type) {
    case SELECT_RESTAURANT:
      return [...state, action.restaurantId];
    case DESELECT_RESTAURANT:
      return state.filter(id => id !== action.restaurantId);
    default:
      return state;
  }
}
