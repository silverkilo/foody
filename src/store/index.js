import { createStore, combineReducers, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import user from './user'
import categories from './categories'
import preferences from './preferences'
import matchlist from './match'
import socket from './socket'
import userMatchLatLong from './location'
import matchPreference from './matchPreference'

const reducer = combineReducers({
  user,
  categories,
  preferences,
  matchlist,
  userMatchLatLong,
  socket,
  matchPreference
})

const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
)

export const store = createStore(reducer, middleware)

export default store
export * from './user'
export * from './socket'
export * from './categories'
export * from './preferences'
