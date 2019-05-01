import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import userReducer from './user'
import categoriesReducer from './categories'
import preferencesReducer from './preferences'

const reducer = combineReducers({
  user: userReducer,
  categories: categoriesReducer,
  preferences: preferencesReducer

})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)

export const store = createStore(reducer, middleware)

export default store
