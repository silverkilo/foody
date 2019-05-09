const SELECTED_RESTAURANT = 'SELECTED_RESTAURANT'

const selectFood = restaurantId => ({ type: SELECTED_RESTAURANT, restaurantId})

export const setFood = (restaurantId) => dispatch => {
  try {
    console.log("id", restaurantId)
    dispatch(selectFood(restaurantId))
  } catch (err) {
    console.error(err)
  }
}

export default function(state = [], action) {
  switch (action.type) {
    case SELECTED_RESTAURANT:
      return state.concat(action.restaurantId)
    default:
      return state
  }
}
