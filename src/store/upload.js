import axios from "axios";

const UPLOADING = "UPLOADING";
const UPLOAD_SUCCESS = "UPLOAD_SUCCESS";
const UPLOAD_FAIL = "UPLOAD_FAIL";

const uploading = () => ({ type: UPLOADING });
const uploadSuccess = data => ({
  type: UPLOAD_SUCCESS,
  data
});
const uploadFail = error => ({
  type: UPLOAD_FAIL,
  error
});

export const uploadPhoto = photo => async dispatch => {
  try {
    dispatch(uploading());
    const file = new FormData();
    file.append("file", photo);
    file.append("name", "photo");
    file.append("description", "description");
    const { data } = axios.post("/api/photos", file);
    dispatch(uploadSuccess(data));
  } catch (e) {
    dispatch(uploadFail(e));
  }
};
const initialState = {
  data: null,
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPLOADING:
      return state;
    case UPLOAD_SUCCESS:
      return { ...state, data: action.data };
    case UPLOAD_FAIL:
      return { ...state, error: action.error };
    default:
      return state;
  }
}
