import { createStore, combineReducers, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import user from "./user";
import categories from "./categories";
import preferences from "./preferences";
import match from "./match";
import socket from "./socket";
import location from "./location";
import matchPreference from "./matchPreference";
import selectedIdx from "./highlight";
import chatHistory from "./chat";
import icon from "./icon";
import upload from "./upload";
import { food } from "./food";
import { selectedRestaurant } from "./food";

const appReducer = combineReducers({
  user,
  categories,
  preferences,
  match,
  location,
  socket,
  matchPreference,
  food,
  selectedIdx,
  chatHistory,
  icon,
  selectedRestaurant,
  upload
});

const rootReducer = (state, action) => {
  if (action.type === "REMOVE_USER") {
    state = undefined;
  }
  return appReducer(state, action);
};
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);

export const store = createStore(rootReducer, middleware);

export default store;
export * from "./user";
export * from "./socket";
export * from "./categories";
export * from "./preferences";
export * from "./food";
export * from "./match";
export * from "./chat";
export * from "./location";
export * from "./upload";
