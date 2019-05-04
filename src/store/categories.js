import axios from 'axios'

const GET_CATEGORIES = 'GET_CATEGORIES'
const ADD_CATEGORIES = 'ADD_CATEGORIES'
const DELETE_CATEGORIES = 'DELETE_CATEGORIES'

const getCategories = categories => ({ type: GET_CATEGORIES, categories })
const addCategories = category => ({
  type: ADD_CATEGORIES,
  category
})
const deleteCategory = id => ({ type: DELETE_CATEGORIES, id })

export const getAllCategories = () => async dispatch => {
  try {
    const res = await axios.get(`/api/categories`)
    dispatch(getCategories(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const postNewCategories = category => async dispatch => {
  try {
    // const res1 = await axios.get(`/api/categories/`) 
    const { data } = await axios.post(`/api/categories/`, { category })
    dispatch(addCategories(data))
  } catch (err) {
    console.error(err)
  }
}

export const deleteCategories = ({ id }) => async dispatch => {
  try {
    await axios.delete(`/api/categories/${id}`)
    dispatch(deleteCategory(id))
  } catch (err) {
    console.error(err)
  }
}

const initialState = []

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_CATEGORIES:
      return action.categories
    case ADD_CATEGORIES:
      return [...state, action.category]
    case DELETE_CATEGORIES:
      return [...state].filter(preference => preference.id !== action.id)
    default:
      return state
  }
}
