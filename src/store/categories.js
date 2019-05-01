import axios from 'axios'

const GET_CATEGORIES = 'GET_CATEGORIES'

const getCategories = categories => ({type: GET_CATEGORIES, categories})

export const getAllCategories = () => async dispatch => {
  try {
    const res = await axios.get(`/api/categories`)
    dispatch(getCategories(res.data))
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
