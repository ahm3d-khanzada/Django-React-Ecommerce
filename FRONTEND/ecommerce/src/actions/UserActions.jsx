import axios from "axios";
import {
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_SIGNIN_FAIL,
  USER_LOGOUT,
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAIL,
  USER_FORGOT_PASSWORD_REQUEST,
  USER_FORGOT_PASSWORD_SUCCESS,
  USER_FORGOT_PASSWORD_FAIL,
  USER_PASSWORD_RESET_REQUEST,
  USER_PASSWORD_RESET_SUCCESS,
  USER_PASSWORD_RESET_FAIL,
} from "../constants/UserConstants";

// Signup Action
export const signup = (fname, lname, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_SIGNUP_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `http://127.0.0.1:8000/api/users/register/`,
      {
        fname: fname,
        lname: lname,
        email: email,
        password: password,
      },
      config
    );

    dispatch({
      type: USER_SIGNUP_SUCCESS,
      payload: data,
    });

    // Optionally: show an activation message or route to another page
  } catch (error) {
    dispatch({
      type: USER_SIGNUP_FAIL,
      payload:
        error.response && error.response.data.details
          ? error.response.data.details
          : error.message,
    });
  }
};

// Signin Action
export const signin = (username, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_SIGNIN_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `http://127.0.0.1:8000/api/users/login/`,
      { username, password },
      config
    );

    dispatch({
      type: USER_SIGNIN_SUCCESS,
      payload: data,
    });

    // Save user info and tokens in localStorage
    localStorage.setItem("userInfo", JSON.stringify(data));
    localStorage.setItem("accessToken", data.access);  // JWT access token
    localStorage.setItem("refreshToken", data.refresh); // JWT refresh token

  } catch (error) {
    dispatch({
      type: USER_SIGNIN_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// Logout Action
export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("accessToken"); // Clear access token
  localStorage.removeItem("refreshToken"); // Clear refresh token
  dispatch({ type: USER_LOGOUT });
};

// Forgot Password Action
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: USER_FORGOT_PASSWORD_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      `http://127.0.0.1:8000/api/users/send-reset-password-email/`,
      { email },
      config
    );

    dispatch({
      type: USER_FORGOT_PASSWORD_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_FORGOT_PASSWORD_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// Reset Password Action
export const resetPassword = (uid, token, password) => async (dispatch) => {
  try {
      dispatch({ type: USER_PASSWORD_RESET_REQUEST });

      const config = {
          headers: {
              'Content-Type': 'application/json',
          },
      };

      const { data } = await axios.post(`http://127.0.0.1:8000/api/users/reset-password/${uid}/${token}/`, { password, password2: password }, config);

      dispatch({ type: USER_PASSWORD_RESET_SUCCESS, payload: data });
  } catch (error) {
      dispatch({
          type: USER_PASSWORD_RESET_FAIL,
          payload: error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
      });
  }
};