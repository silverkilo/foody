function randomIcon() {
  return Math.floor(Math.random() * 8) + 1;
}

const SET_ICON_IMG = "SET_ICON_IMG";

const setIcon = (num1, num2) => ({ type: SET_ICON_IMG, num1, num2 });

export const setIconImg = num => dispatch => {
  try {
    dispatch(setIcon(randomIcon(), randomIcon()));
  } catch (err) {
    console.error(err);
  }
};

const initialState = {
  // icon1: num,
  // icon2: num
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ICON_IMG:
      return { icon1: action.num1, icon2: action.num2 };
    default:
      return state;
  }
}
