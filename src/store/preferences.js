import axios from 'axios'

const SET_PREFERENCES = 'SET_PREFERENCES'

const sendPreferences = preferences => ({type: SET_PREFERENCES, preferences})

export const sendUserPreference = (id, preferences) => async dispatch => {
  try {
    const res = await axios.post(`/api/preferences/${id}`, {preferences})
    dispatch(sendPreferences(res.data))
  } catch (err) {
    console.error(err)
  }
}

const initialState = []

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_PREFERENCES:
      return action.preferences
    default:
      return state
  }
}
