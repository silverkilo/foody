const SET_SELECTED_IDX = "SET_SELECTED_IDX";

const setIdx = idx => ({ type: SET_SELECTED_IDX, idx });

export const setSelectedIdx = idx => async dispatch => {
  try {
    dispatch(setIdx(idx));
  } catch (err) {
    console.error(err);
  }
};

export default function(state = 0, action) {
  switch (action.type) {
    case SET_SELECTED_IDX:
      return action.idx;
    default:
      return state;
  }
}
