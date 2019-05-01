import axios from 'axios'

const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'
const UPDATE_USER = 'UPDATE_USER'

const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})
const updateUser = userInfo => ({type: UPDATE_USER, userInfo})

export const me = userId => async dispatch => {
  try {
    const res = await axios.get('/auth/me')
    dispatch(getUser(res.data || initialState))
  } catch (err) {
    console.error(err)
  }
}

export const auth = (
  firstName,
  lastName,
  email,
  password,
  method
) => async dispatch => {
  try {
    await axios.post(`/auth/${method}`, {
      firstName,
      lastName,
      email,
      password
    })
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
    dispatch(updateUser(userInfo))
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
    default:
      return state
  }
}
