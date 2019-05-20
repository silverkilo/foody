import { socket } from "./socket";
import Axios from "axios";
const SELECT_RESTAURANT = "SELECT_RESTAURANT";
const DESELECT_RESTAURANT = "DESELECT_RESTAURANT";
const DECIDE_RESTAURANT = "DECIDE_RESTAURANT";
const NOTIFY = "NOTIFY";

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

const notify = () => ({
  type: NOTIFY,
  toggle: true
});

export const createVenueList = () => dispatch => {
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
    dispatch(decideRestaurant(restaurantId));
  } catch (err) {
    console.error(err);
  }
};

export const notifyArrival = () => dispatch => {
  try {
    socket.emit("send-arrival-signal");
  } catch (err) {
    console.error(err);
  }
};

export const resListener = () => dispatch => {
  socket.on("matched", restaurantId => {
    console.log("resId in reslistener on res front end", restaurantId);
    dispatch(decide(restaurantId));
  });
  socket.on("arrived", () => {
    dispatch(notify());
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

export function arrivalStatus(state = false, action) {
  switch (action.type) {
    case NOTIFY:
      return action.toggle;
    default:
      return state;
  }
}
