import axios from 'axios'

const mapAccess = {
  mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
}
const SET_USER_HOOD = 'SET_USER_HOOD'

const setUserHood = hood => ({ type: SET_USER_HOOD, hood })

export const setUserNeighborhood = (long, lat) => async dispatch => {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?context=neighborhood?types=poi&access_token=${mapAccess.mapboxApiAccessToken}`
    const res = await axios.get(url)
    // .then(res => console.log(res))
    .then(res => dispatch(setUserHood(res.data.features[1].text)))
  } catch (err) {
    console.error(err)
  }
}

const initialState = 'Manhattan'

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER_HOOD:
      return action.hood
    default:
      return state
  }
}
