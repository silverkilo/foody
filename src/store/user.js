import axios from 'axios'

const GET_USER = 'GET_USER'

const getUser = user => ({type: GET_USER, user})

export const me = userId => async dispatch => {
  try {
    const res = await axios.get(`/api/users/${userId}`)
    dispatch(getUser(res.data || initialState))
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
