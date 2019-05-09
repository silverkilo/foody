import axios from "axios";

const GET_ALL_MATCH_LIST = "GET_ALL_MATCH_LIST";

const getList = array => ({ type: GET_ALL_MATCH_LIST, array });

export const getAllMatchList = userId => async dispatch => {
  try {
    const res = await axios.get(`/api/match/${userId}`);
    dispatch(getList(res.data));
  } catch (err) {
    console.error(err);
  }
};

export const sendYesUser = (userId, yesUserId) => async dispatch => {
  try {
    const res = await axios.post(`/api/match/yes/${userId}/${yesUserId}`);
  } catch (err) {
    console.error(err);
  }
};

const initialState = [];

export default function matchlist(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_MATCH_LIST:
      return action.array;
    default:
      return state;
  }
}
