import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;
const initialState = {
  loading: false,
  userInfo: userInfoFromStorage,
  error: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.userInfo = null;
      state.error = null;
    },
    setUserInfo: (state, { payload }) => {
      state.loading = false;
      state.userInfo = payload;
      state.error = null;
    },
    setError: (state, { payload }) => {
      state.loading = false;
      state.userInfo = null;
      state.error = payload;
    },
    reset: (state) => {
      state.loading = false;
      state.userInfo = null;
      state.error = null;
    },
  },
});

const { setLoading, setUserInfo, setError, reset } = loginSlice.actions;

export const loginSelector = (state) => state.login;

export default loginSlice.reducer;

export const loginUser = (email, password) => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    const { data } = await axios.post(
      `http://localhost:3000/api/auth//loginforSuperAdmin`,
      {
        email,
        password,
      }
    );
    dispatch(setUserInfo(data));
    localStorage.setItem("userInfo", JSON.stringify(getState().login.userInfo));
  } catch (error) {
    const errorMessage =
      error.response && error.response.data
        ? error.response.data
        : error.message;
    dispatch(setError(errorMessage));
  }
};
export const addUserInfo = (userInfo) => async (dispatch, getState) => {
  dispatch(setUserInfo(userInfo));
  localStorage.setItem("userInfo", JSON.stringify(getState().login.userInfo));
};

export const logoutUser = () => async (dispatch) => {
  dispatch(reset());
  localStorage.clear();
};
