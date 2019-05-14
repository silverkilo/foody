import { socket } from "./socket";
const SELECT_RESTAURANT = "SELECT_RESTAURANT";
const DESELECT_RESTAURANT = "DESELECT_RESTAURANT";
const DECIDE_RESTAURANT = "DECIDE_RESTAURANT";

const selectRestaurant = restaurantId => ({
  type: SELECT_RESTAURANT,
  restaurantId
});

const deselectRestaurant = restaurantId => ({
  type: DESELECT_RESTAURANT,
  restaurantId
});

const decideRestaurant = restaurantId => ({
  type: DECIDE_RESTAURANT,
  restaurantId
});

export const createVenueList = () => {
  socket.emit("start-choosing-res");
};

export const select = restaurantId => dispatch => {
  try {
    socket.emit("send-client-res", restaurantId);
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

export const decide = restaurantId => dispatch => {
  try {
    console.log("we went into decide", restaurantId);
    dispatch(decideRestaurant(restaurantId));
  } catch (err) {
    console.error(err);
  }
};

export const resListener = () => dispatch => {
  socket.on("matched", restaurantId => {
    console.log("we went into listener", restaurantId);
    dispatch(decide(restaurantId));
  });
};

export function food(state = [], action) {
  switch (action.type) {
    case SELECT_RESTAURANT:
      return [...state, action.restaurantId];
    case DESELECT_RESTAURANT:
      return state.filter(id => id !== action.restaurantId);
    default:
      return state;
  }
}
export function selectedRestaurant(state = null, action) {
  switch (action.type) {
    case DECIDE_RESTAURANT:
      return action.restaurantId;
    default:
      return state;
  }
}
