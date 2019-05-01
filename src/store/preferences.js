import axios from 'axios'

const SEND_PREFERENCES = 'SEND_PREFERENCES'

const sendPreferences = preferences => ({type: SEND_PREFERENCES, preferences})

export const sendUserPreference = (id, preference) => async dispatch => {
  try {
    const res = await axios.post(`/api/preference`)
    dispatch(sendPreferences(res.data))
  } catch (err) {
    console.error(err)
  }
}

const initialState = []

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_CATEGORIES:
      return action.categories
    default:
      return state
  }
}
