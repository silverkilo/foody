import axios from 'axios'

const SET_USER_LATLONG = 'SET_USER_LATLONG'
const GET_MATCH_LATLONG = 'GET_MATCH_LATLONG'

const setUserLL = userLL => ({ type: SET_USER_LATLONG, userLL})
const getMatchLL = matchLL => ({ type: GET_MATCH_LATLONG, matchLL })


export const setUserLatLong = (userLL) => async dispatch => {
  try {
    dispatch(setUserLL(userLL))
  } catch (err) {
    console.error(err)
  }
}

export const getMatchLatLong = (userId) => async dispatch => {
  try {
    let res = await axios.get(`/api/match/${userId}`)
    dispatch(getMatchLL(res.data))
  } catch (err) {
    console.error(err)
  }
}

const initialState = {
  user: [40.712, -74.006],
  match: [40.712, -74.006]
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER_LATLONG:
      return {...state, user: action.useLL}
    case GET_MATCH_LATLONG:
      return {...state, match: action.matchLL}
    default:
      return state
  }
}
