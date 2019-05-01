import axios from 'axios'

const GET_CATEGORIES = 'GET_CATEGORIES'
const ADD_CATEGORIES = 'ADD_CATEGORIES'
const DELETE_CATEGORIES = 'DELETE_CATEGORIES'

const getCategories = categories => ({type: GET_CATEGORIES, categories})
const addCategories = (existingCategories, newCategory) => ({
  type: ADD_CATEGORIES,
  existingCategories,
  newCategory
})
const deleteCategory = (category) => ({ type: DELETE_CATEGORIES, category })

export const getAllCategories = () => async dispatch => {
  try {
    const res = await axios.get(`/api/categories`)
    dispatch(getCategories(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const postNewCategories = (newCategory) => async dispatch => {
  try {
    const res1 = await axios.get(`/api/categories/`)
    const res2 = await axios.post(`/api/categories/`, newCategory)
    dispatch(addCategories(res1.date, res2.data))
  } catch (err) {
    console.error(err)
  }
}

export const deleteCategories = name => async dispatch => {
  try {
    await axios.delete(`/api/categories/${name}`)
    dispatch(deleteCategory(name))
  } catch (err) {
    console.error(err)
  }
}

const initialState = []

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_CATEGORIES:
      return action.categories
    case ADD_CATEGORIES:
      return [...action.existingCategories, action.newCategory]
    case DELETE_CATEGORIES:
      return [...state].filter(x => x !== action.category)
    default:
      return state
  }
}
