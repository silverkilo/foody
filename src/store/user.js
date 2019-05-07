import axios from 'axios'

const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'
const UPDATE_NAME = 'UPDATE_NAME'
const UPDATE_PASSWORD = 'UPDATE_PASSWORD'

const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})
const updateUserName = userInfo => ({type: UPDATE_NAME, userInfo})
const updateUserPassword = userInfo => ({type: UPDATE_PASSWORD, userInfo})

export const me = userId => async dispatch => {
  try {
    const res = await axios.get('/auth/me')
    dispatch(getUser(res.data || initialState))
  } catch (err) {
    console.error(err)
  }
}

export const auth = (email, password, method) => async dispatch => {
  try {
    const res = await axios.post(`/auth/${method}`, {
      email,
      password
    })
    const res2 = await axios.post('/auth/login', {
      email: res.data.email,
      password: 'temp'
    })
    dispatch(getUser(res2.data))
  } catch (authError) {
    return dispatch(getUser({error: authError}))
  }
}
export const login = (email, password, method) => async dispatch => {
  try {
    const res = await axios.post(`/auth/${method}`, {
      email,
      password
    })
    dispatch(getUser(res.data))
  } catch (authError) {
    return dispatch(getUser({error: authError}))
  }
}

export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout')
    dispatch(removeUser())
  } catch (err) {
    console.error(err)
  }
}

export const updateUserThunk = (userId, userInfo) => async dispatch => {
  try {
    await axios.put(`/api/users/${userId}`, userInfo)
    if (userInfo.firstName && userInfo.lastName) {
      dispatch(updateUserName(userInfo))
    } else if (userInfo.password) {
      dispatch(updateUserPassword(userInfo))
    }
  } catch (err) {
    console.error(err)
  }
}

const initialState = {}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_USER:
      return action.user
    case REMOVE_USER:
      return initialState
    case UPDATE_NAME:
      return {
        ...state,
        firstName: action.userInfo.firstName,
        lastName: action.userInfo.lastName
      }
    case UPDATE_PASSWORD:
      return {
        ...state,
        password: action.userInfo.password
      }
    default:
      return state
  }
}
