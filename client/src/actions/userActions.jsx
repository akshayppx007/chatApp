import axios from "axios";
import { CLEAR_ERRORS, LOAD_USER_FAILURE, LOAD_USER_REQUEST, LOAD_USER_SUCCESS, LOGIN_USER_FAILURE, LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGOUT_USER_FAILURE, LOGOUT_USER_SUCCESS, REGISTER_USER_FAILURE, REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS } from "../constants/userConstants";


// register user
export const registerUser = (userData) => async (dispatch) => {
	try {
		dispatch({ type: REGISTER_USER_REQUEST });

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		};

		const { data } = await axios.post("/api/v1/register", userData, config);

		dispatch({ type: REGISTER_USER_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: REGISTER_USER_FAILURE,
			payload: error.response.data.message,
		});
	}
};

// logout user
export const logoutUser = () => async (dispatch) => {
	try {

		const config = {
			withCredentials: true,
		};

		const { data } = await axios.get("/api/v1/logout", config);

		dispatch({ type: LOGOUT_USER_SUCCESS, payload: data.message });
	} catch (error) {
		dispatch({
			type: LOGOUT_USER_FAILURE,
			payload: error.response.data.message,
		});
	}
};

// login user
export const loginUser = (email, password) => async (dispatch) => {
	try {
		dispatch({
			type: LOGIN_USER_REQUEST,
		});

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		};
		const { data } = await axios.post(
			"/api/v1/login",
			{
				email,
				password,
			},
			config
		);

		dispatch({ type: LOGIN_USER_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: LOGIN_USER_FAILURE,
			payload: error.response.data.message,
		});
	}
};

// get user profile
export const getUserProfile = () => async (dispatch) => {
	try {
		dispatch({
			type: LOAD_USER_REQUEST,
		});

		const { data } = await axios.get("/api/v1/profile");

		dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
	} catch (error) {
		dispatch({
			type: LOAD_USER_FAILURE,
			payload: error.response.data.message,
		});
	}
};



// clear errors
export const clearErrors = () => async (dispatch) => {
	dispatch({
		type: CLEAR_ERRORS,
	});
};