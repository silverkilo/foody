import { createStore, combineReducers, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import user from "./user";
import categories from "./categories";
import preferences from "./preferences";
import match from "./match";
import socket from "./socket";
import userMatchLatLong from "./location";
import matchPreference from "./matchPreference";
import food from "./food";
import selectedIdx from "./highlight";
import chatHistory from "./chat";
import icon from "./icon";

const reducer = combineReducers({
  user,
  categories,
  preferences,
  match,
  userMatchLatLong,
  socket,
  matchPreference,
  food,
  selectedIdx,
  chatHistory,
  icon
});

const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);

export const store = createStore(reducer, middleware);

export default store;
export * from "./user";
export * from "./socket";
export * from "./categories";
export * from "./preferences";
export * from "./food";
export * from "./match";
export * from "./chat";
export * from "./location";
