import axios from 'axios'

const GET_USER = 'GET_USER'
const UPDATE_USER = 'UPDATE_USER'
const GET_CATEGORIES = 'GET_CATEGORIES'

const getUser = user => ({type: GET_USER, user})
const updateUser = userInfo => ({type: UPDATE_USER, userInfo})
const updatePreference = userInfo => ({type: UPDATE_USER, userInfo})

export const me = userId => async dispatch => {
  try {
    const res = await axios.get(`/api/users/${userId}`)
    dispatch(getUser(res.data || initialState))
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
    default:
      return state
  }
}


